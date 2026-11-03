import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Chip } from '@/components/chip';
import { Field } from '@/components/field';
import { Icon } from '@/components/icon';
import { Screen } from '@/components/screen';
import { StepHeader } from '@/components/step-header';
import { Toggle } from '@/components/toggle';
import { Txt } from '@/components/txt';
import { createProfile, setSetting } from '@/db/repo';
import { parsePrice, quitTimestamp, useDraft } from '@/features/onboarding-draft';
import { reasonOptions } from '@/lib/addictions';
import { requestReminderPermission, scheduleDailyReminder } from '@/lib/reminders';
import { useColors } from '@/providers/settings-provider';

export default function MotivationScreen() {
  const c = useColors();
  const db = useSQLiteContext();
  const { draft, update } = useDraft();
  const [saving, setSaving] = useState(false);

  const toggleReason = (id: string) =>
    update({
      reasons: draft.reasons.includes(id) ? draft.reasons.filter((r) => r !== id) : [...draft.reasons, id],
    });

  const finish = async () => {
    setSaving(true);
    let remind = draft.remind;
    if (remind) {
      remind = await requestReminderPermission();
      if (remind) await scheduleDailyReminder('21:00');
    }
    await setSetting(db, 'notifications', remind ? '1' : '0');
    await setSetting(db, 'reminderTime', '21:00');
    // Creating the profile flips the route guard in the root layout to the main app.
    await createProfile(db, {
      name: draft.name.trim(),
      addiction: draft.addiction,
      perDay: draft.perDay,
      packSize: draft.packSize,
      unitPrice: parsePrice(draft.price),
      quitAt: quitTimestamp(draft),
      reasons: draft.reasons,
      note: draft.note.trim(),
      goalDays: 30,
    });
  };

  return (
    <Screen gap={22} footer={<Button title="Yolculuğa başla" onPress={finish} disabled={saving} />}>
      <StepHeader step={3} />
      <View style={{ gap: 10 }}>
        <Txt variant="title" accessibilityRole="header">
          Neden bırakıyorsun?
        </Txt>
        <Txt muted>Zor anlarda sana nedenlerini hatırlatacağız. Birden fazla seçebilirsin.</Txt>
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {reasonOptions.map((r) => (
          <Chip
            key={r.id}
            label={r.label}
            height={44}
            showCheck
            selected={draft.reasons.includes(r.id)}
            onPress={() => toggleReason(r.id)}
          />
        ))}
      </View>

      <Field
        label="Kendine bir not bırak"
        multiline
        background={c.surface}
        value={draft.note}
        onChangeText={(note) => update({ note })}
        placeholder="Örn. Kızımla parkta nefes nefese kalmadan koşabilmek için."
      />

      <Field
        label="Sana nasıl hitap edelim?"
        background={c.surface}
        value={draft.name}
        onChangeText={(name) => update({ name })}
        placeholder="Adın (isteğe bağlı)"
        autoComplete="given-name"
      />

      <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: c.soft,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon name="bell" size={20} color={c.brand} />
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Txt variant="bodyStrong" style={{ fontSize: 15 }}>
            Günlük hatırlatıcı
          </Txt>
          <Txt variant="caption" muted>
            Her akşam 21:00&apos;de kısa bir kontrol
          </Txt>
        </View>
        <Toggle label="Günlük hatırlatıcı" value={draft.remind} onValueChange={(remind) => update({ remind })} />
      </Card>
    </Screen>
  );
}
