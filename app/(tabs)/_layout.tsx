// File: app/(tabs)/_layout.tsx

import { Tabs, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext'; 

export default function TabLayout() {
  const { logout } = useAuth();
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'blue',
        headerShown: false, 
      }}>
      <Tabs.Screen
        name="index" // นี่คือหน้า Home
        options={{
          title: 'เลือกเมนูอาหาร',
          headerShown: true, 
          headerTitleAlign: 'left',
          headerTitleStyle: {
            fontSize: 22,
            fontWeight: 'bold',
          },
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
          headerRight: () => (
            <TouchableOpacity onPress={logout} style={{ marginRight: 15 }}>
              <Ionicons name="log-out-outline" size={28} color="black" />
            </TouchableOpacity>
          ),
          headerLeft: () => (
             <TouchableOpacity onPress={() => router.push('/profile')} style={{ marginLeft: 15 }}>
              <Ionicons name="person-circle-outline" size={28} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      
      {/* แท็บ Explore ถูกลบออกไปจากตรงนี้แล้ว */}

      <Tabs.Screen
        name="profile" // นี่คือหน้า Profile
        options={{
          title: 'โปรไฟล์',
          headerShown: true,
          tabBarIcon: ({ color }) => <Ionicons name="person-circle" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}