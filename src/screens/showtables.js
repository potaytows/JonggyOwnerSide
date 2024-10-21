import { StyleSheet, View, Button, Modal, TextInput, TouchableOpacity, ToastAndroid, Pressable, Image, ScrollView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import Text from '../components/Text';
import StaticTable from '../components/staticTable';



const apiheader = process.env.EXPO_PUBLIC_apiURI;

const ShowTables = ({ route, navigation }) => {
    const [obj, setData] = useState([]);
    const [restaurant, setRestaurant] = useState({});
    const getTables = async () => {
        try {
            const response = await axios.get(apiheader + '/tables/getbyRestaurantId/' + route.params.restaurant_id);
            const result = await response.data;
            setData(result)
        } catch (error) {
            console.error(error);
        }

    }
    const changeStatus = async (item) => {
        console.log(item._id)
        try {
            const response = await axios.get(apiheader + '/tables/changestatus/' + item._id);
            const result = await response.data;
            getTables();
        } catch (error) {
            console.error(error);
        }
    };
    const getRestaurantbyUsername = async () => {
        try {
            const userauth = await SecureStore.getItemAsync('userAuth');
            const username = JSON.parse(userauth)
            const response = await axios.get(apiheader + '/restaurants/getByUsername/' + username.username);
            const result = await response.data;
            console.log(result);
            setRestaurant(result)
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        getTables();
        getRestaurantbyUsername();

    }, []);

    useFocusEffect(
        React.useCallback(() => {
            getTables();
            getRestaurantbyUsername();
        }, [])
    );

    return (
        <ScrollView>
            <LinearGradient colors={['#FB992C', '#EC7A45']} start={{ x: 0.2, y: 0.8 }} style={styles.header}>
                    <View style={{ flexWrap: 'wrap', alignSelf: 'center', marginLeft: 20, marginTop: 35 }}>
                        <MaterialIcons name="arrow-back-ios" size={24} color="white"
                            onPress={() => navigation.dispatch(CommonActions.goBack())}
                        />

                    </View>

                    <Text style={styles.headerTitle}>
                        จัดการที่นั่ง
                    </Text>
                </LinearGradient>
            <View style={styles.container}>
                
                <View style={styles.restaurantHeader}>
                    <View style={styles.restaurantBanner}>
                        <Image source={{ uri: apiheader + '/image/getRestaurantIcon/' + restaurant._id }} width={100} height={100} style={styles.restaurantimage} />
                        <View style={styles.restaurantInfo}>
                            <Text style={{ fontSize: 20 }}>{restaurant.restaurantName}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.dragablecontainer}>
                    {obj.map((item, index) => (
                        <StaticTable key={index} id={item._id} x={item.x} y={item.y} item={item} changeStatus={changeStatus}>
                        </StaticTable>
                    ))}
                </View>
                <TouchableOpacity style={[styles.editButton]} onPress={() => { navigation.navigate("EditTables", { restaurant_id: restaurant._id }) }}>
                    <Text style={styles.editButtonText}>แก้ไขที่นั่ง</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        justifyContent: 'center',
        alignContent: 'center',
        paddingBottom: 20
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

    }, restaurantHeader: {
        height: 150,
        alignContent: 'center',
        justifyContent: 'center',
        backgroundColor: "white",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 5,
    }, restaurantBanner: {
        height: 100,
        flexDirection: 'row'
    }, restaurantimage: {
        borderRadius: 30,
        marginLeft: 20
    }, restaurantInfo: {
        marginLeft: 20

    }, dragablecontainer: {
        // justifyContent: 'center',
        // alignItems: 'center',
        width: 380,
        height: 450,
        alignSelf: 'center',
        marginTop: 40,
        borderWidth: 2,
        borderRadius: 5,
        marginBottom: 20,
        backgroundColor: 'white',
        borderColor: '#CCCCCC',
        overflow: 'hidden'
    }, editButton: {
        width: 327,
        height: 36,
        backgroundColor: '#FF7A00',
        alignSelf: 'center',
        borderRadius: 3,
        justifyContent: 'center',
        alignContent: 'center',
    }, editButtonText: {
        fontSize: 16,
        color: 'white',
        textAlign: 'center',
        alignSelf: 'center',
    }
});


export default ShowTables