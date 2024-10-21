import React, { useEffect, useState } from 'react'
import table from '../screens/table'
import { createStackNavigator } from '@react-navigation/stack'
import NotificationScreen from '../screens/notification';


const Stack = createStackNavigator();

const NotificationStacks = () => {

  return (
      <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: 'white' }}}>
        <Stack.Screen name="notification" component={NotificationScreen} options={{ title: "ข้อความ",headerShown:false }}/>
      </Stack.Navigator>
  )
}


export default NotificationStacks
