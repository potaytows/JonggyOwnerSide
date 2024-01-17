import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useSharedValue } from 'react-native-reanimated';

import Dragable from '../components/dragable';
import React, { useEffect, useState } from 'react';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const apiheader = process.env.EXPO_PUBLIC_apiURI;

const Table = ({ route }) => {
    const [obj, setData] = useState([]);
    const [tables, setTableData] = useState([]);

    const getTables = async () => {
        try {
            const response = await fetch(apiheader + '/tables/getbyRestaurantId/' + route.params.restaurant_id);
            const result = await response.json();
            setData(result)
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        getTables()

    }, []);


    return (
        <SafeAreaProvider style={styles.container}>
            <GestureHandlerRootView style={styles.container}>
                <SafeAreaView style={styles.container}>
                    <View style={styles.wrapper}>
                        <View style={styles.dragablecontainer}>
                        {obj.map(item => (
                            <Dragable key={item.tableName} id={item._id} x={item.x} y={item.y} item={item}>
                            </Dragable>
                        ))}

                        </View>
                        

                    </View>
                    <View style={styles.submitcontainer}>
                        {/* <Button
                            title="Press me"
                            color="#f194ff"
                        onPress={() => Alert.alert('Button with adjusted color pressed')}
                        /> */}
                    </View>

                </SafeAreaView>
            </GestureHandlerRootView>
        </SafeAreaProvider>


    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        
        backgroundColor: 'white',
    },
    wrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 16,
    },
    dragablecontainer: {
        height:'80%',
    },
    submitcontainer: {
        flexDirection: 'column',
        flex: 1
    }
});


export default Table