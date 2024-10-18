import React, { useEffect, useState } from 'react';
import { Text, View, SafeAreaView, StyleSheet, StatusBar, FlatList, TextInput, ActivityIndicator, ToastAndroid, TouchableOpacity, Image, Button, Alert } from 'react-native'
import { NavigationContainer, useFocusEffect, createNavigationContainerRef } from '@react-navigation/native'
import Tabs from './src/components/Tabs'
import * as SecureStore from 'expo-secure-store';
import Login from './src/screens/auth/login';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();
SplashScreen.preventAutoHideAsync();
const Stack = createStackNavigator();
const App = () => {
  const [UserAuth, setUserAuth] = useState((null));
  const [isLoading, setisLoading] = useState(false);

  const [loaded, error] = useFonts({
    'Kanit-Regular': require('./assets/fonts/Kanit-Regular.ttf'),
  });





  const getLoginInformation = async () => {

    setisLoading(true)
    try {
      user = await SecureStore.getItemAsync('userAuth');
      setUserAuth(user)
      console.log(user)
    } catch (e) {
      console.log(e)
    } finally {
      setisLoading(false)
    }
  };

  useEffect(() => {
    getLoginInformation();


  }, []);
  
  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  if (!isLoading) {
    if (UserAuth == null) {
      return (

        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#ff8a24', }, headerTintColor: 'white' }}>
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      )
    } else {
      return (
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#ff8a24', }, headerTintColor: 'white' }}>
            <Stack.Screen name="Tabs" component={Tabs} options={({ route }) => ({ headerShown: false })} />
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      )
    }
  }

}



export default App
