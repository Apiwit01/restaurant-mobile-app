import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity, TextInput } from 'react-native';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../apiConfig';

const HomeScreen = () => {
    const [allMenus, setAllMenus] = useState([]);
    const [filteredMenus, setFilteredMenus] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchMenus = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/menus`);
            setAllMenus(response.data);
            setFilteredMenus(response.data);
        } catch (error) {
            console.error("Failed to fetch menus", error);
            Alert.alert("Error", "Could not fetch menus.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMenus();
    }, []);

    useEffect(() => {
        if (searchTerm === '') {
            setFilteredMenus(allMenus);
        } else {
            const filtered = allMenus.filter(menu =>
                menu.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredMenus(filtered);
        }
    }, [searchTerm, allMenus]);

    const handleCook = async (menuId) => {
        if (!user) return Alert.alert("Error", "No user is logged in.");
        try {
            await axios.post(`${API_BASE_URL}/api/cook`, {
                menu_id: menuId,
                quantity: 1,
                user_id: user.id
            });
            Alert.alert("Success", "บันทึกการทำอาหารและตัดสต็อกเรียบร้อยแล้ว");
        } catch (error) {
            Alert.alert("Error", error.response?.data?.message || "ไม่สามารถบันทึกการทำอาหารได้");
        }
    };

    if (loading) {
        return <View style={styles.container}><Text>Loading menus...</Text></View>;
    }

    const renderMenuItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.menuHeader}>
                <Text style={styles.menuName}>{item.name}</Text>
                <View style={[styles.badge, item.stock_status === 'ใกล้หมด' ? styles.badgeLow : styles.badgeOk]}>
                    <Text style={styles.badgeText}>{item.stock_status}</Text>
                </View>
            </View>
            <Text style={styles.menuPrice}>{Number(item.price).toLocaleString()} ฿</Text>
            <TouchableOpacity style={styles.cookButton} onPress={() => handleCook(item.menu_id)}>
                <Text style={styles.cookButtonText}>เริ่มทำอาหาร</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={{flex: 1}}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="ค้นหาเมนู..."
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                />
            </View>
            <FlatList
                data={filteredMenus}
                renderItem={renderMenuItem}
                keyExtractor={(item) => item.menu_id.toString()}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
    listContainer: { paddingHorizontal: 10, paddingBottom: 10 },
    searchContainer: { padding: 10, backgroundColor: 'white' },
    searchInput: { backgroundColor: '#f0f0f0', padding: 10, borderRadius: 8, fontSize: 16 },
    card: { backgroundColor: 'white', borderRadius: 8, padding: 20, marginTop: 10, elevation: 2 },
    menuHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    menuName: { fontSize: 18, fontWeight: 'bold', flex: 1, marginRight: 8 },
    menuPrice: { fontSize: 16, color: 'gray', marginVertical: 8 },
    badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    badgeOk: { backgroundColor: '#d4edda' },
    badgeLow: { backgroundColor: '#fff3cd' },
    badgeText: { fontSize: 12, fontWeight: '600' },
    cookButton: { backgroundColor: '#228be6', padding: 12, borderRadius: 5, alignItems: 'center', marginTop: 8 },
    cookButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});

export default HomeScreen;