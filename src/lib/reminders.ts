import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const CHANNEL_ID = 'daily-reminder';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function ensureChannel() {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: 'Günlük hatırlatıcı',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

/** Asks for permission if needed. Returns whether notifications may be shown. */
export async function requestReminderPermission() {
  if (Platform.OS === 'web') return false;
  await ensureChannel();
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const next = await Notifications.requestPermissionsAsync({
    ios: { allowAlert: true, allowBadge: false, allowSound: true },
  });
  return next.granted;
}

export async function scheduleDailyReminder(time: string) {
  if (Platform.OS === 'web') return;
  const [hour, minute] = time.split(':').map(Number);
  await Notifications.cancelAllScheduledNotificationsAsync();
  await ensureChannel();
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Bugün nasıl geçti?',
      body: 'Bir dakikanı ayır, gününü günlüğüne yaz.',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
      channelId: CHANNEL_ID,
    },
  });
}

export async function cancelReminders() {
  if (Platform.OS === 'web') return;
  await Notifications.cancelAllScheduledNotificationsAsync();
}
