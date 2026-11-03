import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Card } from '@/components/card';
import { Chip } from '@/components/chip';
import { Icon } from '@/components/icon';
import { Screen } from '@/components/screen';
import { Txt } from '@/components/txt';
import { communityGroups, communityPosts, supportLines } from '@/data/community-mock';
import { useColors } from '@/providers/settings-provider';
import { fixed, fonts } from '@/theme/tokens';

export default function CommunityScreen() {
  const c = useColors();
  const [group, setGroup] = useState('Tümü');
  const [liked, setLiked] = useState<Record<string, boolean>>({});

  const posts = group === 'Tümü' ? communityPosts : communityPosts.filter((p) => p.group === group);

  return (
    <Screen tabBar>
      <View style={styles.header}>
        <Txt variant="title" style={{ fontSize: 30 }} accessibilityRole="header">
          Topluluk
        </Txt>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Paylaşım yaz"
          onPress={() => Alert.alert('Yakında', 'Paylaşım yapma özelliği topluluk sunucusu hazır olduğunda açılacak.')}
          style={styles.compose}>
          <Icon name="plus" size={20} strokeWidth={2.2} color="#FFFFFF" />
        </Pressable>
      </View>

      <Card style={{ gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Icon name="heart" size={20} color={c.brand} />
          <Txt variant="bodyStrong" style={{ fontFamily: fonts.bold }}>
            Profesyonel destek
          </Txt>
        </View>
        <Txt variant="caption" muted>
          Ücretsiz ve gizli danışma hatları. Yalnız değilsin.
        </Txt>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {supportLines.map((line) => (
            <Pressable
              key={line.number}
              accessibilityRole="link"
              accessibilityLabel={`${line.title}, ${line.subtitle}. Ara`}
              onPress={() => Linking.openURL(`tel:${line.number}`)}
              style={[styles.line, { backgroundColor: c.soft }]}>
              <Txt color={c.brand} style={{ fontFamily: fonts.display, fontSize: 18 }}>
                {line.title}
              </Txt>
              <Txt variant="caption" muted style={{ fontSize: 12 }}>
                {line.subtitle}
              </Txt>
            </Pressable>
          ))}
        </View>
      </Card>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginHorizontal: -20 }}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}>
        {communityGroups.map((g) => (
          <Chip key={g} label={g} tone="ink" selected={group === g} onPress={() => setGroup(g)} />
        ))}
      </ScrollView>

      {posts.length === 0 ? (
        <Card>
          <Txt muted style={{ textAlign: 'center' }}>
            Bu grupta henüz paylaşım yok.
          </Txt>
        </Card>
      ) : null}

      {posts.map((p) => {
        const on = !!liked[p.id];
        return (
          <Card key={p.id} style={{ gap: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={[styles.avatar, { backgroundColor: p.color }]}>
                <Txt color={fixed.chipInk} style={{ fontFamily: fonts.display, fontSize: 15 }}>
                  {p.initials}
                </Txt>
              </View>
              <View style={{ flex: 1, gap: 1 }}>
                <Txt variant="label" style={{ fontSize: 15, fontFamily: fonts.bold }}>
                  {p.name}
                </Txt>
                <Txt variant="caption" muted style={{ fontSize: 12 }}>
                  {p.group} · {p.ago}
                </Txt>
              </View>
              <View style={{ backgroundColor: c.soft, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 }}>
                <Txt variant="caption" color={c.brand} style={{ fontSize: 12, fontFamily: fonts.bold }}>
                  {p.streak}
                </Txt>
              </View>
            </View>
            <Txt style={{ fontSize: 15 }}>{p.text}</Txt>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: on }}
                onPress={() => {
                  Haptics.selectionAsync();
                  setLiked((l) => ({ ...l, [p.id]: !on }));
                }}
                style={[
                  styles.action,
                  { backgroundColor: on ? c.soft : 'transparent', borderColor: on ? c.soft : c.line },
                ]}>
                <Icon name="heart" size={16} strokeWidth={2} color={on ? c.brand : c.ink} />
                <Txt variant="label" color={on ? c.brand : c.ink} style={{ fontFamily: fonts.bold }}>
                  Destek ol · {p.likes + (on ? 1 : 0)}
                </Txt>
              </Pressable>
              <View style={[styles.action, { borderColor: c.line }]} accessibilityLabel={`${p.comments} yorum`}>
                <Icon name="chat" size={16} strokeWidth={2} color={c.ink} />
                <Txt variant="label">{p.comments}</Txt>
              </View>
            </View>
          </Card>
        );
      })}

      <Txt variant="caption" muted style={{ textAlign: 'center', fontSize: 12 }}>
        Topluluk şu an örnek paylaşımlarla gösteriliyor. Paylaşımlar takma adla yapılacak.
      </Txt>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  compose: { width: 44, height: 44, borderRadius: 22, backgroundColor: fixed.accent, alignItems: 'center', justifyContent: 'center' },
  line: { flex: 1, minHeight: 56, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 10, justifyContent: 'center', gap: 2 },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  action: { height: 40, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
});
