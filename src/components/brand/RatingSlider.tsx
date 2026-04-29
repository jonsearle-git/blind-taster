import { View, Text, StyleSheet, PanResponder } from 'react-native';
import { useRef, useState } from 'react';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize, FontWeight } from '../../constants/typography';
import { BorderRadius, Spacing } from '../../constants/spacing';

const THUMB = 36;
const TRACK_H = 10;

type Props = {
  min: number;
  max: number;
  step: number;
  value: number | null;
  onChange: (v: number) => void;
  minLabel?: string;
  maxLabel?: string;
  locked?: boolean;
};

export function RatingSlider({
  min,
  max,
  step,
  value,
  onChange,
  minLabel,
  maxLabel,
  locked = false,
}: Props): React.ReactElement {
  const [trackWidth, setTrackWidth] = useState(0);

  const trackWidthRef = useRef(0);
  const stateRef      = useRef({ locked, min, max, step, onChange });
  stateRef.current    = { locked, min, max, step, onChange };

  const dp           = step < 0.05 ? 2 : step < 0.5 ? 1 : 0;
  const currentValue = value ?? min;
  const ratio        = max > min ? (currentValue - min) / (max - min) : 0;
  const thumbLeft    = trackWidth > 0 ? ratio * (trackWidth - THUMB) : 0;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !stateRef.current.locked,
      onMoveShouldSetPanResponder:  () => !stateRef.current.locked,
      onPanResponderGrant: (evt) => handleTouch(evt.nativeEvent.locationX),
      onPanResponderMove:  (evt) => handleTouch(evt.nativeEvent.locationX),
    })
  ).current;

  function handleTouch(x: number): void {
    const { locked: l, min: mn, max: mx, step: st, onChange: cb } = stateRef.current;
    const w = trackWidthRef.current;
    if (l || w <= THUMB) return;
    const r       = Math.max(0, Math.min(1, (x - THUMB / 2) / (w - THUMB)));
    const dp2     = st < 0.05 ? 2 : st < 0.5 ? 1 : 0;
    const snapped = parseFloat((Math.round((mn + r * (mx - mn)) / st) * st).toFixed(dp2));
    cb(parseFloat(Math.min(mx, Math.max(mn, snapped)).toFixed(dp2)));
  }

  return (
    <View style={styles.root}>
      <View
        style={styles.trackArea}
        onLayout={(e) => {
          const w = e.nativeEvent.layout.width;
          trackWidthRef.current = w;
          setTrackWidth(w);
        }}
        {...panResponder.panHandlers}
      >
        <View style={styles.trackBg} />
        {trackWidth > 0 && (
          <View style={[styles.trackFill, { width: thumbLeft + THUMB / 2 }]} />
        )}
        {trackWidth > 0 && (
          <View style={[styles.thumb, { left: thumbLeft }]}>
            <Text style={styles.thumbText}>{currentValue.toFixed(dp)}</Text>
          </View>
        )}
      </View>

      {(minLabel !== undefined || maxLabel !== undefined) && (
        <View style={styles.labels}>
          <Text style={styles.label}>{minLabel ?? ''}</Text>
          <Text style={styles.label}>{maxLabel ?? ''}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: Spacing.xs },
  trackArea: {
    height:   THUMB + Spacing.sm,
    position: 'relative',
    justifyContent: 'center',
  },
  trackBg: {
    position:        'absolute',
    left:            THUMB / 2,
    right:           THUMB / 2,
    height:          TRACK_H,
    borderRadius:    BorderRadius.pill,
    backgroundColor: Colors.cream,
    borderWidth:     2,
    borderColor:     Colors.ink,
  },
  trackFill: {
    position:        'absolute',
    left:            THUMB / 2,
    height:          TRACK_H,
    borderRadius:    BorderRadius.pill,
    backgroundColor: Colors.sun,
    borderWidth:     2,
    borderColor:     Colors.ink,
  },
  thumb: {
    position:        'absolute',
    width:           THUMB,
    height:          THUMB,
    borderRadius:    THUMB / 2,
    backgroundColor: Colors.melon,
    borderWidth:     3,
    borderColor:     Colors.ink,
    alignItems:      'center',
    justifyContent:  'center',
    shadowColor:     Colors.ink,
    shadowOffset:    { width: 3, height: 3 },
    shadowOpacity:   1,
    shadowRadius:    0,
    elevation:       4,
  },
  thumbText: {
    fontFamily: FontFamily.heading,
    fontSize:   FontSize.xs,
    fontWeight: FontWeight.black,
    color:      Colors.cream,
  },
  labels: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    paddingHorizontal: THUMB / 2,
  },
  label: {
    fontFamily:    FontFamily.bodyBold,
    fontSize:      FontSize.xs,
    fontWeight:    FontWeight.black,
    color:         Colors.ink,
    letterSpacing: 1,
    textTransform: 'uppercase',
    opacity:       0.85,
  },
});
