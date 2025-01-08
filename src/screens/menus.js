import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, StyleSheet, StatusBar, FlatList, ScrollView, TextInput, ActivityIndicator, TouchableOpacity, Image, Button, Alert } from 'react-native'
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Text from '../components/Text';
import { CommonActions } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';



const apiheader = process.env.EXPO_PUBLIC_apiURI;

const Menus = ({ navigation }) => {
    const [isLoading, setLoading] = useState(false);
    const [menusList, setMenus] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const loadMenus = async () => {
        setLoading(true);
        let user = await SecureStore.getItemAsync('userAuth');
        const userData = JSON.parse(user)

        try {
            const response = await axios.get(apiheader + '/menus/getMenusByUsername/' + userData.username);
            const result = await response.data;
            setMenus(result)
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };




    // useEffect(() => {
    //     handleSearch();
    // }, [searchQuery]);

    useFocusEffect(
        React.useCallback(() => {
            loadMenus();
        }, [])
    );


    return (


        <SafeAreaView style={styles.container}>
             <LinearGradient colors={['#FB992C', '#EC7A45']} start={{ x: 0.2, y: 0.8 }} style={styles.header}>
                    <View style={{ flexWrap: 'wrap', alignSelf: 'center', marginLeft: 20, marginTop: 35 }}>
                        <MaterialIcons name="arrow-back-ios" size={24} color="white"
                            onPress={() => navigation.dispatch(CommonActions.goBack())} />
                    </View>
                    <Text style={styles.headerTitle}>
                        แก้ไขเมนูอาหาร
                    </Text>
                </LinearGradient>
            <View style={styles.loadingindi}>
                <ActivityIndicator size={"large"} animating={isLoading} style={styles.loadingindi} />
            </View>
            {/* <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="ค้นหาผู้ใช้"
                    value={searchQuery}
                    onChangeText={(text) => {
                        setSearchQuery(text);
                    }}
                />
            </View> */}
            <View style={styles.topper}>
                <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("addMenus")}>
                    <Text style={{ color: "white" }}>เพิ่มเมนูอาหาร</Text>
                </TouchableOpacity>
            </View>
            {menusList < 1 && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}><Text>ร้านของคุณยังไม่มีเมนู!</Text></View>}
            <ScrollView>
                <View>
                    {menusList != undefined || menusList == [] ? menusList.map((item, index) => (
                        menusList && index == undefined ? (
                            <View key={item.id}><Text>ร้านของคุณยังไม่มีเมนู!</Text></View>
                        ) : (
                            <View style={styles.layoutmenuList}>
                                <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => navigation.navigate("Menu", { menuid: item._id })} key={index}>

                                    <View style={styles.flatlist}>
                                        <Image
                                            width={70}
                                            height={70}
                                            source={{ uri: apiheader + '/image/getMenuIcon/' + item._id }}
                                            borderRadius={5}
                                        />
                                        <Text style={styles.menuTitle} adjustsFontSizeToFit={true} numberOfLines={2}>
                                            {item.menuName}
                                        </Text>

                                    </View>
                                    <Text style={styles.menuPrice}>
                                        ฿{item.price}
                                    </Text>

                                </TouchableOpacity>
                            </View>
                        )
                    )) : <View><Text>กำลังโหลดข้อมูล!</Text></View>}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    layoutmenuList: {
        backgroundColor: 'white',
        marginTop: 10,
        padding: 15,
        marginLeft:20,
        marginRight:20,
        borderRadius:10,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 5,
    },
    flatlist: {
        flexDirection: "row",
        width: '70%'

    }, menuTitle: {
        width: 200,
        color: "black",
        fontSize: 15,
        marginLeft: 15

    }, addButton: {
        backgroundColor: '#ff8a24',
        padding:10,
        paddingLeft:20,
        paddingRight:20,

        marginRight:20,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        alignSelf: 'flex-end',

    }, left: {
        flex: 1

    }, right: {
        flex: 1,

    }, loadingindi: {
        position: 'absolute',
        top: 30,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center'
    }, topper: {
        flexDirection: "row-reverse",
        marginTop: 20,
        marginLeft: 20
    },
    menuPrice: {
        textAlign: 'right',
        flex: 1,
        fontSize:16,
        color:'#ff8a24'
       
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

export default Menus