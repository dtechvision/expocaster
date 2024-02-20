import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { Pressable, StyleSheet, Platform, useWindowDimensions } from 'react-native';

const DrawerLayout = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  return (
    <Drawer
      defaultStatus="closed"
      screenOptions={{
        drawerType: Platform.OS === 'web' ? (isMobile ? 'front' : 'permanent') : 'front',
        drawerStyle: {
          width: Platform.OS === 'web' ? (isMobile ? '80%' : '15%') : '100%',
        },
      }}>
      <Drawer.Screen
        name="index"
        options={{
          headerTitle: 'Home',
          drawerLabel: 'Home',
          drawerIcon: ({ size, color }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="(tabs)"
        options={{
          headerTitle: 'ExpoCaster',
          drawerLabel: 'Tabs',
          drawerIcon: ({ size, color }) => (
            <MaterialIcons name="auto-mode" size={size} color={color} />
          ),
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color="gray"
                    style={[styles.headerRight, { opacity: pressed ? 0.5 : 1 }]}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
    </Drawer>
  );
};

const styles = StyleSheet.create({
  headerRight: {
    marginRight: 15,
  },
});

export default DrawerLayout;
