// File: app/(tabs)/profile.js

import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import axiosInstance from '@/apiConfig';
import dayjs from 'dayjs'; // library สำหรับจัดการวันที่และเวลา
import 'dayjs/locale/th'; // import ภาษาไทย
import relativeTime from 'dayjs/plugin/relativeTime'; // import plugin

// ตั้งค่า Day.js ให้เป็นภาษาไทยและใช้ plugin
dayjs.locale('th');
dayjs.extend(relativeTime);

// Component สำหรับแสดงรายการประวัติแต่ละอัน
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
  const { user } = useAuth(); // ดึงข้อมูล user ที่ login อยู่
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      // เรียก API ไปยัง Endpoint ใหม่สำหรับดึงประวัติส่วนตัว
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
    // ดึงข้อมูลเมื่อหน้านี้ถูกเปิด
    fetchUserHistory();
  }, []);

  if (loading) {
    return <View style={styles.centered}><ActivityIndicator size="large" /></View>;
  }

  if (error) {
    return <View style={styles.centered}><Text style={styles.errorText}>{error}</Text></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.username}>{user?.username}'s Activity</Text>
        <Text style={styles.subHeader}>ประวัติการทำอาหารล่าสุด</Text>
      </View>
      
      <FlatList
        data={history}
        keyExtractor={(item) => item.log_id.toString()}
        renderItem={({ item }) => <HistoryItem item={item} />}
        onRefresh={fetchUserHistory} // ดึงเพื่อรีเฟรช
        refreshing={loading}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>ยังไม่มีประวัติการทำอาหาร</Text>
          </View>
        }
        contentContainerStyle={{ paddingHorizontal: 16 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subHeader: {
    fontSize: 16,
    color: '#6c757d',
    marginTop: 4,
  },
  itemContainer: {
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
    color: 'red',
  },
  emptyText: {
    fontSize: 16,
    color: '#6c757d',
  }
});

export default ProfileScreen;