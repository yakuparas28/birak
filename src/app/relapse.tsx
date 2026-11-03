import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Chip } from '@/components/chip';
import { Icon } from '@/components/icon';
import { BackButton } from '@/components/icon-button';
import { Screen } from '@/components/screen';
import { Txt } from '@/components/txt';
import { addRelapse } from '@/db/repo';
import { useProgress } from '@/hooks/use-progress';
import { triggerOptions } from '@/lib/addictions';
import { formatDays } from '@/lib/stats';
import { useColors } from '@/providers/settings-provider';
import { fixed, fonts } from '@/theme/tokens';

const modes = [
  { id: 'keep', title: 'Tek seferlik say, devam et', sub: 'Sayaç kaldığı yerden sürer; bu an kaydedilir.' },
  { id: 'reset', title: 'Sayacı sıfırla', sub: 'Yeni bir başlangıç. Rekorun ve rozetlerin korunur.' },
] as const;

export default function RelapseScreen() {
  const c = useColors();
  const db = useSQLiteContext();
  const progress = useProgress(60_000);
  const [picked, setPicked] = useState<string[]>([]);
  const [mode, setMode] = useState<'keep' | 'reset'>('keep');

  const save = async () => {
    await addRelapse(db, picked, mode === 'reset');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  };

  return (
    <Screen
      modal
      gap={20}
      footer={
        <>
          <Button title="Kaydet ve devam et" onPress={save} />
          <Button
            title="Şu an hâlâ zorlanıyorum"
            variant="outline"
            size="md"
            onPress={() => {
              router.back();
              router.push('/sos');
            }}
          />
        </>
      }>
      <BackButton icon="close" />
      <View style={{ gap: 10 }}>
        <Txt variant="title" accessibilityRole="header">
          Kaymalar da yolculuğun bir parçası.
        </Txt>
        <Txt muted>Bu bir başarısızlık değil. Ne olduğunu anlamak, bir sonrakini önlemene yardım eder.</Txt>
      </View>

      {progress ? (
        <Card tone="soft" style={{ flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 18 }}>
          <Icon name="badge" size={22} color={c.brand} />
          <Txt variant="label" style={{ flex: 1, fontSize: 14, fontFamily: fonts.regular }}>
            En uzun serin {formatDays(progress.stats.longestStreakMs).replace('g', ' gün')}. Bu rekor ve rozetlerin her durumda seninle kalır.
          </Txt>
        </Card>
      ) : null}

      <View style={{ gap: 10 }}>
        <Txt variant="bodyStrong">Ne tetikledi?</Txt>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {triggerOptions.map((t) => (
            <Chip
              key={t}
              label={t}
              selected={picked.includes(t)}
              onPress={() => setPicked((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]))}
            />
          ))}
        </View>
      </View>

      <View style={{ gap: 10 }} accessibilityRole="radiogroup">
        <Txt variant="bodyStrong">Sayaçla ne yapalım?</Txt>
        {modes.map((m) => {
          const selected = mode === m.id;
          return (
            <Pressable
              key={m.id}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              onPress={() => {
                Haptics.selectionAsync();
                setMode(m.id);
              }}
              style={{
                borderRadius: 18,
                borderWidth: selected ? 2 : 1,
                borderColor: selected ? fixed.accent : c.line,
                backgroundColor: c.surface,
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 14,
              }}>
              <View
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 11,
                  borderWidth: 2,
                  borderColor: selected ? fixed.accent : c.line,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {selected ? <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: fixed.accent }} /> : null}
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Txt variant="bodyStrong" style={{ fontSize: 15, fontFamily: fonts.bold }}>
                  {m.title}
                </Txt>
                <Txt variant="caption" muted>
                  {m.sub}
                </Txt>
              </View>
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}
