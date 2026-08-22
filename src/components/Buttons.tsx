import { StyleSheet, Text } from 'react-native';
import { colors, radius, spacing } from '../theme';
import { AnimatedPressable } from './AnimatedPressable';

interface ButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

export function PrimaryButton({ label, onPress, disabled }: ButtonProps) {
  return (
    <AnimatedPressable
      style={[styles.primary, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.primaryText}>{label}</Text>
    </AnimatedPressable>
  );
}

export function DangerButton({ label, onPress }: ButtonProps) {
  return (
    <AnimatedPressable style={styles.danger} onPress={onPress}>
      <Text style={styles.dangerText}>{label}</Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md + 2,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  disabled: {
    opacity: 0.5,
  },
  primaryText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
    userSelect: 'none',
  },
  danger: {
    backgroundColor: colors.expenseSoft,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  dangerText: {
    color: colors.expense,
    fontSize: 14,
    fontWeight: '700',
    userSelect: 'none',
  },
});
