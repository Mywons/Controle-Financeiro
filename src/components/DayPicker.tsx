import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../theme';
import { AnimatedPressable } from './AnimatedPressable';

interface DayPickerProps {
  value: number;
  onChange: (day: number) => void;
  maxDay?: number;
}

export function DayPicker({ value, onChange, maxDay = 28 }: DayPickerProps) {
  const days = Array.from({ length: maxDay }, (_, i) => i + 1);
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
      <View style={styles.row}>
        {days.map((day) => {
          const isSelected = day === value;
          return (
            <AnimatedPressable
              key={day}
              scaleTo={0.85}
              style={[styles.chip, isSelected && styles.chipActive]}
              onPress={() => onChange(day)}
            >
              <Text style={[styles.text, isSelected && styles.textActive]}>{day}</Text>
            </AnimatedPressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    marginHorizontal: -spacing.lg,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
  },
  chip: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  text: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  textActive: {
    color: colors.white,
  },
});
