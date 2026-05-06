import { StyleSheet, View, Text, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../constants/colors';
import { FontSize, FontWeight } from '../constants/typography';
import { Spacing, BorderRadius } from '../constants/spacing';
import { useGameContext } from '../context/GameContext';
import { Button } from './Button';
import { RootStackParamList } from '../types/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;

type Props = {
  visible: boolean;
  title?:  string;
  message?: string;
};

export function KickedOverlay({ visible, title = 'Removed from Game', message = 'You have been removed from this game by the host.' }: Props): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const { dispatch } = useGameContext();

  function handleBackToMenu(): void {
    dispatch({ type: 'RESET' });
    navigation.navigate('Home');
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <Button label="Back to Menu" onPress={handleBackToMenu} style={styles.button} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:            1,
    backgroundColor: Colors.overlay,
    alignItems:      'center',
    justifyContent:  'center',
    padding:         Spacing.xl,
  },
  card: {
    width:           '100%',
    backgroundColor: Colors.surface,
    borderRadius:    BorderRadius.xl,
    padding:         Spacing.xl,
    alignItems:      'center',
    gap:             Spacing.md,
    borderWidth:     2.5,
    borderColor:     Colors.border,
  },
  title: {
    color:      Colors.textPrimary,
    fontSize:   FontSize.xl,
    fontWeight: FontWeight.bold,
    textAlign:  'center',
  },
  message: {
    color:     Colors.textSecondary,
    fontSize:  FontSize.md,
    textAlign: 'center',
  },
  button: {
    width: '100%',
  },
});
