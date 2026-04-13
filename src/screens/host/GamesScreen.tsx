import { StyleSheet, View, Text, FlatList, Pressable, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { GamePhase } from '../../constants/gameConstants';
import { HostStackParamList } from '../../types/navigation';
import { SavedGame } from '../../types/savedGame';
import { useGames } from '../../hooks/useGames';
import { useQuestionnaires } from '../../hooks/useQuestionnaires';
import { useGameContext } from '../../context/GameContext';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Button } from '../../components/Button';
import { Divider } from '../../components/Divider';
import { EmptyState } from '../../components/EmptyState';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';

type Nav = NativeStackNavigationProp<HostStackParamList>;

export default function GamesScreen(): React.ReactElement {
  const navigation                  = useNavigation<Nav>();
  const { games, loading, error, remove } = useGames();
  const { questionnaires }          = useQuestionnaires();
  const { state, dispatch }         = useGameContext();

  function questionnaireName(id: string): string {
    return questionnaires.find((q) => q.id === id)?.name ?? 'Unknown questionnaire';
  }

  function doHost(game: SavedGame): void {
    dispatch({ type: 'RESET' });
    navigation.navigate('HostLobby', { questionnaireId: game.questionnaireId, rounds: game.rounds });
  }

  function handleHost(game: SavedGame): void {
    const phase = state.gameState?.phase;
    if (phase !== undefined && phase !== GamePhase.GameOver) {
      Alert.alert(
        'Already in a Game',
        'Leave the current game and host this one?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Leave & Host', style: 'destructive', onPress: () => doHost(game) },
        ]
      );
      return;
    }
    doHost(game);
  }

  function handleDelete(game: SavedGame): void {
    Alert.alert(
      'Delete Game',
      `Delete "${game.name}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => void remove(game.id) },
      ]
    );
  }

  return (
    <ScreenContainer>
      <Button
        label="+ Create New Game"
        onPress={() => navigation.navigate('RoundsBuilder', {})}
        variant="secondary"
      />

      <Divider />

      {loading && <LoadingSpinner message="Loading…" />}
      {error !== null && <ErrorMessage message={error} />}
      {!loading && games.length === 0 && (
        <EmptyState title="No saved games" message="Create a game to get started." />
      )}
      {!loading && games.length > 0 && (
        <FlatList
          data={games}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <Divider spacing={0} />}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={styles.rowText}>
                <Text style={styles.rowName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.rowMeta}>
                  {questionnaireName(item.questionnaireId)} · {item.rounds.length} rounds
                </Text>
              </View>
              <Pressable
                onPress={() => navigation.navigate('RoundsBuilder', { gameId: item.id })}
                style={styles.iconBtn}
                accessibilityRole="button"
                accessibilityLabel={`Edit ${item.name}`}
              >
                <Text style={styles.iconText}>✎</Text>
              </Pressable>
              <Pressable
                onPress={() => handleDelete(item)}
                style={styles.iconBtn}
                accessibilityRole="button"
                accessibilityLabel={`Delete ${item.name}`}
              >
                <Text style={styles.deleteText}>✕</Text>
              </Pressable>
              <Pressable
                onPress={() => handleHost(item)}
                style={styles.hostBtn}
                accessibilityRole="button"
                accessibilityLabel={`Host ${item.name}`}
              >
                <Text style={styles.hostText}>Host ▶</Text>
              </Pressable>
            </View>
          )}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  row:        { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm, gap: Spacing.sm },
  rowText:    { flex: 1, gap: Spacing.xs },
  rowName:    { color: Colors.textPrimary, fontSize: FontSize.md, fontWeight: FontWeight.medium },
  rowMeta:    { color: Colors.textSecondary, fontSize: FontSize.sm },
  iconBtn:    { padding: Spacing.sm },
  iconText:   { color: Colors.textSecondary, fontSize: FontSize.md },
  deleteText: { color: Colors.error, fontSize: FontSize.md },
  hostBtn:    { backgroundColor: Colors.primary, borderRadius: Spacing.sm, paddingVertical: Spacing.xs, paddingHorizontal: Spacing.sm },
  hostText:   { color: Colors.textPrimary, fontSize: FontSize.sm, fontWeight: FontWeight.bold },
});
