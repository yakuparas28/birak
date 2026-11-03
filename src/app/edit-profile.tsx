import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Chip } from '@/components/chip';
import { Field } from '@/components/field';
import { HabitFields, type HabitValues } from '@/components/habit-fields';
import { BackButton } from '@/components/icon-button';
import { Screen } from '@/components/screen';
import { Stepper } from '@/components/stepper';
import { Txt } from '@/components/txt';
import { getProfile, updateProfile, type Profile } from '@/db/repo';
import { useDbQuery } from '@/db/use-db-query';
import { parsePrice } from '@/features/onboarding-draft';
import { addictionList, addictions, type AddictionId } from '@/lib/addictions';

export default function EditProfileScreen() {
  const profile = useDbQuery(getProfile);
  if (!profile) return null;
  return <EditForm profile={profile} />;
}

function EditForm({ profile }: { profile: Profile }) {
  const db = useSQLiteContext();
  const [name, setName] = useState(profile.name);
  const [addictionId, setAddictionId] = useState<AddictionId>(profile.addiction);
  const [goalDays, setGoalDays] = useState(profile.goalDays);
  const [habit, setHabit] = useState<HabitValues>({
    perDay: profile.perDay,
    packSize: profile.packSize,
    price: String(profile.unitPrice),
    quitChoice: 'today',
    customDaysAgo: 2,
  });
  const addiction = addictions[addictionId];

  const changeAddiction = (id: AddictionId) => {
    if (id === addictionId) return;
    const a = addictions[id];
    setAddictionId(id);
    setHabit((h) => ({ ...h, perDay: a.perDayDefault, price: String(a.priceDefault), packSize: a.usesPack ? 20 : 1 }));
  };

  const save = async () => {
    await updateProfile(db, {
      name: name.trim(),
      addiction: addictionId,
      perDay: habit.perDay,
      packSize: habit.packSize,
      unitPrice: parsePrice(habit.price),
      goalDays,
    });
    router.back();
  };

  return (
    <Screen footer={<Button title="Kaydet" onPress={save} />}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <BackButton />
        <Txt variant="title" style={{ fontSize: 28 }} accessibilityRole="header">
          Profili düzenle
        </Txt>
      </View>

      <Card>
        <Field label="Adın" value={name} onChangeText={setName} placeholder="Adın (isteğe bağlı)" />
      </Card>

      <View style={{ gap: 10 }}>
        <Txt variant="bodyStrong">Bıraktığım alışkanlık</Txt>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {addictionList.map((a) => (
            <Chip key={a.id} label={a.label} selected={a.id === addictionId} onPress={() => changeAddiction(a.id)} />
          ))}
        </View>
      </View>

      <HabitFields
        addiction={addiction}
        values={habit}
        onChange={(patch) => setHabit((h) => ({ ...h, ...patch }))}
        showQuitDate={false}
      />

      <Card style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <View style={{ flex: 1, gap: 2 }}>
          <Txt variant="bodyStrong">Hedef (gün)</Txt>
          <Txt variant="caption" muted>
            Ana sayfadaki hedef rozeti
          </Txt>
        </View>
        <Stepper label="Hedef gün" value={goalDays} min={1} max={365} onChange={setGoalDays} />
      </Card>
    </Screen>
  );
}
