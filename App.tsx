
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppRoute, User, Empresa } from './types.ts';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Faturacao from './pages/Faturacao.tsx';
import Stock from './pages/Stock.tsx';
import RH from './pages/RH.tsx';
import POS from './pages/POS.tsx';
import Layout from './components/Layout.tsx';
import { LayoutDashboard } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
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
        // Garante a remoção do loader estático do HTML após o React estar pronto
        setTimeout(() => {
          if ((window as any).removeInitialLoader) {
            (window as any).removeInitialLoader();
          }
        }, 100);
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
    window.location.reload();
  };

  if (loading) {
    return null; // O loader do HTML cuida disso
  }

  return (
    <HashRouter>
      <Routes>
        <Route 
          path