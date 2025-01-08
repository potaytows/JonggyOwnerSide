import { View, SafeAreaView, StyleSheet, StatusBar, FlatList, TextInput, ActivityIndicator, TouchableOpacity, Switch } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';
import * as SecureStore from 'expo-secure-store';
import Dragable from '../components/dragable';
import React, { useEffect, useState } from 'react';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';
import axios from 'axios';
import Text from '../components/Text';
import { LinearGradient } from 'expo-linear-gradient';
const apiheader = process.env.EXPO_PUBLIC_apiURI;
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect, StackActions } from '@react-navigation/native';
import { Image } from 'expo-image';
const Index = ({ navigation }) => {
    const { container, header, headerTitle, } = styles
    const [restaurant, setRestaurant] = useState({});
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    const getRestaurantbyUsername = async () => {
        try {
            const userauth = await SecureStore.getItemAsync('userAuth');
            const username = JSON.parse(userauth)
            const response = await axios.get(apiheader + '/restaurants/getByUsername/' + username.username);
            const result = await response.data;
            if (result == null) {
                navigation.dispatch(StackActions.replace('Login'));


            } else {
                setRestaurant(result)
                if (result.status == "closed") {
                    setIsEnabled(false);
                } if (result.status == "open") {
                    setIsEnabled(true);
                }

            }


        } catch (error) {
            console.error(error);
        }
    };
    const ToggleRestaurantStatus = async () => {
        try {
            const userauth = await SecureStore.getItemAsync('userAuth');
            const username = JSON.parse(userauth)
            const response = await axios.post(apiheader + '/restaurants/toggleRestaurantStatus/' + restaurant._id, { username: username.username });
            const result = await response.data;
            console.log(result)
            if (result.status == "closed") {
                setIsEnabled(false);
            } if (result.status == "open") {
                setIsEnabled(true);
            }
            setRestaurant(result)

        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        getRestaurantbyUsername();


    }, []);
        useFocusEffect(
            React.useCallback(() => {
                getRestaurantbyUsername();
            }, [])
        );

    return (
        <SafeAreaView style={container}>
            <LinearGradient colors={['#FB992C', '#EC7A45']} start={{ x: 0.2, y: 0.8 }} style={header}>
                <Text style={headerTitle}>
                    JONGGY
                </Text>
            </LinearGradient>
            <View style={styles.restaurantHeader}>
                <View style={styles.restaurantBanner}>

                    <Image source={apiheader + '/image/getRestaurantIcon/' + restaurant._id+"/"+Math.round(Math.random()*1000000000).toString()} width={100} height={100} style={styles.restaurantimage} />
                    <View style={styles.restaurantInfo}>

                        <Text style={{ fontSize: 20 }}>{restaurant.restaurantName}</Text>
                        {isEnabled ?
                            <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center' }}>
                                <View style={{ backgroundColor: '#31a24c', width: 15, height: 15, borderRadius: 50 }}></View>
                                <Text style={{ fontSize: 15, marginLeft: 4 }}>กำลังเปิดให้บริการ</Text>
                            </View>


                            :
                            <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center' }}>
                                <View style={{ backgroundColor: 'gray', width: 15, height: 15, borderRadius: 50 }}></View>
                                <Text style={{ fontSize: 15, marginLeft: 4 }}>ปิดทำการ</Text>
                            </View>
                        }

                        <View style={{ flexWrap: 'wrap' }}>

                            <Switch
                                trackColor={{ false: '#FFBD59', true: '#FFBD59' }}
                                thumbColor={isEnabled ? 'white' : 'white'}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={ToggleRestaurantStatus}
                                value={isEnabled}
                            />

                        </View>
                    </View>
                </View>

            </View>
            <Text style={{ fontSize: 20, marginLeft: 30 }}>
                รายการ
            </Text>
            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>

                <TouchableOpacity onPress={() => navigation.navigate("Tables", { restaurant_id: restaurant._id })} activeOpacity={1}>
                    <View>

                        <View style={styles.item}>
                            <View style={styles.itemIcon}>
                                <MaterialIcons name="table-restaurant" size={100} color="black" />

                            </View>
                        </View>
                        <Text style={styles.itemTitle}>จัดการโต๊ะ</Text>

                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Menus", { restaurant_id: restaurant._id })} activeOpacity={1}>
                    <View >

                        <View style={styles.item}>
                            <View style={styles.itemIcon}>
                                <MaterialIcons name="restaurant-menu" size={100} color="black" />

                            </View>

                        </View>
                        <Text style={styles.itemTitle}>เพิ่มเมนู</Text>
                    </View>

                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("allReservations", { restaurant_id: restaurant._id })} activeOpacity={1}>
                    <View >

                        <View style={styles.item}>
                            <View style={styles.itemIcon}>
                                <Entypo name="list" size={100} color="black" />

                            </View>

                        </View>
                        <Text style={styles.itemTitle}>การจอง</Text>
                    </View>

                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("allsetting", { restaurant_id: restaurant._id })} activeOpacity={1}>
                    <View >

                        <View style={styles.item}>
                            <View style={styles.itemIcon}>
                                <Ionicons name="settings-outline" size={100} color="black" />
                            </View>

                        </View>
                        <Text style={styles.itemTitle}>การตั้งค่า</Text>
                    </View>

                </TouchableOpacity>

            </View>
        </SafeAreaView>


    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '# ',
        flex: 1
    }, header: {
        height: 109,
        justifyContent: 'center',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10

    }, headerTitle: {
        color: 'white',
        fontSize: 36,
        fontWeight: 'bold',
        marginLeft: 20,
        marginTop: 45,

    }, item: {
        backgroundColor: 'white',
        width: 131,
        height: 131,
        marginTop: 20,
        marginHorizontal: 15,
        justifyContent: 'center',
        borderRadius: 20,
        shadowOffset: {
            width: 0,
            height: 0.1,
        },
        shadowOpacity: 0.23,
        shadowRadius: 0.61,
        elevation: 5,

    },
    itemIcon: {
        alignSelf: 'center',
    },
    itemTitle: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 16,
        color: 'black'

    }, wrapper: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: "center",
    }, ownerTitle: {
        textAlign: 'center',
        flexWrap: "wrap"

    }, restaurantHeader: {
        height: 150,
        alignContent: 'center',
        justifyContent: 'center'
    }, restaurantBanner: {
        height: 100,
        flexDirection: 'row'
    }, restaurantimage: {
        borderRadius: 30,
        marginLeft: 20
    }, restaurantInfo: {
        marginLeft: 20

    }
});


export default Index