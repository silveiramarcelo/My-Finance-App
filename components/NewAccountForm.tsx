
import React, { useState } from 'react';
import { Account } from '../types';

interface NewAccountFormProps {
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

const NewAccountForm: React.FC<NewAccountFormProps> = ({ onClose, onSave }) => {
  const [name, setName] = useState('');
  const [bank, setBank] = useState(banks[0].name);
  const [accountNumber, setAccountNumber] = useState('');
  const [initialBalance, setInitialBalance] = useState('');

  const handleSave = () => {
    if (!name || !initialBalance) return;
    
    const selectedBank = banks.find(b => b.name === bank);

    onSave({
      name,
      bank,
      accountNumber,
      initialBalance: parseFloat(initialBalance),
      color: selectedBank?.color
    });
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[#121212] p-6 pt-10 animate-in slide-in-from-bottom duration-300 overflow-y-auto no-scrollbar">
      <h1 className="text-xl font-bold text-white mb-8">Nova Conta</h1>

      <div className="mb-6">
        <label className="block text-gray-300 text-sm font-medium mb-2">Apelido da Conta</label>
        <input
          type="text"
          placeholder="Ex: Minha Conta Principal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-[#1c1c1e] border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#0a84a5]"
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-300 text-sm font-medium mb-2">Banco</label>
        <div className="flex flex-wrap gap-2">
          {banks.map((b) => (
            <button
              key={b.name}
              onClick={() => setBank(b.name)}
              className={`px-4 py-2 rounded-full text-xs font-medium border transition-all ${
                bank === b.name
                  ? 'bg-white text-black border-white shadow-lg'
                  : 'bg-[#1c1c1e] border-gray-800 text-gray-400'
              }`}
            >
              {b.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-gray-300 text-sm font-medium mb-2">Número da Conta</label>
        <input
          type="text"
          placeholder="Ex: 12345-6"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          className="w-full bg-[#1c1c1e] border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#0a84a5]"
        />
      </div>

      <div className="mb-8">
        <label className="block text-gray-300 text-sm font-medium mb-2">Saldo Inicial (R$)</label>
        <input
          type="number"
          placeholder="0.00"
          value={initialBalance}
          onChange={(e) => setInitialBalance(e.target.value)}
          className="w-full bg-[#1c1c1e] border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#0a84a5]"
        />
      </div>

      <div className="space-y-4 pb-10">
        <button
          onClick={handleSave}
          className="w-full bg-[#0a84a5] text-white py-4 rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
        >
          Salvar Conta
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
