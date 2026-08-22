import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../theme';
import { AnimatedPressable } from './AnimatedPressable';

interface MonthSwitcherProps {
  label: string;
  onPrev: () => void;
  onNext: () => void;
  dark?: boolean;
}

export function MonthSwitcher({ label, onPrev, onNext, dark = false }: MonthSwitcherProps) {
  const textColor = dark ? colors.textOnDark : colors.text;
  const btnBg = dark ? 'rgba(255,255,255,0.12)' : colors.primarySoft;
  const arrowColor = dark ? colors.textOnDark : colors.primary;

  const fade = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    fade.setValue(0);
    Animated.timing(fade, { toValue: 1, duration: 180, useNativeDriver: true }).start();
  }, [label, fade]);

  return (
    <View style={styles.row}>
      <AnimatedPressable
        style={[styles.btn, { backgroundColor: btnBg }]}
        onPress={onPrev}
        hitSlop={10}
        scaleTo={0.85}
      >
        <Text style={[styles.arrow, { color: arrowColor }]}>‹</Text>
      </AnimatedPressable>
      <Animated.Text style={[styles.label, { color: textColor, opacity: fade }]}>
        {label}
      </Animated.Text>
      <AnimatedPressable
        style={[styles.btn, { backgroundColor: btnBg }]}
        onPress={onNext}
        hitSlop={10}
        scaleTo={0.85}
      >
        <Text style={[styles.arrow, { color: arrowColor }]}>›</Text>
      </AnimatedPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  btn: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: -2,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    minWidth: 150,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
});
