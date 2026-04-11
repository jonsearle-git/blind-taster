import { StyleSheet, View, Text, FlatList } from 'react-native';
import { useState } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { HostStackParamList } from '../../types/navigation';
import { Round } from '../../types/game';
import { ScreenContainer } from '../../components/ScreenContainer';
import { TextInput } from '../../components/TextInput';
import { Button } from '../../components/Button';
import { Divider } from '../../components/Divider';

type Nav   = NativeStackNavigationProp<HostStackParamList>;
type Route = RouteProp<HostStackParamList, 'RoundsBuilder'>;

function makeRounds(n: number, existing: Round[] = []): Round[] {
  return Array.from({ length: n }, (_, i) => existing[i] ?? { number: i + 1, label: null });
}

export default function RoundsBuilderScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const { questionnaireId } = route.params;

  const [rounds, setRounds] = useState<Round[]>(makeRounds(3));

  function handleCountChange(text: string): void {
    const n = Math.min(Math.max(parseInt(text, 10) || 1, 1), 20);
    setRounds((prev) => makeRounds(n, prev));
  }

  function handleLabelChange(number: number, label: string): void {
    setRounds((prev) =>
      prev.map((r) => (r.number === number ? { ...r, label: label || null } : r))
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>Set Up Rounds</Text>
        <Text style={styles.subtitle}>How many items are being tested?</Text>
      </View>

      <TextInput
        label="Number of Rounds"
        value={String(rounds.length)}
        onChangeText={handleCountChange}
        keyboardType="number-pad"
      />

      <View style={styles.notice}>
        <Text style={styles.noticeText}>
          Round labels are hidden from players until the end of the game.
        </Text>
      </View>

      <Divider />

      <Text style={styles.listLabel}>Label Each Round (Optional)</Text>

      <FlatList
        data={rounds}
        keyExtractor={(item) => String(item.number)}
        ItemSeparatorComponent={() => <Divider spacing={Spacing.sm} />}
        renderItem={({ item }) => (
          <View style={styles.roundRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.number}</Text>
            </View>
            <TextInput
              value={item.label ?? ''}
              onChangeText={(text) => handleLabelChange(item.number, text)}
              placeholder={`Round ${item.number} label…`}
              containerStyle={styles.labelInput}
            />
          </View>
        )}
      />

      <Button
        label="Continue to Lobby"
        onPress={() => navigation.navigate('HostLobby', { questionnaireId, rounds })}
        style={styles.proceed}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header:     { paddingVertical: Spacing.lg, gap: Spacing.xs },
  title:      { color: Colors.textPrimary, fontSize: FontSize.xxl, fontWeight: FontWeight.black },
  subtitle:   { color: Colors.textSecondary, fontSize: FontSize.md },
  notice:     { backgroundColor: Colors.surfaceElevated, borderRadius: Spacing.sm, borderLeftWidth: 3, borderLeftColor: Colors.gold, padding: Spacing.md, marginVertical: Spacing.sm },
  noticeText: { color: Colors.textSecondary, fontSize: FontSize.sm },
  listLabel:  { color: Colors.textSecondary, fontSize: FontSize.sm, fontWeight: FontWeight.bold, letterSpacing: 1, marginBottom: Spacing.sm },
  roundRow:   { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  badge:      { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.surfaceElevated, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  badgeText:  { color: Colors.gold, fontSize: FontSize.sm, fontWeight: FontWeight.bold },
  labelInput: { flex: 1 },
  proceed:    { marginTop: Spacing.lg },
});
