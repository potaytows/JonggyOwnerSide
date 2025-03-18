import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect, CommonActions } from '@react-navigation/native';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import moment from 'moment';


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
            <LinearGradient colors={['#FB992C', '#EC7A45']} start={{ x: 0.2, y: 0.8 }} style={styles.header}>
                <View style={{ flexWrap: 'wrap', alignSelf: 'center', marginLeft: 20, marginTop: 35 }}>
                    <MaterialIcons name="arrow-back-ios" size={24} color="white"
                        onPress={() => navigation.dispatch(CommonActions.goBack())} />
                </View>
                <Text style={styles.headerTitle}>
                    การจอง
                </Text>
            </LinearGradient>
            <View style={styles.content}>
                <Text style={styles.headerText}>รายละเอียดการจอง</Text>
                <View style={styles.details}>
                    <Text>รหัสการจอง: {reservation._id}</Text>
                    <Text>เวลา:  {moment(reservation.startTime).utc().format('Do MMMM HH:mm')} - {moment(reservation.endTime).utc().format('Do MMMM HH:mm')}</Text>
                    <Text>โต๊ะ: {reservation.reservedTables.map(table => table.text).join(', ')}</Text>

                    <Text>สถานะ:
                        {(!reservation.payment || reservation.payment.length === 0)
                            ? "รอการจ่ายเงิน"
                            : reservation.status}
                    </Text>
                </View>

                <Text style={styles.sectionTitle}>รายการอาหาร</Text>
                <View style={styles.MenuTitle}>
                    <View style={styles.MenuLi1}><Text style={styles.Ui}>เมนู</Text></View>
                    <View style={styles.MenuLi2}><Text style={styles.Ui}></Text></View>
                    <View style={styles.MenuLi3}><Text style={styles.Ui}>จำนวน</Text></View>
                    <View style={styles.MenuLi4}><Text style={styles.totalPrice}>ราคา</Text></View>
                </View>
                {reservation.orderedFood.map((order, index) => (
                    <View key={index} style={styles.foodContainer}>
                        <View style={styles.foodDetails}>
                            <View style={styles.MenuTitle}>
                                <View style={styles.MenuLi1}>
                                    {order.selectedMenuItem.map((item, itemIndex) => (
                                        <Text key={itemIndex} style={styles.foodItem}>{item.menuName}</Text>
                                    ))}
                                </View>
                                <View style={styles.MenuLi2}>
                                    {order.selectedAddons.map((addon, addonIndex) => (
                                        <Text key={addonIndex} style={styles.addonItem}>{addon.AddOnName}</Text>
                                    ))}
                                </View>
                                <View style={styles.MenuLi3}>
                                    <Text style={styles.Count}>8</Text>
                                </View>
                                <View style={styles.MenuLi4}>
                                    <Text style={styles.totalPrice}>฿{order.totalPrice}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                ))}

                <Text style={styles.totalReservation}>ราคารวม ฿{reservation.total}</Text>
                <TouchableOpacity style={styles.button} onPress={handleConfirmReservation}>
                    <Text style={styles.buttonText}>ยืนยันการจอง</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleCancelReservation}>
                    <Text style={styles.buttonText}>ยกเลิกการจอง</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    content: {
        margin: 15
    },
    headerText: {
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
    }
    , header: {
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
    MenuTitle: {
        flexDirection: 'row',
        margin: 10,
    },
    MenuLi1: {
        flex: 3,
    },
    MenuLi2: {
        flex: 3,
    },
    MenuLi3: {
        flex: 2,
    },
    MenuLi4: {
        flex: 1,
    },
    Count: {
        marginLeft: 10,
    },
    totalPrice: {
        fontWeight: 'bold',
        textAlign: 'right',
    },
    totalReservation: {
        fontSize: 18,
        fontWeight: 'bold',
        margin: 20,
        textAlign: 'right',
    },
});

export default OrderListScreen;