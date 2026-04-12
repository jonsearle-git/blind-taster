import { StyleSheet, View, Text } from 'react-native';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { TextInput } from '../TextInput';

type Props = {
  currencySymbol: string;
  onChange:       (currencySymbol: string) => void;
};

export function PriceBuilder({ currencySymbol, onChange }: Props): React.ReactElement {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Currency</Text>
      <TextInput
        label="Currency Symbol"
        value={currencySymbol}
        onChangeText={onChange}
        placeholder="£"
        containerStyle={styles.symbolField}
        maxLength={3}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  label: {
    color:      Colors.textSecondary,
    fontSize:   FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  symbolField: {
    width: 120,
  },
});
