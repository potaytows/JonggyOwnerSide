import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Modal, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CommonActions } from '@react-navigation/native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import Text from '../components/Text';

const BankAccountScreen = ({ route, navigation }) => {
    const restaurant_id = route.params.restaurant_id;
    const wallets = route.params.wallets;

    const [modalVisible, setModalVisible] = useState(false);
    const [amount, setAmount] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // สร้าง state สำหรับข้อความผิดพลาด

    const handleButtonAddBank = () => {
        navigation.navigate('AddBankAccount', { restaurant_id: restaurant_id, wallets: wallets._id });
    };

    const handleAmountSubmit = () => {
        const enteredAmount = parseFloat(amount);

        // ตรวจสอบว่าเป็นตัวเลขหรือไม่
        if (isNaN(enteredAmount) || enteredAmount <= 0) {
            setErrorMessage('กรุณากรอกจำนวนเงินที่ถูกต้อง');
            return;
        }

        // ตรวจสอบจำนวนเงินไม่เกินยอดคงเหลือ
        if (enteredAmount > wallets.wallet.balance) {
            setErrorMessage('จำนวนเงินที่ถอนเกินจากยอดคงเหลือ');
            return;
        }

        // ถ้าไม่มีข้อผิดพลาด ให้ทำการยืนยันการถอน (หรือเพิ่มฟังก์ชันที่ต้องการที่นี่)
        setErrorMessage('');
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#FB992C', '#EC7A45']} start={{ x: 0.2, y: 0.8 }} style={styles.header}>
                <View style={{ flexWrap: 'wrap', alignSelf: 'center', marginLeft: 20, marginTop: 35 }}>
                    <MaterialIcons name="arrow-back-ios" size={24} color="white"
                        onPress={() => navigation.dispatch(CommonActions.goBack())} />
                </View>
                <Text style={styles.headerTitle}>บัญชีธนาคาร</Text>
            </LinearGradient>
            <TouchableOpacity style={styles.button} onPress={handleButtonAddBank}>
                <Text style={styles.buttonText}>เพิ่มบัญชีธนาคาร</Text>
            </TouchableOpacity>

            <View style={styles.bankAccountContainer}>
                <Text style={styles.subTitle}>บัญชีธนาคารของคุณ</Text>
                {wallets.bankAccount.map((wallet, index) => (
                    <TouchableOpacity key={index} onPress={() => setModalVisible(true)}>
                        <View style={styles.bankAccountCard}>
                            <Text style={styles.bankName}>{wallet.bankName}</Text>
                            <Text style={styles.accountName}>{wallet.accountName}</Text>
                            <Text style={styles.accountNumber}>
                                {wallet.accountNumber.slice(0, 2)}xxxxxx{wallet.accountNumber.slice(-2)}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Modal for amount input */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>จำนวนเงินที่ถอนได้</Text>
                        <Text style={styles.modalTitle}> ฿{wallets && wallets.wallet && wallets.wallet.balance !== undefined ? wallets.wallet.balance : '0'} </Text>
                        <TextInput
                            style={styles.input}
                            placeholder="กรอกจำนวนเงินที่ต้องการถอน"
                            keyboardType="numeric"
                            value={amount}
                            onChangeText={setAmount}
                        />

                        {/* แสดงข้อความผิดพลาด */}
                        {errorMessage ? (
                            <Text style={styles.errorText}>{errorMessage}</Text>
                        ) : null}

                        <View style={styles.swipeContainer}>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                                <Text style={styles.cancelButtonText}>ยกเลิก</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleAmountSubmit()} style={styles.confirmButton}>
                                <Text style={styles.confirmButtonText}>ยืนยัน</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
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
    button: {
        backgroundColor: '#FF914D',
        padding: 14,
        borderRadius: 30,
        alignSelf: 'center',
        marginTop: 20,
        marginBottom: 20,
        width: '90%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
        textAlign: 'center',
    },
    bankAccountContainer: {
        marginTop: 15,
        margin: 10
    },
    subTitle: {
        fontSize: 18,
        fontWeight: '500',
        marginBottom: 10,
        color: '#333',
    },
    bankAccountCard: {
        backgroundColor: '#fff',
        padding: 15,
        marginBottom: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    bankName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    accountName: {
        fontSize: 16,
        fontWeight: '400',
        color: '#666',
        marginTop: 5,
    },
    accountNumber: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginTop: 5,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 10,
        fontSize: 16,
        marginBottom: 20,
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginBottom: 10,
    },
    swipeContainer: {
        flexDirection:'row'
    },
    confirmButtonText: {
        color:'white'
    },
    confirmButton:{
        backgroundColor:'#FF914D',
        padding:10,
        marginLeft:10,
        borderRadius:10
    },
    cancelButton: {
        backgroundColor:'red',
        padding:10,
        borderRadius:10

    },
    cancelButtonText: {
        color:'white'
    },
});

export default BankAccountScreen;
