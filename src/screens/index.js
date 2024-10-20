import { Text, View, SafeAreaView, StyleSheet, StatusBar, FlatList, TextInput, ActivityIndicator, TouchableOpacity, Image } from 'react-native'
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';
const apiheader = process.env.EXPO_PUBLIC_apiURI;
import Ionicons from '@expo/vector-icons/Ionicons';


const Index = ({ navigation }) => {
    const { container, header, headerTitle, } = styles
    const [restaurant, setRestaurant] = useState({});

    const getRestaurantbyUsername = async () => {
        try {
            const userauth = await SecureStore.getItemAsync('userAuth');
            const username = JSON.parse(userauth)
            const response = await fetch(apiheader + '/restaurants/getByUsername/' + username.username);
            const result = await response.json();
            console.log(result);
            setRestaurant(result)

        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        getRestaurantbyUsername();


    }, []);


    return (
        <SafeAreaView style={container}>
            <View style={header}>
                <Text style={headerTitle}>
                    หน้าหลัก
                </Text>
            </View>
            <View style={styles.flexrtLogo}>
                <View style={styles.boxlogoRes}>
                    <Image style={styles.logoRes} source={{ uri: apiheader + '/image/getRestaurantIcon/' + restaurant._id }} />
                </View>
                <Text style={styles.restaurantname}>{restaurant.restaurantName}</Text>
            </View>
            <Text style={styles.title}>รายการ</Text>
            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity onPress={() => navigation.navigate("Tables", { restaurant_id: restaurant._id })}>
                    <View>

                        <View style={styles.item}>
                            <View style={styles.itemIcon}>
                                <MaterialIcons name="table-restaurant" size={100} color="gray" />

                            </View>
                        </View>
                        <Text style={styles.itemTitle}>จัดการโต๊ะ</Text>

                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Menus", { restaurant_id: restaurant._id })}>
                    <View >

                        <View style={styles.item}>
                            <View style={styles.itemIcon}>
                                <MaterialIcons name="restaurant-menu" size={100} color="gray" />

                            </View>

                        </View>
                        <Text style={styles.itemTitle}>เพิ่มเมนู</Text>
                    </View>

                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("allReservations", { restaurant_id: restaurant._id })}>
                    <View >

                        <View style={styles.item}>
                            <View style={styles.itemIcon}>
                                <Entypo name="list" size={100} color="gray" />

                            </View>

                        </View>
                        <Text style={styles.itemTitle}>การจอง</Text>
                    </View>

                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("allsetting", { restaurant_id: restaurant._id })}>
                    <View >

                        <View style={styles.item}>
                            <View style={styles.itemIcon}>
                                <Ionicons name="settings-outline" size={100} color="gray" />
                            </View>

                        </View>
                        <Text style={styles.itemTitle}>ตั่งค่า</Text>
                    </View>

                </TouchableOpacity>

            </View>
        </SafeAreaView>


    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }, header: {
        backgroundColor: '#ff8a24',
        height: 90,
        justifyContent: 'center'

    }, headerTitle: {
        textAlign: 'center',
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',

    },
    flexrtLogo: {
        flexDirection: 'row',
        marginLeft:20,
        marginTop:20
    },
    boxlogoRes: {
        width: 70,
        height: 70,
        borderRadius: 50,
        backgroundColor: 'gray'
    },
    logoRes: {
        width: '100%',
        height: '100%',
        margin: 'auto',
        borderRadius: 50,
    },
    restaurantname: {
        fontSize: 18,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginLeft: 10
    },
    title:{
        fontSize: 18,
        marginLeft:25,
        marginTop:20
    },
    item: {
        width: 150,
        height: 150,
        marginTop: 20,
        marginHorizontal: 15,
        justifyContent: 'center',
        borderRadius: 20,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 4,
        borderRadius: 10,
        backgroundColor: 'white'

    },
    itemIcon: {
        alignSelf: 'center',
    },
    itemTitle: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 15,
        color: 'black',
        marginTop: 10

    }, wrapper: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: "center",
    }, ownerTitle: {
        textAlign: 'center',
        flexWrap: "wrap"

    }
});


export default Index