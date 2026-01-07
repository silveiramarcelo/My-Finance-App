import React, { useState, useEffect } from 'react';
import { Home, Wallet, BarChart3, Plus, CalendarClock, Bot, X, Cloud, CloudOff, AlertCircle } from 'lucide-react';
import { Account, Transaction, PlannedExpense } from './types';
import Dashboard from './components/Dashboard';
import NewExpenseForm from './components/NewExpenseForm';
import Reports from './components/Reports';
import AccountsList from './components/AccountsList';
import NewAccountForm from './components/NewAccountForm';
import PlannedExpenses from './components/PlannedExpenses';
import NewPlannedExpenseForm from './components/NewPlannedExpenseForm';
import { db, collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, query, orderBy } from './services/firebase';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showNewExpense, setShowNewExpense] = useState(false);
  const [showNewAccount, setShowNewAccount] = useState(false);
  const [showNewPlanned, setShowNewPlanned] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [plannedExpenses, setPlannedExpenses] = useState<PlannedExpense[]>([]);
  
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    if (!db) {
      setIsOnline(false);
      setDbError("Erro de configuração do Firebase.");
      return;
    }

    setIsSyncing(true);
    
    // Listeners com tratamento de erro
    try {
      const qTransactions = query(collection(db, "transactions"), orderBy("date", "desc"));
      const unsubTransactions = onSnapshot(qTransactions, 
        (snapshot) => {
          const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Transaction));
          setTransactions(data);
          setIsSyncing(false);
          setDbError(null);
        }, 
        (error) => {
          console.error("Erro Firebase (Transactions):", error);
          if (error.code === 'permission-denied') {
            setDbError("Vá no console do Firebase > Firestore > Regras e mude para 'allow read, write: if true;'");
          } else {
            setDbError("Banco de dados ainda não iniciado.");
          }
          setIsSyncing(false);
        }
      );

      const unsubAccounts = onSnapshot(collection(db, "accounts"), (snapshot) => {
        const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Account));
        setAccounts(data);
      });

      const unsubPlanned = onSnapshot(collection(db, "planned_expenses"), (snapshot) => {
        const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as PlannedExpense));
        setPlannedExpenses(data);
      });

      return () => {
        unsubTransactions();
        unsubAccounts();
        unsubPlanned();
      };
    } catch (e) {
      console.error("Erro ao iniciar listeners:", e);
      setDbError("Falha na conexão.");
      setIsSyncing(false);
    }
  }, []);

  const handleSaveTransaction = async (newTx: Omit<Transaction, 'id'>) => {
    if (!db) return;
    setIsSyncing(true);
    try {
      if (editingTransaction) {
        await updateDoc(doc(db, "transactions", editingTransaction.id), newTx as any);
      } else {
        await addDoc(collection(db, "transactions"), newTx);
      }
      
      const acc = accounts.find(a => a.id === newTx.accountId);
      if (acc) {
        const accountRef = doc(db, "accounts", newTx.accountId);
        const isIncome = newTx.type === 'income';
        await updateDoc(accountRef, {
          income: isIncome ? (acc.income || 0) + newTx.amount : (acc.income || 0),
          expenses: !isIncome ? (acc.expenses || 0) + newTx.amount : (acc.expenses || 0),
          currentBalance: isIncome ? acc.currentBalance + newTx.amount : acc.currentBalance - newTx.amount
        });
      }
    } catch (e) {
      alert("Erro ao salvar: Verifique se você ativou as 'Regras' no console do Firebase.");
    } finally {
      setIsSyncing(false);
      setShowNewExpense(false);
      setEditingTransaction(null);
    }
  };

  // Se o banco estiver ok mas não houver contas, mostrar sugestão de criar conta
  const showSetupMessage = accounts.length === 0 && !isSyncing && !dbError;

  if (showNewExpense) return <NewExpenseForm accounts={accounts} onClose={() => { setShowNewExpense(false); setEditingTransaction(null); }} onSave={handleSaveTransaction} initialTransaction={editingTransaction || undefined} />;
  if (showNewAccount) return <NewAccountForm onClose={() => setShowNewAccount(false)} onSave={async (accData) => {
    if (db) await addDoc(collection(db, "accounts"), { ...accData, income: 0, expenses: 0, currentBalance: accData.initialBalance });
    setShowNewAccount(false);
  }} />;
  if (showNewPlanned) return <NewPlannedExpenseForm accounts={accounts} onClose={() => setShowNewPlanned(false)} onSave={async (p) => {
    if (db) await addDoc(collection(db, "planned_expenses"), { ...p, status: 'pending' });
    setShowNewPlanned(false);
  }} />;

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[#09090b] text-slate-50 relative overflow-hidden">
      
      {/* DB Notification / Status */}
      {dbError && (
        <div className="absolute top-16 left-6 right-6 z-[70] bg-rose-500/90 backdrop-blur-md p-4 rounded-2xl flex items-start gap-3 border border-rose-400/30 shadow-2xl animate-in slide-in-from-top duration-500">
          <AlertCircle size={20} className="mt-0.5 text-white" />
          <div className="flex-1">
            <p className="text-[12px] font-bold leading-snug">{dbError}</p>
          </div>
          <button onClick={() => setDbError(null)} className="opacity-60"><X size={16}/></button>
        </div>
      )}

      {/* Connection Indicator */}
      <div className="absolute top-4 right-6 z-[60] flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-lg">
        <div className={`w-1.5 h-1.5 rounded-full ${isSyncing ? 'bg-amber-500 animate-pulse' : isOnline ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
        <span className="text-[9px] font-black uppercase tracking-[0.1em] text-slate-400">
          {isSyncing ? 'Sincronizando' : isOnline ? 'Banco Online' : 'Desconectado'}
        </span>
      </div>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-32">
        <div className="animate-in fade-in duration-700">
          {showSetupMessage && activeTab === 'home' ? (
             <div className="p-12 text-center flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 border border-blue-500/20">
                   <Wallet size={32} className="text-blue-500" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Quase lá!</h2>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">Você ativou o banco de dados. Agora, adicione sua primeira conta para começar a gerenciar suas finanças.</p>
                <button 
                  onClick={() => setShowNewAccount(true)}
                  className="bg-blue-600 px-8 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
                >
                  Criar minha primeira conta
                </button>
             </div>
          ) : (
            <>
              {activeTab === 'home' && (
                <Dashboard 
                  accounts={accounts} 
                  transactions={transactions} 
                  onDelete={(id) => deleteDoc(doc(db!, "transactions", id))} 
                  onEdit={(tx) => { setEditingTransaction(tx); setShowNewExpense(true); }} 
                />
              )}
              {activeTab === 'contas' && <AccountsList accounts={accounts} onAddNew={() => setShowNewAccount(true)} onDelete={(id) => deleteDoc(doc(db!, "accounts", id))} onEdit={() => {}} />}
              {activeTab === 'agenda' && <PlannedExpenses plannedExpenses={plannedExpenses} onAddNew={() => setShowNewPlanned(true)} onConfirm={async (id) => {
                const p = plannedExpenses.find(item => item.id === id);
                if (!p || !db) return;
                await handleSaveTransaction({ ...p, date: new Date().toLocaleDateString('pt-BR'), type: 'expense' });
                await deleteDoc(doc(db, "planned_expenses", id));
              }} onDelete={(id) => deleteDoc(doc(db!, "planned_expenses", id))} />}
              {activeTab === 'reports' && <Reports accounts={accounts} transactions={transactions} onEdit={(tx) => { setEditingTransaction(tx); setShowNewExpense(true); }} />}
            </>
          )}
        </div>
      </main>

      {/* FABs */}
      <div className="fixed bottom-28 right-6 flex flex-col gap-3 items-end z-50">
        <button onClick={() => setShowAIChat(true)} className="w-12 h-12 bg-indigo-600/90 rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-md border border-indigo-400/30 active:scale-90 transition-all">
          <Bot size={22} className="text-white" />
        </button>
        <button 
          onClick={() => accounts.length > 0 ? setShowNewExpense(true) : setShowNewAccount(true)} 
          className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-900/20 border border-blue-400/30 active:scale-90 transition-all"
        >
          <Plus size={28} className="text-white" />
        </button>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto glass border-t border-white/5 flex justify-around items-center pt-3 pb-10 px-4 z-50">
        <NavItem icon={<Home size={22} />} label="Início" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
        <NavItem icon={<Wallet size={22} />} label="Contas" active={activeTab === 'contas'} onClick={() => setActiveTab('contas')} />
        <NavItem icon={<CalendarClock size={22} />} label="Agenda" active={activeTab === 'agenda'} onClick={() => setActiveTab('agenda')} />
        <NavItem icon={<BarChart3 size={22} />} label="Análise" active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} />
      </nav>

      {/* AIChat */}
      {showAIChat && (
        <div className="fixed inset-0 z-[100] glass animate-in fade-in zoom-in duration-300 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2"><Bot className="text-indigo-400" /> Analista Financeiro</h2>
            <button onClick={() => setShowAIChat(false)} className="p-2 bg-white/5 rounded-full"><X size={20}/></button>
          </div>
          <div className="flex-1 bg-white/5 rounded-3xl p-6 overflow-y-auto mb-4 border border-white/10 text-sm leading-relaxed text-slate-300">
             Olá! Com o banco de dados ativo, eu poderei analisar seus <strong>{transactions.length}</strong> lançamentos e te dar dicas personalizadas. O que deseja saber?
          </div>
          <div className="flex gap-2 mb-4">
            <input placeholder="Como estão meus gastos este mês?" className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-indigo-500 text-white placeholder-slate-600" />
            <button className="bg-indigo-600 px-6 py-4 rounded-2xl font-bold text-sm text-white shadow-lg shadow-indigo-600/20">Perguntar</button>
          </div>
        </div>
      )}
    </div>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode; label: string; active: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-all duration-300 relative px-2 py-1 ${active ? 'text-blue-400 scale-105' : 'text-slate-500 opacity-60 hover:opacity-100'}`}>
    {icon}
    <span className="text-[10px] font-bold uppercase tracking-[0.05em]">{label}</span>
    {active && <div className="absolute -bottom-2 w-1.5 h-1.5 bg-blue-400 rounded-full shadow-[0_0_10px_#3b82f6]"></div>}
  </button>
);

export default App;
