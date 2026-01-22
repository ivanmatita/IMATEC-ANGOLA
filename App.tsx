import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppRoute, User, Empresa } from './types';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Faturacao from './pages/Faturacao';
import Stock from './pages/Stock';
import RH from './pages/RH';
import POS from './pages/POS';
import Layout from './components/Layout';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = () => {
      try {
        const savedSession = localStorage.getItem('imatec_session');
        if (savedSession) {
          const data = JSON.parse(savedSession);
          if (data.user && data.empresa) {
            setUser(data.user);
            setEmpresa(data.empresa);
          } else {
            localStorage.removeItem('imatec_session');
          }
        }
      } catch (e) {
        console.error("[IMATEC] Erro ao carregar sessão:", e);
        localStorage.removeItem('imatec_session');
      } finally {
        setLoading(false);
      }
    };

    // Executa imediatamente para evitar páginas brancas
    checkSession();
  }, []);

  const handleLogin = (userData: User, empresaData: Empresa) => {
    setUser(userData);
    setEmpresa(empresaData);
    localStorage.setItem('imatec_session', JSON.stringify({ user: userData, empresa: empresaData }));
  };

  const handleLogout = () => {
    setUser(null);
    setEmpresa(null);
    localStorage.removeItem('imatec_session');
  };

  // Enquanto verifica a sessão, mostramos o loader temático
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50 space-y-4">
        <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Verificando Ambiente Cloud...</p>
      </div>
    );
  }

  return (
    <HashRouter>
      <Routes>
        {/* Rota de Login: Se já estiver logado, vai pro dashboard */}
        <Route 
          path={AppRoute.LOGIN} 
          element={!user ? <Login onLogin={handleLogin} /> : <Navigate to={AppRoute.DASHBOARD} replace />} 
        />
        
        {/* Rota de Registo: Aberta a novas empresas */}
        <Route 
          path={AppRoute.REGISTER} 
          element={!user ? <Register /> : <Navigate to={AppRoute.DASHBOARD} replace />} 
        />
        
        {/* Proteção de Rotas com Layout Multi-Empresa */}
        <Route element={user ? <Layout user={user} empresa={empresa!} onLogout={handleLogout} /> : <Navigate to={AppRoute.LOGIN} replace />}>
          <Route path={AppRoute.DASHBOARD} element={<Dashboard empresa={empresa!} />} />
          <Route path={AppRoute.FATURACAO} element={<Faturacao empresa={empresa!} />} />
          <Route path={AppRoute.STOCK} element={<Stock empresa={empresa!} />} />
          <Route path={AppRoute.RH} element={<RH empresa={empresa!} />} />
          <Route path={AppRoute.POS} element={<POS empresa={empresa!} />} />
          
          {/* Fallback para rotas protegidas não encontradas */}
          <Route path="*" element={
            <div className="p-12 text-center animate-in fade-in">
              <div className="w-20 h-20 bg-blue-50 text-blue-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <LayoutDashboard size={40} />
              </div>
              <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">Módulo em Desenvolvimento</h2>
              <p className="text-sm text-slate-500 mt-2">Esta funcionalidade está sendo preparada para o seu ambiente multi-empresa.</p>
              <button onClick={() => window.history.back()} className="mt-8 text-blue-600 font-bold uppercase text-[10px] tracking-widest hover:underline">Voltar à Página Anterior</button>
            </div>
          } />
        </Route>

        {/* Fallback Global */}
        <Route path="/" element={<Navigate to={AppRoute.DASHBOARD} replace />} />
      </Routes>
    </HashRouter>
  );
};

// Importação necessária para o fallback
import { LayoutDashboard } from 'lucide-react';

export default App;