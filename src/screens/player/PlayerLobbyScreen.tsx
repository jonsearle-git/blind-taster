import { StyleSheet, View, Text, FlatList, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '../../components/Button';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight, FontFamily } from '../../constants/typography';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { GamePhase } from '../../constants/gameConstants';
import { PlayerStackParamList } from '../../types/navigation';
import { useGameContext } from '../../context/GameContext';
import { PlayerRow } from '../../components/PlayerRow';
import { KickedOverlay } from '../../components/KickedOverlay';
import { GamePausedOverlay } from '../../components/GamePausedOverlay';
import { Sparkle } from '../../components/brand/Sparkle';
import { StickerCard } from '../../components/brand/StickerCard';

import { RootStackParamList } from '../../types/navigation';

type Nav = NativeStackNavigationProp<PlayerStackParamList & RootStackParamList>;

export default function PlayerLobbyScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const { state, dispatch }  = useGameContext();

  function handleLeave(): void {
    dispatch({ type: 'RESET' });
    navigation.getParent()?.navigate('Home');
  }

  const players  = state.gameState?.players ?? [];
  const roomCode = state.gameState?.roomCode ?? '';

  useEffect(() => {
    if (state.gameState?.phase === GamePhase.InRound) {
      navigation.navigate('PlayerRound');
    }
  }, [state.gameState?.phase, navigation]);

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={[Colors.sun, Colors.melon]} style={styles.gradient}>
        {/* Decorative sparkles */}
        <View style={styles.sparkle1} pointerEvents="none">
          <Sparkle size={28} color={Colors.cream} />
        </View>
        <View style={styles.sparkle2} pointerEvents="none">
          <Sparkle size={18} color={Colors.ink} />
        </View>

        {/* Room code */}
        <View style={styles.header}>
          <Text style={styles.codeLabel}>Room code</Text>
          {roomCode.length > 0 && (
            <StickerCard shadowOffset={5} borderRadius={16} style={styles.codeStickerWrapper}>
              <Text style={styles.codeText}>{roomCode}</Text>
            </StickerCard>
          )}
          <View style={styles.waitingRow}>
            <ActivityIndicator size="small" color={Colors.ink} />
            <Text style={styles.waitingText}>Waiting for host…</Text>
          </View>
        </View>

        {/* Player list */}
        <View style={styles.crewSection}>
          <Text style={styles.sectionLabel}>The crew ({players.length})</Text>

          <FlatList
            data={players}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.playerList}
            renderItem={({ item, index }) => (
              <PlayerRow player={item} index={index} />
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No other players yet.</Text>
            }
          />
        </View>

        <View style={styles.footer}>
          <Button
            label="Leave Game"
            onPress={handleLeave}
            variant="secondary"
            style={styles.leaveButton}
          />
        </View>
      </LinearGradient>

      <KickedOverlay visible={state.isKicked} />
      <GamePausedOverlay visible={state.isPaused} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex:            1,
    backgroundColor: Colors.sun,
  },
  gradient: {
    flex: 1,
  },
  sparkle1: {
    position: 'absolute',
    top:      80,
    right:    28,
  },
  sparkle2: {
    position: 'absolute',
    top:      150,
    left:     24,
  },
  header: {
    paddingTop:  Spacing.xl,
    paddingHorizontal: Spacing.lg,
    alignItems:  'center',
    gap:         Spacing.sm,
  },
  codeLabel: {
    fontFamily:   FontFamily.body,
    fontSize:     FontSize.xs,
    fontWeight:   FontWeight.black,
    color:        Colors.ink,
    letterSpacing: 3,
    textTransform: 'uppercase',
    opacity:       0.7,
  },
  codeStickerWrapper: {
    alignSelf: 'center',
  },
  codeText: {
    fontFamily:    FontFamily.display,
    fontSize:      42,
    fontWeight:    FontWeight.black,
    color:         Colors.ink,
    letterSpacing: 4,
    paddingHorizontal: Spacing.lg,
    paddingVertical:   Spacing.sm,
  },
  waitingRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           Spacing.sm,
    marginTop:     Spacing.xs,
  },
  waitingText: {
    fontFamily:   FontFamily.body,
    color:        Colors.ink,
    fontSize:     FontSize.sm,
    fontWeight:   FontWeight.bold,
    opacity:       0.75,
  },
  crewSection: {
    flex:    1,
    padding: Spacing.md,
    gap:     Spacing.sm,
    marginTop: Spacing.lg,
  },
  sectionLabel: {
    fontFamily:   FontFamily.heading,
    color:        Colors.ink,
    fontSize:     FontSize.lg,
    fontWeight:   FontWeight.black,
    letterSpacing: -0.2,
  },
  playerList: {
    gap: Spacing.sm,
  },
  emptyText: {
    fontFamily: FontFamily.body,
    color:      Colors.ink,
    fontSize:   FontSize.sm,
    textAlign:  'center',
    paddingVertical: Spacing.md,
    opacity:    0.65,
  },
  footer: {
    padding: Spacing.md,
  },
  leaveButton: {
    width: '100%',
  },
});
