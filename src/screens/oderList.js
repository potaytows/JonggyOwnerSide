import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';  

const apiheader = process.env.EXPO_PUBLIC_apiURI;

const OrderListScreen = ({ route, navigation }) => {
    const { reservation } = route.params;

    const handleConfirmReservation = async () => {
        Alert.alert(
            "ยืนยันการจอง",
            "คุณแน่ใจหรือไม่ว่าต้องการยืนยันการจองนี้?",
            [
                {
                    text: "ยกเลิก",
                    style: "cancel"
                },
                {
                    text: "ยืนยัน",
                    onPress: async () => {
                        try {
                            const response = await axios.put(apiheader + '/reservation/confirmReservation/' + reservation._id);
                            Alert.alert("การจองถูกยืนยันเรียบร้อยแล้ว");
                            navigation.goBack();
                        } catch (error) {
                            console.error(error);
                            Alert.alert("เกิดข้อผิดพลาดในการยืนยันการจอง");
                        }

                    }
                }
            ]
        );
    };

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

    return (
        <View style={styles.container}>
            <Text style={styles.header}>รายละเอียดการจอง</Text>
            <View style={styles.details}>
                <Text>รหัสการจอง: {reservation._id}</Text>
                <Text>เวลา: {reservation.createdAt}</Text>
                <Text>โต๊ะ: {reservation.reservedTables.map(table => table.tableName).join(', ')}</Text>
                {/* Add more details as needed */}
            </View>
            <TouchableOpacity style={styles.button} onPress={handleConfirmReservation}>
                <Text style={styles.buttonText}>ยืนยันการจอง</Text>
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
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    details: {
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#FF914D',
        padding: 10,
        borderRadius: 5,
        alignSelf: 'center',
        marginVertical: 10,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },
});

export default OrderListScreen;
