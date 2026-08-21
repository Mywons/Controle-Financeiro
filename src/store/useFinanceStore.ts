import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { DEFAULT_CATEGORIES } from '../defaultCategories';
import { Category, RecurringItem, Transaction, TransactionType } from '../types';
import { dateForDayInMonth, monthKeyNow, shiftMonthKey } from '../utils/date';
import { generateId } from '../utils/id';

interface FinanceStore {
  transactions: Transaction[];
  recurring: RecurringItem[];
  categories: Category[];
  selectedMonth: string;
  generatedMonths: string[];
  hasHydrated: boolean;

  setHasHydrated: (v: boolean) => void;
  setSelectedMonth: (monthKey: string) => void;
  nextMonth: () => void;
  prevMonth: () => void;

  addRecurring: (input: Omit<RecurringItem, 'id' | 'createdAt'>) => void;
  updateRecurring: (id: string, patch: Partial<Omit<RecurringItem, 'id'>>) => void;
  deleteRecurring: (id: string) => void;
  toggleRecurringActive: (id: string) => void;

  addTransaction: (input: Omit<Transaction, 'id' | 'monthKey'>) => void;
  updateTransaction: (id: string, patch: Partial<Omit<Transaction, 'id'>>) => void;
  deleteTransaction: (id: string) => void;
  togglePaid: (id: string) => void;

  addCategory: (input: Omit<Category, 'id'>) => Category;

  ensureMonthGenerated: (monthKey: string) => void;
}

function generateForMonth(
  monthKey: string,
  recurring: RecurringItem[],
  existing: Transaction[]
): Transaction[] {
  const created: Transaction[] = [];
  for (const item of recurring) {
    if (!item.active) continue;
    const alreadyExists = existing.some(
      (t) => t.recurringId === item.id && t.monthKey === monthKey
    );
    if (alreadyExists) continue;
    created.push({
      id: generateId(),
      type: item.type,
      amount: item.amount,
      description: item.name,
      categoryId: item.categoryId,
      date: dateForDayInMonth(monthKey, item.day),
      monthKey,
      paid: false,
      recurringId: item.id,
    });
  }
  return created;
}

export const useFinanceStore = create<FinanceStore>()(
  persist(
    (set, get) => ({
      transactions: [],
      recurring: [],
      categories: DEFAULT_CATEGORIES,
      selectedMonth: monthKeyNow(),
      generatedMonths: [],
      hasHydrated: false,

      setHasHydrated: (v) => set({ hasHydrated: v }),

      setSelectedMonth: (monthKey) => {
        set({ selectedMonth: monthKey });
        get().ensureMonthGenerated(monthKey);
      },
      nextMonth: () => {
        const next = shiftMonthKey(get().selectedMonth, 1);
        set({ selectedMonth: next });
        get().ensureMonthGenerated(next);
      },
      prevMonth: () => {
        const prev = shiftMonthKey(get().selectedMonth, -1);
        set({ selectedMonth: prev });
        get().ensureMonthGenerated(prev);
      },

      addRecurring: (input) => {
        const item: RecurringItem = {
          ...input,
          id: generateId(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ recurring: [...state.recurring, item] }));
        get().ensureMonthGenerated(get().selectedMonth);
      },
      updateRecurring: (id, patch) => {
        set((state) => ({
          recurring: state.recurring.map((r) => (r.id === id ? { ...r, ...patch } : r)),
        }));
      },
      deleteRecurring: (id) => {
        set((state) => ({
          recurring: state.recurring.filter((r) => r.id !== id),
        }));
      },
      toggleRecurringActive: (id) => {
        set((state) => ({
          recurring: state.recurring.map((r) =>
            r.id === id ? { ...r, active: !r.active } : r
          ),
        }));
        get().ensureMonthGenerated(get().selectedMonth);
      },

      addTransaction: (input) => {
        const monthKey = input.date.slice(0, 7);
        const transaction: Transaction = {
          ...input,
          id: generateId(),
          monthKey,
        };
        set((state) => ({ transactions: [...state.transactions, transaction] }));
      },
      updateTransaction: (id, patch) => {
        set((state) => ({
          transactions: state.transactions.map((t) => {
            if (t.id !== id) return t;
            const merged = { ...t, ...patch };
            if (patch.date) merged.monthKey = patch.date.slice(0, 7);
            return merged;
          }),
        }));
      },
      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        }));
      },
      togglePaid: (id) => {
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, paid: !t.paid } : t
          ),
        }));
      },

      addCategory: (input) => {
        const category: Category = { ...input, id: generateId() };
        set((state) => ({ categories: [...state.categories, category] }));
        return category;
      },

      ensureMonthGenerated: (monthKey) => {
        const state = get();
        if (state.generatedMonths.includes(monthKey) && state.recurring.length === 0) return;
        const created = generateForMonth(monthKey, state.recurring, state.transactions);
        if (created.length === 0) {
          if (!state.generatedMonths.includes(monthKey)) {
            set((s) => ({ generatedMonths: [...s.generatedMonths, monthKey] }));
          }
          return;
        }
        set((s) => ({
          transactions: [...s.transactions, ...created],
          generatedMonths: s.generatedMonths.includes(monthKey)
            ? s.generatedMonths
            : [...s.generatedMonths, monthKey],
        }));
      },
    }),
    {
      name: 'controle-financeiro-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        transactions: state.transactions,
        recurring: state.recurring,
        categories: state.categories,
        selectedMonth: state.selectedMonth,
        generatedMonths: state.generatedMonths,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
        state?.ensureMonthGenerated(state.selectedMonth ?? monthKeyNow());
      },
    }
  )
);

export function categoriesByType(categories: Category[], type: TransactionType) {
  return categories.filter((c) => c.type === type);
}
