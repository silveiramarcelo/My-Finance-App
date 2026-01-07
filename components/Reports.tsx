
import React, { useState } from 'react';
import { Coffee, ShoppingBag, Utensils, Car, HeartPulse, Gamepad2, Briefcase, Package, TrendingUp, Building2 } from 'lucide-react';
import { Account, Transaction } from '../types';

interface ReportsProps {
  accounts: Account[];
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
}

const Reports: React.FC<ReportsProps> = ({ accounts, transactions, onEdit }) => {
  const [selectedAccountId, setSelectedAccountId] = useState(accounts[0]?.id || '');
  
  const account = accounts.find(a => a.id === selectedAccountId) || accounts[0];

  // Filter transactions for the selected account
  const accountTransactions = transactions.filter(tx => tx.accountId === (account?.id || ''));

  // Aggregate expenses by category for the selected account
  const expensesByCategory = accountTransactions
    .filter(tx => tx.type === 'expense')
    .reduce((acc, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
      return acc;
    }, {} as Record<string, number>);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  if (!account) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full bg-[#121212] p-10 text-center">
        <p className="text-gray-500 italic">Cadastre uma conta para visualizar os relatórios.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-[#121212]">
      {/* Header */}
      <div className="bg-[#0a84a5] p-6 pt-10 pb-6 shadow-md">
        <h1 className="text-xl font-bold text-white">Relatórios</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Account Dynamic Selection */}
        <section>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-3 px-1">Selecione uma Conta</p>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {accounts.map((acc) => (
              <button
                key={acc.id}
                onClick={() => setSelectedAccountId(acc.id)}
                className={`flex-shrink-0 px-5 py-2.5 rounded-full text-xs font-bold border transition-all ${
                  selectedAccountId === acc.id
                    ? 'bg-[#0a84a5] border-[#0a84a5] text-white shadow-lg scale-105'
                    : 'bg-[#1c1c1e] border-gray-800 text-gray-500 hover:border-gray-700'
                }`}
              >
                {acc.bank}
              </button>
            ))}
          </div>
        </section>

        {/* Metric Cards Row */}
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          <div className="flex-shrink-0 w-36 h-24 bg-white rounded-2xl shadow-xl flex flex-col items-center justify-center p-4">
             <span className="text-gray-400 text-[9px] font-black uppercase tracking-widest mb-1">Entradas</span>
             <span className="text-green-600 font-black text-sm">{formatCurrency(account.income)}</span>
          </div>
          <div className="flex-shrink-0 w-36 h-24 bg-[#0a84a5] rounded-2xl shadow-xl flex flex-col items-center justify-center p-4">
             <span className="text-white text-opacity-60 text-[9px] font-black uppercase tracking-widest mb-1">Saídas</span>
             <span className="text-white font-black text-sm">{formatCurrency(account.expenses)}</span>
          </div>
          <div className="flex-shrink-0 w-36 h-24 bg-[#1c1c1e] rounded-2xl shadow-xl border border-gray-800 flex flex-col items-center justify-center p-4">
             <span className="text-gray-500 text-[9px] font-black uppercase tracking-widest mb-1">Saldo</span>
             <span className="text-white font-black text-sm">{formatCurrency(account.currentBalance)}</span>
          </div>
        </div>

        {/* Transaction History Section */}
        <section>
          <h2 className="text-white text-[10px] font-black uppercase tracking-[0.2em] mb-4 pl-1">
            Histórico da Conta ({accountTransactions.length})
          </h2>
          <div className="space-y-3">
            {accountTransactions.map((tx) => (
              <div 
                key={tx.id} 
                onClick={() => onEdit(tx)}
                className="bg-[#1c1c1e] p-4 rounded-2xl border border-gray-800 flex items-center justify-between cursor-pointer active:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                     tx.type === 'income' 
                      ? 'bg-green-500 bg-opacity-10 border-green-500 border-opacity-20 text-green-500' 
                      : 'bg-gray-800 bg-opacity-50 border-gray-700 text-[#0a84a5]'
                  }`}>
                    <ReportIcon name={tx.icon} size={18} />
                  </div>
                  <div>
                    <p className="text-white text-sm font-bold tracking-tight">{tx.description}</p>
                    <p className="text-gray-500 text-[9px] font-bold uppercase tracking-wider">
                      {tx.category} • {tx.date}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`${tx.type === 'income' ? 'text-green-500' : 'text-red-500'} font-black text-sm tracking-tight`}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </p>
                </div>
              </div>
            ))}
            {accountTransactions.length === 0 && (
              <div className="p-8 text-center text-gray-600 text-[10px] uppercase font-bold tracking-widest italic bg-[#1c1c1e] rounded-2xl border border-dashed border-gray-800">
                Nenhuma movimentação nesta conta
              </div>
            )}
          </div>
        </section>

        {/* Expenses by Category Section */}
        <section className="pb-10">
          <h2 className="text-white text-[10px] font-black uppercase tracking-[0.2em] mb-4 pl-1">Gastos por Categoria</h2>
          <div className="bg-[#1c1c1e] rounded-2xl border border-gray-800 overflow-hidden">
            {Object.entries(expensesByCategory).map(([cat, amount], index, arr) => (
              <div key={cat} className={`${index !== arr.length - 1 ? 'border-b border-gray-800' : ''}`}>
                <div className="flex items-center justify-between p-4 active:bg-gray-800 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#0a84a5]"></div>
                    <ReportIcon name={catIconMap[cat] || 'Coffee'} size={16} className="text-gray-400" />
                    <span className="text-gray-300 text-xs font-bold uppercase tracking-wider">{cat}</span>
                  </div>
                  <span className="text-red-500 text-sm font-black tracking-tight">{formatCurrency(amount as number)}</span>
                </div>
              </div>
            ))}
            {Object.keys(expensesByCategory).length === 0 && (
              <div className="p-8 text-center text-gray-600 text-[10px] uppercase font-bold tracking-widest italic">
                Sem despesas categorizadas
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

const catIconMap: Record<string, string> = {
  'Alimentação': 'Utensils',
  'Transporte': 'Car',
  'Saúde': 'HeartPulse',
  'Lazer': 'Gamepad2',
  'Trabalho': 'Briefcase',
  'Salário': 'Briefcase',
  'Investimentos': 'TrendingUp',
  'Outros': 'Package'
};

const ReportIcon: React.FC<{ name: string; size?: number; className?: string }> = ({ name, size = 24, className }) => {
  switch (name) {
    case 'Coffee': return <Coffee size={size} className={className} />;
    case 'ShoppingBag': return <ShoppingBag size={size} className={className} />;
    case 'Utensils': return <Utensils size={size} className={className} />;
    case 'Car': return <Car size={size} className={className} />;
    case 'HeartPulse': return <HeartPulse size={size} className={className} />;
    case 'Gamepad2': return <Gamepad2 size={size} className={className} />;
    case 'Briefcase': return <Briefcase size={size} className={className} />;
    case 'Package': return <Package size={size} className={className} />;
    case 'TrendingUp': return <TrendingUp size={size} className={className} />;
    default: return <Coffee size={size} className={className} />;
  }
};

export default Reports;
