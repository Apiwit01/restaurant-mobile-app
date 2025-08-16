import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext'; // 1. Import useAuth เพื่อเรียกใช้ context

const LoginScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth(); // 2. ดึงฟังก์ชัน login จาก context มาใช้งาน
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            // 3. เรียกใช้ฟังก์ชัน login จาก context จริงๆ
            await login(username, password);
            // การเปลี่ยนหน้าจะถูกจัดการโดย AuthContext โดยอัตโนมัติ
        } catch (error) {
            Alert.alert("Login Failed", "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Login</Text>
                <Text style={styles.label}>Username</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your username"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />
                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                {isLoading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <Button title="Login" onPress={handleLogin} />
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    content: { flex: 1, justifyContent: 'center', padding: 20 },
    title: { fontSize: 32, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
    label: { fontSize: 16, marginBottom: 8, color: '#333' },
    input: { backgroundColor: 'white', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 5, borderWidth: 1, borderColor: '#ddd', marginBottom: 20, fontSize: 16 },
});

export default LoginScreen;