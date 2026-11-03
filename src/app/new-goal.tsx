import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/button';
import { Field } from '@/components/field';
import { Txt } from '@/components/txt';
import { addGoal } from '@/db/repo';
import { parsePrice } from '@/features/onboarding-draft';
import { useColors } from '@/providers/settings-provider';

export default function NewGoalScreen() {
  const c = useColors();
  const db = useSQLiteContext();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const value = parsePrice(amount);
  const valid = title.trim().length > 0 && value > 0;

  const save = async () => {
    await addGoal(db, title.trim(), value);
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.surface, padding: 20, paddingTop: 28, gap: 16 }}>
      <Txt variant="heading" accessibilityRole="header">
        Yeni tasarruf hedefi
      </Txt>
      <Field label="Neye biriktiriyorsun?" value={title} onChangeText={setTitle} placeholder="Örn. Yeni bisiklet" autoFocus />
      <Field
        label="Tutar (₺)"
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
        inputMode="decimal"
        placeholder="Örn. 5000"
      />
      <Button title="Hedefi kaydet" onPress={save} disabled={!valid} />
    </View>
  );
}
