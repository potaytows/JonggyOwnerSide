import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Alert, Image, FlatList, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CommonActions } from '@react-navigation/native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import Text from '../components/Text';
import axios from 'axios'; 
const apiheader = process.env.EXPO_PUBLIC_apiURI;

const AddBankAccountScreen = ({route,navigation}) => {
    const restaurant_id = route.params.restaurant_id;
    const wallets = route.params.wallets;
    const [accountName, setAccountName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [bankName, setBankName] = useState('');
    const [bankLogo, setBankLogo] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const bankOptions = [
        { label: 'พร้อมเพย์', value: 'พร้อมเพย์', logo: require('../../assets/images/พร้อมเพย์.png') },
        { label: 'ธนาคารกรุงเทพ', value: 'กรุงเทพ', logo: require('../../assets/images/กรุงเทพ.png') },
        { label: 'ธนาคารกสิกรไทย', value: 'กสิกรไทย', logo: require('../../assets/images/กสิกร.png') },
        { label: 'ธนาคารไทยพาณิชย์', value: 'ไทยพาณิชย์', logo: require('../../assets/images/ไทยพาณิช.png') },
        { label: 'ธนาคารทหารไทย', value: 'ทหารไทย', logo: require('../../assets/images/ทหารไทย.png') },
        { label: 'ธนาคารออมสิน', value: 'ออมสิน', logo: require('../../assets/images/ออมสิน2.png') },
        { label: 'ธนาคารกรุงศรี', value: 'กรุงศรี', logo: require('../../assets/images/กรุงศรี.png') },
        { label: 'ธนาคารกรุงไทย', value: 'กรุงไทย', logo: require('../../assets/images/กรุงไทย.png') },
    ];

    const handleBankChange = (bank) => {
        setBankName(bank.value);
        setBankLogo(bank.logo);
        setModalVisible(false);
    };

    const handleSave = async () => {
        if (!accountName || !accountNumber || !bankName) {
            Alert.alert('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }
    
        try {
            const response = await axios.post(apiheader+'/wallet/addBankAccount', { 
                restaurant_id: restaurant_id,
                bankName,
                accountName,
                accountNumber
            });
    
            if (response.status === 201) {
                Alert.alert('เพิ่มบัญชีธนาคารสำเร็จ');
                navigation.goBack();
            } else {
                Alert.alert('เกิดข้อผิดพลาด', response.data.error || 'ไม่สามารถเพิ่มบัญชีธนาคารได้');
            }
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('เกิดข้อผิดพลาด', 'โปรดลองอีกครั้ง');
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#FB992C', '#EC7A45']} start={{ x: 0.2, y: 0.8 }} style={styles.header}>
                <View style={{ flexWrap: 'wrap', alignSelf: 'center', marginLeft: 20, marginTop: 35 }}>
                    <MaterialIcons name="arrow-back-ios" size={24} color="white"
                        onPress={() => navigation.dispatch(CommonActions.goBack())} />
                </View>
                <Text style={styles.headerTitle}>
                    กระเป๋าเงิน
                </Text>
            </LinearGradient>
            <View style={styles.AddBankContainer}>
                <Text style={styles.headers}>เพิ่มบัญชีธนาคาร</Text>

                <TouchableOpacity style={styles.picker} onPress={() => setModalVisible(true)}>
                    <Text style={styles.pickerText}>{bankName ? bankName : 'เลือกธนาคาร'}</Text>
                </TouchableOpacity>

                <TextInput
                    style={styles.input}
                    placeholder="ชื่อบัญชี"
                    value={accountName}
                    onChangeText={setAccountName}
                />

                <TextInput
                    style={styles.input}
                    placeholder="เลขที่บัญชี"
                    keyboardType="numeric"
                    value={accountNumber}
                    onChangeText={setAccountNumber}
                />




                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.buttonText}>บันทึกบัญชีธนาคาร</Text>
                </TouchableOpacity>
            </View>
            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <FlatList
                            data={bankOptions}
                            keyExtractor={(item) => item.value}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.bankItem} onPress={() => handleBankChange(item)}>
                                    <Image source={item.logo} style={styles.bankItemLogo} />
                                    <Text style={styles.bankItemText}>{item.label}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Text style={styles.closeButton}>ปิด</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    AddBankContainer: {
        margin: 10
    },
    header: {
        height: 109,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        flexDirection: 'row',
    }, headerTitle: {
        color: 'white',
        fontSize: 36,
        fontWeight: 'bold',
        marginLeft: 20,
        marginTop: 45,
    },
    headers: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    input: {
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 15,
        paddingHorizontal: 10,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    picker: {
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        justifyContent: 'center',
        paddingHorizontal: 10,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    pickerText: {
        fontSize: 16,
        color: '#333',
    },
    bankLogo: {
        width: 100,
        height: 100,
        marginBottom: 20,
        alignSelf: 'center',
    },
    saveButton: {
        backgroundColor: '#FF914D',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    bankItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    bankItemLogo: {
        width: 40,
        height: 40,
        marginRight: 10,
    },
    bankItemText: {
        fontSize: 16,
    },
    closeButton: {
        textAlign: 'center',
        padding: 10,
        fontSize: 16,
        color: 'red',
    },
});

export default AddBankAccountScreen;
