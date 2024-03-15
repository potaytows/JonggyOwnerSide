import React, { useEffect, useState } from 'react'
import table from '../screens/table'
import { createStackNavigator } from '@react-navigation/stack'
import Index from '../screens/index'
import Menus from '../screens/menus'
import Menu from '../screens/menu'
import AddMenu from '../screens/addMenu'

const Stack = createStackNavigator();

const Stacks = () => {

  return (
      <Stack.Navigator screenOptions={{headerStyle:{backgroundColor: '#ff8a24',},headerTintColor:'white'}}>
        
        <Stack.Screen name="Index" component={Index} options={{headerShown:false}}/>
        <Stack.Screen name="Tables"  component={table} />
        <Stack.Screen name="Menus"  component={Menus} />
        <Stack.Screen name="addMenus"  component={AddMenu} />
        <Stack.Screen name="Menu"  component={Menu} options={{title:"แก้ไขเมนู"}} />


        


      </Stack.Navigator>
  )
}


export default Stacks
