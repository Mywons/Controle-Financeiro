import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Category, Transaction } from '../types';
import { colors, radius, spacing } from '../theme';
import { formatCurrency } from '../utils/format';
import { formatDayMonth } from '../utils/date';

interface TransactionRowProps {
  transaction: Transaction;
  category?: Category;
  onPress: () => void;
  onTogglePaid: () => void;
}

export function TransactionRow({
  transaction,
  category,
  onPress,
  onTogglePaid,
}: TransactionRowProps) {
  const isIncome = transaction.type === 'income';
  const amountColor = isIncome ? colors.income : colors.expense;
  const sign = isIncome ? '+' : '-';

  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View
        style={[
          styles.iconCircle,
          { backgroundColor: (category?.color ?? colors.textMuted) + '22' },
        ]}
      >
        <Text style={styles.icon}>{category?.icon ?? '💰'}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.description} numberOfLines={1}>
          {transaction.description}
        </Text>
        <Text style={styles.meta}>
          {category?.name ?? 'Sem categoria'} · {formatDayMonth(transaction.date)}
        </Text>
      </View>
      <View style={styles.right}>
        <Text style={[styles.amount, { color: amountColor }]}>
          {sign} {formatCurrency(Math.abs(transaction.amount))}
        </Text>
        <Pressable onPress={onTogglePaid} hitSlop={8} style={styles.statusBtn}>
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor: transaction.paid ? colors.income : colors.pending,
              },
            ]}
          />
          <Text
            style={[
              styles.statusText,
              { color: transaction.paid ? colors.income : colors.pending },
            ]}
          >
            {transaction.paid ? (isIncome ? 'Recebido' : 'Pago') : 'Pendente'}
          </Text>
        </Pressable>
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
  description: {
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
    gap: 4,
  },
  amount: {
    fontSize: 15,
    fontWeight: '700',
  },
  statusBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
