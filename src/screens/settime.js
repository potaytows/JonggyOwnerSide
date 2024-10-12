import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, TextInput, Button, ScrollView } from 'react-native';

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
