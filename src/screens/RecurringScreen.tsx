import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { Fab } from '../components/Fab';
import { RecurringFormModal } from '../components/RecurringFormModal';
import { RecurringRow } from '../components/RecurringRow';
import { useFinanceStore } from '../store/useFinanceStore';
import { RecurringItem } from '../types';
import { colors, spacing } from '../theme';
import { formatCurrency } from '../utils/format';

export function RecurringScreen() {
  const recurring = useFinanceStore((s) => s.recurring);
  const categories = useFinanceStore((s) => s.categories);
  const toggleRecurringActive = useFinanceStore((s) => s.toggleRecurringActive);

  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<RecurringItem | null>(null);

  const income = useMemo(() => recurring.filter((r) => r.type === 'income'), [recurring]);
  const expense = useMemo(() => recurring.filter((r) => r.type === 'expense'), [recurring]);

  const monthlyIncomeTotal = income
    .filter((r) => r.active)
    .reduce((s, r) => s + r.amount, 0);
  const monthlyExpenseTotal = expense
    .filter((r) => r.active)
    .reduce((s, r) => s + r.amount, 0);

  function openNew() {
    setEditing(null);
    setModalVisible(true);
  }

  function openEdit(item: RecurringItem) {
    setEditing(item);
    setModalVisible(true);
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Recorrentes</Text>
        <Text style={styles.subtitle}>
          Salário e contas fixas geram lançamentos automaticamente todo mês.
        </Text>

        <View style={styles.summaryRow}>
          <Card style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Receitas fixas / mês</Text>
            <Text style={[styles.summaryValue, { color: colors.income }]}>
              {formatCurrency(monthlyIncomeTotal)}
            </Text>
          </Card>
          <Card style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Despesas fixas / mês</Text>
            <Text style={[styles.summaryValue, { color: colors.expense }]}>
              {formatCurrency(monthlyExpenseTotal)}
            </Text>
          </Card>
        </View>

        <Text style={styles.sectionTitle}>💼 Salário e receitas fixas</Text>
        <Card padded={false}>
          {income.length === 0 ? (
            <View style={styles.emptyWrap}>
              <EmptyState
                icon="💼"
                title="Cadastre seu salário"
                subtitle="Adicione sua renda fixa para acompanhar seu orçamento automaticamente."
              />
            </View>
          ) : (
            income.map((item, index) => (
              <View
                key={item.id}
                style={[styles.rowWrap, index < income.length - 1 && styles.rowDivider]}
              >
                <RecurringRow
                  item={item}
                  category={categories.find((c) => c.id === item.categoryId)}
                  onPress={() => openEdit(item)}
                  onToggleActive={() => toggleRecurringActive(item.id)}
                />
              </View>
            ))
          )}
        </Card>

        <Text style={styles.sectionTitle}>🔁 Contas recorrentes</Text>
        <Card padded={false}>
          {expense.length === 0 ? (
            <View style={styles.emptyWrap}>
              <EmptyState
                icon="🔁"
                title="Nenhuma conta recorrente"
                subtitle="Adicione aluguel, assinaturas e outras contas fixas do mês."
              />
            </View>
          ) : (
            expense.map((item, index) => (
              <View
                key={item.id}
                style={[styles.rowWrap, index < expense.length - 1 && styles.rowDivider]}
              >
                <RecurringRow
                  item={item}
                  category={categories.find((c) => c.id === item.categoryId)}
                  onPress={() => openEdit(item)}
                  onToggleActive={() => toggleRecurringActive(item.id)}
                />
              </View>
            ))
          )}
        </Card>

        <View style={{ height: spacing.xxl }} />
      </ScrollView>

      <Fab onPress={openNew} />

      <RecurringFormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        editingItem={editing}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  summaryCard: {
    flex: 1,
    gap: 4,
  },
  summaryLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 17,
    fontWeight: '800',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.sm,
    marginBottom: 2,
  },
  rowWrap: {
    paddingHorizontal: spacing.lg,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  emptyWrap: {
    paddingVertical: spacing.sm,
  },
});
