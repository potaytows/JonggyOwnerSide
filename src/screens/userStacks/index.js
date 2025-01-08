import { Text, View, SafeAreaView, StyleSheet, StatusBar, FlatList, TextInput, ActivityIndicator, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react';
import { useFocusEffect, StackActions } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
const apiheader = process.env.EXPO_PUBLIC_apiURI;

const Index = ({ navigation }) => {
    const { container, header, headerTitle, } = styles

    const ClearLogin = () => {
        SecureStore.deleteItemAsync('userAuth')
        console.log('cleared Auth')
        navigation.dispatch(StackActions.replace('Login'));
    }

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#FB992C', '#EC7A45']} start={{ x: 0.2, y: 0.8 }} style={styles.header}>

                <Text style={styles.headerTitle}>
                    ผู้ใช้
                </Text>
            </LinearGradient>
            <TouchableOpacity style={styles.button} onPress={ClearLogin} >
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
        </View>


    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        height:'100%'
    }, button: {
        backgroundColor: '#FF914D',
        width: '40%',
        padding: 10,
        marginTop: 20,
        alignSelf: 'center',
        borderRadius: 5
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

    },buttonText:{
        color:'white'
    }

});


export default Index