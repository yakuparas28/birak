import { File, Paths } from 'expo-file-system';
import * as LocalAuthentication from 'expo-local-authentication';
import { router } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useSQLiteContext } from 'expo-sqlite';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { Card, Divider } from '@/components/card';
import { Icon } from '@/components/icon';
import { Screen } from '@/components/screen';
import { SettingRow } from '@/components/setting-row';
import { Txt } from '@/components/txt';
import { exportAll, wipeAll } from '@/db/repo';
import { useProgress } from '@/hooks/use-progress';
import { badgeDefs } from '@/lib/badges';
import { cancelReminders, requestReminderPermission, scheduleDailyReminder } from '@/lib/reminders';
import { formatDate, formatDays, formatMoney } from '@/lib/stats';
import { useSettings, type ThemePreference } from '@/providers/settings-provider';
import { fixed, fonts } from '@/theme/tokens';

const themeLabels: Record<ThemePreference, string> = { system: 'Sistem', light: 'Açık', dark: 'Karanlık' };
const reminderTimes = ['08:00', '12:00', '18:00', '21:00', '22:30'];

export default function ProfileScreen() {
  const settings = useSettings();
  const { c } = settings;
  const db = useSQLiteContext();
  const progress = useProgress(60_000);
  if (!progress) return null;

  const { profile, addiction, stats, cravingsOvercome, earned } = progress;
  const unitPriceLabel = addiction.usesPack ? 'Paket fiyatı' : 'Birim maliyet';

  const toggleNotifications = async (on: boolean) => {
    if (on) {
      const granted = await requestReminderPermission();
      if (!granted) {
        Alert.alert('İzin gerekli', 'Hatırlatıcı için cihaz ayarlarından bildirim izni vermelisin.');
        return;
      }
      await scheduleDailyReminder(settings.reminderTime);
    } else {
      await cancelReminders();
    }
    await settings.set('notifications', on ? '1' : '0');
  };

  const pickReminderTime = () =>
    Alert.alert('Hatırlatma saati', undefined, [
      ...reminderTimes.map((time) => ({
        text: time,
        onPress: async () => {
          await settings.set('reminderTime', time);
          if (settings.notifications) await scheduleDailyReminder(time);
        },
      })),
      { text: 'Vazgeç', style: 'cancel' as const },
    ]);

  const pickTheme = () =>
    Alert.alert('Tema', undefined, [
      ...(Object.keys(themeLabels) as ThemePreference[]).map((key) => ({
        text: themeLabels[key],
        onPress: () => settings.set('theme', key),
      })),
      { text: 'Vazgeç', style: 'cancel' as const },
    ]);

  const toggleLock = async (on: boolean) => {
    if (on) {
      const [hasHardware, enrolled] = await Promise.all([
        LocalAuthentication.hasHardwareAsync(),
        LocalAuthentication.isEnrolledAsync(),
      ]);
      if (!hasHardware || !enrolled) {
        Alert.alert('Kullanılamıyor', 'Bu cihazda Face ID, parmak izi ya da ekran kilidi ayarlı değil.');
        return;
      }
      const result = await LocalAuthentication.authenticateAsync({ promptMessage: 'Uygulama kilidini aç' });
      if (!result.success) return;
    }
    await settings.set('appLock', on ? '1' : '0');
  };

  const exportData = async () => {
    try {
      const file = new File(Paths.cache, `bagimlilik-verilerim-${Date.now()}.json`);
      file.create();
      file.write(JSON.stringify(await exportAll(db), null, 2));
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(file.uri, { mimeType: 'application/json', dialogTitle: 'Verilerimi dışa aktar' });
      } else {
        Alert.alert('Paylaşım kullanılamıyor', 'Bu cihazda dosya paylaşımı desteklenmiyor.');
      }
    } catch {
      Alert.alert('Dışa aktarılamadı', 'Bir sorun oluştu, lütfen tekrar dene.');
    }
  };

  const confirmWipe = () =>
    Alert.alert('Tüm veriler silinsin mi?', 'Sayaç, günlük, rozetler ve ayarların kalıcı olarak silinir.', [
      { text: 'Vazgeç', style: 'cancel' },
      {
        text: 'Hepsini sil',
        style: 'destructive',
        onPress: async () => {
          await cancelReminders();
          await wipeAll(db);
        },
      },
    ]);

  return (
    <Screen tabBar>
      <Txt variant="title" style={{ fontSize: 30 }} accessibilityRole="header">
        Profil
      </Txt>

      <Card style={{ gap: 16, borderRadius: 22 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <View style={styles.avatar}>
            <Txt color="#FFFFFF" style={{ fontFamily: fonts.display, fontSize: 24 }}>
              {(profile.name || addiction.label).charAt(0).toLocaleUpperCase('tr-TR')}
            </Txt>
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <Txt variant="bodyStrong" style={{ fontSize: 18, fontFamily: fonts.bold }}>
              {profile.name || 'İsimsiz kahraman'}
            </Txt>
            <Txt variant="label" muted style={{ fontFamily: fonts.regular }}>
              {addiction.freeShort} · {stats.days + 1}. gün
            </Txt>
          </View>
          <Button title="Düzenle" variant="outline" size="md" onPress={() => router.push('/edit-profile')} style={{ height: 40, paddingHorizontal: 14 }} />
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {[
            [formatDays(stats.longestStreakMs), 'En uzun seri'],
            [String(cravingsOvercome), 'Atlatılan kriz'],
            [formatMoney(stats.saved), 'Tasarruf'],
          ].map(([value, label]) => (
            <View key={label} style={[styles.miniStat, { backgroundColor: c.bg }]}>
              <Txt style={{ fontFamily: fonts.display, fontSize: 20 }} numberOfLines={1} adjustsFontSizeToFit>
                {value}
              </Txt>
              <Txt variant="caption" muted style={{ fontSize: 12 }}>
                {label}
              </Txt>
            </View>
          ))}
        </View>
                <Pressable accessibilityRole="link" onPress={() => router.push('/badges')} style={[styles.badgeRow, { backgroundColor: c.soft }]}>
            <Icon name="badge" size={20} color={c.brand} />
            <Txt variant="label" style={{ flex: 1, fontSize: 15, fontFamily: fonts.bold }}>
              Rozetlerim
            </Txt>
            <Txt variant="label" muted>
              {earned.length} / {badgeDefs.length}
            </Txt>
            <Icon name="chevron" size={16} strokeWidth={2} color={c.ink} />
          </Pressable>
      </Card>

      <Section title="Bağımlılık bilgileri">
        <SettingRow label="Bıraktığım alışkanlık" value={addiction.label} onPress={() => router.push('/edit-profile')} />
        <Divider />
        <SettingRow
          label="Günlük miktar"
          value={`${profile.perDay} ${addiction.unit}`}
          onPress={() => router.push('/edit-profile')}
        />
        <Divider />
        <SettingRow label={unitPriceLabel} value={formatMoney(profile.unitPrice)} onPress={() => router.push('/edit-profile')} />
        <Divider />
        <SettingRow label="Başlangıç tarihi" value={formatDate(profile.quitAt)} />
      </Section>

      <Section title="Uygulama">
        <SettingRow label="Bildirimler" toggle={{ value: settings.notifications, onChange: toggleNotifications }} />
        <Divider />
        <SettingRow label="Günlük hatırlatma" value={settings.reminderTime} onPress={pickReminderTime} />
        <Divider />
        <SettingRow label="Tema" value={themeLabels[settings.theme]} onPress={pickTheme} />
        <Divider />
        <SettingRow label="Uygulama kilidi (Face ID)" toggle={{ value: settings.appLock, onChange: toggleLock }} />
        <Divider />
        <SettingRow label="Dil" value="Türkçe" />
      </Section>

      <Section title="Destek ve veriler">
        <SettingRow label="Kayma yaşadım" destructive onPress={() => router.push('/relapse')} />
        <Divider />
        <SettingRow label="Danışma hatları" onPress={() => router.navigate('/community')} />
        <Divider />
        <SettingRow label="Verilerimi dışa aktar" onPress={exportData} />
        <Divider />
        <SettingRow
          label="Gizlilik"
          onPress={() =>
            Alert.alert(
              'Gizlilik',
              'Tüm kişisel verilerin yalnızca bu cihazdaki veritabanında saklanır ve hiçbir sunucuya gönderilmez.'
            )
          }
        />
      </Section>

      <Button title="Tüm verileri sil" variant="outline" size="md" onPress={confirmWipe} />
      <Txt variant="caption" muted style={{ textAlign: 'center', fontSize: 12 }}>
        Sürüm 1.0.0
      </Txt>
    </Screen>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: 8 }}>
      <Txt variant="overline" muted style={{ fontSize: 13, paddingHorizontal: 4 }}>
        {title}
      </Txt>
      <Card padded={false}>{children}</Card>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: fixed.accent, alignItems: 'center', justifyContent: 'center' },
  miniStat: { flex: 1, borderRadius: 14, paddingVertical: 10, paddingHorizontal: 12, gap: 2 },
  badgeRow: { minHeight: 48, borderRadius: 14, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
});
