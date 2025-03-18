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
        if (reservation.status === "ยืนยันแล้ว") {
            navigation.navigate('location', {
                reservation: reservation,
                restaurant_id: route.params.restaurant_id
            });
        } else {
            navigation.navigate('orderList', { reservation: reservation });
        }
    };
    const handleButtonBank = () => {
            navigation.navigate('bankAccount',{restaurant_id: route.params.restaurant_id, wallets: wallets })
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

                <View>
                    {reservationList.length < 1 && (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                            <Text>ร้านของคุณเงียบมาก ;-;!</Text>
                        </View>
                    )}
                    {reservationList && reservationList.length > 0 ? reservationList.map((item, index) => (

                        <TouchableOpacity onPress={() => handleButtonPress(item)}>

                            <View key={index}>
                                <View style={[styles.reserveCon,
                                item.status === "ยืนยันแล้ว" && { borderLeftColor: 'green' },
                                item.status === "ยกเลิกการจองแล้ว" && { borderLeftColor: 'gray' }]}>
                                    <View style={styles.ReservationList}>
                                        <View style={styles.FlexReserve}>
                                            <Text style={styles.title3}>การจองที่ {index + 1}</Text>
                                            <Text style={styles.title4}>
                                                {moment(item.createdAt).tz('Asia/Bangkok').format('LLL')}
                                            </Text>

                                        </View>


                                        <Text style={styles.title5}>โต๊ะ {item.reservedTables.map(table => table.text).join(', ')}</Text>
                                        <View style={styles.flexstatus}>
                                            <Text style={[styles.statusres,
                                            !item.payment || item.payment.length === 0 ? { color: 'green' } : { color: 'blue' },
                                            ]}>
                                                {(!item.Payment || item.Payment.length === 0)
                                                    ? "รอการชำระเงิน"
                                                    : item.Payment && item.Payment.length > 0
                                                        ? "ชำระเงินแล้ว"
                                                        : item.status}
                                            </Text>
                                            <View style={styles.Xbutton}>
                                                <Text style={styles.totalPricePerReservation}>{item.total}฿</Text>
                                            </View>
                                        </View>

                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>

                    )) : <View><Text>กำลังโหลดข้อมูล!</Text></View>}
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
        marginLeft: 10,
        marginRight: 10,
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
        marginTop: 10
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
    }

});

export default MyWalletScreen;