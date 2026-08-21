import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../theme';

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
  return (
    <View style={styles.row}>
      <Pressable style={[styles.btn, { backgroundColor: btnBg }]} onPress={onPrev} hitSlop={10}>
        <Text style={[styles.arrow, { color: arrowColor }]}>‹</Text>
      </Pressable>
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      <Pressable style={[styles.btn, { backgroundColor: btnBg }]} onPress={onNext} hitSlop={10}>
        <Text style={[styles.arrow, { color: arrowColor }]}>›</Text>
      </Pressable>
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
