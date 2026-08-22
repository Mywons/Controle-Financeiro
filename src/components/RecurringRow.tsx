import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Switch, Text, View } from 'react-native';
import { Category, RecurringItem } from '../types';
import { colors, radius, spacing } from '../theme';
import { formatCurrency } from '../utils/format';
import { AnimatedPressable } from './AnimatedPressable';

interface RecurringRowProps {
  item: RecurringItem;
  category?: Category;
  onPress: () => void;
  onToggleActive: () => void;
}

export function RecurringRow({ item, category, onPress, onToggleActive }: RecurringRowProps) {
  const isIncome = item.type === 'income';
  const amountColor = isIncome ? colors.income : colors.expense;

  const activeAnim = useRef(new Animated.Value(item.active ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(activeAnim, {
      toValue: item.active ? 1 : 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [item.active, activeAnim]);

  const opacity = activeAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] });

  return (
    <AnimatedPressable onPress={onPress} scaleTo={0.98}>
      <Animated.View style={[styles.row, { opacity }]}>
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
      </Animated.View>
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
