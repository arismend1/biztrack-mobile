import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { getCompany, updateCompany } from '../../api/company';

const CompanyScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zip, setZip] = useState('');

    useEffect(() => {
        fetchCompany();
    }, []);

    const fetchCompany = async () => {
        try {
            const data = await getCompany();
            setName(data.name || '');
            setEmail(data.email || '');
            setPhone(data.phone || '');
            setAddress(data.address || '');
            setCity(data.city || '');
            setState(data.state || '');
            setZip(data.zip || '');
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to load company settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!name) return Alert.alert('Error', 'Company Name is required');

        try {
            setSaving(true);
            await updateCompany({
                name,
                email,
                phone,
                address,
                city,
                state,
                zip
            });
            Alert.alert('Success', 'Settings saved successfully');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#007AFF" /></View>;

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Company Settings</Text>
                <Text style={styles.subtitle}>Manage your business details for invoices</Text>
            </View>

            <View style={styles.form}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Company Name</Text>
                    <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Business Name" />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email (for Invoices)</Text>
                    <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="contact@business.com" keyboardType="email-address" autoCapitalize="none" />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Phone</Text>
                    <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="(555) 123-4567" keyboardType="phone-pad" />
                </View>

                <Text style={styles.sectionTitle}>Address</Text>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Street Address</Text>
                    <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="123 Main St" />
                </View>

                <View style={styles.row}>
                    <View style={[styles.inputGroup, { flex: 2, marginRight: 10 }]}>
                        <Text style={styles.label}>City</Text>
                        <TextInput style={styles.input} value={city} onChangeText={setCity} placeholder="New York" />
                    </View>
                    <View style={[styles.inputGroup, { flex: 1 }]}>
                        <Text style={styles.label}>State</Text>
                        <TextInput style={styles.input} value={state} onChangeText={setState} placeholder="NY" />
                    </View>
                </View>

                <View style={[styles.inputGroup, { width: '40%' }]}>
                    <Text style={styles.label}>Zip Code</Text>
                    <TextInput style={styles.input} value={zip} onChangeText={setZip} placeholder="10001" keyboardType="numeric" />
                </View>

                <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
                    {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveText}>Save Changes</Text>}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
    title: { fontSize: 24, fontWeight: 'bold' },
    subtitle: { fontSize: 14, color: '#666', marginTop: 5 },
    form: { padding: 20 },
    inputGroup: { marginBottom: 20 },
    label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
    input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 10, marginBottom: 20 },
    row: { flexDirection: 'row' },
    saveBtn: { backgroundColor: '#007AFF', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 20 },
    saveText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default CompanyScreen;
