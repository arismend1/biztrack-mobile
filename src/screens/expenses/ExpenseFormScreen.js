import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { createExpense } from '../../api/expenses';

const ExpenseFormScreen = ({ navigation }) => {
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('materials'); // Default
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!title || !amount) {
            Alert.alert('Error', 'Please fill in Title and Amount');
            return;
        }

        try {
            setLoading(true);
            await createExpense({
                title,
                amount,
                category,
                description,
                date: new Date().toISOString()
            });
            Alert.alert('Success', 'Expense logged');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Failed to save expense');
        } finally {
            setLoading(false);
        }
    };

    const CategoryButton = ({ value, label }) => (
        <TouchableOpacity
            style={[styles.catBtn, category === value && styles.catBtnActive]}
            onPress={() => setCategory(value)}
        >
            <Text style={[styles.catText, category === value && styles.catTextActive]}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Text style={styles.backText}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.title}>New Expense</Text>
                <View style={{ width: 50 }} />
            </View>

            <View style={styles.form}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Title</Text>
                    <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="e.g. Lumber, Gas, Lunch" />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Amount ($)</Text>
                    <TextInput style={styles.input} value={amount} onChangeText={setAmount} placeholder="0.00" keyboardType="numeric" />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Category</Text>
                    <View style={styles.categories}>
                        <CategoryButton value="materials" label="Materials" />
                        <CategoryButton value="labor" label="Labor" />
                        <CategoryButton value="fuel" label="Fuel" />
                        <CategoryButton value="equipment" label="Equipment" />
                        <CategoryButton value="other" label="Other" />
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Notes (Optional)</Text>
                    <TextInput
                        style={[styles.input, { height: 80 }]}
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Additional details..."
                        multiline
                    />
                </View>

                <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveText}>Save Expense</Text>}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#fff', paddingTop: 50 },
    backText: { color: '#007AFF', fontSize: 16 },
    title: { fontSize: 18, fontWeight: 'bold' },
    form: { padding: 20 },
    inputGroup: { marginBottom: 25 },
    label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 10 },
    input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 15, fontSize: 16 },
    categories: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    catBtn: { paddingHorizontal: 15, paddingVertical: 10, borderRadius: 20, backgroundColor: '#eee', marginBottom: 5 },
    catBtnActive: { backgroundColor: '#007AFF' },
    catText: { fontSize: 12, fontWeight: '600', color: '#666' },
    catTextActive: { color: '#fff' },
    saveBtn: { backgroundColor: '#007AFF', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 },
    saveText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default ExpenseFormScreen;
