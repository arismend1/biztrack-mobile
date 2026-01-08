import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getClientById } from '../../api/clients';

const ClientDetailScreen = ({ navigation, route }) => {
    const { id } = route.params;
    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchClient();
        });
        return unsubscribe;
    }, [navigation, id]);

    const fetchClient = async () => {
        try {
            setLoading(true);
            const data = await getClientById(id);
            setClient(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <View style={styles.center}><ActivityIndicator size="large" color="#007AFF" /></View>;
    }

    if (!client) {
        return <View style={styles.center}><Text>Client not found</Text></View>;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Client Details</Text>
                <TouchableOpacity onPress={() => navigation.navigate('ClientForm', { id: client.id })} style={styles.editBtn}>
                    <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.card}>
                    <Text style={styles.name}>{client.name}</Text>
                    <View style={styles.divider} />

                    <InfoRow label="Email" value={client.email} />
                    <InfoRow label="Phone" value={client.phone} />
                    <View style={styles.divider} />

                    <Text style={styles.sectionHeader}>Address</Text>
                    <Text style={styles.addressText}>
                        {[client.address, client.city, client.state, client.zip, client.country].filter(Boolean).join(', ')}
                    </Text>
                </View>

                {/* Additional sections for Recent Estimates/Invoices could go here */}
            </ScrollView>
        </View>
    );
};

const InfoRow = ({ label, value }) => (
    <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value || '-'}</Text>
    </View>
);

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
    editBtn: { padding: 10 },
    editText: { color: '#007AFF', fontWeight: 'bold', fontSize: 16 },
    content: { padding: 20 },
    card: { backgroundColor: '#fff', borderRadius: 12, padding: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
    name: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
    divider: { height: 1, backgroundColor: '#eee', marginVertical: 15 },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    label: { color: '#666', fontSize: 14 },
    value: { color: '#333', fontSize: 14, fontWeight: '500' },
    sectionHeader: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, marginTop: 5 },
    addressText: { color: '#333', lineHeight: 20 }
});

export default ClientDetailScreen;
