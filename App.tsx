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
        // Chama a função global definida no index.html para remover o loader estático
        if ((window as any).removeInitialLoader) {
          (window as any).removeInitialLoader();
        }
      }
    };

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

  if (loading) {
    return null; // O loader do index.html lida com esta fase
  }

  return (
    <HashRouter>
      <Routes>
        <Route 
          path={AppRoute.LOGIN} 
          element={!user ? <Login onLogin={handleLogin} /> : <Navigate to={AppRoute.DASHBOARD} replace />} 
        />
        <Route 
          path={AppRoute.REGISTER} 
          element={!user ? <Register /> : <Navigate to={AppRoute.DASHBOARD} replace />} 
        />
        
        <Route element={user ? <Layout user={user} empresa={empresa!} onLogout={handleLogout} /> : <Navigate to={AppRoute.LOGIN} replace />}>
          <Route path={AppRoute.DASHBOARD} element={<Dashboard empresa={empresa!} />} />
          <Route path={AppRoute.FATURACAO} element={<Faturacao empresa={empresa!} />} />
          <Route path={AppRoute.STOCK} element={<Stock empresa={empresa!} />} />
          <Route path={AppRoute.RH} element={<RH empresa={empresa!} />} />
          <Route path={AppRoute.POS} element={<POS empresa={empresa!} />} />
          
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

        <Route path="/" element={<Navigate to={AppRoute.DASHBOARD} replace />} />
      </Routes>
    </HashRouter>
  );
};

import { LayoutDashboard } from 'lucide-react';

export default App;