import React, { useEffect, useState } from 'react';
import { Text, View, SafeAreaView, StyleSheet, StatusBar, FlatList, TextInput, ActivityIndicator, ToastAndroid, TouchableOpacity, Image, Button, Alert } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import AutoHeightImage from 'react-native-auto-height-image'
import { useFocusEffect } from '@react-navigation/native';
import { EvilIcons } from '@expo/vector-icons';


const apiheader = process.env.EXPO_PUBLIC_apiURI;

const Restaurant = ({ navigation, route }) => {
    const [isLoading, setLoading] = useState(true);
    const [Restaurant, setData] = useState([]);
    const [owner, setOwner] = useState("")
    const [newowner, setNewOwner] = useState("");
    const [imagePlace, setImage] = useState("");
    const [screenState, setScreenState] = useState("");
    const [isDrafting,setDrafting] = useState(false);


    const CheckState = () => {
        if (!owner && !newowner) {
            setScreenState("noOwner")

        } if (!owner && newowner) {
            setScreenState("drafting")

        } if (owner) {
            setScreenState("haveowner")


        }

    }

    const ConfirmButton = ({ }) => {
        if (screenState == "noOwner") {
            return (

                <View style={styles.DisabledaddButton}>
                    <Text style={{ color: "white" }}>ยืนยัน</Text>
                </View>
            )
        } if (screenState == "drafting") {
            return (

                <View>
                    <TouchableOpacity style={styles.addButton} onPress={() => fetchAddOwner()}>
                        <Text style={{ color: "white" }}>ยืนยัน</Text>
                    </TouchableOpacity>
                </View>
            )
        } if (screenState == "haveowner") {
            return (

                <View style={styles.DisabledaddButton}>
                    <Text style={{ color: "white" }}>ยืนยัน</Text>
                </View>
            )
        }
    };


    const OwnerComp = ({ }) => {
        if (screenState == "noOwner") {
            return (
                <View>
                    <Text style={{ marginVertical: 5 }}>ผู้ดูแล:</Text>
                    <TouchableOpacity style={styles.ownerButton} onPress={() => navigation.navigate("addOwner", { restaurant_id: route.params.restaurant_id })}>
                        <Text numberOfLines={1} style={{ color: "black" }}>ร้านนี้ยังไม่มีผู้ดูแล</Text>

                    </TouchableOpacity>
                </View>

            )
        } if (screenState == "drafting") {
            return (
                <View>
                    <Text style={{ marginVertical: 5 }}>ผู้ดูแล:(Drafting)</Text>
                    <View style={styles.ownerButton}>
                        <Text numberOfLines={1} style={{ color: "black" }}>{newowner}</Text>
                        <TouchableOpacity onPress={() => setNewOwner("")}>
                            <EvilIcons name="close" size={20} color="red" />

                        </TouchableOpacity>


                    </View>
                </View>

            )
        } if (screenState == "haveowner") {
            return (
                <View>
                    <Text style={{ marginVertical: 5 }}>ผู้ดูแล:</Text>
                    <View style={styles.ownerButton}>
                        <Text numberOfLines={1} style={{ color: "black" }}>{owner}</Text>
                        <TouchableOpacity onPress={() => {setOwner("");setDrafting(true);}}>
                            <EvilIcons name="close" size={20} color="red" />

                        </TouchableOpacity>


                    </View>
                </View>

            )


        }

    };


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


    const Ifloading = () => {
        if (isLoading) {
            return null;
        }
        return null;
    }
    const showDeleteToast = () => {
        ToastAndroid.showWithGravityAndOffset('Deleted ', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50)
    }
    const fetchAddOwner = async () => {
        try {
            const fetchOptions = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ owner: newowner })
            };
            const response = await fetch(apiheader + '/restaurants/edit/' + route.params.restaurant_id, fetchOptions);
            const result = await response.json();
            console.log(result);
            setDrafting(false)
            navigation.navigate("allRestaurants")
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }

    }
    const getRestaurants = async () => {
        try {
            const response = await fetch(apiheader + '/restaurants/' + route.params?.restaurant_id);
            const result = await response.json();
            setData(result)
            setOwner(result.owner)
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    const fetchdeleteRestaurant = async () => {
        try {
            const fetchOptions = {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            };
            const response = await fetch(process.env.EXPO_PUBLIC_apiURI + '/restaurants/delete/' + route.params.restaurant_id, fetchOptions);
            const result = await response.json();
            console.log(result);

            navigation.navigate("allRestaurants")
            showDeleteToast();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }

    }
    useEffect(() => {
        CheckState();

    });
    useEffect(() => {
        getRestaurants();

    }, []);
    useFocusEffect(
        React.useCallback(() => {
            setNewOwner(route.params?.newOwner);
        }, [route.params])
      );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.textHeader}>
                <Text style={styles.restaurantname}>{Restaurant.restaurantName}</Text>
                <Text style={styles.restaurantID}>ID :{Restaurant._id}</Text>


            </View>
            <View style={styles.middle}>
                <View style={styles.middleleft}>
                    <OwnerComp />

                </View>
                <View style={styles.middleright}>
                    <TouchableOpacity style={styles.deleteButton} onPress={() => fetchdeleteRestaurant()}>
                        <Text style={{ color: "white" }}>ลบ</Text>

                    </TouchableOpacity>

                </View>



            </View>
            <View style={styles.addButtonCont}>
                <ConfirmButton />
            </View>

        </SafeAreaView>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    loadingindi: {
        position: 'absolute',
        top: 30,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center'
    }, deleteButton: {
        backgroundColor: "red",
        width: 120,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        alignSelf: 'flex-end'

    }, textHeader: {
        marginLeft: 20,
        marginTop: 20,
    }, restaurantname: {
        fontSize: 25
    }, restaurantID: {
        fontSize: 13,

    }, middle: {
        marginLeft: 20,
        flex: 1,
        flexDirection: "row",
        marginTop: 30

    }, ownerButton: {
        backgroundColor: "white",
        width: 120,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3,
        borderColor: "black",
        borderWidth: 1,
        flexDirection: 'row'

    }, middleleft: {
        flex: 1
    }, middleright: {
        marginRight: 20,
        flex: 1,
        marginTop: 30
    }, addButton: {
        backgroundColor: '#ff8a24',
        width: 120,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        borderRadius: 10,
        alignSelf: 'flex-end',
        marginBottom: 30

    }, addButtonCont: {
        flex: 1,
        justifyContent: 'flex-end'
    }, DisabledaddButton: {
        backgroundColor: 'gray',
        width: 120,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        borderRadius: 10,
        alignSelf: 'flex-end',
        marginBottom: 30

    }


})

export default Restaurant
