import React from 'react';
import { View,  StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import Text from '../components/Text';

const apiheader = process.env.EXPO_PUBLIC_apiURI;

const ManuOderScreen = ({ route, navigation }) => {
    const { reservation } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Location</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white',
    },
    
});

export default ManuOderScreen;
