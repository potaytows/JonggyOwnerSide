import React, { useEffect, useState } from 'react';
import { Text, View, SafeAreaView, StyleSheet, StatusBar, FlatList, ScrollView, TextInput, ActivityIndicator, TouchableOpacity, Image, Button, Alert } from 'react-native'
import { useFocusEffect } from '@react-navigation/native';


import axios from 'axios';

import * as SecureStore from 'expo-secure-store';
import AutoHeightImage from 'react-native-auto-height-image'



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


    return (


        <SafeAreaView style={styles.container}>
            <View style={styles.loadingindi}>
                <ActivityIndicator size={"large"} animating={isLoading} style={styles.loadingindi} />
            </View>
            <View style={styles.topper}>
            </View>
          
            <ScrollView>
                <View>
                    <View style={styles.reserveCon}>
                        <View style={styles.list}>
                            <Text style={styles.title1}>รายการจอง</Text>
                            <Text style={styles.title2}>เวลา</Text>
                        </View>
                    </View>
                    {reservationList < 1 && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}><Text>ร้านของคุณเงียบมาก ;-;!</Text></View>}
                    {reservationList != undefined || reservationList == [] ? reservationList.map((item, index) => (
                        reservationList && index == undefined ? (
                            <View key={item.id}><Text>ร้านของคุณยังไม่มีเมนู!</Text></View>
                        ) : (

                            <View key={index}>
                                <View style={styles.reserveCon}>
                                    <View style={styles.ReservationList}>
                                        <View style={styles.FlexReserve}>
                                            <Text style={styles.title3}>การจองที่ {index + 1}</Text>
                                            <Text style={styles.title4}>{item.createdAt}</Text>

                                        </View>
                                        <Text>โต๊ะ: {item.reservedTables.map(table => table.tableName).join(', ')}</Text>
                                        <TouchableOpacity style={styles.button} >
                                            <Text style={styles.buttonText}>ดูรายระเอียดการจอง</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        )
                    )) : <View><Text>กำลังโหลดข้อมูล!</Text></View>}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    ReservationList: {

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
    ReservationList: {
        margin: 15
    },
    reserveCon: {
        borderBottomWidth: 5,
        borderBottomColor: '#EDEDED'
    },
    FlexReserve:{
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
        alignSelf: 'flex-end',
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },


})

export default AllReservations
