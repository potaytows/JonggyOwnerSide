import React from 'react';
import { PanGestureHandler, GestureHandlerRootView, Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    runOnJS,
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,


} from 'react-native-reanimated';
import { StyleSheet, } from 'react-native';

import Table from './table';
const apiheader = process.env.EXPO_PUBLIC_apiURI;

const updateTable = async (xTrans,yTrans,id) => {
    try {
        const fetchOptions={
            method:'PUT',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({x:xTrans,y:yTrans})
        }
        const response = await fetch(apiheader + '/tables/edit/' + id,fetchOptions);
    } catch (error) {
        console.error(error);
    }
};
const Dragable = props => {
    const translateX = useSharedValue(props.x);
    const translateY = useSharedValue(props.y);
    const isGestureActive = useSharedValue(false);
    const pan = Gesture.Pan()
        .onStart(()=>{
            
            isGestureActive.value = true;
        })   
        .onChange((evt) => {
            translateX.value += evt.changeX;
            translateY.value += evt.changeY;


        })
        .onEnd(()=>{
            isGestureActive.value=false;
            runOnJS(updateTable)(translateX.value,translateX.value,props.item._id)
            
            
            
        })
    const animatedStyle = useAnimatedStyle(() => {
        const zIndex = isGestureActive.value ? 1000 : 1;
        return {
            
            zIndex,
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value },
            ],
        };
    });

    return (
        <Animated.View style={animatedStyle}>
            <GestureHandlerRootView style={styles.root}>
                <GestureDetector gesture={pan}>
                    <Animated.View><Table name={props.item} key={props.item._id} /></Animated.View>
                </GestureDetector>
            </GestureHandlerRootView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({

})


export default Dragable;