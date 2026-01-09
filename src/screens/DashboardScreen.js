import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, Alert, ScrollView, RefreshControl } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import client from '../api/client';
import { ENDPOINTS } from '../constants/api';

const DashboardScreen = () => {
    const { userInfo, logout, userToken } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async () => {
        try {
            // NOTE: Using DASHBOARD endpoint which requires Auth
            const response = await client.get(ENDPOINTS.DASHBOARD);
            setData(response.data);
        } catch (error) {
            console.log("Dashboard fetch error:", error);
            // Alert.alert("Error", "Could not fetch dashboard data");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [userToken]);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchData();
    }, []);

    if (loading && !refreshing) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.welcome}>Hello, {userInfo?.name}</Text>
                <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <Text style={styles.sectionTitle}>Financial Overview</Text>

                <View style={styles.card}>
                    <Text style={styles.cardLabel}>Total Invoiced</Text>
                    <Text style={styles.cardValue}>
                        ${data?.metrics?.totalInvoiced?.toFixed(2) || '0.00'}
                    </Text>
                </View>

                <View style={styles.row}>
                    <View style={[styles.card, { flex: 1, marginRight: 10 }]}>
                        <Text style={styles.cardLabel}>Collected</Text>
                        <Text style={[styles.cardValue, { color: 'green' }]}>
                            ${data?.metrics?.totalCollected?.toFixed(2) || '0.00'}
                        </Text>
                    </View>
                    <View style={[styles.card, { flex: 1 }]}>
                        <Text style={styles.cardLabel}>Pending</Text>
                        <Text style={[styles.cardValue, { color: 'orange' }]}>
                            ${data?.metrics?.totalPending?.toFixed(2) || '0.00'}
                        </Text>
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardLabel}>Net Profit</Text>
                    <Text style={[styles.cardValue, { color: '#007AFF' }]}>
                        ${data?.metrics?.netProfit?.toFixed(2) || '0.00'}
                    </Text>
                </View>

                {/* Placeholder for Recent Activity */}
                <Text style={styles.sectionTitle}>Recent Activity</Text>
                {data?.recentActivity?.length > 0 ? (
                    data.recentActivity.map((invoice) => (
                        <View key={invoice.id} style={styles.activityItem}>
                            <Text style={styles.activityTitle}>Invoice #{invoice.number}</Text>
                            <Text style={styles.activitySub}>{invoice.client?.name}</Text>
                            <Text style={styles.activityAmount}>${invoice.total.toFixed(2)}</Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.noData}>No recent activity</Text>
                )}

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        padding: 20,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    welcome: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    logoutBtn: {
        padding: 10,
    },
    logoutText: {
        color: 'red',
        fontWeight: '600',
    },
    content: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        marginTop: 10,
        color: '#333',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cardLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    cardValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    activityItem: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    activityTitle: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    activitySub: {
        color: '#666',
        fontSize: 14,
        position: 'absolute',
        left: 15,
        bottom: 5, // simple layout
        opacity: 0
    },
    activityAmount: {
        fontWeight: 'bold',
        color: '#333',
    },
    noData: {
        textAlign: 'center',
        color: '#999',
        marginTop: 20,
    }
});

export default DashboardScreen;
