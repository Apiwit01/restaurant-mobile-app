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
} from 'react-native';
import axiosInstance from '../../apiConfig';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

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
          <Text style={styles.menuPrice}>{Number(menu.price).toLocaleString()} ฿</Text>
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
  const [menus, setMenus] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

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
                // ไม่ต้องส่ง user_id เพราะ Backend จะดึงจาก Token เอง
              });
              Alert.alert('สำเร็จ', response.data.message || "บันทึกและตัดสต็อกเรียบร้อย");
              fetchMenus(); // รีเฟรชข้อมูลเมนูเพื่ออัปเดตสถานะสต็อก
            } catch (err: any) {
              const errorMessage = err.response?.data?.message || "เกิดข้อผิดพลาด";
              Alert.alert('เกิดข้อผิดพลาด', errorMessage);
            }
          }
        },
      ]
    );
  };

  if (loading) { return <View style={styles.centered}><ActivityIndicator size="large" color="#007bff" /></View>; }
  if (error) { return <View style={styles.centered}><Text style={styles.errorText}>{error}</Text></View>; }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput style={styles.searchInput} placeholder="ค้นหาเมนู..." value={searchQuery} onChangeText={setSearchQuery} />
      </View>
      <FlatList
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' },
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 12, margin: 16, paddingHorizontal: 16, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
    searchIcon: { marginRight: 8 },
    searchInput: { flex: 1, paddingVertical: 14, fontSize: 16, color: '#333' },
    itemContainer: { flexDirection: 'row', backgroundColor: 'white', borderRadius: 12, marginVertical: 8, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, overflow: 'hidden' },
    image: { width: 100, height: 100, aspectRatio: 1 },
    infoContainer: { flex: 1, padding: 14, justifyContent: 'space-between' },
    titleGroup: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    menuName: { fontSize: 18, fontWeight: 'bold', color: '#212529', flexShrink: 1, marginRight: 8 },
    menuPrice: { fontSize: 16, color: '#495057', marginTop: 4 },
    cookButton: { backgroundColor: '#007bff', borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginTop: 12 },
    cookButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
    errorText: { color: 'red', fontSize: 16, padding: 20, textAlign: 'center' },
    badgeContainer: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 },
    badgeNormal: { backgroundColor: '#e7f5ff' },
    badgeWarning: { backgroundColor: '#fff9e6' },
    badgeTextNormal: { color: '#1c7ed6', fontSize: 12, fontWeight: '500' },
    badgeTextWarning: { color: '#f79f1b', fontSize: 12, fontWeight: '500' },
});

export default HomeScreen;