import React, { useEffect, useState } from 'react';
import { Text, View, SafeAreaView, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import io from 'socket.io-client';

const apiheader = process.env.EXPO_PUBLIC_apiURI;
const socket = io(apiheader);

const NotificationScreen = () => {
    const [notifications, setNotifications] = useState([]);
    const navigation = useNavigation();


    useFocusEffect(
        React.useCallback(() => {
            const fetchNotifications = async () => {
                try {
                    const response = await axios.get(apiheader+'/chat/notifications');
                    setNotifications(response.data.notifications);
                } catch (error) {
                    console.error(error);
                }
            };

            fetchNotifications();


            return () => {
                setNotifications([]);
            };
        }, [])
    );
    const handlePress = (reservationID) => {
        navigation.navigate('Chat', { reservationID });
    };

    console.log( notifications)
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.FlexShow}>
                <TouchableOpacity style={styles.show}>
                    <Text style={styles.butShowChat}>แชท</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.show}>
                    <Text style={styles.butShowNews}>การแจ้งเตือน</Text>
                </TouchableOpacity>
            </View>

            <ScrollView>
                {notifications.map((notification) => (
                    <TouchableOpacity
                        key={notification.id}
                        style={styles.notificationItem}
                        onPress={() => handlePress(notification.reservationID)}
                    >
                        <View style={styles.notificationContent}>
                            <Text style={styles.idReserve}>รหัสการจอง: {notification.reservationID}</Text>
                            <Text style={styles.nameUser}>ชื่อผู้จอง: {notification.username}</Text>
                            <View style={styles.flexNotiChat}>
                                <Text style={[styles.newMessage,
                                    notification.readStatus === 'notRead' && {fontWeight: 'bold', },
                                    notification.readStatus === 'ReadIt' && {fontWeight: 'bold', color:'#999999'}
                                ]}>{notification.lastMessage}</Text>
                                <Text style={styles.timestamp}>
                                    {notification.timestamp
                                        ? new Date(notification.timestamp).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit'
                                        }) + ' ' + new Date(notification.timestamp).toLocaleTimeString(undefined, {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })
                                        : 'No timestamp'}
                                </Text>
                            </View>

                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
    },
    notificationItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    notificationContent: {
        flexDirection: 'column',
    },

    timestamp: {
        color: 'gray',
        marginLeft: 10

    },
    flexNotiChat: {
        flexDirection: 'row',
        marginTop:5
    },
    FlexShow: {
        flexDirection: 'row'
    },
    show: {
        flex: 1,
    },
    butShowChat: {
        backgroundColor: '#ff8a24',
        color: 'white',
        textAlign: 'center',
        padding:10,
        margin:5,
        borderRadius:50,
        fontWeight:'bold'
    },
    butShowNews: {
        backgroundColor: '#bdbdbd',
        color: '#474646',
        textAlign: 'center',
        padding:10,
        margin:5,
        borderRadius:50
    }
});

export default NotificationScreen;
