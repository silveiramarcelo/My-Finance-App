
import React, { useState } from 'react';
import { Coffee, ShoppingBag, Utensils, Trash2, Car, HeartPulse, Gamepad2, Briefcase, Package, TrendingUp, ArrowUpCircle, ArrowDownCircle, Building2, ChevronRight } from 'lucide-react';
import { Account, Transaction, FilterPeriod } from '../types';

interface DashboardProps {
  accounts: Account[];
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onEdit: (transaction: Transaction) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ accounts, transactions, onDelete, onEdit }) => {
  const [activeFilter, setActiveFilter] = useState<FilterPeriod>(FilterPeriod.ESTE_MES);

  // Calculate aggregated totals
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.currentBalance, 0);
  const totalIncome = accounts.reduce((sum, acc) => sum + acc.income, 0);
  const totalExpenses = accounts.reduce((sum, acc) => sum + acc.expenses, 0);

  return (
    <div className="flex flex-col min-h-full pb-20">
      {/* Header Section */}
      <div className="bg-[#3B7A9A] p-6 pt-10 pb-10 rounded-b-[40px] shadow-lg relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 -mr-20 -mt-20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10">
          <h1 className="text-2xl font-bold text-white mb-6">Finanças</h1>
          
          <div className="mb-8">
            <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-1 opacity-80">Saldo Total Consolidado</p>
            <p className="text-4xl font-black text-white tracking-tight">
              R$ {totalBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>

          {/* Income vs Expenses Summary */}
          <div className="flex gap-4">
            <div className="flex-1 bg-white bg-opacity-10 rounded-2xl p-4 backdrop-blur-md border border-white border-opacity-10 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-green-400 bg-opacity-20 flex items-center justify-center">
                  <ArrowUpCircle size={16} className="text-green-400" />
                </div>
                <span className="text-green-100 text-[10px] font-black uppercase tracking-wider opacity-70">Entradas</span>
              </div>
              <p className="text-white font-black text-xl">
                R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="flex-1 bg-white bg-opacity-10 rounded-2xl p-4 backdrop-blur-md border border-white border-opacity-10 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-red-400 bg-opacity-20 flex items-center justify-center">
                  <ArrowDownCircle size={16} className="text-red-400" />
                </div>
                <span className="text-red-100 text-[10px] font-black uppercase tracking-wider opacity-70">Saídas</span>
              </div>
              <p className="text-white font-black text-xl">
                R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Accounts Quick View Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between px-6 mb-4">
          <h3 className="text-white text-[11px] font-black uppercase tracking-[0.2em]">Minhas Contas</h3>
          <span className="text-gray-500 text-[10px] font-bold uppercase">{accounts.length}</span>
        </div>
        
        <div className="flex gap-3 overflow-x-auto no-scrollbar px-6 pb-4 snap-x snap-mandatory">
          {accounts.map((acc) => {
            return (
              <div 
                key={acc.id} 
                className="flex-shrink-0 w-44 snap-center bg-[#1c1c1e] p-4 rounded-[24px] border border-gray-800 relative overflow-hidden shadow-xl"
              >
                {/* Visual Accent - Top Gradient based on account color */}
                <div 
                  className="absolute top-0 left-0 right-0 h-1 opacity-80" 
                  style={{ backgroundColor: acc.color || '#3B7A9A' }}
                ></div>
                
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-gray-800 flex items-center justify-center border border-gray-700 shadow-inner">
                      <Building2 size={16} className="text-gray-400" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-white text-xs font-black tracking-tight block leading-tight truncate">{acc.bank}</span>
                    </div>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                </div>
                
                <div className="space-y-0.5">
                  <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest">Saldo</p>
                  <p className="text-white font-black text-lg tracking-tight truncate">
                    R$ {acc.currentBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            );
          })}
          
          {/* Empty State / Add Account Shortcut */}
          {accounts.length === 0 && (
            <div className="flex-shrink-0 w-44 h-28 bg-[#1c1c1e] border-2 border-dashed border-gray-800 rounded-[24px] flex flex-col items-center justify-center p-4 text-center group cursor-pointer active:scale-95 transition-all">
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center mb-2 group-hover:bg-gray-700">
                <Building2 size={16} className="text-gray-600" />
              </div>
              <p className="text-gray-500 text-[9px] font-bold uppercase tracking-widest">Nova Conta</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Body - Transactions List */}
      <div className="px-6 mt-8">
        {/* Filters Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white text-[11px] font-black uppercase tracking-[0.2em]">Movimentações</h3>
          <div className="flex gap-2">
            <button className="p-1.5 bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors">
              <ChevronRight size={16} className="rotate-90" />
            </button>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar mb-8">
          {Object.values(FilterPeriod).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2.5 rounded-2xl text-[11px] font-bold whitespace-nowrap transition-all border ${
                activeFilter === filter 
                  ? 'bg-white text-black border-white shadow-[0_4px_12px_rgba(255,255,255,0.1)] scale-105' 
                  : 'bg-[#1c1c1e] text-gray-500 border-gray-800 hover:border-gray-600'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Transactions List */}
        <div className="space-y-4">
          {transactions.map((tx) => (
            <div key={tx.id} className="relative group">
              <div 
                onClick={() => onEdit(tx)}
                className="flex items-center justify-between bg-[#1c1c1e] p-5 rounded-3xl border border-gray-800 active:bg-gray-800 transition-all z-10 relative cursor-pointer hover:border-gray-700"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border bg-opacity-10 ${
                    tx.type === 'income' 
                      ? 'bg-green-500 text-green-500 border-green-500 border-opacity-20 shadow-[0_0_15px_rgba(34,197,94,0.05)]' 
                      : 'bg-[#3B7A9A] text-[#3B7A9A] border-[#3B7A9A] border-opacity-20 shadow-[0_0_15px_rgba(59,122,154,0.05)]'
                  }`}>
                    <TransactionIcon name={tx.icon} />
                  </div>
                  <div>
                    <p className="text-white font-black text-sm leading-tight tracking-tight mb-0.5">{tx.description}</p>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.1em]">{tx.category}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`font-black text-base tracking-tighter ${tx.type === 'income' ? 'text-green-500' : 'text-white'}`}>
                    {tx.type === 'income' ? '+' : '-'} R$ {tx.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <div className="flex flex-col items-end gap-0.5 mt-0.5">
                    <p className="text-gray-500 text-[9px] font-bold uppercase tracking-widest">{tx.date}</p>
                    {tx.dueDate && (
                       <p className="text-orange-400 text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                         <span className="w-1 h-1 rounded-full bg-orange-400"></span>
                         Vence: {tx.dueDate}
                       </p>
                    )}
                  </div>
                </div>
                
                {/* Swipe/Hover Delete Action */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(tx.id);
                  }}
                  className="absolute right-0 top-0 bottom-0 w-24 bg-red-600 text-white flex flex-col items-center justify-center translate-x-full group-hover:translate-x-0 transition-transform duration-300 rounded-r-3xl border-l border-red-500 border-opacity-20"
                >
                  <Trash2 size={20} />
                  <span className="text-[9px] font-black uppercase mt-1.5 tracking-[0.15em]">Excluir</span>
                </button>
              </div>
            </div>
          ))}
          
          {transactions.length === 0 && (
            <div className="text-center py-16 bg-[#1c1c1e] rounded-3xl border border-dashed border-gray-800">
              <p className="text-gray-600 text-sm font-bold uppercase tracking-widest italic">Nada para mostrar aqui</p>
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
    case 'TrendingUp': return <TrendingUp size={24} />;
    default: return <Coffee size={24} />;
  }
};

export default Dashboard;
