import { StyleSheet, View, Text, Pressable, ScrollView, ViewStyle, Modal } from 'react-native';
import { useState, useRef } from 'react';
import { Colors } from '../constants/colors';
import { FontSize, FontWeight } from '../constants/typography';
import { Spacing, BorderRadius } from '../constants/spacing';

export type DropdownOption = {
  value:     string;
  label:     string;
  subLabel?: string;
};

type Props = {
  label?:          string;
  placeholder?:    string;
  options:         DropdownOption[];
  value:           string | null;
  onChange:        (value: string) => void;
  error?:          string;
  containerStyle?: ViewStyle;
};

type Layout = { x: number; y: number; width: number };

export function Dropdown({ label, placeholder = 'Select…', options, value, onChange, error, containerStyle }: Props): React.ReactElement {
  const [open,   setOpen]   = useState(false);
  const [layout, setLayout] = useState<Layout>({ x: 0, y: 0, width: 0 });
  const wrapperRef = useRef<View>(null);

  const selected = options.find((o) => o.value === value) ?? null;

  function handleOpen(): void {
    wrapperRef.current?.measure((_x, _y, width, height, pageX, pageY) => {
      setLayout({ x: pageX, y: pageY + height, width });
      setOpen(true);
    });
  }

  function handleSelect(v: string): void {
    onChange(v);
    setOpen(false);
  }

  return (
    <View style={[styles.container, containerStyle]}>
      {label !== undefined && (
        <Text style={styles.label}>{label}</Text>
      )}
      <View ref={wrapperRef} style={styles.controlWrapper}>
        <View style={styles.controlShadow} />
        <Pressable
          onPress={handleOpen}
          style={[styles.control, error !== undefined && styles.controlError]}
          accessibilityRole="button"
          accessibilityLabel={label}
          accessibilityState={{ expanded: open }}
        >
          <Text style={[styles.controlText, !selected && styles.controlPlaceholder]} numberOfLines={1}>
            {selected ? selected.label : placeholder}
          </Text>
          <Text style={styles.chevron}>{open ? '▲' : '▼'}</Text>
        </Pressable>
      </View>
      {error !== undefined && <Text style={styles.error}>{error}</Text>}

      <Modal visible={open} transparent animationType="none" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />
        <View style={[styles.dropdown, { top: layout.y, left: layout.x, width: layout.width }]}>
          <View style={styles.dropdownShadow} />
          <View style={styles.dropdownInner}>
            <ScrollView style={styles.dropdownScroll} keyboardShouldPersistTaps="handled">
              {options.map((o) => (
                <Pressable
                  key={o.value}
                  onPress={() => handleSelect(o.value)}
                  style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
                >
                  <Text style={styles.optionLabel}>{o.label}</Text>
                  {o.subLabel !== undefined && <Text style={styles.optionSubLabel}>{o.subLabel}</Text>}
                </Pressable>
              ))}
              {options.length === 0 && <Text style={styles.empty}>{placeholder === 'Select…' ? 'No options.' : `No ${label?.toLowerCase() ?? 'options'} yet.`}</Text>}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container:          { gap: Spacing.xs },
  label:              { color: Colors.textSecondary, fontSize: FontSize.sm, fontWeight: FontWeight.bold, letterSpacing: 1, textTransform: 'uppercase' },
  controlWrapper:     { position: 'relative' },
  controlShadow:      { position: 'absolute', top: 4, left: 4, right: -4, bottom: -4, borderRadius: BorderRadius.md, backgroundColor: Colors.ink },
  control:            { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderWidth: 2.5, borderColor: Colors.border, borderRadius: BorderRadius.md, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, minHeight: 52 },
  controlText:        { flex: 1, color: Colors.textPrimary, fontSize: FontSize.md, fontWeight: FontWeight.medium },
  controlPlaceholder: { color: Colors.textDisabled },
  chevron:            { color: Colors.textDisabled, fontSize: FontSize.xl },
  backdrop:           { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  dropdown:           { position: 'absolute' },
  dropdownShadow:     { position: 'absolute', top: 4, left: 4, right: -4, bottom: -4, borderRadius: BorderRadius.md, backgroundColor: Colors.ink },
  dropdownInner:      { backgroundColor: Colors.surface, borderWidth: 2.5, borderColor: Colors.border, borderRadius: BorderRadius.md, overflow: 'hidden' },
  dropdownScroll:     { maxHeight: 220 },
  option:             { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md, gap: 2 },
  optionPressed:      { backgroundColor: Colors.surfaceElevated },
  optionLabel:        { color: Colors.textPrimary, fontSize: FontSize.md, fontWeight: FontWeight.medium },
  optionSubLabel:     { color: Colors.textSecondary, fontSize: FontSize.sm },
  empty:              { color: Colors.textDisabled, fontSize: FontSize.md, textAlign: 'center', padding: Spacing.md },
  controlError:       { borderColor: Colors.error },
  error:              { color: Colors.error, fontSize: FontSize.sm, fontWeight: FontWeight.bold },
});
