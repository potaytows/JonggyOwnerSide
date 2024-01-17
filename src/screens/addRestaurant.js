import React, { useEffect, useState } from 'react';
import { Text, View, SafeAreaView, StyleSheet, StatusBar, FlatList, TextInput, ActivityIndicator,ToastAndroid, TouchableOpacity, Image, Button, Alert } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import AutoHeightImage from 'react-native-auto-height-image'

const apiheader = process.env.EXPO_PUBLIC_apiURI;

const AddRestaurant = ({ navigation, route }) => {
    const [isLoading, setLoading] = useState(true);
    const [restaurantName, onRestaurantNameChange] = React.useState('');


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

    const showAddedToast =()=>{
        ToastAndroid.showWithGravityAndOffset('Added '+restaurantName,ToastAndroid.LONG,ToastAndroid.BOTTOM,25,50)
    }
    const Ifloading = () => {
        if (isLoading) {
            return null;
        }
        return null;
    }


    const fetchAddRestaurant = async ()=>{
        setLoading(true);
        console.log(restaurantName)
        try {
            const fetchOptions={
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body: JSON.stringify({restaurantName:restaurantName})
            };
            const response = await fetch(apiheader + '/restaurants/addRestaurant',fetchOptions);
            const result = await response.json();
            console.log(result);
            navigation.navigate("allRestaurants")
            showAddedToast();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }

    }

    useEffect(() => {
        // loadImage();

    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.restaurantNameCont}>
                <Text>ชื่อร้านอาหาร</Text>
                <View style={{width:200,height:35,marginTop:5}}>
                <TextInput
                    style={styles.input}
                    onChangeText={onRestaurantNameChange}
                    value={restaurantName}
                />

                </View>
            </View>
            <View style={styles.addButtonCont}>
            <TouchableOpacity style={styles.addButton} onPress={()=>fetchAddRestaurant()}>
                <Text style={{color:"white"}}>ยืนยัน</Text>

            </TouchableOpacity>
            </View>
            



        </SafeAreaView>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    loadingindi: {
        position: 'absolute',
        top: 30,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },input: {
        borderWidth: 1,
        flex:1,
        borderRadius:5,
        padding:10
      },restaurantNameCont:{
        marginHorizontal:20,
        marginTop:10    
      },addButton:{
        backgroundColor:'#ff8a24',
        width:120,
        height:30,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal:20,
        borderRadius:10,
        alignSelf:'flex-end',
        marginBottom:30

    },addButtonCont:{
        flex:1,
        justifyContent:'flex-end'
    }


})

export default AddRestaurant
