
import React, { useState } from 'react';
import { Transaction, Account } from '../types';

interface NewExpenseFormProps {
  accounts: Account[];
  onClose: () => void;
  onSave: (transaction: Omit<Transaction, 'id'>) => void;
}

const categories = [
  'Alimentação',
  'Transporte',
  'Saúde',
  'Lazer',
  'Trabalho',
  'Outros'
];

const categoryIcons: Record<string, string> = {
  'Alimentação': 'Utensils',
  'Transporte': 'Car',
  'Saúde': 'HeartPulse',
  'Lazer': 'Gamepad2',
  'Trabalho': 'Briefcase',
  'Outros': 'Package'
};

const NewExpenseForm: React.FC<NewExpenseFormProps> = ({ accounts, onClose, onSave }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Alimentação');
  const [date, setDate] = useState('06/01/2026');
  const [selectedAccountId, setSelectedAccountId] = useState(accounts[0]?.id || '');

  const handleSave = () => {
    if (!description || !amount || !selectedAccountId) return;
    
    onSave({
      description,
      amount: parseFloat(amount),
      category,
      date: date,
      icon: categoryIcons[category] || 'Coffee',
      accountId: selectedAccountId
    });
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[#121212] p-6 pt-10 animate-in slide-in-from-bottom duration-300 overflow-y-auto no-scrollbar">
      <h1 className="text-xl font-bold text-white mb-8">Nova Despesa</h1>

      <div className="mb-6">
        <label className="block text-gray-300 text-sm font-medium mb-2">Descrição</label>
        <input
          type="text"
          placeholder="Ex: Café da manhã"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-[#1c1c1e] border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#0a84a5]"
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-300 text-sm font-medium mb-2">Valor (R$)</label>
        <input
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full bg-[#1c1c1e] border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#0a84a5]"
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-300 text-sm font-medium mb-2">Categoria</label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                category === cat
                  ? 'bg-[#0a84a5] border-[#0a84a5] text-white'
                  : 'bg-[#1c1c1e] border-gray-800 text-gray-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-gray-300 text-sm font-medium mb-2">Conta</label>
        <div className="flex flex-wrap gap-2">
          {accounts.map((acc) => (
            <button
              key={acc.id}
              onClick={() => setSelectedAccountId(acc.id)}
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${
                selectedAccountId === acc.id
                  ? 'bg-[#0a84a5] border-[#0a84a5] text-white'
                  : 'bg-[#1c1c1e] border-gray-800 text-gray-400'
              }`}
            >
              <span role="img" aria-label="bank">🏦</span>
              {acc.name}
            </button>
          ))}
          {accounts.length === 0 && (
            <p className="text-red-400 text-xs italic">Cadastre uma conta primeiro!</p>
          )}
        </div>
      </div>

      <div className="mb-8">
        <label className="block text-gray-300 text-sm font-medium mb-2">Data</label>
        <input
          type="text"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full bg-[#1c1c1e] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none"
        />
      </div>

      <div className="space-y-4 pb-10">
        <button
          onClick={handleSave}
          disabled={accounts.length === 0}
          className={`w-full text-white py-4 rounded-xl font-bold shadow-lg active:scale-95 transition-transform ${accounts.length === 0 ? 'bg-gray-700 cursor-not-allowed' : 'bg-[#0a84a5]'}`}
        >
          Salvar Despesa
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
