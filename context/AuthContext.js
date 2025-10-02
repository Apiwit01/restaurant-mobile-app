// File: context/AuthContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../apiConfig.js'; 
import { useRouter } from 'expo-router';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // **สำคัญ**: แก้ไข isLoading เป็น false เพื่อปิดฟังก์ชัน login อัตโนมัติชั่วคราว
  const [isLoading, setIsLoading] = useState(false); 
  const router = useRouter();

  // **สำคัญ**: เราจะปิดส่วนนี้ไว้ชั่วคราวก่อน เพื่อให้แอปทำงานได้โดยไม่ต้องเรียก Backend ที่ยังไม่พร้อม
  /*
  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          const response = await axiosInstance.get('/api/users/me'); 
          setUser(response.data);
        }
      } catch (e) {
        console.error("Failed to load user from storage", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadUserFromStorage();
  }, []);
  */

  const login = async (username, password) => {
    try {
      const response = await axiosInstance.post('/api/users/login', {
        username,
        password,
      });
      const { user, token } = response.data;
      await AsyncStorage.setItem('userToken', token);
      setUser(user);
      router.replace('/(tabs)/'); // แก้ไขให้ไปที่หน้าหลักของ Tabs
    } catch (error) {
      console.error("Login failed", error);
      throw error; 
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('userToken');
    setUser(null);
    router.replace('/login');
  };

  const value = { user, login, logout, isLoading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};