
import React, { useState } from 'react';
import { Check, Trash2, CalendarRange, Plus, Building2, ChevronLeft, ChevronRight } from 'lucide-react';
import { PlannedExpense, MONTHS } from '../types';

interface PlannedExpensesProps {
  plannedExpenses: PlannedExpense[];
  onConfirm: (id: string) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
}

const PlannedExpenses: React.FC<PlannedExpensesProps> = ({ plannedExpenses, onConfirm, onDelete, onAddNew }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const filtered = plannedExpenses.filter(p => p.month === selectedMonth && p.year === selectedYear);

  const changeMonth = (dir: number) => {
    let newMonth = selectedMonth + dir;
    let newYear = selectedYear;
    if (newMonth > 11) { newMonth = 0; newYear++; }
    if (newMonth < 0) { newMonth = 11; newYear--; }
    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
  };

  return (
    <div className="flex flex-col min-h-full bg-[#121212]">
      {/* Header */}
      <div className="bg-[#3B7A9A] p-6 pt-10 pb-6 shadow-md">
        <h1 className="text-xl font-bold text-white">Despesas Programadas</h1>
        <div className="flex items-center justify-between mt-4 bg-black bg-opacity-20 rounded-xl p-2 px-4 border border-white border-opacity-10">
          <button onClick={() => changeMonth(-1)} className="p-1 text-white opacity-70 hover:opacity-100"><ChevronLeft size={20} /></button>
          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-200">Competência</p>
            <p className="text-sm font-bold text-white uppercase">{MONTHS[selectedMonth]} {selectedYear}</p>
          </div>
          <button onClick={() => changeMonth(1)} className="p-1 text-white opacity-70 hover:opacity-100"><ChevronRight size={20} /></button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {filtered.map((p) => (
          <div key={p.id} className="bg-[#1c1c1e] p-4 rounded-2xl border border-gray-800 flex items-center justify-between shadow-lg animate-in fade-in duration-300">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500 bg-opacity-10 border border-blue-500 border-opacity-20 flex items-center justify-center text-blue-400">
                <CalendarRange size={18} />
              </div>
              <div>
                <p className="text-white text-sm font-bold tracking-tight">{p.description}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-gray-500 text-[9px] font-bold uppercase tracking-widest">{p.category}</p>
                  <span className="text-gray-700">•</span>
                  <p className="text-blue-400 text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                    <Building2 size={10} />
                    {p.accountId.replace('acc-', '')}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-white font-black text-sm">R$ {p.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="flex flex-col gap-1">
                <button 
                  onClick={() => onConfirm(p.id)}
                  className="w-8 h-8 rounded-lg bg-green-500 bg-opacity-10 text-green-500 border border-green-500 border-opacity-20 flex items-center justify-center hover:bg-opacity-20 active:scale-90 transition-all"
                  title="Confirmar Pagamento"
                >
                  <Check size={16} />
                </button>
                <button 
                  onClick={() => onDelete(p.id)}
                  className="w-8 h-8 rounded-lg bg-red-500 bg-opacity-10 text-red-500 border border-red-500 border-opacity-20 flex items-center justify-center hover:bg-opacity-20 active:scale-90 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-20 bg-[#1c1c1e] rounded-3xl border border-dashed border-gray-800 border-opacity-50">
            <div className="bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarRange size={24} className="text-gray-600" />
            </div>
            <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Nada planejado para este mês</p>
            <button 
              onClick={onAddNew}
              className="mt-4 text-[#3B7A9A] text-xs font-black uppercase tracking-widest hover:underline"
            >
              + Adicionar Novo
            </button>
          </div>
        )}
      </div>

      <button onClick={onAddNew} className="fixed bottom-24 right-6 w-11 h-11 bg-[#3B7A9A] rounded-full flex items-center justify-center shadow-2xl text-white active:scale-95 transition-transform z-50 border-2 border-[#121212]">
        <Plus size={24} />
      </button>
    </div>
  );
};

export default PlannedExpenses;
