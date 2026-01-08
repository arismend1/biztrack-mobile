import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import client from '../api/client';
import { ENDPOINTS } from '../constants/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [userToken, setUserToken] = useState(null);
    const [userInfo, setUserInfo] = useState(null);

    const login = async (email, password) => {
        setIsLoading(true);
        try {
            const response = await client.post(ENDPOINTS.LOGIN, { email, password });
            const { token, user } = response.data;

            setUserToken(token);
            setUserInfo(user);

            await SecureStore.setItemAsync('userToken', token);
            await SecureStore.setItemAsync('userInfo', JSON.stringify(user));
        } catch (error) {
            console.log('Login error', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (name, email, password, companyName) => {
        setIsLoading(true);
        try {
            const response = await client.post(ENDPOINTS.REGISTER, { name, email, password, companyName });
            const { token, user } = response.data;

            setUserToken(token);
            setUserInfo(user);

            await SecureStore.setItemAsync('userToken', token);
            await SecureStore.setItemAsync('userInfo', JSON.stringify(user));
        } catch (error) {
            console.log('Register error', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        setUserToken(null);
        setUserInfo(null);
        await SecureStore.deleteItemAsync('userToken');
        await SecureStore.deleteItemAsync('userInfo');
        setIsLoading(false);
    };

    const isLoggedIn = async () => {
        try {
            setIsLoading(true);
            let userToken = await SecureStore.getItemAsync('userToken');
            let userInfo = await SecureStore.getItemAsync('userInfo');

            if (userToken) {
                setUserToken(userToken);
                setUserInfo(JSON.parse(userInfo));
            }
            setIsLoading(false);
        } catch (error) {
            console.log('isLoggedIn error', error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        isLoggedIn();
        // Register the logout callback for 401s
        const { setUnauthorizedCallback } = require('../api/client');
        setUnauthorizedCallback(logout);
    }, []);

    return (
        <AuthContext.Provider value={{
            login,
            register,
            logout,
            isLoading,
            userToken,
            userInfo
        }}>
            {children}
        </AuthContext.Provider>
    );
};
