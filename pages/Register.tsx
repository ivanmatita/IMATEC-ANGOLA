
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from '../types';
import { Building2, Mail, Lock, Phone, Hash, Layers } from 'lucide-react';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    nif: '',
    contacto: '',
    tipo: 'Privada',
    email: '',
    senha: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulação de registo via SMTPJS no index.tsx
    setTimeout(() => {
      alert('Registo enviado! Por favor, utilize a página principal para ativar a sua empresa.');
      navigate(AppRoute.LOGIN);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-blue-900 p-8 text-center text-white">
          <h1 className="text-2xl font-bold uppercase">Registo ERP</h1>
          <p className="text-blue-300 text-sm mt-1">Multi-Company Setup</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase">Empresa</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input required className="w-full pl-10 pr-4 py-2 bg-gray-50 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nome da Empresa" value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">NIF</label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input required className="w-full pl-10 pr-4 py-2 bg-gray-50 border rounded-lg text-sm" placeholder="540XXXXXXXX" value={formData.nif} onChange={(e) => setFormData({...formData, nif: e.target.value})} />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">Contacto</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input required className="w-full pl-10 pr-4 py-2 bg-gray-50 border rounded-lg text-sm" placeholder="9XXXXXXXX" value={formData.contacto} onChange={(e) => setFormData({...formData, contacto: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase">Tipo</label>
            <div className="relative">
              <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select className="w-full pl-10 pr-4 py-2 bg-gray-50 border rounded-lg text-sm" value={formData.tipo} onChange={(e) => setFormData({...formData, tipo: e.target.value})}>
                <option value="Privada">Privada</option>
                <option value="Individual">Individual</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase">Email Admin</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input required type="email" className="w-full pl-10 pr-4 py-2 bg-gray-50 border rounded-lg text-sm" placeholder="admin@empresa.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input required type="password" className="w-full pl-10 pr-4 py-2 bg-gray-50 border rounded-lg text-sm" placeholder="••••••••" value={formData.senha} onChange={(e) => setFormData({...formData, senha: e.target.value})} />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow-md transition-all hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'A PROCESSAR...' : 'REGISTAR EMPRESA'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
