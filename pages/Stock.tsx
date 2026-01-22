
import React from 'react';
import { Empresa } from '../types';
import { Package, Plus, AlertTriangle, ArrowUpDown, History } from 'lucide-react';

const Stock: React.FC<{ empresa: Empresa }> = ({ empresa }) => {
  const stockAlerts = [
    { item: 'Cimento Portland 50kg', stock: 5, min: 20 },
    { item: 'Tinta Acrílica Branca 18L', stock: 2, min: 5 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestão de Stock</h1>
          <p className="text-sm text-gray-500">Controlo de inventário, entradas e saídas</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-2 bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg text-xs font-bold transition-all">
            <History className="w-4 h-4" />
            <span>Ver Histórico</span>
          </button>
          <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md transition-all">
            <Plus className="w-4 h-4" />
            <span>Novo Produto</span>
          </button>
        </div>
      </div>

      {/* Alert Banner */}
      {stockAlerts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-amber-800">Alertas de Baixo Stock</h4>
            <p className="text-xs text-amber-700 mt-1">
              Existem {stockAlerts.length} itens abaixo do nível mínimo recomendado.
              {stockAlerts.map(a => ` ${a.item} (${a.stock}/${a.min}).`).join('')}
            </p>
          </div>
        </div>
      )}

      {/* Stock Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-800 flex items-center space-x-2">
              <Package className="w-4 h-4 text-blue-600" />
              <span>Inventário Atual</span>
            </h3>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100">
                <th className="px-6 py-4">Produto</th>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4 text-center">Stock Atual</th>
                <th className="px-6 py-4 text-right">PVP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { name: 'Computador HP 250 G8', cat: 'Informática', stock: 12, price: '350.000 Kz' },
                { name: 'Impressora Epson L3210', cat: 'Informática', stock: 8, price: '120.000 Kz' },
                { name: 'Papel A4 Navigator 80g', cat: 'Consumíveis', stock: 45, price: '4.500 Kz' },
                { name: 'Teclado Logitech K120', cat: 'Periféricos', stock: 3, price: '8.500 Kz' },
              ].map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-xs font-semibold text-gray-800">{item.name}</td>
                  <td className="px-6 py-4 text-xs text-gray-500">{item.cat}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-xs font-bold ${item.stock <= 5 ? 'text-rose-600' : 'text-gray-800'}`}>
                      {item.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-gray-800 text-right">{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center space-x-2">
              <ArrowUpDown className="w-4 h-4 text-blue-600" />
              <span>Entrada Rápida</span>
            </h3>
            <form className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-gray-500 font-medium">Produto</label>
                <select className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm focus:outline-none">
                  <option>Selecionar Produto...</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-500 font-medium">Quantidade</label>
                <input type="number" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm focus:outline-none" placeholder="0" />
              </div>
              <button className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg text-xs hover:bg-blue-700 transition-colors">
                Registar Entrada
              </button>
            </form>
          </div>

          <div className="bg-blue-900 p-6 rounded-xl text-white shadow-lg">
            <h4 className="text-sm font-bold mb-2">Valor Total do Stock</h4>
            <p className="text-2xl font-bold">14.280.000,00 Kz</p>
            <div className="mt-4 pt-4 border-t border-blue-800 flex justify-between items-center text-xs text-blue-300">
              <span>58 Itens Diferentes</span>
              <button className="underline">Ver Relatório</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stock;
