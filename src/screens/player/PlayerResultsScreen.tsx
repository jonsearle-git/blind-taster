import { StyleSheet, View, Text, FlatList, Pressable } from 'react-native';
import { useState } from 'react';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { PlayerStackParamList } from '../../types/navigation';
import { RoundResult } from '../../types/results';
import { useGameContext } from '../../context/GameContext';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Banner } from '../../components/Banner';
import { Divider } from '../../components/Divider';
import { QuestionResult } from '../../components/questions/QuestionResult';

type Route = RouteProp<PlayerStackParamList, 'PlayerResults'>;

function ordinal(n: number): string {
  const suffix = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (suffix[(v - 20) % 10] ?? suffix[v] ?? suffix[0]);
}

export default function PlayerResultsScreen(): React.ReactElement {
  const route          = useRoute<Route>();
  const { results }    = route.params;
  const { state }      = useGameContext();
  const [expanded, setExpanded] = useState<number | null>(null);

  const myResult = results.players.find((p) => p.player.id === state.localPlayerId)
    ?? results.players[0]
    ?? null;

  if (!myResult) {
    return (
      <ScreenContainer>
        <Text style={styles.fallback}>No results available.</Text>
      </ScreenContainer>
    );
  }

  const isWinner = myResult.player.id === results.winner.id;

  return (
    <ScreenContainer noPadding>
      <Banner title="Your Results" />

      <FlatList
        data={myResult.rounds}
        keyExtractor={(item) => String(item.roundNumber)}
        ListHeaderComponent={
          <>
            <View style={styles.hero}>
              {isWinner && <Text style={styles.winnerBadge}>Winner!</Text>}
              <Text style={styles.position}>{ordinal(myResult.position)}</Text>
              <Text style={styles.score}>{myResult.totalScore} pts</Text>
            </View>
            <Divider />
          </>
        }
        ItemSeparatorComponent={() => <Divider spacing={Spacing.xs} />}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <RoundSection
            round={item}
            expanded={expanded === item.roundNumber}
            onToggle={() => setExpanded(expanded === item.roundNumber ? null : item.roundNumber)}
          />
        )}
      />
    </ScreenContainer>
  );
}

type SectionProps = {
  round:    RoundResult;
  expanded: boolean;
  onToggle: () => void;
};

function RoundSection({ round, expanded, onToggle }: SectionProps): React.ReactElement {
  return (
    <View>
      <Pressable
        onPress={onToggle}
        style={styles.roundHeader}
        accessibilityRole="button"
        accessibilityLabel={`Round ${round.roundNumber} results`}
      >
        <View style={styles.roundHeaderLeft}>
          <Text style={styles.roundLabel}>
            Round {round.roundNumber}
            {round.roundLabel !== null ? ` — ${round.roundLabel}` : ''}
          </Text>
        </View>
        <Text style={styles.roundScore}>+{round.roundScore} pts</Text>
        <Text style={styles.chevron}>{expanded ? '▲' : '▼'}</Text>
      </Pressable>

      {expanded && (
        <View style={styles.breakdown}>
          {round.questionResults.map((qr) => (
            <QuestionResult key={qr.questionId} result={qr} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  list:            { paddingBottom: Spacing.xxl },
  hero:            { alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.xl, paddingHorizontal: Spacing.md },
  winnerBadge:     { color: Colors.gold, fontSize: FontSize.sm, fontWeight: FontWeight.bold, letterSpacing: 2 },
  position:        { color: Colors.textPrimary, fontSize: FontSize.hero, fontWeight: FontWeight.black },
  score:           { color: Colors.textSecondary, fontSize: FontSize.xl },
  roundHeader:     {
    flexDirection:     'row',
    alignItems:        'center',
    paddingVertical:   Spacing.md,
    paddingHorizontal: Spacing.md,
    gap:               Spacing.sm,
  },
  roundHeaderLeft: { flex: 1 },
  roundLabel:      { color: Colors.textPrimary, fontSize: FontSize.md, fontWeight: FontWeight.medium },
  roundScore:      { color: Colors.success, fontSize: FontSize.md, fontWeight: FontWeight.bold },
  chevron:         { color: Colors.textDisabled, fontSize: FontSize.sm },
  breakdown:       { paddingHorizontal: Spacing.md, paddingBottom: Spacing.md, gap: Spacing.md },
  fallback:        { color: Colors.textSecondary, fontSize: FontSize.md, textAlign: 'center' },
});
