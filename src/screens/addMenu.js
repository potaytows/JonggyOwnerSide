import React, { useEffect, useState } from 'react';
import { Text, View, SafeAreaView, StyleSheet, StatusBar, FlatList, TextInput, ActivityIndicator, ToastAndroid, TouchableOpacity, Image, Button, Alert } from 'react-native'
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
const apiheader = process.env.EXPO_PUBLIC_apiURI;

const AddMenu = ({ navigation, route }) => {
    const [isLoading, setLoading] = useState(false);
    const [menuName, setMenuName] = React.useState('');
    const [price, setPrice] = React.useState("");
    const [height, setHeight] = useState(0);
    const [image, setImage] = useState(null);


    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to choose an image.');
            return;
        }
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
        });
        if (!result.canceled) {
            setImage({ uri: result.assets[0].uri, type: 'image/png', name: 'uploadingimg' + Date.now() });
        }
    };


    const fetchAddMenu = async () => {
        setLoading(true);
        let user = await SecureStore.getItemAsync('userAuth');
        const userData = JSON.parse(user)
        try {
            const formData = new FormData();
            formData.append("menuName", menuName)
            formData.append("price", price)
            const response = await axios.post(apiheader + '/menus/addMenu/' + userData.username, { menuName: menuName, price: price });
            const result = await response.data;
            if (result.status == "added") {
                console.log(result)
                if (image) {
                    const uploadResult = await FileSystem.uploadAsync(apiheader + '/menus/uploadImage/' + result.object._id, image.uri, {
                        httpMethod: 'POST',
                        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
                        fieldName: 'image'
                    });
                } else {
                    const response = await axios.post(apiheader + '/menus/uploadImage/' + result.object._id + "/default");
                }
                navigation.navigate("Menus")
                ToastAndroid.showWithGravityAndOffset('Added ' + menuName, ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50)
            }


        } catch (error) {
            console.log(error);
            ToastAndroid.showWithGravityAndOffset('Some error has occured, please try again ', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50)
        } finally {
            setLoading(false);
        }




    }

    return (
        <SafeAreaView style={styles.container}>
            {isLoading && <View style={styles.activityIndicatorBody}>
                <ActivityIndicator size="large" color='#ff8a24' animating={isLoading} />
            </View>}
            {image && <Image source={{ uri: image.uri }} style={styles.previewImage} />}

            <View style={styles.imageButton}>
                <Button title="เลือกรูปภาพ" onPress={pickImage} style={styles.addImageButton} />
            </View>

            <View style={styles.menuNameCont}>
                <View style={styles.layoutMenuname}>
                    <Text style={styles.textresName}>ชื่อเมนูอาหาร</Text>

                    <View style={{ width: '100%', marginTop: 5, alignContent: 'center', height: Math.max(35, height) }}>

                        <TextInput
                            style={[styles.nameinput, { height: Math.max(35, height) }]}
                            onChangeText={setMenuName}
                            value={menuName}
                            placeholder='ใส่ชื่อเมนูของคุณ'
                            multiline={true}
                            onContentSizeChange={(event) =>
                                setHeight(event.nativeEvent.contentSize.height)
                            }

                        />
                    </View>
                </View>
                <View style={{ width: '100%', height: 40, marginTop: 5, alignContent: 'center' }}>
                    <TextInput
                        onChangeText={setPrice}
                        value={price}
                        placeholder='ราคา'
                        style={styles.input}
                    />
                </View>


            </View >
            <View style={styles.addButtonCont}>
                <TouchableOpacity style={styles.addButton} onPress={() => Alert.alert('ยืนยันการเพิ่มร้านอาหาร', 'คุณต้องการเพิ่ม ' + menuName + " หรือไม่", [
                    {
                        text: 'ยกเลิก',
                    },
                    { text: 'ยืนยัน', onPress: () => fetchAddMenu() },
                ])}>
                    <Text style={{ color: "white" }}>ยืนยัน</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    loadingindi: {
        position: 'absolute',
        top: 30,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textresName: {
        marginLeft: 10
    },
    layoutMenuname: {
        backgroundColor: 'white',
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 10,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 5,
        marginBottom: 10
    },
    input: {
        borderWidth: 1,
        flex: 1,
        borderRadius: 5,
        padding: 10,
        backgroundColor: 'white',
        borderWidth: 0,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 5,


    }, nameinput: {
        borderWidth: 1,
        flex: 1,
        borderRadius: 5,
        padding: 10,
        backgroundColor: 'white',
        borderWidth: 0,

    }, menuNameCont: {
        marginHorizontal: 20,
        marginTop: 10,
        alignContent: 'center'
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
    }, activityIndicatorBody: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        alignSelf: 'center',
        justifyContent: 'center'
    }, imageButton: {
        marginTop: 20,
        flexDirection: 'column',
        alignItems: 'center'
    }, previewImage: {
        width: 200, 
        height: 200,
        marginTop: 20,
        margin:'auto',
        borderRadius:20
    }, addImageButton: {

    }


})

export default AddMenu
