
import React, { useState } from 'react';
import { Coffee, ShoppingBag, Utensils, Trash2, Car, HeartPulse, Gamepad2, Briefcase, Package } from 'lucide-react';
import { Account, Transaction, FilterPeriod } from '../types';

interface DashboardProps {
  account: Account | null;
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onEdit: (transaction: Transaction) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ account, transactions, onDelete, onEdit }) => {
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

        {/* Account Details */}
        <div className="mb-2">
          <p className="text-blue-50 text-sm font-semibold mb-4 tracking-wide uppercase text-[10px]">Saldo por Conta</p>
          
          {account ? (
            <div className="bg-[#1c1c1e] rounded-2xl p-4 shadow-xl border border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden border border-gray-600">
                  <span className="text-lg">🏛️</span>
                </div>
                <div>
                  <p className="text-white text-sm font-bold leading-tight">{account.bank}</p>
                  <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mt-0.5">Principal</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 font-medium">Inicial</span>
                  <span className="text-white font-bold">R$ {account.initialBalance.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 font-medium">Despesas</span>
                  <span className="text-red-400 font-bold">-R$ {account.expenses.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs pt-2 border-t border-gray-800">
                  <span className="text-gray-500 font-bold">Saldo Atual</span>
                  <span className="text-[#3B7A9A] font-black">R$ {account.currentBalance.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#1c1c1e] rounded-2xl p-8 text-center border border-dashed border-gray-800 text-gray-600 italic text-sm">
              Nenhuma conta cadastrada
            </div>
          )}
        </div>
      </div>

      {/* Main Body */}
      <div className="px-4 mt-6">
        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 pb-2">
          {Object.values(FilterPeriod).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2 rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${
                activeFilter === filter 
                  ? 'bg-[#3B7A9A] text-white shadow-md' 
                  : 'bg-[#1c1c1e] text-gray-500 border border-gray-800 hover:border-gray-600'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Transactions List */}
        <div className="space-y-3 mb-24">
          <h3 className="text-white text-[10px] font-black uppercase tracking-[0.2em] mb-4 pl-1">Últimas Transações</h3>
          {transactions.map((tx) => (
            <div key={tx.id} className="relative group overflow-hidden">
              <div 
                onClick={() => onEdit(tx)}
                className="flex items-center justify-between bg-[#1c1c1e] p-4 rounded-2xl border border-gray-800 active:bg-gray-800 transition-colors z-10 relative cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#3B7A9A] bg-opacity-10 rounded-2xl flex items-center justify-center text-[#3B7A9A] border border-[#3B7A9A] border-opacity-20">
                    <TransactionIcon name={tx.icon} />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm leading-tight">{tx.description}</p>
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mt-0.5">{tx.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-black text-sm tracking-tight">R$ {tx.amount.toFixed(2)}</p>
                  <p className="text-gray-500 text-[9px] font-bold uppercase tracking-widest mt-0.5">{tx.date}</p>
                </div>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(tx.id);
                  }}
                  className="absolute right-0 top-0 bottom-0 w-20 bg-red-600 text-white flex flex-col items-center justify-center translate-x-full group-hover:translate-x-0 transition-transform duration-300 rounded-r-2xl"
                >
                  <Trash2 size={20} />
                  <span className="text-[9px] font-black uppercase mt-1 tracking-widest">Apagar</span>
                </button>
              </div>
            </div>
          ))}
          
          {transactions.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-600 text-sm italic">Nenhuma despesa registrada</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TransactionIcon: React.FC<{ name: string }> = ({ name }) => {
  switch (name) {
    case 'Coffee': return <Coffee size={22} />;
    case 'ShoppingBag': return <ShoppingBag size={22} />;
    case 'Utensils': return <Utensils size={22} />;
    case 'Car': return <Car size={22} />;
    case 'HeartPulse': return <HeartPulse size={22} />;
    case 'Gamepad2': return <Gamepad2 size={22} />;
    case 'Briefcase': return <Briefcase size={22} />;
    case 'Package': return <Package size={22} />;
    default: return <Coffee size={22} />;
  }
};

export default Dashboard;
