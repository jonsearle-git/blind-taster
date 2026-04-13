import { StyleSheet, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { FontSize, FontWeight } from '../constants/typography';
import { Spacing } from '../constants/spacing';
import { RootStackParamList } from '../types/navigation';
import { Button } from '../components/Button';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();

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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: Colors.background },
  container:    { flex: 1, padding: Spacing.lg, justifyContent: 'center', gap: Spacing.xl },
  hero:         { alignItems: 'center', gap: Spacing.sm },
  title:        { color: Colors.textPrimary, fontSize: FontSize.hero, fontWeight: FontWeight.black, letterSpacing: -1 },
  subtitle:     { color: Colors.textSecondary, fontSize: FontSize.md },
  actions:      { gap: Spacing.sm },
  actionButton: { width: '100%' },
});
