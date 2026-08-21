import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { MonthSwitcher } from '../components/MonthSwitcher';
import { TransactionFormModal } from '../components/TransactionFormModal';
import { TransactionRow } from '../components/TransactionRow';
import { useFinanceStore } from '../store/useFinanceStore';
import { Transaction, TransactionType } from '../types';
import { colors, radius, spacing } from '../theme';
import { monthLabel, todayIso } from '../utils/date';
import { formatCurrency } from '../utils/format';

type Filter = 'all' | TransactionType;

export function TransactionsScreen() {
  const transactions = useFinanceStore((s) => s.transactions);
  const categories = useFinanceStore((s) => s.categories);
  const selectedMonth = useFinanceStore((s) => s.selectedMonth);
  const nextMonth = useFinanceStore((s) => s.nextMonth);
  const prevMonth = useFinanceStore((s) => s.prevMonth);
  const togglePaid = useFinanceStore((s) => s.togglePaid);

  const [filter, setFilter] = useState<Filter>('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);

  const monthTx = useMemo(
    () =>
      transactions
        .filter((t) => t.monthKey === selectedMonth)
        .filter((t) => (filter === 'all' ? true : t.type === filter))
        .sort((a, b) => a.date.localeCompare(b.date)),
    [transactions, selectedMonth, filter]
  );

  const totals = useMemo(() => {
    const income = transactions
      .filter((t) => t.monthKey === selectedMonth && t.type === 'income')
      .reduce((s, t) => s + t.amount, 0);
    const expense = transactions
      .filter((t) => t.monthKey === selectedMonth && t.type === 'expense')
      .reduce((s, t) => s + t.amount, 0);
    return { income, expense };
  }, [transactions, selectedMonth]);

  function openNew() {
    setEditing(null);
    setModalVisible(true);
  }

  function openEdit(tx: Transaction) {
    setEditing(tx);
    setModalVisible(true);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MonthSwitcher label={monthLabel(selectedMonth)} onPrev={prevMonth} onNext={nextMonth} />
        <View style={styles.totalsRow}>
          <Text style={[styles.totalText, { color: colors.income }]}>
            + {formatCurrency(totals.income)}
          </Text>
          <Text style={[styles.totalText, { color: colors.expense }]}>
            - {formatCurrency(totals.expense)}
          </Text>
        </View>

        <View style={styles.filterRow}>
          {(
            [
              { key: 'all', label: 'Todos' },
              { key: 'expense', label: 'Despesas' },
              { key: 'income', label: 'Receitas' },
            ] as { key: Filter; label: string }[]
          ).map((f) => (
            <Pressable
              key={f.key}
              style={[styles.filterChip, filter === f.key && styles.filterChipActive]}
              onPress={() => setFilter(f.key)}
            >
              <Text
                style={[styles.filterText, filter === f.key && styles.filterTextActive]}
              >
                {f.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <FlatList
        data={monthTx}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="🧾"
            title="Nada por aqui ainda"
            subtitle="Toque no botão + para adicionar um lançamento neste mês."
          />
        }
        renderItem={({ item }) => (
          <Card padded={false} style={styles.rowCard}>
            <View style={styles.rowInner}>
              <TransactionRow
                transaction={item}
                category={categories.find((c) => c.id === item.categoryId)}
                onPress={() => openEdit(item)}
                onTogglePaid={() => togglePaid(item.id)}
              />
            </View>
          </Card>
        )}
      />

      <Pressable style={styles.fab} onPress={openNew}>
        <Text style={styles.fabText}>+</Text>
      </Pressable>

      <TransactionFormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        editingTransaction={editing}
        defaultDate={selectedMonth === todayIso().slice(0, 7) ? todayIso() : `${selectedMonth}-01`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    padding: spacing.lg,
    paddingBottom: spacing.sm,
    gap: spacing.md,
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xl,
  },
  totalText: {
    fontSize: 15,
    fontWeight: '700',
  },
  filterRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
  },
  filterTextActive: {
    color: colors.white,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 100,
    gap: spacing.sm,
  },
  rowCard: {
    paddingHorizontal: spacing.md,
  },
  rowInner: {
    paddingHorizontal: spacing.xs,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
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
  },
});
