import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { FontSize, FontWeight, FontFamily } from '../constants/typography';
import { Spacing, BorderRadius } from '../constants/spacing';
import { GamePhase } from '../constants/gameConstants';
import { RootStackParamList } from '../types/navigation';
import { useGameContext } from '../context/GameContext';
import { loadHostSession, clearHostSession, type HostSession } from '../lib/hostSession';
import { Button } from '../components/Button';
import { Sparkle } from '../components/brand/Sparkle';
import { Monogram } from '../components/brand/Monogram';
import { StickerCard } from '../components/brand/StickerCard';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const STRIPE_WIDTH = SCREEN_WIDTH * 2.2;

const STRIPES = [
  { top: 60,  bg: Colors.sun,   textColor: Colors.ink,   text: 'BLIND TASTER ✦' },
  { top: 150, bg: Colors.mint,  textColor: Colors.ink,   text: 'SIP SCORE SCANDAL ✦' },
  { top: 240, bg: Colors.melon, textColor: Colors.cream, text: 'BLIND TASTER ✦' },
  { top: 560, bg: Colors.ocean, textColor: Colors.cream, text: 'SNIFF SWIRL SETTLE ✦' },
  { top: 650, bg: Colors.sun,   textColor: Colors.ink,   text: 'BLIND TASTER ✦' },
] as const;

export default function HomeScreen(): React.ReactElement {
  const navigation        = useNavigation<Nav>();
  const { state, leaveGame } = useGameContext();
  const [savedHostSession, setSavedHostSession] = useState<HostSession | null>(null);

  useEffect(() => {
    loadHostSession().then(setSavedHostSession);
  }, []);

  const phase          = state.gameState?.phase;
  const activePhase    = phase !== undefined && phase !== GamePhase.GameOver;
  const isActivePlayer = state.localPlayerId !== null && activePhase && !state.isKicked;
  const isActiveHost   = state.localPlayerId === null && activePhase;
  const hasActiveGame  = isActiveHost || isActivePlayer;

  function handleRejoin(): void {
    if (isActiveHost && savedHostSession) {
      navigation.dispatch(CommonActions.reset({ index: 1, routes: [
        { name: 'Home' },
        { name: 'Host', state: { routes: [{ name: 'HostGame', params: {
          questionnaireId: savedHostSession.questionnaireId,
          rounds:          savedHostSession.rounds,
          savedRoomCode:   savedHostSession.roomCode,
        } }] } },
      ] }));
    } else if (isActivePlayer) {
      navigation.dispatch(CommonActions.reset({ index: 1, routes: [
        { name: 'Home' },
        { name: 'Player', state: { routes: [{ name: 'PlayerGame', params: {} }] } },
      ] }));
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Diagonal tickertape stripes */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {STRIPES.map((stripe, i) => (
          <View
            key={i}
            style={[
              styles.stripe,
              {
                top:             stripe.top,
                width:           STRIPE_WIDTH,
                backgroundColor: stripe.bg,
              },
            ]}
          >
            <Text style={[styles.stripeText, { color: stripe.textColor }]} numberOfLines={1}>
              {Array(12).fill(stripe.text).join('   ')}
            </Text>
          </View>
        ))}
      </View>

      {/* Corner sparkles */}
      <View style={styles.sparkleTopRight} pointerEvents="none">
        <Sparkle size={40} color={Colors.sun} />
      </View>
      <View style={styles.sparkleBottomLeft} pointerEvents="none">
        <Sparkle size={28} color={Colors.mint} />
      </View>

      {/* Center sticker card */}
      <View style={styles.centerContainer}>
        <StickerCard shadowOffset={8} borderRadius={32} style={styles.card}>
          <View style={styles.cardInner}>
            <Monogram size={90} />

            <View style={styles.wordmark}>
              <Text style={styles.wordmarkLine}>Blind</Text>
              <Text style={styles.wordmarkLine}>Taster</Text>
            </View>

            <View style={styles.taglinePill}>
              <Text style={styles.tagline}>Sniff · Swirl · Settle the Score</Text>
            </View>

            <View style={styles.actions}>
              {hasActiveGame && (
                <Button
                  label="Rejoin Game"
                  onPress={handleRejoin}
                  style={styles.actionButton}
                />
              )}
              <Button
                label="Host a Game"
                onPress={() => { leaveGame(); void clearHostSession(); navigation.dispatch(CommonActions.reset({ index: 1, routes: [{ name: 'Home' }, { name: 'Host', state: { routes: [{ name: 'SetupGame' }] } }] })); }}
                style={styles.actionButton}
                variant={hasActiveGame ? 'secondary' : 'primary'}
              />
              <Button
                label="Join a Game"
                onPress={() => { leaveGame(); void clearHostSession(); navigation.dispatch(CommonActions.reset({ index: 1, routes: [{ name: 'Home' }, { name: 'Player', state: { routes: [{ name: 'PlayerGame', params: {} }] } }] })); }}
                variant="secondary"
                style={styles.actionButton}
              />
            </View>
          </View>
        </StickerCard>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex:            1,
    backgroundColor: Colors.plum,
  },
  stripe: {
    position:       'absolute',
    left:           -40,
    height:         66,
    transform:      [{ rotate: '-12deg' }],
    justifyContent: 'center',
    overflow:       'hidden',
  },
  stripeText: {
    fontFamily:   FontFamily.display,
    fontSize:     FontSize.banner,
    fontWeight:   FontWeight.black,
    letterSpacing: 2,
    lineHeight:    40,
  },
  sparkleTopRight: {
    position: 'absolute',
    top:      36,
    right:    28,
  },
  sparkleBottomLeft: {
    position: 'absolute',
    bottom:   52,
    left:     28,
  },
  centerContainer: {
    flex:           1,
    alignItems:     'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    transform:      [{ rotate: '-3deg' }],
  },
  card: {
    width: '100%',
    maxWidth: 340,
  },
  cardInner: {
    padding:    28,
    paddingBottom: 24,
    alignItems: 'center',
    gap:        Spacing.md,
  },
  wordmark: {
    alignItems:  'center',
    marginTop:   Spacing.xs,
    gap:         -2,
  },
  wordmarkLine: {
    fontFamily:   FontFamily.display,
    fontSize:     FontSize.xxl + 8,
    fontWeight:   FontWeight.black,
    color:        Colors.ink,
    letterSpacing: -0.5,
    lineHeight:   FontSize.xxl + 10,
    textTransform: 'uppercase',
  },
  taglinePill: {
    paddingHorizontal: Spacing.md,
    paddingVertical:   Spacing.xs,
    backgroundColor:   Colors.background,
    borderRadius:      BorderRadius.pill,
    borderWidth:       2,
    borderColor:       Colors.ink,
  },
  tagline: {
    fontFamily:   FontFamily.body,
    color:        Colors.textSecondary,
    fontSize:     FontSize.sm,
    fontWeight:   FontWeight.black,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  actions: {
    width: '100%',
    gap:   Spacing.md,
    marginTop: Spacing.xs,
  },
  actionButton: {
    width: '100%',
  },
});
