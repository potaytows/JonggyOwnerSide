import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MARGIN, SIZE } from '../../utils';
import AutoHeightImage from 'react-native-auto-height-image'

const table = ({ name }) => {


  return (
    <View style={[styles.container]}>
      <AutoHeightImage
        width={30}
        height={30}
        source={require('../../assets/images/table.png')}
        borderRadius={5}
      />
      <Text style={styles.text}>{name.tableName}</Text>
    </View>
  );
};




const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'black',
  },
});

export default table;