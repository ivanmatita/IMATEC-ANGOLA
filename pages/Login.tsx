
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppRoute, User, Empresa } from '../types';
import { supabase } from '../supabase';
import { Mail, Lock, LogIn, ArrowLeft, CheckCircle, User as UserIcon } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User, empresa: Empresa) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'LOGIN' | 'RECOVERY' | 'RECOVERY_SUCCESS'>('LOGIN');
  const [formData, setFormData] = useState({
    loginIdentifier: '',
    senha: ''
  });
  const [recoveryEmail, setRecoveryEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const identifier = formData.loginIdentifier.trim().toLowerCase();
      let targetEmail = identifier;

      // 1. Traduzir Username para Email se necessário
      if (!identifier.includes('@')) {
        const { data: userRec, error: fetchErr } = await supabase
          .from('usuarios')
          .select('email')
          .eq('username', identifier)
          .single();

        if (fetchErr || !userRec) throw new Error("Utilizador não encontrado.");
        targetEmail = userRec.email;
      }

      // 2. Autenticação Oficial Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: targetEmail,
        password: formData.senha
      });

      if (authError) throw authError;

      // 3. Buscar Perfil Completo
      const { data: profile, error: profileError } = await supabase
        .from('usuarios')
        .select('*, empresas(*)')
        .eq('email', targetEmail)
        .single();

      if (profileError || !profile) throw new Error("Falha ao carregar perfil da empresa.");

      onLogin(profile, profile.empresas);
      navigate(AppRoute.DASHBOARD);
    } catch (err: any) {
      alert("Acesso Negado: " + (err.message || "Credenciais inválidas."));
    } finally {
      setLoading(false);
    }
  };

  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(recoveryEmail.trim().toLowerCase(), {
        redirectTo: window.location.origin + window.location.pathname + '#/login'
      });
      if (error) throw error;
      setMode('RECOVERY_SUCCESS');
    } catch (err: any) {
      alert("Erro na recuperação: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (mode === 'RECOVERY_SUCCESS') {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-12 rounded-[2.5rem] shadow-2xl text-center space-y-4">
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto" />
          <h1 className="text-xl font-bold text-slate-800">Link Enviado!</h1>
          <p className="text-slate-500 text-sm">Enviamos instruções de redefinição para o seu e-mail administrativo via SMTP.</p>
          <button onClick={() => setMode('LOGIN')} className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl uppercase text-xs tracking-widest mt-6">Voltar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-blue-900 p-10 text-center">
          <div className="w-14 h-14 bg-blue-500 rounded-2xl mx-auto flex items-center justify-center text-white font-bold text-2xl mb-4 shadow-lg">I</div>
          <h1 className="text-white font-bold text-xl uppercase tracking-tighter">IMATEC SOFTWARE</h1>
          <p className="text-blue-300 text-[10px] font-black uppercase tracking-widest mt-1">ERP Multi-Empresa Cloud</p>
        </div>

        {mode === 'LOGIN' ? (
          <form onSubmit={handleSubmit} className="p-10 space-y-5">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Username ou E-mail</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input required className="w-full pl-10 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="admin ou admin@empresa.com" value={formData.loginIdentifier} onChange={e => setFormData({...formData, loginIdentifier: e.target.value})} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Senha</label>
                <button type="button" onClick={() => setMode('RECOVERY')} className="text-[9px] text-blue-600 font-black uppercase hover:underline">Esqueceu a senha?</button>
              </div>
              <input required type="password" className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" value={formData.senha} onChange={e => setFormData({...formData, senha: e.target.value})} />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50 uppercase text-xs tracking-widest">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <span>Entrar</span>}
            </button>

            <p className="text-center text-[10px] text-gray-400 mt-6 font-black uppercase tracking-widest">
              Nova empresa? <Link to={AppRoute.REGISTER} className="text-blue-600 hover:underline">Registar Agora</Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRecovery} className="p-10 space-y-6">
            <div className="space-y-2 text-center">
              <h3 className="font-bold text-slate-700 uppercase text-sm">Recuperar Acesso</h3>
              <p className="text-[10px] text-gray-500 leading-relaxed font-black uppercase tracking-tight">Insira o e-mail administrativo.</p>
            </div>
            <input required type="email" className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="admin@empresa.com" value={recoveryEmail} onChange={e => setRecoveryEmail(e.target.value)} />
            <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl uppercase text-xs tracking-widest disabled:opacity-50">
              {loading ? "A PROCESSAR..." : "Redefinir Senha"}
            </button>
            <button type="button" onClick={() => setMode('LOGIN')} className="w-full text-[10px] font-black uppercase text-gray-400 flex items-center justify-center space-x-2"><ArrowLeft className="w-3 h-3" /><span>Voltar</span></button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
