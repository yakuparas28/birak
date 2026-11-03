import * as Haptics from 'expo-haptics';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { Alert, Pressable, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Chip } from '@/components/chip';
import { Field } from '@/components/field';
import { Icon } from '@/components/icon';
import { BackButton } from '@/components/icon-button';
import { Screen } from '@/components/screen';
import { Txt } from '@/components/txt';
import { addJournalEntry, deleteJournalEntry, getJournalEntries, getTodayMood } from '@/db/repo';
import { useDbQuery } from '@/db/use-db-query';
import { moodOptions, triggerOptions } from '@/lib/addictions';
import { formatEntryDate } from '@/lib/stats';
import { useColors } from '@/providers/settings-provider';
import { fonts } from '@/theme/tokens';

export default function JournalScreen() {
  const c = useColors();
  const db = useSQLiteContext();
  const entries = useDbQuery(getJournalEntries) ?? [];
  const todayMood = useDbQuery(getTodayMood);
  const [note, setNote] = useState('');
  const [picked, setPicked] = useState<string[]>([]);

  const toggle = (t: string) => setPicked((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]));
  const canSave = note.trim().length > 0 || picked.length > 0;

  const save = async () => {
    await addJournalEntry(db, { mood: todayMood ?? null, note: note.trim(), triggers: picked });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setNote('');
    setPicked([]);
  };

  const remove = (id: number) =>
    Alert.alert('Kayıt silinsin mi?', 'Bu işlem geri alınamaz.', [
      { text: 'Vazgeç', style: 'cancel' },
      { text: 'Sil', style: 'destructive', onPress: () => deleteJournalEntry(db, id) },
    ]);

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <BackButton />
        <Txt variant="title" style={{ fontSize: 30 }} accessibilityRole="header">
          Günlük
        </Txt>
      </View>

      <Card style={{ gap: 14, borderRadius: 22 }}>
        <Field
          label="Bugün aklından neler geçti?"
          multiline
          value={note}
          onChangeText={setNote}
          placeholder="Zorlandığın ya da gurur duyduğun bir an…"
        />
        <Txt variant="label" muted>
          Seni ne tetikledi?
        </Txt>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {triggerOptions.map((t) => (
            <Chip key={t} label={t} height={36} selected={picked.includes(t)} onPress={() => toggle(t)} />
          ))}
        </View>
        <Button title="Kaydet" size="md" onPress={save} disabled={!canSave} />
      </Card>

      <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <Txt variant="bodyStrong" style={{ fontSize: 18, fontFamily: fonts.bold }}>
          Geçmiş kayıtlar
        </Txt>
        <Txt variant="caption" muted>
          {entries.length} kayıt
        </Txt>
      </View>

      {entries.length === 0 ? (
        <Card>
          <Txt muted style={{ textAlign: 'center' }}>
            Henüz kayıt yok. İlk notunu yukarıdan yazabilirsin.
          </Txt>
        </Card>
      ) : null}

      {entries.map((e) => {
        const m = e.mood !== null ? moodOptions[e.mood] : null;
        return (
          <Card key={e.id} style={{ gap: 8, borderRadius: 18 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: m?.dot ?? c.line }} />
              <Txt variant="label" style={{ flex: 1, fontFamily: fonts.bold }}>
                {formatEntryDate(e.createdAt)}
              </Txt>
              {m ? (
                <View style={{ backgroundColor: c.soft, paddingHorizontal: 9, paddingVertical: 3, borderRadius: 999 }}>
                  <Txt variant="caption" color={c.brand} style={{ fontFamily: fonts.bold, fontSize: 12 }}>
                    {m.label}
                  </Txt>
                </View>
              ) : null}
              <Pressable accessibilityRole="button" accessibilityLabel="Kaydı sil" hitSlop={10} onPress={() => remove(e.id)}>
                <Icon name="trash" size={18} color={c.muted} />
              </Pressable>
            </View>
            {e.note ? <Txt style={{ fontSize: 15 }}>{e.note}</Txt> : null}
            {e.triggers.length > 0 ? (
              <Txt variant="caption" muted>
                {e.triggers.join(' · ')}
              </Txt>
            ) : null}
          </Card>
        );
      })}
    </Screen>
  );
}
