import React, { useEffect, useState } from 'react';
import { Text, View, SafeAreaView, StyleSheet, StatusBar, FlatList, Modal, ActivityIndicator, Alert, ToastAndroid, TouchableOpacity, Image, Button, TextInput } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import AutoHeightImage from 'react-native-auto-height-image'
import { useFocusEffect } from '@react-navigation/native';
import { EvilIcons } from '@expo/vector-icons';
import axios from 'axios';
import { Appbar } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';


const apiheader = process.env.EXPO_PUBLIC_apiURI;

const Menu = ({ navigation, route }) => {
    const [isLoading, setLoading] = useState(true);
    const [Menu, setMenu] = useState({});
    const [MenuName, setMenuName] = useState();
    const [MenuPrice, setMenuPrice] = useState();
    const [imageuri, setImageUri] = useState("");
    const [addonName, setAddonName] = useState("");
    const [addonPrice, setAddonPrice] = useState("");
    const [addon, setAddon] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);





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

    const getMenu = async () => {
        setLoading(true)
        try {
            const response = await axios.get(apiheader + '/menus/getMenu/' + route.params?.menuid);
            const result = await response.data;
            setMenu(result)
            setImageUri(apiheader + "/image/getMenuIcon/" + result._id)
            setMenuName(result.menuName.toString());
            setMenuPrice(result.price.toString());
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    const getAddons = async () => {
        setLoading(true);
        try {
            const response = await axios.get(apiheader + '/addons/getAddOnByMenuID/' + route.params?.menuid);
            const result = await response.data;
            setAddon(result);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    const fetchAddAddons = async () => {
        setLoading(true)
        try {
            const response = await axios.post(apiheader + '/addons/addAddons/' + route.params?.menuid, { AddOnName: addonName, price: addonPrice });
            const result = await response.data;
            ToastAndroid.showWithGravityAndOffset('เพิ่มสำเร็จ', ToastAndroid.SHORT, ToastAndroid.BOTTOM, 25, 50)
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            getAddons();
        }
    };
    const fetchDelete = async (item) => {
        setLoading(true)
        try {
            const result = await axios.get(apiheader + '/addons/deleteaddon/' + item);
            const res = result.data
            if (res.status == "deleted") {
                ToastAndroid.showWithGravityAndOffset('ลบเสร็จสิ้น', ToastAndroid.SHORT, ToastAndroid.BOTTOM, 25, 50)
                getAddons();
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const fetchDeleteMenu = async () => {
        setLoading(true)    
        try {
            const result = await axios.delete(apiheader + '/menus/delete/' + Menu._id);
            const res = result.data
            if (res.status == "deleted") {
                ToastAndroid.showWithGravityAndOffset('ลบเสร็จสิ้น', ToastAndroid.SHORT, ToastAndroid.BOTTOM, 25, 50)
                navigation.navigate("Menus")
                getAddons();
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }
    const fetchEditMenu = async (item) => {
        setLoading(true)
        try {
            const result = await axios.put(apiheader + '/menus/edit/' + Menu._id, { menuName: MenuName, price: MenuPrice });
            const res = result.data
            console.log(res)
            if (res.status == "edited") {
                ToastAndroid.showWithGravityAndOffset('แก้ไขเสร็จสิ้น', ToastAndroid.SHORT, ToastAndroid.BOTTOM, 25, 50)
                getMenu();
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        getMenu();
        getAddons();
    }, []);
    const ConfirmButton = ({ }) => {
        if (MenuPrice != Menu.price || MenuName != Menu.menuName) {
            return (
                    <View>
                        <TouchableOpacity style={styles.editButton} onPress={() => Alert.alert('คุณต้องการแก้ไขหรือไม่ ', 'คุณต้องการแก้ไขข้อมูลของเมนูหรือไม่ ', [
                            {
                                text: 'ยกเลิก',
                            },
                            { text: 'ยืนยัน', onPress: () => fetchEditMenu() },
                        ])}>
                            <Text style={{ color: "white" }}>ยืนยัน</Text>
                        </TouchableOpacity>
                    </View>
            )
        }
    };


    return (
        
        <ScrollView style={{ flex: 1 }}>
            {isLoading && <View style={styles.activityIndicatorBody}>
                <ActivityIndicator size="large" color='#ff8a24' animating={isLoading} />
            </View>}

            <SafeAreaView style={styles.container}>
                <View style={styles.centeredView}>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {

                            setModalVisible(!modalVisible);

                        }}>
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <TextInput
                                    placeholder='ชื่อ Addon'
                                    placeholderTextColor='gray'
                                    style={styles.input}
                                    value={addonName}
                                    onChangeText={text => setAddonName(text)}
                                />
                                <TextInput
                                    placeholder='ราคา'
                                    placeholderTextColor='gray'
                                    style={styles.input}
                                    value={addonPrice}
                                    onChangeText={text => setAddonPrice(text)}
                                />
                                <TouchableOpacity
                                    style={[styles.button, styles.buttonAdd]} onPress={() => { fetchAddAddons(); setModalVisible(!modalVisible); setAddonName(""); setAddonPrice(""); getAddons(); }}>
                                    <Text style={styles.textStyle}>เพิ่ม Addon</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => {
                                        setModalVisible(!modalVisible);
                                        setAddonName("");
                                        setAddonPrice("");
                                    }}>
                                    <Text style={styles.textStyle}>ยกเลิก</Text>
                                </TouchableOpacity>

                            </View>
                        </View>
                    </Modal>
                </View>
                {imageuri &&
                    <View style={styles.image}>
                        <AutoHeightImage
                            width={250}
                            height={250}
                            source={{ uri: imageuri }}
                            borderRadius={5}
                            style={{ alignSelf: 'center' }}
                        />
                    </View>
                }
                <View style={styles.textHeader}>
                    <Text>ชื่อ :</Text>
                    <TextInput
                        placeholder='ชื่อเมนู'
                        placeholderTextColor='gray'
                        style={styles.input}
                        value={MenuName}
                        onChangeText={text => setMenuName(text)}
                    />
                    <View>
                        <Text>ราคา :</Text>
                        <TextInput
                            placeholder='ราคา'
                            placeholderTextColor='gray'
                            style={styles.input}
                            value={MenuPrice}
                            onChangeText={text => setMenuPrice(text)}
                        />
                    </View>
                    <View>
                        <TouchableOpacity style={styles.deleteButton} onPress={() => Alert.alert('คุณต้องการลบหรือไม่ ', 'คุณต้องการลบช้อมูลนี้หรือไม่ ', [
                            {
                                text: 'ยกเลิก',
                            },
                            { text: 'ยืนยัน', onPress: () => fetchDeleteMenu() },
                        ])}>
                            <Text style={{ color: "white" }}>ลบ</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.addonContainer}>
                    <Text>Addons เพิ่มเติม :</Text>
                    {addon != undefined || addon == [] ? addon.map((item, index) => (
                        addon && index == undefined ? (
                            <View key={item.id}><Text>เมนูนี้ยังไม่มี Addon!</Text></View>
                        ) : (
                            <View key={index} style={{ flexDirection: "row" }}>
                                <Text>{item.AddOnName} {item.price}   </Text>
                                <TouchableOpacity onPress={() => { fetchDelete(item._id); }}>
                                    <Text style={{ color: "red" }}>ลบ</Text>
                                </TouchableOpacity>

                            </View>
                        )
                    )) : <View><Text>กำลังโหลดข้อมูล!</Text></View>}
                    <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(!modalVisible)}>
                        <Text style={{ color: "white" }}>เพิ่ม Addon</Text>
                    </TouchableOpacity>
                    <ConfirmButton />
                </View>


            </SafeAreaView>

        </ScrollView>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    loadingindi: {
        position: 'absolute',
        top: 30,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center'
    }, textHeader: {
        marginLeft: 30,
        marginTop: 30,
    }, restaurantname: {
        fontSize: 25
    }, restaurantID: {
        fontSize: 13,

    }, image: {
        width: 250,
        height: 250,
        alignContent: "center",
        justifyContent: 'center',
        alignSelf: 'center',
    }, addonContainer: {
        margin: 30
    }, addButton: {
        backgroundColor: '#ff8a24',
        width: 120,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,

    },


    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: "80%"
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: 'red',
        marginTop: 5
    },
    buttonAdd: {
        backgroundColor: 'green',

    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    }, centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    }, input: {
        borderWidth: 1,
        color: 'black',
        borderColor: 'black',
        borderRadius: 5,
        width: '80%',
        padding: 10,
        marginBottom: 10,
        alignSelf: 'center',
        marginTop: 10
    }, editButton: {
        backgroundColor: '#ff8a24',
        width: 120,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        alignSelf: 'flex-end'

    }, activityIndicatorBody: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        alignSelf: 'center',
        justifyContent: 'center'
    }, deleteButton: {
        backgroundColor: 'red',
        width: 120,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,

    }


})

export default Menu
