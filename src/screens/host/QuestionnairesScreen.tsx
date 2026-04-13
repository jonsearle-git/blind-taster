import { StyleSheet, View, Text, FlatList, Pressable, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { HostStackParamList } from '../../types/navigation';
import { Questionnaire } from '../../types/questionnaire';
import { useQuestionnaires } from '../../hooks/useQuestionnaires';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Button } from '../../components/Button';
import { Divider } from '../../components/Divider';
import { EmptyState } from '../../components/EmptyState';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';

type Nav = NativeStackNavigationProp<HostStackParamList>;

export default function QuestionnairesScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const { questionnaires, loading, error, remove } = useQuestionnaires();

  function handleEdit(q: Questionnaire): void {
    navigation.navigate('QuestionnaireBuilder', { questionnaireId: q.id });
  }

  function handleDelete(q: Questionnaire): void {
    Alert.alert(
      'Delete Questionnaire',
      `Delete "${q.name}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => void remove(q.id) },
      ]
    );
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
          renderItem={({ item }) => (
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
                <Text style={styles.chevron}>›</Text>
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
          )}
        />
      )}
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
  deleteBtn:   { padding: Spacing.md },
  deleteText:  { color: Colors.error, fontSize: FontSize.md },
});
