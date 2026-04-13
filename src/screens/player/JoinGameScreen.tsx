import { StyleSheet, View, Text, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { GamePhase } from '../../constants/gameConstants';
import { PlayerStackParamList } from '../../types/navigation';
import { useGameContext } from '../../context/GameContext';
import { usePartySocket } from '../../hooks/usePartySocket';
import { useGameState } from '../../hooks/useGameState';
import { usePlayerActions } from '../../hooks/usePlayerActions';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Button } from '../../components/Button';
import { TextInput } from '../../components/TextInput';

type Nav   = NativeStackNavigationProp<PlayerStackParamList>;
type Route = RouteProp<PlayerStackParamList, 'JoinGame'>;

function isActiveGame(phase: GamePhase | undefined): boolean {
  return phase !== undefined && phase !== GamePhase.Lobby && phase !== GamePhase.GameOver;
}

export default function JoinGameScreen(): React.ReactElement {
  const navigation  = useNavigation<Nav>();
  const route       = useRoute<Route>();

  const { state, sendRef, dispatch } = useGameContext();
  const { handleMessage }            = useGameState();
  const { requestJoin }              = usePlayerActions();

  // M5: validate deep-link room code before use
  const deepLinkCode = route.params?.roomCode ?? '';
  const validatedDeepLink = /^[A-Z0-9]{4,8}$/i.test(deepLinkCode) ? deepLinkCode.toUpperCase() : '';

  const [roomCodeInput, setRoomCodeInput] = useState(validatedDeepLink);
  const [name, setName]                   = useState('');
  const [isDenied, setIsDenied]           = useState(false);
  const [isWaiting, setIsWaiting]         = useState(false);

  // connectedRoomCode is only set when the user presses Join — not on every keystroke.
  const [connectedRoomCode, setConnectedRoomCode] = useState('');

  // After the socket connects, send the join request once.
  const pendingJoinRef = useRef(false);

  const { send } = usePartySocket({
    roomCode:  connectedRoomCode,
    isHost:    false,
    onMessage: (msg) => {
      if (msg.type === 'you_were_denied') {
        setIsWaiting(false);
        setIsDenied(true);
        setConnectedRoomCode('');
        dispatch({ type: 'RESET' });
      } else {
        handleMessage(msg);
      }
    },
    onOpen: () => {
      if (pendingJoinRef.current) {
        pendingJoinRef.current = false;
        requestJoin(name.trim());
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

  const trimmedCode = roomCodeInput.trim();
  const trimmedName = name.trim();
  const canSubmit   = trimmedCode.length >= 4 && trimmedName.length > 0 && !isWaiting;

  function doJoin(): void {
    dispatch({ type: 'RESET' });
    setIsDenied(false);
    setIsWaiting(true);
    pendingJoinRef.current = true;
    setConnectedRoomCode(trimmedCode);
  }

  function handleJoin(): void {
    if (!canSubmit) return;

    // Already in an active game — ask before leaving
    if (isActiveGame(state.gameState?.phase)) {
      Alert.alert(
        'Already in a Game',
        "You're currently in another game. Would you like to leave that game and join this one?",
        [
          { text: 'Stay in Current Game', style: 'cancel' },
          { text: 'Leave & Join New Game', style: 'destructive', onPress: doJoin },
        ]
      );
      return;
    }

    doJoin();
  }

  return (
    <ScreenContainer>
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
              value={roomCodeInput}
              onChangeText={(t) => { setRoomCodeInput(t.toUpperCase()); setIsDenied(false); setIsWaiting(false); }}
              placeholder="e.g. ABCD1234"
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
                <Text style={styles.deniedText}>You were not admitted into this game.</Text>
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
