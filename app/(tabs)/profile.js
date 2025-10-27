// File: app/(tabs)/profile.js

import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    ImageBackground, // 1. Import ImageBackground
    StatusBar,         // 2. Import StatusBar
    Platform           // 3. Import Platform
} from 'react-native';
import { useAuth } from '@/context/AuthContext';
import axiosInstance from '@/apiConfig';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.locale('th');
dayjs.extend(relativeTime);

// 4. ระบุ Path ของรูปภาพ (ต้องถอย 2 ชั้น)
const backgroundImage = require('../../assets/images/Food_background.png');

// --- Component HistoryItem (ไม่เปลี่ยนแปลง) ---
const HistoryItem = ({ item }) => (
    <View style={styles.itemContainer}>
        <View style={styles.itemTextContainer}>
            <Text style={styles.menuName}>{item.menu_name}</Text>
            <Text style={styles.quantity}>จำนวน: {item.quantity} จาน</Text>
        </View>
        <Text style={styles.dateText}>{dayjs(item.cooked_at).fromNow()}</Text>
    </View>
);

const ProfileScreen = () => {
    // --- Logic ทั้งหมด (ไม่เปลี่ยนแปลง) ---
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUserHistory = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axiosInstance.get('/api/history/me');
            setHistory(response.data);
        } catch (err) {
            setError('ไม่สามารถดึงข้อมูลประวัติได้');
            console.error("Failed to fetch user history:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserHistory();
    }, []);
    // --- จบ Logic ---

    // --- 5. แก้ไข Loading / Error ให้มีพื้นหลัง ---
    if (loading) {
        return (
            <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
                <View style={[styles.centered, styles.overlay]}>
                    <ActivityIndicator size="large" color="#ffffff" />
                </View>
            </ImageBackground>
        );
    }

    if (error) {
        return (
            <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
                <View style={[styles.centered, styles.overlay]}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            </ImageBackground>
        );
    }

    // --- 6. แก้ไข JSX หลัก ---
    return (
        <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
            <StatusBar barStyle="light-content" />
            <View style={styles.overlay}>
                <SafeAreaView style={styles.container}>
                    {/* (Header และ FlatList เหมือนเดิม แต่ Style ถูกแก้ด้านล่าง) */}
                    <View style={styles.header}>
                        <Text style={styles.username}>{user?.username}'s Activity</Text>
                        <Text style={styles.subHeader}>ประวัติการทำอาหารล่าสุด</Text>
                    </View>
                    
                    <FlatList
                        data={history}
                        keyExtractor={(item) => item.log_id.toString()}
                        renderItem={({ item }) => <HistoryItem item={item} />}
                        onRefresh={fetchUserHistory}
                        refreshing={loading}
                        ListEmptyComponent={
                            <View style={styles.centeredEmpty}>
                                <Text style={styles.emptyText}>ยังไม่มีประวัติการทำอาหาร</Text>
                            </View>
                        }
                        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }} // (เพิ่ม paddingBottom)
                    />
                </SafeAreaView>
            </View>
        </ImageBackground>
    );
};

// --- 7. แก้ไข StyleSheet ---
const styles = StyleSheet.create({
    background: { // (เพิ่ม)
        flex: 1,
        backgroundColor: '#000',
    },
    overlay: { // (เพิ่ม)
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Overlay 60%
    },
    container: {
        flex: 1,
        backgroundColor: 'transparent', // (แก้)
    },
    centered: { // (แก้)
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent', // (แก้)
    },
    centeredEmpty: { // (แก้)
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
        backgroundColor: 'transparent', // (แก้)
    },
    header: {
        paddingTop: Platform.OS === 'android' ? 16 : 16, // (แก้)
        paddingHorizontal: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#555', // (แก้)
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white', // (แก้)
    },
    subHeader: {
        fontSize: 16,
        color: '#ccc', // (แก้)
        marginTop: 4,
    },
    itemContainer: { // (การ์ดสีขาว เหมือนเดิม)
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        marginVertical: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    itemTextContainer: {
        flex: 1,
    },
    menuName: {
        fontSize: 16,
        fontWeight: '600',
    },
    quantity: {
        fontSize: 14,
        color: '#495057',
        marginTop: 2,
    },
    dateText: {
        fontSize: 12,
        color: '#6c757d',
    },
    errorText: {
        color: 'white', // (แก้)
    },
    emptyText: {
        fontSize: 16,
        color: '#ccc', // (แก้)
    }
});

export default ProfileScreen;