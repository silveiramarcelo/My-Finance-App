
import React from 'react';
import { Plus, Building2 } from 'lucide-react';
import { Account } from '../types';

interface AccountsListProps {
  accounts: Account[];
  onDelete: (id: string) => void;
  onEdit: (account: Account) => void;
  onAddNew: () => void;
}

const AccountsList: React.FC<AccountsListProps> = ({ accounts, onDelete, onEdit, onAddNew }) => {
  return (
    <div className="flex flex-col min-h-full bg-[#121212]">
      {/* Header */}
      <div className="bg-[#0a84a5] p-6 pt-10 pb-6 shadow-md">
        <h1 className="text-xl font-bold text-white">Minhas Contas</h1>
      </div>

      <div className="p-4 flex-1">
        <div className="space-y-4 mb-20">
          {accounts.map((acc) => (
            <div key={acc.id} className="bg-[#1c1c1e] rounded-2xl p-5 border border-gray-800 relative overflow-hidden group shadow-lg">
              {/* Account Branding Bar */}
              <div className="absolute top-0 left-0 w-1.5 h-full transition-all group-hover:w-2" style={{ backgroundColor: acc.color || '#3B7A9A' }}></div>
              
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center border border-gray-700">
                    <Building2 size={24} className="text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-base leading-tight">{acc.bank}</h3>
                    <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mt-0.5">Ativa</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => onEdit(acc)}
                    className="px-3 py-1.5 bg-blue-500 bg-opacity-10 text-blue-400 rounded-lg text-[10px] font-bold border border-blue-500 border-opacity-20 hover:bg-opacity-20 transition-all"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => onDelete(acc.id)}
                    className="px-3 py-1.5 bg-red-500 bg-opacity-10 text-red-400 rounded-lg text-[10px] font-bold border border-red-500 border-opacity-20 hover:bg-opacity-20 transition-all"
                  >
                    Deletar
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-end pt-2">
                <div>
                  <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-1">Status</p>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    <span className="text-gray-400 text-[11px] font-medium">Sincronizado</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-1">Saldo Atual</p>
                  <p className="text-white text-xl font-black tracking-tight">
                    R$ {acc.currentBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {accounts.length === 0 && (
            <div className="text-center py-20">
              <div className="bg-[#1c1c1e] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-800">
                <Building2 size={24} className="text-gray-600" />
              </div>
              <p className="text-gray-500 text-sm">Nenhuma conta cadastrada</p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={onAddNew}
        className="fixed bottom-24 right-6 w-11 h-11 bg-[#0a84a5] rounded-full flex items-center justify-center shadow-2xl text-white active:scale-95 transition-transform z-50 border-2 border-[#121212]"
      >
        <Plus size={24} />
      </button>
    </div>
  );
};

export default AccountsList;
