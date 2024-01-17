import { Text, View, SafeAreaView, StyleSheet, StatusBar, FlatList, TextInput, ActivityIndicator, TouchableOpacity, Image } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';
import * as SecureStore from 'expo-secure-store';
import Dragable from '../components/dragable';
import React, { useEffect, useState } from 'react';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const apiheader = process.env.EXPO_PUBLIC_apiURI;

const Index = ({ navigation }) => {
    const { container, header, headerTitle, } = styles
    const [restaurant,setRestaurant] = useState({});

    const getRestaurantbyUsername = async () => {
        try {
            const userauth = await SecureStore.getItemAsync('userAuth');
            const username = JSON.parse(userauth)
            const response = await fetch(apiheader + '/restaurants/getByUsername/' + username.username );
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
            <View style={styles.wrapper}>

            </View>
            <View style={header}>
                <Text style={headerTitle}>
                    หน้าหลัก
                </Text>

            </View>

            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>
                <TouchableOpacity onPress={() => navigation.navigate("Tables",{restaurant_id:restaurant._id})}>
                    <View style={{ height: 150 }}>
                        <View style={styles.item}>

                        </View>
                        <Text style={styles.itemTitle}>จัดการโต๊ะ</Text>


                    </View>

                </TouchableOpacity>


            </View>




        </SafeAreaView>


    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
    }, header: {
        backgroundColor: '#ff8a24',
        height: 90,
        justifyContent: 'center'

    }, headerTitle: {
        textAlign: 'center',
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',

    }, item: {
        backgroundColor: 'gray',
        width: 150,
        height: 150,
        marginTop: 20,
        marginHorizontal: 15

    }, itemTitle: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 15,
        color: 'black'

    }, wrapper: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: "center",
    }, ownerTitle: {
        textAlign: 'center',
        flexWrap:"wrap"

    }
});


export default Index