import React, { useEffect, useState } from 'react'
import table from '../screens/table'
import { createStackNavigator } from '@react-navigation/stack'
import Index from '../screens/index'
import Menus from '../screens/menus'
import Menu from '../screens/menu'
import AddMenu from '../screens/addMenu'
import AllReservations from '../screens/allreservations'
import OrderListScreen from '../screens/oderList'
import LocationScreen from '../screens/location'
import ChatScreen from '../screens/chat'

const Stack = createStackNavigator();

const Stacks = () => {

  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#ff8a24', }, headerTintColor: 'white' }}>
      <Stack.Screen name="Index" component={Index} options={{ headerShown: false }} />
      <Stack.Screen name="Tables" component={table} />
      <Stack.Screen name="Menus" component={Menus} />
      <Stack.Screen name="addMenus" component={AddMenu} />
      <Stack.Screen name="Menu" component={Menu} options={{ title: "แก้ไขเมนู" }} />
      <Stack.Screen name="allReservations" component={AllReservations} options={{ title: "การจองทั้งหมด" }} />
      <Stack.Screen name="orderList" component={OrderListScreen} options={{ title: "sssss" }} />
      <Stack.Screen name="location" component={LocationScreen} options={{ title: "Location" }} />
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  )
}


export default Stacks
