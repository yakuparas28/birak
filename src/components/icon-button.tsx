import { router } from 'expo-router';
import { Pressable } from 'react-native';

import { Icon, type IconName } from '@/components/icon';
import { useColors } from '@/providers/settings-provider';

type Props = { icon: IconName; label: string; onPress: () => void };

export function IconButton({ icon, label, onPress }: Props) {
  const c = useColors();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={4}
      style={({ pressed }) => ({
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: c.line,
        backgroundColor: c.surface,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: pressed ? 0.7 : 1,
      })}>
      <Icon name={icon} size={20} strokeWidth={2} color={c.ink} />
    </Pressable>
  );
}

export function BackButton({ icon = 'back' }: { icon?: 'back' | 'close' }) {
  return (
    <IconButton
      icon={icon}
      label={icon === 'close' ? 'Kapat' : 'Geri'}
      onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
    />
  );
}
