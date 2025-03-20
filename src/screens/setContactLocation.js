import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import axios from 'axios';
import "react-native-get-random-values";
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
const googlemap = 'AIzaSyC_fdB6VOZvieVkKPSHdIFhIlVuhhXynyw';
const apiheader = process.env.EXPO_PUBLIC_apiURI;
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import Text from '../components/Text';

const SetContactLocationScreen = ({ navigation, route }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const { restaurant_id } = route.params;
    const [location, setLocation] = useState({
        latitude: 15.87,
        longitude: 100.9925,
    });
    const [existingAddress, setExistingAddress] = useState('');

    useEffect(() => {
        const fetchRestaurantData = async () => {
            try {
                const response = await axios.get(apiheader + '/restaurants/' + restaurant_id);
                const restaurant = response.data;
                setExistingAddress(restaurant.location?.address || '');
                setAddress(restaurant.location?.address || '');
            } catch (error) {
                console.error(error);
                Alert.alert('Error', 'Failed to fetch restaurant data');
            }
        };


        fetchRestaurantData();

        const fetchLocation = async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission to access location was denied');
                return;
            }

            const currentLocation = await Location.getCurrentPositionAsync({});
            setLocation({
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
            });
        };

        fetchLocation();
    }, [restaurant_id]);

    const saveRestaurantData = async () => {
        if (address === existingAddress) {
            Alert.alert('Warning', 'The address is the same as the existing address.');
            return;
        }

        try {
            const response = await axios.put(apiheader + '/restaurants/seveLocation/' + restaurant_id, {
                address,
                latitude: location.latitude,
                longitude: location.longitude,
            });
            Alert.alert('Success', 'Restaurant location saved successfully');
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to save restaurant location');
        }
    };

    const handleSearch = (details) => {
        if (details) {
            const { lat, lng } = details.geometry.location;
            setLocation({ latitude: lat, longitude: lng });
            setAddress(details.formatted_address);
        }
    };

    return (
        <View
            style={{ flex: 1 }}
        >
            <LinearGradient colors={['#FB992C', '#EC7A45']} start={{ x: 0.2, y: 0.8 }} style={styles.header}>
                <View style={{ flexWrap: 'wrap', alignSelf: 'center', marginLeft: 20, marginTop: 35 }}>
                    <MaterialIcons name="arrow-back-ios" size={24} color="white"
                        onPress={() => navigation.dispatch(CommonActions.goBack())}
                    />

                </View>

                <Text style={styles.headerTitle}>
                    ตั้งค่าที่อยู่
                </Text>
            </LinearGradient>
            <View style={styles.container}>
                <Text>ช่องทางการติดต่อ</Text>
                <TextInput
                    placeholder='เบอร์โทรศัพท์'
                    placeholderTextColor='gray'
                    style={styles.input}
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                />
                <Text>ที่อยู่ร้านอาหาร</Text>
                    <GooglePlacesAutocomplete
                        placeholder={address}
                        minLength={5}
                        fetchDetails={true}
                        onPress={(data, details = null) => {
                            handleSearch(details);
                        }}
                        styles={{
                            textInput: styles.input,
                        }}
                        query={{
                            key: googlemap,
                            language: 'th',
                        }}

                        onFail={(error) => {
                            console.error(error);
                            Alert.alert('เกิดข้อผิดพลาดในการค้นหาสถานที่');
                        }}
                    />

                <MapView
                    style={styles.map}
                    showsUserLocation={true}
                    initialRegion={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    <Marker
                        coordinate={location}
                        draggable
                        onDragEnd={(e) => setLocation(e.nativeEvent.coordinate)}
                    />
                </MapView>
                <TouchableOpacity
                    style={styles.searchButton}
                    onPress={saveRestaurantData}
                >
                    <Text style={styles.searchButtonText}>ยืนยันที่อยู่</Text>
                </TouchableOpacity>
            </View>

        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10,
        margin: 20,
    },
    input: {
        borderBottomWidth: 1,
        borderColor: 'gray',
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#f2f2f2',

    },
    map: {
        height: 300,
        marginVertical: 20,
    },
    searchButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        marginVertical: 20,
        alignItems: 'center',
    },
    searchButtonText: {
        color: '#fff',
        fontWeight: 'bold',
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

export default SetContactLocationScreen;