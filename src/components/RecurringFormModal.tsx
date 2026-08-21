import { useEffect, useMemo, useState } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { confirmDestructive, notify } from '../utils/alert';
import { RecurringItem, TransactionType } from '../types';
import { CategoryPicker } from './CategoryPicker';
import { DangerButton, PrimaryButton } from './Buttons';
import { DayPicker } from './DayPicker';
import { FormField, StyledInput } from './FormField';
import { FormModal } from './FormModal';
import { TypeToggle } from './TypeToggle';

interface RecurringFormModalProps {
  visible: boolean;
  onClose: () => void;
  editingItem: RecurringItem | null;
}

export function RecurringFormModal({ visible, onClose, editingItem }: RecurringFormModalProps) {
  const categories = useFinanceStore((s) => s.categories);
  const addRecurring = useFinanceStore((s) => s.addRecurring);
  const updateRecurring = useFinanceStore((s) => s.updateRecurring);
  const deleteRecurring = useFinanceStore((s) => s.deleteRecurring);

  const [type, setType] = useState<TransactionType>('expense');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [day, setDay] = useState(5);
  const [active, setActive] = useState(true);

  const filteredCategories = useMemo(
    () => categories.filter((c) => c.type === type),
    [categories, type]
  );

  useEffect(() => {
    if (!visible) return;
    if (editingItem) {
      setType(editingItem.type);
      setName(editingItem.name);
      setAmount(String(editingItem.amount).replace('.', ','));
      setCategoryId(editingItem.categoryId);
      setDay(editingItem.day);
      setActive(editingItem.active);
    } else {
      setType('expense');
      setName('');
      setAmount('');
      setCategoryId(null);
      setDay(5);
      setActive(true);
    }
  }, [visible, editingItem]);

  useEffect(() => {
    if (categoryId && !filteredCategories.some((c) => c.id === categoryId)) {
      setCategoryId(null);
    }
  }, [filteredCategories, categoryId]);

  function handleSave() {
    const numericAmount = parseFloat(amount.replace(',', '.'));
    if (!name.trim()) {
      notify('Nome obrigatório', 'Informe um nome, ex: Salário, Aluguel...');
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

    if (editingItem) {
      updateRecurring(editingItem.id, {
        type,
        name: name.trim(),
        amount: numericAmount,
        categoryId,
        day,
        active,
      });
    } else {
      addRecurring({
        type,
        name: name.trim(),
        amount: numericAmount,
        categoryId,
        day,
        active,
      });
    }
    onClose();
  }

  function handleDelete() {
    if (!editingItem) return;
    confirmDestructive(
      'Excluir recorrência',
      'Isso não apaga lançamentos já gerados, apenas para novas gerações futuras.',
      () => {
        deleteRecurring(editingItem.id);
        onClose();
      }
    );
  }

  return (
    <FormModal
      visible={visible}
      onClose={onClose}
      title={editingItem ? 'Editar recorrência' : 'Nova recorrência'}
    >
      <FormField label="Tipo">
        <TypeToggle value={type} onChange={setType} incomeLabel="Salário/Receita" />
      </FormField>

      <FormField label="Nome">
        <StyledInput
          value={name}
          onChangeText={setName}
          placeholder="Ex: Salário, Aluguel, Netflix..."
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

      <FormField label="Dia do mês">
        <DayPicker value={day} onChange={setDay} />
      </FormField>

      <PrimaryButton label="Salvar" onPress={handleSave} />
      {editingItem && <DangerButton label="Excluir recorrência" onPress={handleDelete} />}
    </FormModal>
  );
}
