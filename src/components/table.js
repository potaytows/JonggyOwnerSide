import React,{useEffect,useCallback} from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { MARGIN, SIZE } from '../../utils';
import { DragResizeBlock } from 'react-native-drag-resize';

const table = ({ item,setSize }) => {

  if (item.type == "table") {
    return (
      <View style={[styles.container]} 
      >
        <Image
          source={require('../../assets/images/table.png')}
          borderRadius={5}
          style={[styles.image, { zIndex: 100 }]}
        />
        <Text style={styles.text}>{item.text}</Text>
      </View>

    );

  }
  if (item.type == "text") {
    return (
      <View style={[styles.container, { zIndex: 100 }]} onLayout={async({ nativeEvent }) => {setSize(nativeEvent.layout)}}>
        <Text style={styles.text}>{item.text}</Text>
      </View>

    );

  }


  // ? backgroundColor:item.color:{}
  if (item.type == "shape") {
    return (
      <View style={[styles.container]}  onLayout={({ nativeEvent }) => {setSize(nativeEvent.layout)}}>
        <View style={[styles.shape, { height: item.height, width: item.width, backgroundColor: item.color, zIndex: -10 }]} 
          onLayout={({ nativeEvent }) => {
            const { x, y, width, height } = nativeEvent.layout;
            console.log("width:" + width + " / height : " + height)
          }}>
        </View>
      </View>
    );

  }

};




const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',

  },
  text: {
    color: 'black',
  },
  image: {
    height: 30,
    width: 30
  }, shape: {


  }
});

export default table;