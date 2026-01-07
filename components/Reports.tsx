
import React from 'react';
import { Coffee, ShoppingBag, Utensils, Car, HeartPulse, Gamepad2, Briefcase, Package, TrendingUp } from 'lucide-react';
import { Account, Transaction } from '../types';

interface ReportsProps {
  account: Account | null;
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
}

const Reports: React.FC<ReportsProps> = ({ account, transactions, onEdit }) => {
  // Aggregate expenses by category (Filter only expenses)
  const expensesByCategory = transactions
    .filter(tx => tx.type === 'expense')
    .reduce((acc, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
      return acc;
    }, {} as Record<string, number>);

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
        {/* Account Selection */}
        <section>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-3">Selecione uma Conta</p>
          <div className="inline-flex items-center bg-[#0a84a5] px-5 py-2.5 rounded-full text-xs font-bold text-white shadow-lg border border-[#ffffff20]">
            {account.bank}
          </div>
        </section>

        {/* Account Info Card */}
        <div className="flex items-center gap-4 bg-[#1c1c1e] p-4 rounded-2xl border border-gray-800">
           <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center border border-gray-700">
              <span className="text-xl">🏛️</span>
           </div>
           <div>
              <p className="text-white font-black text-sm leading-tight tracking-tight">{account.bank}</p>
              <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mt-1">Status: Ativo</p>
           </div>
        </div>

        {/* Metric Cards Row */}
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          <div className="flex-shrink-0 w-36 h-24 bg-white rounded-2xl shadow-xl flex flex-col items-center justify-center p-4">
             <span className="text-gray-400 text-[9px] font-black uppercase tracking-widest mb-1">Total Entradas</span>
             <span className="text-green-600 font-black text-lg">R$ {account.income.toFixed(2)}</span>
          </div>
          <div className="flex-shrink-0 w-36 h-24 bg-[#0a84a5] rounded-2xl shadow-xl flex flex-col items-center justify-center p-4">
             <span className="text-white text-opacity-60 text-[9px] font-black uppercase tracking-widest mb-1">Total Saídas</span>
             <span className="text-white font-black text-lg">R$ {account.expenses.toFixed(2)}</span>
          </div>
          <div className="flex-shrink-0 w-36 h-24 bg-[#1c1c1e] rounded-2xl shadow-xl border border-gray-800 flex flex-col items-center justify-center p-4">
             <span className="text-gray-500 text-[9px] font-black uppercase tracking-widest mb-1">Saldo Final</span>
             <span className="text-white font-black text-lg">R$ {account.currentBalance.toFixed(2)}</span>
          </div>
        </div>

        {/* Transaction History Section */}
        <section>
          <h2 className="text-white text-[10px] font-black uppercase tracking-[0.2em] mb-4 pl-1">
            Histórico ({transactions.length})
          </h2>
          <div className="space-y-3">
            {transactions.map((tx) => (
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
                    <ReportIcon name={tx.icon} size={18} className="" />
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
                    {tx.type === 'income' ? '+' : '-'}R$ {tx.amount.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
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
                  <span className="text-red-500 text-sm font-black tracking-tight">R$ {(amount as number).toFixed(2)}</span>
                </div>
              </div>
            ))}
            {Object.keys(expensesByCategory).length === 0 && (
              <div className="p-8 text-center text-gray-600 text-[10px] uppercase font-bold tracking-widest italic">
                Nenhum dado disponível
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
