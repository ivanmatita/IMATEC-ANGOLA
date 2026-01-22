
import { client, getEmpresaData } from './supabase.js';

let currentEmpresa = null;
let currentUser = null;

export function renderDashboardLayout(user, empresa) {
    currentUser = user;
    currentEmpresa = empresa;
    
    const app = document.getElementById('app');
    if (!app) return;
    
    // Injeção do esqueleto do Dashboard
    app.innerHTML = `
    <div class="flex h-screen bg-slate-50 overflow-hidden font-inter animate-in fade-in duration-500">
        <!-- Sidebar -->
        <aside class="w-64 bg-blue-900 text-white flex flex-col hidden md:flex shrink-0">
            <div class="p-6 border-b border-blue-800 flex items-center space-x-3">
                <div class="w-8 h-8 bg-blue-500 rounded flex items-center justify-center font-bold shadow-lg">I</div>
                <div class="font-bold tracking-tight">IMATEC SOFTWARE</div>
            </div>

            <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                <button onclick="window.navigate('home')" id="nav-home" class="nav-btn w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-800 transition-all">
                    <i data-lucide="layout-dashboard" class="w-4 h-4"></i> <span>Dashboard</span>
                </button>
                <button onclick="window.navigate('faturacao')" id="nav-faturacao" class="nav-btn w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-800 transition-all">
                    <i data-lucide="file-text" class="w-4 h-4"></i> <span>Faturação</span>
                </button>
                <button onclick="window.navigate('rh')" id="nav-rh" class="nav-btn w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-800 transition-all">
                    <i data-lucide="users" class="w-4 h-4"></i> <span>Recursos Humanos</span>
                </button>
                <button onclick="window.navigate('stock')" id="nav-stock" class="nav-btn w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-800 transition-all">
                    <i data-lucide="package" class="w-4 h-4"></i> <span>Stock</span>
                </button>
            </nav>

            <div class="p-4 bg-blue-950/50 border-t border-blue-800">
                <div class="flex items-center space-x-3 mb-4">
                    <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold shadow-inner">${user.nome.charAt(0)}</div>
                    <div class="overflow-hidden">
                        <p class="text-xs font-bold truncate">${user.nome}</p>
                        <p class="text-[9px] text-blue-300 truncate font-bold uppercase tracking-tighter">${empresa.nome}</p>
                    </div>
                </div>
                <button onclick="window.logout()" class="w-full flex items-center space-x-2 px-3 py-2 text-xs text-red-300 hover:bg-red-500/10 rounded-md transition-all">
                    <i data-lucide="log-out" class="w-4 h-4"></i> <span>Sair do Sistema</span>
                </button>
            </div>
        </aside>

        <!-- Main Area -->
        <div class="flex-1 flex flex-col overflow-hidden">
            <header class="h-16 bg-white border-b flex items-center justify-between px-6 shrink-0 shadow-sm z-10">
                <h2 id="pageTitle" class="text-sm font-bold text-gray-800 uppercase tracking-widest">Painel de Controlo</h2>
                <div class="flex items-center space-x-4">
                    <div class="bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
                        <span class="text-[10px] font-black text-gray-500 uppercase">Empresa: ${empresa.nome}</span>
                    </div>
                </div>
            </header>
            <main id="mainContent" class="flex-1 overflow-y-auto p-8 bg-slate-50">
                <!-- Conteúdo renderizado aqui -->
            </main>
        </div>
    </div>
    `;

    // Função global de navegação SPA
    window.navigate = (page) => {
        const content = document.getElementById('mainContent');
        const title = document.getElementById('pageTitle');
        if (!content || !title) return;

        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('bg-blue-800'));
        document.getElementById(`nav-${page}`)?.classList.add('bg-blue-800');

        switch(page) {
            case 'home':
                title.innerText = "Dashboard";
                renderHome(content);
                break;
            case 'faturacao':
                title.innerText = "Faturação e Documentos";
                renderFaturacao(content);
                break;
            case 'rh':
                title.innerText = "Recursos Humanos";
                renderRH(content);
                break;
            default:
                content.innerHTML = `<div class="p-20 text-center text-gray-300 font-bold uppercase text-xs tracking-widest">Módulo em Desenvolvimento</div>`;
        }
        
        if (window.lucide) window.lucide.createIcons();
    };

    window.logout = () => {
        localStorage.removeItem('imatec_session');
        window.location.reload();
    };

    // Navega para a home por padrão
    window.navigate('home');
}

