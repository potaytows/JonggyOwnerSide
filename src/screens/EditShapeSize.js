import { StyleSheet, View, Button, Modal, TextInput, TouchableOpacity, ToastAndroid, Pressable } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Dragable from '../components/dragable';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ColorPicker, { Panel1, Swatches, Preview, OpacitySlider, HueSlider } from 'reanimated-color-picker';
import StaticTable from '../components/staticTable';
import { DragResizeBlock, DragResizeContainer } from 'react-native-drag-resize';
import { useFocusEffect, StackActions } from '@react-navigation/native';
import Text from '../components/Text';
import { CommonActions } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';


const apiheader = process.env.EXPO_PUBLIC_apiURI;

const EditShpaeSize = ({ route, navigation }) => {
    const [obj, setData] = useState([]);
    const [EdittingShape, setShape] = useState([]);
    const [isLoading, setLoading] = useState(false);

    const editView = React.useRef()

    const sendnewSize = () => {
        console.log(editView.current.state)
        navigation.dispatch(StackActions.replace('EditTables', { isResized: true, size: { w: Math.round(editView.current.state.w), h: Math.round(editView.current.state.h) }, editShape: route.params.editShape, restaurant_id: route.params.restaurant_id }));
    }
    const getTables = async () => {
        setLoading(true)
        try {
            const response = await axios.get(apiheader + '/tables/getbyRestaurantId/' + route.params.restaurant_id);
            const result = await response.data.activePreset;
            setData(result);
            const response1 = await axios.get(apiheader + '/tables/' + route.params.editShape._id);
            const result1 = await response1.data;
            setShape(result1);
        } catch (error) {
            console.error(error);
        }finally{
            setLoading(false);
            console.log(obj.tables)
        }
    };
    const EditShapeComponent = props => {
        const dragable = props.item;
        if (dragable._id == EdittingShape._id) {
            return (
                <View style={[styles.resizecontainer]}>
                    <DragResizeBlock
                        w={dragable.width + 14}
                        h={dragable.height + 14}
                        isDraggable={false}
                        connectors={['tl', 'tr', 'br', 'bl']}
                        x={dragable.x}
                        y={dragable.y}
                        minW={10}
                        minH={10}
                        ref={editView}
                    >
                        <View
                            style={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: dragable.color,
                            }}
                        // onLayout={({ nativeEvent }) => {
                        //     console.log(nativeEvent)
                        // }}

                        />
                    </DragResizeBlock>
                </View>

            )
        } else {
            return (

                <StaticTable item={dragable} key={dragable._id} />


            )
        }


    }
    useEffect(() => {
        getTables()

    }, []);

    React.useEffect(() => {
        // Use `setOptions` to update the button that we previously specified
        // Now the button includes an `onPress` handler to update the count
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity style={{ marginRight: 10 }} onPress={() => sendnewSize()} >
                    <Text style={{ color: "white", fontSize: 15 }}>ยืนยัน</Text></TouchableOpacity>
            ),
        });
    }, [navigation]);

    return (

        <View style={styles.container}>
            {/* <LinearGradient colors={['#FB992C', '#EC7A45']} start={{ x: 0.2, y: 0.8 }} style={styles.header}>
                <View style={{ flexWrap: 'wrap', alignSelf: 'center', marginLeft: 20, marginTop: 35 }}>
                    <MaterialIcons name="arrow-back-ios" size={24} color="white"
                        onPress={() => navigation.dispatch(CommonActions.goBack())} />
                </View>

            </LinearGradient> */}
            {obj.tables ==undefined ? (
                <View></View>
            ) : (
                <View style={styles.dragablecontainer}>
                    {obj.tables.map((item, index) => (
                        <View key={item._id} style={styles.dragablecontent}>
                            <EditShapeComponent key={item._id} id={item._id} item={item} />
                        </View>
                    ))}
                </View>
            )}

        </View>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    dragablecontainer: {
        width: 380,
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
    resizecontainer: {

    }, dragablecontent: {
        position: 'absolute',


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


});


export default EditShpaeSize