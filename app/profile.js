import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../apiConfig';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            const fetchStats = async () => {
                try {
                    const response = await axios.get(`${API_BASE_URL}/api/users/stats/${user.id}`);
                    setStats(response.data);
                } catch (error) {
                    console.error("Failed to fetch user stats", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchStats();
        }
    }, [user]);

    if (loading || !user) {
        return <View style={styles.container}><ActivityIndicator size="large" /></View>;
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.profileHeader}>
                <Ionicons name="person-circle-outline" size={80} color="gray" />
                <Text style={styles.username}>{user.username}</Text>
                <Text style={styles.role}>{user.role}</Text>
            </View>

            <View style={styles.statsContainer}>
                <StatBox label="เมนูที่ทำวันนี้" value={stats?.cooked_today} />
                <StatBox label="เมนูในสัปดาห์นี้" value={stats?.cooked_this_week} />
            </View>

            <View style={styles.favoriteContainer}>
                <Text style={styles.favoriteTitle}>เมนูที่ทำบ่อยที่สุด</Text>
                <Text style={styles.favoriteMenu}>{stats?.favorite_menu}</Text>
            </View>
        </SafeAreaView>
    );
};

const StatBox = ({ label, value }) => (
    <View style={styles.statBox}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    profileHeader: { alignItems: 'center', padding: 30 },
    username: { fontSize: 24, fontWeight: 'bold', marginTop: 10 },
    role: { fontSize: 16, color: 'gray', textTransform: 'capitalize' },
    statsContainer: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 20 },
    statBox: { backgroundColor: 'white', padding: 20, borderRadius: 8, alignItems: 'center', width: '45%', elevation: 2 },
    statValue: { fontSize: 28, fontWeight: 'bold' },
    statLabel: { fontSize: 14, color: 'gray', marginTop: 5 },
    favoriteContainer: { backgroundColor: 'white', margin: 20, padding: 20, borderRadius: 8, alignItems: 'center', elevation: 2 },
    favoriteTitle: { fontSize: 16, color: 'gray' },
    favoriteMenu: { fontSize: 22, fontWeight: 'bold', marginTop: 10 },
});

export default ProfileScreen;