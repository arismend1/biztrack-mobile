import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getClients } from '../../api/clients';

const ClientsListScreen = ({ navigation }) => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchClients = async () => {
        try {
            const data = await getClients();
            setClients(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchClients();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchClients();
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('ClientDetail', { id: item.id })}
        >
            <Text style={styles.name}>{item.name}</Text>
            {item.email && <Text style={styles.info}>{item.email}</Text>}
            {item.phone && <Text style={styles.info}>{item.phone}</Text>}
        </TouchableOpacity>
    );

    if (loading && !refreshing) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Clients</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('ClientForm')}
                >
                    <Text style={styles.addButtonText}>+ New</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={clients}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                ListEmptyComponent={<Text style={styles.emptyText}>No clients found. Add one!</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    title: { fontSize: 24, fontWeight: 'bold' },
    addButton: { backgroundColor: '#007AFF', padding: 10, borderRadius: 8 },
    addButtonText: { color: '#fff', fontWeight: 'bold' },
    list: { padding: 15 },
    card: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3, elevation: 1
    },
    name: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
    info: { color: '#666' },
    emptyText: { textAlign: 'center', marginTop: 30, color: '#999' }
});

export default ClientsListScreen;
