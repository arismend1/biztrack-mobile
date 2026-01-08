import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getExpenses, deleteExpense } from '../../api/expenses';

const ExpensesListScreen = ({ navigation }) => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchExpenses = async () => {
        try {
            const data = await getExpenses();
            setExpenses(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchExpenses();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchExpenses();
    };

    const handleDelete = async (id) => {
        // In a real app, confirm first
        try {
            await deleteExpense(id);
            fetchExpenses();
        } catch (error) {
            console.error('Failed to delete expense');
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.row}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.category}>{item.category} • {new Date(item.date).toLocaleDateString()}</Text>
                </View>
                <Text style={styles.amount}>-${item.amount.toFixed(2)}</Text>
            </View>
        </View>
    );

    if (loading && !refreshing) {
        return <View style={styles.center}><ActivityIndicator size="large" color="#007AFF" /></View>;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Expenses</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('ExpenseForm')}
                >
                    <Text style={styles.addButtonText}>+ Add</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={expenses}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                ListEmptyComponent={<Text style={styles.emptyText}>No expenses logged.</Text>}
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
    headerTitle: { fontSize: 24, fontWeight: 'bold' },
    addButton: { backgroundColor: '#FF3B30', padding: 10, borderRadius: 8 },
    addButtonText: { color: '#fff', fontWeight: 'bold' },
    list: { padding: 15 },
    card: {
        backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 10,
        shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3
    },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    title: { fontSize: 16, fontWeight: 'bold', marginBottom: 2 },
    category: { fontSize: 12, color: '#999' },
    amount: { fontSize: 18, fontWeight: 'bold', color: '#FF3B30' },
    emptyText: { textAlign: 'center', marginTop: 30, color: '#999' }
});

export default ExpensesListScreen;
