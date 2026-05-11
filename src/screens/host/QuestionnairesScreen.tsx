import { StyleSheet, View, Text, FlatList, Pressable } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { HostStackParamList } from '../../types/navigation';
import { Questionnaire } from '../../types/questionnaire';
import { useQuestionnaires } from '../../hooks/useQuestionnaires';
import { useGames } from '../../hooks/useGames';
import { questionnaireHasGames } from '../../lib/games';
import { cloneQuestionnaire, generateCopyName } from '../../lib/questionnaires';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Button } from '../../components/Button';
import { Divider } from '../../components/Divider';
import { EmptyState } from '../../components/EmptyState';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { ConfirmDialog } from '../../components/ConfirmDialog';

type Nav = NativeStackNavigationProp<HostStackParamList>;

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

      <Divider />

      {loading && <LoadingSpinner message="Loading…" />}
      {error !== null && <ErrorMessage message={error} />}
      {!loading && questionnaires.length === 0 && (
        <EmptyState title="No questionnaires" message="Create one above to get started." />
      )}
      {!loading && questionnaires.length > 0 && (
        <FlatList
          data={questionnaires}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <Divider spacing={0} />}
          renderItem={({ item }) => {
            const locked = questionnaireHasGames(item.id, games);
            return (
              <View style={styles.row}>
                <Pressable
                  onPress={() => handleEdit(item)}
                  style={({ pressed }) => [styles.rowMain, pressed && styles.rowPressed]}
                  accessibilityRole="button"
                  accessibilityLabel={`Edit ${item.name}`}
                >
                  <View style={styles.rowText}>
                    <Text style={styles.rowName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.rowMeta}>{item.questions.length} questions</Text>
                  </View>
                  <Text style={styles.chevron}>{locked ? '🔒' : '›'}</Text>
                </Pressable>
                <Pressable
                  onPress={() => setDuplicateDialog(item)}
                  style={styles.actionBtn}
                  accessibilityRole="button"
                  accessibilityLabel={`Duplicate ${item.name}`}
                >
                  <Text style={styles.actionText}>⧉</Text>
                </Pressable>
                <Pressable
                  onPress={() => handleDelete(item)}
                  style={styles.deleteBtn}
                  accessibilityRole="button"
                  accessibilityLabel={`Delete ${item.name}`}
                >
                  <Text style={styles.deleteText}>✕</Text>
                </Pressable>
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
        title="Questionnaire locked"
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
  row:         { flexDirection: 'row', alignItems: 'center' },
  rowMain:     { flex: 1, flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md, gap: Spacing.sm },
  rowPressed:  { opacity: 0.7 },
  rowText:     { flex: 1, gap: Spacing.xs },
  rowName:     { color: Colors.textPrimary, fontSize: FontSize.md, fontWeight: FontWeight.medium },
  rowMeta:     { color: Colors.textSecondary, fontSize: FontSize.sm },
  chevron:     { color: Colors.textDisabled, fontSize: FontSize.xl },
  actionBtn:   { padding: Spacing.md },
  actionText:  { color: Colors.textSecondary, fontSize: FontSize.lg },
  deleteBtn:   { padding: Spacing.md },
  deleteText:  { color: Colors.error, fontSize: FontSize.md },
});