function renderHome(container) {
    container.innerHTML = `
    <div class="space-y-6 animate-in fade-in duration-500">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Vendas Totais</h3>
                <p class="text-2xl font-black text-slate-800">12.840.500 Kz</p>
            </div>
            <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Funcionários</h3>
                <p class="text-2xl font-black text-slate-800">2</p>
            </div>
            <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Fisco (AGT)</h3>
                <p class="text-2xl font-black text-emerald-500 uppercase">Regular</p>
            </div>
        </div>
        
        <div class="bg-blue-900 rounded-3xl p-8 text-white flex items-center justify-between shadow-2xl overflow-hidden relative">
            <div class="relative z-10">
                <h2 class="text-xl font-bold uppercase tracking-tight font-lato">Bem-vindo à ${currentEmpresa.nome}</h2>
                <p class="text-blue-200 text-sm mt-1">Gira o seu negócio com a inteligência do IMATEC SOFTWARE.</p>
            </div>
            <button onclick="window.navigate('faturacao')" class="relative z-10 bg-blue-500 hover:bg-blue-400 px-8 py-3 rounded-2xl font-bold text-xs uppercase shadow-xl transition-all">Emitir Fatura</button>
            <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-800 rounded-full opacity-20"></div>
        </div>
    </div>
    `;
}

function renderFaturacao(container) {
    container.innerHTML = `
    <div class="space-y-6 animate-in fade-in duration-500">
        <div class="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <h3 class="font-bold text-gray-800 uppercase text-xs tracking-wider">Documentos de Venda</h3>
            <button class="bg-blue-600 text-white px-6 py-2 rounded-xl text-[10px] font-bold uppercase shadow-lg hover:bg-blue-500 transition-all">Nova Fatura</button>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <table class="w-full text-left text-xs">
                <thead class="bg-gray-50 font-bold text-gray-400 uppercase border-b">
                    <tr>
                        <th class="px-6 py-4">Nº Doc</th>
                        <th class="px-6 py-4">Cliente</th>
                        <th class="px-6 py-4 text-right">Total</th>
                        <th class="px-6 py-4">Estado</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                    <tr>
                        <td class="px-6 py-4 font-bold text-blue-600">FR 2024/001</td>
                        <td class="px-6 py-4">Consumidor Final</td>
                        <td class="px-6 py-4 text-right font-black">12.500,00 Kz</td>
                        <td class="px-6 py-4"><span class="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[9px] font-black uppercase">Pago</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    `;
}

function renderRH(container) {
    container.innerHTML = `
    <div class="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
        <div class="flex items-center justify-between">
            <h3 class="font-bold text-gray-800 uppercase tracking-wider text-xs">Recursos Humanos - ${currentEmpresa.nome}</h3>
            <button class="bg-blue-600 text-white px-4 py-2 rounded-lg text-[10px] font-bold uppercase shadow-lg">Admitir Novo</button>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <table class="w-full text-left text-xs">
                <thead class="bg-gray-50 font-bold text-gray-400 uppercase border-b">
                    <tr>
                        <th class="px-6 py-4">Colaborador</th>
                        <th class="px-6 py-4">Cargo</th>
                        <th class="px-6 py-4 text-right">Salário</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                    <tr class="hover:bg-slate-50 transition-colors">
                        <td class="px-6 py-4 font-bold text-slate-800">INACIOO</td>
                        <td class="px-6 py-4 text-slate-500">Secretariado</td>
                        <td class="px-6 py-4 text-right font-black text-blue-700">100.000 Kz</td>
                    </tr>
                    <tr class="hover:bg-slate-50 transition-colors">
                        <td class="px-6 py-4 font-bold text-slate-800">João Manuel Baptista</td>
                        <td class="px-6 py-4 text-slate-500">Gestor de TI</td>
                        <td class="px-6 py-4 text-right font-black text-blue-700">450.000 Kz</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    `;
}
