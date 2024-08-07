import { StyleSheet, Text, View, Button, Modal, TextInput, TouchableOpacity, ToastAndroid, Pressable } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Dragable from '../components/dragable';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ColorPicker, { Panel1, Swatches, Preview, OpacitySlider, HueSlider } from 'reanimated-color-picker';
import StaticTable from '../components/staticTable';
import { DragResizeBlock } from 'react-native-drag-resize';


const apiheader = process.env.EXPO_PUBLIC_apiURI;

const EditShpaeSize = ({ route }) => {

    const [obj, setData] = useState([]);
    const [EdittingShape, setShape] = useState([]);


    const getTables = async () => {
        try {
            const response = await axios.get(apiheader + '/tables/getbyRestaurantId/' + route.params.restaurant_id);
            const result = await response.data;
            setData(result);

            const response1 = await axios.get(apiheader + '/tables/' + route.params.editShape._id);
            const result1 = await response1.data;
            setShape(result1);
        } catch (error) {
            console.error(error);
        }
    };
    const EditShapeComponent = props => {
        const dragable = props.item;
        if (dragable._id == EdittingShape._id) {
            return (

                <DragResizeBlock
                    w={dragable.width}
                    h={dragable.height}
                    isDraggable={false}
                    minW={1}
                    minH={1}
                    connectors={['tl', 'tr', 'br', 'bl']}
                    onResizeEnd={ob => console.log(ob)}

                >
                    <View
                        style={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: dragable.color,


                        }}
                        // onLayout={({ nativeEvent }) => {
                        //     const { x, y, width, height } = nativeEvent.layout
                        // }}

                    />
                </DragResizeBlock>

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

    return (

        <View style={styles.container}>
            <View style={styles.dragablecontainer}>
                {obj.map((item, index) => (
                    <View key={item._id} style={styles.dragablecontent}>
                        <EditShapeComponent key={item._id} id={item._id} item={item} />
                    </View>
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
    resizecontainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    dragablecontent: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red'
    }
});


export default EditShpaeSize