
import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Package, 
  Users, 
  Receipt 
} from 'lucide-react';
import { Empresa } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';

const data = [
  { name: 'Jan', vendas: 4000, despesas: 2400 },
  { name: 'Fev', vendas: 3000, despesas: 1398 },
  { name: 'Mar', vendas: 2000, despesas: 9800 },
  { name: 'Abr', vendas: 2780, despesas: 3908 },
  { name: 'Mai', vendas: 1890, despesas: 4800 },
  { name: 'Jun', vendas: 2390, despesas: 3800 },
];

const Dashboard: React.FC<{ empresa: Empresa }> = ({ empresa }) => {
  const stats = [
    { label: 'Faturação Mensal', value: '4.250.000 Kz', change: '+12.5%', trend: 'up', icon: TrendingUp },
    { label: 'Despesas Gerais', value: '1.120.000 Kz', change: '-2.4%', trend: 'down', icon: TrendingDown },
    { label: 'Saldo de Caixa', value: '12.450.000 Kz', change: '+5.0%', trend: 'up', icon: Wallet },
    { label: 'Valor de Stock', value: '8.320.000 Kz', change: '+0.8%', trend: 'up', icon: Package },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Resumo Executivo</h1>
          <p className="text-sm text-gray-500">Gestão centralizada da empresa {empresa.nome}</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm text-xs font-semibold text-gray-600">
            Exportar SAFT-AO
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm text-xs font-semibold transition-colors">
            Nova Fatura
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm transition-transform hover:scale-[1.02] duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${idx % 2 === 0 ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-xs font-bold ${stat.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">{stat.label}</h3>
              <p className="text-xl font-bold text-gray-800 mt-1">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-800 flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span>Desempenho de Vendas</span>
            </h3>
            <select className="text-xs border-gray-200 rounded bg-gray-50 p-1 focus:outline-none focus:ring-1 focus:ring-blue-500">
              <option>Últimos 6 meses</option>
              <option>Último ano</option>
            </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="vendas" stroke="#2563eb" fillOpacity={1} fill="url(#colorSales)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-6 flex items-center space-x-2">
            <Users className="w-4 h-4 text-blue-600" />
            <span>Resumo de RH</span>
          </h3>
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-600">Total Funcionários</span>
              <span className="text-sm font-bold text-gray-800">24</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-600">Férias este Mês</span>
              <span className="text-sm font-bold text-gray-800">3</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-600">Ausências Hoje</span>
              <span className="text-sm font-bold text-rose-600">1</span>
            </div>
            <div className="mt-6">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">Próximos Pagamentos</p>
              <div className="flex items-center space-x-3 text-xs text-gray-600">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span>Folha de Salários - 25 Out</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-800 flex items-center space-x-2">
            <Receipt className="w-4 h-4 text-blue-600" />
            <span>Últimas Faturas Emitidas</span>
          </h3>
          <button className="text-xs font-bold text-blue-600 hover:underline">Ver todas</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100">
                <th className="px-6 py-4">Nº Fatura</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Valor Total</th>
                <th className="px-6 py-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { no: 'FR 2024/001', client: 'Empresa Central, SA', date: '2024-10-12', total: '150.000 Kz', status: 'pago' },
                { no: 'FR 2024/002', client: 'João Paulo de Almeida', date: '2024-10-11', total: '45.200 Kz', status: 'pago' },
                { no: 'FR 2024/003', client: 'Tech Solutions Angola', date: '2024-10-10', total: '1.200.000 Kz', status: 'pendente' },
              ].map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-xs font-semibold text-blue-600">{item.no}</td>
                  <td className="px-6 py-4 text-xs font-medium text-gray-700">{item.client}</td>
                  <td className="px-6 py-4 text-xs text-gray-500">{item.date}</td>
                  <td className="px-6 py-4 text-xs font-bold text-gray-800">{item.total}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      item.status === 'pago' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
