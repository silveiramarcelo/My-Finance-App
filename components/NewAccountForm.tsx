
import React, { useState } from 'react';
import { Account } from '../types';

interface NewAccountFormProps {
  initialAccount?: Account;
  onClose: () => void;
  onSave: (account: Omit<Account, 'id' | 'expenses' | 'currentBalance'>) => void;
}

const banks = [
  { name: 'Santander', color: '#CC0000' },
  { name: 'Nubank', color: '#8A05BE' },
  { name: 'Inter', color: '#FF7A00' },
  { name: 'Itaú', color: '#004A99' },
  { name: 'XP', color: '#E5FF00' },
  { name: 'C6', color: '#000000' },
  { name: 'Outro', color: '#3B7A9A' }
];

const NewAccountForm: React.FC<NewAccountFormProps> = ({ initialAccount, onClose, onSave }) => {
  const [bank, setBank] = useState(initialAccount?.bank || banks[0].name);
  const [initialBalance, setInitialBalance] = useState(initialAccount?.initialBalance.toString() || '');

  const isEditing = !!initialAccount;

  const handleSave = () => {
    if (!initialBalance) return;
    
    const selectedBank = banks.find(b => b.name === bank);

    onSave({
      bank,
      initialBalance: parseFloat(initialBalance),
      color: selectedBank?.color || '#3B7A9A'
    });
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[#121212] p-6 pt-10 animate-in slide-in-from-bottom duration-300 overflow-y-auto no-scrollbar">
      <h1 className="text-xl font-bold text-white mb-8">{isEditing ? 'Editar Conta' : 'Nova Conta'}</h1>

      <div className="mb-6">
        <label className="block text-gray-300 text-sm font-medium mb-3 uppercase tracking-wider">Selecione o Banco</label>
        <div className="flex flex-wrap gap-2">
          {banks.map((b) => (
            <button
              key={b.name}
              onClick={() => setBank(b.name)}
              className={`px-4 py-2.5 rounded-full text-xs font-bold border transition-all ${
                bank === b.name
                  ? 'bg-white text-black border-white shadow-lg scale-105'
                  : 'bg-[#1c1c1e] border-gray-800 text-gray-500'
              }`}
            >
              {b.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-10">
        <label className="block text-gray-300 text-sm font-medium mb-2 uppercase tracking-wider">Saldo Inicial (R$)</label>
        <input
          type="number"
          placeholder="0.00"
          value={initialBalance}
          onChange={(e) => setInitialBalance(e.target.value)}
          className="w-full bg-[#1c1c1e] border border-gray-800 rounded-xl px-4 py-4 text-white text-lg placeholder-gray-600 focus:outline-none focus:border-[#0a84a5] focus:ring-1 focus:ring-[#0a84a5]"
        />
      </div>

      <div className="space-y-4 pb-10 mt-auto">
        <button
          onClick={handleSave}
          className="w-full bg-[#0a84a5] text-white py-4 rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
        >
          {isEditing ? 'Atualizar Conta' : 'Salvar Conta'}
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

export default NewAccountForm;
