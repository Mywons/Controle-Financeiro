export function formatCurrency(value: number): string {
  const sign = value < 0 ? '-' : '';
  const abs = Math.abs(value);
  return `${sign}R$ ${abs.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatCompact(value: number): string {
  return value.toLocaleString('pt-BR', { maximumFractionDigits: 0 });
}

export function formatPercent(value: number): string {
  if (!isFinite(value)) return '0%';
  return `${Math.round(value)}%`;
}

export function parseAmountInput(text: string): number {
  const normalized = text.replace(/[^0-9,.-]/g, '').replace(',', '.');
  const value = parseFloat(normalized);
  return isNaN(value) ? 0 : value;
}
