import { Pressable, StyleSheet, Text, View } from 'react-native';
import { TransactionType } from '../types';
import { colors, radius, spacing } from '../theme';

interface TypeToggleProps {
  value: TransactionType;
  onChange: (value: TransactionType) => void;
  incomeLabel?: string;
  expenseLabel?: string;
}

export function TypeToggle({
  value,
  onChange,
  incomeLabel = 'Receita',
  expenseLabel = 'Despesa',
}: TypeToggleProps) {
  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.option, value === 'expense' && styles.expenseActive]}
        onPress={() => onChange('expense')}
      >
        <Text style={[styles.text, value === 'expense' && styles.textActive]}>
          {expenseLabel}
        </Text>
      </Pressable>
      <Pressable
        style={[styles.option, value === 'income' && styles.incomeActive]}
        onPress={() => onChange('income')}
      >
        <Text style={[styles.text, value === 'income' && styles.textActive]}>{incomeLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.bgAlt,
    borderRadius: radius.pill,
    padding: 4,
    gap: 4,
  },
  option: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.pill,
    alignItems: 'center',
  },
  expenseActive: {
    backgroundColor: colors.expense,
  },
  incomeActive: {
    backgroundColor: colors.income,
  },
  text: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textMuted,
  },
  textActive: {
    color: colors.white,
  },
});
