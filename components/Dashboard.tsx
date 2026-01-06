
import React, { useState } from 'react';
import { Coffee, ShoppingBag, Utensils, Trash2, Car, HeartPulse, Gamepad2, Briefcase, Package } from 'lucide-react';
import { Account, Transaction, FilterPeriod } from '../types';

interface DashboardProps {
  account: Account | null;
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ account, transactions, onDelete }) => {
  const [activeFilter, setActiveFilter] = useState<FilterPeriod>(FilterPeriod.ESTE_MES);

  return (
    <div className="flex flex-col min-h-full">
      {/* Header Section */}
      <div className="bg-[#3B7A9A] p-6 pt-10 pb-12 rounded-b-[40px] shadow-lg">
        <h1 className="text-2xl font-bold text-white mb-6">Despesas</h1>
        
        <div className="mb-6">
          <p className="text-blue-100 text-sm font-medium mb-1">Saldo Total</p>
          <p className="text-4xl font-bold text-white tracking-tight">
            R$ {account ? account.currentBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}
          </p>
        </div>

        {/* Action Buttons Row */}
        <div className="flex gap-4 mb-8">
          <div className="flex-1 bg-white h-12 rounded-xl opacity-90 shadow-sm"></div>
          <div className="flex-1 bg-white h-12 rounded-xl opacity-90 shadow-sm"></div>
        </div>

        {/* Account Details */}
        <div className="mb-2">
          <p className="text-blue-50 text-sm font-semibold mb-4">Saldo por Conta</p>
          
          {account ? (
            <div className="bg-[#1c1c1e] rounded-2xl p-4 shadow-xl border border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                  <img src={`https://picsum.photos/seed/${account.bank}/40/40`} alt="Bank Logo" />
                </div>
                <div>
                  <p className="text-white text-sm font-bold leading-tight">{account.name}</p>
                  <p className="text-gray-500 text-xs">{account.bank}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Inicial</span>
                  <span className="text-white font-medium">R$ {account.initialBalance.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Despesas</span>
                  <span className="text-red-400 font-medium">-R$ {account.expenses.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs pt-1 border-t border-gray-800">
                  <span className="text-gray-400">Saldo</span>
                  <span className="text-[#3B7A9A] font-bold">R$ {account.currentBalance.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#1c1c1e] rounded-2xl p-6 text-center border border-dashed border-gray-800 text-gray-600 italic text-sm">
              Nenhuma conta ativa
            </div>
          )}
        </div>
      </div>

      {/* Main Body */}
      <div className="px-4 -mt-4">
        {/* Large White Placeholder Card */}
        <div className="bg-white w-full h-32 rounded-3xl shadow-xl mb-6"></div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 pb-2">
          {Object.values(FilterPeriod).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                activeFilter === filter 
                  ? 'bg-[#3B7A9A] text-white' 
                  : 'bg-[#1c1c1e] text-gray-400 border border-gray-800'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Transactions List */}
        <div className="space-y-3 mb-24">
          {transactions.map((tx) => (
            <div key={tx.id} className="relative group overflow-hidden">
              <div className="flex items-center justify-between bg-[#1c1c1e] p-4 rounded-2xl border border-gray-800 active:bg-gray-800 transition-colors z-10 relative">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-400 bg-opacity-80 rounded-full flex items-center justify-center text-white">
                    <TransactionIcon name={tx.icon} />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{tx.description}</p>
                    <p className="text-gray-500 text-[10px]">{tx.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold text-sm">R$ {tx.amount.toFixed(2)}</p>
                  <p className="text-gray-500 text-[10px] uppercase">{tx.date}</p>
                </div>
                
                <button 
                  onClick={() => onDelete(tx.id)}
                  className="absolute right-0 top-0 bottom-0 w-20 bg-red-500 text-white flex flex-col items-center justify-center translate-x-full group-hover:translate-x-0 transition-transform duration-300 rounded-r-2xl"
                >
                  <Trash2 size={20} />
                  <span className="text-[10px] font-bold mt-1">Deletar</span>
                </button>
              </div>
            </div>
          ))}
          
          {transactions.length === 0 && (
            <div className="text-center py-10 text-gray-600">
              Nenhuma despesa registrada
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TransactionIcon: React.FC<{ name: string }> = ({ name }) => {
  switch (name) {
    case 'Coffee': return <Coffee size={24} />;
    case 'ShoppingBag': return <ShoppingBag size={24} />;
    case 'Utensils': return <Utensils size={24} />;
    case 'Car': return <Car size={24} />;
    case 'HeartPulse': return <HeartPulse size={24} />;
    case 'Gamepad2': return <Gamepad2 size={24} />;
    case 'Briefcase': return <Briefcase size={24} />;
    case 'Package': return <Package size={24} />;
    default: return <Coffee size={24} />;
  }
};

export default Dashboard;
