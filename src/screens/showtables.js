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
    const [newpresetname, setNewPresetName] = useState("");

    const setNewPreset = async (id) => {
        setLoading(true);
        try {
            const response = await axios.get(apiheader + '/preset/setpreset/' + route.params.restaurant_id + "/" + id);
            const data = response.data;
            getTables();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getTables = async () => {
        setLoading(true);
        try {
            const response = await axios.get(apiheader + '/tables/getbyRestaurantId/' + route.params.restaurant_id);
            const result = await response.data;
            setData(result.activePreset || []);
            setNewPresetName(result.activePreset.presetName || "");
            setPresets(result.presets || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

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
            const username = JSON.parse(userauth);
            const response = await axios.get(apiheader + '/restaurants/getByUsername/' + username.username);
            const result = await response.data;
            setRestaurant(result);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchAddPreset = async (name) => {
        setLoading(true);
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
        setLoading(true);
        try {
            const response = await axios.put(apiheader + '/preset/edit/' + route.params.restaurant_id, { presetName: name });
            console.log(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            getTables();
            setEditPresetName(false);
        }
    };

    const deletePreset = async (id) => {
        setLoading(true);
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
    };

    useEffect(() => {
        getTables();
        getRestaurantbyUsername();
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <LinearGradient colors={['#FB992C', '#EC7A45']} start={{ x: 0.2, y: 0.8 }} style={styles.header}>
                <View style={{ flexWrap: 'wrap', alignSelf: 'center', marginLeft: 20, marginTop: 35 }}>
                    <MaterialIcons name="arrow-back-ios" size={24} color="white" onPress={() => navigation.dispatch(CommonActions.goBack())} />
                </View>
                <Text style={styles.headerTitle}>จัดการที่นั่ง</Text>
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
                                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', left: 12 }}>
                                                <TouchableOpacity style={{ width: 30, alignContent: 'center', alignItems: 'center' }} onPress={() => { editPresetName(newpresetname) }}>
                                                    <MaterialIcons name="save-as" size={24} color="orange" />
                                                </TouchableOpacity>
                                                <TouchableOpacity style={{ width: 30, alignContent: 'center', alignItems: 'center' }} onPress={() => { setEditPresetName(false) }}>
                                                    <MaterialIcons name="not-interested" size={24} color="red" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                ) : (
                                    <View style={styles.presetDropdown}>
                                        <Picker
                                            selectedValue={obj._id}
                                            onValueChange={(itemValue, itemIndex) => setNewPreset(itemValue)}
                                            mode='dropdown'
                                            style={{ width: 200, borderRadius: 20 }}
                                        >
                                            {presets.map((item, index) => (
                                                <Picker.Item label={item.presetName} value={item._id} key={index} />
                                            ))}
                                        </Picker>

                                        <TouchableOpacity style={{ width: 30, alignContent: 'center', alignItems: 'center' }} onPress={() => { setModal(true) }}>
                                            <MaterialIcons name="add" size={24} color="orange" />
                                        </TouchableOpacity>
                                    </View>
                                )}

                                {obj?.tables?.length > 0 ? (
                                    <View style={styles.dragablecontainer}>
                                        {obj.tables.map((item, index) => (
                                            <TouchableOpacity key={index} onPress={() => setModal(true)}>
                                                <StaticTable key={index} id={item._id} x={item.x} y={item.y} item={item} changeStatus={changeStatus} />
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                ) : (
                                    <View style={styles.dragablecontainer}></View>
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

                    {/* Modal */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={presetmodal}
                        onRequestClose={() => {
                            setModal(!presetmodal);
                        }}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.AddPreset}>
                                <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 15, textAlign: "center", color: "#BBBBBB", width: 70 }}>ชื่อ Preset</Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={setnewName}
                                        value={newPresetname}
                                        placeholder="ชื่อ Preset"
                                    />
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
                    </Modal>
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        justifyContent: 'center',
        alignContent: 'center',
        paddingBottom: 20
    },
    header: {
        height: 109,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        flexDirection: 'row',
    },
    headerTitle: {
        color: 'white',
        fontSize: 36,
        fontWeight: 'bold',
        marginLeft: 20,
        marginTop: 45,
    },
    restaurantHeader: {
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
    },
    restaurantBanner: {
        height: 100,
        flexDirection: 'row'
    },
    restaurantimage: {
        borderRadius: 30,
        marginLeft: 20
    },
    restaurantInfo: {
        marginLeft: 20
    },
    dragablecontainer: {
        width: '96%',
        height: 450,
        alignSelf: 'center',
        marginTop: 40,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: '#CCCCCC',
        backgroundColor: 'white',
    },
    editButton: {
        marginTop: 50,
        backgroundColor: "#FF9F00",
        marginBottom: 10,
        padding: 15,
        borderRadius: 10,
        alignItems: "center"
    },
    editButtonText: {
        color: "white",
        fontWeight: 'bold',
        fontSize: 18
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 999
    },
    AddPreset: {
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
    },
    input: {
        fontSize: 18,
        width: 180,
        height: 40,
        borderBottomWidth: 1,
        borderColor: "#BBBBBB",
        paddingLeft: 10,
    },
    inputlabel2: {
        flexDirection: 'row',
        marginTop: 20,
    },
    cancelButton: {
        width: 90,
        paddingVertical: 10,
        backgroundColor: "#9e9e9e",
        borderRadius: 20,
    },
    addButton: {
        marginLeft: 10,
        width: 90,
        paddingVertical: 10,
        backgroundColor: "#FF9F00",
        borderRadius: 20,
    },
});

export default ShowTables;
