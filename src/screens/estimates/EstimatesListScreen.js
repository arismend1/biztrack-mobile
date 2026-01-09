import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getEstimates } from '../../api/estimates';

const EstimatesListScreen = ({ navigation }) => {
    const [estimates, setEstimates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchEstimates = async () => {
        try {
            const data = await getEstimates();
            setEstimates(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchEstimates();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchEstimates();
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('EstimateDetail', { id: item.id })}
        >
            <View style={styles.row}>
                <Text style={styles.number}>Est #{item.number}</Text>
                <Text style={styles.status}>{item.status}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.client}>{item.client?.name}</Text>
                <Text style={styles.total}>${item.total.toFixed(2)}</Text>
            </View>
            <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
        </TouchableOpacity>
    );

    if (loading && !refreshing) {
        return <View style={styles.center}><ActivityIndicator size="large" color="#007AFF" /></View>;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Estimates</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('EstimateForm')}
                >
                    <Text style={styles.addButtonText}>+ New</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={estimates}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                ListEmptyComponent={<Text style={styles.emptyText}>No estimates found.</Text>}
            />
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
    addButton: { backgroundColor: '#007AFF', padding: 10, borderRadius: 8 },
    addButtonText: { color: '#fff', fontWeight: 'bold' },
    list: { padding: 15 },
    card: {
        backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 10,
        shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3
    },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
    number: { fontWeight: 'bold', fontSize: 16 },
    status: { fontSize: 12, fontWeight: 'bold', color: '#666', textTransform: 'uppercase' },
    client: { color: '#333', fontSize: 14 },
    total: { fontWeight: 'bold', fontSize: 16, color: '#007AFF' },
    date: { fontSize: 12, color: '#999', marginTop: 5 },
    emptyText: { textAlign: 'center', marginTop: 30, color: '#999' }
});

export default EstimatesListScreen;
