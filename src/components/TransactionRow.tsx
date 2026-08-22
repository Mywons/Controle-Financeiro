import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Category, Transaction } from '../types';
import { colors, radius, spacing } from '../theme';
import { formatCurrency } from '../utils/format';
import { formatDayMonth } from '../utils/date';
import { AnimatedPressable } from './AnimatedPressable';

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

  const paidAnim = useRef(new Animated.Value(transaction.paid ? 1 : 0)).current;
  const dotScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(paidAnim, {
      toValue: transaction.paid ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    Animated.sequence([
      Animated.spring(dotScale, { toValue: 1.6, useNativeDriver: true, speed: 40 }),
      Animated.spring(dotScale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 10 }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transaction.paid]);

  const statusColor = paidAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.pending, colors.income],
  });

  return (
    <AnimatedPressable style={styles.row} onPress={onPress} scaleTo={0.98}>
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
        <AnimatedPressable onPress={onTogglePaid} hitSlop={8} style={styles.statusBtn} scaleTo={0.85}>
          <Animated.View
            style={[styles.statusDot, { backgroundColor: statusColor, transform: [{ scale: dotScale }] }]}
          />
          <Animated.Text style={[styles.statusText, { color: statusColor }]}>
            {transaction.paid ? (isIncome ? 'Recebido' : 'Pago') : 'Pendente'}
          </Animated.Text>
        </AnimatedPressable>
      </View>
    </AnimatedPressable>
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
