import React from 'react';
import { useNavigationState } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Index from '../screens/index';
import table from '../screens/table';
import Menus from '../screens/menus';
import Menu from '../screens/menu';
import AddMenu from '../screens/addMenu';
import AllReservations from '../screens/allreservations';
import OrderListScreen from '../screens/oderList';
import LocationScreen from '../screens/location';
import ChatScreen from '../screens/chat';
import ShowTables from '../screens/showtables';
import EditShapeSizeScreen from '../screens/EditShapeSize'

const Stack = createStackNavigator();

const Stacks = () => {

  return (
      <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#ff8a24' }, headerTintColor: 'white' }}>
        <Stack.Screen name="Index" component={Index} options={{ headerShown: false }} />
        <Stack.Screen name="Tables" component={ShowTables} options={{ title: "จัดการที่นั่ง",headerShown: false }}/>
        <Stack.Screen name="EditTables" component={table} options={{ title: "จัดการที่นั่ง",headerShown: false }}/>

        <Stack.Screen name="Menus" component={Menus} />
        <Stack.Screen name="addMenus" component={AddMenu} />
        <Stack.Screen name="Menu" component={Menu} options={{ title: "แก้ไขเมนู" }} />
        <Stack.Screen name="allReservations" component={AllReservations} options={{ title: "การจองทั้งหมด" }} />
        <Stack.Screen name="orderList" component={OrderListScreen} options={{ title: "Order Detail" }} />
        <Stack.Screen name="location" component={LocationScreen} options={{ title: "Location" }} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="EditShapeSize" component={EditShapeSizeScreen} options={({navigation, route}) =>({ title: "Edit Shape Size" })}/>
      </Stack.Navigator>
  )
}

export default Stacks;
