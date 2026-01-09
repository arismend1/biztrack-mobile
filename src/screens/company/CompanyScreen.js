import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { getCompany, updateCompany } from '../../api/company';

const CompanyScreen = ({ navigation }) => {
    const [form, setForm] = useState({});
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        fetchCompany();
    }, []);

    const fetchCompany = async () => {
        try {
            const data = await getCompany();
            setForm(data);
        } catch (error) {
            Alert.alert('Error', 'Could not load company info');
        } finally {
            setInitialLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!form.name) {
            Alert.alert('Validation', 'Name is required');
            return;
        }

        setLoading(true);
        try {
            await updateCompany(form);
            Alert.alert('Success', 'Company info updated');
        } catch (error) {
            Alert.alert('Error', 'Could not update company');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) return <View style={styles.center}><ActivityIndicator size="large" /></View>;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Company Settings</Text>
                <TouchableOpacity onPress={handleSubmit} style={styles.saveBtn} disabled={loading}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveText}>Save</Text>}
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.form}>
                <Text style={styles.label}>Company Name</Text>
                <TextInput style={styles.input} value={form.name} onChangeText={t => setForm({ ...form, name: t })} />

                <Text style={styles.label}>Email</Text>
                <TextInput style={styles.input} value={form.email} onChangeText={t => setForm({ ...form, email: t })} />

                <Text style={styles.label}>Phone</Text>
                <TextInput style={styles.input} value={form.phone} onChangeText={t => setForm({ ...form, phone: t })} />

                <Text style={styles.sectionHeader}>Address</Text>
                <Text style={styles.label}>Street</Text>
                <TextInput style={styles.input} value={form.address} onChangeText={t => setForm({ ...form, address: t })} />

                <View style={styles.row}>
                    <View style={styles.half}>
                        <Text style={styles.label}>City</Text>
                        <TextInput style={styles.input} value={form.city} onChangeText={t => setForm({ ...form, city: t })} />
                    </View>
                    <View style={styles.half}>
                        <Text style={styles.label}>State</Text>
                        <TextInput style={styles.input} value={form.state} onChangeText={t => setForm({ ...form, state: t })} />
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={styles.half}>
                        <Text style={styles.label}>Zip</Text>
                        <TextInput style={styles.input} value={form.zip} onChangeText={t => setForm({ ...form, zip: t })} />
                    </View>
                    <View style={styles.half}>
                        <Text style={styles.label}>Country</Text>
                        <TextInput style={styles.input} value={form.country} onChangeText={t => setForm({ ...form, country: t })} />
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
        padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee'
    },
    title: { fontSize: 24, fontWeight: 'bold' },
    saveBtn: { backgroundColor: '#007AFF', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
    saveText: { color: '#fff', fontWeight: 'bold' },
    form: { padding: 20 },
    label: { fontSize: 14, color: '#666', marginBottom: 5, marginTop: 10 },
    input: { backgroundColor: '#fff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', fontSize: 16 },
    sectionHeader: { fontSize: 16, fontWeight: 'bold', marginTop: 20, marginBottom: 5 },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    half: { width: '48%' }
});

export default CompanyScreen;
