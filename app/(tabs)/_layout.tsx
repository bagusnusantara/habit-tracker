import { Tabs, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { TouchableOpacity, Alert } from 'react-native';

export default function TabLayout() {
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
        Alert.alert('Error', error.message);
    } else {
        router.replace('/auth');
    }
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerRight: () => (
            <TouchableOpacity onPress={handleLogout} style={{ marginRight: 16 }}>
                <Ionicons name="log-out-outline" size={24} color="#6366F1" />
            </TouchableOpacity>
        ),
        tabBarStyle: { 
            backgroundColor: '#0F172A', 
            borderTopColor: '#334155',
        },
        tabBarActiveTintColor: '#6366F1',
        tabBarInactiveTintColor: '#64748B',
        headerStyle: {
            backgroundColor: '#0F172A',
            shadowColor: 'transparent',
        },
        headerTitleStyle: {
            color: '#F8FAFC',
            fontWeight: 'bold',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="habits"
        options={{
          title: 'My Habits',
          tabBarIcon: ({ color, size }) => <Ionicons name="list" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarIcon: ({ color, size }) => <Ionicons name="stats-chart" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
