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
    const getPresets = async () => {
        try {
            const response = await axios.get(apiheader + '/preset/getpresetByRestaurantid/' + route.params.restaurant_id);
            const result = await response.data;
            setData(result)
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
        getPresets();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            getPresets();
        }, [])
    );

    return (
        <View style={{ flex: 1 }}>
            <LinearGradient colors={['#FB992C', '#EC7A45']} start={{ x: 0.2, y: 0.8 }} style={styles.header}>
                <View style={{ flexWrap: 'wrap', alignSelf: 'center', marginLeft: 20, marginTop: 35 }}>
                    <MaterialIcons name="arrow-back-ios" size={24} color="white"
                        onPress={() => navigation.dispatch(CommonActions.goBack())}
                    />

                </View>

                <Text style={styles.headerTitle}>
                    เลือก Preset
                </Text>
            </LinearGradient>
            <ScrollView>

                <View style={styles.container}>
                    {obj.map((item, index) => (
                        <Text>{item.presetName}</Text>
                    ))}

                </View>
            </ScrollView>
        </View>
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

    }
});


export default ShowTables