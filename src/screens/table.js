import { StyleSheet, Text, View, Button, Modal, TextInput, TouchableOpacity, ToastAndroid, Pressable } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Dragable from '../components/dragable';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ColorPicker, { Panel1, Swatches, Preview, OpacitySlider, HueSlider } from 'reanimated-color-picker';



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
    const [addModes, setAddModes] = useState("table");
    const [editModes, setEditModes] = useState("table");
    const [originalname, setOriginal] = useState([]);
    const [edittable, setEditTable] = useState([]);
    const [edittableName, setEditTableName] = useState("");
    const [newText, setNewText] = useState("");
    const [newTableName, setNewTableName] = useState("");
    const [selectedColor, setSelectedColor] = useState("#ff8a24");


    const getTables = async () => {
        try {
            const response = await axios.get(apiheader + '/tables/getbyRestaurantId/' + route.params.restaurant_id);
            const result = await response.data;
            setData(result)
        } catch (error) {
            console.error(error);
        }
    };

    const onSelectColor = ({ hex }) => {
        setSelectedColor(hex);
        console.log(hex);
    };


    const showAddModal = async () => {
        setModalVisible(!modalVisible);
        setSelectedColor("#ff8a24");

    };

    const closeAddModal = async () => {
        setModalVisible(!modalVisible);
        setNewTableName("");

    }
    const toEditShapeScreen = async ()=>{
        navigation.navigate("EditShapeSize",{editShape:edittable,restaurant_id:route.params.restaurant_id})
        

    }

    const showEditModal = async (item) => {
        const response = await axios.get(apiheader + '/tables/' + item._id);
        const editingitem = response.data;
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
            if(addModes == "table"){
                const response = await axios.post(apiheader + '/tables/addTable', { text: newTableName, restaurant_id: route.params.restaurant_id, type: addModes });
                const result = await response.data;
                getTables();
                ToastAndroid.showWithGravityAndOffset('เพิ่มโต๊ะสำเร็จ!', ToastAndroid.SHORT, ToastAndroid.BOTTOM, 25, 50)
            }if(addModes == "text"){
                const response = await axios.post(apiheader + '/tables/addTable', { text: newText, restaurant_id: route.params.restaurant_id, type: addModes });
                const result = await response.data;
                getTables();
                ToastAndroid.showWithGravityAndOffset('เพิ่ม Text สำเร็จ!', ToastAndroid.SHORT, ToastAndroid.BOTTOM, 25, 50)
    
            }if(addModes == "shape"){
                const response = await axios.post(apiheader + '/tables/addTable', { height: parseInt(shapeHeight), width: parseInt(shapeWidth), restaurant_id: route.params.restaurant_id, type: addModes, color: selectedColor });
                const result = await response.data;
                setColorPicker("#ff8a24");
                getTables();
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
        }finally{
            setEditModal(!EditmodalVisible);
            setEditTableName("");
        }
    };

    const fetchEditShape = async () => {
        try {
            console.log(edittable);
            const response = await axios.put(apiheader + '/tables/edit/' + edittable._id, { width: parseInt(newShapeWidth), height: parseInt(newShapeHeight), color: selectedColor });
            const result = await response.data;
            getTables();
            ToastAndroid.showWithGravityAndOffset('แก้ไขสำเร็จ!', ToastAndroid.SHORT, ToastAndroid.BOTTOM, 25, 50)

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


    useEffect(() => {
        getTables()

    }, []);



    return (

        <View style={styles.container}>
            {/* edit modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={EditmodalVisible}
                onRequestClose={() => {
                    setEditModal(!EditmodalVisible);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        {editModes == "table" &&
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <Text>ชื่อโต๊ะ</Text>
                                <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: 'center', }}>
                                    <TextInput
                                        placeholder='ชื่อโต๊ะ'
                                        placeholderTextColor='gray'
                                        style={styles.input}
                                        value={edittableName}
                                        onChangeText={text => (setEditTableName(text))}
                                    />
                                    <TouchableOpacity
                                        style={styles.deleteButton}
                                        onPress={() => {
                                            deleteTable();
                                        }}>
                                        <Text style={styles.textStyle}>ลบ</Text>
                                    </TouchableOpacity>
                                </View>
                                {edittableName != originalname &&
                                    <TouchableOpacity
                                        style={[styles.button, styles.buttonAdd]} onPress={() => { fetchEditTable(); }}>
                                        <Text style={styles.textStyle}>แก้ไขข้อมูล</Text>
                                    </TouchableOpacity>
                                }
                                <TouchableOpacity
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => {
                                        setEditModal(!EditmodalVisible);
                                        setEditTable("");
                                    }}>
                                    <Text style={styles.textStyle}>ยกเลิก</Text>
                                </TouchableOpacity>
                            </View>
                        }
                        {editModes == "text" &&
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <Text>แก้ไขข้อความ</Text>
                                <TextInput
                                        placeholder='ชื่อโต๊ะ'
                                        placeholderTextColor='gray'
                                        style={styles.input}
                                        value={edittableName}
                                        onChangeText={text => (setEditTableName(text))}
                                    />
                                    {edittableName != originalname &&
                                    <TouchableOpacity
                                        style={[styles.button, styles.buttonAdd]} onPress={() => { fetchEditTable();}}>
                                        <Text style={styles.textStyle}>แก้ไขข้อมูล</Text>
                                    </TouchableOpacity>
                                }
                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={() => {
                                        deleteTable();
                                    }}>
                                    <Text style={styles.textStyle}>ลบ</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => {
                                        setEditModal(!EditmodalVisible);
                                        setEditTable("");
                                    }}>
                                    <Text style={styles.textStyle}>ยกเลิก</Text>
                                </TouchableOpacity>

                            </View>
                        }
                        {editModes == "shape" &&
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <Text>แก้ไขรูปทรง</Text>
                                <Button title="แก้ไขขนาด" color="blue" onPress={() => toEditShapeScreen()} />
                                <TextInput
                                    placeholder='Height'
                                    placeholderTextColor='gray'
                                    style={styles.input}
                                    value={newShapeHeight}
                                    onChangeText={text => setNewHeight(text)}
                                />
                                <TextInput
                                    placeholder='Width'
                                    placeholderTextColor='gray'
                                    style={styles.input}
                                    value={newShapeWidth}
                                    onChangeText={text => setNewWidth(text)}
                                />
                                <Button title={selectedColor} color={selectedColor} onPress={() => setColorPicker(true)} />

                                <TouchableOpacity
                                    style={[styles.button, styles.buttonAdd]} onPress={() => { fetchEditShape(); setEditModal(!EditmodalVisible); setEditTableName("") }}>
                                    <Text style={styles.textStyle}>แก้ไขข้อมูล</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={() => {
                                        deleteTable();
                                    }}>
                                    <Text style={styles.textStyle}>ลบ</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => {
                                        setEditModal(!EditmodalVisible);
                                        setEditTable("");
                                    }}>
                                    <Text style={styles.textStyle}>ยกเลิก</Text>
                                </TouchableOpacity>
                            </View>
                        }




                    </View>
                </View>
            </Modal>

            {/* add modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {

                    setModalVisible(!modalVisible);

                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={{ fontSize: 16, paddingBottom: 20 }}>เพิ่ม Draggable</Text>
                        <Text>เลือกโหมด</Text>

                        <View style={styles.modeButtons}>
                            <TouchableOpacity
                                style={[styles.button, addModes == "table" ? styles.selectedMode : styles.unselectedMode]} onPress={() => {
                                    setAddModes("table")
                                }} activeOpacity={1} >
                                <Text style={styles.textStyle}>โต๊ะ</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, addModes == "text" ? styles.selectedMode : styles.unselectedMode]} onPress={() => {
                                setAddModes("text")
                            }} activeOpacity={1} >
                                <Text style={styles.textStyle}>ข้อความ</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, addModes == "shape" ? styles.selectedMode : styles.unselectedMode]} onPress={() => {
                                setAddModes("shape")
                            }} activeOpacity={1} >
                                <Text style={styles.textStyle}>รูปทรง</Text>
                            </TouchableOpacity>
                        </View>
                        {/* add modal table */}
                        {addModes == "table" &&
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <TextInput
                                    placeholder='ชื่อโต๊ะ'
                                    placeholderTextColor='gray'
                                    style={styles.input}
                                    value={newTableName}
                                    onChangeText={text => setNewTableName(text)}
                                />

                                <TouchableOpacity
                                    style={[styles.button, styles.buttonAdd]} onPress={() => { fetchAddDragable(); setModalVisible(!modalVisible); setNewTableName(""); }}>
                                    <Text style={styles.textStyle}>เพิ่ม</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => {
                                        setModalVisible(!modalVisible);
                                        setNewTableName("");
                                    }}>
                                    <Text style={styles.textStyle}>ยกเลิก</Text>
                                </TouchableOpacity>

                            </View>
                        }
                        {/* add modal text  */}
                        {addModes == "text" &&
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <TextInput
                                    placeholder='ข้อความที่ต้องการเพิ่ม'
                                    placeholderTextColor='gray'
                                    style={styles.input}
                                    value={newText}
                                    onChangeText={text => setNewText(text)}
                                />

                                <TouchableOpacity
                                    style={[styles.button, styles.buttonAdd]} onPress={() => { fetchAddDragable(); setModalVisible(!modalVisible); setNewTableName(""); setNewText("") }}>
                                    <Text style={styles.textStyle}>เพิ่ม</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => {
                                        setModalVisible(!modalVisible);
                                        setNewTableName("");
                                    }}>
                                    <Text style={styles.textStyle}>ยกเลิก</Text>
                                </TouchableOpacity>

                            </View>
                        }
                        {/* add modal shape */}
                        {addModes == "shape" &&
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <TextInput
                                    placeholder='Height'
                                    placeholderTextColor='gray'
                                    style={styles.input}
                                    value={shapeHeight}
                                    onChangeText={text => setShapeHeight(text)}
                                />
                                <TextInput
                                    placeholder='Width'
                                    placeholderTextColor='gray'
                                    style={styles.input}
                                    value={shapeWidth}
                                    onChangeText={text => setShapeWidth(text)}
                                />
                                <Button title={selectedColor} color={selectedColor} onPress={() => setColorPicker(true)} />

                                <TouchableOpacity
                                    style={[styles.button, styles.buttonAdd]} onPress={() => { fetchAddDragable(); setModalVisible(!modalVisible); setNewTableName(""); setNewText(""); setShapeHeight(""); setShapeWidth(""); }}>
                                    <Text style={styles.textStyle}>เพิ่ม</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => {
                                        closeAddModal();
                                    }}>
                                    <Text style={styles.textStyle}>ยกเลิก</Text>
                                </TouchableOpacity>

                            </View>
                        }
                    </View>

                </View>

            </Modal>
            {/* modal colorpicker */}
            <Modal visible={colorpickerModal} animationType='slide'>
                <View style={styles.colorpicker}>
                    <ColorPicker style={{ width: '100%' }} value='red' onComplete={onSelectColor}>
                        <Preview />
                        <Panel1 />
                        <HueSlider />
                        <Swatches style={{ marginTop: 10 }} />
                    </ColorPicker>
                    <TouchableOpacity style={[styles.button, { backgroundColor: 'orange' }]} onPress={() => setColorPicker(false)}>
                        <Text style={{ textAlign: 'center' }}>Ok</Text>
                    </TouchableOpacity>

                </View>
            </Modal>

            <View style={styles.topper}>
                <TouchableOpacity style={styles.addButton} onPress={() => { showAddModal(); }}>
                    <Text style={{ color: "white" }}>เพิ่ม</Text>
                </TouchableOpacity>
            </View>
            {/* tables rendering */}
            <View style={styles.dragablecontainer}>
                {obj.map((item, index) => (
                    <TouchableOpacity activeOpacity={1} style={styles.dragablecontent} key={item._id} onPress={() => { showEditModal(item); }}>
                        <Dragable key={item.tableName} id={item._id} x={item.x} y={item.y} item={item}>
                        </Dragable>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    dragablecontainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 350,
        height: 450,
        alignSelf: 'center',
        marginTop: 40,
        borderWidth: 1


    },
    submitcontainer: {
        flexDirection: 'column',
        flex: 1
    }, dragablecontent: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    }, topper: {
        flexDirection: "row-reverse",
        marginTop: 20,
        marginLeft: 20
    }, addButton: {
        backgroundColor: '#ff8a24',
        width: 120,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        alignSelf: 'flex-end',

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
        borderWidth: 1,
        color: 'black',
        borderColor: 'black',
        borderRadius: 5,
        width: '80%',
        padding: 10,
        marginBottom: 10,
        alignSelf: 'center',
        marginTop: 10,
        width: 220,
        alignSelf: 'center'
    }, deleteButton: {
        backgroundColor: 'red',
        height: 30,
        borderRadius: 3,
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        marginTop: 5,
        marginLeft: 5

    }, modeButtons: {
        flexDirection: 'row'
    }, selectedMode: {
        backgroundColor: 'green',
        height: 40,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        marginHorizontal: 10

    }, unselectedMode: {
        backgroundColor: 'orange',
        height: 40,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        marginHorizontal: 10


    }, colorpicker: {
        flex: 1,
        alignItems: 'center',
    }
});


export default Table