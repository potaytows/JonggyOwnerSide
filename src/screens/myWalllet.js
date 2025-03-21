import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, StyleSheet, StatusBar, FlatList, ScrollView, TextInput, ActivityIndicator, TouchableOpacity, Image, Button, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { CommonActions } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
const apiheader = process.env.EXPO_PUBLIC_apiURI;
import moment from 'moment-timezone';
import Text from '../components/Text';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';


const MyWalletScreen = ({ navigation, route }) => {
    const [isLoading, setLoading] = useState(false);
    const [reservationList, setReservationList] = useState([]);
    const [wallets, setWallet] = useState(null);
    const [selectedTab, setSelectedTab] = useState('reservations');
    const [summary, setSummary] = useState({
        dailyIncome: 0,
        dailyExpense: 0,
        monthlyIncome: 0,
        monthlyExpense: 0,
    });
    const [otherIncome, setOtherIncome] = useState('');
    const [cost, setCost] = useState('');
    const [viewMode, setViewMode] = useState('daily'); // 'daily' หรือ 'monthly'

    const loadReservations = async () => {
        setLoading(true);

        try {
            const response = await axios.get(apiheader + '/reservation/getReservationByRestaurantID/' + route.params.restaurant_id);
            const result = await response.data;
            setReservationList(result);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    const wallet = async () => {
        setLoading(true);

        try {
            const responses = await axios.get(apiheader + '/wallet/getwallet/' + route.params.restaurant_id);
            const results = await responses.data;
            setWallet(results);
            const summary = calculateSummary(results.wallet.transactions, results.wallet.withdrawals);
            setSummary(summary);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            loadReservations();
            wallet();
        }, [])
    );

    const handleButtonPress = (reservation) => {
        if (reservation.status === "เสร็จสิ้นแล้ว") {
            navigation.navigate('location', {
                reservation: reservation,
                restaurant_id: route.params.restaurant_id
            });
        } else {
            navigation.navigate('orderList', { reservation: reservation });
        }
    };
    const handleButtonBank = () => {
        navigation.navigate('bankAccount', { restaurant_id: route.params.restaurant_id, wallets: wallets })
    };
    const calculateSummary = (transactions, withdrawals) => {
        const today = moment().startOf('day');
        const startOfMonth = moment().startOf('month');

        let dailyIncome = 0;
        let dailyExpense = 0;
        let monthlyIncome = 0;
        let monthlyExpense = 0;

        // คำนวณรายรับและรายจ่ายในวันนี้
        transactions.forEach(transaction => {
            if (moment(transaction.date).isSame(today, 'day')) {
                dailyIncome += transaction.amount;
                monthlyIncome += transaction.amount;
            }
            if (moment(transaction.date).isSameOrAfter(startOfMonth, 'month')) {
                monthlyIncome += transaction.amount;
            }
        });

        withdrawals.forEach(withdrawal => {
            if (moment(withdrawal.date).isSame(today, 'day')) {
                dailyExpense += withdrawal.amount;
                monthlyExpense += withdrawal.amount;
            }
            if (moment(withdrawal.date).isSameOrAfter(startOfMonth, 'month')) {
                monthlyExpense += withdrawal.amount;
            }
        });

        return {
            dailyIncome,
            dailyExpense,
            monthlyIncome,
            monthlyExpense,
        };
    };
    const addTotalSummary = async (restaurantId, totalsummary) => {
        Alert.alert(
            "ต้องการบันทึกยอดขายหรือไม่",
            "ยอดขายของคุณจะถูกบันทึกเพื่อนำไปคำนวนยอดขายรายเดิน",
            [
                {
                    text: "ยกเลิก",
                    style: "cancel"
                },
                {
                    text: "ยืนยัน",
                    onPress: async () => {
                        try {
                            const response = await axios.post(apiheader + '/wallet/add-totalsummary/' + route.params.restaurant_id, { totalsummary: Totalsummary });
                            console.log(Totalsummary)
                            Alert.alert("บันทึกข้อมูลเรียบร้อย");
                            const data = await response.json();
                            if (response.status === 200) {
                                console.log('Successfully added Totalsummary:', data);
                            } else {
                                console.log('Error:', data.message);
                            }
                        } catch (error) {
                        } console.error('Error adding Totalsummary:', error);
                    }

                }
            ]
        );
    };

    const screenWidth = Dimensions.get("window").width;

    // ข้อมูลที่จะแสดงในกราฟ (รายวันและรายเดือน)
    const dailyData = {
        labels: ["รายรับ", "รายจ่าย"],
        datasets: [
            {
                data: [summary.dailyIncome, summary.dailyExpense],
                strokeWidth: 2,
                color: (opacity = 1) => `rgba(0, 204, 255, ${opacity})`, // สีของเส้นกราฟ
            },
        ],
    };

    const monthlyData = {
        labels: ["รายรับ", "รายจ่าย"],
        datasets: [
            {
                data: [summary.monthlyIncome, summary.monthlyExpense],
                strokeWidth: 2,
                color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`, // สีของเส้นกราฟ
            },
        ],
    };


    const Totalsummary = summary.dailyIncome - summary.dailyExpense + parseFloat(otherIncome || 0) - parseFloat(cost || 0);
    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#FB992C', '#EC7A45']} start={{ x: 0.2, y: 0.8 }} style={styles.header}>
                <View style={{ flexWrap: 'wrap', alignSelf: 'center', marginLeft: 20, marginTop: 35 }}>
                    <MaterialIcons name="arrow-back-ios" size={24} color="white"
                        onPress={() => navigation.dispatch(CommonActions.goBack())} />
                </View>
                <Text style={styles.headerTitle}>
                    กระเป๋าเงิน
                </Text>
            </LinearGradient>
            <View style={styles.loadingindi}>
                <ActivityIndicator size={"large"} animating={isLoading} style={styles.loadingindi} />
            </View>
            <ScrollView>
                <View style={styles.summaryContainer}>
                    <Text style={styles.totalPriceTextheader}>ยอดที่สามารถถอนได้</Text>
                    <Text style={styles.totalPriceText}>
                        ฿{wallets && wallets.wallet && wallets.wallet.balance !== undefined ? wallets.wallet.balance.toFixed(2) : '0.00'}
                    </Text>

                </View>
                <TouchableOpacity onPress={handleButtonBank}>
                    <View style={styles.flexbank}>
                        <View style={styles.backgruundIcon}>
                            <MaterialCommunityIcons name="bank" size={24} color="gray" />
                        </View>
                        <Text style={styles.bankText}>ถอนเงิน</Text>
                        <View style={styles.IconNext}>
                            <MaterialIcons name="navigate-next" size={24} color="black" />

                        </View>
                    </View>
                </TouchableOpacity>

                <ScrollView>
                    <View style={styles.summaryContainer}>
                        <View style={styles.buttonContainer}>
                            <Button
                                title="รายวัน"
                                onPress={() => setViewMode('daily')}
                                color={viewMode === 'daily' ? '#00CCFF' : '#DDDDDD'}
                            />
                            <Button
                                title="รายเดือน"
                                onPress={() => setViewMode('monthly')}
                                color={viewMode === 'monthly' ? '#FF6384' : '#DDDDDD'}
                            />
                        </View>
                        {viewMode === 'daily' && (

                            <View style={styles.daySummary}>
                                <Text style={styles.summaryTextheader}>ยอดรายรับรายจ่ายประจำวัน</Text>
                                <View style={styles.daySummaryTitle}>
                                    <Text style={styles.summaryPriceText}>รายรับ ฿{summary.dailyIncome}</Text>
                                    <Text style={styles.ExpenseSummaryPriceText}>รายจ่าย ฿{summary.dailyExpense}</Text>
                                </View>
                                <Text style={styles.useTosummarry}>คำนวนยอดขายต่อวัน</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="รายได้จากภายนอก"
                                    keyboardType="numeric"
                                    value={otherIncome}
                                    onChangeText={(text) => setOtherIncome(text)}
                                />

                                <TextInput
                                    style={styles.input}
                                    placeholder="ต้นทุน"
                                    keyboardType="numeric"
                                    value={cost}
                                    onChangeText={(text) => setCost(text)}
                                />

                                <Text style={styles.summaryPriceAll}>ผลกำไรวันนี้</Text>
                                <Text style={styles.Totalsummary}>฿{Totalsummary}</Text>
                                {/* ปุ่มเลือกแสดงระหว่าง รายวันและรายเดือน */}


                                <LineChart
                                    data={dailyData}
                                    width={screenWidth - 30}
                                    height={220}
                                    chartConfig={{
                                        backgroundColor: "#fff",
                                        backgroundGradientFrom: "#fff",
                                        backgroundGradientTo: "#fff",
                                        decimalPlaces: 2,
                                        color: (opacity = 1) => `rgba(0, 204, 255, ${opacity})`,
                                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                        style: {
                                            borderRadius: 16,
                                        },
                                    }}
                                    style={{
                                        marginVertical: 8,
                                        borderRadius: 16,
                                    }}
                                />

                            </View>
                        )}

                        {viewMode === 'monthly' && (
                            <View style={styles.monthSummary}>
                                <Text style={styles.summaryTextheader}>ยอดรายรับรายจ่ายประจำเดือน</Text>
                                <View style={styles.daySummaryTitle}>
                                    <Text style={styles.summaryPriceText}>รายรับ ฿{summary.monthlyIncome}</Text>
                                    <Text style={styles.ExpenseSummaryPriceText}>รายจ่าย ฿{summary.monthlyExpense}</Text>
                                </View>

                                <LineChart
                                    data={monthlyData}
                                    width={screenWidth - 30}
                                    height={220}
                                    chartConfig={{
                                        backgroundColor: "#fff",
                                        backgroundGradientFrom: "#fff",
                                        backgroundGradientTo: "#fff",
                                        decimalPlaces: 2,
                                        color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
                                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                        style: {
                                            borderRadius: 16,
                                        },
                                    }}
                                    style={{
                                        marginVertical: 8,
                                        borderRadius: 16,
                                    }}
                                />
                            </View>
                        )}
                        <TouchableOpacity style={styles.button} onPress={addTotalSummary}>
                            <Text style={styles.buttonText}>บันทึกผล</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>

                <View style={styles.historyContainer}>
                    <View style={styles.historys}>
                        <TouchableOpacity style={[styles.btuhistory, selectedTab === 'reservations' && styles.activeTab]}
                            onPress={() => setSelectedTab('reservations')}>
                            <Text style={styles.subTitle}>ประวัติการจอง</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.btuhistory, selectedTab === 'withdrawals' && styles.activeTab]}
                            onPress={() => setSelectedTab('withdrawals')}>
                            <Text style={styles.subTitle}>ประวัติการถอนเงิน</Text>
                        </TouchableOpacity>
                    </View>
                    {selectedTab === 'reservations' ? (
                        reservationList.filter(item => item.status === "ยืนยันแล้ว" || item.status === "เสร็จสิ้นแล้ว").length > 0 ?
                            reservationList
                                .filter(item => item.status === "ยืนยันแล้ว" || item.status === "เสร็จสิ้นแล้ว")
                                .map((item, index) => (
                                    <TouchableOpacity key={index} onPress={() => handleButtonPress(item)}>
                                        <View style={[styles.reserveCon, { borderLeftColor: 'green' }]}>
                                            <View style={styles.ReservationList}>
                                                <View style={styles.FlexReserve}>
                                                    <Text style={styles.title3}>การจองที่ {index + 1}</Text>
                                                    <Text style={styles.title4}>
                                                        {moment(item.createdAt).tz('Asia/Bangkok').format('LLL')}
                                                    </Text>
                                                </View>
                                                <View style={styles.flexstatus}>
                                                    <Text style={[styles.statusres,
                                                    item.payment || item.Payment[0]?.status === 'success' ? { color: 'green' } : { color: 'blue' },
                                                    ]}>
                                                        {(item.Payment[0]?.status === 'failed')
                                                            ? "รอการชำระเงิน"
                                                            : item.Payment && item.Payment[0]?.status === 'success'
                                                                ? "ชำระเงินแล้ว"
                                                                : item.status}
                                                    </Text>
                                                    <View style={styles.Xbutton}>
                                                        <Text style={styles.totalPricePerReservation}>{item.total}฿</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )) : <Text>ไม่มีข้อมูลการจอง</Text>
                    ) : (
                        wallets?.wallet?.withdrawals?.length > 0 ? wallets.wallet.withdrawals.map((withdrawal, index) => (
                            <View key={index} style={styles.transactionCard}>
                                <View style={styles.flexWithdraw}>
                                    <Text>{moment(withdrawal.date).tz('Asia/Bangkok').format('LLL')}</Text>
                                    <Text style={styles.withdrawalamount}>-฿{withdrawal.amount}</Text>
                                </View>
                                <Text style={{ color: withdrawal.status === 'approved' ? 'green' : 'gray', marginTop: 10 }}>
                                    {withdrawal.status}
                                </Text>
                            </View>
                        )) : <Text>ไม่มีประวัติการถอนเงิน</Text>
                    )}

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    list: {
        flexDirection: 'row',
        margin: 15
    },
    title1: {
        width: '50%',
        fontSize: 20,
        fontWeight: 'bold'
    },
    title2: {
        width: '50%',
        textAlign: 'right',
        fontSize: 20,
        fontWeight: 'bold'
    },
    reserveCon: {
        padding: 10,
        marginTop: 10,
        borderLeftWidth: 10,
        borderLeftColor: 'yellow',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 5,
        borderRadius: 10,
        backgroundColor: 'white',
    },
    FlexReserve: {
        flexDirection: 'row',
    },
    title3: {
        width: '50%',

        fontSize: 16

    },
    title4: {
        width: '50%',
        textAlign: 'right',
    },
    title5: {
        fontSize: 18

    },
    button: {
        backgroundColor: '#FF914D',
        padding: 10,
        borderRadius: 5,
        alignSelf: 'flex-end',
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },
    loadingindi: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -50 }, { translateY: -50 }],
    },
    topper: {
        height: StatusBar.currentHeight || 20,
    },
    statusres: {
        fontSize: 15,
        color: 'blue',
        marginTop: 10
    },
    flexstatus: {
        flexDirection: 'row',
    },
    Xbutton: {
        flex: 1,
        marginLeft: 'auto'
    }, header: {
        height: 109,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        flexDirection: 'row',
    }, headerTitle: {
        color: 'white',
        fontSize: 36,
        fontWeight: 'bold',
        marginLeft: 20,
        marginTop: 45,
    },
    summaryContainer: {
        padding: 15,
        backgroundColor: '#fff',
        margin: 10,
        borderRadius: 10,
        elevation: 3,

    },
    totalPriceText: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#333',
    },
    totalPriceTextheader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    totalPricePerReservation: {
        marginLeft: 'auto',
        marginTop: 10,
        fontSize: 16,
        color: 'green'
    },
    flexbank: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10
    },
    backgruundIcon: {
        backgroundColor: '#cbcbcb',
        padding: 5,
        borderRadius: 50
    },
    bankText: {
        marginLeft: 10
    },
    IconNext: {
        marginLeft: 'auto'
    },
    historyContainer: {
        margin: 10
    },
    historys: {
        flexDirection: 'row'
    },
    transactionCard: {
        padding: 10,
        marginTop: 10,
        borderLeftWidth: 10,
        borderLeftColor: 'yellow',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 5,
        borderRadius: 10,
        backgroundColor: 'white',
    },
    flexWithdraw: {
        flexDirection: 'row'
    },
    withdrawalamount: {
        marginLeft: 'auto',
        color: 'red',
        fontSize: 16
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: 'orange',
    },
    btuhistory: {
        marginLeft: 10
    },
    daySummaryTitle: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 15

    },
    summaryPriceText: {
        marginLeft: 10,
        marginRight: 10,
        fontSize: 16,
        textAlign: 'center',
        color: 'green'
    },
    ExpenseSummaryPriceText: {
        marginLeft: 10,
        marginRight: 10,
        fontSize: 16,
        textAlign: 'center',
        color: 'red'
    },
    summaryTextheader: {
        marginTop: 15,
        fontSize: 16
    },
    input: {
        borderBlockColor: 'gray',
        borderWidth: 1,
        marginTop: 5
    },
    useTosummarry: {
        fontSize: 16,
        marginTop: 10
    },
    summaryPriceAll: {
        fontSize: 20,
        textAlign: 'center',
        marginTop: 10
    },
    Totalsummary: {
        fontSize: 25,
        color: '#FF914D',
        textAlign: 'center'
    }
});

export default MyWalletScreen;