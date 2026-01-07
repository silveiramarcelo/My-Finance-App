
import React, { useState, useEffect } from 'react';
import { Home, Wallet, BarChart3, Plus, CalendarClock } from 'lucide-react';
import { Account, Transaction, PlannedExpense } from './types';
import Dashboard from './components/Dashboard';
import NewExpenseForm from './components/NewExpenseForm';
import Reports from './components/Reports';
import AccountsList from './components/AccountsList';
import NewAccountForm from './components/NewAccountForm';
import PlannedExpenses from './components/PlannedExpenses';
import NewPlannedExpenseForm from './components/NewPlannedExpenseForm';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showNewExpense, setShowNewExpense] = useState(false);
  const [showNewAccount, setShowNewAccount] = useState(false);
  const [showNewPlanned, setShowNewPlanned] = useState(false);
  
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('fin_transactions');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });
  
  const [plannedExpenses, setPlannedExpenses] = useState<PlannedExpense[]>(() => {
    try {
      const saved = localStorage.getItem('fin_planned');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  const [accounts, setAccounts] = useState<Account[]>(() => {
    try {
      const saved = localStorage.getItem('fin_accounts');
      if (saved) return JSON.parse(saved);
      
      // Contas iniciais padrão
      return [
        { id: 'acc-santander', bank: 'Santander', initialBalance: 0, income: 0, expenses: 0, currentBalance: 0, color: '#CC0000' },
        { id: 'acc-nubank', bank: 'Nubank', initialBalance: 0, income: 0, expenses: 0, currentBalance: 0, color: '#8A05BE' },
        { id: 'acc-inter', bank: 'Inter', initialBalance: 0, income: 0, expenses: 0, currentBalance: 0, color: '#FF7A00' }
      ];
    } catch (e) { return []; }
  });

  // Salvar sempre que houver mudanças
  useEffect(() => {
    localStorage.setItem('fin_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('fin_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('fin_planned', JSON.stringify(plannedExpenses));
  }, [plannedExpenses]);

  const calculateBalanceUpdate = (acc: Account, amount: number, type: 'income' | 'expense', operation: 'add' | 'remove'): Account => {
    let newIncome = acc.income;
    let newExpenses = acc.expenses;
    let newCurrentBalance = acc.currentBalance;

    if (operation === 'add') {
      if (type === 'income') {
        newIncome += amount;
        newCurrentBalance += amount;
      } else {
        newExpenses += amount;
        newCurrentBalance -= amount;
      }
    } else {
      if (type === 'income') {
        newIncome -= amount;
        newCurrentBalance -= amount;
      } else {
        newExpenses -= amount;
        newCurrentBalance += amount;
      }
    }

    return { ...acc, income: newIncome, expenses: newExpenses, currentBalance: newCurrentBalance };
  };

  const handleSaveTransaction = (newTx: Omit<Transaction, 'id'>) => {
    if (editingTransaction) {
      const oldTx = editingTransaction;
      setTransactions(prev => prev.map(t => t.id === oldTx.id ? { ...newTx, id: oldTx.id } : t));
      setAccounts(prev => prev.map(acc => {
        let updatedAcc = acc;
        if (acc.id === oldTx.accountId) updatedAcc = calculateBalanceUpdate(updatedAcc, oldTx.amount, oldTx.type, 'remove');
        if (acc.id === newTx.accountId) updatedAcc = calculateBalanceUpdate(updatedAcc, newTx.amount, newTx.type, 'add');
        return updatedAcc;
      }));
      setEditingTransaction(null);
    } else {
      const tx: Transaction = { ...newTx, id: Math.random().toString(36).substr(2, 9) };
      setTransactions(prev => [tx, ...prev]);
      setAccounts(prev => prev.map(acc => acc.id === tx.accountId ? calculateBalanceUpdate(acc, tx.amount, tx.type, 'add') : acc));
    }
    setShowNewExpense(false);
  };

  const handleDeleteTransaction = (id: string) => {
    const tx = transactions.find(t => t.id === id);
    if (tx) {
      setAccounts(prev => prev.map(acc => 
        acc.id === tx.accountId ? calculateBalanceUpdate(acc, tx.amount, tx.type, 'remove') : acc
      ));
    }
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleSaveAccount = (data: Omit<Account, 'id' | 'expenses' | 'currentBalance' | 'income'>) => {
    if (editingAccount) {
      setAccounts(prev => prev.map(acc => acc.id === editingAccount.id ? {
        ...acc,
        bank: data.bank,
        initialBalance: data.initialBalance,
        color: data.color,
        currentBalance: data.initialBalance + acc.income - acc.expenses
      } : acc));
      setEditingAccount(null);
    } else {
      const account: Account = { ...data, id: `acc-${Math.random().toString(36).substr(2, 9)}`, expenses: 0, income: 0, currentBalance: data.initialBalance };
      setAccounts(prev => [...prev, account]);
    }
    setShowNewAccount(false);
  };

  const handleConfirmPlanned = (id: string) => {
    const planned = plannedExpenses.find(p => p.id === id);
    if (!planned) return;

    const now = new Date();
    const tx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      description: planned.description,
      amount: planned.amount,
      category: planned.category,
      date: `${now.getDate().toString().padStart(2, '0')}/${(planned.month + 1).toString().padStart(2, '0')}/${planned.year}`,
      icon: planned.icon,
      accountId: planned.accountId,
      type: 'expense'
    };

    setTransactions(prev => [tx, ...prev]);
    setAccounts(prev => prev.map(acc => acc.id === tx.accountId ? calculateBalanceUpdate(acc, tx.amount, tx.type, 'add') : acc));
    setPlannedExpenses(prev => prev.filter(p => p.id !== id));
  };

  if (showNewExpense) return <NewExpenseForm accounts={accounts} initialTransaction={editingTransaction || undefined} onClose={() => { setShowNewExpense(false); setEditingTransaction(null); }} onSave={handleSaveTransaction} />;
  if (showNewAccount) return <NewAccountForm initialAccount={editingAccount || undefined} onClose={() => { setShowNewAccount(false); setEditingAccount(null); }} onSave={handleSaveAccount} />;
  if (showNewPlanned) return <NewPlannedExpenseForm accounts={accounts} onClose={() => setShowNewPlanned(false)} onSave={(p) => setPlannedExpenses(prev => [...prev, { ...p, id: Math.random().toString(36).substr(2, 9), status: 'pending' }])} />;

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[#121212] relative overflow-hidden shadow-2xl text-white">
      <main className="flex-1 overflow-y-auto no-scrollbar pb-32">
        {activeTab === 'home' && <Dashboard accounts={accounts} transactions={transactions} onDelete={handleDeleteTransaction} onEdit={(tx) => { setEditingTransaction(tx); setShowNewExpense(true); }} />}
        {activeTab === 'contas' && <AccountsList accounts={accounts} onDelete={(id) => setAccounts(prev => prev.filter(a => a.id !== id))} onEdit={(acc) => { setEditingAccount(acc); setShowNewAccount(true); }} onAddNew={() => setShowNewAccount(true)} />}
        {activeTab === 'programadas' && <PlannedExpenses plannedExpenses={plannedExpenses} onConfirm={handleConfirmPlanned} onDelete={(id) => setPlannedExpenses(prev => prev.filter(p => p.id !== id))} onAddNew={() => setShowNewPlanned(true)} />}
        {activeTab === 'relatorios' && <Reports accounts={accounts} transactions={transactions} onEdit={(tx) => { setEditingTransaction(tx); setShowNewExpense(true); }} />}
      </main>

      {activeTab === 'home' && (
        <button className="fixed bottom-28 right-6 w-12 h-12 bg-[#3B7A9A] rounded-full flex items-center justify-center shadow-lg text-white active:scale-95 transition-transform z-50 border-2 border-[#121212]" onClick={() => setShowNewExpense(true)}>
          <Plus size={24} />
        </button>
      )}

      <nav className="fixed bottom-0 w-full max-w-md bg-[#1c1c1e] border-t border-gray-800 flex justify-around items-center pt-3 pb-8 z-50">
        <NavItem icon={<Home size={22} />} label="Home" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
        <NavItem icon={<Wallet size={22} />} label="Contas" active={activeTab === 'contas'} onClick={() => setActiveTab('contas')} />
        <NavItem icon={<CalendarClock size={22} />} label="Agenda" active={activeTab === 'programadas'} onClick={() => setActiveTab('programadas')} />
        <NavItem icon={<BarChart3 size={22} />} label="Reports" active={activeTab === 'relatorios'} onClick={() => setActiveTab('relatorios')} />
      </nav>
    </div>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode; label: string; active: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-colors px-2 ${active ? 'text-[#0a84a5]' : 'text-gray-500'}`}>
    {icon}
    <span className="text-[9px] font-bold uppercase tracking-tighter">{label}</span>
  </button>
);

export default App;
