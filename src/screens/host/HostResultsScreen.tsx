import { StyleSheet, View, Text, FlatList, Pressable } from 'react-native';
import { useState } from 'react';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { HostStackParamList, RootStackParamList } from '../../types/navigation';
import { PlayerResult } from '../../types/results';
import { useGameContext } from '../../context/GameContext';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Banner } from '../../components/Banner';
import { Button } from '../../components/Button';
import { LeaderboardRow } from '../../components/LeaderboardRow';
import { Divider } from '../../components/Divider';
import { QuestionResult } from '../../components/questions/QuestionResult';

type Route = RouteProp<HostStackParamList, 'HostResults'>;
type Nav = NativeStackNavigationProp<HostStackParamList & RootStackParamList>;

export default function HostResultsScreen(): React.ReactElement {
  const route              = useRoute<Route>();
  const { results }        = route.params;
  const { dispatch }       = useGameContext();
  const navigation         = useNavigation<Nav>();
  const [expanded, setExpanded] = useState<string | null>(null);

  function handleDone(): void {
    dispatch({ type: 'RESET' });
    navigation.getParent()?.navigate('Home');
  }

  return (
    <ScreenContainer noPadding>
      <Banner title="Results" />

      <View style={styles.inner}>
        <View style={styles.winner}>
          <Text style={styles.winnerLabel}>Winner</Text>
          <Text style={styles.winnerName}>{results.winner.name}</Text>
          <Text style={styles.winnerScore}>{results.winner.score} pts</Text>
        </View>

        <Divider />

        <FlatList
          data={results.players}
          keyExtractor={(item) => item.player.id}
          ItemSeparatorComponent={() => <Divider spacing={Spacing.xs} />}
          renderItem={({ item, index }) => (
            <PlayerResultSection
              result={item}
              highlight={index === 0}
              expanded={expanded === item.player.id}
              onToggle={() => setExpanded(expanded === item.player.id ? null : item.player.id)}
            />
          )}
        />
      </View>

      <Button label="Done" onPress={handleDone} style={styles.doneButton} />
    </ScreenContainer>
  );
}

type SectionProps = {
  result:   PlayerResult;
  highlight: boolean;
  expanded: boolean;
  onToggle: () => void;
};

function PlayerResultSection({ result, highlight, expanded, onToggle }: SectionProps): React.ReactElement {
  return (
    <View>
      <Pressable onPress={onToggle} accessibilityRole="button" accessibilityLabel={`${result.player.name} results`}>
        <LeaderboardRow result={result} highlight={highlight} />
      </Pressable>
      {expanded && (
        <View style={styles.breakdown}>
          {result.rounds.map((round) => (
            <View key={round.roundNumber} style={styles.round}>
              <Text style={styles.roundLabel}>
                Round {round.roundNumber}{round.roundLabel !== null ? ` — ${round.roundLabel}` : ''}
              </Text>
              {round.questionResults.map((qr) => (
                <QuestionResult key={qr.questionId} result={qr} />
              ))}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inner:       { flex: 1, padding: Spacing.md, gap: Spacing.md },
  doneButton:  { margin: Spacing.md },
  winner:      { alignItems: 'center', gap: Spacing.xs, paddingVertical: Spacing.lg },
  winnerLabel: { color: Colors.gold, fontSize: FontSize.sm, fontWeight: FontWeight.bold, letterSpacing: 1 },
  winnerName:  { color: Colors.textPrimary, fontSize: FontSize.hero, fontWeight: FontWeight.black },
  winnerScore: { color: Colors.textSecondary, fontSize: FontSize.lg },
  breakdown:   { paddingHorizontal: Spacing.md, paddingBottom: Spacing.md, gap: Spacing.md },
  round:       { gap: Spacing.sm },
  roundLabel:  { color: Colors.gold, fontSize: FontSize.sm, fontWeight: FontWeight.bold },
});
