import React, { useEffect, useState } from 'react'
import table from '../screens/table'
import { createStackNavigator } from '@react-navigation/stack'
import Index from '../screens/userStacks';


const Stack = createStackNavigator();

const UserStacks = () => {

  return (
      <Stack.Navigator screenOptions={{headerStyle:{backgroundColor: '#ff8a24',},headerTintColor:'white'}}>
        <Stack.Screen name="Index" component={Index} options={{headerShown:false}}/>
      </Stack.Navigator>
  )
}


export default UserStacks
