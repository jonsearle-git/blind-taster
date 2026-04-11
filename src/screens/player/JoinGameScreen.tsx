import { StyleSheet, View, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { PlayerStackParamList } from '../../types/navigation';
import { useGameContext } from '../../context/GameContext';
import { usePartySocket } from '../../hooks/usePartySocket';
import { useGameState } from '../../hooks/useGameState';
import { usePlayerActions } from '../../hooks/usePlayerActions';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Banner } from '../../components/Banner';
import { Button } from '../../components/Button';
import { TextInput } from '../../components/TextInput';

type Nav   = NativeStackNavigationProp<PlayerStackParamList>;
type Route = RouteProp<PlayerStackParamList, 'JoinGame'>;

export default function JoinGameScreen(): React.ReactElement {
  const navigation  = useNavigation<Nav>();
  const route       = useRoute<Route>();

  const { state, sendRef, dispatch } = useGameContext();
  const { handleMessage }            = useGameState();
  const { requestJoin }              = usePlayerActions();

  const [roomCode, setRoomCode]   = useState(route.params?.roomCode ?? '');
  const [name, setName]           = useState('');
  const [isDenied, setIsDenied]   = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  const { send } = usePartySocket({
    roomCode,
    isHost:    false,
    onMessage: (msg) => {
      if (msg.type === 'you_were_denied') {
        setIsWaiting(false);
        setIsDenied(true);
        dispatch({ type: 'RESET' });
      } else {
        handleMessage(msg);
      }
    },
  });

  useEffect(() => {
    sendRef.current = send;
    return () => { sendRef.current = null; };
  }, [send, sendRef]);

  // Navigate to lobby once admitted
  useEffect(() => {
    if (state.localPlayerId) {
      navigation.navigate('PlayerLobby');
    }
  }, [state.localPlayerId, navigation]);

  const canSubmit = roomCode.trim().length > 0 && name.trim().length > 0 && !isWaiting;

  function handleJoin(): void {
    if (!canSubmit) return;
    setIsDenied(false);
    setIsWaiting(true);
    requestJoin(name.trim());
  }

  return (
    <ScreenContainer noPadding>
      <Banner title="Join Game" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.inner}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.fields}>
            <TextInput
              label="Room Code"
              value={roomCode}
              onChangeText={(t) => { setRoomCode(t.toUpperCase()); setIsDenied(false); setIsWaiting(false); }}
              placeholder="e.g. ABCD12"
              autoCapitalize="characters"
              autoCorrect={false}
              maxLength={8}
            />

            <TextInput
              label="Your Name"
              value={name}
              onChangeText={(t) => { setName(t); setIsDenied(false); }}
              placeholder="Enter your name"
              autoCapitalize="words"
              autoCorrect={false}
              maxLength={24}
            />

            {isDenied && (
              <View style={styles.deniedCard}>
                <Text style={styles.deniedText}>You were not admitted into the game.</Text>
              </View>
            )}
          </View>

          <Button
            label={isWaiting ? 'Waiting for host…' : 'Join Game'}
            onPress={handleJoin}
            disabled={!canSubmit}
            loading={isWaiting}
            style={styles.button}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex:       { flex: 1 },
  inner:      { flexGrow: 1, padding: Spacing.md, gap: Spacing.lg },
  fields:     { gap: Spacing.md },
  deniedCard: {
    backgroundColor: Colors.surface,
    borderLeftWidth: 3,
    borderLeftColor: Colors.error,
    borderRadius:    Spacing.xs,
    padding:         Spacing.md,
  },
  deniedText: { color: Colors.error, fontSize: FontSize.sm, fontWeight: FontWeight.medium },
  button:     { marginTop: 'auto' as unknown as number },
});
