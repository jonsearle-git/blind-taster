import { StyleSheet, Text } from 'react-native';
import { Colors } from '../constants/colors';
import { FontFamily, FontSize, FontWeight } from '../constants/typography';

type Props = {
  message: string;
};

export function ErrorMessage({ message }: Props): React.ReactElement {
  return <Text style={styles.text}>{message}</Text>;
}

const styles = StyleSheet.create({
  text: {
    fontFamily:  FontFamily.bodyBold,
    color:       Colors.error,
    fontSize:    FontSize.sm,
    fontWeight:  FontWeight.bold,
  },
});
