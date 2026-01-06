
import React, { useState } from 'react';
import { Home, Wallet, BarChart3, Settings, Plus } from 'lucide-react';
import { Account, Transaction } from './types';
import Dashboard from './components/Dashboard';
import NewExpenseForm from './components/NewExpenseForm';
import Reports from './components/Reports';
import AccountsList from './components/AccountsList';
import NewAccountForm from './components/NewAccountForm';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showNewExpense, setShowNewExpense] = useState(false);
  const [showNewAccount, setShowNewAccount] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      description: 'Café',
      category: 'Alimentação',
      amount: 10.00,
      date: '05/01/2026',
      icon: 'Coffee',
      accountId: 'acc-1'
    }
  ]);

  const [accounts, setAccounts] = useState<Account[]>([
    {
      id: 'acc-1',
      bank: 'Santander',
      initialBalance: 5000.00,
      expenses: 10.00,
      currentBalance: 4990.00,
      color: '#CC0000'
    }
  ]);

  const handleDeleteTransaction = (id: string) => {
    const tx = transactions.find(t => t.id === id);
    if (tx) {
      setAccounts(prev => prev.map(acc => 
        acc.id === tx.accountId 
          ? { ...acc, expenses: acc.expenses - tx.amount, currentBalance: acc.currentBalance + tx.amount }
          : acc
      ));
    }
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleSaveTransaction = (newTx: Omit<Transaction, 'id'>) => {
    if (editingTransaction) {
      // Update existing
      const oldTx = editingTransaction;
      setTransactions(prev => prev.map(t => t.id === oldTx.id ? { ...newTx, id: oldTx.id } : t));
      
      // Update account balance (revert old, apply new)
      setAccounts(prev => prev.map(acc => {
        if (acc.id === oldTx.accountId && acc.id === newTx.accountId) {
          // Same account, adjust by difference
          const diff = newTx.amount - oldTx.amount;
          return { ...acc, expenses: acc.expenses + diff, currentBalance: acc.currentBalance - diff };
        } else if (acc.id === oldTx.accountId) {
          // Left this account
          return { ...acc, expenses: acc.expenses - oldTx.amount, currentBalance: acc.currentBalance + oldTx.amount };
        } else if (acc.id === newTx.accountId) {
          // Joined this account
          return { ...acc, expenses: acc.expenses + newTx.amount, currentBalance: acc.currentBalance - newTx.amount };
        }
        return acc;
      }));
      setEditingTransaction(null);
    } else {
      // Create new
      const tx: Transaction = {
        ...newTx,
        id: Math.random().toString(36).substr(2, 9)
      };
      setTransactions(prev => [tx, ...prev]);
      setAccounts(prev => prev.map(acc => 
        acc.id === tx.accountId 
          ? { ...acc, expenses: acc.expenses + tx.amount, currentBalance: acc.currentBalance - tx.amount }
          : acc
      ));
    }
    setShowNewExpense(false);
  };

  const handleSaveAccount = (newAcc: Omit<Account, 'id' | 'expenses' | 'currentBalance'>) => {
    const account: Account = {
      ...newAcc,
      id: `acc-${Math.random().toString(36).substr(2, 9)}`,
      expenses: 0,
      currentBalance: newAcc.initialBalance
    };
    setAccounts(prev => [...prev, account]);
    setShowNewAccount(false);
  };

  const handleDeleteAccount = (id: string) => {
    setAccounts(prev => prev.filter(a => a.id !== id));
    setTransactions(prev => prev.filter(t => t.accountId !== id));
  };

  const openEditExpense = (tx: Transaction) => {
    setEditingTransaction(tx);
    setShowNewExpense(true);
  };

  if (showNewExpense) {
    return (
      <NewExpenseForm 
        accounts={accounts}
        initialTransaction={editingTransaction || undefined}
        onClose={() => {
          setShowNewExpense(false);
          setEditingTransaction(null);
        }} 
        onSave={handleSaveTransaction} 
      />
    );
  }

  if (showNewAccount) {
    return (
      <NewAccountForm 
        onClose={() => setShowNewAccount(false)}
        onSave={handleSaveAccount}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[#121212] relative overflow-hidden shadow-2xl text-white">
      {/* Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {activeTab === 'home' && (
          <Dashboard 
            account={accounts[0] || null} 
            transactions={transactions} 
            onDelete={handleDeleteTransaction}
            onEdit={openEditExpense}
          />
        )}
        {activeTab === 'contas' && (
          <AccountsList 
            accounts={accounts} 
            onDelete={handleDeleteAccount}
            onAddNew={() => setShowNewAccount(true)}
          />
        )}
        {activeTab === 'relatorios' && (
          <Reports 
            account={accounts[0] || null} 
            transactions={transactions} 
            onEdit={openEditExpense}
          />
        )}
        {activeTab === 'settings' && (
          <div className="p-8 text-center text-gray-500 mt-20">
            Página em construção
          </div>
        )}
      </main>

      {/* Floating Action Button (Only on Home) */}
      {activeTab === 'home' && (
        <button 
          className="fixed bottom-24 right-6 w-14 h-14 bg-[#3B7A9A] rounded-full flex items-center justify-center shadow-lg text-white active:scale-95 transition-transform z-50"
          onClick={() => setShowNewExpense(true)}
        >
          <Plus size={32} />
        </button>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full max-w-md bg-[#1c1c1e] border-t border-gray-800 flex justify-around items-center py-3 z-50">
        <NavItem 
          icon={<Home size={24} />} 
          label="Home" 
          active={activeTab === 'home'} 
          onClick={() => setActiveTab('home')} 
        />
        <NavItem 
          icon={<Wallet size={24} />} 
          label="Contas" 
          active={activeTab === 'contas'} 
          onClick={() => setActiveTab('contas')} 
        />
        <NavItem 
          icon={<BarChart3 size={24} />} 
          label="Relatórios" 
          active={activeTab === 'relatorios'} 
          onClick={() => setActiveTab('relatorios')} 
        />
        <NavItem 
          icon={<Settings size={24} />} 
          label="Settings" 
          active={activeTab === 'settings'} 
          onClick={() => setActiveTab('settings')} 
        />
      </nav>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-[#0a84a5]' : 'text-gray-500'}`}
  >
    {icon}
    <span className="text-xs font-medium">{label}</span>
  </button>
);

export default App;
