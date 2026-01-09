import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getItems } from '../../api/items';

const ItemsListScreen = ({ navigation }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchItems = async () => {
        try {
            const data = await getItems();
            setItems(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchItems();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchItems();
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('ItemForm', { id: item.id })}
        >
            <View style={styles.row}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>${item.price.toFixed(2)}</Text>
            </View>
            {item.description && <Text style={styles.description} numberOfLines={2}>{item.description}</Text>}
        </TouchableOpacity>
    );

    if (loading && !refreshing) {
        return <View style={styles.center}><ActivityIndicator size="large" color="#007AFF" /></View>;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Items / Services</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('ItemForm')}
                >
                    <Text style={styles.addButtonText}>+ New</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                ListEmptyComponent={<Text style={styles.emptyText}>No items found.</Text>}
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
    name: { fontSize: 16, fontWeight: 'bold', flex: 1 },
    price: { fontSize: 16, fontWeight: 'bold', color: '#007AFF' },
    description: { color: '#666', fontSize: 14 },
    emptyText: { textAlign: 'center', marginTop: 30, color: '#999' }
});

export default ItemsListScreen;
