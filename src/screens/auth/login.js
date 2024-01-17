    import { Text, View, SafeAreaView, StyleSheet, StatusBar, FlatList, TextInput, ActivityIndicator, ToastAndroid,TouchableOpacity, Image } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';
import * as SecureStore from 'expo-secure-store';
import Dragable from '../../components/dragable';
import React, { useEffect, useState } from 'react';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const apiheader = process.env.EXPO_PUBLIC_apiURI;

const Login = ({ navigation }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const showLoginfailToast =()=>{
        ToastAndroid.showWithGravityAndOffset('you are not authorized.',ToastAndroid.LONG,ToastAndroid.BOTTOM,25,50)
    }
    useEffect(() => {


    }, []);

    
    const AuthCecker = async ()=>{
        try {
            const fetchOptions={
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body: JSON.stringify({username:username,password:password})
            };
            const response = await fetch(apiheader + '/users/Auth/owner',fetchOptions);
            const result = await response.json();
            console.log(result.status);
            if(result.status == "auth failed"){
                showLoginfailToast();
                console.log("auth did fail")
            }if(result.status == "auth success"){
                await SecureStore.setItemAsync('userAuth',JSON.stringify(result.obj));
                navigation.navigate('Tabs')
                

            }
            
        } catch (error) {
            console.error(error);
        }

    }

    

    return (
        <View style={styles.container}>
            <Image style={styles.Logo}
                source={require('../../../assets/images/Jonggy_logo.png')}
            />
            <View style={styles.container2}>
                <TextInput
                    placeholder='ชื่อผู้ใช้'
                    placeholderTextColor='gray'
                    style={styles.input}
                    value={username}
                    onChangeText={text => setUsername(text)}
                />
                <TextInput
                    placeholder='รหัสผ่าน'
                    placeholderTextColor='gray'
                    style={styles.input}
                    value={password}
                    onChangeText={text => setPassword(text)}
                    secureTextEntry
                />
                <TouchableOpacity style={styles.button} onPress={AuthCecker} >
                    <Text style={styles.buttonText}>เข้าสู่ระบบ</Text>
                </TouchableOpacity>


            </View>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2F2F2F',
        alignItems: 'center',
        justifyContent: 'center'
    },
    container2: {
        width: '100%',
    },
    input: {
        borderWidth: 1,
        color: 'white',
        backgroundColor: '#FF313180',
        borderColor: '#FF3131',
        borderRadius: 5,
        width: '80%',
        padding: 10,
        marginBottom: 10,
        alignSelf: 'center',
        marginTop: 10
    },
    button: {
        backgroundColor: '#FF914D',
        width: '40%',
        padding: 10,
        marginTop: 20,
        alignSelf: 'center',
        borderRadius: 5
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
    },
    buttonwellcome: {
        marginTop: 20,
        alignItems: 'center',
    },
    textbutton: {
        color: '#FF3131',
        fontSize: 16,
        textDecorationLine: 'underline',
    },
    Logo: {
        width: 200,
        height: 200
    }
});


export default Login