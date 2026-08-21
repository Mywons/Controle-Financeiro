import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Category } from '../types';
import { colors, radius, spacing } from '../theme';

interface CategoryPickerProps {
  categories: Category[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function CategoryPicker({ categories, selectedId, onSelect }: CategoryPickerProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
      <View style={styles.row}>
        {categories.map((cat) => {
          const isSelected = cat.id === selectedId;
          return (
            <Pressable
              key={cat.id}
              style={[
                styles.chip,
                {
                  backgroundColor: isSelected ? cat.color : colors.card,
                  borderColor: isSelected ? cat.color : colors.border,
                },
              ]}
              onPress={() => onSelect(cat.id)}
            >
              <Text style={styles.emoji}>{cat.icon}</Text>
              <Text style={[styles.label, { color: isSelected ? colors.white : colors.text }]}>
                {cat.name}
              </Text>
            </Pressable>
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
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  emoji: {
    fontSize: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
});
