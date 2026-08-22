import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme';
import { AnimatedPressable } from './AnimatedPressable';

export type TabKey = 'dashboard' | 'transactions' | 'recurring';

interface TabBarProps {
  active: TabKey;
  onChange: (tab: TabKey) => void;
}

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: 'dashboard', label: 'Painel', icon: '📊' },
  { key: 'transactions', label: 'Lançamentos', icon: '🧾' },
  { key: 'recurring', label: 'Recorrentes', icon: '🔁' },
];

export function TabBar({ active, onChange }: TabBarProps) {
  return (
    <View style={styles.container}>
      {TABS.map((tab) => (
        <TabItem
          key={tab.key}
          label={tab.label}
          icon={tab.icon}
          isActive={tab.key === active}
          onPress={() => onChange(tab.key)}
        />
      ))}
    </View>
  );
}

function TabItem({
  label,
  icon,
  isActive,
  onPress,
}: {
  label: string;
  icon: string;
  isActive: boolean;
  onPress: () => void;
}) {
  const bounce = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(bounce, {
      toValue: isActive ? 1 : 0,
      useNativeDriver: true,
      speed: 20,
      bounciness: 10,
    }).start();
  }, [isActive, bounce]);

  const scale = bounce.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] });

  return (
    <AnimatedPressable style={styles.tab} onPress={onPress} hitSlop={8}>
      <Animated.View
        style={[styles.iconWrap, isActive && styles.iconWrapActive, { transform: [{ scale }] }]}
      >
        <Text style={styles.icon}>{icon}</Text>
      </Animated.View>
      <Text style={[styles.label, isActive && styles.labelActive]}>{label}</Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingBottom: spacing.sm,
  },
  iconWrap: {
    width: 40,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: colors.primarySoft,
  },
  icon: {
    fontSize: 16,
  },
  label: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
  },
  labelActive: {
    color: colors.primary,
  },
});
