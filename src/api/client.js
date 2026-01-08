import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '../constants/api';

const client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// REQUEST INTERCEPTOR
client.interceptors.request.use(
    async (config) => {
        try {
            const token = await SecureStore.getItemAsync('userToken');
            console.log(`[API] Request to ${config.url}`);
            if (token) {
                console.log(`[API] Attaching Token: ${token.substring(0, 10)}...`);
                config.headers.Authorization = `Bearer ${token}`;
            } else {
                console.log('[API] No Token found in SecureStore');
            }
        } catch (e) {
            console.error('[API] Error reading token:', e);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

let unauthorizedCallback = null;

export const setUnauthorizedCallback = (callback) => {
    unauthorizedCallback = callback;
};

// RESPONSE INTERCEPTOR
client.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response) {
            console.log(`[API] Error ${error.response.status} from ${error.config.url}`);
            console.log('[API] Server Response:', JSON.stringify(error.response.data));

            if (error.response.status === 401) {
                if (unauthorizedCallback) {
                    unauthorizedCallback();
                }
            }
        } else {
            console.log('[API] Network Error or No Response:', error.message);
        }
        return Promise.reject(error);
    }
);

export default client;
