import { StyleSheet, View, Text, FlatList, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight, FontFamily } from '../../constants/typography';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { HostStackParamList } from '../../types/navigation';
import { useQuestionnaires } from '../../hooks/useQuestionnaires';
import { ScreenContainer } from '../../components/ScreenContainer';
import { EmptyState } from '../../components/EmptyState';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';

type Nav = NativeStackNavigationProp<HostStackParamList>;

const TILE_COLORS = [Colors.sun, Colors.melon, Colors.mint, Colors.plum, Colors.ocean, Colors.sun, Colors.melon, Colors.mint];
const TILE_TEXT   = [Colors.ink, Colors.cream, Colors.ink, Colors.cream, Colors.cream, Colors.ink, Colors.cream, Colors.ink];

export default function QuestionnairesScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const { questionnaires, loading, error } = useQuestionnaires();

  return (
    <ScreenContainer>
      {loading && <LoadingSpinner message="Loading…" />}
      {error !== null && <ErrorMessage message={error} />}
      {!loading && questionnaires.length === 0 && (
        <EmptyState title="No questionnaires" message="No questionnaires available." />
      )}
      {!loading && questionnaires.length > 0 && (
        <FlatList
          data={questionnaires}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          numColumns={2}
          columnWrapperStyle={styles.row}
          renderItem={({ item, index }) => {
            const bg     = TILE_COLORS[index % TILE_COLORS.length];
            const text   = TILE_TEXT[index % TILE_TEXT.length];
            const angles = ['-2deg', '1.5deg', '-1deg', '2.5deg', '1deg', '-2.5deg', '2deg', '-1.5deg'];
            const rotate = angles[index % angles.length];
            return (
              <View style={[styles.tileShadowWrap, { transform: [{ rotate }] }]}>
                <View style={styles.tileShadow} />
                <Pressable
                  onPress={() => navigation.navigate('QuestionPicker', { questionnaireId: item.id })}
                  style={({ pressed }) => [styles.tile, { backgroundColor: bg }, pressed && styles.pressed]}
                  accessibilityRole="button"
                  accessibilityLabel={`Use ${item.name}`}
                >
                  <Text style={[styles.tileName, { color: text }]} numberOfLines={2}>{item.name}</Text>
                </Pressable>
              </View>
            );
          }}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list:          { gap: Spacing.md, paddingTop: Spacing.md, paddingBottom: Spacing.lg, paddingRight: 5 },
  row:           { gap: Spacing.md },
  tileShadowWrap:{ flex: 1, position: 'relative', overflow: 'visible' as const },
  tileShadow:    { position: 'absolute', top: 5, left: 5, right: -5, bottom: -5, borderRadius: BorderRadius.lg, backgroundColor: Colors.ink },
  tile:          { flex: 1, borderRadius: BorderRadius.lg, borderWidth: 2.5, borderColor: Colors.ink, padding: Spacing.md, minHeight: 120, alignItems: 'center', justifyContent: 'center' },
  pressed:       { opacity: 0.8 },
  tileName:      { fontFamily: FontFamily.display, fontSize: FontSize.xxl, fontWeight: FontWeight.black, letterSpacing: -0.5, lineHeight: FontSize.xxl * 1.1, textAlign: 'center' },
  tileMeta:      { fontFamily: FontFamily.body, fontSize: FontSize.xs, fontWeight: FontWeight.black, letterSpacing: 1.5, textTransform: 'uppercase', opacity: 0.75 },
});
