import React, { useEffect, useState } from 'react'
import table from '../screens/table'
import { createStackNavigator } from '@react-navigation/stack'
import Index from '../screens/userStacks';
import HelpCenterScreen from '../screens/helpCenter';
import SupportFormScreen from '../screens/supportForm';
import MySupportScreen from '../screens/mySupport';
const Stack = createStackNavigator();

const UserStacks = () => {

  return (
      <Stack.Navigator screenOptions={{headerStyle:{backgroundColor: '#ff8a24',},headerTintColor:'white'}}>
        <Stack.Screen name="Index" component={Index} options={{headerShown:false}}/>
        <Stack.Screen name="helpCenter" component={HelpCenterScreen} options={{headerShown:false}}/>
        <Stack.Screen name="supportForm" component={SupportFormScreen} options={{ title: "Edit Restaurant Screen",headerShown:false }} />
        <Stack.Screen name="mySupport" component={MySupportScreen} options={{ title: "Edit Restaurant Screen",headerShown:false }} />

      </Stack.Navigator>
  )
}


export default UserStacks
