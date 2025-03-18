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
import AllSettingScreen from '../screens/allsetting';
import SetContactLocationScreen from '../screens/setContactLocation';
import PresetsScreen from '../screens/preset';
import EditRestaurantScreen from '../screens/editRestaurantScreen';
import HelpCenterScreen from '../screens/helpCenter';
import SupportFormScreen from '../screens/supportForm';
import MyWalletScreen from '../screens/myWalllet';
import BankAccountScreen from '../screens/bankAccount';
import AddBankAccountScreen from '../screens/addBankAccount';

const Stack = createStackNavigator();

const Stacks = () => {

        return (
                <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#ff8a24' }, headerTintColor: 'white' }}>
                        <Stack.Screen name="Index" component={Index} options={{ headerShown: false }} />
                        <Stack.Screen name="Tables" component={ShowTables} options={{ title: "จัดการที่นั่ง", headerShown: false }} />
                        <Stack.Screen name="EditTables" component={table} options={{ headerShown: false }} />
                        <Stack.Screen name="Menus" component={Menus} options={{ headerShown: false }}/>
                        <Stack.Screen name="addMenus" component={AddMenu} options={{ headerShown: false }}/>
                        <Stack.Screen name="Menu" component={Menu} options={{ headerShown: false }}/>
                        <Stack.Screen name="allReservations" component={AllReservations} options={{ headerShown: false }} />
                        <Stack.Screen name="orderList" component={OrderListScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="location" component={LocationScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="Chat" component={ChatScreen}  options={{ headerShown: false }}/>
                        <Stack.Screen name="EditShapeSize" component={EditShapeSizeScreen} options={({ navigation, route }) => ({ title: "Edit Shape Size" })} />
                        <Stack.Screen name="allsetting" component={AllSettingScreen} options={{ title: "Setting",headerShown:false }} />
                        <Stack.Screen name="setContactLocation" component={SetContactLocationScreen} options={{ title: "" ,headerShown:false}} />
                        <Stack.Screen name="Presets" component={PresetsScreen} options={{ title: "Select Preset",headerShown:false }} />
                        <Stack.Screen name="EditRestaurant" component={EditRestaurantScreen} options={{ title: "Edit Restaurant Screen",headerShown:false }} />
                        <Stack.Screen name="helpCenter" component={HelpCenterScreen} options={{ title: "Edit Restaurant Screen",headerShown:false }} />
                        <Stack.Screen name="supportForm" component={SupportFormScreen} options={{ title: "Edit Restaurant Screen",headerShown:false }} />
                        <Stack.Screen name="MyWallet" component={MyWalletScreen} options={{ title: "Edit Restaurant Screen",headerShown:false }} />
                        <Stack.Screen name="bankAccount" component={BankAccountScreen} options={{ title: "Edit Restaurant Screen",headerShown:false }} />
                        <Stack.Screen name="AddBankAccount" component={AddBankAccountScreen} options={{ title: "Edit Restaurant Screen",headerShown:false }} />


                </Stack.Navigator>
        )
}

export default Stacks;
