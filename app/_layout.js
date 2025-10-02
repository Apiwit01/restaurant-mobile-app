import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ActivityIndicator, View } from 'react-native';
import { useEffect } from 'react';

function AuthGuard() {
    const { user, isLoading } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;
        const inTabsGroup = segments[0] === '(tabs)';
        if (user && !inTabsGroup) {
            router.replace('/(tabs)/');
        } else if (!user && inTabsGroup) {
            router.replace('/login');
        }
    }, [user, isLoading, segments]);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    // --- แก้ไข: ลบ Stack.Screen ของ profile ออกไปจากตรงนี้ ---
    // เพราะตอนนี้ profile ถูกจัดการโดย (tabs)/_layout.tsx แล้ว
    return (
        <Stack>
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            {/* เรายังสามารถเรียก /profile ที่เป็น Modal ได้ เพราะ Expo Router ฉลาดพอที่จะหามันเจอ */}
        </Stack>
    );
}

export default function RootLayout() {
    return (
        <AuthProvider>
            <AuthGuard />
        </AuthProvider>
    );
}