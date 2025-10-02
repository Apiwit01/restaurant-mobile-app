// // File: app/(tabs)/home.js

// import React, { useEffect, useState } from 'react';
// import {
//     ActivityIndicator,
//     Alert,
//     FlatList,
//     Image,w
//     SafeAreaView,
//     StyleSheet,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     View,
// } from 'react-native';
// import axiosInstance from '@/apiConfig.js'; // Import axios instance ที่ตั้งค่าไว้แล้ว

// // สร้าง Component สำหรับแสดงรายการอาหารแต่ละอย่าง (มีรูปภาพ)
// const MenuItem = ({ menu, onStartCooking }) => {
//   const imageUrl = menu.image_url
//     ? `${axiosInstance.defaults.baseURL}/${menu.image_url.replace(/\\/g, '/')}`
//     : 'https://placehold.co/150x150?text=No+Image';

//   return (
//     <View style={styles.itemContainer}>
//       {/* ส่วนของรูปภาพ */}
//       <Image source={{ uri: imageUrl }} style={styles.image} />
      
//       {/* ส่วนของข้อมูล */}
//       <View style={styles.infoContainer}>
//         <View>
//           <Text style={styles.menuName}>{menu.name}</Text>
//           <Text style={styles.menuPrice}>{Number(menu.price).toLocaleString()} ฿</Text>
//         </View>
//         <TouchableOpacity style={styles.cookButton} onPress={() => onStartCooking(menu)}>
//           <Text style={styles.cookButtonText}>เริ่มทำอาหาร</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// // Screen หลักของหน้า Home
// const HomeScreen = () => {
//   const [menus, setMenus] = useState([]);
//   const [filteredMenus, setFilteredMenus] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');

//   const fetchMenus = async () => {
//     try {
//       setLoading(true);
//       const response = await axiosInstance.get('/api/menus');
//       setMenus(response.data);
//       setFilteredMenus(response.data); // ตอนแรกให้ข้อมูลที่กรองแล้วเหมือนกับข้อมูลทั้งหมด
//     } catch (err) {
//       setError('ไม่สามารถดึงข้อมูลเมนูได้');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMenus();
//   }, []);

//   // ฟังก์ชันสำหรับค้นหาเมนู
//   useEffect(() => {
//     if (searchQuery === '') {
//       setFilteredMenus(menus);
//     } else {
//       const lowercasedQuery = searchQuery.toLowerCase();
//       const filtered = menus.filter(menu =>
//         menu.name.toLowerCase().includes(lowercasedQuery)
//       );
//       setFilteredMenus(filtered);
//     }
//   }, [searchQuery, menus]);


//   const handleStartCooking = (menu) => {
//     // ใส่ Logic การเริ่มทำอาหารที่นี่
//     Alert.alert('เริ่มทำอาหาร', `กำลังเตรียมเมนู: ${menu.name}`);
//   };

//   if (loading) {
//     return <View style={styles.centered}><ActivityIndicator size="large" /></View>;
//   }

//   if (error) {
//     return <View style={styles.centered}><Text style={styles.errorText}>{error}</Text></View>;
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.headerContainer}>
//         <Text style={styles.headerTitle}>เลือกเมนูอาหาร</Text>
//         {/* คุณสามารถเพิ่มไอคอน Profile และ Logout ที่นี่ได้ถ้าต้องการ */}
//       </View>
//       <View style={styles.searchContainer}>
//         <TextInput
//           style={styles.searchInput}
//           placeholder="ค้นหาเมนู..."
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//         />
//       </View>
//       <FlatList
//         data={filteredMenus}
//         keyExtractor={(item) => item.menu_id.toString()}
//         renderItem={({ item }) => (
//           <MenuItem 
//             menu={item} 
//             onStartCooking={handleStartCooking}
//           />
//         )}
//         contentContainerStyle={{ paddingBottom: 16 }}
//       />
//     </SafeAreaView>
//   );
// };

// // Stylesheet สำหรับหน้า Home
// const styles = StyleSheet.create({
//   centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   container: { flex: 1, backgroundColor: '#f5f5f5' },
//   headerContainer: {
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//     backgroundColor: 'white',
//   },
//   headerTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//   },
//   searchContainer: {
//     backgroundColor: 'white',
//     padding: 16,
//     paddingTop: 8,
//   },
//   searchInput: {
//     backgroundColor: '#f0f0f0',
//     borderRadius: 8,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     fontSize: 16,
//   },
//   itemContainer: {
//     flexDirection: 'row',
//     backgroundColor: 'white',
//     borderRadius: 12,
//     marginVertical: 8,
//     marginHorizontal: 16,
//     elevation: 2,
//     overflow: 'hidden', // ทำให้รูปภาพไม่ล้นขอบ
//   },
//   image: {
//     width: 120,
//     height: '100%',
//   },
//   infoContainer: {
//     flex: 1,
//     padding: 12,
//     justifyContent: 'space-between',
//   },
//   menuName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   menuPrice: {
//     fontSize: 16,
//     color: '#666',
//     marginTop: 4,
//   },
//   cookButton: {
//     backgroundColor: '#007bff',
//     borderRadius: 8,
//     paddingVertical: 12,
//     alignItems: 'center',
//     marginTop: 12,
//   },
//   cookButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   errorText: {
//     color: 'red',
//   },
// });

// export default HomeScreen;