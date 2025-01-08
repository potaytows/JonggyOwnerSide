import React, { useEffect, useState } from 'react';
import { Text, View, SafeAreaView, StyleSheet, StatusBar, FlatList, Modal, ActivityIndicator, Alert, ToastAndroid, TouchableOpacity, Image, Button, TextInput } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import AutoHeightImage from 'react-native-auto-height-image'
import { useFocusEffect } from '@react-navigation/native';
import { EvilIcons } from '@expo/vector-icons';
import axios from 'axios';
import { Appbar } from 'react-native-paper';
import { CommonActions } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
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
            <LinearGradient colors={['#FB992C', '#EC7A45']} start={{ x: 0.2, y: 0.8 }} style={styles.header}>
                    <View style={{ flexWrap: 'wrap', alignSelf: 'center', marginLeft: 20, marginTop: 35 }}>
                        <MaterialIcons name="arrow-back-ios" size={24} color="white"
                            onPress={() => navigation.dispatch(CommonActions.goBack())} />
                    </View>
                    <Text style={styles.headerTitle}>
                        แก้ไขเมนูอาหาร
                    </Text>
                </LinearGradient>
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
                                <View  style={{ width:'100%'}}>
                                <TextInput
                                    placeholder='ชื่อ Addon'
                                    placeholderTextColor='gray'
                                    style={styles.inputs}
                                    value={addonName}
                                    onChangeText={text => setAddonName(text)}
                                />
                                <TextInput
                                    placeholder='ราคา'
                                    placeholderTextColor='gray'
                                    style={styles.inputs}
                                    value={addonPrice}
                                    onChangeText={text => setAddonPrice(text)}
                                />
                                </View>
                                <View  style={{flexDirection:'row', marginTop:20}}>
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
                        </View>
                    </Modal>
                </View>
                {imageuri &&
                    <View style={styles.image}>
                        <Image
                            width={200}
                            height={200}
                            source={{ uri: imageuri }}
                            borderRadius={5}
                            style={{ alignSelf: 'center' }}
                        />
                    </View>
                }
                <View style={styles.textHeader}>
                    <View style={styles.layoutEditManu}>
                        <Text>แก้ไขชื่อ</Text>
                        <TextInput
                            placeholder='ชื่อเมนู'
                            placeholderTextColor='gray'
                            style={styles.input}
                            value={MenuName}
                            onChangeText={text => setMenuName(text)}
                        />
                    </View>
                    <View>
                        <View style={styles.layoutEditManuname}>
                            <TextInput
                                placeholder='ราคา'
                                placeholderTextColor='gray'
                                style={styles.input2}
                                value={MenuPrice}
                                onChangeText={text => setMenuPrice(text)}
                            />
                        </View>

                    </View>
                    <View>

                    </View>
                </View>
                <View style={styles.addonContainer}>
                    <Text style={styles.addontitle}>Addons เพิ่มเติม</Text>
                    <View style={{ flexDirection: "row" }}>
                        <Text style={styles.addname}>ขื่อ Addons</Text>
                        <Text style={styles.addprice}>ราคา</Text>
                        <Text style={styles.addname}></Text>
                    </View>

                    {addon != undefined || addon == [] ? addon.map((item, index) => (
                        addon && index == undefined ? (
                            <View key={item.id}><Text>เมนูนี้ยังไม่มี Addon!</Text></View>
                        ) : (

                            <View key={index} style={{ flexDirection: "row" }}>
                                <Text style={styles.addonList}>{item.AddOnName}</Text>
                                <Text style={styles.addonList}> {item.price}</Text>

                                <TouchableOpacity onPress={() => { fetchDelete(item._id); }}>
                                    <Text style={styles.deleteAddon}>ลบ</Text>
                                </TouchableOpacity>

                            </View>
                        )
                    )) : <View><Text>กำลังโหลดข้อมูล!</Text></View>}
                    <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(!modalVisible)}>
                        <Text style={{ color: "white" }}>เพิ่ม Addon</Text>
                    </TouchableOpacity>
                   
                </View>
                <View style={styles.ButtonContainer}>
                <ConfirmButton />
                    <TouchableOpacity style={styles.deleteButton} onPress={() => Alert.alert('คุณต้องการลบหรือไม่ ', 'คุณต้องการลบช้อมูลนี้หรือไม่ ', [
                        {
                            text: 'ยกเลิก',
                        },
                        { text: 'ยืนยัน', onPress: () => fetchDeleteMenu() },
                    ])}>
                        <Text style={{ color: "white" }}>ลบ</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

        </ScrollView>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingindi: {
        position: 'absolute',
        top: 30,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center'
    }, textHeader: {

        marginTop: 30,
    }, restaurantname: {
        fontSize: 25
    }, restaurantID: {
        fontSize: 13,

    }, image: {
        alignContent: "center",
        justifyContent: 'center',
        alignSelf: 'center',

    }, 
    ButtonContainer:{
        flexDirection:'row',
        marginLeft: 20,
        marginRight:20,
        padding: 20,
        borderRadius: 10,
        backgroundColor: 'white',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 5,
    },
    addonContainer: {
        margin: 20,
        marginTop: 10,
        padding: 20,
        borderRadius: 10,
        backgroundColor: 'white',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 5,

    },
    addontitle: {
        textAlign: 'center',
        fontSize: 16,
    },
    addonList: {
        flex: 1,
        marginTop: 10,
        fontSize: 16
    },
    deleteAddon: {
        fontSize: 16,
        marginTop: 10,
        color: 'red'

    },
    addname: {
        flex: 1,
        fontSize: 16,
        color: 'gray',
        marginTop: 10,



    },
    addprice: {
        flex: 1,
        fontSize: 16,
        color: 'gray',
        marginTop: 10,
        textAlign: 'center'

    },
    inputs:{
        marginTop:10,
        padding:10,
        borderRadius:10,
        backgroundColor: 'white',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 5,
    },

    addButton: {
        marginTop: 10,
        backgroundColor: '#ff8a24',
        padding: 10,
        paddingLeft: 20,
        paddingRight: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,

    },
    layoutEditManuname: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 10,
        marginLeft: 20,
        marginRight: 20,
        borderRadius: 10,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 5,
        marginTop: 10
    },
    layoutEditManu: {
        backgroundColor: 'white',
        padding: 10,
        marginLeft: 20,
        marginRight: 20,
        borderRadius: 10,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 5,
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
        borderRadius: 10,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: 'red',
        padding:10,
        paddingLeft:20,
        paddingRight:20,
        marginLeft:10
    },
    buttonAdd: {
        backgroundColor: 'green',
        padding:10,
        paddingLeft:20,
        paddingRight:20
    

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
        borderWidth: 0,
        marginBottom: 10,
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
        marginLeft:10
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


})

export default Menu