import { StyleSheet, View, Text, FlatList, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { FontSize, FontWeight } from '../constants/typography';
import { Spacing } from '../constants/spacing';
import { RootStackParamList } from '../types/navigation';
import { Questionnaire } from '../types/questionnaire';
import { useQuestionnaires } from '../hooks/useQuestionnaires';
import { Button } from '../components/Button';
import { EmptyState } from '../components/EmptyState';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { Divider } from '../components/Divider';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const { questionnaires, loading, error } = useQuestionnaires();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.title}>Blind Taster</Text>
          <Text style={styles.subtitle}>The blind tasting quiz game</Text>
        </View>

        <View style={styles.actions}>
          <Button
            label="Host a Game"
            onPress={() => navigation.navigate('Host')}
            style={styles.actionButton}
          />
          <Button
            label="Join a Game"
            onPress={() => navigation.navigate('Player')}
            variant="secondary"
            style={styles.actionButton}
          />
        </View>

        <Divider />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Saved Questionnaires</Text>
          {loading && <LoadingSpinner />}
          {error !== null && <ErrorMessage message={error} />}
          {!loading && questionnaires.length === 0 && (
            <EmptyState title="No questionnaires yet" message="Host a game to create your first." />
          )}
          {!loading && questionnaires.length > 0 && (
            <FlatList
              data={questionnaires}
              keyExtractor={(item) => item.id}
              ItemSeparatorComponent={() => <Divider spacing={0} />}
              renderItem={({ item }) => <QuestionnaireItem questionnaire={item} />}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

function QuestionnaireItem({ questionnaire }: { questionnaire: Questionnaire }): React.ReactElement {
  return (
    <View style={styles.item}>
      <View style={styles.itemText}>
        <Text style={styles.itemName} numberOfLines={1}>{questionnaire.name}</Text>
        <Text style={styles.itemMeta}>{questionnaire.questions.length} questions</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: Colors.background },
  container:     { flex: 1, padding: Spacing.lg, gap: Spacing.lg },
  hero:          { alignItems: 'center', paddingVertical: Spacing.xl, gap: Spacing.sm },
  title:         { color: Colors.textPrimary, fontSize: FontSize.hero, fontWeight: FontWeight.black, letterSpacing: -1 },
  subtitle:      { color: Colors.textSecondary, fontSize: FontSize.md },
  actions:       { gap: Spacing.sm },
  actionButton:  { width: '100%' },
  section:       { flex: 1, gap: Spacing.sm },
  sectionTitle:  { color: Colors.textSecondary, fontSize: FontSize.sm, fontWeight: FontWeight.bold, textTransform: 'uppercase', letterSpacing: 1 },
  item:          { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md },
  itemText:      { flex: 1, gap: Spacing.xs },
  itemName:      { color: Colors.textPrimary, fontSize: FontSize.md, fontWeight: FontWeight.medium },
  itemMeta:      { color: Colors.textSecondary, fontSize: FontSize.sm },
});
