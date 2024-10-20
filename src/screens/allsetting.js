import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { HeaderBackButton } from '@react-navigation/stack';
import * as SecureStore from 'expo-secure-store';
import { useFocusEffect } from '@react-navigation/native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';

const apiheader = process.env.EXPO_PUBLIC_apiURI;

const AllSettingScreen = ({navigation,route }) => {
    
    
    const handlerToLocation = () => {
        navigation.navigate('setContactLocation', {
            restaurant_id: route.params.restaurant_id
        });
      };
console.log(route.params.restaurant_id)
    return (
        <View style={styles.container}>
            <View style={styles.laout}>
                <View style={styles.Other}>
                    <View>
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
                    </View>
                    <View>
                        <TouchableOpacity style={styles.buttonSetting3} onPress={handlerToLocation} >
                            <Ionicons name="settings-outline" size={100} color="white" />
                        </TouchableOpacity>
                        <Text style={styles.text}>ที่อยู่ร้านอาหาร</Text>
                    </View>
                    <View>
                        <TouchableOpacity style={styles.buttonSetting4} >
                            <Ionicons name="settings-outline" size={100} color="white" />
                        </TouchableOpacity>
                        <Text style={styles.text}>ยังคิดไม่ออก</Text>
                    </View>

                </View>
            </View>
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
        backgroundColor: 'red',
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
        fontWeight: 'bold'
    },
});

export default AllSettingScreen;
