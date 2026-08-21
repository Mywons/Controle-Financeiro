import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from '../components/Card';
import { DonutChart } from '../components/DonutChart';
import { MonthSwitcher } from '../components/MonthSwitcher';
import { ProgressBar } from '../components/ProgressBar';
import { useFinanceStore } from '../store/useFinanceStore';
import { colors, radius, spacing } from '../theme';
import { monthLabel } from '../utils/date';
import { computeMonthSummary } from '../utils/finance';
import { formatCurrency, formatPercent } from '../utils/format';

export function DashboardScreen() {
  const transactions = useFinanceStore((s) => s.transactions);
  const categories = useFinanceStore((s) => s.categories);
  const recurring = useFinanceStore((s) => s.recurring);
  const selectedMonth = useFinanceStore((s) => s.selectedMonth);
  const nextMonth = useFinanceStore((s) => s.nextMonth);
  const prevMonth = useFinanceStore((s) => s.prevMonth);

  const summary = useMemo(
    () => computeMonthSummary(transactions, categories, selectedMonth),
    [transactions, categories, selectedMonth]
  );

  const monthTx = useMemo(
    () => transactions.filter((t) => t.monthKey === selectedMonth),
    [transactions, selectedMonth]
  );
  const pendingExpenses = useMemo(
    () => monthTx.filter((t) => t.type === 'expense' && !t.paid).length,
    [monthTx]
  );

  const activeRecurringCount = recurring.filter((r) => r.active).length;

  const spentPercent = Math.max(0, Math.min(100, summary.percentSpentOfIncome));
  const savedPercent = Math.max(0, Math.round(summary.percentSavedOfIncome));

  const donutSegments = summary.categoryBreakdown.slice(0, 6).map((c) => ({
    value: c.total,
    color: c.category?.color ?? colors.textMuted,
  }));

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.greeting}>Seu resumo financeiro</Text>

      <View style={styles.heroCard}>
        <View style={styles.heroBlob} />
        <MonthSwitcher
          label={monthLabel(selectedMonth)}
          onPrev={prevMonth}
          onNext={nextMonth}
          dark
        />

        <Text style={styles.heroBalanceLabel}>Saldo previsto do mês</Text>
        <Text style={styles.heroBalance}>{formatCurrency(summary.balanceProjected)}</Text>

        <View style={styles.heroStatsRow}>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatLabel}>Receitas</Text>
            <Text style={[styles.heroStatValue, { color: colors.income }]}>
              {formatCurrency(summary.income)}
            </Text>
          </View>
          <View style={styles.heroDivider} />
          <View style={styles.heroStat}>
            <Text style={styles.heroStatLabel}>Despesas</Text>
            <Text style={[styles.heroStatValue, { color: '#FF9B9B' }]}>
              {formatCurrency(summary.expensePlanned)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Text style={styles.statIcon}>📉</Text>
          <Text style={styles.statValue}>{formatPercent(spentPercent)}</Text>
          <Text style={styles.statLabel}>da renda comprometida</Text>
          <ProgressBar progress={spentPercent} color={colors.expense} height={6} />
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statIcon}>💰</Text>
          <Text style={[styles.statValue, { color: colors.income }]}>
            {formatPercent(savedPercent)}
          </Text>
          <Text style={styles.statLabel}>de economia projetada</Text>
          <ProgressBar
            progress={Math.max(0, savedPercent)}
            color={colors.income}
            height={6}
          />
        </Card>
      </View>

      <View style={styles.statsRow}>
        <Card style={styles.miniCard}>
          <Text style={styles.miniValue}>{pendingExpenses}</Text>
          <Text style={styles.miniLabel}>contas pendentes</Text>
        </Card>
        <Card style={styles.miniCard}>
          <Text style={styles.miniValue}>{activeRecurringCount}</Text>
          <Text style={styles.miniLabel}>recorrências ativas</Text>
        </Card>
        <Card style={styles.miniCard}>
          <Text style={[styles.miniValue, { color: colors.income }]}>
            {formatCurrency(summary.incomeReceived)}
          </Text>
          <Text style={styles.miniLabel}>já recebido</Text>
        </Card>
      </View>

      <Card style={styles.categoryCard}>
        <Text style={styles.sectionTitle}>Gastos por categoria</Text>
        {summary.categoryBreakdown.length === 0 ? (
          <Text style={styles.emptyText}>
            Nenhuma despesa registrada neste mês ainda.
          </Text>
        ) : (
          <View style={styles.chartRow}>
            <DonutChart
              segments={donutSegments}
              size={140}
              strokeWidth={18}
              centerLabel={
                <View style={{ alignItems: 'center' }}>
                  <Text style={styles.donutCenterValue}>
                    {formatPercent(spentPercent)}
                  </Text>
                  <Text style={styles.donutCenterLabel}>da renda</Text>
                </View>
              }
            />
            <View style={styles.legend}>
              {summary.categoryBreakdown.slice(0, 6).map((c) => (
                <View key={c.categoryId} style={styles.legendRow}>
                  <View
                    style={[
                      styles.legendDot,
                      { backgroundColor: c.category?.color ?? colors.textMuted },
                    ]}
                  />
                  <Text style={styles.legendLabel} numberOfLines={1}>
                    {c.category?.icon} {c.category?.name ?? 'Outros'}
                  </Text>
                  <Text style={styles.legendPercent}>{formatPercent(c.percentOfExpense)}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Progresso por categoria</Text>
        {summary.categoryBreakdown.length === 0 ? (
          <Text style={styles.emptyText}>Adicione despesas para ver o progresso.</Text>
        ) : (
          <View style={{ gap: spacing.md }}>
            {summary.categoryBreakdown.map((c) => (
              <View key={c.categoryId}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>
                    {c.category?.icon} {c.category?.name ?? 'Outros'}
                  </Text>
                  <Text style={styles.progressValue}>{formatCurrency(c.total)}</Text>
                </View>
                <ProgressBar
                  progress={c.percentOfExpense}
                  color={c.category?.color ?? colors.primary}
                />
              </View>
            ))}
          </View>
        )}
      </Card>

      <View style={{ height: spacing.xxl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  heroCard: {
    backgroundColor: colors.cardDark,
    borderRadius: radius.xl,
    padding: spacing.xl,
    overflow: 'hidden',
    gap: spacing.md,
  },
  heroBlob: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.cardDarkAlt,
    top: -110,
    right: -60,
    opacity: 0.6,
  },
  heroBalanceLabel: {
    color: colors.textOnDarkMuted,
    fontSize: 13,
    fontWeight: '600',
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  heroBalance: {
    color: colors.textOnDark,
    fontSize: 34,
    fontWeight: '800',
    textAlign: 'center',
  },
  heroStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    gap: spacing.xl,
  },
  heroStat: {
    alignItems: 'center',
    gap: 4,
  },
  heroDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  heroStatLabel: {
    color: colors.textOnDarkMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  heroStatValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    gap: 6,
  },
  statIcon: {
    fontSize: 18,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.expense,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 4,
  },
  miniCard: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: spacing.md,
  },
  miniValue: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  miniLabel: {
    fontSize: 10,
    color: colors.textMuted,
    textAlign: 'center',
  },
  categoryCard: {
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: 13,
    color: colors.textMuted,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  donutCenterValue: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  donutCenterLabel: {
    fontSize: 10,
    color: colors.textMuted,
  },
  legend: {
    flex: 1,
    gap: spacing.sm,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    flex: 1,
    fontSize: 12,
    color: colors.text,
    fontWeight: '600',
  },
  legendPercent: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '700',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  progressValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
  },
});
