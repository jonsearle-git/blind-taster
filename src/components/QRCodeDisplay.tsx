import { StyleSheet, View, Text, Pressable } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';
import { Colors } from '../constants/colors';
import { FontSize, FontWeight, FontFamily } from '../constants/typography';
import { Spacing, BorderRadius } from '../constants/spacing';

type Props = {
  roomCode: string;
};

export function QRCodeDisplay({ roomCode }: Props): React.ReactElement {
  const deepLink = `blindtaster://join/${roomCode}`;

  async function handleCopy(): Promise<void> {
    await Clipboard.setStringAsync(roomCode);
  }

  return (
    <View style={styles.container}>
      <View style={styles.qrWrapper}>
        <QRCode
          value={deepLink}
          size={160}
          color={Colors.ink}
          backgroundColor={Colors.surface}
        />
      </View>

      <Text style={styles.codeLabel}>Room code</Text>

      <Pressable
        onPress={handleCopy}
        style={({ pressed }) => [styles.codePillWrapper, pressed && styles.pressed]}
        accessibilityLabel={`Room code ${roomCode}. Tap to copy.`}
        accessibilityRole="button"
      >
        <View style={styles.codeShadow} />
        <View style={styles.codePill}>
          <Text style={styles.code}>{roomCode}</Text>
        </View>
      </Pressable>

      <Text style={styles.copyHint}>Tap to copy</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap:        Spacing.sm,
  },
  qrWrapper: {
    padding:         Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius:    BorderRadius.lg,
    borderWidth:     2.5,
    borderColor:     Colors.ink,
  },
  codeLabel: {
    marginTop:    Spacing.sm,
    color:        Colors.textSecondary,
    fontSize:     FontSize.xs,
    fontWeight:   FontWeight.black,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  codePillWrapper: {
    position: 'relative',
  },
  codeShadow: {
    position:        'absolute',
    top:             5,
    left:            5,
    right:           -5,
    bottom:          -5,
    borderRadius:    BorderRadius.md,
    backgroundColor: Colors.ink,
  },
  codePill: {
    paddingHorizontal: Spacing.lg,
    paddingVertical:   Spacing.sm,
    backgroundColor:   Colors.cream,
    borderRadius:      BorderRadius.md,
    borderWidth:       2.5,
    borderColor:       Colors.ink,
  },
  code: {
    fontFamily:    FontFamily.display,
    color:         Colors.ink,
    fontSize:      FontSize.xxl + 4,
    fontWeight:    FontWeight.black,
    letterSpacing: 4,
  },
  copyHint: {
    color:     Colors.textDisabled,
    fontSize:  FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  pressed: {
    opacity: 0.7,
  },
});
