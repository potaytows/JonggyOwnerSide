import React, { useEffect, useState } from 'react';
import { View, Button, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { HeaderBackButton } from '@react-navigation/stack';
import * as SecureStore from 'expo-secure-store';
import { useFocusEffect } from '@react-navigation/native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
const apiheader = process.env.EXPO_PUBLIC_apiURI;
import { CommonActions } from '@react-navigation/native';
import Text from '../components/Text';

const AllSettingScreen = ({ navigation, route }) => {


    const handlerToLocation = () => {
        navigation.navigate('setContactLocation', {
            restaurant_id: route.params.restaurant_id
        });
    };

    const toEditRestaurant = () => {
        navigation.navigate('EditRestaurant', {
            restaurant_id: route.params.restaurant_id
        });
    };
    return (

        <View style={{ flex: 1 }}>
            <LinearGradient colors={['#FB992C', '#EC7A45']} start={{ x: 0.2, y: 0.8 }} style={styles.header}>
                <View style={{ flexWrap: 'wrap', alignSelf: 'center', marginLeft: 20, marginTop: 35 }}>
                    <MaterialIcons name="arrow-back-ios" size={24} color="white"
                        onPress={() => navigation.dispatch(CommonActions.goBack())}
                    />

                </View>

                <Text style={styles.headerTitle}>
                    ตั้งค่า
                </Text>
            </LinearGradient>
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.laout}>
                        <View style={styles.Other}>
                            {/* <View>
                            <TouchableOpacity style={styles.buttonSetting1}  >
                                <Ionicons name="settings-outline" size={100} color="white" />
                            </TouchableOpacity>
                            <Text style={styles.text}>เวลาเปิด-ปิด</Text>
                        </View>
                        <View>
                            <TouchableOpacity style={styles.buttonSetting2} >
                                <Ionicons name="settings-outline" size={100} color="white" />
                            </TouchableOpacity>
                            <Text style={styles.text}>วันที่ทำการ</Text>
                        </View> */}
                         <View>
                                <TouchableOpacity style={styles.buttonSetting3} onPress={toEditRestaurant} >
                                    <MaterialIcons name="edit-document" size={70} color="#FB992C" />
                                </TouchableOpacity>
                                <Text style={styles.text}>ข้อมูลร้าน</Text>
                            </View>
                            <View>
                                <TouchableOpacity style={styles.buttonSetting3} onPress={handlerToLocation} >
                                    <MaterialIcons name="edit-location-alt" size={70} color="#FB992C" />
                                </TouchableOpacity>
                                <Text style={styles.text}>ที่อยู่ร้านอาหาร</Text>
                            </View>
                           


                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 50,
        margin: 30,
    },
    buttonSetting1: {
        width: 150,
        height: 150,
        backgroundColor: 'blue',
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonSetting2: {
        width: 150,
        height: 150,
        backgroundColor: 'green',
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonSetting3: {
        width: 150,
        height: 150,
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonSetting4: {
        width: 150,
        height: 150,
        backgroundColor: 'orange',
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    Other: {
        flexDirection: 'row',
        flexWrap: "wrap",
        justifyContent: 'center'
    },
    text: {
        textAlign: 'center',
        fontSize: 18,
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

export default AllSettingScreen;