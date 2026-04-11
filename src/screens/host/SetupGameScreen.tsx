import { StyleSheet, View, Text, FlatList, Pressable } from 'react-native';
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
import { EmptyState } from '../../components/EmptyState';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { Divider } from '../../components/Divider';

type Nav = NativeStackNavigationProp<HostStackParamList>;

export default function SetupGameScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const { questionnaires, loading, error } = useQuestionnaires();

  function handleSelect(q: Questionnaire): void {
    navigation.navigate('RoundsBuilder', { questionnaireId: q.id });
  }

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>Host a Game</Text>
        <Text style={styles.subtitle}>Choose a questionnaire</Text>
      </View>

      <Button
        label="Create New Questionnaire"
        onPress={() => navigation.navigate('QuestionnaireBuilder', {})}
        variant="secondary"
      />

      <Divider />

      {loading && <LoadingSpinner message="Loading…" />}
      {error !== null && <ErrorMessage message={error} />}
      {!loading && questionnaires.length === 0 && (
        <EmptyState title="No questionnaires saved" message="Create one above to get started." />
      )}
      {!loading && questionnaires.length > 0 && (
        <FlatList
          data={questionnaires}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <Divider spacing={0} />}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handleSelect(item)}
              style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
              accessibilityRole="button"
              accessibilityLabel={`Use ${item.name}`}
            >
              <View style={styles.rowText}>
                <Text style={styles.rowName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.rowMeta}>{item.questions.length} questions</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
          )}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header:     { paddingVertical: Spacing.lg, gap: Spacing.xs },
  title:      { color: Colors.textPrimary, fontSize: FontSize.xxl, fontWeight: FontWeight.black },
  subtitle:   { color: Colors.textSecondary, fontSize: FontSize.md },
  row:        { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md, gap: Spacing.sm },
  rowPressed: { opacity: 0.7 },
  rowText:    { flex: 1, gap: Spacing.xs },
  rowName:    { color: Colors.textPrimary, fontSize: FontSize.md, fontWeight: FontWeight.medium },
  rowMeta:    { color: Colors.textSecondary, fontSize: FontSize.sm },
  chevron:    { color: Colors.textDisabled, fontSize: FontSize.xl },
});
