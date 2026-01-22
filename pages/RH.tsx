
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  CreditCard, 
  Calendar, 
  FileCheck, 
  Settings, 
  Search, 
  Filter, 
  Plus, 
  Download, 
  FileText, 
  Trash2, 
  Edit, 
  Eye,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  UserCheck,
  FileBadge,
  Upload,
  Printer,
  ChevronLeft,
  ChevronRight,
  Save,
  ArrowLeft,
  ArrowRight,
  Info,
  Clock,
  X
} from 'lucide-react';
import { Empresa, Funcionario, TipoContrato, EstadoFuncionario, ProcessamentoSalario, EfetividadeDiaria } from '../types';

// Tabelas de IRT Angola (Simplificadas para o fluxo de demonstração)
const calculateIRT = (remuneracao: number): number => {
  if (remuneracao <= 100000) return 0;
  if (remuneracao <= 150000) return (remuneracao - 100000) * 0.10 + 2000;
  if (remuneracao <= 200000) return (remuneracao - 150000) * 0.13 + 7000;
  if (remuneracao <= 300000) return (remuneracao - 200000) * 0.16 + 13500;
  if (remuneracao <= 500000) return (remuneracao - 300000) * 0.18 + 29500;
  return (remuneracao - 500000) * 0.22 + 65500;
};

