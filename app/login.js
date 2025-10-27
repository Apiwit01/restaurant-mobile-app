import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Alert,
    ActivityIndicator,
    ImageBackground,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    Image, // 1. Import Image
} from 'react-native';
import { useAuth } from '../context/AuthContext';

// 2. ระบุ Path ของรูปภาพ (พื้นหลังและโลโก้)
const backgroundImage = require('../assets/images/Food_background.png');
// --- 3. แก้ไขชื่อไฟล์โลโก้ตรงนี้ ---
const logoImage = require('../assets/images/Icon-Login.png'); 

const LoginScreen = () => {
    // --- ฟังก์ชันการทำงานเดิมทั้งหมด (ไม่เปลี่ยนแปลง) ---
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('admin123');
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            await login(username, password);
        } catch (error) {
            Alert.alert("Login Failed", "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
        } finally {
            setIsLoading(false);
        }
    };
    // --- จบฟังก์ชันการทำงานเดิม ---

    return (
        <ImageBackground source={backgroundImage} style={styles.background}>
            <StatusBar barStyle="light-content" />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoidingContainer}
            >
                <View style={styles.overlay}>

                    {/* 4. เพิ่มโลโก้เข้ามา */}
                    <Image source={logoImage} style={styles.logo} />

                    
                    <Text style={styles.label}>Username</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your username"
                        placeholderTextColor="#999"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                    />

                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your password"
                        placeholderTextColor="#999"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    {isLoading ? (
                        <ActivityIndicator size="large" color="#ffffff" style={styles.loader} />
                    ) : (
                        <TouchableOpacity style={styles.buttonContainer} onPress={handleLogin}>
                            <Text style={styles.buttonText}>Login</Text>
                        </TouchableOpacity>
                    )}

                </View>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
};

// 5. แก้ไข StyleSheet (เพิ่ม styles.logo)
const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    keyboardAvoidingContainer: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    logo: {
        width: 150, // กำหนดขนาดโลโก้ตามความเหมาะสม
        height: 150,
        resizeMode: 'contain', 
        alignSelf: 'center', 
        marginBottom: 10, 
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
        color: '#ffffff',
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: '#ffffff',
    },
    input: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        paddingHorizontal: 15,
        paddingVertical: Platform.OS === 'ios' ? 15 : 12,
        borderRadius: 10,
        borderWidth: 0,
        marginBottom: 20,
        fontSize: 16,
        color: '#333',
    },
    buttonContainer: {
        backgroundColor: '#ffffff',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#000000',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loader: {
        marginTop: 10,
    }
});

export default LoginScreen;