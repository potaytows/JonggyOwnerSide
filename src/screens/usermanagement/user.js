import React, { useEffect, useState } from 'react';
import { Text, View, SafeAreaView, StyleSheet, StatusBar, FlatList, TextInput, ActivityIndicator, ToastAndroid, TouchableOpacity, Image, Button, Alert } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import AutoHeightImage from 'react-native-auto-height-image'
import { useFocusEffect } from '@react-navigation/native';
import { EvilIcons } from '@expo/vector-icons';


const apiheader = process.env.EXPO_PUBLIC_apiURI;

const User = ({ navigation, route }) => {
    const [isLoading, setLoading] = useState(true);
    const [User, setData] = useState({});


    // const loadImage = async (photo_reference) => {
    //     try {
    //         const res = await fetch(
    //             `https://placebear.com/200/300`
    //         )   
    //         const data = await res.blob();
    //         setImage(data);
    //         console.log(data)
    //     } catch (error) {
    //         console.error(error)
    //     }
    // };

    const getUsers = async () => {
        try {
            const response = await fetch(apiheader + '/users/getUsers/' + route.params?.username);
            const result = await response.json();
            setData(result)
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        getUsers();

    },[]);
    

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.textHeader}>
                <Text style={styles.restaurantname}>{User.username}</Text>
                <Text style={styles.restaurantID}>ID: {User._id} </Text>


            </View>
            <View style={styles.middle}>
                <View style={styles.middleleft}>
           
                </View>
                <View style={styles.middleright}>
                    

                </View>



            </View>
            <View style={styles.addButtonCont}>
          
            </View>

        </SafeAreaView>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    loadingindi: {
        position: 'absolute',
        top: 30,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center'
    }, deleteButton: {
        backgroundColor: "red",
        width: 120,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        alignSelf: 'flex-end'

    }, textHeader: {
        marginLeft: 20,
        marginTop: 20,
    }, restaurantname: {
        fontSize: 25
    }, restaurantID: {
        fontSize: 13,

    }, middle: {
        marginLeft: 20,
        flex: 1,
        flexDirection: "row",
        marginTop: 30

    }


})

export default User
