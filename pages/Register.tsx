
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppRoute } from '../types';
import { supabase } from '../supabase';
import { Building2, Mail, Lock, CheckCircle, AlertTriangle, ArrowLeft, User as UserIcon } from 'lucide-react';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    nif: '',
    contacto: '',
    tipo: 'Pequena',
    email: '',
    username: '',
    senha: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const emailNorm = formData.email.toLowerCase().trim();
    const userNorm = formData.username.toLowerCase().trim().replace(/\s/g, '');

    // Validação de Username (Proibido @)
    if (userNorm.includes('@')) {
      alert("O Nome de Utilizador não pode conter o símbolo '@'. Utilize apenas letras, números ou sublinhados.");
      setLoading(false);
      return;
    }

    try {
      // 1. Verificações Prévias de Disponibilidade
      const { data: nifCheck } = await supabase.from('empresas').select('id').eq('nif_empresa', formData.nif).single();
      if (nifCheck) throw new Error("Este NIF já está registado em nossa base de dados.");

      const { data: userCheck } = await supabase.from('usuarios').select('id').eq('username', userNorm).single();
      if (userCheck) throw new Error("Este nome de utilizador já está a ser utilizado.");

      // 2. Criar Autenticação Oficial (Dispara SMTP)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: emailNorm,
        password: formData.senha,
        options: {
          emailRedirectTo: window.location.origin + window.location.pathname,
          data: { username: userNorm }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Não foi possível criar o perfil de autenticação.");

      // 3. Criar a Empresa
      const { data: empresa, error: empError } = await supabase
        .from('empresas')
        .insert([{
          nome_empresa: formData.nome.toUpperCase(),
          nif_empresa: formData.nif,
          administrador: emailNorm,
          contacto: formData.contacto,
          tipo_empresa: formData.tipo,
          email: emailNorm
        }])
        .select()
        .single();

      if (empError) throw empError;

      // 4. Criar o Utilizador vinculado à Empresa
      const { error: userError } = await supabase
        .from('usuarios')
        .insert([{
          id: authData.user.id, // Sincronização vital
          empresa_id: empresa.id,
          username: userNorm,
          email: emailNorm,
          password: formData.senha,
          nome: 'Administrador ' + formData.nome,
          role: 'admin'
        }]);

      if (userError) throw userError;

      setSuccess(true);
      setTimeout(() => navigate(AppRoute.LOGIN), 5000);
    } catch (err: any) {
      alert("Falha no Registo: " + (err.message || "Verifique a ligação à internet."));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 animate-in zoom-in-95 duration-500">
        <div className="max-w-md w-full bg-white p-12 rounded-[2.5rem] shadow-2xl text-center space-y-6 border border-emerald-100">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Verifique o E-mail</h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            A plataforma para <b>{formData.nome.toUpperCase()}</b> foi criada. 
            Enviamos um link de ativação para <b>{formData.email}</b> via SMTP seguro.
          </p>
          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">Aceda com:</p>
            <p className="text-sm font-bold text-blue-900 mt-1">@{formData.username.toLowerCase()}</p>
          </div>
          <p className="text-[10px] text-gray-400 animate-pulse font-black uppercase">Redirecionando para o login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 animate-in fade-in duration-500">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-blue-900 p-8 text-center text-white">
          <h1 className="text-2xl font-bold uppercase tracking-tight">Registar Empresa</h1>
          <p className="text-blue-300 text-[10px] uppercase font-bold tracking-widest mt-1">Setup Cloud IMATEC Multi-Company</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nome da Entidade</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input required className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500 uppercase transition-all" placeholder="Ex: IMATEC Tecnologia" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">NIF Fiscal</label>
              <input required className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="540XXXXXXXX" value={formData.nif} onChange={e => setFormData({...formData, nif: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1">Utilizador</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-blue-400" />
                <input required className="w-full pl-8 pr-4 py-3 bg-blue-50 border border-blue-100 rounded-2xl text-sm font-bold text-blue-900" placeholder="Sem @" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">E-mail Administrativo</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input required type="email" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="admin@empresa.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Palavra-passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input required type="password" minLength={6} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" value={formData.senha} onChange={e => setFormData({...formData, senha: e.target.value})} />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-xl hover:bg-blue-700 transition-all disabled:opacity-50 uppercase text-xs tracking-widest mt-4">
            {loading ? 'A CRIAR AMBIENTE...' : 'ATIVAR ERP CLOUD'}
          </button>
          
          <div className="flex items-center justify-center space-x-2 pt-2">
             <ArrowLeft className="w-3 h-3 text-gray-400" />
             <Link to={AppRoute.LOGIN} className="text-[10px] text-gray-400 font-bold uppercase tracking-widest hover:text-blue-600">Voltar ao Login</Link>
          </div>
        </form>

        <div className="p-6 bg-slate-50 border-t flex items-start space-x-3">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[9px] text-gray-500 leading-relaxed font-medium uppercase font-bold tracking-tight">O sistema enviará um e-mail de ativação via Supabase SMTP. Username sem "@" obrigatório.</p>
        </div>
      </div>
    </div>
  );
};

export default Register;
