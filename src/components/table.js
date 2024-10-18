import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { MARGIN, SIZE } from '../../utils';
import { DragResizeBlock } from 'react-native-drag-resize';

const table = ({ item }) => {

  if (item.type == "table") {
    return (
        <View style={[styles.container,]}>
          <Image
            source={require('../../assets/images/table.png')}
            borderRadius={5}
            style={[styles.image,{zIndex:100}]}
          />
          <Text style={styles.text}>{item.text}</Text>
        </View>
     
    );

  }
  if (item.type == "text") {
    return (
      

      <View style={[styles.container,{zIndex:100}]}>
        <Text style={styles.text}>{item.text}</Text>
      </View>
     
    );

  }
  // ? backgroundColor:item.color:{}
  if (item.type == "shape") {
    return (
      <View style={[styles.container]}>
        <View style={[styles.shape,{height:item.height,width:item.width,backgroundColor:item.color,zIndex:1 }]} 
        onLayout={({ nativeEvent }) => {
          const { x, y, width, height } = nativeEvent.layout;
          console.log("width:"+width+" / height : "+height)
      }}>
        </View>
      </View>
      // <DragResizeBlock
      //   w={item.width + 14}
      //   h={item.height + 14}
      //   isDraggable={true}
      //   connectors={[ 'c']}
      // // onResizeEnd={obj => console.log(obj)}
      // // onDragEnd={obj => console.log(obj)}
      // >
      //   <View
      //     style={{
      //       width: '100%',
      //       height: '100%',
      //       backgroundColor: item.color,
      //     }}
      //     onLayout={({ nativeEvent }) => {
      //       const { x, y, width, height } = nativeEvent.layout;
      //       console.log("width:" + width + " / height : " + height)
      //     }}
      //   />
      // </DragResizeBlock>

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