
import { StyleSheet, View, Button, Modal, TextInput, TouchableOpacity, ToastAndroid, Pressable, Image, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import Text from '../components/Text';
import StaticTable from '../components/staticTable';
import { Picker } from '@react-native-picker/picker';
import { isLoaded } from 'expo-font';
const apiheader = process.env.EXPO_PUBLIC_apiURI;
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const ShowTables = ({ route, navigation }) => {
    const [obj, setData] = useState([]);
    const [presets, setPresets] = useState([]);
    const [restaurant, setRestaurant] = useState({});
    const [newPresetname, setnewName] = useState();
    const [presetmodal, setModal] = useState(false);
    const [isEdittingPresetName, setEditPresetName] = useState(false);
    const [loading, setLoading] = useState(false);
    const [newpresetname, setNewPresetName] = useState("")

    const setNewPreset = async (id) => {
        setLoading(true)
        try {
            const response = await axios.get(apiheader + '/preset/setpreset/' + route.params.restaurant_id + "/" + id);
            const data = response.data;
            getTables();

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false)
        }

    }
    const getTables = async () => {
        setLoading(true)
        try {
            const response = await axios.get(apiheader + '/tables/getbyRestaurantId/' + route.params.restaurant_id);
            const result = await response.data;
            setData(result.activePreset || []);
            setNewPresetName(result.activePreset.presetName || "");
            setPresets(result.presets || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false)
        }

    }
    const changeStatus = async (item) => {
        try {
            const response = await axios.get(apiheader + '/tables/changestatus/' + item._id);
            const result = await response.data;
            getTables();
        } catch (error) {
            console.error(error);
        }
    };
    const getRestaurantbyUsername = async () => {
        try {
            const userauth = await SecureStore.getItemAsync('userAuth');
            const username = JSON.parse(userauth)
            const response = await axios.get(apiheader + '/restaurants/getByUsername/' + username.username);
            const result = await response.data;
            setRestaurant(result)
        } catch (error) {
            console.error(error);
        }
    };
    const fetchAddPreset = async (name) => {
        setLoading(true)
        try {
            const response = await axios.post(apiheader + '/preset/addpreset/' + route.params.restaurant_id, { presetName: name });
            console.log(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setModal(false);
            getTables();
        }
    };
    const editPresetName = async (name) => {
        setLoading(true)
        try {
            const response = await axios.put(apiheader + '/preset/edit/' + route.params.restaurant_id, { presetName: name });
            console.log(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            getTables();
            setEditPresetName(false);
        }

    }
    const deletePreset = async (id) => {
        setLoading(true)
        try {
            const response = await axios.delete(apiheader + '/preset/delete/' + id);
            setPresets([]);
            setData([]);
            setNewPresetName("");
            setPresets([]);
        } catch (error) {
            console.error(error);
        } finally {
            getTables();
        }

    }
    useEffect(() => {
        getTables();
        getRestaurantbyUsername();

    }, []);

    useFocusEffect(
        React.useCallback(() => {
            getTables();
            getRestaurantbyUsername();
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
                    จัดการที่นั่ง
                </Text>
            </LinearGradient>
            {loading ? (
                <View style={styles.centeredView}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>

            ) : (
                <ScrollView>

                    <View style={styles.container}>

                        <View style={styles.restaurantHeader}>
                            <View style={styles.restaurantBanner}>
                                <Image source={{ uri: `${apiheader}/image/getRestaurantIcon/${restaurant._id}?timestamp=${new Date().getTime()}` }} width={100} height={100} style={styles.restaurantimage} />
                                <View style={styles.restaurantInfo}>
                                    <Text style={{ fontSize: 20 }}>{restaurant.restaurantName}</Text>
                                </View>
                            </View>
                        </View>
                        <View>
                            {presets && presets.length !== undefined && presets.length > 0 ? (
                                <View style={{ flex: 1 }}>

                                    {isEdittingPresetName ? (
                                        <View>
                                            <View style={styles.presetDropdown}>
                                                <View style={{ width: 175 }}>
                                                    <TextInput
                                                        onChangeText={setNewPresetName}
                                                        value={newpresetname}
                                                        placeholder="ชื่อ Preset"
                                                        style={{ fontSize: 15 }}
                                                    />
                                                </View>
                                                {newpresetname != obj.presetName ? (
                                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', left: 12 }}>
                                                        <TouchableOpacity style={{ width: 30, alignContent: 'center', alignItems: 'center' }} onPress={() => { editPresetName(newpresetname) }}>
                                                            <MaterialIcons name="save-as" size={24} color="orange" />
                                                        </TouchableOpacity>
                                                        <TouchableOpacity style={{ width: 30, alignContent: 'center', alignItems: 'center' }} onPress={() => { setEditPresetName(false) }}>
                                                            <MaterialIcons name="not-interested" size={24} color="red" />
                                                        </TouchableOpacity>
                                                    </View>
                                                ) : (
                                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', left: 12 }}>
                                                        <View style={{ width: 30, alignContent: 'center', alignItems: 'center', height: 0 }}>
                                                            <MaterialIcons name="not-interested" size={24} color="red" />

                                                        </View>
                                                        <TouchableOpacity style={{ width: 30, alignContent: 'center', alignItems: 'center' }} onPress={() => { setEditPresetName(false) }}>
                                                            <MaterialIcons name="not-interested" size={24} color="red" />

                                                        </TouchableOpacity>
                                                    </View>
                                                )}



                                            </View>
                                        </View>
                                    ) : (

                                        <View style={styles.presetDropdown}>
                                            <Text style={styles.LayoutText}>รูปแบบ</Text>
                                            {presets && presets.length !== undefined && presets.length > 0 ? (

                                                <Picker
                                                    selectedValue={obj._id}
                                                    onValueChange={(itemValue, itemIndex) =>
                                                        setNewPreset(itemValue)
                                                    }
                                                    mode='dropdown'
                                                    style={styles.Layout}

                                                >
                                                    {presets.map((item, index) => (
                                                        <Picker.Item label={item.presetName} value={item._id} key={item._id} />

                                                    ))}
                                                </Picker>
                                            ) : (
                                                <View></View>
                                            )}

                                            <TouchableOpacity style={{ width: 30, alignContent: 'center', alignItems: 'center' }} onPress={() => { setModal(true) }}>
                                                <MaterialIcons name="add" size={24} color="orange" />
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{ width: 30, alignContent: 'center', alignItems: 'center' }} onPress={() => { setEditPresetName(true), setNewPresetName(obj.presetName) }}>
                                                <MaterialIcons name="edit" size={20} color="orange" />
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{ width: 30, alignContent: 'center', alignItems: 'center' }} onPress={() => { deletePreset(obj._id) }}>
                                                <MaterialIcons name="delete" size={20} color="red" />
                                            </TouchableOpacity>

                                        </View>
                                    )}
                                    {obj?.tables?.length > 0 ? (
                                        <View style={styles.dragablecontainer}>
                                            {obj.tables.map((item, index) => (
                                                <StaticTable
                                                    key={index}
                                                    id={item._id}
                                                    x={item.x}
                                                    y={item.y}
                                                    item={item}
                                                    changeStatus={changeStatus}
                                                />
                                            ))}
                                        </View>
                                    ) : (
                                        <View style={styles.dragablecontainer}>


                                        </View>
                                    )}

                                    <TouchableOpacity style={[styles.editButton]} onPress={() => { navigation.navigate("EditTables", { restaurant_id: restaurant._id }) }}>
                                        <Text style={styles.editButtonText}>แก้ไขที่นั่ง</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View>
                                    <TouchableOpacity style={[styles.editButton]} onPress={() => { setModal(true) }}>
                                        <Text style={styles.editButtonText}>สร้าง Preset ใหม่</Text>
                                    </TouchableOpacity>
                                </View>

                            )}
                        </View>




                    </View>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={presetmodal}
                        onRequestClose={() => {
                            setModal(!presetmodal);
                        }}>
                        <View style={styles.centeredView}>

                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <View style={styles.AddPreset}>
                                    <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center' }}>
                                        <View style={{ flexWrap: 'wrap', alignContent: 'center', width: 70 }}>
                                            <Text style={{ fontSize: 15, textAlign: "center", color: "#BBBBBB", }}>ชื่อ Preset</Text>
                                        </View>
                                        <View style={[styles.inputlabel]}>
                                            <TextInput
                                                style={styles.input}
                                                onChangeText={setnewName}
                                                value={newPresetname}
                                                placeholder="ชื่อ Preset"
                                            />
                                        </View>
                                    </View>
                                    <View style={[styles.inputlabel2]}>
                                        <TouchableOpacity style={styles.cancelButton} onPress={() => { setModal(!presetmodal); setnewName(""); }} activeOpacity={1}>
                                            <Text style={{ color: 'white', textAlign: "center" }}>ยกเลิก</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.addButton]} onPress={() => { fetchAddPreset(newPresetname); }} activeOpacity={1}>
                                            <Text style={{ color: 'white', textAlign: "center" }}>เพิ่ม</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </ScrollView>
            )}


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

    }, restaurantHeader: {
        height: 150,
        alignContent: 'center',
        justifyContent: 'center',
        backgroundColor: "white",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 5,
        marginBottom: 40
    }, restaurantBanner: {
        height: 100,
        flexDirection: 'row'
    }, restaurantimage: {
        borderRadius: 30,
        marginLeft: 20
    }, restaurantInfo: {
        marginLeft: 20

    }, dragablecontainer: {
        // justifyContent: 'center',
        // alignItems: 'center',
        width: screenWidth * 0.96,
        height: 450,
        alignSelf: 'center',
        marginTop: 40,
        borderWidth: 2,
        borderRadius: 5,
        marginBottom: 20,
        backgroundColor: 'white',
        borderColor: '#CCCCCC',
        overflow: 'hidden'
    }, editButton: {
        width: 327,
        height: 36,
        backgroundColor: '#FF7A00',
        alignSelf: 'center',
        borderRadius: 3,
        justifyContent: 'center',
        alignContent: 'center',
    }, editButtonText: {
        fontSize: 16,
        color: 'white',
        textAlign: 'center',
        alignSelf: 'center',
    }, presetDropdown: {
        flexDirection: 'row',
        flex: 1,
        alignContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        height: 50,
    }, AddPreset: {
        width: 350,
        alignSelf: 'center',
        borderWidth: 2,
        borderRadius: 10,
        marginBottom: 20,
        backgroundColor: 'white',
        borderColor: '#CCCCCC',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 1,
        paddingHorizontal: 40,
        paddingVertical: 20,
        alignContent: 'center',
        justifyContent: 'center',

    }, cancelButton: {
        backgroundColor: "#FF3131",
        width: 141,
        height: 31,
        borderRadius: 20,
        alignContent: 'center',
        justifyContent: 'center',
        margin: 5
    }, centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    }, inputlabel: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 5,
        alignSelf: 'center',
        alignContent: 'center'
    }, input: {
        color: 'black',
        width: 100,
        alignSelf: 'center',
        fontSize: 15,
        fontFamily: 'Kanit-Regular',
        flexDirection: "row",
        alignItems: "center",
        width: 200,
        backgroundColor: '#F0F0F0',
        borderRadius: 5,
        alignSelf: 'center',
        paddingLeft: 10
    }, inputlabel2: {
        flexDirection: "row",
        alignContent: "center",
        alignItems: "center",
        width: 300,
        justifyContent: 'center',
        alignSelf: 'center'
    }, addButton: {
        backgroundColor: "#FF7A00",
        width: 141,
        height: 31,
        borderRadius: 20,
        alignContent: 'center',
        justifyContent: 'center',
        margin: 5,

    },
    Layout: {
        width: 200,
        backgroundColor: 'white',
        shadowOffset: {
            width: 0,
            height: 0.1,
        },
        shadowOpacity: 0.23,
        shadowRadius: 0.61,
        elevation: 5,
        borderRadius: 20,
        overflow: 'hidden',
    },
    PickerR: {
        flex: 1,
        backgroundColor: 'red',

    },
    LayoutText: {
        marginRight: 10,
        fontSize: 16
    }
});


export default ShowTables
