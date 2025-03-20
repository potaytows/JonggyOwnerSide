import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';
import Text from '../components/Text';
import io from 'socket.io-client';
import MapViewDirections from 'react-native-maps-directions';
import { CommonActions } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
const apiheader = process.env.EXPO_PUBLIC_apiURI;
const socket = io(apiheader);
import moment from 'moment';
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

            <ScrollView>
                <LinearGradient colors={['#FB992C', '#EC7A45']} start={{ x: 0.2, y: 0.8 }} style={styles.header}>
                    <View style={{ flexWrap: 'wrap', alignSelf: 'center', marginLeft: 20, marginTop: 35 }}>
                        <MaterialIcons name="arrow-back-ios" size={24} color="white"
                            onPress={() => navigation.dispatch(CommonActions.goBack())} />
                    </View>
                    <Text style={styles.headerTitle}>
                        การจอง
                    </Text>
                </LinearGradient>
                <View style={styles.container2}>

                    <View style={[styles.details,
                    reservation.status === "ยืนยันแล้ว" && { borderColor: 'green' },
                    reservation.status === "ยกเลิกการจองแล้ว" && { borderColor: 'red' }]}>
                        <Text>รหัสการจอง: {reservation._id}</Text>
                        <Text>เวลา:  {moment(reservation.startTime).utc().format('Do MMMM HH:mm')} - {moment(reservation.endTime).utc().format('Do MMMM HH:mm')}</Text>

                        <Text>โต๊ะ: {reservation.reservedTables.map(table => table.text).join(', ')}</Text>
                        <Text style={[styles.statusres,
                        reservation.status === "ยืนยันแล้ว" && { color: 'green' },
                        reservation.status === "ยกเลิกการจองแล้ว" && { color: 'red' }]}>{reservation.status}</Text>
                    </View>
                    <View style={styles.cardmanu}>
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
                                            <Text style={styles.Count}>{order.Count}</Text>
                                        </View>
                                        <View style={styles.MenuLi4}>
                                            <Text style={styles.totalPrice}>฿{order.totalPrice}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        ))}
                        <Text style={styles.totalReservation}>ราคารวม ฿{reservation.total}</Text>
                    </View>
                </View>
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
                        <Text style={styles.buttonText}>แชท</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleCancelReservation}>
                    <Text style={styles.buttonTexts}>ยกเลิกการจอง</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 20
    },
    container2:{
marginLeft:15,
marginRight:15
    },
    chat: {
        flexDirection: 'row',
        margin: 10
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
    buttonText: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        color: 'gray',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 5,
    },
    buttonChat: {
        flex: 1,
        justifyContent: 'center',
        marginLeft: 5,
    },
    cardmanu: {
        backgroundColor: 'white',
        padding: 10,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 5,
    },
    details: {
        margin: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        margin: 10,
    },
    totalPrice: {
        fontWeight: 'bold',
        textAlign: 'right',
    },
    totalReservation: {
        fontSize: 18,
        fontWeight: 'bold',
        margin: 20,
        textAlign: 'right',
    },
    MenuTitle: {
        flexDirection: 'row',
        margin: 10,
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
        height: 300,
        margin: 10
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

    }, buttonTexts: {
        marginLeft: 10,
    },
    details: {
        marginTop:15,
        marginBottom: 20,
        borderLeftWidth: 10,
        borderColor: 'gray',
        borderRadius: 10,
        backgroundColor: 'white',
        padding: 10,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 5,
    },

});

export default LocationScreen;