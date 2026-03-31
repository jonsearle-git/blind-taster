import React, { useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import { useGame } from '../../context/GameContext';
import { REVEAL_MODES, HOST_MODES } from '../../constants/gameConstants';
import COLORS from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '../../constants/typography';
import ScreenContainer from '../../components/ScreenContainer';
import TextInput from '../../components/TextInput';
import OptionPicker from '../../components/OptionPicker';
import Button from '../../components/Button';

const REVEAL_OPTIONS = [
  { label: 'After each question', value: REVEAL_MODES.AFTER_EACH_QUESTION },
  { label: 'All at the end', value: REVEAL_MODES.END_OF_GAME },
];

const HOST_MODE_OPTIONS = [
  { label: 'Host only', value: HOST_MODES.HOST_ONLY },
  { label: 'Host & player', value: HOST_MODES.HOST_AND_PLAYER },
];

export default function SetupGameScreen({ navigation }) {
  const { dispatch } = useGame();
  const [gameName, setGameName] = useState('');
  const [revealMode, setRevealMode] = useState(REVEAL_MODES.END_OF_GAME);
  const [hostMode, setHostMode] = useState(HOST_MODES.HOST_ONLY);
  const [nameError, setNameError] = useState('');

  function handleNext() {
    if (!gameName.trim()) {
      setNameError('Please enter a game name.');
      return;
    }
    setNameError('');
    dispatch({
      type: 'SET_GAME_CONFIG',
      payload: { gameName: gameName.trim(), revealMode, hostMode },
    });
    navigation.navigate('QuestionnaireBuilder');
  }

  return (
    <ScreenContainer>
      <Text style={styles.heading}>Game Setup</Text>
      <Text style={styles.hint}>Give your game a name your players will recognise.</Text>

      <TextInput
        label="Game Name"
        placeholder="e.g. Saturday Night Wines"
        value={gameName}
        onChangeText={setGameName}
        error={nameError}
        maxLength={50}
        autoFocus
      />

      <OptionPicker
        label="Reveal answers"
        options={REVEAL_OPTIONS}
        value={revealMode}
        onChange={setRevealMode}
      />

      <OptionPicker
        label="Your role"
        options={HOST_MODE_OPTIONS}
        value={hostMode}
        onChange={setHostMode}
      />

      <Button title="Next: Build Questionnaire" onPress={handleNext} style={styles.cta} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  hint: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  cta: {
    marginTop: SPACING.lg,
  },
});
