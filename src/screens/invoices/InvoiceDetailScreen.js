import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Modal, TextInput } from 'react-native';
import { getInvoiceById, registerPayment } from '../../api/invoices';

const InvoiceDetailScreen = ({ navigation, route }) => {
    const { id } = route.params;
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paymentModalVisible, setPaymentModalVisible] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState('');

    useEffect(() => {
        fetchInvoice();
    }, [id]);

    const fetchInvoice = async () => {
        try {
            setLoading(true);
            const data = await getInvoiceById(id);
            setInvoice(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async () => {
        if (!paymentAmount) return;
        try {
            await registerPayment(id, { amount: paymentAmount, method: 'CASH', notes: 'Mobile App' });
            Alert.alert('Success', 'Payment registered');
            setPaymentModalVisible(false);
            setPaymentAmount('');
            fetchInvoice();
        } catch (error) {
            Alert.alert('Error', 'Payment failed');
        }
    };

    if (loading) return <View style={styles.center}><ActivityIndicator size="large" /></View>;
    if (!invoice) return <View style={styles.center}><Text>Invoice not found</Text></View>;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Invoice #{invoice.number}</Text>
                <View style={{ width: 50 }} />
            </View>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.card}>
                    <Text style={styles.clientName}>{invoice.client?.name}</Text>
                    <Text style={[styles.status, { color: invoice.status === 'PAID' ? 'green' : 'red' }]}>{invoice.status}</Text>

                    <View style={styles.divider} />

                    <View style={styles.row}>
                        <Text style={styles.label}>Total</Text>
                        <Text style={styles.value}>${invoice.total.toFixed(2)}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Paid</Text>
                        <Text style={[styles.value, { color: 'green' }]}>${invoice.amountPaid.toFixed(2)}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Balance Due</Text>
                        <Text style={[styles.value, { color: 'red' }]}>${invoice.balanceDue.toFixed(2)}</Text>
                    </View>
                </View>

                {invoice.status !== 'PAID' && (
                    <TouchableOpacity style={styles.payBtn} onPress={() => setPaymentModalVisible(true)}>
                        <Text style={styles.payText}>Register Payment</Text>
                    </TouchableOpacity>
                )}

                <Text style={styles.sectionHeader}>History</Text>
                {invoice.payments?.map((payment, index) => (
                    <View key={index} style={styles.paymentRow}>
                        <Text>{new Date(payment.date).toLocaleDateString()}</Text>
                        <Text style={{ fontWeight: 'bold' }}>${payment.amount.toFixed(2)}</Text>
                    </View>
                ))}
            </ScrollView>

            <Modal visible={paymentModalVisible} transparent animationType="fade">
                <View style={styles.modalBg}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Register Payment</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Amount"
                            keyboardType="numeric"
                            value={paymentAmount}
                            onChangeText={setPaymentAmount}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity onPress={() => setPaymentModalVisible(false)} style={styles.cancelBtn}>
                                <Text>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handlePayment} style={styles.confirmBtn}>
                                <Text style={{ color: 'white' }}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        padding: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee', paddingTop: 50
    },
    backBtn: { padding: 10 },
    backText: { color: '#007AFF', fontSize: 16 },
    title: { fontSize: 18, fontWeight: 'bold' },
    content: { padding: 20 },
    card: { backgroundColor: '#fff', borderRadius: 12, padding: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
    clientName: { fontSize: 20, fontWeight: 'bold' },
    status: { fontSize: 14, marginTop: 5, fontWeight: 'bold' },
    divider: { height: 1, backgroundColor: '#eee', marginVertical: 15 },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    label: { fontSize: 16, color: '#666' },
    value: { fontSize: 16, fontWeight: 'bold' },
    payBtn: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, marginTop: 20, alignItems: 'center' },
    payText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    sectionHeader: { fontSize: 18, fontWeight: 'bold', marginTop: 30, marginBottom: 10 },
    paymentRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff', borderRadius: 8, marginBottom: 5 },
    modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 30 },
    modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 12 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    input: { borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 8, marginBottom: 20, fontSize: 18 },
    modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
    cancelBtn: { padding: 15, flex: 1, alignItems: 'center' },
    confirmBtn: { padding: 15, backgroundColor: '#007AFF', flex: 1, alignItems: 'center', borderRadius: 8 }
});

export default InvoiceDetailScreen;
