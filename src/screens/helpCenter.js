import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Text from '../components/Text';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const apiheader = process.env.EXPO_PUBLIC_apiURI;

const HelpCenterScreen = ({ navigation, route }) => {
    const [userInfo, setUserInfo] = useState(null);
    const [reservationList, setReservationList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [restaurant, setRestaurant] = useState([]);

    const checkLoginStatus = async () => {
        setLoading(true);
        try {

            const userCredentials = await SecureStore.getItemAsync('userAuth');
            const username = JSON.parse(userCredentials)
            setUserInfo(username);
            const response = await axios.get(apiheader + '/restaurants/getByUsername/' + username.username);
            const result = await response.data;
            setRestaurant(result)

            const responses = await axios.get(
                `${apiheader}/reservation/getReservationByRestaurantID/${result._id}`
            );
            const results = await responses.data;
            setReservationList(results);
        } catch (error) {
            console.error('Error checking login status:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkLoginStatus();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    };


    const handleSupport = (reservation) => {
        navigation.navigate('supportForm', { user: userInfo, reservation: reservation, restaurant: restaurant });
    };
    const handlemySupport = (reservation) => {
        navigation.navigate('mySupport', { user: userInfo, reservation: reservation, restaurant: restaurant });
    };
    return (

        <View style={styles.container}>
            <LinearGradient colors={['#FB992C', '#EC7A45']} start={{ x: 0.2, y: 0.8 }} style={styles.header}>
                <View style={{ flexWrap: 'wrap', alignSelf: 'center', marginLeft: 20, marginTop: 35 }}>
                    <MaterialIcons name="arrow-back-ios" size={24} color="white"
                        onPress={() => navigation.goBack()} />
                </View>
                <Text style={styles.headerTitle}>
                    ศูยน์ช่วยเหลือ
                </Text>
            </LinearGradient>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <View>
                    <View style={styles.headers}>

                        <Text style={styles.greeting}>{userInfo?.username}</Text>
                        <Text style={styles.subtitle}>เราพร้อมช่วยเหลือคุณ</Text>
                    </View>

                    <View style={styles.chatSection}>
                        <View style={styles.chatButton}>
                            <Text style={styles.chatButtonText}>เลือกรายการ</Text>
                            <Text style={styles.chatButtonSubtitle}>เพื่อรายงานปัญหาของคุณ</Text>
                        </View>
                    </View>

                    <ScrollView>
                        <TouchableOpacity style={styles.menuItem} onPress={() => { handlemySupport() }}>
                            <Text style={styles.menuTitle}>เรื่องที่คุณรายงาน</Text>
                            <Text style={styles.menuSubtitle}>ตรวจสอบประวัติการรายงานที่ผ่านมา</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menuItem}>
                            <Text style={styles.menuTitle}>คำถามที่พบบ่อย</Text>
                            <Text style={styles.menuSubtitle}>ค้นหาเพิ่มเติมเกี่ยวกับบริการของเรา</Text>
                        </TouchableOpacity>

                        <Text style={styles.sectionTitle}>รายการล่าสุด</Text>
                        {reservationList.map((report, index) => (
                            <TouchableOpacity key={report._id} style={styles.reportItem} onPress={() => { handleSupport(report) }}>
                                <Image style={styles.reportImage} source={require('../../assets/images/cutlery.png')} />
                                <View style={styles.reportDetails}>
                                    <Text style={styles.reportTitle}>{report.username}</Text>
                                    <Text style={styles.reportDate}>{formatDate(report.createdAt)}</Text>
                                </View>
                                <Text style={styles.reportPrice}>{report.total}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

        </View>
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    headers: {
        backgroundColor: '#228B22',
        padding: 16,

    },
    title: {
        fontSize: 18,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    greeting: {
        fontSize: 16,
        color: '#FFFFFF',
        marginTop: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#FFFFFF',
        marginTop: 4,
    },
    chatSection: {
        marginTop: 16,
        marginHorizontal: 16,
    },
    chatButton: {
        backgroundColor: '#ffc9a3',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
    },
    chatButtonText: {
        fontSize: 16,
        color: '#913800',
        fontWeight: 'bold',
    },
    chatButtonSubtitle: {
        fontSize: 14,
        color: '#913800',
        marginTop: 4,
    },
    menuItem: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 10,
        marginHorizontal: 16,
        marginTop: 8,
    },
    menuTitle: {
        fontSize: 16,
        color: '#000000',
    },
    menuSubtitle: {
        fontSize: 14,
        color: '#666666',
        marginTop: 4,
    },
    sectionTitle: {
        fontSize: 16,
        color: '#000000',
        fontWeight: 'bold',
        marginHorizontal: 16,
        marginTop: 16,
    },
    reportItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 10,
        marginHorizontal: 16,
        marginTop: 8,
    },
    reportImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 16,
    },
    reportDetails: {
        flex: 1,
    },
    reportTitle: {
        fontSize: 14,
        color: '#000000',
    },
    reportDate: {
        fontSize: 12,
        color: '#666666',
        marginTop: 4,
    },
    reportPrice: {
        fontSize: 14,
        color: '#000000',
        fontWeight: 'bold',
    },
    header: {
        height: 109,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        flexDirection: 'row',
    }, 
    headerTitle: {
        color: 'white',
        fontSize: 36,
        fontWeight: 'bold',
        marginLeft: 20,
        marginTop: 45,

    }
});

export default HelpCenterScreen;
