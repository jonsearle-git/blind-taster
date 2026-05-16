import { StyleSheet, View, Text, FlatList, Pressable } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight, FontFamily } from '../../constants/typography';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { HostStackParamList } from '../../types/navigation';
import { Questionnaire } from '../../types/questionnaire';
import { useQuestionnaires } from '../../hooks/useQuestionnaires';
import { useGames } from '../../hooks/useGames';
import { questionnaireHasGames } from '../../lib/games';
import { cloneQuestionnaire, generateCopyName } from '../../lib/questionnaires';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { ConfirmDialog } from '../../components/ConfirmDialog';

type Nav = NativeStackNavigationProp<HostStackParamList>;

const TILE_COLORS = [Colors.sun, Colors.melon, Colors.mint, Colors.plum, Colors.ocean, Colors.sun, Colors.melon, Colors.mint];
const TILE_TEXT   = [Colors.ink, Colors.cream, Colors.ink, Colors.cream, Colors.cream, Colors.ink, Colors.cream, Colors.ink];

export default function QuestionnairesScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const { questionnaires, loading, error, save, remove } = useQuestionnaires();
  const { games, remove: removeGame }                    = useGames();
  const [dialog, setDialog]                        = useState<{ q: Questionnaire; affectedGames: ReturnType<typeof games.filter> } | null>(null);
  const [lockedDialog, setLockedDialog]            = useState<{ q: Questionnaire; count: number } | null>(null);
  const [duplicateDialog, setDuplicateDialog]      = useState<Questionnaire | null>(null);

  function handleEdit(q: Questionnaire): void {
    const count = games.filter((g) => g.questionnaireId === q.id).length;
    if (count > 0) { setLockedDialog({ q, count }); return; }
    navigation.navigate('QuestionnaireBuilder', { questionnaireId: q.id });
  }

  function handleDelete(q: Questionnaire): void {
    setDialog({ q, affectedGames: games.filter((g) => g.questionnaireId === q.id) });
  }

  async function confirmDuplicate(): Promise<void> {
    if (!duplicateDialog) return;
    const q = duplicateDialog;
    setDuplicateDialog(null);
    const name = generateCopyName(q.name, questionnaires);
    await save(cloneQuestionnaire(q, name));
  }

  async function confirmDelete(): Promise<void> {
    if (!dialog) return;
    setDialog(null);
    for (const g of dialog.affectedGames) await removeGame(g.id);
    await remove(dialog.q.id);
  }

  return (
    <ScreenContainer>
      <Button
        label="+ Create New Questionnaire"
        onPress={() => navigation.navigate('QuestionnaireBuilder', {})}
        variant="secondary"
      />

      <View style={styles.listGap} />

      {loading && <LoadingSpinner message="Loading…" />}
      {error !== null && <ErrorMessage message={error} />}
      {!loading && questionnaires.length === 0 && (
        <EmptyState title="No questionnaires" message="Create one above to get started." />
      )}
      {!loading && questionnaires.length > 0 && (
        <FlatList
          data={questionnaires}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item, index }) => {
            const locked    = questionnaireHasGames(item.id, games);
            const tileColor = TILE_COLORS[index % TILE_COLORS.length];
            const tileText  = TILE_TEXT[index % TILE_TEXT.length];
            return (
              <View style={styles.cardShadowWrap}>
                <View style={styles.cardShadow} />
                <View style={styles.card}>
                  <Pressable
                    onPress={() => handleEdit(item)}
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
                        {item.questions.length} questions{locked ? ' · Locked 🔒' : ''}
                      </Text>
                    </View>
                    <Text style={styles.chevron}>›</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setDuplicateDialog(item)}
                    style={styles.iconBtn}
                    accessibilityRole="button"
                    accessibilityLabel={`Duplicate ${item.name}`}
                  >
                    <Text style={styles.iconBtnText}>⧉</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => handleDelete(item)}
                    style={styles.deleteBtn}
                    accessibilityRole="button"
                    accessibilityLabel={`Delete ${item.name}`}
                  >
                    <Text style={styles.deleteBtnText}>✕</Text>
                  </Pressable>
                </View>
              </View>
            );
          }}
        />
      )}

      <ConfirmDialog
        visible={dialog !== null}
        title="Delete Questionnaire"
        message={dialog
          ? `Delete "${dialog.q.name}"? This cannot be undone.${dialog.affectedGames.length > 0 ? `\n\nThis will also delete ${dialog.affectedGames.length} saved game${dialog.affectedGames.length > 1 ? 's' : ''}: ${dialog.affectedGames.map((g) => `"${g.name}"`).join(', ')}.` : ''}`
          : ''}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        destructive
        onConfirm={() => void confirmDelete()}
        onCancel={() => setDialog(null)}
      />

      <ConfirmDialog
        visible={lockedDialog !== null}
        title="Questionnaire Locked"
        message={lockedDialog
          ? `"${lockedDialog.q.name}" can't be edited — ${lockedDialog.count} saved game${lockedDialog.count === 1 ? ' uses' : 's use'} it. Delete those games first, or duplicate this questionnaire.`
          : ''}
        confirmLabel="OK"
        onConfirm={() => setLockedDialog(null)}
      />

      <ConfirmDialog
        visible={duplicateDialog !== null}
        title="Duplicate Questionnaire"
        message={duplicateDialog ? `Create a copy of "${duplicateDialog.name}"?` : ''}
        confirmLabel="Copy"
        cancelLabel="Cancel"
        onConfirm={() => void confirmDuplicate()}
        onCancel={() => setDuplicateDialog(null)}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  listGap:        { height: Spacing.md },
  list:           { gap: Spacing.sm, paddingBottom: Spacing.lg },
  cardShadowWrap: { position: 'relative' },
  cardShadow:     { position: 'absolute', top: 4, left: 4, right: -4, bottom: -4, borderRadius: BorderRadius.md, backgroundColor: Colors.ink },
  card:           { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.cream, borderRadius: BorderRadius.md, borderWidth: 2.5, borderColor: Colors.ink, overflow: 'hidden' },
  cardMain:       { flex: 1, flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, padding: Spacing.sm },
  pressed:        { opacity: 0.7 },
  tile:           { width: 44, height: 44, borderRadius: BorderRadius.xs, borderWidth: 2, borderColor: Colors.ink, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  tileText:       { fontFamily: FontFamily.display, fontSize: FontSize.lg, fontWeight: FontWeight.black },
  cardText:       { flex: 1, gap: 2 },
  cardName:       { fontFamily: FontFamily.heading, color: Colors.ink, fontSize: FontSize.md, fontWeight: FontWeight.bold },
  cardMeta:       { color: Colors.ink, fontSize: FontSize.xs, fontWeight: FontWeight.black, letterSpacing: 1, textTransform: 'uppercase', opacity: 0.6 },
  chevron:        { color: Colors.textDisabled, fontSize: FontSize.xl, paddingRight: Spacing.xs },
  iconBtn:        { padding: Spacing.md, borderLeftWidth: 1.5, borderLeftColor: Colors.ink + '33' },
  iconBtnText:    { color: Colors.ink, fontSize: FontSize.lg, opacity: 0.7 },
  deleteBtn:      { padding: Spacing.md, borderLeftWidth: 1.5, borderLeftColor: Colors.ink + '33' },
  deleteBtnText:  { color: Colors.melon, fontSize: FontSize.md },
});
