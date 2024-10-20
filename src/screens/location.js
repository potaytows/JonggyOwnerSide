import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator,Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';
import io from 'socket.io-client';
import MapViewDirections from 'react-native-maps-directions';

const apiheader = process.env.EXPO_PUBLIC_apiURI;
const socket = io(apiheader);

const LocationScreen = ({ route, navigation }) => {
    const { reservation } = route.params;
    const [location, setLocation] = useState(null);
    const [receivedLocation, setReceivedLocation] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRestaurantLocation = async () => {
            try {
                const response = await axios.get(`${apiheader}/reservation/getLocationById/${reservation.restaurant_id._id}`);
                setLocation(response.data);

            } catch (error) {
                console.error(error);
                Alert.alert('Error', 'Failed to fetch restaurant location');
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurantLocation();
    }, [reservation]);

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                const response = await axios.get(`${apiheader}/reservation/userLocation/${reservation._id}`);
                if (response.data.locationCustomer) {
                    setReceivedLocation(response.data.locationCustomer);
                }
            } catch (error) {
                console.error('Error fetching location:', error);
            }
        };
        const intervalId = setInterval(fetchLocation, 5000);
        return () => clearInterval(intervalId);
    }, [reservation]);

    const handleCancelReservation = () => {
        Alert.alert(
            "ยกเลิกการจอง",
            "คุณแน่ใจหรือไม่ว่าต้องการยกเลิกการจองนี้?",
            [
                { text: "ยกเลิก", style: "cancel" },
                {
                    text: "ยืนยัน",
                    onPress: async () => {
                        try {
                            await axios.put(`${apiheader}/reservation/cancelReservation/${reservation._id}`);
                            Alert.alert("การจองถูกยกเลิกเรียบร้อยแล้ว");
                            navigation.goBack();
                        } catch (error) {
                            console.error(error);
                            Alert.alert("เกิดข้อผิดพลาดในการยกเลิกการจอง");
                        }
                    }
                }
            ]
        );
    };

    const handleButtonPress = () => {
        navigation.navigate('Chat', {
            reservationID: reservation._id,
        });
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.details}>
                <Text>รหัสการจอง: {reservation._id}</Text>
                <Text>เวลา: {reservation.createdAt}</Text>
                <Text>โต๊ะ: {reservation.reservedTables.map(table => table.tableName).join(', ')}</Text>
            </View>

            <Text style={styles.sectionTitle}>รายการอาหาร</Text>
            <View style={styles.MenuTitle}>
                <View style={styles.MenuLi1}><Text style={styles.Ui}>เมนู</Text></View>
                <View style={styles.MenuLi2}><Text style={styles.Ui}></Text></View>
                <View style={styles.MenuLi3}><Text style={styles.Ui}>จำนวน</Text></View>
                <View style={styles.MenuLi4}><Text style={styles.totalPrice}>ราคา</Text></View>
            </View>
            {reservation.orderedFood.map((order, index) => (
                <View key={index} style={styles.foodContainer}>
                    <View style={styles.foodDetails}>
                        <View style={styles.MenuTitle}>
                            <View style={styles.MenuLi1}>
                                {order.selectedMenuItem.map((item, itemIndex) => (
                                    <Text key={itemIndex} style={styles.foodItem}>{item.menuName}</Text>
                                ))}
                            </View>
                            <View style={styles.MenuLi2}>
                                {order.selectedAddons.map((addon, addonIndex) => (
                                    <Text key={addonIndex} style={styles.addonItem}>{addon.AddOnName}</Text>
                                ))}
                            </View>
                            <View style={styles.MenuLi3}>
                                <Text style={styles.Count}>8</Text>
                            </View>
                            <View style={styles.MenuLi4}>
                                <Text style={styles.totalPrice}>฿{order.totalPrice}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            ))}

            <Text style={styles.totalReservation}>ราคารวม ฿{reservation.total}</Text>
            {location && (
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: location.coordinates.latitude,
                        longitude: location.coordinates.longitude,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005,
                    }}
                >
                    <Marker
                        coordinate={{
                            latitude: location.coordinates.latitude,
                            longitude: location.coordinates.longitude,
                        }}
                        title={reservation.restaurant_id.restaurantName}
                        description={location.address}
                    />
                   {receivedLocation && (
                        <>
                            <Marker
                                coordinate={{
                                    latitude: receivedLocation.latitude,
                                    longitude: receivedLocation.longitude,
                                }}
                            >
                                <Image source={require('../../assets/images/gpsNavigation.png')} style={{ height: 40, width: 40 }} />
                            </Marker>

                            <MapViewDirections
                                origin={{
                                    latitude: receivedLocation.latitude,
                                    longitude: receivedLocation.longitude,
                                }}
                                destination={{
                                    latitude: location.coordinates.latitude,
                                    longitude: location.coordinates.longitude,
                                }}
                                apikey='AIzaSyC_fdB6VOZvieVkKPSHdIFhIlVuhhXynyw'
                                strokeWidth={5}
                                strokeColor="#FF914D"
                            />
                        </>
                    )}
                </MapView>
            )}

            <TouchableOpacity style={styles.chat} onPress={handleButtonPress}>
                <View style={styles.image}></View>
                <View style={styles.buttonChat}>
                    <Text style={styles.textChat}>แชทกับร้านค้า</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleCancelReservation}>
                <Text style={styles.buttonText}>ยกเลิกการจอง</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white',
    },
    chat: {
        flexDirection: 'row',
    },
    image: {
        width: 50,
        height: 50,
        backgroundColor: 'gray',
        borderRadius: 50,
    },
    textChat: {
        backgroundColor: 'gray',
        padding: 10,
        borderRadius: 10,
        color: 'white',
    },
    buttonChat: {
        flex: 1,
        justifyContent: 'center',
        marginLeft: 5,
    },
    details: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    totalPrice: {
        fontWeight: 'bold',
        textAlign: 'right',
    },
    totalReservation: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        textAlign: 'right',
    },
    MenuTitle: {
        width: '100%',
        flexDirection: 'row',
        marginTop: 10,
    },
    MenuLi1: {
        flex: 3,
    },
    MenuLi2: {
        flex: 3,
    },
    MenuLi3: {
        flex: 2,
    },
    MenuLi4: {
        flex: 1,
    },
    Count: {
        marginLeft: 10,
    },
    map: {
        width: '100%',
        height: 300,
    },
});

export default LocationScreen;
