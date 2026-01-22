import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppRoute, User, Empresa } from '../types';
import { supabase } from '../supabase';
import { Mail, Lock, LogIn, Key, ArrowLeft, CheckCircle } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User, empresa: Empresa) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'LOGIN' | 'RECOVERY' | 'RECOVERY_SUCCESS'>('LOGIN');
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });
  const [recoveryEmail, setRecoveryEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Busca o usuário e a empresa vinculada em uma única query para isolamento total
      const { data: user, error: userError } = await supabase
        .from('usuarios')
        .select('*, empresas(*)')
        .eq('email', formData.email.toLowerCase().trim())
        .eq('password', formData.senha)
        .single();

      if (userError || !user) {
        throw new Error("E-mail ou palavra-passe incorretos. Por favor, tente novamente.");
      }

      if (!user.empresas) {
        throw new Error("Erro de integridade: Empresa não encontrada para este utilizador.");
      }

      // Sucesso no login - Passa dados para o App.tsx que gerencia a sessão
      onLogin(user, user.empresas);
      navigate(AppRoute.DASHBOARD);
    } catch (err: any) {
      alert(err.message || "Falha na autenticação. Verifique sua conexão.");
    } finally {
      setLoading(false);
    }
  };

  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Verificar se o e-mail existe no banco
      const { data: user, error } = await supabase
        .from('usuarios')
        .select('email, password, nome')
        .eq('email', recoveryEmail.toLowerCase().trim())
        .single();

      if (error || !user) {
        throw new Error("Não encontramos nenhuma conta com este endereço de e-mail.");
      }

      // 2. Enviar e-mail com as credenciais usando EmailJS
      const emailjs = (window as any).emailjs;
      if (emailjs) {
        await emailjs.send("service_imatec", "template_recovery", {
          to_email: user.email,
          user_name: user.nome,
          user_pass: user.password
        });
        setMode('RECOVERY_SUCCESS');
      } else {
        throw new Error("Serviço de e-mail temporariamente indisponível.");
      }
    } catch (err: any) {
      alert(err.message || "Erro ao processar recuperação.");
    } finally {
      setLoading(false);
    }
  };

  if (mode === 'RECOVERY_SUCCESS') {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-12 rounded-[2.5rem] shadow-2xl text-center space-y-4">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">E-mail Enviado!</h1>
          <p className="text-slate-500">As suas credenciais de acesso foram enviadas para <b>{recoveryEmail}</b>. Verifique a sua caixa de entrada e spam.</p>
          <button 
            onClick={() => setMode('LOGIN')}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl uppercase text-xs tracking-widest mt-6"
          >
            Voltar ao Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 animate-in fade-in duration-500">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-blue-900 p-10 text-center relative">
          <div className="w-14 h-14 bg-blue-500 rounded-2xl mx-auto flex items-center justify-center text-white font-bold text-2xl mb-4 shadow-lg">I</div>
          <h1 className="text-white font-bold text-xl uppercase tracking-tighter">IMATEC SOFTWARE</h1>
          <p className="text-blue-300 text-[10px] font-black uppercase tracking-widest mt-1">Cloud ERP Multi-Empresa</p>
        </div>

        {mode === 'LOGIN' ? (
          <form onSubmit={handleSubmit} className="p-10 space-y-5">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">E-mail Administrativo</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  required 
                  type="email" 
                  className="w-full pl-10 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                  placeholder="admin@empresa.co.ao" 
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Palavra-passe</label>
                <button 
                  type="button" 
                  onClick={() => setMode('RECOVERY')} 
                  className="text-[9px] text-blue-600 font-black uppercase hover:underline"
                >
                  Esqueceu a senha?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  required 
                  type="password" 
                  className="w-full pl-10 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                  placeholder="••••••••" 
                  value={formData.senha} 
                  onChange={(e) => setFormData({...formData, senha: e.target.value})} 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 uppercase text-xs tracking-widest"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Entrar no Sistema</span>
                </>
              )}
            </button>

            <p className="text-center text-[10px] text-gray-400 mt-6 font-black uppercase tracking-widest">
              Não tem conta? <Link to={AppRoute.REGISTER} className="text-blue-600 hover:underline">Registar Empresa</Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRecovery} className="p-10 space-y-6">
            <div className="space-y-2">
              <h3 className="font-bold text-slate-700 uppercase text-sm tracking-widest text-center">Recuperar Acesso</h3>
              <p className="text-[10px] text-gray-500 text-center leading-relaxed">Insira o seu e-mail de administrador para receber os seus dados de acesso diretamente.</p>
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">E-mail Registado</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  required 
                  type="email" 
                  className="w-full pl-10 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                  placeholder="admin@empresa.com" 
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-lg uppercase text-xs tracking-widest disabled:opacity-50"
            >
              {loading ? "A PROCESSAR..." : "Recuperar Credenciais"}
            </button>
            
            <button 
              type="button" 
              onClick={() => setMode('LOGIN')} 
              className="w-full text-[10px] font-black uppercase text-gray-400 hover:text-blue-600 transition-colors flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Voltar ao Login</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;