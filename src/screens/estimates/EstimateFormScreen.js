import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Modal, FlatList } from 'react-native';
import { createEstimate } from '../../api/estimates';
import { getClients } from '../../api/clients';
import { getItems } from '../../api/items';

const EstimateFormScreen = ({ navigation }) => {
    const [clients, setClients] = useState([]);
    const [items, setItems] = useState([]);
    const [form, setForm] = useState({ clientId: '', items: [], subtotal: 0, taxAmount: 0, discount: 0, total: 0, notes: '' });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Modals
    const [clientModalVisible, setClientModalVisible] = useState(false);
    const [itemModalVisible, setItemModalVisible] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        calculateTotals();
    }, [form.items, form.discount]);

    const loadData = async () => {
        try {
            const [c, i] = await Promise.all([getClients(), getItems()]);
            setClients(c);
            setItems(i);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const addItem = (item) => {
        const newItem = {
            ...item,
            quantity: 1,
            total: item.price
        };
        setForm(prev => ({ ...prev, items: [...prev.items, newItem] }));
        setItemModalVisible(false);
    };

    const calculateTotals = () => {
        const subtotal = form.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        // Assuming simple tax for now, maybe use item specific tax later
        const tax = subtotal * 0.08; // 8% Default
        const total = subtotal + tax - (parseFloat(form.discount) || 0);
        setForm(prev => ({ ...prev, subtotal, taxAmount: tax, total }));
    };

    const handleSubmit = async () => {
        if (!form.clientId) {
            Alert.alert('Validation', 'Client is required');
            return;
        }
        if (form.items.length === 0) {
            Alert.alert('Validation', 'Add at least one item');
            return;
        }

        setSubmitting(true);
        try {
            await createEstimate(form);
            Alert.alert('Success', 'Estimate created');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Could not create estimate');
        } finally {
            setSubmitting(false);
        }
    };

    const selectedClient = clients.find(c => c.id === form.clientId);

    if (loading) return <View style={styles.center}><ActivityIndicator size="large" /></View>;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Text style={styles.backText}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.title}>New Estimate</Text>
                <TouchableOpacity onPress={handleSubmit} style={styles.saveBtn} disabled={submitting}>
                    {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveText}>Save</Text>}
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.form}>
                <Text style={styles.label}>Client *</Text>
                <TouchableOpacity style={styles.selector} onPress={() => setClientModalVisible(true)}>
                    <Text style={styles.selectorText}>{selectedClient ? selectedClient.name : 'Select Client'}</Text>
                </TouchableOpacity>

                <View style={styles.sectionRow}>
                    <Text style={styles.sectionHeader}>Items</Text>
                    <TouchableOpacity onPress={() => setItemModalVisible(true)}>
                        <Text style={styles.actionText}>+ Add Item</Text>
                    </TouchableOpacity>
                </View>

                {form.items.map((item, index) => (
                    <View key={index} style={styles.itemRow}>
                        <Text style={{ flex: 2 }}>{item.name}</Text>
                        <Text style={{ flex: 1 }}>x{item.quantity}</Text>
                        <Text style={{ flex: 1 }}>${item.total.toFixed(2)}</Text>
                        <TouchableOpacity onPress={() => {
                            const newItems = [...form.items];
                            newItems.splice(index, 1);
                            setForm({ ...form, items: newItems });
                        }}>
                            <Text style={{ color: 'red' }}>X</Text>
                        </TouchableOpacity>
                    </View>
                ))}

                <View style={[styles.divider, { marginVertical: 20 }]} />

                <Text style={styles.label}>Notes</Text>
                <TextInput style={styles.input} value={form.notes} onChangeText={t => setForm({ ...form, notes: t })} multiline />

                <Text style={styles.totalText}>Total: ${form.total.toFixed(2)}</Text>
            </ScrollView>

            {/* Client Picker Modal */}
            <Modal visible={clientModalVisible} animationType="slide">
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Select Client</Text>
                    <FlatList
                        data={clients}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.modalItem} onPress={() => {
                                setForm({ ...form, clientId: item.id });
                                setClientModalVisible(false);
                            }}>
                                <Text style={styles.modalItemText}>{item.name}</Text>
                            </TouchableOpacity>
                        )}
                    />
                    <TouchableOpacity onPress={() => setClientModalVisible(false)} style={styles.closeBtn}>
                        <Text style={{ color: 'white' }}>Close</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            {/* Item Picker Modal */}
            <Modal visible={itemModalVisible} animationType="slide">
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Select Item</Text>
                    <FlatList
                        data={items}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.modalItem} onPress={() => addItem(item)}>
                                <Text style={styles.modalItemText}>{item.name} - ${item.price}</Text>
                            </TouchableOpacity>
                        )}
                    />
                    <TouchableOpacity onPress={() => setItemModalVisible(false)} style={styles.closeBtn}>
                        <Text style={{ color: 'white' }}>Close</Text>
                    </TouchableOpacity>
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
    saveBtn: { backgroundColor: '#007AFF', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
    saveText: { color: '#fff', fontWeight: 'bold' },
    form: { padding: 20 },
    label: { fontSize: 14, color: '#666', marginBottom: 5, marginTop: 10 },
    input: { backgroundColor: '#fff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', fontSize: 16 },
    selector: { backgroundColor: '#fff', padding: 15, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
    selectorText: { fontSize: 16 },
    sectionRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, marginBottom: 10 },
    sectionHeader: { fontSize: 16, fontWeight: 'bold' },
    actionText: { color: '#007AFF', fontWeight: 'bold' },
    itemRow: { flexDirection: 'row', backgroundColor: '#fff', padding: 10, borderRadius: 5, marginBottom: 5, alignItems: 'center' },
    divider: { height: 1, backgroundColor: '#ddd' },
    totalText: { fontSize: 24, fontWeight: 'bold', textAlign: 'right', marginTop: 20 },
    modalContainer: { flex: 1, padding: 50, backgroundColor: '#fff' },
    modalTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    modalItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
    modalItemText: { fontSize: 18 },
    closeBtn: { marginTop: 20, padding: 15, backgroundColor: 'red', borderRadius: 8, alignItems: 'center' }
});

export default EstimateFormScreen;
