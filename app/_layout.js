import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { TouchableOpacity, ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';

const CustomHeaderRight = () => {
    const { logout } = useAuth();
    const router = useRouter();
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => router.push('/profile')} style={{ marginRight: 20 }}>
                <Ionicons name="person-circle-outline" size={28} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={logout} style={{ marginRight: 15 }}>
                <Ionicons name="log-out-outline" size={28} color="black" />
            </TouchableOpacity>
        </View>
    );
}

function RootLayoutNav() {
    const { user, isLoading } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    // useEffect นี้จะทำหน้าที่เป็น "ยาม" ตลอดเวลา
    useEffect(() => {
        if (isLoading) return; // ถ้ายังโหลดข้อมูลจาก storage ไม่เสร็จ ก็ไม่ต้องทำอะไร

        const inLoginPage = segments[0] === 'login';

        if (!user && !inLoginPage) {
            // ถ้ายังไม่ login และไม่ได้พยายามจะไปหน้า login ให้ส่งไปหน้า login
            router.replace('/login');
        } else if (user && inLoginPage) {
            // ถ้า login แล้ว (user มีข้อมูล) แต่ยังอยู่ที่หน้า login ให้ส่งไปหน้า home
            router.replace('/home');
        }
    }, [user, isLoading]); // ให้ Effect นี้ทำงานใหม่ทุกครั้งที่ user หรือ isLoading เปลี่ยน

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <Stack>
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen 
                name="home" 
                options={{ 
                    title: 'เลือกเมนูอาหาร',
                    headerRight: () => <CustomHeaderRight />,
                    headerLeft: () => null, 
                }} 
            />
            <Stack.Screen 
                name="profile" 
                options={{ 
                    title: 'โปรไฟล์ของฉัน',
                    presentation: 'modal',
                }} 
            />
        </Stack>
    );
}

export default function RootLayout() {
    return (
        <AuthProvider>
            <RootLayoutNav />
        </AuthProvider>
    );
}