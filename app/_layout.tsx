import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { registerForPushNotificationsAsync } from '../lib/notifications';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
     registerForPushNotificationsAsync();
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="add-habit" options={{ presentation: 'modal', title: 'New Habit' }} />
      </Stack>
    </ThemeProvider>
  );
}
