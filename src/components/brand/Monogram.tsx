import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';
import { FontFamily } from '../../constants/typography';
import { Sparkle } from './Sparkle';

type Props = {
  size?: number;
  style?: ViewStyle;
};

export function Monogram({ size = 110, style }: Props): React.ReactElement {
  const radius = size * 0.28;
  const borderWidth = Math.max(3, size * 0.025);
  const fontSize = size * 0.38;
  const sparkleSize = size * 0.14;

  return (
    <View style={[{ width: size + 8, height: size + 8 }, style]}>
      {/* Sticker drop shadow */}
      <View style={[
        StyleSheet.absoluteFill,
        {
          borderRadius:    radius,
          backgroundColor: Colors.ink,
          top:   size * 0.05,
          left:  size * 0.05,
          right: -size * 0.05,
          bottom: -size * 0.05,
          opacity: 0.22,
        },
      ]} />

      <LinearGradient
        colors={[Colors.sun, Colors.melon, Colors.plum]}
        start={{ x: 0.3, y: 0.26 }}
        end={{ x: 1, y: 1 }}
        style={{
          width:        size,
          height:       size,
          borderRadius: radius,
          borderWidth,
          borderColor:  Colors.ink,
          overflow:     'hidden',
        }}
      >
        {/* BT text */}
        <Text style={[
          styles.letters,
          {
            fontFamily:   FontFamily.display,
            fontSize,
            letterSpacing: -size * 0.015,
          },
        ]}>
          BT
        </Text>

        {/* Sparkle */}
        <View style={{
          position: 'absolute',
          top:      size * 0.1,
          right:    size * 0.12,
        }}>
          <Sparkle size={sparkleSize} color={Colors.cream} />
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  letters: {
    position:   'absolute',
    color:      Colors.cream,
    transform:  [{ rotate: '-6deg' }],
    alignSelf:  'center',
    top:        '50%' as unknown as number,
    marginTop:  -20,
  },
});
