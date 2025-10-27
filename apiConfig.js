// File: apiConfig.js

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// ใส่ IP Address ของคุณที่นี่
const API_BASE_URL = 'http://10.172.111.46:3000';

// สร้าง axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// *** นี่คือส่วนที่สำคัญที่สุด ***
// Interceptor จะทำงานก่อนที่ทุก request จะถูกส่งออกไป
axiosInstance.interceptors.request.use(
  async (config) => {
    // ดึง token ที่เก็บไว้ตอน login ออกมาจาก AsyncStorage
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      // ถ้ามี token, ให้เพิ่มเข้าไปใน Header ของ request
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;