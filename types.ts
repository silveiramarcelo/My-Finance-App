
export interface Transaction {
  id: string;
  description: string;
  category: string;
  amount: number;
  date: string;
  icon: string;
  accountId: string;
}

export interface Account {
  id: string;
  name: string;
  bank: string;
  accountNumber: string;
  initialBalance: number;
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
