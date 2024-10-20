import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import axios from 'axios';
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

const googlemap = 'AIzaSyC_fdB6VOZvieVkKPSHdIFhIlVuhhXynyw';
const apiheader = process.env.EXPO_PUBLIC_apiURI;

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
                const response = await axios.get(apiheader+'/restaurants/'+restaurant_id);
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
            const response = await axios.put(apiheader+'/restaurants/seveLocation/'+restaurant_id, {
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
                minLength={2}
                fetchDetails={true}
                onPress={(data, details = null) => {
                    handleSearch(details);
                }}
                query={{
                    key: googlemap,
                    language: 'th',
                }}
                styles={{
                    textInput: styles.input,
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
    },
});

export default SetContactLocationScreen;