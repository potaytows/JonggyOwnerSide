import React, { useEffect, useState } from 'react';
import { Text, View, SafeAreaView, StyleSheet, StatusBar, FlatList, ScrollView, TextInput, ActivityIndicator, TouchableOpacity, Image, Button, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

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
            navigation.navigate('location', { reservation: reservation });
        } else {
            navigation.navigate('orderList', { reservation: reservation });
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.loadingindi}>
                <ActivityIndicator size={"large"} animating={isLoading} style={styles.loadingindi} />
            </View>
            <View style={styles.topper}></View>
            <ScrollView>
                <View>
                    <View style={styles.reserveCon}>
                        <View style={styles.list}>
                            <Text style={styles.title1}>รายการจอง</Text>
                            <Text style={styles.title2}>เวลา</Text>
                        </View>
                    </View>
                    {reservationList.length < 1 && (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                            <Text>ร้านของคุณเงียบมาก ;-;!</Text>
                        </View>
                    )}
                    {reservationList && reservationList.length > 0 ? reservationList.map((item, index) => (
                        <View key={index}>
                            <View style={styles.reserveCon}>
                                <View style={styles.ReservationList}>
                                    <View style={styles.FlexReserve}>
                                        <Text style={styles.title3}>การจองที่ {index + 1}</Text>
                                        <Text style={styles.title4}>{item.createdAt}</Text>
                                    </View>


                                    <Text>โต๊ะ: {item.reservedTables.map(table => table.tableName).join(', ')}</Text>

                                    <View style={styles.flexstatus}>
                                        <Text style={[styles.statusres, 
                                            item.status === "ยืนยันแล้ว" && { color: 'green'},
                                            item.status === "ยกเลิกการจองแล้ว" && { color: 'red'}]}>{item.status}</Text>
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
        backgroundColor: 'white',
        marginRight: 10,
        marginLeft: 10
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
        borderBottomWidth: 5,
        borderBottomColor: '#EDEDED',
        
        marginTop:10
    },
    FlexReserve: {
        flexDirection: 'row',
    },
    title3: {
        width: '50%',
    },
    title4: {
        width: '50%',
        textAlign: 'right',
    },
    button: {
        backgroundColor: '#FF914D',
        padding: 10,
        borderRadius: 5,
        alignSelf:'flex-end',
        marginBottom:10,
        
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
        flex:1,
    }
});

export default AllReservations;
