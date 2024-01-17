import { Text, View, SafeAreaView, StyleSheet, StatusBar, FlatList, TextInput, ActivityIndicator, TouchableOpacity, Image } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';


const apiheader = process.env.EXPO_PUBLIC_apiURI;

const AddOwner = ({ navigation,route }) => {
    const [userList, setUsers] = useState([]);



    const getUsers = async () => {
        try {
            const response = await fetch(apiheader + '/users/getUsers');
            const result = await response.json();
            setUsers(result)
        } catch (error) {
            console.error(error);
        }
    };
    const List = ({ item }) => (



        <View style={styles.flatlist}>

            <View style={styles.left}>
                <Text style={styles.userTitle}>
                    {item.username}
                </Text>

            </View>

            <View style={styles.right}>
                <TouchableOpacity style={styles.addButton} onPress={() => {

                    navigation.navigate('Tabs', {
                        screen: 'หน้าหลัก',
                        params: {
                            screen: 'Restaurant',
                            params: { newOwner: item.username,restaurant_id:route.params.restaurant_id },
                            merge: true
                            
                        },

                    });
                }}>
                    <Text style={{ color: 'white' }}>เพิ่ม {item.username}</Text>
                </TouchableOpacity>

            </View>
            


        </View>



    );
    useFocusEffect(
        React.useCallback(() => {
            getUsers();
        }, [])
    );


    return (
        <View style={styles.container}>
            <FlatList
                data={userList}
                renderItem={({ item }) => <List item={item} />}
                keyExtractor={item => item._id}
            />
            
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    flatlist: {
        marginBottom: 15,
        flexDirection: "column",
        flex: 2,
        marginLeft: 20,
        marginTop: 20,
        marginRight: 20,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5

    }, userData: {
        flex: 1,
        flexDirection: "row"

    }, userTitle: {
        width: 200,
        color: "black",
        marginRight: 1,
        fontSize: 15

    }, addButton: {
        backgroundColor: '#ff8a24',
        width: 120,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        alignSelf: 'flex-end',

    }, left: {
        flex: 1

    }, right: {
        flex: 1,

    }
});


export default AddOwner