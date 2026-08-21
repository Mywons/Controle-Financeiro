import { Category, Transaction } from '../types';

export interface CategoryBreakdown {
  categoryId: string;
  category: Category | undefined;
  total: number;
  percentOfExpense: number;
}

export interface MonthSummary {
  income: number;
  incomeReceived: number;
  expensePlanned: number;
  expensePaid: number;
  expensePending: number;
  balanceRealized: number;
  balanceProjected: number;
  percentSpentOfIncome: number;
  percentSavedOfIncome: number;
  categoryBreakdown: CategoryBreakdown[];
}

export function computeMonthSummary(
  transactions: Transaction[],
  categories: Category[],
  monthKey: string
): MonthSummary {
  const monthTx = transactions.filter((t) => t.monthKey === monthKey);

  const incomeTx = monthTx.filter((t) => t.type === 'income');
  const expenseTx = monthTx.filter((t) => t.type === 'expense');

  const income = incomeTx.reduce((sum, t) => sum + t.amount, 0);
  const incomeReceived = incomeTx.filter((t) => t.paid).reduce((sum, t) => sum + t.amount, 0);

  const expensePlanned = expenseTx.reduce((sum, t) => sum + t.amount, 0);
  const expensePaid = expenseTx.filter((t) => t.paid).reduce((sum, t) => sum + t.amount, 0);
  const expensePending = expensePlanned - expensePaid;

  const balanceRealized = incomeReceived - expensePaid;
  const balanceProjected = income - expensePlanned;

  const percentSpentOfIncome = income > 0 ? (expensePlanned / income) * 100 : expensePlanned > 0 ? 100 : 0;
  const percentSavedOfIncome = income > 0 ? (balanceProjected / income) * 100 : 0;

  const byCategory = new Map<string, number>();
  for (const t of expenseTx) {
    byCategory.set(t.categoryId, (byCategory.get(t.categoryId) ?? 0) + t.amount);
  }
  const categoryBreakdown: CategoryBreakdown[] = Array.from(byCategory.entries())
    .map(([categoryId, total]) => ({
      categoryId,
      category: categories.find((c) => c.id === categoryId),
      total,
      percentOfExpense: expensePlanned > 0 ? (total / expensePlanned) * 100 : 0,
    }))
    .sort((a, b) => b.total - a.total);

  return {
    income,
    incomeReceived,
    expensePlanned,
    expensePaid,
    expensePending,
    balanceRealized,
    balanceProjected,
    percentSpentOfIncome,
    percentSavedOfIncome,
    categoryBreakdown,
  };
}
