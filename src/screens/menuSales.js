import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, StyleSheet, ActivityIndicator, TouchableOpacity, Image, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { CommonActions } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';

import Text from '../components/Text';

const apiheader = process.env.EXPO_PUBLIC_apiURI;

const MenuSales = ({ navigation, route }) => {
    const [isLoading, setLoading] = useState(true);
    const [Menu, setMenu] = useState({});
    const [totals, setTotals] = useState();
    const [imageuri, setImageUri] = useState("");

    const getMenu = async () => {
        setLoading(true);
        try {
            const response = await axios.get(apiheader + '/menus/getMenu/' + route.params?.menuid);
            const result = await response.data;
            setMenu(result);
            setImageUri(apiheader + "/image/getMenuIcon/" + result._id + "?" + Math.round(Math.random() * 1000000000).toString());
            getTotalSales(result._id);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getTotalSales = async (menu_id) => {
        setLoading(true);
        try {
            const result = await axios.get(apiheader + '/menus/' + menu_id + "/order-counts");
            const res = result.data;
            setTotals(res);
            console.log(res)
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getMenu();
    }, []);

    return (
        <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
            <LinearGradient colors={['#FB992C', '#EC7A45']} start={{ x: 0.2, y: 0.8 }} style={styles.header}>
                <View style={{ flexWrap: 'wrap', alignSelf: 'center', marginLeft: 20, marginTop: 35 }}>
                    <MaterialIcons name="arrow-back-ios" size={24} color="white"
                        onPress={() => navigation.dispatch(CommonActions.goBack())} />
                </View>
                <Text style={styles.headerTitle}>
                    ยอดขาย
                </Text>
            </LinearGradient>
            {isLoading && <View style={styles.activityIndicatorBody}>
                <ActivityIndicator size="large" color='#ff8a24' animating={isLoading} />
            </View>}

            <SafeAreaView style={styles.container}>
                <View style={styles.image}>
                    {imageuri &&
                        <Image
                            source={{ uri: imageuri }}
                            borderRadius={5}
                            style={{ width: 100, height: 100, marginTop: 20, }}
                        />
                    }
                    <View style={styles.menuCard}>
                        <Text style={styles.menuName}>
                            {Menu.menuName}
                        </Text>
                        <Text style={styles.menuPrice}>
                            {Menu.price}฿
                        </Text>
                    </View>
                </View>

                <View style={styles.salesContainer}>
                    <Text style={styles.salesTitle}>ยอดขาย</Text>

                    <View style={styles.salesRow}>
                        <Text style={styles.salesLabel}>วันนี้:</Text>
                        <Text style={styles.salesValue}>{totals?.ordersToday}</Text>
                    </View>

                    <View style={styles.salesRow}>
                        <Text style={styles.salesLabel}>7 วันที่ผ่านมา:</Text>
                        <Text style={styles.salesValue}>{totals?.ordersLast7Days}</Text>
                    </View>

                    <View style={styles.salesRow}>
                        <Text style={styles.salesLabel}>30 วันที่ผ่านมา:</Text>
                        <Text style={styles.salesValue}>{totals?.ordersLast30Days}</Text>
                    </View>

                    <View style={styles.salesRow}>
                        <Text style={styles.salesLabel}>ยอดขายทั้งหมด:</Text>
                        <Text style={styles.salesValue}>{totals?.ordersAllTime}</Text>
                    </View>
                </View>
            </SafeAreaView>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
    },
    header: {
        height: 109,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        flexDirection: 'row',
    },
    headerTitle: {
        color: 'white',
        fontSize: 36,
        fontWeight: 'bold',
        marginLeft: 20,
        marginTop: 45,
    },
    activityIndicatorBody: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        alignSelf: 'center',
        justifyContent: 'center'
    },
    image: {
        alignItems: 'center',
    },
    menuCard: {
        alignItems: 'center',
        marginTop: 10,
    },
    menuName: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    menuPrice: {
        fontSize: 18,
        color: 'gray',
    },
    salesContainer: {
        marginTop: 20,
    },
    salesTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    salesRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    salesLabel: {
        fontSize: 16,
    },
    salesValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default MenuSales;