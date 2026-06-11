import { Ionicons } from '@expo/vector-icons';
import { router, Tabs } from 'expo-router';
import { View } from 'react-native';
import { ROUTES } from '@/constants/routes';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#059669',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: { fontSize: 12, fontWeight: '500' },
        tabBarStyle: { height: 60, paddingBottom: 8, paddingTop: 6 },
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: 'Home',
          tabBarAccessibilityLabel: 'Início',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="scan-action"
        options={{
          title: 'Escanear',
          tabBarAccessibilityLabel: 'Escanear produto',
          tabBarIcon: () => (
            <View className="h-10 w-10 -mt-1 items-center justify-center rounded-full bg-primary-500">
              <Ionicons name="scan" size={28} color="#FFFFFF" />
            </View>
          ),
        }}
        listeners={{
          // O fluxo de scan vive fora das tabs (full-screen). O botão central não
          // navega para uma tab: ele abre o wizard de scan por cima da tab bar.
          tabPress: (e) => {
            e.preventDefault();
            router.push(ROUTES.SCAN_BARCODE);
          },
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Histórico',
          tabBarAccessibilityLabel: 'Histórico',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'time' : 'time-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarAccessibilityLabel: 'Perfil',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
