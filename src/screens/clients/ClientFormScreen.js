import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { createClient, updateClient, getClientById } from '../../api/clients';

const ClientFormScreen = ({ navigation, route }) => {
    const { id } = route.params || {};
    const isEditing = !!id;

    const [form, setForm] = useState({
        name: '', email: '', phone: '', address: '', city: '', state: '', zip: '', country: ''
    });
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(false);

    useEffect(() => {
        if (isEditing) {
            fetchClient();
        }
    }, [id]);

    const fetchClient = async () => {
        setInitialLoading(true);
        try {
            const data = await getClientById(id);
            setForm({
                name: data.name || '',
                email: data.email || '',
                phone: data.phone || '',
                address: data.address || '',
                city: data.city || '',
                state: data.state || '',
                zip: data.zip || '',
                country: data.country || ''
            });
        } catch (error) {
            Alert.alert('Error', 'Could not load client details');
            navigation.goBack();
        } finally {
            setInitialLoading(false);
        }
    };

    const handleChange = (key, value) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async () => {
        if (!form.name) {
            Alert.alert('Validation', 'Name is required');
            return;
        }

        setLoading(true);
        try {
            if (isEditing) {
                await updateClient(id, form);
                Alert.alert('Success', 'Client updated');
            } else {
                await createClient(form);
                Alert.alert('Success', 'Client created');
            }
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Could not save client');
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
                <Text style={styles.title}>{isEditing ? 'Edit Client' : 'New Client'}</Text>
                <TouchableOpacity onPress={handleSubmit} style={styles.saveBtn} disabled={loading}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveText}>Save</Text>}
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.form}>
                <Text style={styles.label}>Name *</Text>
                <TextInput style={styles.input} value={form.name} onChangeText={t => handleChange('name', t)} placeholder="Client Name" />

                <Text style={styles.label}>Email</Text>
                <TextInput style={styles.input} value={form.email} onChangeText={t => handleChange('email', t)} placeholder="email@example.com" keyboardType="email-address" autoCapitalize="none" />

                <Text style={styles.label}>Phone</Text>
                <TextInput style={styles.input} value={form.phone} onChangeText={t => handleChange('phone', t)} placeholder="(555) 123-4567" keyboardType="phone-pad" />

                <Text style={styles.sectionHeader}>Address</Text>

                <Text style={styles.label}>Street</Text>
                <TextInput style={styles.input} value={form.address} onChangeText={t => handleChange('address', t)} placeholder="123 Main St" />

                <View style={styles.row}>
                    <View style={styles.half}>
                        <Text style={styles.label}>City</Text>
                        <TextInput style={styles.input} value={form.city} onChangeText={t => handleChange('city', t)} />
                    </View>
                    <View style={styles.half}>
                        <Text style={styles.label}>State</Text>
                        <TextInput style={styles.input} value={form.state} onChangeText={t => handleChange('state', t)} />
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={styles.half}>
                        <Text style={styles.label}>Zip Code</Text>
                        <TextInput style={styles.input} value={form.zip} onChangeText={t => handleChange('zip', t)} keyboardType="numeric" />
                    </View>
                    <View style={styles.half}>
                        <Text style={styles.label}>Country</Text>
                        <TextInput style={styles.input} value={form.country} onChangeText={t => handleChange('country', t)} />
                    </View>
                </View>
            </ScrollView>
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
    sectionHeader: { fontSize: 16, fontWeight: 'bold', marginTop: 20, marginBottom: 5, color: '#333' },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    half: { width: '48%' }
});

export default ClientFormScreen;
