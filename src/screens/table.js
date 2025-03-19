import { StyleSheet, View, Button, Modal, TextInput, TouchableOpacity, ToastAndroid, ScrollView, Image } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Dragable from '../components/dragable';
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useFocusEffect, StackActions } from '@react-navigation/native';
import ColorPicker, { Panel1, Swatches, Preview, OpacitySlider, HueSlider } from 'reanimated-color-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Text from '../components/Text';
import { CommonActions } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store'
import { Dimensions } from 'react-native';
import moment from 'moment-timezone';

const screenWidth = Dimensions.get('window').width;
const apiheader = process.env.EXPO_PUBLIC_apiURI;

const Table = ({ route, navigation }) => {
    const [obj, setData] = useState([]);
    const [shapeHeight, setShapeHeight] = useState();
    const [shapeWidth, setShapeWidth] = useState();
    const [newShapeHeight, setNewHeight] = useState("");
    const [newShapeWidth, setNewWidth] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [colorpickerModal, setColorPicker] = useState(false);
    const [EditmodalVisible, setEditModal] = useState(false);
    const [addModes, setAddModes] = useState("");
    const [editModes, setEditModes] = useState("table");
    const [originalname, setOriginal] = useState([]);
    const [edittable, setEditTable] = useState([]);
    const [edittableName, setEditTableName] = useState("");
    const [newText, setNewText] = useState("");
    const [newTableName, setNewTableName] = useState("");
    const [restaurant, setRestaurant] = useState({});
    const [loading, setLoading] = useState(false);
    const [selectedColor, setSelectedColor] = useState("#ff8a24");
    const scrollViewRef = useRef();


    const getTables = async () => {
        setLoading(true)
        try {
            const response = await axios.get(apiheader + '/tables/getbyRestaurantId/' + route.params.restaurant_id);
            const result = await response.data;
            setData(result.activePreset);


        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false)
        }
    };
    const clearTextInput = async () => {
        try {
            setNewTableName("");
            setNewHeight("");
            setNewWidth("");
            setNewText("");

        } catch (error) {
            console.error(error);
        }
    };

    const onSelectColor = ({ hex }) => {
        setSelectedColor(hex);
        console.log(hex);
    };

    const toEditShapeScreen = async () => {
        navigation.dispatch(StackActions.replace("EditShapeSize", { editShape: edittable, restaurant_id: route.params.restaurant_id }));
    }

    const showEditModal = async (item) => {
        const response = await axios.get(apiheader + '/tables/' + item._id);
        const editingitem = response.data;
        console.log(response.data)
        setEditTable(editingitem);
        if (editingitem.type == "table" || editingitem.type == "text") {
            setEditTableName(editingitem.text);
            setOriginal(editingitem.text);


        } if (item.type == "shape") {
            setNewHeight(editingitem.height.toString());
            setNewWidth(editingitem.width.toString());
            setSelectedColor(editingitem.color);

        }
        setEditModes(editingitem.type);
        setEditModal(!EditmodalVisible);
    };

    const fetchAddDragable = async () => {
        try {
            if (addModes == "table") {
                const response = await axios.post(apiheader + '/tables/addTable', { text: newTableName, restaurant_id: route.params.restaurant_id, type: addModes });
                const result = await response.data;
                getTables();
                clearTextInput();
                ToastAndroid.showWithGravityAndOffset('เพิ่มโต๊ะสำเร็จ!', ToastAndroid.SHORT, ToastAndroid.BOTTOM, 25, 50)
            } if (addModes == "text") {
                const response = await axios.post(apiheader + '/tables/addTable', { text: newText, restaurant_id: route.params.restaurant_id, type: addModes });
                const result = await response.data;
                getTables();
                clearTextInput();
                ToastAndroid.showWithGravityAndOffset('เพิ่ม Text สำเร็จ!', ToastAndroid.SHORT, ToastAndroid.BOTTOM, 25, 50)

            } if (addModes == "shape") {
                const response = await axios.post(apiheader + '/tables/addTable', { height: 100, width: 100, restaurant_id: route.params.restaurant_id, type: addModes, color: selectedColor });
                const result = await response.data;
                setColorPicker("#ff8a24");
                getTables();
                clearTextInput();
                ToastAndroid.showWithGravityAndOffset('เพิ่มสำเร็จ!', ToastAndroid.SHORT, ToastAndroid.BOTTOM, 25, 50)

            }
        } catch (error) {
            console.error(error);
        }
    };


    const fetchEditTable = async () => {
        try {
            const response = await axios.put(apiheader + '/tables/edit/' + edittable._id, { text: edittableName });
            const result = await response.data;
            console.log(result)

            getTables();
            ToastAndroid.showWithGravityAndOffset('แก้ไขสำเร็จ!', ToastAndroid.SHORT, ToastAndroid.BOTTOM, 25, 50)

        } catch (error) {
            console.error(error);
        } finally {
            setEditModal(!EditmodalVisible);
            setEditTableName("");
        }
    };

    const fetchEditShape = async () => {
        try {
            if (parseInt(newShapeWidth) > 375) {
                ToastAndroid.showWithGravityAndOffset('ความยาวมีค่าได้ไม่เกิน 375เท่านั้น!', ToastAndroid.SHORT, ToastAndroid.BOTTOM, 25, 50)
            } if (parseInt(newShapeHeight) > 440) {
                ToastAndroid.showWithGravityAndOffset('ความสูงมีค่าได้ไม่เกิน 440เท่านั้น!', ToastAndroid.SHORT, ToastAndroid.BOTTOM, 25, 50)
            } else {
                console.log("called")
                const response = await axios.put(apiheader + '/tables/edit/' + edittable._id, { width: parseInt(newShapeWidth), height: parseInt(newShapeHeight), color: selectedColor });
                const result = await response.data;
                getTables();
                setEditModal(!EditmodalVisible);
                setEditTable("");
                ToastAndroid.showWithGravityAndOffset('แก้ไขสำเร็จ!', ToastAndroid.SHORT, ToastAndroid.BOTTOM, 25, 50)
            }
        } catch (error) {
            console.error(error);
        }


    };
    const deleteTable = async () => {
        try {
            axios.delete(apiheader + "/tables/delete/" + edittable._id);



        } catch (error) {
            console.error(error);
        } finally {
            setEditModal(!EditmodalVisible);
            getTables();
            setData([]);
            ToastAndroid.showWithGravityAndOffset('ลบเสร็จสิ้น!', ToastAndroid.SHORT, ToastAndroid.BOTTOM, 25, 50)

        }
    };
    const reinitialBound = async (func) => {
        func();

    }
    const getRestaurantbyUsername = async () => {
        try {
            const userauth = await SecureStore.getItemAsync('userAuth');
            const username = JSON.parse(userauth)
            const response = await axios.get(apiheader + '/restaurants/getByUsername/' + username.username);
            const result = await response.data;
            console.log(result);
            setRestaurant(result)
        } catch (error) {
            console.error(error);
        }
    };


    useEffect(() => {
        getTables();
        getRestaurantbyUsername();

    }, []);

    useEffect(() => {
        if (route.params.restaurant_id != undefined) {
            getTables();

        }
        if (route.params.size) {
            const newH = route.params.size.h - 14;
            const newW = route.params.size.w - 14;
            setEditTable(route.params.editShape)
            setNewHeight(newH.toString());
            setNewWidth(newW.toString());
            setEditModes("shape")
            setEditModal(!EditmodalVisible);
            setSelectedColor(route.params.editShape.color)
        }

    }, [route.params.isResized && route.params.restaurant_id && route.params.size]);



    return (
        <ScrollView
            ref={scrollViewRef}
            onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
        >
            <View >
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={EditmodalVisible}
                    onRequestClose={() => {
                        setEditModal(!EditmodalVisible);
                    }}>
                    <View style={styles.centeredView}>
                        {editModes == "table" &&
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <View style={styles.Addtable}>
                                    <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center' }}>
                                        <View style={{ flexWrap: 'wrap', alignContent: 'center', width: 50 }}>
                                            <Text style={{ fontSize: 15, textAlign: "center", color: "#BBBBBB", }}>ชื่อโต๊ะ</Text>
                                        </View>
                                        <View style={[styles.inputlabel]}>
                                            <TextInput
                                                style={styles.input}
                                                onChangeText={setEditTableName}
                                                value={edittableName}
                                                placeholder="ชื่อโต๊ะ"
                                            />
                                        </View>
                                    </View>

                                    <MaterialIcons name="delete-outline" size={24} color="red" style={styles.deleteButton} onPress={() => { deleteTable() }} />
                                    <View style={[styles.inputlabel2]}>
                                        <TouchableOpacity style={styles.cancelButton} onPress={() => { setEditModal(!EditmodalVisible); setEditTable(""); }} activeOpacity={1}>
                                            <Text style={{ color: 'white', textAlign: "center" }}>ยกเลิก</Text>
                                        </TouchableOpacity>
                                        {edittableName != originalname &&
                                            <TouchableOpacity style={[styles.addButton]} onPress={() => { fetchEditTable(); setEditModes(""); }} activeOpacity={1}>
                                                <Text style={{ color: 'white', textAlign: "center" }}>แก้ไข</Text>
                                            </TouchableOpacity>
                                        }
                                    </View>
                                </View>
                            </View>
                        }
                        {editModes == "text" &&
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <View style={styles.Addtable}>
                                    <View style={[styles.inputlabel]}>
                                        <Text style={{ fontSize: 15, textAlign: "center", color: "#BBBBBB", paddingRight: 10 }}>ข้อความ</Text>
                                        <TextInput
                                            style={styles.input}
                                            onChangeText={setEditTableName}
                                            value={edittableName}
                                            placeholder="ข้อความ"
                                        />
                                    </View>
                                    <MaterialIcons name="delete-outline" size={24} color="red" style={styles.deleteButton} onPress={() => { deleteTable() }} />
                                    <View style={[styles.inputlabel2]}>
                                        <TouchableOpacity style={styles.cancelButton} onPress={() => { setEditModal(!EditmodalVisible); setEditTable(""); }} activeOpacity={1}>
                                            <Text style={{ color: 'white', textAlign: "center" }}>ยกเลิก</Text>
                                        </TouchableOpacity>
                                        {edittableName != originalname &&
                                            <TouchableOpacity style={[styles.addButton]} onPress={() => { fetchEditTable(); setEditModes(""); }} activeOpacity={1}>
                                                <Text style={{ color: 'white', textAlign: "center" }}>แก้ไข</Text>
                                            </TouchableOpacity>
                                        }
                                    </View>
                                </View>
                            </View>
                        }
                        {editModes == "shape" &&
                            <View style={styles.Addtable}>
                                <View style={[styles.inputlabel]}>
                                    <Text style={{ fontSize: 15, textAlign: "center", color: "#BBBBBB", paddingRight: 20 }}>Width</Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={setNewWidth}
                                        value={newShapeWidth}
                                        placeholder="W"
                                    />
                                </View>
                                <View style={[styles.inputlabel, { marginTop: 10 }]}>
                                    <Text style={{ fontSize: 15, textAlign: "center", color: "#BBBBBB", paddingRight: 20 }}>Height</Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={setNewHeight}
                                        value={newShapeHeight}
                                        placeholder="H"
                                    />

                                </View>
                                <ColorPicker style={{ width: '100%', alignSelf: 'center', marginTop: 20 }} onComplete={onSelectColor} value={selectedColor}>
                                    <Preview hideInitialColor={true} hideText={true} />
                                    <Panel1 />
                                    <HueSlider />
                                </ColorPicker>
                                <View style={[styles.inputlabel2, { marginTop: 20 }]}>
                                    <MaterialIcons name="delete-outline" size={30} color="red" style={styles.deleteButton} onPress={() => { deleteTable() }} />

                                    <MaterialIcons name="aspect-ratio" size={30} color="black" onPress={() => { toEditShapeScreen() }} />
                                </View>
                                <View style={[styles.inputlabel2, { marginTop: 20 }]}>
                                    <TouchableOpacity style={styles.cancelButton} onPress={() => { setEditModal(!EditmodalVisible); setEditTable(""); }} activeOpacity={1}>
                                        <Text style={{ color: 'white', textAlign: "center" }}>ยกเลิก</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.addButton]} onPress={() => { fetchEditShape(); }} activeOpacity={1}>
                                        <Text style={{ color: 'white', textAlign: "center" }}>แก้ไข</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        }
                    </View>
                </Modal>
            </View>
            <View style={styles.container}>
                <LinearGradient colors={['#FB992C', '#EC7A45']} start={{ x: 0.2, y: 0.8 }} style={styles.header}>
                    <View style={{ flexWrap: 'wrap', alignSelf: 'center', marginLeft: 20, marginTop: 35 }}>
                        <MaterialIcons name="arrow-back-ios" size={24} color="white"
                            onPress={() => navigation.dispatch(CommonActions.goBack())} />
                    </View>
                    <Text style={styles.headerTitle}>
                        จัดการที่นั่ง
                    </Text>
                </LinearGradient>
                <View style={styles.restaurantHeader}>
                    <View style={styles.restaurantBanner}>
                        <Image source={{ uri: `${apiheader}/image/getRestaurantIcon/${restaurant._id}?timestamp=${new Date().getTime()}` }} width={100} height={100} style={styles.restaurantimage} />
                        <View style={styles.restaurantInfo}>
                            <Text style={{ fontSize: 20 }}>{restaurant.restaurantName}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.topper}>
                </View>
                {/* tables rendering */}
                {obj.tables==undefined? (
                    <View style={styles.dragablecontainer}>

                    </View>

                ) : (

                    <View style={styles.dragablecontainer}>

                        {obj.tables.map((item, index) => (
                            <Dragable key={index} id={item._id} x={item.x} y={item.y} item={item} restaurant_id={route.params.restaurant_id}
                                showEditModal={showEditModal}
                                reinitialBound={reinitialBound}
                            >
                            </Dragable>
                        ))}
                    </View>
                )}

                <View style={styles.edittingControlPanel}>
                    <TouchableOpacity style={[styles.circle, addModes == "table" ? styles.selectedMode : styles.unselectedMode]} onPress={() => {
                        setAddModes(addModes == "table" ? "" : "table");
                        setNewTableName("");
                    }} activeOpacity={1}>
                        <MaterialIcons name="table-bar" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.circle, addModes == "text" ? styles.selectedMode : styles.unselectedMode]} onPress={() => {
                        setAddModes(addModes == "text" ? "" : "text");
                        setNewText("")

                    }} activeOpacity={1}>
                        <MaterialIcons name="format-color-text" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.circle, addModes == "shape" ? styles.selectedMode : styles.unselectedMode]} onPress={() => {
                        setAddModes(addModes == "shape" ? "" : "shape");
                    }} activeOpacity={1}>
                        <MaterialIcons name="auto-awesome-motion" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                {addModes == "table" ?
                    <View style={styles.Addtable}>
                        <View style={styles.inputlabel}>
                            <View style={{ flexWrap: 'wrap' }}>
                                <Text style={{ fontSize: 15, textAlign: "center", color: "#BBBBBB" }}>ชื่อโต๊ะ</Text>
                            </View>
                            <TextInput
                                style={styles.input}
                                onChangeText={setNewTableName}
                                value={newTableName}
                                placeholder="ชื่อโต๊ะ"
                            />

                        </View>
                        <View style={[styles.inputlabel2]}>

                            <TouchableOpacity style={styles.cancelButton} onPress={() => { setAddModes(""); }} activeOpacity={1}>
                                <Text style={{ color: 'white', textAlign: "center" }}>ยกเลิก</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.addButton]} onPress={() => { fetchAddDragable(); setAddModes(""); }} activeOpacity={1}>
                                <Text style={{ color: 'white', textAlign: "center" }}>เพิ่ม</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                    : <View></View>
                }
                {addModes == "text" ?
                    <View style={styles.Addtable}>
                        <View style={styles.inputlabel}>
                            <View style={{ flexWrap: 'wrap' }}>
                                <Text style={{ fontSize: 15, textAlign: "center", color: "#BBBBBB" }}>ข้อความ</Text>
                            </View>
                            <TextInput
                                style={styles.input}
                                onChangeText={setNewText}
                                value={newText}
                                placeholder="ข้อความ"
                            />

                        </View>
                        <View style={[styles.inputlabel2]}>

                            <TouchableOpacity style={styles.cancelButton} onPress={() => { setAddModes(""); }} activeOpacity={1}>
                                <Text style={{ color: 'white', textAlign: "center" }}>ยกเลิก</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.addButton]} onPress={() => { fetchAddDragable(); setAddModes(""); }} activeOpacity={1}>
                                <Text style={{ color: 'white', textAlign: "center" }}>เพิ่ม</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                    : <View></View>
                }
                {addModes == "shape" ?
                    <View style={styles.Addtable}>
                        <ColorPicker style={{ width: '100%', alignSelf: 'center' }} value={"#ff8a24"} onComplete={onSelectColor}>
                            <Preview hideInitialColor={true} hideText={true} />
                            <Panel1 />
                            <HueSlider />
                        </ColorPicker>
                        <View style={[styles.inputlabel2, { marginTop: 20 }]}>

                            <TouchableOpacity style={styles.cancelButton} onPress={() => { setAddModes(""); }} activeOpacity={1}>
                                <Text style={{ color: 'white', textAlign: "center" }}>ยกเลิก</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.addButton]} onPress={() => { fetchAddDragable(); setAddModes(""); }} activeOpacity={1}>
                                <Text style={{ color: 'white', textAlign: "center" }}>เพิ่ม</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                    : <View></View>
                }

            </View>
        </ScrollView>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    dragablecontainer: {
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
    },
    submitcontainer: {
        flexDirection: 'column',
        flex: 1
    }, dragablecontent: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red'

    }, topper: {
        flexDirection: "row-reverse",
        marginLeft: 20
    }, addButton: {
        backgroundColor: "#FF7A00",
        width: 141,
        height: 31,
        borderRadius: 20,
        alignContent: 'center',
        justifyContent: 'center',
        margin: 5,

    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 5,
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
        width: "80%",
    }, centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    },
    buttonAdd: {
        backgroundColor: 'green',
        width: 100

    }, button: {
        borderRadius: 3,
        padding: 10,
        width: 80,
        elevation: 2,
        marginTop: 10
    }, textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    }, buttonClose: {
        backgroundColor: 'red',
        marginTop: 5
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


    }, deleteButton: {
        marginLeft: 0,
        alignSelf: 'center',
        margin: 5

    }, modeButtons: {
        flexDirection: 'row'
    }, selectedMode: {
        backgroundColor: '#FF7A00',

    }, unselectedMode: {
        backgroundColor: 'white',


    }, colorpicker: {
        flex: 1,
        alignItems: 'center',
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

    }, edittingControlPanel: {
        height: 100,
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
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
    }, restaurantBanner: {
        height: 100,
        flexDirection: 'row'
    }, restaurantimage: {
        borderRadius: 30,
        marginLeft: 20
    }, restaurantInfo: {
        marginLeft: 20

    }, circle: {
        width: 50,
        height: 50,
        backgroundColor: "white",
        borderRadius: 30,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.50,
        shadowRadius: 2.62,
        elevation: 10,
        marginHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
    }, Addtable: {
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

    },
    inputlabel: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 5,
        alignSelf: 'center',
        alignContent: 'center'
    }, cancelButton: {
        backgroundColor: "#FF3131",
        width: 141,
        height: 31,
        borderRadius: 20,
        alignContent: 'center',
        justifyContent: 'center',
        margin: 5
    }, inputlabel2: {
        flexDirection: "row",
        alignContent: "center",
        alignItems: "center",
        width: 300,
        justifyContent: 'center',
        alignSelf: 'center'
    },
});


export default Table