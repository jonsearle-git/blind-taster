import { StyleSheet, View, Text } from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../../constants/colors';
import { FontSize } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { RoundPhase } from '../../constants/gameConstants';
import { HostStackParamList } from '../../types/navigation';
import { useGameContext } from '../../context/GameContext';
import { useHostControls } from '../../hooks/useHostControls';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Banner } from '../../components/Banner';
import { RoundBadge } from '../../components/RoundBadge';
import { PlayerStatusList } from '../../components/PlayerStatusList';
import { Button } from '../../components/Button';
import { GamePausedOverlay } from '../../components/GamePausedOverlay';
import { HostDropdown } from '../../components/HostDropdown';

type Nav = NativeStackNavigationProp<HostStackParamList>;

export default function HostRoundScreen(): React.ReactElement {
  const navigation             = useNavigation<Nav>();
  const { state }              = useGameContext();
  const [showMenu, setShowMenu] = useState(false);
  const { revealAnswers, advanceRound, endGame, kickPlayer } = useHostControls();

  const game         = state.gameState;
  const players      = game?.players ?? [];
  const currentRound = game?.currentRound ?? 1;
  const totalRounds  = game?.totalRounds ?? 1;
  const roundPhase   = game?.roundPhase ?? RoundPhase.Answering;
  const answeredIds  = state.answeredPlayerIds;
  const roomCode     = game?.roomCode ?? '';
  const isLastRound  = currentRound === totalRounds;

  useEffect(() => {
    if (state.gameResults) {
      navigation.navigate('HostResults', { results: state.gameResults });
    }
  }, [state.gameResults, navigation]);

  return (
    <ScreenContainer noPadding>
      <Banner title="Round" onHostMenuPress={() => setShowMenu(true)} />

      <View style={styles.inner}>
        <RoundBadge current={currentRound} total={totalRounds} />

        <Text style={styles.statusLabel}>
          {roundPhase === RoundPhase.Answering
            ? `${answeredIds.size} of ${players.length} answered`
            : roundPhase === RoundPhase.AllAnswered
            ? 'All players have answered'
            : 'Answers revealed'}
        </Text>

        <PlayerStatusList players={players} answeredIds={answeredIds} />

        <View style={styles.actions}>
          {roundPhase === RoundPhase.AllAnswered && (
            <Button label="Reveal Answers" onPress={revealAnswers} />
          )}
          {roundPhase === RoundPhase.AnswersRevealed && (
            <Button
              label={isLastRound ? 'End Game' : 'Next Round'}
              onPress={isLastRound ? endGame : advanceRound}
            />
          )}
        </View>
      </View>

      <GamePausedOverlay visible={state.isPaused} />

      <HostDropdown
        visible={showMenu}
        roomCode={roomCode}
        players={players}
        onClose={() => setShowMenu(false)}
        onKick={kickPlayer}
        onEndGame={endGame}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  inner:       { flex: 1, padding: Spacing.md, gap: Spacing.lg },
  statusLabel: { color: Colors.textSecondary, fontSize: FontSize.md, textAlign: 'center' },
  actions:     { marginTop: 'auto' as unknown as number, gap: Spacing.sm },
});
