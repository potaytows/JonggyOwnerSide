import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View,  FlatList, StyleSheet, TouchableOpacity, Image, TextInput, Button, ScrollView } from 'react-native';
import Text from '../components/Text';

const apiheader = process.env.EXPO_PUBLIC_apiURI;

const SelectTimeScreen = ({navigation}) => {
    const handleEditProfile = () => {
        navigation.navigate('EditProfile', { userInfo });
      };

  return (
    <View styles={styles.container}>
        <Text>เวลาเปิดปิด</Text>
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  }
});

export default SelectTimeScreen;