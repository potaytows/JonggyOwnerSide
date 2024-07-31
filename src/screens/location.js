import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';

const apiheader = process.env.EXPO_PUBLIC_apiURI;

const LocationScreen = ({ route, navigation }) => {
    const { reservation } = route.params;
    const handleCancelReservation = () => {
        Alert.alert(
            "ยกเลิกการจอง",
            "คุณแน่ใจหรือไม่ว่าต้องการยกเลิกการจองนี้?",
            [
                {
                    text: "ยกเลิก",
                    style: "cancel"
                },
                {
                    text: "ยืนยัน",
                    onPress: async () => {
                        try {
                            const response = await axios.put(apiheader + '/reservation/cancelReservation/' + reservation._id);
                            Alert.alert("การจองถูกยกเลิกเรียบร้อยแล้ว");
                            navigation.goBack();
                        } catch (error) {
                            console.error(error);
                            Alert.alert("เกิดข้อผิดพลาดในการยกเลิกการจอง");
                        }
                    }
                }
            ]
        );
    };
    const handleButtonPress = () => {
        navigation.navigate('Chat', {
            reservationID: reservation._id,
        });
    };
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Location</Text>
            <TouchableOpacity style={styles.button} >
                <Text style={styles.buttonText}>ดูรายการอาหาร</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.chat} onPress={handleButtonPress} >
                <View style={styles.image} ></View>
                {/* <Image style={styles.image} source={{ uri: apiheader + '/image/getRestaurantIcon/' + reservation.restaurant_id._id }} /> */}
                <View style={styles.buttonChat} >
                    <Text style={styles.textChat}>แชทกับร้านค้า</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleCancelReservation}>
                <Text style={styles.buttonText}>ยกเลิกการจอง</Text>
            </TouchableOpacity>
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white',
    },
    chat: {
        flexDirection: 'row'
    },
    image: {
        width: 50,
        height: 50,
        backgroundColor: 'gray',
        borderRadius: 50
    },
    textChat: {
        backgroundColor: 'gray',
        padding: 10,
        borderRadius: 10,
        color: 'white'
    },
    buttonChat: {
        flex: 1,
        justifyContent: 'center',
        marginLeft: 5
    }

});

export default LocationScreen;
