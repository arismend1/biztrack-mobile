import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { createItem, updateItem, getItemById } from '../../api/items';

const ItemFormScreen = ({ navigation, route }) => {
    const { id } = route.params || {};
    const isEditing = !!id;

    const [form, setForm] = useState({ name: '', description: '', price: '', taxRate: '0' });
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(false);

    useEffect(() => {
        if (isEditing) {
            fetchItem();
        }
    }, [id]);

    const fetchItem = async () => {
        setInitialLoading(true);
        try {
            const data = await getItemById(id);
            setForm({
                name: data.name,
                description: data.description || '',
                price: data.price.toString(),
                taxRate: data.taxRate ? data.taxRate.toString() : '0'
            });
        } catch (error) {
            Alert.alert('Error', 'Could not load item');
            navigation.goBack();
        } finally {
            setInitialLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!form.name || !form.price) {
            Alert.alert('Validation', 'Name and Price are required');
            return;
        }

        setLoading(true);
        try {
            if (isEditing) {
                await updateItem(id, form);
                Alert.alert('Success', 'Item updated');
            } else {
                await createItem(form);
                Alert.alert('Success', 'Item created');
            }
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Could not save item');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return <View style={styles.center}><ActivityIndicator size="large" /></View>;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Text style={styles.backText}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.title}>{isEditing ? 'Edit Item' : 'New Item'}</Text>
                <TouchableOpacity onPress={handleSubmit} style={styles.saveBtn} disabled={loading}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveText}>Save</Text>}
                </TouchableOpacity>
            </View>
            <View style={styles.form}>
                <Text style={styles.label}>Name *</Text>
                <TextInput style={styles.input} value={form.name} onChangeText={t => setForm({ ...form, name: t })} />

                <Text style={styles.label}>Description</Text>
                <TextInput style={styles.input} value={form.description} onChangeText={t => setForm({ ...form, description: t })} multiline />

                <View style={styles.row}>
                    <View style={styles.half}>
                        <Text style={styles.label}>Price *</Text>
                        <TextInput style={styles.input} value={form.price} onChangeText={t => setForm({ ...form, price: t })} keyboardType="numeric" placeholder="0.00" />
                    </View>
                    <View style={styles.half}>
                        <Text style={styles.label}>Tax Rate (%)</Text>
                        <TextInput style={styles.input} value={form.taxRate} onChangeText={t => setForm({ ...form, taxRate: t })} keyboardType="numeric" placeholder="0" />
                    </View>
                </View>
            </View>
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
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    half: { width: '48%' }
});

export default ItemFormScreen;
