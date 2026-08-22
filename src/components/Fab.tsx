import { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { colors } from '../theme';
import { AnimatedPressable } from './AnimatedPressable';

interface FabProps {
  onPress: () => void;
}

export function Fab({ onPress }: FabProps) {
  const entrance = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(entrance, {
      toValue: 1,
      useNativeDriver: true,
      speed: 14,
      bounciness: 12,
      delay: 150,
    }).start();
  }, [entrance]);

  return (
    <AnimatedPressable style={styles.fab} onPress={onPress}>
      <Animated.Text style={[styles.fabText, { transform: [{ scale: entrance }] }]}>+</Animated.Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  fabText: {
    color: colors.white,
    fontSize: 28,
    fontWeight: '400',
    marginTop: -2,
    userSelect: 'none',
  },
});
