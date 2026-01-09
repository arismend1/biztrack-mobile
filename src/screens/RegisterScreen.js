import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, SafeAreaView, ScrollView } from 'react-native';
import { AuthContext } from '../context/AuthContext';

const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { register, isLoading } = useContext(AuthContext);

    const handleRegister = async () => {
        if (!name || !email || !password || !companyName) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        try {
            await register(name, email, password, companyName);
        } catch (e) {
            Alert.alert('Registration Failed', e.response?.data?.error || 'Something went wrong');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollWrapper}>
                <View style={styles.wrapper}>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Start tracking your business</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Full Name"
                        value={name}
                        onChangeText={text => setName(text)}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Company Name"
                        value={companyName}
                        onChangeText={text => setCompanyName(text)}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={text => setEmail(text)}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        value={password}
                        onChangeText={text => setPassword(text)}
                        secureTextEntry
                    />

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleRegister}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Sign Up</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.row}>
                        <Text>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.link}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollWrapper: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingVertical: 20,
    },
    wrapper: {
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
        textAlign: 'center',
    },
    input: {
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#007AFF',
        borderRadius: 8,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'center',
    },
    link: {
        color: '#007AFF',
        fontWeight: 'bold',
    },
});

export default RegisterScreen;
