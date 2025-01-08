import { StyleSheet, View, Button, Modal, TextInput, TouchableOpacity, Alert, ToastAndroid, Pressable, ScrollView, ActivityIndicator,Image} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import axios, { Axios } from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import Text from '../components/Text';
import StaticTable from '../components/staticTable';
import { Picker } from '@react-native-picker/picker';
import { isLoaded } from 'expo-font';
const apiheader = process.env.EXPO_PUBLIC_apiURI;
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
// import { Image } from 'expo-image';

const EditRestaurantScreen = ({ route, navigation }) => {
    const [loading, setLoading] = useState(false);
    const [restaurant, setRestaurant] = useState({});
    const [isEdittingtName, setEditName] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);
    const [NewRestaurantName, setNewRestaurantName] = useState("");
    const [text, setText] = useState("");

    const [image, setImage] = useState(null);
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to choose an image.');
            return;
        }
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
        });
        if (!result.canceled) {
            console.log(isUploaded || NewRestaurantName != restaurant.restaurantName);
            setIsUploaded(true);
            setImage({ uri: result.assets[0].uri, type: 'image/png', name: 'uploadingimg' + Date.now() });
        }
    };
    const getRestaurantbyUsername = async () => {
        try {
            const userauth = await SecureStore.getItemAsync('userAuth');
            const username = JSON.parse(userauth)
            const response = await axios.get(apiheader + '/restaurants/getByUsername/' + username.username);
            const result = await response.data;
            setRestaurant(result);
            setNewRestaurantName(result.restaurantName);
            setText(result.restaurantName);

        } catch (error) {
            console.error(error);
        }
    };
    const fetchEditRestaurant = async () => {
        console.log(NewRestaurantName != restaurant.restaurantName);
        if (isUploaded) {
            try {
                const uploadResult = await FileSystem.uploadAsync(apiheader + '/restaurants/uploadImage/' + restaurant._id, image.uri, {
                    httpMethod: 'POST',
                    uploadType: FileSystem.FileSystemUploadType.MULTIPART,
                    fieldName: 'image'
                });
                console.log(uploadResult)
            } catch (error) {
                console.error(error);
            }
        }if(NewRestaurantName != restaurant.restaurantName){
            try {
                const res = await axios.post(apiheader + '/restaurants/editDetails/' + restaurant._id,{restaurantName:NewRestaurantName});
                console.log(res)
            } catch (error) {
                console.error(error);
            }
        }

    };
    useEffect(() => {
        getRestaurantbyUsername();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
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
                    แก้ไขข้อมูลร้าน
                </Text>
                {isUploaded || NewRestaurantName != restaurant.restaurantName ? (
                    <TouchableOpacity style={{ flex: 1, flexDirection: 'row-reverse' }}
                        onPress={() => Alert.alert('ยืนยันการแก้ไขข้อมูล', 'คุณต้องการแก้ใขข้อมูลหรือไม่ ', [
                            {
                                text: 'ยกเลิก',
                            },
                            { text: 'ยืนยัน', onPress: () => fetchEditRestaurant() },
                        ])}>

                        <Text style={{ fontSize: 25, color: 'white', fontWeight: 'bold', textAlign: 'center', marginTop: 53, marginRight: 20 }}>
                            ยืนยัน
                        </Text>
                    </TouchableOpacity>
                ) : (<View></View>)}
            </LinearGradient>
            {loading ? (
                <View style={styles.centeredView}>
                    <ActivityIndicator size="large" color="#0000ff" />;
                </View>

            ) : (
                <View style={styles.container}>
                    <View style={styles.ImageContainer}>
                        {image ? (<Image source={{uri:image.uri}} width={100} height={100} style={styles.restaurantimage} />) : (
                            <View>
                                {restaurant._id !=undefined &&
                                    <Image source={{uri:apiheader + '/image/getRestaurantIcon/' + restaurant._id+"/"+Math.round(Math.random()*1000000000).toString()}} width={100} height={100} key={new Date} style={styles.restaurantimage} />
                                }
                            </View>


                        )}

                        <TouchableOpacity onPress={pickImage} style={{ alignItems: 'center', justifyContent: 'center', alignContent: 'center', marginTop: 10 }}>
                            <Text style={{ color: '#EC7A45' }}>แก้ไขรูปร้าน</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.restaurantNameContainer}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: 20 }}>ชื่อร้าน</Text>
                            {!isEdittingtName &&
                                <MaterialIcons name="edit" size={20} color="#EC7A45" style={{ marginLeft: 5 }} onPress={() => { setEditName(true) }} />


                            }
                            {isEdittingtName &&
                                <MaterialIcons name="save" size={20} color="#EC7A45" style={{ marginLeft: 5 }} onPress={() => { setNewRestaurantName(text);setEditName(false) }} />

                            }
                        </View>
                        {isEdittingtName ? (
                            <TextInput
                                onChangeText={setText}
                                value={text}
                                placeholder="ชื่อร้านอาหาร"
                                style={{ fontSize: 15 }}
                                autoFocus={true}
                            />
                        ) : (
                            <Text style={{ fontSize: 15, marginTop: 9, marginLeft: 5 }}>{NewRestaurantName}</Text>

                        )}
                    </View>

                </View>
            )}
        </View>
    );

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
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
    }, ImageContainer: {
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        marginTop: 30
    }, restaurantimage: {
        borderRadius: 30,
        alignSelf: 'center',
    }, restaurantNameContainer: {
        paddingLeft: 20
    }
});


export default EditRestaurantScreen