import React, { useEffect, useState } from 'react';
import { PanGestureHandler, GestureHandlerRootView, Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue
} from 'react-native-reanimated';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Table from './table';
import axios from 'axios';

const apiheader = process.env.EXPO_PUBLIC_apiURI;


const updateTable = async (xTrans, yTrans, id,) => {

    try {
        const response = await axios.put(apiheader + '/tables/edit/' +id, { x:xTrans,y:yTrans });
    } catch (error) {
        console.error(error);
    }
};

const bound = (base, value, min, max) => {
    let maxvalue = base + value;
    if (maxvalue > max) {
        return 0;
    } if (maxvalue < min) {
        return 0;
    } else {
        return value;
    }
}

const Dragable = (props) => {
    const [maxX, setMaxX] = useState(0);
    const [maxY, setMaxY] = useState(0);
    const [min, setMin] = useState(0);
    const [isSizeInitialized, setIsSizeInitialized] = useState(false);

    useEffect(() => {
        const initialBound = async () => {
            if (props.item.type == "shape") {
                setMaxX(375 - props.item.width);
                setMaxY(450 - props.item.height);
            } else if (props.item.type == "text") {
                setMaxX(375 - size.width);
                setMaxY(440 - size.height);
            } else {
                setMaxX(345);
                setMaxY(400);
            }
        }
        initialBound();
    }, []);

    const [size, setSize] = useState({});
    const translateX = useSharedValue(props.x);
    const translateY = useSharedValue(props.y);
    const isGestureActive = useSharedValue(false);
    const gridMultiplier = 10; // Defines grid size for snapping (adjust as needed)

    const pan = Gesture.Pan().runOnJS(true)
        .onStart(() => {
            isGestureActive.value = true;
        })
        .onChange((evt) => {
            // Apply boundary constraints and grid snapping for x and y translations
            translateX.value += bound(translateX.value, evt.changeX, -100, maxX);
            translateY.value += bound(translateY.value, evt.changeY, -100, maxY);

        })
        .onEnd(() => {
            // Snap the final position to the nearest grid cell
            const snappedX = Math.round(translateX.value / gridMultiplier) * gridMultiplier;
            const snappedY = Math.round(translateY.value / gridMultiplier) * gridMultiplier;

            // Update position after snapping
            translateX.value = snappedX;
            translateY.value = snappedY;

            // Update the table position in the backend
            updateTable(snappedX, snappedY, props.item._id, props.restaurant_id, props.item);
            isGestureActive.value = false;
        });

    const animatedStyle = useAnimatedStyle(() => {
        const zIndex = props.item.type == "shape" ? 1 : 100;
        return {
            zIndex,
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value },
            ],
        };
    });

    return (
        <GestureDetector gesture={pan}>
            <Animated.View style={animatedStyle}>
                <TouchableOpacity activeOpacity={1} style={styles.dragablecontent} key={props.item._id}
                    onPress={() => { props.showEditModal(props.item); }}>
                    <Table item={props.item} key={props.item._id} setSize={setSize} />
                </TouchableOpacity>
            </Animated.View>
        </GestureDetector>
    );
};

const styles = StyleSheet.create({
    dragablecontent: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
    }
})

export default Dragable;
