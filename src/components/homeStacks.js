import React, { useEffect, useState } from 'react'
import table from '../screens/table'
import { createStackNavigator } from '@react-navigation/stack'
import Index from '../screens/index'
import allRestaurants from '../screens/allRestaurants'
import Restaurant from '../screens/Restaurant'
import User from '../screens/usermanagement/user'
import allUsers from '../screens/usermanagement/allUsers'
import addRestaurant from '../screens/addRestaurant'


const Stack = createStackNavigator();

const Stacks = () => {

  return (
      <Stack.Navigator screenOptions={{headerStyle:{backgroundColor: '#ff8a24',},headerTintColor:'white'}}>
        
        <Stack.Screen name="Index" component={Index} options={{headerShown:false}}/>
        <Stack.Screen name="allRestaurants" component={allRestaurants} options={{title:"ร้านอาหาร",headerTitleAlign:'center'}}/>
        <Stack.Screen name="allUsers" component={allUsers} options={{title:"จัดการผู้ใช้",headerTitleAlign:'center'}}/>
        <Stack.Screen name="User" component={User} options={({route})=>({title: false})}/>
        <Stack.Screen name="addRestaurant" component={addRestaurant} options={{title:"เพิ่มร้านอาหาร",headerTitleAlign:'center'}}/>
        <Stack.Screen name="Tables"  component={table} />
        <Stack.Screen name="Restaurant" component={Restaurant} options={({route})=>({title: false})}/>
        


      </Stack.Navigator>
  )
}


export default Stacks
