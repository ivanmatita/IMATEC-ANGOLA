
import React from 'react';
import { Empresa } from '../types';
import { Plus, Download, FileJson, Search, Filter } from 'lucide-react';

const Faturacao: React.FC<{ empresa: Empresa }> = ({ empresa }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Faturação</h1>
          <p className="text-sm text-gray-500">Gestão de faturas, recibos e notas de crédito</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-2 bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg text-xs font-bold transition-all">
            <FileJson className="w-4 h-4" />
            <span>Gerar SAFT</span>
          </button>
          <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md transition-all">
            <Plus className="w-4 h-4" />
            <span>Emitir Nova Fatura</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Procurar por Nº, Cliente ou NIF..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center space-x-2">
          <select className="bg-gray-50 border border-gray-200 text-sm px-3 py-2 rounded-lg focus:outline-none">
            <option>Todos os Estados</option>
            <option>Pago</option>
            <option>Pendente</option>
            <option>Anulado</option>
          </select>
          <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100">
              <th className="px-6 py-4">Série / Nº</th>
              <th className="px-6 py-4">Cliente / NIF</th>
              <th className="px-6 py-4">Data Emissão</th>
              <th className="px-6 py-4 text-right">Total Geral</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[...Array(8)].map((_, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-blue-600">FR 2024/{String(idx + 1).padStart(3, '0')}</span>
                    <span className="text-[10px] text-gray-400">Série Geral</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-gray-700">Cliente Exemplo {idx + 1}</span>
                    <span className="text-[10px] text-gray-400">5401234567</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs text-gray-500">12 Out 2024</td>
                <td className="px-6 py-4 text-xs font-bold text-gray-800 text-right">12.500,00 Kz</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${idx % 3 === 0 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {idx % 3 === 0 ? 'pendente' : 'pago'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-1 hover:text-blue-600 transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Faturacao;
