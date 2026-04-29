import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';
import { BorderRadius } from '../../constants/spacing';

type Props = {
  children: React.ReactNode;
  backgroundColor?: string;
  shadowOffset?: number;
  borderRadius?: number;
  style?: ViewStyle;
};

export function StickerCard({
  children,
  backgroundColor = Colors.cream,
  shadowOffset = 6,
  borderRadius = BorderRadius.lg,
  style,
}: Props): React.ReactElement {
  return (
    <View style={[styles.wrapper, style]}>
      <View style={[
        styles.shadow,
        {
          borderRadius,
          transform: [{ translateX: shadowOffset }, { translateY: shadowOffset }],
        },
      ]} />
      <View style={[
        styles.card,
        {
          backgroundColor,
          borderRadius,
        },
      ]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  shadow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.ink,
  },
  card: {
    borderWidth:  3,
    borderColor:  Colors.ink,
    overflow:     'hidden',
  },
});
