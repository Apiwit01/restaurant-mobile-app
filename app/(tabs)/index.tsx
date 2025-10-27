// File: app/(tabs)/index.tsx

import React, { useState, useEffect, useMemo } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    Image,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    TextInput,
    Alert,
    ImageBackground,
    StatusBar,
    Platform
} from 'react-native';
import axiosInstance from '../../apiConfig';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';

const backgroundImage = require('../../assets/images/Food_background.png');

// Component สำหรับแสดงสถานะวัตถุดิบ
const StatusBadge = ({ status }: { status?: string }) => {
    if (!status) return null;
    const badgeStyle = status === 'ปกติ' ? styles.badgeNormal : styles.badgeWarning;
    const textStyle = status === 'ปกติ' ? styles.badgeTextNormal : styles.badgeTextWarning;
    return (
        <View style={[styles.badgeContainer, badgeStyle]}>
            <Text style={textStyle}>{status}</Text>
        </View>
    );
};

// Component สำหรับแสดงรายการเมนูแต่ละอย่าง
const MenuItem = ({ menu, onStartCooking }: { menu: any, onStartCooking: (menu: any) => void }) => {
    const imageUrl = menu.image_url
        ? `${axiosInstance.defaults.baseURL}/${menu.image_url.replace(/\\/g, '/')}`
        : 'https://placehold.co/200x200?text=No+Image';

    return (
        <View style={styles.itemContainer}>
            <Image source={{ uri: imageUrl }} style={styles.image} />
            <View style={styles.infoContainer}>
                <View>
                    <View style={styles.titleGroup}>
                        <Text style={styles.menuName} numberOfLines={2}>{menu.name}</Text>
                        <StatusBadge status={menu.status} />
                    </View>
                    
                    {/* --- 1. แก้ไข Error 'Text strings...' ตรงนี้ --- */}
                    <Text style={styles.menuPrice}>{`${Number(menu.price).toLocaleString()} ฿`}</Text>
                
                </View>
                <TouchableOpacity style={styles.cookButton} onPress={() => onStartCooking(menu)}>
                    <Text style={styles.cookButtonText}>เริ่มทำอาหาร</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

// Screen หลักของหน้า Home/Index
const HomeScreen = () => {
    // --- Logic ทั้งหมด (useState, useEffect, functions) (ไม่เปลี่ยนแปลง) ---
    const [menus, setMenus] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user, logout } = useAuth();
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);


    const fetchMenus = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/api/menus');
            setMenus(response.data);
        } catch (err) {
            setError('ไม่สามารถดึงข้อมูลเมนูได้');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchMenus() }, []);

    const filteredMenus = useMemo(() => {
        if (!searchQuery) return menus;
        return menus.filter(menu =>
            menu.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, menus]);

    const handleStartCooking = (menu: any) => {
        // ... (โค้ดฟังก์ชันนี้เหมือนเดิมทุกประการ) ...
        if (!user) {
            return Alert.alert("เกิดข้อผิดพลาด", "ไม่พบข้อมูลผู้ใช้");
        }
        Alert.alert(
            'ยืนยันการทำอาหาร',
            `คุณต้องการทำเมนู "${menu.name}" จำนวน 1 จานหรือไม่? (ระบบจะตัดสต็อกทันที)`,
            [
                { text: 'ยกเลิก', style: 'cancel' },
                {
                    text: 'ยืนยัน',
                    onPress: async () => {
                        try {
                            const response = await axiosInstance.post('/api/cook', {
                                menu_id: menu.menu_id,
                                quantity: 1,
                            });
                            Alert.alert('สำเร็จ', response.data.message || "บันทึกและตัดสต็อกเรียบ ร้อย");
                            fetchMenus();
                        } catch (err: any) {
                            const errorMessage = err.response?.data?.message || "เกิดข้อผิดพลาด";
                            Alert.alert('เกิดข้อผิดพลาด', errorMessage);
                        }
                    }
                },
            ]
        );
    };

    // --- ส่วนแสดงผล Loading (เหมือนเดิม) ---
    if (loading) {
        return (
            <ImageBackground source={backgroundImage} style={styles.background}>
                <View style={[styles.centered, styles.overlay]}>
                    <ActivityIndicator size="large" color="#ffffff" />
                </View>
            </ImageBackground>
        );
    }
    // --- ส่วนแสดงผล Error (เหมือนเดิม) ---
    if (error) {
        return (
            <ImageBackground source={backgroundImage} style={styles.background}>
                <View style={[styles.centered, styles.overlay]}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            </ImageBackground>
        );
    }

    return (
        <ImageBackground source={backgroundImage} style={styles.background}>
            <StatusBar barStyle="light-content" />
            <View style={styles.overlay}>
                {/* Custom Header (เหมือนเดิม) */}
                <SafeAreaView style={styles.headerSafeArea}>
                    <View style={styles.headerContainer}>
                        <Ionicons name="person-circle-outline" size={28} color="white" />
                        <Text style={styles.headerTitle}>เลือกเมนูอาหาร</Text>
                        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
                            <Ionicons name="log-out-outline" size={28} color="white" />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
                
                {/* (ช่องค้นหา) */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="ค้นหาเมนู..."
                        placeholderTextColor="#888"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* --- 2. แก้ไข Layout ตรงนี้ --- */}
                {/* ให้ FlatList ใช้ flex: 1 เพื่อกินพื้นที่ที่เหลือ */}
                <FlatList
                    style={{ flex: 1 }} // เพิ่ม style นี้เพื่อให้ FlatList แสดงผล
                    data={filteredMenus}
                    keyExtractor={(item) => item.menu_id.toString()}
                    renderItem={({ item }) => (
                        <MenuItem
                            menu={item}
                            onStartCooking={handleStartCooking}
                        />
                    )}
                    onRefresh={fetchMenus}
                    refreshing={loading}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
                />

            </View>
        </ImageBackground>
    );
};

// (StyleSheet ทั้งหมดเหมือนเดิม ไม่ต้องเปลี่ยน)
const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)', 
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent'
    },
    errorText: {
        color: 'white',
        fontSize: 16,
        padding: 20,
        textAlign: 'center'
    },
    headerSafeArea: {
        backgroundColor: 'transparent',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, 
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: 'transparent',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    logoutButton: {
        padding: 5,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 12,
        marginHorizontal: 16,
        marginTop: 10,
        marginBottom: 10,
        paddingHorizontal: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4
    },
    searchIcon: { marginRight: 8 },
    searchInput: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 16,
        color: '#333',
    },
    itemContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 12,
        marginVertical: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        overflow: 'hidden'
    },
    image: { width: 100, height: 100, aspectRatio: 1 },
    infoContainer: { flex: 1, padding: 14, justifyContent: 'space-between' },
    titleGroup: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    menuName: { fontSize: 18, fontWeight: 'bold', color: '#212529', flexShrink: 1, marginRight: 8 },
    menuPrice: { fontSize: 16, color: '#495057', marginTop: 4 },
    cookButton: { backgroundColor: '#007bff', borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginTop: 12 },
    cookButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
    badgeContainer: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 },
    badgeNormal: { backgroundColor: '#e7f5ff' },
    badgeWarning: { backgroundColor: '#fff9e6' },
    badgeTextNormal: { color: '#1c7ed6', fontSize: 12, fontWeight: '500' },
    badgeTextWarning: { color: '#f79f1b', fontSize: 12, fontWeight: '500' },
});

export default HomeScreen;