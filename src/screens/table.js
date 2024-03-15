import { StyleSheet, Text, View, Button, Modal, TextInput, TouchableOpacity, ToastAndroid } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Dragable from '../components/dragable';
import React, { useEffect, useState } from 'react';
import axios from 'axios';


const apiheader = process.env.EXPO_PUBLIC_apiURI;

const Table = ({ route }) => {
    const [obj, setData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [EditmodalVisible, setEditModal] = useState(false);

    const [tables, setTableData] = useState([]);
    const [edittable, setEditTable] = useState([]);
    const [edittableName, setEditTableName] = useState("");


    const [newTableName, setNewTableName] = useState("");



    const getTables = async () => {
        try {
            const response = await axios.get(apiheader + '/tables/getbyRestaurantId/' + route.params.restaurant_id);
            const result = await response.data;
            setData(result)
        } catch (error) {
            console.error(error);
        }
    };

    const fetchAddTable = async () => {
        try {
            const response = await axios.post(apiheader + '/tables/addTable', { tableName: newTableName, restaurant_id: route.params.restaurant_id });
            const result = await response.data;
            getTables();
            ToastAndroid.showWithGravityAndOffset('เพิ่มโต๊ะสำเร็จ!', ToastAndroid.SHORT, ToastAndroid.BOTTOM, 25, 50)

        } catch (error) {
            console.error(error);
        }
    };

    const fetchEditTable = async () => {
        try {
            console.log(edittable)
            const response = await axios.put(apiheader + '/tables/edit/' + edittable, { tableName: edittableName });
            const result = await response.data;
            getTables();
            ToastAndroid.showWithGravityAndOffset('แก้ไขชื่อสำเร็จ!', ToastAndroid.SHORT, ToastAndroid.BOTTOM, 25, 50)

        } catch (error) {
            console.error(error);
        }
    };


    useEffect(() => {
        getTables()

    }, []);



    return (

        <View style={styles.container}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={EditmodalVisible}
                onRequestClose={() => {

                    setEditModal(!EditmodalVisible);

                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
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
                                    axios.delete(apiheader + "/tables/delete/" + edittable);
                                    setEditModal(!EditmodalVisible);
                                    getTables();
                                    ToastAndroid.showWithGravityAndOffset('ลบเสร็จสิ้น!', ToastAndroid.SHORT, ToastAndroid.BOTTOM, 25, 50)

                                }}>
                                <Text style={styles.textStyle}>ลบ</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            style={[styles.button, styles.buttonAdd]} onPress={() => { fetchEditTable(); setEditModal(!EditmodalVisible); setEditTableName("") }}>
                            <Text style={styles.textStyle}>แก้ไขข้อมูล</Text>
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
                </View>
            </Modal>
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
                            placeholder='ชื่อโต๊ะ'
                            placeholderTextColor='gray'
                            style={styles.input}
                            value={newTableName}
                            onChangeText={text => setNewTableName(text)}
                        />
                        <TouchableOpacity
                            style={[styles.button, styles.buttonAdd]} onPress={() => { fetchAddTable(); setModalVisible(!modalVisible); setNewTableName(""); }}>
                            <Text style={styles.textStyle}>เพิ่มโต๊ะ</Text>
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
                </View>
            </Modal>

            <View style={styles.topper}>
                <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(!modalVisible)}>
                    <Text style={{ color: "white" }}>เพิ่มโต๊ะ</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.dragablecontainer}>
                {obj.map((item, index) => (
                    <TouchableOpacity style={styles.dragablecontent} key={index} onPress={() => { setEditModal(!EditmodalVisible); setEditTable(item._id); setEditTableName(item.tableName) }}>
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
    }, centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    buttonAdd: {
        backgroundColor: 'green',

    }, button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
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
        marginTop: 10
    }, deleteButton: {
        backgroundColor: 'red',
        height: 30,
        borderRadius: 20,
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'

    }
});


export default Table