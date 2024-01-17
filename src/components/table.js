import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {MARGIN, SIZE} from '../../utils';

const table = ({name}) => {
  
  const backgroundColor = 2 % 2 === 0 ? '#6e48eb' : '#c0a946';
  return (
    <View style={[styles.container, {backgroundColor}]}>
      <Text style={styles.text}>{name.tableName}</Text>
    </View>
  );
};

export default table;

const styles = StyleSheet.create({
  container: {
    width: SIZE - MARGIN,
    height: SIZE - MARGIN,
    margin: MARGIN,
    borderRadius: 8,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#cde9e4',
  },
});
