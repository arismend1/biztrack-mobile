import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { AuthContext } from '../../context/AuthContext';

const MoreScreen = ({ navigation }) => {
    const { logout } = useContext(AuthContext);

    const menuItems = [
        { label: 'Items / Catalog', screen: 'ItemsList' },
        { label: 'Company Settings', screen: 'Company' },
        { label: 'Expenses', screen: 'ExpensesList' },
        // { label: 'Reports', screen: 'Reports' }, // Future
    ];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>More</Text>
            </View>
            <ScrollView contentContainerStyle={styles.menu}>
                {menuItems.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.menuItem}
                        onPress={() => navigation.navigate(item.screen)}
                    >
                        <Text style={styles.menuText}>{item.label}</Text>
                        <Text style={styles.chevron}>›</Text>
                    </TouchableOpacity>
                ))}

                <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={logout}>
                    <Text style={[styles.menuText, styles.logoutText]}>Logout</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    header: {
        padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee', justifyContent: 'center'
    },
    title: { fontSize: 24, fontWeight: 'bold' },
    menu: { padding: 20 },
    menuItem: {
        backgroundColor: '#fff', padding: 20, borderRadius: 10, marginBottom: 10,
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3
    },
    menuText: { fontSize: 16, fontWeight: '600' },
    chevron: { fontSize: 20, color: '#ccc' },
    logoutItem: { marginTop: 20, backgroundColor: '#fff0f0' },
    logoutText: { color: 'red' }
});

export default MoreScreen;
