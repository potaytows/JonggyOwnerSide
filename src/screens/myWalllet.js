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

const MyWalletScreen = ({ navigation, route }) => {
    const [isLoading, setLoading] = useState(false);
    const [reservationList, setReservationList] = useState([]);
    const [wallets, setWallet] = useState(null);
    const [selectedTab, setSelectedTab] = useState('reservations');
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
                        ฿{wallets && wallets.wallet && wallets.wallet.balance !== undefined ? wallets.wallet.balance : '0'}
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
                                <Text style={{ color: withdrawal.status === 'approved' ? 'green' : 'gray' ,marginTop:10}}>
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
        fontSize:16,
        color:'green'
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
    flexWithdraw:{
        flexDirection:'row'
    },
    withdrawalamount:{
        marginLeft:'auto',
        color:'red',
        fontSize:16
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: 'orange',
    },
    btuhistory:{
        marginLeft:10
    }
    

});

export default MyWalletScreen;