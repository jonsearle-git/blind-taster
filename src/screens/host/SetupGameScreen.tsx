import { StyleSheet, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { HostStackParamList } from '../../types/navigation';
import { Button } from '../../components/Button';

type Nav = NativeStackNavigationProp<HostStackParamList>;

export default function SetupGameScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.title}>Host a Game</Text>
          <Text style={styles.subtitle}>Manage your questionnaires and saved games</Text>
        </View>
        <View style={styles.actions}>
          <Button label="Questionnaires" onPress={() => navigation.navigate('Questionnaires')} />
          <Button label="Games" onPress={() => navigation.navigate('Games')} variant="secondary" />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:      { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, padding: Spacing.lg, justifyContent: 'center', gap: Spacing.xl },
  hero:      { alignItems: 'center', gap: Spacing.sm },
  title:     { color: Colors.textPrimary, fontSize: FontSize.xxl, fontWeight: FontWeight.black },
  subtitle:  { color: Colors.textSecondary, fontSize: FontSize.md, textAlign: 'center' },
  actions:   { gap: Spacing.sm },
});
