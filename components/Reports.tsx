
import React from 'react';
import { Coffee, ShoppingBag, Utensils, Car, HeartPulse, Gamepad2, Briefcase, Package } from 'lucide-react';
import { Account, Transaction } from '../types';

interface ReportsProps {
  account: Account;
  transactions: Transaction[];
}

const Reports: React.FC<ReportsProps> = ({ account, transactions }) => {
  // Aggregate expenses by category
  const expensesByCategory = transactions.reduce((acc, tx) => {
    acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="flex flex-col min-h-full bg-[#121212]">
      {/* Header */}
      <div className="bg-[#0a84a5] p-6 pt-10 pb-6 shadow-md">
        <h1 className="text-xl font-bold text-white">Relatórios</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Account Selection */}
        <section>
          <p className="text-gray-400 text-xs font-semibold mb-3">Selecione uma Conta</p>
          <div className="inline-flex items-center bg-[#0a84a5] bg-opacity-80 px-4 py-2 rounded-full text-xs font-medium text-white shadow-sm">
            {account.name}
          </div>
        </section>

        {/* Account Info Card */}
        <div className="flex items-center gap-4 bg-[#121212] p-2">
           <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700">
              <span className="text-xl">🏛️</span>
           </div>
           <div>
              <p className="text-white font-bold text-sm leading-tight">{account.name}</p>
              <p className="text-gray-500 text-[10px]">{account.bank} · 123</p>
           </div>
        </div>

        {/* Metric Cards Row */}
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          <div className="flex-shrink-0 w-32 h-20 bg-white rounded-xl shadow-md"></div>
          <div className="flex-shrink-0 w-32 h-20 bg-white rounded-xl shadow-md"></div>
          <div className="flex-shrink-0 w-32 h-20 bg-white rounded-xl shadow-md"></div>
        </div>

        {/* Transaction History Section */}
        <section>
          <h2 className="text-white text-xs font-bold mb-4">
            Histórico de Transações ({transactions.length})
          </h2>
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div key={tx.id} className="bg-[#1c1c1e] p-4 rounded-2xl border border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-800 bg-opacity-50 rounded-full flex items-center justify-center border border-gray-700">
                    <ReportIcon name={tx.icon} size={18} className="text-gray-300" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{tx.description}</p>
                    <p className="text-gray-500 text-[10px]">
                      {tx.category} • {tx.date}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-red-500 font-bold text-sm">-R$ {tx.amount.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Expenses by Category Section */}
        <section className="pb-8">
          <h2 className="text-white text-xs font-bold mb-4">Gastos por Categoria</h2>
          <div className="bg-[#1c1c1e] rounded-2xl border border-gray-800 overflow-hidden">
            {Object.entries(expensesByCategory).map(([cat, amount], index, arr) => (
              <div key={cat} className={`${index !== arr.length - 1 ? 'border-b border-gray-800' : ''}`}>
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                    <ReportIcon name={catIconMap[cat] || 'Coffee'} size={16} className="text-gray-400" />
                    <span className="text-gray-300 text-sm font-medium">{cat}</span>
                  </div>
                  {/* Fixed: Property 'toFixed' does not exist on type 'unknown' by casting to number */}
                  <span className="text-red-500 text-sm font-bold">R$ {(amount as number).toFixed(2)}</span>
                </div>
              </div>
            ))}
            {Object.keys(expensesByCategory).length === 0 && (
              <div className="p-4 text-center text-gray-600 text-xs italic">
                Sem dados de categoria
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
    default: return <Coffee size={size} className={className} />;
  }
};

export default Reports;
