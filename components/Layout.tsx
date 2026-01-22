
import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Package, 
  Users, 
  ShoppingCart, 
  Calculator, 
  Settings, 
  LogOut, 
  Building2,
  Calendar,
  Truck,
  Menu,
  Bell
} from 'lucide-react';
import { AppRoute, User, Empresa } from '../types';

interface LayoutProps {
  user: User;
  empresa: Empresa;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ user, empresa, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: AppRoute.DASHBOARD, icon: LayoutDashboard, label: 'Dashboard' },
    { path: AppRoute.FATURACAO, icon: FileText, label: 'Faturação' },
    { path: AppRoute.CONTABILIDADE, icon: Calculator, label: 'Contabilidade' },
    { path: AppRoute.STOCK, icon: Package, label: 'Gestão de Stock' },
    { path: AppRoute.FORNECEDORES, icon: Truck, label: 'Fornecedores' },
    { path: AppRoute.POS, icon: ShoppingCart, label: 'Caixa / POS' },
    { path: AppRoute.RH, icon: Users, label: 'Recursos Humanos' },
    { path: AppRoute.ADMIN, icon: Calendar, label: 'Secretariado' },
    { path: AppRoute.CONFIG, icon: Settings, label: 'Configurações' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col hidden md:flex">
        <div className="p-6 flex items-center space-x-3 border-b border-blue-800">
          <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center font-bold text-lg">I</div>
          <div>
            <h1 className="text-sm font-bold tracking-tight">IMATEC SOFTWARE</h1>
            <p className="text-[10px] text-blue-300 font-medium uppercase tracking-widest">Multi-Company ERP</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                  isActive 
                    ? 'bg-blue-800 text-white' 
                    : 'text-blue-100 hover:bg-blue-800/50 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 bg-blue-950/50 border-t border-blue-800">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">
              {user.nome.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold truncate">{user.nome}</p>
              <p className="text-[10px] text-blue-300 truncate">{empresa.nome}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-blue-200 hover:text-white hover:bg-red-500/10 rounded-md transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair do Sistema</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center space-x-4">
            <button className="md:hidden text-gray-500">
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-semibold text-gray-800">
              {menuItems.find(i => i.path === location.pathname)?.label || 'Bem-vindo'}
            </h2>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
              <Building2 className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-xs font-medium text-gray-600">{empresa.nome} (NIF: {empresa.nif})</span>
            </div>
            <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
