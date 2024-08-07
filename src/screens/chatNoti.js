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
                    const response = await axios.get(`${apiheader}/chat/notifications`);
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

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                {notifications.map((notification) => (
                    <TouchableOpacity
                        key={notification.id}
                        style={styles.notificationItem}
                        onPress={() => handlePress(notification.reservationID)}
                    >
                        <View style={styles.notificationContent}>
                            <Text style={styles.idReserve}>รหัสการจอง: {notification.reservationID}</Text>
                            <Text style={styles.nameUser}>{notification.username}</Text>
                            <View style={styles.flexNotiChat}>
                                <Text style={styles.newMessage}>{notification.lastMessage}</Text>
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
    
    newMessage:{
        fontWeight: 'bold',
    },
    timestamp: {
        color: 'gray',
        marginLeft:10
        
    },
    flexNotiChat:{
        flexDirection:'row'
    }
});

export default NotificationScreen;
