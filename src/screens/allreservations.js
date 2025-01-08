import React, { useEffect, useState } from 'react';
import { Text, View, SafeAreaView, StyleSheet, StatusBar, FlatList, ScrollView, TextInput, ActivityIndicator, TouchableOpacity, Image, Button, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { CommonActions } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const apiheader = process.env.EXPO_PUBLIC_apiURI;

const AllReservations = ({ navigation, route }) => {
    const [isLoading, setLoading] = useState(false);
    const [reservationList, setReservationList] = useState([]);

    const loadReservations = async () => {
        setLoading(true);

        try {
            const response = await axios.get(apiheader + '/reservation/getReservationByRestaurantID/' + route.params.restaurant_id);
            const result = await response.data;
            setReservationList(result);
            console.log(result);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            loadReservations();
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

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#FB992C', '#EC7A45']} start={{ x: 0.2, y: 0.8 }} style={styles.header}>
                <View style={{ flexWrap: 'wrap', alignSelf: 'center', marginLeft: 20, marginTop: 35 }}>
                    <MaterialIcons name="arrow-back-ios" size={24} color="white"
                        onPress={() => navigation.dispatch(CommonActions.goBack())} />
                </View>
                <Text style={styles.headerTitle}>
                    การจองทั้งหมด
                </Text>
            </LinearGradient>
            <View style={styles.loadingindi}>
                <ActivityIndicator size={"large"} animating={isLoading} style={styles.loadingindi} />
            </View>
            <ScrollView>
                <View>
                    {reservationList.length < 1 && (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                            <Text>ร้านของคุณเงียบมาก ;-;!</Text>
                        </View>
                    )}
                    {reservationList && reservationList.length > 0 ? reservationList.map((item, index) => (


                        <View key={index}>
                            <View style={[styles.reserveCon,
                            item.status === "ยืนยันแล้ว" && { borderLeftColor: 'green' },
                            item.status === "ยกเลิกการจองแล้ว" && { borderLeftColor: 'gray' }]}>
                                <View style={styles.ReservationList}>
                                    <View style={styles.FlexReserve}>
                                        <Text style={styles.title3}>การจองที่ {index + 1}</Text>
                                        <Text style={styles.title4}>{item.createdAt}</Text>
                                    </View>


                                    <Text style={styles.title5}>โต๊ะ {item.reservedTables.map(table => table.tableName).join(', ')}</Text>

                                    <View style={styles.flexstatus}>
                                        <Text style={[styles.statusres,
                                        item.status === "ยืนยันแล้ว" && { color: 'green' },
                                        item.status === "ยกเลิกการจองแล้ว" && { color: 'red' }]}>{item.status}</Text>
                                        <View style={styles.Xbutton}>
                                            <TouchableOpacity
                                                style={[styles.button,
                                                item.status === "ยกเลิกการจองแล้ว" && { backgroundColor: 'grey' }]}
                                                onPress={() => item.status !== "ยกเลิกการจองแล้ว" && handleButtonPress(item)}
                                                disabled={item.status === "ยกเลิกการจองแล้ว"}
                                            >
                                                <Text style={styles.buttonText}>ดูรายระเอียดการจอง</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                </View>
                            </View>
                        </View>
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
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20,
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
    }
});

export default AllReservations;