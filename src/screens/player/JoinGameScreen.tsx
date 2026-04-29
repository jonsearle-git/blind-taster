import { StyleSheet, View, Text, KeyboardAvoidingView, Platform, ScrollView, Modal, Pressable } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight } from '../../constants/typography';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { GamePhase } from '../../constants/gameConstants';
import { PlayerStackParamList } from '../../types/navigation';
import { useGameContext } from '../../context/GameContext';
import { usePartySocket } from '../../hooks/usePartySocket';
import { useGameState } from '../../hooks/useGameState';
import { usePlayerActions } from '../../hooks/usePlayerActions';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Button } from '../../components/Button';
import { TextInput } from '../../components/TextInput';
import { ConfirmDialog } from '../../components/ConfirmDialog';

type Nav   = NativeStackNavigationProp<PlayerStackParamList>;
type Route = RouteProp<PlayerStackParamList, 'JoinGame'>;

function isActiveGame(phase: GamePhase | undefined): boolean {
  return phase !== undefined && phase !== GamePhase.Lobby && phase !== GamePhase.GameOver;
}

function extractRoomCode(data: string): string | null {
  // blindtaster://join/ROOMCODE
  const match = data.match(/join\/([A-Z0-9]{4,8})/i);
  return match ? match[1].toUpperCase() : null;
}

export default function JoinGameScreen(): React.ReactElement {
  const navigation  = useNavigation<Nav>();
  const route       = useRoute<Route>();

  const { state, sendRef, dispatch } = useGameContext();
  const { handleMessage }            = useGameState();
  const { requestJoin }              = usePlayerActions();
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [scanning, setScanning]               = useState(false);
  const [scanned, setScanned]                 = useState(false);
  const [permission, requestPermission]       = useCameraPermissions();

  const deepLinkCode      = route.params?.roomCode ?? '';
  const validatedDeepLink = /^[A-Z0-9]{4,8}$/i.test(deepLinkCode) ? deepLinkCode.toUpperCase() : '';

  const [roomCodeInput, setRoomCodeInput] = useState(validatedDeepLink);
  const [name, setName]                   = useState('');
  const [isDenied, setIsDenied]           = useState(false);
  const [isWaiting, setIsWaiting]         = useState(false);
  const [connectedRoomCode, setConnectedRoomCode] = useState('');
  const [roomCodeError, setRoomCodeError] = useState<string | undefined>(undefined);
  const [nameError, setNameError]         = useState<string | undefined>(undefined);
  const pendingJoinRef = useRef(false);

  const { send } = usePartySocket({
    roomCode:  connectedRoomCode,
    isHost:    false,
    onMessage: (msg) => {
      if (msg.type === 'name_taken') {
        setIsWaiting(false);
        setConnectedRoomCode('');
        setNameError('That name is already taken — pick another.');
      } else if (msg.type === 'you_were_denied') {
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

  useEffect(() => {
    if (state.localPlayerId) navigation.navigate('PlayerLobby');
  }, [state.localPlayerId, navigation]);

  const trimmedCode = roomCodeInput.trim();
  const trimmedName = name.trim();

  function doJoin(): void {
    dispatch({ type: 'RESET' });
    setIsDenied(false);
    setIsWaiting(true);
    pendingJoinRef.current = true;
    setConnectedRoomCode(trimmedCode);
  }

  function handleJoin(): void {
    if (isWaiting) return;
    const codeErr = trimmedCode.length < 4 ? 'Enter a room code (at least 4 characters).' : undefined;
    const nErr    = !trimmedName ? 'Enter your name.' : undefined;
    setRoomCodeError(codeErr);
    setNameError(nErr);
    if (codeErr || nErr) return;
    if (isActiveGame(state.gameState?.phase)) { setShowLeaveDialog(true); return; }
    doJoin();
  }

  async function handleScan(): Promise<void> {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) return;
    }
    setScanned(false);
    setScanning(true);
  }

  function handleBarcode({ data }: { data: string }): void {
    if (scanned) return;
    const code = extractRoomCode(data);
    if (!code) return;
    setScanned(true);
    setScanning(false);
    setRoomCodeInput(code);
    setIsDenied(false);
  }

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
          <View style={styles.fields}>
            <TextInput
              label="Room Code"
              value={roomCodeInput}
              error={roomCodeError}
              onChangeText={(t) => { setRoomCodeInput(t.toUpperCase()); setIsDenied(false); setIsWaiting(false); setRoomCodeError(undefined); }}
              placeholder="e.g. ABCD1234"
              autoCapitalize="characters"
              autoCorrect={false}
              maxLength={8}
            />
            <Button label="Scan QR Code" onPress={handleScan} variant="secondary" />

            <TextInput
              label="Your Name"
              value={name}
              error={isDenied ? 'You were not admitted into this game.' : nameError}
              onChangeText={(t) => { setName(t); setIsDenied(false); setNameError(undefined); }}
              placeholder="Enter your name"
              autoCapitalize="words"
              autoCorrect={false}
              maxLength={24}
            />

          </View>

          <Button
            label={isWaiting ? 'Waiting for host…' : 'Join Game'}
            onPress={handleJoin}
            loading={isWaiting}
            style={styles.button}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* QR Scanner Modal */}
      <Modal visible={scanning} animationType="slide" onRequestClose={() => setScanning(false)}>
        <View style={styles.scannerContainer}>
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            onBarcodeScanned={handleBarcode}
          />
          <View style={styles.scannerOverlay}>
            <View style={styles.scannerFrame} />
          </View>
          <Text style={styles.scannerHint}>Point at the room QR code</Text>
          <Pressable onPress={() => setScanning(false)} style={styles.scannerClose}>
            <Text style={styles.scannerCloseText}>Cancel</Text>
          </Pressable>
        </View>
      </Modal>

      <ConfirmDialog
        visible={showLeaveDialog}
        title="Already in a Game"
        message="You're currently in another game. Would you like to leave and join this one?"
        confirmLabel="Leave & Join"
        cancelLabel="Stay"
        destructive
        onConfirm={() => { setShowLeaveDialog(false); doJoin(); }}
        onCancel={() => setShowLeaveDialog(false)}
      />
    </ScreenContainer>
  );
}

const FRAME = 220;

const styles = StyleSheet.create({
  flex:       { flex: 1 },
  inner:      { flexGrow: 1, padding: Spacing.md, gap: Spacing.lg },
  fields:     { gap: Spacing.md },
  button:              { marginTop: 'auto' as unknown as number },
  scannerContainer:    { flex: 1, backgroundColor: Colors.ink },
  scannerOverlay:      { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scannerFrame:        {
    width:        FRAME,
    height:       FRAME,
    borderWidth:  3,
    borderColor:  Colors.cream,
    borderRadius: BorderRadius.lg,
  },
  scannerHint:      {
    position:   'absolute',
    bottom:     120,
    alignSelf:  'center',
    color:      Colors.cream,
    fontSize:   FontSize.md,
    fontWeight: FontWeight.bold,
  },
  scannerClose:     {
    position:          'absolute',
    bottom:            Spacing.xl,
    alignSelf:         'center',
    backgroundColor:   Colors.surface,
    paddingHorizontal: Spacing.xl,
    paddingVertical:   Spacing.sm,
    borderRadius:      BorderRadius.pill,
    borderWidth:       2.5,
    borderColor:       Colors.ink,
  },
  scannerCloseText: { color: Colors.ink, fontSize: FontSize.md, fontWeight: FontWeight.bold },
});
