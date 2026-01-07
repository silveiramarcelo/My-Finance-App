
import React, { useState } from 'react';
import { PlannedExpense, Account, MONTHS } from '../types';
import { CalendarRange, Building2 } from 'lucide-react';

interface NewPlannedExpenseFormProps {
  accounts: Account[];
  onClose: () => void;
  onSave: (expense: Omit<PlannedExpense, 'id' | 'status'>) => void;
}

const NewPlannedExpenseForm: React.FC<NewPlannedExpenseFormProps> = ({ accounts, onClose, onSave }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [category, setCategory] = useState('Outros');
  const [selectedAccountId, setSelectedAccountId] = useState(accounts[0]?.id || '');

  const handleSave = () => {
    if (!description || !amount || !selectedAccountId) return;
    onSave({
      description,
      amount: parseFloat(amount),
      category,
      month,
      year,
      accountId: selectedAccountId,
      icon: 'CalendarRange'
    });
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[#121212] p-6 pt-10 animate-in slide-in-from-bottom duration-300 overflow-y-auto no-scrollbar">
      <h1 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
        <div className="p-2 bg-blue-500 bg-opacity-20 rounded-lg"><CalendarRange size={20} className="text-blue-400" /></div>
        Lançamento Planejado
      </h1>

      <div className="mb-6">
        <label className="block text-gray-300 text-xs font-black mb-2 uppercase tracking-widest">Descrição</label>
        <input
          type="text"
          placeholder="Ex: IPTU, Assinatura anual..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-[#1c1c1e] border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-300 text-xs font-black mb-2 uppercase tracking-widest">Valor Planejado (R$)</label>
        <input
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full bg-[#1c1c1e] border border-gray-800 rounded-xl px-4 py-3 text-white text-lg placeholder-gray-600 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-300 text-xs font-black mb-2 uppercase tracking-widest">Mês</label>
          <select 
            value={month} 
            onChange={(e) => setMonth(parseInt(e.target.value))}
            className="w-full bg-[#1c1c1e] border border-gray-800 rounded-xl px-3 py-3 text-white focus:outline-none"
          >
            {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-gray-300 text-xs font-black mb-2 uppercase tracking-widest">Ano</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            className="w-full bg-[#1c1c1e] border border-gray-800 rounded-xl px-4 py-3 text-white"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-gray-300 text-xs font-black mb-2 uppercase tracking-widest">Debitar da Conta</label>
        <div className="flex flex-wrap gap-2">
          {accounts.map((acc) => (
            <button
              key={acc.id}
              onClick={() => setSelectedAccountId(acc.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter border transition-all ${
                selectedAccountId === acc.id
                  ? 'bg-blue-500 border-blue-500 text-white shadow-lg'
                  : 'bg-[#1c1c1e] border-gray-800 text-gray-500'
              }`}
            >
              <Building2 size={12} />
              {acc.bank}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 pb-10 mt-auto">
        <button
          onClick={handleSave}
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
        >
          Planejar Lançamento
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

export default NewPlannedExpenseForm;
