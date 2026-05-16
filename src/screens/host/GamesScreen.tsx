import { StyleSheet, View, Text, FlatList, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight, FontFamily } from '../../constants/typography';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { GamePhase } from '../../constants/gameConstants';
import { HostStackParamList } from '../../types/navigation';
import { SavedGame } from '../../types/savedGame';
import { useGames } from '../../hooks/useGames';
import { useQuestionnaires } from '../../hooks/useQuestionnaires';
import { useGameContext } from '../../context/GameContext';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Button } from '../../components/Button';
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

const TILE_COLORS = [Colors.sun, Colors.melon, Colors.mint, Colors.plum, Colors.ocean, Colors.sun, Colors.melon, Colors.mint];
const TILE_TEXT   = [Colors.ink, Colors.cream, Colors.ink, Colors.cream, Colors.cream, Colors.ink, Colors.cream, Colors.ink];

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
    dispatch({ type: 'SET_ACTIVE_GAME_ID', payload: game.id });
    navigation.navigate('HostGame', { questionnaireId: game.questionnaireId, rounds: game.rounds });
  }

  function handleRejoin(game: SavedGame): void {
    navigation.navigate('HostGame', { questionnaireId: game.questionnaireId, rounds: game.rounds });
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

      <View style={styles.listGap} />

      {loading && <LoadingSpinner message="Loading…" />}
      {error !== null && <ErrorMessage message={error} />}
      {!loading && games.length === 0 && (
        <EmptyState title="No saved games" message="Create a game to get started." />
      )}
      {!loading && games.length > 0 && (
        <FlatList
          data={games}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item, index }) => {
            const isActive = state.activeGameId === item.id &&
              state.gameState?.phase !== undefined &&
              state.gameState.phase !== GamePhase.GameOver;
            const tileColor = isActive ? Colors.melon : TILE_COLORS[index % TILE_COLORS.length];
            const tileText  = isActive ? Colors.cream : TILE_TEXT[index % TILE_TEXT.length];

            return (
              <View style={styles.cardShadowWrap}>
                <View style={styles.cardShadow} />
                <View style={[styles.card, isActive && styles.cardActive]}>
                  {editMode ? (
                    <Pressable
                      onPress={() => navigation.navigate('RoundsBuilder', { gameId: item.id })}
                      style={({ pressed }) => [styles.cardMain, pressed && styles.pressed]}
                      accessibilityRole="button"
                      accessibilityLabel={`Edit ${item.name}`}
                    >
                      <View style={[styles.tile, { backgroundColor: tileColor }]}>
                        <Text style={[styles.tileText, { color: tileText }]}>{item.name[0].toUpperCase()}</Text>
                      </View>
                      <View style={styles.cardText}>
                        <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
                        <Text style={styles.cardMeta}>
                          {questionnaireName(item.questionnaireId)} · {item.rounds.length} rounds
                        </Text>
                      </View>
                      <Text style={styles.chevron}>›</Text>
                    </Pressable>
                  ) : (
                    <View style={styles.cardMain}>
                      <View style={[styles.tile, { backgroundColor: tileColor }]}>
                        <Text style={[styles.tileText, { color: tileText }]}>{item.name[0].toUpperCase()}</Text>
                      </View>
                      <View style={styles.cardText}>
                        <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
                        <Text style={styles.cardMeta}>
                          {questionnaireName(item.questionnaireId)} · {item.rounds.length} rounds
                        </Text>
                      </View>
                      {isActive ? (
                        <Pressable
                          onPress={() => handleRejoin(item)}
                          style={styles.rejoinBtn}
                          accessibilityRole="button"
                          accessibilityLabel={`Rejoin ${item.name}`}
                        >
                          <Text style={styles.rejoinText}>{'Live ▶︎'}</Text>
                        </Pressable>
                      ) : (
                        <>
                          <Pressable
                            onPress={() => setShoppingList(item)}
                            style={styles.answersBtn}
                            accessibilityRole="button"
                            accessibilityLabel={`Answers for ${item.name}`}
                          >
                            <Text style={styles.answersBtnText}>Answers</Text>
                          </Pressable>
                          <Pressable
                            onPress={() => handleHost(item)}
                            style={styles.hostBtn}
                            accessibilityRole="button"
                            accessibilityLabel={`Host ${item.name}`}
                          >
                            <Text style={styles.hostBtnText}>{'Host ▶︎'}</Text>
                          </Pressable>
                        </>
                      )}
                    </View>
                  )}
                  {editMode && (
                    <Pressable
                      onPress={() => handleDelete(item)}
                      style={styles.deleteBtn}
                      accessibilityRole="button"
                      accessibilityLabel={`Delete ${item.name}`}
                    >
                      <Text style={styles.deleteBtnText}>✕</Text>
                    </Pressable>
                  )}
                </View>
              </View>
            );
          }}
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
  headerBtn:      { paddingHorizontal: Spacing.sm },
  headerBtnText:  { color: Colors.melon, fontFamily: FontFamily.heading, fontSize: FontSize.md, fontWeight: FontWeight.bold },
  listGap:        { height: Spacing.md },
  list:           { gap: Spacing.sm, paddingBottom: Spacing.lg },
  cardShadowWrap: { position: 'relative' },
  cardShadow:     { position: 'absolute', top: 4, left: 4, right: -4, bottom: -4, borderRadius: BorderRadius.md, backgroundColor: Colors.ink },
  card:           { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.cream, borderRadius: BorderRadius.md, borderWidth: 2.5, borderColor: Colors.ink, overflow: 'hidden' },
  cardActive:     { backgroundColor: Colors.mint },
  cardMain:       { flex: 1, flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, padding: Spacing.sm },
  pressed:        { opacity: 0.7 },
  tile:           { width: 50, height: 50, borderRadius: BorderRadius.sm, borderWidth: 2.5, borderColor: Colors.ink, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  tileText:       { fontFamily: FontFamily.display, fontSize: FontSize.xl, fontWeight: FontWeight.black },
  cardText:       { flex: 1, gap: 2, minWidth: 0 },
  cardName:       { fontFamily: FontFamily.heading, color: Colors.ink, fontSize: FontSize.md, fontWeight: FontWeight.bold },
  cardMeta:       { color: Colors.ink, fontSize: FontSize.xs, fontWeight: FontWeight.black, letterSpacing: 0.5, opacity: 0.6 },
  chevron:        { color: Colors.textDisabled, fontSize: FontSize.xl, paddingRight: Spacing.xs },
  answersBtn:     { padding: '8px 12px' as unknown as number, paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs, borderRadius: BorderRadius.pill, backgroundColor: Colors.cream, borderWidth: 2, borderColor: Colors.ink },
  answersBtnText: { fontFamily: FontFamily.body, color: Colors.ink, fontSize: FontSize.xs, fontWeight: FontWeight.black, letterSpacing: 0.5 },
  hostBtn:        { paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs, borderRadius: BorderRadius.pill, backgroundColor: Colors.melon, borderWidth: 2, borderColor: Colors.ink, shadowColor: Colors.ink, shadowOffset: { width: 2, height: 2 }, shadowOpacity: 1, shadowRadius: 0, elevation: 2 },
  hostBtnText:    { fontFamily: FontFamily.body, color: Colors.cream, fontSize: FontSize.xs, fontWeight: FontWeight.black, letterSpacing: 0.5 },
  rejoinBtn:      { paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs, borderRadius: BorderRadius.pill, backgroundColor: Colors.ink, borderWidth: 2, borderColor: Colors.ink },
  rejoinText:     { fontFamily: FontFamily.body, color: Colors.cream, fontSize: FontSize.xs, fontWeight: FontWeight.black, letterSpacing: 0.5 },
  deleteBtn:      { padding: Spacing.md, borderLeftWidth: 1.5, borderLeftColor: Colors.ink + '33' },
  deleteBtnText:  { color: Colors.melon, fontSize: FontSize.md },
});
