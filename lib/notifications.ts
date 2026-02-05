import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

import Constants, { ExecutionEnvironment } from 'expo-constants';

const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

export async function registerForPushNotificationsAsync() {
    // Push notifications (remote) are not supported in Expo Go for SDK 53+
    if (Platform.OS === 'android' && isExpoGo) {
        console.log('Skipping remote push notification setup in Expo Go (Android SDK 53+)');
        return false;
    }

    try {
        // Initialize handler only when needed
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: false,
            } as any),
        });
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                return false;
            }
            return true;
        } else {
            console.log('Must use physical device for Push Notifications');
            return false;
        }
    } catch (error) {
        console.log("Notification setup failed (likely Expo Go restriction):", error);
        return false;
    }
}

export async function scheduleReminder(title: string, body: string, seconds: number = 2) {
    await Notifications.scheduleNotificationAsync({
        content: {
            title,
            body,
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds,
            repeats: false,
        },
    });
}
