
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
    // Check local storage for session
    const savedSession = localStorage.getItem('imatec_session');
    if (savedSession) {
      const data = JSON.parse(savedSession);
      setUser(data.user);
      setEmpresa(data.empresa);
    }
    setLoading(false);
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
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <HashRouter>
      <Routes>
        <Route 
          path={AppRoute.LOGIN} 
          element={!user ? <Login onLogin={handleLogin} /> : <Navigate to={AppRoute.DASHBOARD} />} 
        />
        <Route 
          path={AppRoute.REGISTER} 
          element={!user ? <Register /> : <Navigate to={AppRoute.DASHBOARD} />} 
        />
        
        {/* Protected Routes */}
        <Route element={user ? <Layout user={user} empresa={empresa!} onLogout={handleLogout} /> : <Navigate to={AppRoute.LOGIN} />}>
          <Route path={AppRoute.DASHBOARD} element={<Dashboard empresa={empresa!} />} />
          <Route path={AppRoute.FATURACAO} element={<Faturacao empresa={empresa!} />} />
          <Route path={AppRoute.STOCK} element={<Stock empresa={empresa!} />} />
          <Route path={AppRoute.RH} element={<RH empresa={empresa!} />} />
          <Route path={AppRoute.POS} element={<POS empresa={empresa!} />} />
          {/* Other modules would be mapped similarly */}
          <Route path="*" element={<div className="p-8 text-center text-gray-500">Funcionalidade em desenvolvimento...</div>} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
