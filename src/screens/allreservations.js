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
            {reservationList < 1 && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}><Text>ร้านของคุณเงียบมาก ;-;!</Text></View>}
            <ScrollView>
                <View>
                    {reservationList != undefined || reservationList == [] ? reservationList.map((item, index) => (
                        reservationList && index == undefined ? (
                            <View key={item.id}><Text>ร้านของคุณยังไม่มีเมนู!</Text></View>
                        ) : (
                            <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => navigation.navigate("Reservation", { reservation_id: item._id })} key={index}>
                                <View style={styles.flatlist}>
                                    <View stlye={styles.reservationData}>
                                        <Text style={styles.reservationTitle} adjustsFontSizeToFit={true}
                                            numberOfLines={2}>
                                            การจองที่ {item._id}
                                        </Text>
                                        <Text>{item.totalPrice}</Text>
                                    </View>


                                </View>

                            </TouchableOpacity>
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
    },flatlist: {
        minHeight: 70,
        marginLeft: 15,
        marginBottom: 15,
        flexDirection: "row",
        flex: 1
    }
     

})

export default AllReservations
