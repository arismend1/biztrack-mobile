import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '../constants/api';

const client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

client.interceptors.request.use(
    async (config) => {
        const token = await SecureStore.getItemAsync('userToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

let unauthorizedCallback = null;

export const setUnauthorizedCallback = (callback) => {
    unauthorizedCallback = callback;
};

client.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            if (unauthorizedCallback) {
                unauthorizedCallback();
            }
        }
        return Promise.reject(error);
    }
);

export default client;
