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


const apiheader = process.env.EXPO_PUBLIC_apiURI;

const EditShpaeSize = ({ route, navigation }) => {
    const [obj, setData] = useState([]);
    const [EdittingShape, setShape] = useState([]);
    const editView = React.useRef()

    const sendnewSize = ()=>{
        console.log(editView.current.state)
        navigation.dispatch(StackActions.replace('EditTables',{isResized:true,size:{w:editView.current.state.w,h:editView.current.state.h},editShape:route.params.editShape,restaurant_id:route.params.restaurant_id}));
    }
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
        width: 440,
        height: 450,
        alignSelf: 'center',
        marginTop: 40,
        borderWidth: 2,
        borderRadius: 5,
        marginBottom: 20,
        backgroundColor: 'white',
        borderColor: '#CCCCCC',
    },
    resizecontainer: {

    }, dragablecontent: {
        position: 'absolute',


    }

});


export default EditShpaeSize