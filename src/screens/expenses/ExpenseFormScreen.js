import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { createExpense } from '../../api/expenses';

const ExpenseFormScreen = ({ navigation }) => {
    const [form, setForm] = useState({ title: '', amount: '', category: '', date: new Date() });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!form.title || !form.amount) {
            Alert.alert('Validation', 'Title and Amount required');
            return;
        }

        setLoading(true);
        try {
            await createExpense({ ...form, date: new Date() }); // Simplified date for now
            Alert.alert('Success', 'Expense logged');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Could not save expense');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Text style={styles.backText}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.title}>New Expense</Text>
                <TouchableOpacity onPress={handleSubmit} style={styles.saveBtn} disabled={loading}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveText}>Save</Text>}
                </TouchableOpacity>
            </View>
            <View style={styles.form}>
                <Text style={styles.label}>Description *</Text>
                <TextInput style={styles.input} value={form.title} onChangeText={t => setForm({ ...form, title: t })} />

                <Text style={styles.label}>Amount ($) *</Text>
                <TextInput style={styles.input} value={form.amount} onChangeText={t => setForm({ ...form, amount: t })} keyboardType="numeric" placeholder="0.00" />

                <Text style={styles.label}>Category</Text>
                <TextInput style={styles.input} value={form.category} onChangeText={t => setForm({ ...form, category: t })} placeholder="e.g. Materials, Fuel" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        padding: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee', paddingTop: 50
    },
    backBtn: { padding: 10 },
    backText: { color: '#007AFF', fontSize: 16 },
    title: { fontSize: 18, fontWeight: 'bold' },
    saveBtn: { backgroundColor: '#FF3B30', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
    saveText: { color: '#fff', fontWeight: 'bold' },
    form: { padding: 20 },
    label: { fontSize: 14, color: '#666', marginBottom: 5, marginTop: 10 },
    input: { backgroundColor: '#fff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', fontSize: 16 },
});

export default ExpenseFormScreen;
