import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { Category, RecurringItem } from '../types';
import { colors, radius, spacing } from '../theme';
import { formatCurrency } from '../utils/format';

interface RecurringRowProps {
  item: RecurringItem;
  category?: Category;
  onPress: () => void;
  onToggleActive: () => void;
}

export function RecurringRow({ item, category, onPress, onToggleActive }: RecurringRowProps) {
  const isIncome = item.type === 'income';
  const amountColor = isIncome ? colors.income : colors.expense;

  return (
    <Pressable style={[styles.row, !item.active && styles.rowInactive]} onPress={onPress}>
      <View
        style={[
          styles.iconCircle,
          { backgroundColor: (category?.color ?? colors.textMuted) + '22' },
        ]}
      >
        <Text style={styles.icon}>{category?.icon ?? '🔁'}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.meta}>
          Todo dia {item.day} · {category?.name ?? 'Sem categoria'}
        </Text>
      </View>
      <View style={styles.right}>
        <Text style={[styles.amount, { color: amountColor }]}>
          {isIncome ? '+' : '-'} {formatCurrency(item.amount)}
        </Text>
        <Switch
          value={item.active}
          onValueChange={onToggleActive}
          trackColor={{ false: colors.border, true: colors.income }}
          thumbColor={colors.white}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  rowInactive: {
    opacity: 0.5,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  meta: {
    fontSize: 12,
    color: colors.textMuted,
  },
  right: {
    alignItems: 'flex-end',
    gap: 6,
  },
  amount: {
    fontSize: 14,
    fontWeight: '700',
  },
});
