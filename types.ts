
export interface Transaction {
  id: string;
  description: string;
  category: string;
  amount: number;
  date: string;
  dueDate?: string;
  icon: string;
  accountId: string;
  type: 'income' | 'expense';
  paymentMethod?: 'Crédito' | 'Débito';
  installments?: number;
}

export interface PlannedExpense {
  id: string;
  description: string;
  category: string;
  amount: number;
  month: number; // 0-11
  year: number;
  accountId: string;
  icon: string;
  status: 'pending' | 'paid';
}

export interface Account {
  id: string;
  bank: string;
  initialBalance: number;
  income: number;
  expenses: number;
  currentBalance: number;
  color?: string;
}

export enum FilterPeriod {
  HOJE = 'Hoje',
  ESTA_SEMANA = 'Esta Semana',
  ESTE_MES = 'Este Mês',
  TODAS = 'Todas'
}

export const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];
