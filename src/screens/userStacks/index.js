import { Text, View, SafeAreaView, StyleSheet, StatusBar, FlatList, TextInput, ActivityIndicator, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react';

import * as SecureStore from 'expo-secure-store';
const apiheader = process.env.EXPO_PUBLIC_apiURI;

const Index = ({ navigation }) => {
    const { container, header, headerTitle, } = styles

    const ClearLogin =()=>{
        SecureStore.deleteItemAsync('userAuth')
        console.log('cleared Auth')
        navigation.navigate('Login')
    }

    return (
        <SafeAreaView style={container}>
            <TouchableOpacity style={styles.button} onPress={ClearLogin} >
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
        </SafeAreaView>


    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
    },button: {
        backgroundColor: '#FF914D',
        width: '40%',
        padding: 10,
        marginTop: 20,
        alignSelf: 'center',
        borderRadius: 5
    }
});


export default Index