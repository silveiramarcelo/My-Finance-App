
import React, { useState } from 'react';
import { Transaction, Account } from '../types';
import { ArrowDownCircle, ArrowUpCircle, CalendarClock } from 'lucide-react';

interface NewExpenseFormProps {
  accounts: Account[];
  initialTransaction?: Transaction;
  onClose: () => void;
  onSave: (transaction: Omit<Transaction, 'id'>) => void;
}

const categories = [
  'Alimentação',
  'Transporte',
  'Saúde',
  'Lazer',
  'Trabalho',
  'Salário',
  'Investimentos',
  'Outros'
];

const categoryIcons: Record<string, string> = {
  'Alimentação': 'Utensils',
  'Transporte': 'Car',
  'Saúde': 'HeartPulse',
  'Lazer': 'Gamepad2',
  'Trabalho': 'Briefcase',
  'Salário': 'Briefcase',
  'Investimentos': 'TrendingUp',
  'Outros': 'Package'
};

const NewExpenseForm: React.FC<NewExpenseFormProps> = ({ accounts, initialTransaction, onClose, onSave }) => {
  const [type, setType] = useState<'income' | 'expense'>(initialTransaction?.type || 'expense');
  const [description, setDescription] = useState(initialTransaction?.description || '');
  const [amount, setAmount] = useState(initialTransaction?.amount.toString() || '');
  const [category, setCategory] = useState(initialTransaction?.category || 'Alimentação');
  const [date, setDate] = useState(initialTransaction?.date || '06/01/2026');
  const [dueDate, setDueDate] = useState(initialTransaction?.dueDate || '');
  const [selectedAccountId, setSelectedAccountId] = useState(initialTransaction?.accountId || accounts[0]?.id || '');
  
  // Payment Method States
  const [paymentMethod, setPaymentMethod] = useState<'Crédito' | 'Débito'>(initialTransaction?.paymentMethod || 'Débito');
  const [installments, setInstallments] = useState<string>(initialTransaction?.installments?.toString() || '1');

  const isEditing = !!initialTransaction;

  const handleSave = () => {
    if (!description || !amount || !selectedAccountId) return;
    
    onSave({
      description,
      amount: parseFloat(amount),
      category,
      date: date,
      dueDate: dueDate || undefined,
      icon: categoryIcons[category] || 'Coffee',
      accountId: selectedAccountId,
      type,
      // Only send payment details if it's an expense
      paymentMethod: type === 'expense' ? paymentMethod : undefined,
      installments: type === 'expense' && paymentMethod === 'Crédito' ? parseInt(installments) || 1 : undefined
    });
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[#121212] p-6 pt-10 animate-in slide-in-from-bottom duration-300 overflow-y-auto no-scrollbar">
      
      {/* Type Selector */}
      <div className="flex bg-[#1c1c1e] p-1 rounded-xl mb-8 border border-gray-800">
        <button
          onClick={() => setType('expense')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${
            type === 'expense' 
              ? 'bg-red-500 bg-opacity-10 text-red-500 shadow-sm border border-red-500 border-opacity-20' 
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <ArrowDownCircle size={18} />
          Despesa
        </button>
        <button
          onClick={() => setType('income')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${
            type === 'income' 
              ? 'bg-green-500 bg-opacity-10 text-green-500 shadow-sm border border-green-500 border-opacity-20' 
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <ArrowUpCircle size={18} />
          Receita
        </button>
      </div>

      <h1 className="text-xl font-bold text-white mb-6">
        {isEditing 
          ? `Editar ${type === 'expense' ? 'Despesa' : 'Receita'}` 
          : `Nova ${type === 'expense' ? 'Despesa' : 'Receita'}`
        }
      </h1>

      <div className="mb-6">
        <label className="block text-gray-300 text-sm font-medium mb-2 uppercase tracking-wider">Descrição</label>
        <input
          type="text"
          placeholder={type === 'expense' ? "Ex: Café da manhã" : "Ex: Salário"}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-[#1c1c1e] border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#0a84a5] focus:ring-1 focus:ring-[#0a84a5]"
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-300 text-sm font-medium mb-2 uppercase tracking-wider">Valor (R$)</label>
        <input
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full bg-[#1c1c1e] border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#0a84a5] focus:ring-1 focus:ring-[#0a84a5]"
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-300 text-sm font-medium mb-2 uppercase tracking-wider">Categoria</label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-[11px] font-bold transition-all border ${
                category === cat
                  ? 'bg-[#0a84a5] border-[#0a84a5] text-white shadow-lg scale-105'
                  : 'bg-[#1c1c1e] border-gray-800 text-gray-500 hover:border-gray-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-gray-300 text-sm font-medium mb-2 uppercase tracking-wider">Conta</label>
        <div className="flex flex-wrap gap-2">
          {accounts.map((acc) => (
            <button
              key={acc.id}
              onClick={() => setSelectedAccountId(acc.id)}
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold border transition-all ${
                selectedAccountId === acc.id
                  ? 'bg-white border-white text-black shadow-lg scale-105'
                  : 'bg-[#1c1c1e] border-gray-800 text-gray-500 hover:border-gray-600'
              }`}
            >
              <span role="img" aria-label="bank">🏛️</span>
              {acc.bank}
            </button>
          ))}
          {accounts.length === 0 && (
            <p className="text-red-400 text-[11px] font-bold uppercase tracking-widest italic mt-2">Nenhuma conta cadastrada!</p>
          )}
        </div>
      </div>

      {/* Payment Method Section - Only for Expenses */}
      {type === 'expense' && (
        <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <label className="block text-gray-300 text-sm font-medium mb-2 uppercase tracking-wider">Forma de Pagamento</label>
          <div className="flex flex-wrap gap-2">
            {['Débito', 'Crédito'].map((method) => (
              <button
                key={method}
                onClick={() => setPaymentMethod(method as 'Débito' | 'Crédito')}
                className={`px-6 py-2 rounded-full text-[11px] font-bold transition-all border ${
                  paymentMethod === method
                    ? 'bg-[#0a84a5] border-[#0a84a5] text-white shadow-lg scale-105'
                    : 'bg-[#1c1c1e] border-gray-800 text-gray-500 hover:border-gray-600'
                }`}
              >
                {method}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Installments Input - Only visible if Expense AND Credit is selected */}
      {type === 'expense' && paymentMethod === 'Crédito' && (
        <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <label className="block text-gray-300 text-sm font-medium mb-2 uppercase tracking-wider">Número de Parcelas</label>
          <input
            type="number"
            min="1"
            value={installments}
            onChange={(e) => setInstallments(e.target.value)}
            className="w-full bg-[#1c1c1e] border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#0a84a5] focus:ring-1 focus:ring-[#0a84a5]"
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2 uppercase tracking-wider">Data</label>
          <input
            type="text"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-[#1c1c1e] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#0a84a5]"
          />
        </div>
        <div>
          <label className="flex items-center gap-1 text-gray-300 text-sm font-medium mb-2 uppercase tracking-wider">
            <CalendarClock size={14} className="text-[#0a84a5]" />
            Vencimento
          </label>
          <input
            type="text"
            placeholder="DD/MM/AAAA"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full bg-[#1c1c1e] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#0a84a5] placeholder-gray-600"
          />
        </div>
      </div>

      <div className="space-y-4 pb-10 mt-auto">
        <button
          onClick={handleSave}
          disabled={accounts.length === 0}
          className={`w-full text-white py-4 rounded-xl font-bold shadow-lg active:scale-95 transition-transform ${
            accounts.length === 0 
              ? 'bg-gray-800 cursor-not-allowed text-gray-600' 
              : type === 'income' ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          {isEditing 
            ? `Atualizar ${type === 'expense' ? 'Despesa' : 'Receita'}` 
            : `Salvar ${type === 'expense' ? 'Despesa' : 'Receita'}`
          }
        </button>
        <button
          onClick={onClose}
          className="w-full bg-transparent border border-gray-800 text-white py-4 rounded-xl font-bold active:bg-gray-900 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default NewExpenseForm;
