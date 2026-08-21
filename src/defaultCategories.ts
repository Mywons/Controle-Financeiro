import { Category } from './types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'salario', name: 'Salário', icon: '💼', color: '#16C784', type: 'income' },
  { id: 'renda-extra', name: 'Renda extra', icon: '➕', color: '#22C55E', type: 'income' },
  { id: 'moradia', name: 'Moradia', icon: '🏠', color: '#5B5FEF', type: 'expense' },
  { id: 'alimentacao', name: 'Alimentação', icon: '🍽️', color: '#FF6B6B', type: 'expense' },
  { id: 'transporte', name: 'Transporte', icon: '🚗', color: '#FFB020', type: 'expense' },
  { id: 'saude', name: 'Saúde', icon: '💊', color: '#00BCD4', type: 'expense' },
  { id: 'lazer', name: 'Lazer', icon: '🎮', color: '#EC4899', type: 'expense' },
  { id: 'educacao', name: 'Educação', icon: '📚', color: '#8B5CF6', type: 'expense' },
  { id: 'assinaturas', name: 'Assinaturas', icon: '📱', color: '#F97316', type: 'expense' },
  { id: 'compras', name: 'Compras', icon: '🛍️', color: '#10B981', type: 'expense' },
  { id: 'outros', name: 'Outros', icon: '🔖', color: '#8A8AA0', type: 'expense' },
];
