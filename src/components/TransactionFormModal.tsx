import { useEffect, useMemo, useState } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { confirmDestructive, notify } from '../utils/alert';
import { Transaction, TransactionType } from '../types';
import { CategoryPicker } from './CategoryPicker';
import { DangerButton, PrimaryButton } from './Buttons';
import { DayPicker } from './DayPicker';
import { FormField, StyledInput } from './FormField';
import { FormModal } from './FormModal';
import { TypeToggle } from './TypeToggle';
import { dateForDayInMonth, dayOfMonth, daysInMonth, monthLabel, todayIso } from '../utils/date';

interface TransactionFormModalProps {
  visible: boolean;
  onClose: () => void;
  editingTransaction: Transaction | null;
  defaultDate: string;
}

export function TransactionFormModal({
  visible,
  onClose,
  editingTransaction,
  defaultDate,
}: TransactionFormModalProps) {
  const categories = useFinanceStore((s) => s.categories);
  const addTransaction = useFinanceStore((s) => s.addTransaction);
  const updateTransaction = useFinanceStore((s) => s.updateTransaction);
  const deleteTransaction = useFinanceStore((s) => s.deleteTransaction);

  const [type, setType] = useState<TransactionType>('expense');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [date, setDate] = useState(defaultDate);
  const [monthKey, setMonthKey] = useState(defaultDate.slice(0, 7));
  const [paid, setPaid] = useState(false);

  const filteredCategories = useMemo(
    () => categories.filter((c) => c.type === type),
    [categories, type]
  );

  useEffect(() => {
    if (!visible) return;
    if (editingTransaction) {
      setType(editingTransaction.type);
      setDescription(editingTransaction.description);
      setAmount(String(editingTransaction.amount).replace('.', ','));
      setCategoryId(editingTransaction.categoryId);
      setDate(editingTransaction.date);
      setMonthKey(editingTransaction.date.slice(0, 7));
      setPaid(editingTransaction.paid);
    } else {
      setType('expense');
      setDescription('');
      setAmount('');
      setCategoryId(null);
      setDate(defaultDate);
      setMonthKey(defaultDate.slice(0, 7));
      setPaid(false);
    }
  }, [visible, editingTransaction, defaultDate]);

  useEffect(() => {
    if (categoryId && !filteredCategories.some((c) => c.id === categoryId)) {
      setCategoryId(null);
    }
  }, [filteredCategories, categoryId]);

  function handleSave() {
    const numericAmount = parseFloat(amount.replace(',', '.'));
    if (!description.trim()) {
      notify('Descrição obrigatória', 'Informe uma descrição para o lançamento.');
      return;
    }
    if (!numericAmount || numericAmount <= 0) {
      notify('Valor inválido', 'Informe um valor maior que zero.');
      return;
    }
    if (!categoryId) {
      notify('Categoria obrigatória', 'Selecione uma categoria.');
      return;
    }

    if (editingTransaction) {
      updateTransaction(editingTransaction.id, {
        type,
        description: description.trim(),
        amount: numericAmount,
        categoryId,
        date,
        paid,
      });
    } else {
      addTransaction({
        type,
        description: description.trim(),
        amount: numericAmount,
        categoryId,
        date,
        paid,
      });
    }
    onClose();
  }

  function handleDelete() {
    if (!editingTransaction) return;
    confirmDestructive(
      'Excluir lançamento',
      'Tem certeza que deseja excluir este lançamento?',
      () => {
        deleteTransaction(editingTransaction.id);
        onClose();
      }
    );
  }

  return (
    <FormModal
      visible={visible}
      onClose={onClose}
      title={editingTransaction ? 'Editar lançamento' : 'Novo lançamento'}
    >
      <FormField label="Tipo">
        <TypeToggle value={type} onChange={setType} />
      </FormField>

      <FormField label="Descrição">
        <StyledInput
          value={description}
          onChangeText={setDescription}
          placeholder="Ex: Supermercado, Freelance..."
        />
      </FormField>

      <FormField label="Valor (R$)">
        <StyledInput
          value={amount}
          onChangeText={setAmount}
          placeholder="0,00"
          keyboardType="decimal-pad"
        />
      </FormField>

      <FormField label="Categoria">
        <CategoryPicker
          categories={filteredCategories}
          selectedId={categoryId}
          onSelect={setCategoryId}
        />
      </FormField>

      <FormField label={`Dia · ${monthLabel(monthKey)}`}>
        <DayPicker
          value={dayOfMonth(date)}
          maxDay={daysInMonth(monthKey)}
          onChange={(day) => setDate(dateForDayInMonth(monthKey, day))}
        />
      </FormField>

      <PrimaryButton label="Salvar" onPress={handleSave} />
      {editingTransaction && <DangerButton label="Excluir lançamento" onPress={handleDelete} />}
    </FormModal>
  );
}

export function defaultNewDate() {
  return todayIso();
}
