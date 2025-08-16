import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import API_BASE_URL from '../apiConfig';

const AuthContext = createContext(null);
const TOKEN_KEY = 'my-jwt';
const USER_DATA_KEY = 'user-data';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const loadUserFromStorage = async () => {
            try {
                const token = await SecureStore.getItemAsync(TOKEN_KEY);
                const userDataString = await SecureStore.getItemAsync(USER_DATA_KEY);
                if (token && userDataString) {
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    setUser(JSON.parse(userDataString));
                }
            } catch (e) {
                console.error("Failed to load user from storage", e);
            } finally {
                setIsLoading(false);
            }
        };
        loadUserFromStorage();
    }, []);

    const login = async (username, password) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/users/login`, { username, password });
            const { token, user: userData } = response.data;

            await SecureStore.setItemAsync(TOKEN_KEY, token);
            await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(userData));
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // อัปเดต state เป็นขั้นตอนสุดท้าย
            setUser(userData);

            return response;
        } catch (e) {
            console.error("Login failed", e);
            throw e;
        }
    };

    const logout = () => {
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
        SecureStore.deleteItemAsync(TOKEN_KEY);
        SecureStore.deleteItemAsync(USER_DATA_KEY);
        router.replace('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};