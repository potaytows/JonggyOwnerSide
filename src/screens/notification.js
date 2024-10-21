import React, { useEffect, useState } from 'react';
import { Text, View, SafeAreaView, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { CommonActions } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
const apiheader = process.env.EXPO_PUBLIC_apiURI;

const NotificationScreen = () => {
    const [latestMessages, setLatestMessages] = useState([]);
    const [restaurantID, setRestaurantID] = useState(null);
    const getRestaurantID = async () => {
        try {
            const userauth = await SecureStore.getItemAsync('userAuth');
            const username = JSON.parse(userauth);
            const response = await axios.get(`${apiheader}/restaurants/getByUsername/${username.username}`);
            const restaurant = response.data;

            if (restaurant && restaurant._id) {
                setRestaurantID(restaurant._id);
            } else {
                console.log("Restaurant ID not found");
            }
        } catch (error) {
            console.error('Error fetching restaurant ID:', error);
        }
    };


    useEffect(() => {
        const fetchLatestMessages = async () => {
            if (restaurantID) {
                try {
                    const response = await axios.get(`${apiheader}/chat/latestMessages/${restaurantID}`);
                    setLatestMessages(response.data.latestMessages);
                } catch (error) {
                    console.error('Error fetching latest messages:', error);
                }
            }
        };

        getRestaurantID();
        fetchLatestMessages();
    }, [restaurantID]);

    return (
        <SafeAreaView style={styles.container}>
             <LinearGradient colors={['#FB992C', '#EC7A45']} start={{ x: 0.2, y: 0.8 }} style={styles.header}>

                    <Text style={styles.headerTitle}>
                        การแจ้งเตือน
                    </Text>
                </LinearGradient>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity style={styles.chats}>
                    <Text style={styles.textchats} >ข้อความ</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.news}>
                    <Text style={styles.textnews}>การแจ้งเตือน</Text>
                </TouchableOpacity>

            </View>
            <ScrollView>
                {latestMessages.map((message) => (
                    <TouchableOpacity key={message.id} style={styles.messageItem}>
                        <View style={styles.messageContent}>
                            <View style={styles.imgProfile}></View>
                            <View style={styles.textshow}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={styles.username}>ชื่อผู้จอง: {message.username}</Text>
                                    <Text style={styles.timestamp}>
                                        {message.timestamp
                                            ? new Date(message.timestamp).toLocaleDateString() + ' ' +
                                            new Date(message.timestamp).toLocaleTimeString()
                                            : 'No timestamp'}
                                    </Text>
                                </View>
                                <Text style={styles.lastMessage}>{message.lastMessage}</Text>
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
    },
    messageItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    messageContent: {
        flexDirection: 'row',
        alignItems:'center'
    },
    username: {
        fontWeight: 'bold',
        fontSize: 16
    },
    lastMessage: {
        color: '#555',
        fontSize: 16
    },
    timestamp: {
        color: 'gray',
        marginLeft: 'auto'
    },
    chats: {
        flex: 1,
        margin: 10,
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 20,
        backgroundColor: '#ff8a24'
    },
    news: {
        flex: 1,
        margin: 10,
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 20,
        backgroundColor: 'gray'
    },
    textchats: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white'
    },
    textnews: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black'
    },
    imgProfile: {
        width: 60,
        height: 60,
        borderRadius: 50,
        backgroundColor: 'gray'
    },
    textshow:{
        flex:1,
        marginLeft:10
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

export default NotificationScreen;