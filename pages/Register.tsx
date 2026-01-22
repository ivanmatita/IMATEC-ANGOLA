import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppRoute } from '../types';
import { supabase } from '../supabase';
import { Building2, Mail, Lock, CheckCircle, AlertTriangle, ArrowLeft } from 'lucide-react';

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
    senha: ''
  });

  const sendWelcomeEmail = async (email: string, nome: string, pass: string) => {
    try {
      const emailjs = (window as any).emailjs;
      if (emailjs) {
        await emailjs.send("service_imatec", "template_welcome", {
          to_email: email,
          company_name: nome,
          admin_email: email,
          admin_pass: pass,
          activation_date: new Date().toLocaleDateString('pt-AO')
        });
      }
    } catch (err) {
      console.warn("[IMATEC] Falha ao disparar e-mail automático, mas o registo em BD foi bem-sucedido.", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const emailNormalizado = formData.email.toLowerCase().trim();

    try {
      // 1. Criar Empresa - Garantindo que todos os campos NOT NULL da setup.sql sejam preenchidos
      const { data: empresa, error: empError } = await supabase
        .from('empresas')
        .insert([{
          nome_empresa: formData.nome.toUpperCase(),
          nif_empresa: formData.nif,
          administrador: emailNormalizado,
          contacto: formData.contacto,
          tipo_empresa: formData.tipo,
          email: emailNormalizado,
          created_at: new Date()
        }])
        .select()
        .single();

      if (empError) {
        if (empError.code === '23505') throw new Error("Este NIF já está registado em outra plataforma IMATEC.");
        throw empError;
      }

      // 2. Criar Utilizador Administrador vinculado à nova empresa
      const { error: userError } = await supabase
        .from('usuarios')
        .insert([{
          empresa_id: empresa.id,
          email: emailNormalizado,
          password: formData.senha,
          nome: 'Administrador ' + formData.nome,
          role: 'admin'
        }]);

      if (userError) {
        if (userError.code === '23505') throw new Error("Este endereço de e-mail já está associado a uma conta ativa.");
        throw userError;
      }

      // 3. Enviar e-mail de boas-vindas com os acessos
      await sendWelcomeEmail(emailNormalizado, formData.nome, formData.senha);
      
      setSuccess(true);
      // Aguarda 3 segundos para mostrar o sucesso antes de redirecionar
      setTimeout(() => navigate(AppRoute.LOGIN), 4000);
    } catch (err: any) {
      alert("Falha no Registo: " + (err.message || "Verifique a sua conexão ou se os dados já existem."));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 animate-in zoom-in-95 duration-500">
        <div className="max-w-md w-full bg-white p-12 rounded-[2.5rem] shadow-2xl text-center space-y-6">
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 border-4 border-emerald-50">
            <CheckCircle className="w-12 h-12" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Ambiente Ativado!</h1>
            <p className="text-slate-500 text-sm leading-relaxed">A plataforma <b>{formData.nome.toUpperCase()}</b> foi configurada com sucesso na nossa nuvem.</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">Enviamos os seus acessos para:</p>
            <p className="text-sm font-bold text-blue-900 mt-1">{formData.email}</p>
          </div>
          <p className="text-[10px] text-gray-400 animate-pulse font-black uppercase tracking-[0.2em] pt-4">Redirecionando para o login em instantes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 animate-in fade-in duration-500">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-blue-900 p-8 text-center text-white">
          <h1 className="text-2xl font-bold uppercase tracking-tight">Criar Conta Cloud</h1>
          <p className="text-blue-300 text-[10px] uppercase font-bold tracking-widest mt-1">Setup Multi-Company Profissional</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nome da Empresa</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                required 
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500 uppercase transition-all" 
                placeholder="Ex: IMATEC Tecnologia, Lda" 
                value={formData.nome} 
                onChange={(e) => setFormData({...formData, nome: e.target.value})} 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">NIF Fiscal</label>
              <input 
                required 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                placeholder="540XXXXXXXX" 
                value={formData.nif} 
                onChange={(e) => setFormData({...formData, nif: e.target.value})} 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contacto</label>
              <input 
                required 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                placeholder="9XXXXXXXX" 
                value={formData.contacto} 
                onChange={(e) => setFormData({...formData, contacto: e.target.value})} 
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1">Tipo de Empresa</label>
            <select 
              required 
              className="w-full px-4 py-3 bg-blue-50 border border-blue-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold text-blue-900" 
              value={formData.tipo} 
              onChange={(e) => setFormData({...formData, tipo: e.target.value})}
            >
              <option value="Pequena">Pequena Empresa (Micro)</option>
              <option value="Media">Média Empresa (PME)</option>
              <option value="Grande">Grande Empresa / Grupo</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">E-mail Administrativo</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                required 
                type="email" 
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                placeholder="admin@empresa.co.ao" 
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Definir Senha de Acesso</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                required 
                type="password" 
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                placeholder="••••••••" 
                value={formData.senha} 
                onChange={(e) => setFormData({...formData, senha: e.target.value})} 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all disabled:opacity-50 uppercase text-xs tracking-widest mt-4"
          >
            {loading ? 'A CONFIGURAR NUVEM...' : 'ATIVAR ERP AGORA'}
          </button>
          
          <div className="flex items-center justify-center space-x-2 pt-2">
            <ArrowLeft className="w-3 h-3 text-gray-400" />
            <Link to={AppRoute.LOGIN} className="text-[10px] text-gray-400 font-bold uppercase tracking-widest hover:text-blue-600 transition-colors">Voltar ao Login</Link>
          </div>
        </form>

        <div className="p-6 bg-slate-50 border-t flex items-start space-x-3">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[9px] text-gray-500 leading-relaxed font-medium">Ao clicar em ativar, você aceita os termos de uso do IMATEC SOFTWARE. O sistema é isolado por empresa_id garantindo total privacidade dos seus dados.</p>
        </div>
      </div>
    </div>
  );
};

export default Register;