const RH: React.FC<{ empresa: Empresa }> = ({ empresa }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'funcionarios' | 'processamento' | 'mapas' | 'config'>('dashboard');
  const [rhView, setRhView] = useState<'LISTA' | 'EFETIVIDADE' | 'RECIBO'>('LISTA');
  const [selectedFuncs, setSelectedFuncs] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Dados Mockados de Funcionários (Isolados por empresa_id)
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([
    {
      id: '1',
      empresa_id: empresa.id,
      nome: 'INACIOO',
      bi: '001234567LA041',
      nif: '5401234567',
      data_nascimento: '1992-05-15',
      estado_civil: 'Solteiro(a)',
      nacionalidade: 'Angolana',
      morada: 'Maianga, Luanda',
      contacto: '923 000 001',
      email: 'inacio@email.com',
      profissao: 'Secretaria',
      cargo: 'Secretária de Administração',
      tipo_contrato: 'Indeterminado',
      data_admissao: '2023-01-10',
      salario_base: 100000,
      dependentes: 0,
      regime_trabalho: 'Integral',
      estado: 'Ativo'
    },
    {
      id: '2',
      empresa_id: empresa.id,
      nome: 'João Manuel Baptista',
      bi: '009876543BE021',
      nif: '5409876543',
      data_nascimento: '1985-11-20',
      estado_civil: 'Casado(a)',
      nacionalidade: 'Angolana',
      morada: 'Talatona, Luanda',
      contacto: '923 111 222',
      email: 'joao.baptista@email.com',
      profissao: 'Analista de Sistemas',
      cargo: 'Gestor de TI',
      tipo_contrato: 'Indeterminado',
      data_admissao: '2022-03-01',
      salario_base: 450000,
      dependentes: 2,
      regime_trabalho: 'Integral',
      estado: 'Ativo'
    }
  ]);

  const [processamentos, setProcessamentos] = useState<ProcessamentoSalario[]>([]);
  const [efetividades, setEfetividades] = useState<Record<string, EfetividadeDiaria>>({});

  // Form State para Admissão
  const [newFunc, setNewFunc] = useState<Partial<Funcionario>>({
    estado: 'Ativo',
    empresa_id: empresa.id,
    tipo_contrato: 'Indeterminado',
    regime_trabalho: 'Integral',
    data_admissao: new Date().toISOString().split('T')[0]
  });

  // Inicialização de Efetividade para Demo
  useEffect(() => {
    const initEfet: Record<string, EfetividadeDiaria> = {};
    funcionarios.forEach(f => {
      initEfet[f.id] = {
        id: f.id,
        funcionario_id: f.id,
        empresa_id: empresa.id,
        mes: 1,
        ano: 2026,
        registos: Array.from({length: 31}, (_, i) => i + 1).reduce((acc, d) => ({...acc, [d]: 'SERVIÇO'}), {}),
        horas_extra: {},
        horas_perdidas: {},
        abonos: 0,
        subsidios: 30000,
        premios: 0,
        adiantamentos: 0,
        observacoes: ''
      };
    });
    setEfetividades(initEfet);
  }, [funcionarios, empresa.id]);

  const toggleSelectFunc = (id: string) => {
    setSelectedFuncs(prev => prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]);
  };

  const handleStartProcess = () => {
    if (selectedFuncs.length === 0) {
      alert("Selecione os funcionários na lista para iniciar.");
      return;
    }
    setRhView('EFETIVIDADE');
  };

  const handleSaveFuncionario = (e: React.FormEvent) => {
    e.preventDefault();
    const id = Math.random().toString(36).substr(2, 9);
    const func: Funcionario = { ...newFunc as Funcionario, id };
    setFuncionarios([...funcionarios, func]);
    setShowForm(false);
    setNewFunc({ estado: 'Ativo', empresa_id: empresa.id });
    alert("Funcionário admitido com sucesso!");
  };

  // --- COMPONENTES DE VISUALIZAÇÃO ---

  const EfetividadeGrid = () => {
    const [idx, setIdx] = useState(0);
    const fId = selectedFuncs[idx];
    const f = funcionarios.find(v => v.id === fId);
    const e = efetividades[fId];
    if (!f || !e) return null;

    const dias = Array.from({length: 31}, (_, i) => i + 1);
    
    const updateReg = (dia: number, status: any) => {
      setEfetividades(prev => ({
        ...prev,
        [fId]: { ...prev[fId], registos: { ...prev[fId].registos, [dia]: status } }
      }));
    };

    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button onClick={() => setRhView('LISTA')} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5 text-gray-500" /></button>
            <div>
              <h3 className="text-sm font-bold text-gray-800">Mapa de Efetividade: {f.nome}</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Janeiro de 2026</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Funcionário {idx + 1} de {selectedFuncs.length}</span>
            <div className="flex space-x-1">
              <button disabled={idx === 0} onClick={() => setIdx(v => v - 1)} className="p-2 bg-gray-50 border border-gray-200 rounded-lg disabled:opacity-20"><ChevronLeft className="w-4 h-4" /></button>
              <button disabled={idx === selectedFuncs.length - 1} onClick={() => setIdx(v => v + 1)} className="p-2 bg-gray-50 border border-gray-200 rounded-lg disabled:opacity-20"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div><span className="text-[10px] font-bold text-gray-500">FOLGA</span></div>
              <div className="flex items-center space-x-1"><div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div><span className="text-[10px] font-bold text-gray-500">SERVIÇO</span></div>
              <div className="flex items-center space-x-1"><div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div><span className="text-[10px] font-bold text-gray-500">INJUSTIFICADA</span></div>
            </div>
            <button className="text-[10px] font-bold text-blue-600 uppercase tracking-widest flex items-center space-x-1">
              <Settings className="w-3 h-3" />
              <span>Preenchimento Inteligente</span>
            </button>
          </div>
          <table className="w-full text-center min-w-[1200px]">
            <thead>
              <tr className="bg-gray-50 text-[9px] font-bold text-gray-400 uppercase">
                <th className="px-4 py-3 text-left border-r border-gray-100 w-40">Registo</th>
                {dias.map(d => <th key={d} className="px-1 border-r border-gray-100">{d}</th>)}
                <th className="px-4 py-3 bg-blue-900 text-white">Total</th>
              </tr>
            </thead>
            <tbody>
              {['FOLGA', 'SERVIÇO', 'INJUSTIFICADA'].map(cat => (
                <tr key={cat} className="border-b border-gray-100">
                  <td className="px-4 py-3 text-left border-r border-gray-100 text-[10px] font-bold text-gray-600">{cat}</td>
                  {dias.map(d => (
                    <td key={d} className="px-1 py-3 border-r border-gray-100">
                      <button 
                        onClick={() => updateReg(d, cat)}
                        className={`w-5 h-5 rounded-full border-2 transition-all mx-auto ${e.registos[d] === cat ? 'bg-blue-600 border-blue-600 shadow-lg shadow-blue-500/30' : 'border-gray-200 hover:border-blue-200'}`}
                      ></button>
                    </td>
                  ))}
                  <td className="font-bold text-gray-800">{Object.values(e.registos).filter(v => v === cat).length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end pt-4">
           <button onClick={() => setRhView('RECIBO')} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl text-xs font-bold shadow-xl flex items-center space-x-2">
             <Save className="w-4 h-4" />
             <span>CONFIRMAR E PROCESSAR SALÁRIO</span>
           </button>
        </div>
      </div>
    );
  };

  const ReciboDetail = () => {
    const f = funcionarios.find(v => v.id === selectedFuncs[0])!;
    const liquido = f.salario_base + 22333 + 1222 - (f.salario_base * 0.03); // Demo simple

    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-in zoom-in-95 duration-500 pb-10">
        <div className="flex items-center justify-between">
          <button onClick={() => setRhView('EFETIVIDADE')} className="text-xs font-bold text-gray-500 hover:text-blue-600 flex items-center space-x-2"><ArrowLeft className="w-4 h-4" /><span>Voltar</span></button>
          <div className="flex space-x-2"><button className="p-2 border rounded-lg"><Download className="w-4 h-4" /></button><button className="p-2 border rounded-lg"><Printer className="w-4 h-4" /></button></div>
        </div>
        <div className="bg-white border border-gray-200 shadow-2xl rounded-sm p-8 font-mono text-[11px] text-gray-800">
          <div className="text-center border-b-2 border-gray-900 pb-4 mb-6">
            <h2 className="text-sm font-black tracking-[0.2em] uppercase">Recibo de Salário</h2>
          </div>
          <div className="flex justify-between items-start mb-10">
            <div>
              <h3 className="text-lg font-black">{f.nome}</h3>
              <p className="font-bold text-blue-600 uppercase text-[9px]">{f.profissao}</p>
            </div>
            <div className="text-right font-bold">Janeiro de 2026</div>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-800 text-[10px] font-black uppercase"><th className="text-left py-2">Cod</th><th className="text-left py-2">Descritivo</th><th className="text-center py-2">Qtd</th><th className="text-right py-2">Valor</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr><td className="py-2.5">01</td><td>Vencimento Base</td><td className="text-center">31</td><td className="text-right font-bold">{f.salario_base.toLocaleString()},00</td></tr>
              <tr><td className="py-2.5">02</td><td>Abono de Família</td><td className="text-center">Vg</td><td className="text-right font-bold">1.222,00</td></tr>
              <tr><td className="py-2.5">03</td><td>Subsídio Alojamento</td><td className="text-center">Vg</td><td className="text-right font-bold">22.333,00</td></tr>
              <tr className="text-rose-600"><td>10</td><td>INSS Trabalhador (3%)</td><td className="text-center"></td><td className="text-right font-bold">- {(f.salario_base * 0.03).toLocaleString()},00</td></tr>
            </tbody>
          </table>
          <div className="mt-10 pt-4 border-t-2 border-gray-900 text-right">
            <span className="text-xs font-bold uppercase mr-4">Total Líquido:</span>
            <span className="text-2xl font-black text-blue-900 underline decoration-double">{liquido.toLocaleString()},00 Kz</span>
          </div>
          <div className="mt-12 flex justify-center">
             <button onClick={() => { 
                setRhView('LISTA'); 
                setProcessamentos([...processamentos, { funcionario_id: f.id, mes: 1, ano: 2026, liquido, estado: 'Processado' } as any]);
                setSelectedFuncs([]);
                alert("Pagamento processado com sucesso!");
             }} className="bg-emerald-500 hover:bg-emerald-600 text-white px-16 py-3 rounded-xl font-bold transition-all shadow-lg uppercase tracking-widest text-xs">Finalizar Processamento</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Título e Ações Superiores */}
      {rhView === 'LISTA' && (
        <>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Recursos Humanos</h1>
              <p className="text-sm text-gray-500">Isolamento Multiempresa: Dados de <b>{empresa.nome}</b></p>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setShowForm(true)}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span>Admitir Funcionário</span>
              </button>
            </div>
          </div>

          {/* Abas de Navegação */}
          <div className="bg-white border-b border-gray-200 px-2 flex space-x-1 overflow-x-auto">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Users },
              { id: 'funcionarios', label: 'Funcionários', icon: UserCheck },
              { id: 'processamento', label: 'Folha de Salários', icon: CreditCard },
              { id: 'mapas', label: 'Mapas e Relatórios', icon: FileBadge },
              { id: 'config', label: 'Configurações', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-3 text-xs font-bold transition-all border-b-2 ${
                    activeTab === tab.id 
                      ? 'border-blue-600 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-blue-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* Conteúdo por Aba */}
      {rhView === 'LISTA' && (
        <div className="animate-in fade-in duration-500">
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
               {[
                { label: 'Total Funcionários', value: funcionarios.length, icon: Users, color: 'blue' },
                { label: 'Processados (Jan)', value: processamentos.length, icon: CheckCircle2, color: 'emerald' },
                { label: 'Faltas no Mês', value: 0, icon: AlertCircle, color: 'amber' },
                { label: 'Valor da Folha', value: `${processamentos.reduce((a,b) => a+b.liquido, 0).toLocaleString()} Kz`, icon: Briefcase, color: 'indigo' },
              ].map((s, i) => (
                <div key={i} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm transition-transform hover:scale-105">
                  <div className={`p-2 rounded-lg w-fit bg-${s.color}-50 text-${s.color}-600 mb-4`}><s.icon className="w-5 h-5" /></div>
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-widest">{s.label}</h3>
                  <p className="text-xl font-bold text-gray-800 mt-1">{s.value}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'funcionarios' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-gray-200 flex space-x-4">
                 <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="Filtrar por nome ou BI..." className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                 </div>
                 <button className="p-2 border rounded-lg hover:bg-gray-50"><Filter className="w-4 h-4 text-gray-400" /></button>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 font-bold uppercase tracking-widest text-gray-400">
                    <tr>
                      <th className="px-6 py-4">Funcionário</th>
                      <th className="px-6 py-4">BI / NIF</th>
                      <th className="px-6 py-4">Cargo / Tipo</th>
                      <th className="px-6 py-4 text-right">Salário Base</th>
                      <th className="px-6 py-4">Estado</th>
                      <th className="px-6 py-4 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {funcionarios.filter(f => f.nome.toLowerCase().includes(searchTerm.toLowerCase())).map(f => (
                      <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-gray-800">{f.nome}</td>
                        <td className="px-6 py-4 text-gray-500">{f.bi} / {f.nif}</td>
                        <td className="px-6 py-4 text-gray-500">{f.cargo} ({f.tipo_contrato})</td>
                        <td className="px-6 py-4 text-right font-bold text-gray-800">{f.salario_base.toLocaleString()} Kz</td>
                        <td className="px-6 py-4">
                           <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${f.estado === 'Ativo' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{f.estado}</span>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex justify-center space-x-2">
                             <button className="p-1 hover:text-blue-600 transition-colors"><Edit className="w-4 h-4" /></button>
                             <button className="p-1 hover:text-rose-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'processamento' && (
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-xl border border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-800">Processamento Mensal - Janeiro 2026</h3>
                  <p className="text-xs text-gray-500">Selecione os funcionários e avance para o mapa de efetividade.</p>
                </div>
                <div className="flex space-x-2">
                   <button onClick={handleStartProcess} className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-lg transition-all">Processar Efetividade</button>
                   <button onClick={handleStartProcess} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-lg transition-all">Processar Salário</button>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 font-bold uppercase tracking-widest text-gray-400">
                    <tr>
                      <th className="px-6 py-4 w-10">
                        <input type="checkbox" checked={selectedFuncs.length === funcionarios.length} onChange={() => setSelectedFuncs(selectedFuncs.length === funcionarios.length ? [] : funcionarios.map(f => f.id))} className="rounded border-gray-300 text-blue-600" />
                      </th>
                      <th className="px-6 py-4">Nome do Trabalhador</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Líquido</th>
                      <th className="px-6 py-4 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {funcionarios.map(f => {
                       const p = processamentos.find(v => v.funcionario_id === f.id);
                       return (
                        <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <input type="checkbox" checked={selectedFuncs.includes(f.id)} onChange={() => toggleSelectFunc(f.id)} className="rounded border-gray-300 text-blue-600" />
                          </td>
                          <td className="px-6 py-4">
                             <div className="flex flex-col">
                                <span className="font-bold text-gray-800">{f.nome}</span>
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{f.bi}</span>
                             </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${p ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>{p ? 'Processado' : 'Pendente'}</span>
                          </td>
                          <td className="px-6 py-4 text-right font-bold text-gray-800">{p ? `${p.liquido.toLocaleString()} Kz` : '--'}</td>
                          <td className="px-6 py-4">
                             <div className="flex justify-center space-x-2">
                               <button className="p-1 hover:text-blue-600" title="Ver Recibo"><FileText className="w-4 h-4" /></button>
                               <button className="p-1 hover:text-emerald-600" title="Reprocessar"><Clock className="w-4 h-4" /></button>
                             </div>
                          </td>
                        </tr>
                       );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'mapas' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {[
                { name: 'Mapa de Salário', desc: 'Resumo de remunerações e impostos', icon: FileText },
                { name: 'Mapa de Efetividade', desc: 'Registo mensal de assiduidade', icon: UserCheck },
                { name: 'Mapa INSS', desc: 'Guia para Segurança Social', icon: Briefcase },
                { name: 'Mapa IRT', desc: 'Retenção na fonte (AGT)', icon: FileBadge },
                { name: 'Mapa de Férias', desc: 'Planeamento anual do staff', icon: Calendar },
                { name: 'Listagem Trabalhadores', desc: 'Quadro completo de pessoal', icon: Users },
               ].map((m, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-blue-500 transition-all cursor-pointer group">
                  <div className="p-2 bg-gray-50 text-gray-400 rounded-lg w-fit group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors mb-4"><m.icon className="w-6 h-6" /></div>
                  <h4 className="font-bold text-gray-800 text-sm">{m.name}</h4>
                  <p className="text-xs text-gray-500 mt-1">{m.desc}</p>
                  <div className="mt-4 pt-4 border-t border-gray-50 flex space-x-2">
                    <button className="text-[10px] font-black text-blue-600 hover:underline uppercase tracking-widest">Visualizar</button>
                    <button className="text-[10px] font-black text-blue-600 hover:underline uppercase tracking-widest">PDF</button>
                    <button className="text-[10px] font-black text-blue-600 hover:underline uppercase tracking-widest">Excel</button>
                  </div>
                </div>
               ))}
            </div>
          )}

          {activeTab === 'config' && (
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
               <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center space-x-2"><Settings className="w-5 h-5 text-blue-600" /><span>Configurações Legais (Angola)</span></h3>
               <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1"><label className="text-xs font-bold text-gray-400 uppercase">INSS Trabalhador (%)</label><input type="number" defaultValue={3} className="w-full bg-gray-50 border p-3 rounded-lg font-bold" /></div>
                     <div className="space-y-1"><label className="text-xs font-bold text-gray-400 uppercase">INSS Patronal (%)</label><input type="number" defaultValue={8} className="w-full bg-gray-50 border p-3 rounded-lg font-bold" /></div>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                    <h4 className="text-xs font-bold text-blue-800 flex items-center space-x-2"><Info className="w-4 h-4" /><span>Tabela de IRT</span></h4>
                    <p className="text-[10px] text-blue-600 mt-2 font-medium">As taxas de IRT são calculadas automaticamente com base no OGE 2026. Nenhuma alteração manual é necessária na estrutura de cálculo base.</p>
                  </div>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all text-sm uppercase tracking-widest">Gravar Parâmetros</button>
               </div>
            </div>
          )}
        </div>
      )}

      {/* Sub-Views de Processamento */}
      {rhView === 'EFETIVIDADE' && <EfetividadeGrid />}
      {rhView === 'RECIBO' && <ReciboDetail />}

      {/* Modal de Admissão - Estilo Fino/Simples IMATEC */}
      {showForm && (
        <div className="fixed inset-0 bg-blue-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-blue-100 flex flex-col max-h-[90vh]">
             <div className="p-6 bg-blue-900 text-white flex items-center justify-between">
                <h2 className="text-lg font-bold flex items-center space-x-2"><UserPlus className="w-5 h-5" /><span>Admissão de Novo Trabalhador</span></h2>
                <button onClick={() => setShowForm(false)} className="hover:rotate-90 transition-transform"><X className="w-6 h-6" /></button>
             </div>
             <form onSubmit={handleSaveFuncionario} className="p-8 overflow-y-auto space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {/* Coluna 1 */}
                   <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-blue-600 uppercase border-b pb-2 tracking-widest">Identificação</h4>
                      <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase">Nome Completo</label><input required className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-blue-500 outline-none" onChange={e => setNewFunc({...newFunc, nome: e.target.value})} /></div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase">BI</label><input required className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-xs outline-none" onChange={e => setNewFunc({...newFunc, bi: e.target.value})} /></div>
                        <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase">NIF</label><input required className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-xs outline-none" onChange={e => setNewFunc({...newFunc, nif: e.target.value})} /></div>
                      </div>
                      <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase">Data Nascimento</label><input type="date" required className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-xs outline-none" onChange={e => setNewFunc({...newFunc, data_nascimento: e.target.value})} /></div>
                   </div>
                   {/* Coluna 2 */}
                   <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-blue-600 uppercase border-b pb-2 tracking-widest">Contacto e Residência</h4>
                      <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase">Morada Completa</label><input required className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-xs outline-none" onChange={e => setNewFunc({...newFunc, morada: e.target.value})} /></div>
                      <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase">Telemóvel</label><input required className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-xs outline-none" onChange={e => setNewFunc({...newFunc, contacto: e.target.value})} /></div>
                      <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase">Email</label><input type="email" required className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-xs outline-none" onChange={e => setNewFunc({...newFunc, email: e.target.value})} /></div>
                   </div>
                   {/* Coluna 3 */}
                   <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-blue-600 uppercase border-b pb-2 tracking-widest">Profissional</h4>
                      <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase">Cargo / Função</label><input required className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-xs outline-none" onChange={e => setNewFunc({...newFunc, cargo: e.target.value, profissao: e.target.value})} /></div>
                      <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase">Tipo de Contrato</label>
                        <select className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-xs outline-none" onChange={e => setNewFunc({...newFunc, tipo_contrato: e.target.value as any})}>
                          <option value="Indeterminado">Tempo Indeterminado</option>
                          <option value="Termo Certo">Termo Certo</option>
                          <option value="Termo Incerto">Termo Incerto</option>
                          <option value="Estágio">Estágio Profissional</option>
                        </select>
                      </div>
                      <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase">Salário Base (Kz)</label><input type="number" required className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-sm font-black text-blue-700 outline-none" onChange={e => setNewFunc({...newFunc, salario_base: Number(e.target.value)})} /></div>
                   </div>
                </div>
                
                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center space-x-3 text-gray-400 hover:text-blue-500 hover:border-blue-200 transition-all cursor-pointer">
                   <Upload className="w-5 h-5" />
                   <span className="text-[10px] font-black uppercase tracking-widest">Anexar Documentação (BI, NIF, Contrato)</span>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t">
                   <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 text-xs font-black text-gray-400 hover:text-gray-600 uppercase tracking-widest transition-colors">Cancelar</button>
                   <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-2xl text-xs font-black shadow-xl shadow-blue-500/20 uppercase tracking-widest transition-all">Concluir Admissão</button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RH;
