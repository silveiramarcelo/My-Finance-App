
import React from 'react';
import { Plus, Building2 } from 'lucide-react';
import { Account } from '../types';

interface AccountsListProps {
  accounts: Account[];
  onDelete: (id: string) => void;
  onAddNew: () => void;
}

const AccountsList: React.FC<AccountsListProps> = ({ accounts, onDelete, onAddNew }) => {
  return (
    <div className="flex flex-col min-h-full bg-[#121212]">
      {/* Header */}
      <div className="bg-[#0a84a5] p-6 pt-10 pb-6 shadow-md">
        <h1 className="text-xl font-bold text-white">Minhas Contas</h1>
      </div>

      <div className="p-4 flex-1">
        <div className="space-y-4 mb-20">
          {accounts.map((acc) => (
            <div key={acc.id} className="bg-[#1c1c1e] rounded-2xl p-5 border border-gray-800 relative overflow-hidden">
              {/* Account Branding Bar */}
              <div className="absolute top-0 left-0 w-1.5 h-full" style={{ backgroundColor: acc.color || '#3B7A9A' }}></div>
              
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700">
                    <Building2 size={20} className="text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm leading-tight">{acc.name}</h3>
                    <p className="text-gray-500 text-[10px]">{acc.bank}</p>
                  </div>
                </div>

                <div className="flex gap-1">
                  <button className="px-2 py-1 bg-blue-500 bg-opacity-80 rounded text-[10px] font-bold text-white">
                    Editar
                  </button>
                  <button 
                    onClick={() => onDelete(acc.id)}
                    className="px-2 py-1 bg-red-500 bg-opacity-80 rounded text-[10px] font-bold text-white"
                  >
                    Deletar
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <p className="text-gray-500 text-[10px] uppercase font-semibold">Conta</p>
                  <p className="text-white text-xs font-medium">{acc.accountNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-[10px] uppercase font-semibold">Saldo</p>
                  <p className="text-white text-lg font-bold tracking-tight">
                    R$ {acc.currentBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {accounts.length === 0 && (
            <div className="text-center py-20 text-gray-600">
              Nenhuma conta cadastrada
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button inside the screen content area to match UI */}
      <button 
        onClick={onAddNew}
        className="fixed bottom-24 right-6 w-14 h-14 bg-[#0a84a5] rounded-full flex items-center justify-center shadow-lg text-white active:scale-95 transition-transform z-50"
      >
        <Plus size={32} />
      </button>
    </div>
  );
};

export default AccountsList;
