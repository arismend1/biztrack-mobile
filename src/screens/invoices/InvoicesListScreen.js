import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getInvoices } from '../../api/invoices';

const InvoicesListScreen = ({ navigation }) => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchInvoices = async () => {
        try {
            const data = await getInvoices();
            setInvoices(data);
        } catch (error) {
            console.error(error);
            Alert.alert(
                "Error Load Invoices",
                JSON.stringify(error.response?.data || error.message)
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchInvoices();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchInvoices();
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('InvoiceDetail', { id: item.id })}
        >
            <View style={styles.row}>
                <Text style={styles.number}>Inv #{item.number}</Text>
                <Text style={[styles.status, getStatusStyle(item.status)]}>{item.status}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.client}>{item.client?.name}</Text>
                <Text style={styles.total}>${item.total.toFixed(2)}</Text>
            </View>
            <Text style={styles.date}>Due: {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : 'N/A'}</Text>
        </TouchableOpacity>
    );

    const getStatusStyle = (status) => {
        switch (status) {
            case 'PAID': return { color: 'green' };
            case 'PARTIAL': return { color: 'orange' };
            default: return { color: 'red' };
        }
    };

    if (loading && !refreshing) {
        return <View style={styles.center}><ActivityIndicator size="large" color="#007AFF" /></View>;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Invoices</Text>
            </View>
            <FlatList
                data={invoices}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                ListEmptyComponent={<Text style={styles.emptyText}>No invoices found.</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: {
        padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee', justifyContent: 'center'
    },
    title: { fontSize: 24, fontWeight: 'bold' },
    list: { padding: 15 },
    card: {
        backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 10,
        shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3
    },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
    number: { fontWeight: 'bold', fontSize: 16 },
    status: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
    client: { color: '#333', fontSize: 14 },
    total: { fontWeight: 'bold', fontSize: 16, color: '#007AFF' },
    date: { fontSize: 12, color: '#999', marginTop: 5 },
    emptyText: { textAlign: 'center', marginTop: 30, color: '#999' }
});

export default InvoicesListScreen;
