import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';

// Screens
import DashboardScreen from '../screens/DashboardScreen';

import ClientsListScreen from '../screens/clients/ClientsListScreen';
import ClientFormScreen from '../screens/clients/ClientFormScreen';
import ClientDetailScreen from '../screens/clients/ClientDetailScreen';

import EstimatesListScreen from '../screens/estimates/EstimatesListScreen';
import EstimateFormScreen from '../screens/estimates/EstimateFormScreen';
import EstimateDetailScreen from '../screens/estimates/EstimateDetailScreen';

import InvoicesListScreen from '../screens/invoices/InvoicesListScreen';
import InvoiceDetailScreen from '../screens/invoices/InvoiceDetailScreen';

import MoreScreen from '../screens/more/MoreScreen';
import ItemsListScreen from '../screens/items/ItemsListScreen';
import ItemFormScreen from '../screens/items/ItemFormScreen';
import CompanyScreen from '../screens/company/CompanyScreen';
import ExpensesListScreen from '../screens/expenses/ExpensesListScreen';
import ExpenseFormScreen from '../screens/expenses/ExpenseFormScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack Navigators
const DashboardStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="DashboardMain" component={DashboardScreen} />
    </Stack.Navigator>
);

const ClientsStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ClientsList" component={ClientsListScreen} />
        <Stack.Screen name="ClientForm" component={ClientFormScreen} />
        <Stack.Screen name="ClientDetail" component={ClientDetailScreen} />
    </Stack.Navigator>
);

const EstimatesStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="EstimatesList" component={EstimatesListScreen} />
        <Stack.Screen name="EstimateForm" component={EstimateFormScreen} />
        <Stack.Screen name="EstimateDetail" component={EstimateDetailScreen} />
    </Stack.Navigator>
);

const InvoicesStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="InvoicesList" component={InvoicesListScreen} />
        <Stack.Screen name="InvoiceDetail" component={InvoiceDetailScreen} />
    </Stack.Navigator>
);

const MoreStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MoreMain" component={MoreScreen} />
        <Stack.Screen name="ItemsList" component={ItemsListScreen} />
        <Stack.Screen name="ItemForm" component={ItemFormScreen} />
        <Stack.Screen name="Company" component={CompanyScreen} />
        <Stack.Screen name="ExpensesList" component={ExpensesListScreen} />
        <Stack.Screen name="ExpenseForm" component={ExpenseFormScreen} />
    </Stack.Navigator>
);

const MainTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let text = '';
                    if (route.name === 'Dashboard') text = '🏠';
                    if (route.name === 'Clients') text = '👥';
                    if (route.name === 'Estimates') text = '📄';
                    if (route.name === 'Invoices') text = '💰';
                    if (route.name === 'More') text = '⚙️';
                    return <Text style={{ fontSize: size }}>{text}</Text>;
                },
                tabBarActiveTintColor: '#007AFF',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name="Dashboard" component={DashboardStack} />
            <Tab.Screen name="Clients" component={ClientsStack} />
            <Tab.Screen name="Estimates" component={EstimatesStack} />
            <Tab.Screen name="Invoices" component={InvoicesStack} />
            <Tab.Screen name="More" component={MoreStack} />
        </Tab.Navigator>
    );
};

export default MainTabNavigator;
