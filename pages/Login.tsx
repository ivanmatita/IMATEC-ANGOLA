
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppRoute, User, Empresa } from '../types';
import { Mail, Lock, LogIn } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User, empresa: Empresa) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulated login with company isolation logic
    setTimeout(() => {
      // Fixed mockEmpresa to match the Empresa interface in types.ts by removing unknown fields
      const mockEmpresa: Empresa = {
        id: 'emp-123',
        nome: 'IMATEC Teste, Lda',
        nif: '5409876543',
        nome_empresa: 'IMATEC Teste, Lda',
        nif_empresa: '5409876543',
        administrador: 'admin@imatec.co.ao',
        contacto: '923000000',
        email: 'admin@imatec.co.ao',
        tipo_empresa: 'Privada',
        created_at: new Date().toISOString()
      };
      
      const mockUser: User = {
        id: 'user-001',
        empresa_id: mockEmpresa.id,
        nome: 'Gestor IMATEC',
        email: formData.email,
        role: 'admin'
      };

      onLogin(mockUser, mockEmpresa);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-blue-900 p-8 text-center">
          <div className="w-16 h-16 bg-blue-500 rounded-2xl mx-auto flex items-center justify-center text-white font-bold text-3xl mb-4 shadow-lg">I</div>
          <h1 className="text-2xl font-bold text-white font-lato">IMATEC SOFTWARE</h1>
          <p className="text-blue-300 text-sm mt-1">Multi-Company Cloud ERP</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Endereço de Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                required
                type="email"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="exemplo@imatec.co.ao"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Palavra-passe</label>
              <button type="button" className="text-[10px] text-blue-600 font-bold uppercase hover:underline">Esqueceu a senha?</button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                required
                type="password"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="••••••••"
                value={formData.senha}
                onChange={(e) => setFormData({...formData, senha: e.target.value})}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
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

          <p className="text-center text-xs text-gray-500 mt-6">
            Não tem uma conta? <Link to={AppRoute.REGISTER} className="text-blue-600 font-bold hover:underline">Cadastrar Nova Empresa</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
