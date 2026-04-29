import { StyleSheet, View, Text, FlatList, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
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
import { ConfirmDialog } from '../../components/ConfirmDialog';

type Nav = NativeStackNavigationProp<HostStackParamList>;

type DialogConfig = {
  title:        string;
  message:      string;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm:    () => void;
};

export default function GamesScreen(): React.ReactElement {
  const navigation                  = useNavigation<Nav>();
  const { games, loading, error, remove } = useGames();
  const { questionnaires }          = useQuestionnaires();
  const { state, dispatch }         = useGameContext();
  const [editMode, setEditMode]         = useState(false);
  const [dialog, setDialog]             = useState<DialogConfig | null>(null);
  const [shoppingList, setShoppingList] = useState<SavedGame | null>(null);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={() => setEditMode((v) => !v)} style={styles.headerBtn}>
          <Text style={styles.headerBtnText}>{editMode ? 'Done' : 'Edit'}</Text>
        </Pressable>
      ),
    });
  }, [editMode]);

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
      setDialog({
        title:        'Already in a Game',
        message:      'Leave the current game and host this one?',
        confirmLabel: 'Leave & Host',
        cancelLabel:  'Cancel',
        destructive:  true,
        onConfirm:    () => { setDialog(null); doHost(game); },
      });
      return;
    }
    doHost(game);
  }

  function handleDelete(game: SavedGame): void {
    setDialog({
      title:        'Delete Game',
      message:      `Delete "${game.name}"? This cannot be undone.`,
      confirmLabel: 'Delete',
      cancelLabel:  'Cancel',
      destructive:  true,
      onConfirm:    () => { setDialog(null); void remove(game.id); },
    });
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
              {editMode ? (
                <Pressable
                  onPress={() => navigation.navigate('RoundsBuilder', { gameId: item.id })}
                  style={({ pressed }) => [styles.rowMain, pressed && styles.rowPressed]}
                  accessibilityRole="button"
                  accessibilityLabel={`Edit ${item.name}`}
                >
                  <View style={styles.rowText}>
                    <Text style={styles.rowName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.rowMeta}>
                      {questionnaireName(item.questionnaireId)} · {item.rounds.length} rounds
                    </Text>
                  </View>
                  <Text style={styles.chevronEdit}>›</Text>
                </Pressable>
              ) : (
                <View style={styles.rowMain}>
                  <View style={styles.rowText}>
                    <Text style={styles.rowName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.rowMeta}>
                      {questionnaireName(item.questionnaireId)} · {item.rounds.length} rounds
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => setShoppingList(item)}
                    style={styles.listBtn}
                    accessibilityRole="button"
                    accessibilityLabel={`Answers for ${item.name}`}
                  >
                    <Text style={styles.listText}>Answers</Text>
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
              {editMode && (
                <Pressable
                  onPress={() => handleDelete(item)}
                  style={styles.deleteBtn}
                  accessibilityRole="button"
                  accessibilityLabel={`Delete ${item.name}`}
                >
                  <Text style={styles.deleteText}>✕</Text>
                </Pressable>
              )}
            </View>
          )}
        />
      )}

      <ConfirmDialog
        visible={dialog !== null}
        title={dialog?.title ?? ''}
        message={dialog?.message ?? ''}
        confirmLabel={dialog?.confirmLabel}
        cancelLabel={dialog?.cancelLabel}
        destructive={dialog?.destructive}
        onConfirm={dialog?.onConfirm ?? (() => setDialog(null))}
        onCancel={() => setDialog(null)}
      />

      <ConfirmDialog
        visible={shoppingList !== null}
        title={shoppingList?.name ?? ''}
        message={shoppingList?.rounds.map((r) => `Round ${r.number}: ${r.label ?? '—'}`).join('\n') ?? ''}
        confirmLabel="Done"
        onConfirm={() => setShoppingList(null)}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerBtn:     { paddingHorizontal: Spacing.sm },
  headerBtnText: { color: Colors.primary, fontSize: FontSize.md, fontWeight: FontWeight.bold },
  row:         { flexDirection: 'row', alignItems: 'center' },
  rowMain:     { flex: 1, flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md, gap: Spacing.sm },
  rowPressed:  { opacity: 0.7 },
  rowText:     { flex: 1, gap: Spacing.xs },
  rowName:     { color: Colors.textPrimary, fontSize: FontSize.md, fontWeight: FontWeight.medium },
  rowMeta:     { color: Colors.textSecondary, fontSize: FontSize.sm },
  chevronEdit: { color: Colors.textDisabled, fontSize: FontSize.xl },
  listBtn:     { backgroundColor: Colors.surfaceElevated, borderRadius: Spacing.sm, paddingVertical: Spacing.xs, paddingHorizontal: Spacing.sm, borderWidth: 1.5, borderColor: Colors.border, alignItems: 'center', minWidth: 72 },
  listText:    { color: Colors.textSecondary, fontSize: FontSize.sm, fontWeight: FontWeight.bold },
  hostBtn:     { backgroundColor: Colors.primary, borderRadius: Spacing.sm, paddingVertical: Spacing.xs, paddingHorizontal: Spacing.sm, alignItems: 'center', minWidth: 72 },
  hostText:    { color: Colors.surface, fontSize: FontSize.sm, fontWeight: FontWeight.bold },
  deleteBtn:   { padding: Spacing.md },
  deleteText:  { color: Colors.error, fontSize: FontSize.md },
});
