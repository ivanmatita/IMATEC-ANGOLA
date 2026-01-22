
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

    const emailNormalizado = formData.email.toLowerCase().trim();
    const usernameNormalizado = formData.username.toLowerCase().trim().replace(/\s/g, '');

    try {
      // 1. Validação Prévia de NIF (Evita erro 23505 duplicate key)
      const { data: nifCheck } = await supabase
        .from('empresas')
        .select('nif_empresa')
        .eq('nif_empresa', formData.nif)
        .single();

      if (nifCheck) throw new Error("Já existe uma empresa registada com este NIF.");

      // 2. Validação Prévia de Username
      const { data: userCheck } = await supabase
        .from('usuarios')
        .select('username')
        .eq('username', usernameNormalizado)
        .single();

      if (userCheck) throw new Error("Este nome de utilizador já está em uso.");

      // 3. Registo no Supabase Auth (DISPARA E-MAIL SMTP)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: emailNormalizado,
        password: formData.senha,
        options: {
          emailRedirectTo: window.location.origin + window.location.pathname,
          data: {
            username: usernameNormalizado,
            company_name: formData.nome
          }
        }
      });

      if (authError) throw authError;

      // 4. Criar Empresa na Tabela
      const { data: empresa, error: empError } = await supabase
        .from('empresas')
        .insert([{
          nome_empresa: formData.nome.toUpperCase(),
          nif_empresa: formData.nif,
          administrador: emailNormalizado,
          contacto: formData.contacto,
          tipo_empresa: formData.tipo,
          email: emailNormalizado
        }])
        .select()
        .single();

      if (empError) throw empError;

      // 5. Vincular Utilizador à Empresa
      const { error: profileError } = await supabase
        .from('usuarios')
        .insert([{
          id: authData.user?.id, // Sincroniza ID com Auth
          empresa_id: empresa.id,
          username: usernameNormalizado,
          email: emailNormalizado,
          password: formData.senha, // Para compatibilidade de exibição
          nome: 'Gestor ' + formData.nome,
          role: 'admin'
        }]);

      if (profileError) throw profileError;

      setSuccess(true);
      setTimeout(() => navigate(AppRoute.LOGIN), 4000);
    } catch (err: any) {
      alert("Falha no Registo: " + (err.message || "Erro desconhecido."));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-12 rounded-[2.5rem] shadow-2xl text-center space-y-6">
          <CheckCircle className="w-20 h-20 text-emerald-500 mx-auto" />
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Verifique o seu E-mail</h1>
          <p className="text-slate-500 text-sm">A conta foi criada. Enviamos um link de ativação via SMTP para <b>{formData.email}</b>. Confirme para aceder.</p>
          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">Utilizador:</p>
            <p className="text-sm font-bold text-blue-900 mt-1">@{formData.username.toLowerCase()}</p>
          </div>
          <p className="text-[10px] text-gray-400 animate-pulse font-black uppercase">Redirecionando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-blue-900 p-8 text-center text-white">
          <h1 className="text-2xl font-bold uppercase tracking-tight">Setup Cloud IMATEC</h1>
          <p className="text-blue-300 text-[10px] uppercase font-bold tracking-widest mt-1">Registo Multi-Empresa</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nome da Empresa</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input required className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="Ex: IMATEC Tecnologia" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">NIF Fiscal</label>
              <input required className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="540XXXXXXXX" value={formData.nif} onChange={e => setFormData({...formData, nif: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Username</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                <input required className="w-full pl-8 pr-4 py-3 bg-blue-50 border border-blue-100 rounded-2xl text-sm font-bold" placeholder="gestor_exemplo" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">E-mail Administrativo</label>
            <input required type="email" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="admin@empresa.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Palavra-passe</label>
            <input required type="password" minLength={6} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" value={formData.senha} onChange={e => setFormData({...formData, senha: e.target.value})} />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-xl hover:bg-blue-700 transition-all disabled:opacity-50 uppercase text-xs tracking-widest mt-4">
            {loading ? 'A PROCESSAR...' : 'ATIVAR ERP AGORA'}
          </button>
          
          <div className="text-center pt-2">
            <Link to={AppRoute.LOGIN} className="text-[10px] text-gray-400 font-bold uppercase tracking-widest hover:text-blue-600">Voltar ao Login</Link>
          </div>
        </form>

        <div className="p-6 bg-slate-50 border-t flex items-start space-x-3">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[9px] text-gray-500 leading-relaxed font-medium">O isolamento multi-empresa é garantido pelo empresa_id. O e-mail de ativação será enviado via Supabase SMTP.</p>
        </div>
      </div>
    </div>
  );
};

export default Register;
