import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStacks from './homeStacks';
import UserStacks from './userStacks';
import NotificationStacks from './notificationStacks';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';
const Tab = createBottomTabNavigator()

const Tabs = () => {

  return (
    <Tab.Navigator>
      <Tab.Screen
        name={'homes'}
        component={HomeStacks}
        options={{
          headerShown: false,
          tabBarLabel: 'หน้าหลัก', 
          tabBarIcon: ({ color, size }) => (
            <Entypo name="home"  color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name={'notifications'}
        component={NotificationStacks}
        options={{
          headerShown: false,
          tabBarLabel: 'ข้อความ', 
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="message" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name={'users'}
        component={UserStacks}
        options={{
          headerShown: false,
          tabBarLabel: 'บัญชี', 
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" color={color} size={size} />
          ),
        }}
      />
          
    </Tab.Navigator>
  )
}


export default Tabs
