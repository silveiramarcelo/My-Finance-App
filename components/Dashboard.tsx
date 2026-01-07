
import React from 'react';
import { Coffee, ShoppingBag, Utensils, Car, HeartPulse, Gamepad2, Briefcase, Package, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Account, Transaction } from '../types';

interface DashboardProps {
  accounts: Account[];
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onEdit: (transaction: Transaction) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ accounts, transactions, onDelete, onEdit }) => {
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.currentBalance, 0);
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="flex flex-col space-y-8 p-6 pt-12 animate-in fade-in duration-500">
      {/* Main Header */}
      <header className="relative">
        <p className="text-slate-400 text-sm font-medium">Patrimônio Total</p>
        <h1 className="text-4xl font-extrabold tracking-tight mt-1 text-white">
          {formatCurrency(totalBalance)}
        </h1>
      </header>

      {/* Mini Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-3xl">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-emerald-500/20 rounded-full text-emerald-400">
              <ArrowUpRight size={14} />
            </div>
            <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider">Mês Atual</span>
          </div>
          <p className="text-lg font-bold text-emerald-50">{formatCurrency(totalIncome)}</p>
        </div>
        
        <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-3xl">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-rose-500/20 rounded-full text-rose-400">
              <ArrowDownRight size={14} />
            </div>
            <span className="text-rose-400 text-[10px] font-bold uppercase tracking-wider">Gastos</span>
          </div>
          <p className="text-lg font-bold text-rose-50">{formatCurrency(totalExpenses)}</p>
        </div>
      </div>

      {/* Transactions Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-slate-100 font-bold text-lg">Histórico Online</h3>
          <button className="text-blue-400 text-xs font-bold px-3 py-1 bg-blue-400/10 rounded-lg">Filtros</button>
        </div>

        <div className="space-y-3">
          {transactions.slice(0, 15).map((tx) => (
            <div 
              key={tx.id} 
              onClick={() => onEdit(tx)}
              className="bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] p-4 rounded-[24px] flex items-center justify-between transition-all active:scale-[0.98] cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border border-white/5 ${tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>
                  <TransactionIcon name={tx.icon} />
                </div>
                <div>
                  <p className="text-slate-100 font-semibold text-sm leading-none">{tx.description}</p>
                  <p className="text-slate-500 text-[10px] font-bold uppercase mt-1.5 tracking-wider">{tx.category}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold text-sm ${tx.type === 'income' ? 'text-emerald-400' : 'text-slate-100'}`}>
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                </p>
                <p className="text-slate-600 text-[9px] font-medium mt-1 uppercase tracking-tighter">{tx.date}</p>
              </div>
            </div>
          ))}
          
          {transactions.length === 0 && (
            <div className="py-12 text-center border-2 border-dashed border-white/5 rounded-3xl">
              <p className="text-slate-600 text-sm font-medium">Sincronizando com o banco de dados...</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

const TransactionIcon: React.FC<{ name: string }> = ({ name }) => {
  switch (name) {
    case 'Coffee': return <Coffee size={20} />;
    case 'ShoppingBag': return <ShoppingBag size={20} />;
    case 'Utensils': return <Utensils size={20} />;
    case 'Car': return <Car size={20} />;
    case 'HeartPulse': return <HeartPulse size={20} />;
    case 'Gamepad2': return <Gamepad2 size={20} />;
    case 'Briefcase': return <Briefcase size={20} />;
    case 'Package': return <Package size={20} />;
    case 'TrendingUp': return <TrendingUp size={20} />;
    default: return <Coffee size={20} />;
  }
};

export default Dashboard;
