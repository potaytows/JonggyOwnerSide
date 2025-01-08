import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const table = ({ item, changeStatus }) => {
    const styles = StyleSheet.create({
        container: {
            left: item.x,
            top: item.y,    
            position: 'absolute',
        },
        text: {
            color: 'black',
            textAlign:'center'
        },
        image: {
            height: 30, 
            width: 30
        }, shape: {
            backgroundColor: "orange",
            zIndex:-1,
            position: 'absolute'
            
        }
    });


    if (item.type == "table") {
        if (item.status == "enabled") {
            return (
                <TouchableOpacity onPress={() => {
                    changeStatus(item)

                }} style={[styles.container, { zIndex: 100 }]}>
                    <Image
                        source={require('../../assets/images/table.png')}
                        borderRadius={5}
                        style={styles.image}
                    />
                    <Text style={styles.text}>{item.text}</Text>
                </TouchableOpacity>
            );

        }
        if (item.status == "disabled") {
            return (
                <TouchableOpacity onPress={() => {
                    changeStatus(item)
                }} style={[styles.container, { zIndex: 100 }]}>
                    <Image
                        source={require('../../assets/images/table.png')}
                        borderRadius={5}
                        style={styles.image}
                        tintColor={"gray"}
                    />
                    <Text style={styles.text}>{item.text}</Text>
                </TouchableOpacity>
            );

        }


    }
    if (item.type == "text") {
        return (
            <View style={[styles.container, { zIndex: 100 }]}>
                <Text style={styles.text}>{item.text}</Text>
            </View>
        );

    }
    // ? backgroundColor:item.color:{}
    if (item.type == "shape") {
        return (
            <View style={[styles.shape, { left: item.x, top: item.y, height: item.height, width: item.width, backgroundColor: item.color}]}>

            </View> 
        );

    }

};





export default table;
