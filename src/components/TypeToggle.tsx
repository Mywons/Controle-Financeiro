import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { TransactionType } from '../types';
import { colors, radius, spacing } from '../theme';
import { AnimatedPressable } from './AnimatedPressable';

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
      <TypeOption
        label={expenseLabel}
        isActive={value === 'expense'}
        activeColor={colors.expense}
        onPress={() => onChange('expense')}
      />
      <TypeOption
        label={incomeLabel}
        isActive={value === 'income'}
        activeColor={colors.income}
        onPress={() => onChange('income')}
      />
    </View>
  );
}

function TypeOption({
  label,
  isActive,
  activeColor,
  onPress,
}: {
  label: string;
  isActive: boolean;
  activeColor: string;
  onPress: () => void;
}) {
  const anim = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: isActive ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [isActive, anim]);

  return (
    <AnimatedPressable style={styles.option} onPress={onPress}>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { borderRadius: radius.pill, backgroundColor: activeColor, opacity: anim },
        ]}
      />
      <Animated.Text
        style={[
          styles.text,
          {
            color: anim.interpolate({
              inputRange: [0, 1],
              outputRange: [colors.textMuted, colors.white],
            }),
          },
        ]}
      >
        {label}
      </Animated.Text>
    </AnimatedPressable>
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
    overflow: 'hidden',
  },
  text: {
    fontSize: 14,
    fontWeight: '700',
  },
});
