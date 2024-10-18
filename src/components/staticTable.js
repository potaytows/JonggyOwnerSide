import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

const table = ({ item }) => {
    const styles = StyleSheet.create({
        container: {
            left: item.x,
            top: item.y,
            alignItems: 'center',
            justifyContent: 'center',
            position:'absolute'
        },
        text: {
            color: 'black',
        },
        image: {
            height: 30,
            width: 30
        }, shape: {
            backgroundColor: "orange"

        }
    });


    if (item.type == "table") {
        return (
            <View style={[styles.container]}>
                <Image
                    source={require('../../assets/images/table.png')}
                    borderRadius={5}
                    style={styles.image}
                />
                <Text style={styles.text}>{item.text}</Text>
            </View>
        );

    }
    if (item.type == "text") {
        return (
            <View style={[styles.container]}>
                <Text style={styles.text}>{item.text}</Text>
            </View>
        );

    }
    // ? backgroundColor:item.color:{}
    if (item.type == "shape") {
        return (
            <View style={[styles.container, { left: item.x, top: item.y }]}>
                <View style={[styles.shape, { height: item.height, width: item.width, backgroundColor: item.color }]}>
                </View>

            </View>
        );

    }

};





export default table;