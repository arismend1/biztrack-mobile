import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { getEstimateById, convertToInvoice } from '../../api/estimates';

const EstimateDetailScreen = ({ navigation, route }) => {
    const { id } = route.params;
    const [estimate, setEstimate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [converting, setConverting] = useState(false);

    useEffect(() => {
        fetchEstimate();
    }, [id]);

    const fetchEstimate = async () => {
        try {
            const data = await getEstimateById(id);
            setEstimate(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleConvert = async () => {
        setConverting(true);
        try {
            await convertToInvoice(id);
            Alert.alert('Success', 'Converted to Invoice!');
            navigation.navigate('Invoices'); // Assuming this tab exists or handled by nav
        } catch (error) {
            Alert.alert('Error', 'Could not convert');
        } finally {
            setConverting(false);
        }
    };

    if (loading) return <View style={styles.center}><ActivityIndicator size="large" /></View>;
    if (!estimate) return <View style={styles.center}><Text>Estimate not found</Text></View>;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Estimate #{estimate.number}</Text>
                <View style={{ width: 50 }} />
            </View>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.card}>
                    <Text style={styles.clientName}>{estimate.client?.name}</Text>
                    <Text style={styles.status}>{estimate.status}</Text>
                    <View style={styles.divider} />
                    {estimate.items?.map((item, index) => (
                        <View key={index} style={styles.itemRow}>
                            <Text style={styles.itemName}>{item.name} x{item.quantity}</Text>
                            <Text style={styles.itemTotal}>${item.total.toFixed(2)}</Text>
                        </View>
                    ))}
                    <View style={styles.divider} />
                    <View style={styles.row}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>${estimate.total.toFixed(2)}</Text>
                    </View>
                </View>

                {estimate.status !== 'INVOICED' && (
                    <TouchableOpacity style={styles.convertBtn} onPress={handleConvert} disabled={converting}>
                        {converting ? <ActivityIndicator color="#fff" /> : <Text style={styles.convertText}>Convert to Invoice</Text>}
                    </TouchableOpacity>
                )}
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
    content: { padding: 20 },
    card: { backgroundColor: '#fff', borderRadius: 12, padding: 20, paddingBottom: 30, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
    clientName: { fontSize: 20, fontWeight: 'bold' },
    status: { fontSize: 14, color: '#666', marginTop: 5, textTransform: 'uppercase' },
    divider: { height: 1, backgroundColor: '#eee', marginVertical: 15 },
    itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    itemName: { fontSize: 16 },
    itemTotal: { fontWeight: 'bold' },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    totalLabel: { fontSize: 18, fontWeight: 'bold' },
    totalValue: { fontSize: 24, fontWeight: 'bold', color: '#007AFF' },
    convertBtn: { backgroundColor: '#34C759', padding: 15, borderRadius: 10, marginTop: 20, alignItems: 'center' },
    convertText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default EstimateDetailScreen;
