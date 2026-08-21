export type TransactionType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
}

export interface RecurringItem {
  id: string;
  name: string;
  amount: number;
  type: TransactionType;
  day: number; // dia do mês (1-28 para evitar problemas com meses curtos)
  categoryId: string;
  active: boolean;
  createdAt: string;
  notes?: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  categoryId: string;
  date: string; // ISO yyyy-MM-dd
  monthKey: string; // yyyy-MM
  paid: boolean;
  recurringId?: string;
}

export interface FinanceState {
  transactions: Transaction[];
  recurring: RecurringItem[];
  categories: Category[];
  selectedMonth: string;
  generatedMonths: string[];
  hasHydrated: boolean;
}
