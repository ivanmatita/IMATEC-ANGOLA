
let currentEmpresa = null;
let currentUser = null;

/**
 * Renderiza o Layout Principal do Dashboard
 */
export function renderDashboardLayout(user, empresa) {
    currentUser = user;
    currentEmpresa = empresa;
    
    const app = document.getElementById('app');
    if (!app) return;
    
    app.innerHTML = `
    <div class="flex h-screen bg-slate-50 overflow-hidden font-inter animate-in fade-in duration-500">
        <!-- Sidebar -->
        <aside class="w-64 bg-blue-900 text-white flex flex-col hidden md:flex shrink-0">
            <div class="p-8 border-b border-blue-800 flex items-center space-x-3">
                <div class="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center font-bold shadow-lg">I</div>
                <div class="font-bold tracking-tight text-sm uppercase">IMATEC ERP</div>
            </div>

            <nav class="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                <button onclick="window.navigate('home')" id="nav-home" class="nav-btn w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-blue-800 transition-all">
                    <i data-lucide="layout-dashboard" class="w-4 h-4"></i> <span>Dashboard</span>
                </button>
                <button onclick="window.navigate('faturacao')" id="nav-faturacao" class="nav-btn w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-blue-800 transition-all">
                    <i data-lucide="file-text" class="w-4 h-4"></i> <span>Faturação</span>
                </button>
                <button onclick="window.navigate('rh')" id="nav-rh" class="nav-btn w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-blue-800 transition-all">
                    <i data-lucide="users" class="w-4 h-4"></i> <span>RH / Pessoal</span>
                </button>
                <button onclick="window.navigate('stock')" id="nav-stock" class="nav-btn w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-blue-800 transition-all">
                    <i data-lucide="package" class="w-4 h-4"></i> <span>Stock</span>
                </button>
            </nav>

            <div class="p-6 bg-blue-950/50 border-t border-blue-800">
                <div class="flex items-center space-x-3 mb-6">
                    <div class="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold border-2 border-blue-400 shadow-inner">${user.nome.charAt(0)}</div>
                    <div class="overflow-hidden">
                        <p class="text-xs font-bold truncate">${user.nome}</p>
                        <p class="text-[9px] text-blue-400 truncate font-bold uppercase tracking-widest">${empresa.nome}</p>
                    </div>
                </div>
                <button onclick="window.logout()" class="w-full flex items-center justify-center space-x-2 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-red-300 hover:bg-red-500/10 border border-red-500/20 rounded-xl transition-all">
                    <i data-lucide="log-out" class="w-3 h-3"></i> <span>Sair</span>
                </button>
            </div>
        </aside>

        <!-- Main Content Area -->
        <div class="flex-1 flex flex-col overflow-hidden">
            <header class="h-20 bg-white border-b flex items-center justify-between px-10 shrink-0 shadow-sm z-10">
                <h2 id="pageTitle" class="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Painel de Gestão</h2>
                <div class="flex items-center space-x-4">
                    <div class="bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 hidden sm:block">
                        <span class="text-[10px] font-black text-blue-600 uppercase tracking-widest">NIF: ${empresa.nif}</span>
                    </div>
                </div>
            </header>
            <main id="mainContent" class="flex-1 overflow-y-auto p-10 bg-slate-50">
                <!-- Conteúdo renderizado aqui -->
            </main>
        </div>
    </div>
    `;

    // Global SPA Navigation
    window.navigate = (page) => {
        const content = document.getElementById('mainContent');
        const title = document.getElementById('pageTitle');
        if (!content || !title) return;

        // Estilo dos botões
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('bg-blue-800', 'text-white'));
        document.getElementById(`nav-${page}`)?.classList.add('bg-blue-800', 'text-white');

        switch(page) {
            case 'home':
                title.innerText = "Dashboard Geral";
                renderHome(content);
                break;
            case 'faturacao':
                title.innerText = "Módulo de Faturação";
                renderFaturacao(content);
                break;
            case 'rh':
                title.innerText = "Recursos Humanos";
                renderRH(content);
                break;
            default:
                content.innerHTML = `<div class="p-20 text-center"><p class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">Módulo em Manutenção</p></div>`;
        }
        
        if (window.lucide) window.lucide.createIcons();
    };

    window.logout = () => {
        localStorage.removeItem('imatec_session');
        window.location.reload();
    };

    window.navigate('home');
}

function renderHome(container) {
    container.innerHTML = `
    <div class="space-y-10 animate-in fade-in duration-500">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all">
                <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Vendas (Mês)</h3>
                <p class="text-3xl font-black text-slate-800">4.250.000 <span class="text-sm font-medium">Kz</span></p>
                <div class="mt-4 flex items-center text-emerald-500 text-[10px] font-bold uppercase">
                    <i data-lucide="trending-up" class="w-3 h-3 mr-1"></i> +12.5% vs mês anterior
                </div>
            </div>
            <div class="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all">
                <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Capital Humano</h3>
                <p class="text-3xl font-black text-slate-800">2 <span class="text-sm font-medium">Ativos</span></p>
                <div class="mt-4 flex items-center text-blue-500 text-[10px] font-bold uppercase">
                    <i data-lucide="users" class="w-3 h-3 mr-1"></i> 100% Efetividade
                </div>
            </div>
            <div class="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all">
                <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Status Fiscal</h3>
                <p class="text-3xl font-black text-emerald-500 uppercase tracking-tighter">REGULAR</p>
                <div class="mt-4 flex items-center text-gray-400 text-[10px] font-bold uppercase">
                    Conformidade AGT 2024
                </div>
            </div>
        </div>
        
        <div class="bg-blue-900 rounded-[2.5rem] p-12 text-white flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
            <div class="relative z-10">
                <h2 class="text-3xl font-bold uppercase tracking-tight font-lato">Bem-vindo, ${currentUser.nome}</h2>
                <p class="text-blue-200 text-sm mt-2 font-medium opacity-80">Gira o seu negócio na empresa <b>${currentEmpresa.nome}</b> com precisão absoluta.</p>
                <div class="mt-8 flex space-x-4">
                    <button onclick="window.navigate('faturacao')" class="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-xl transition-all">Emitir Documento</button>
                    <button onclick="window.navigate('rh')" class="bg-white/10 hover:bg-white/20 px-8 py-3 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all">Gestão de Equipa</button>
                </div>
            </div>
            <div class="mt-10 md:mt-0 relative z-10 hidden lg:block">
                <div class="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center animate-pulse">
                    <i data-lucide="activity" class="w-12 h-12 text-blue-400"></i>
                </div>
            </div>
            <div class="absolute -left-20 -bottom-20 w-64 h-64 bg-blue-800 rounded-full opacity-30"></div>
        </div>
    </div>
    `;
}

function renderFaturacao(container) {
    container.innerHTML = `
    <div class="space-y-8 animate-in fade-in duration-500">
        <div class="flex items-center justify-between bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div class="flex items-center space-x-4">
                <div class="p-3 bg-blue-50 text-blue-600 rounded-2xl"><i data-lucide="file-text" class="w-6 h-6"></i></div>
                <div>
                    <h3 class="font-bold text-slate-800 text-sm uppercase tracking-wider">Documentos de Venda</h3>
                    <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Listagem de faturas e recibos</p>
                </div>
            </div>
            <button class="bg-blue-600 text-white px-8 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl hover:bg-blue-500 transition-all flex items-center space-x-2">
                <i data-lucide="plus" class="w-3 h-3"></i> <span>Nova Fatura</span>
            </button>
        </div>

        <div class="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
            <table class="w-full text-left text-[11px]">
                <thead class="bg-gray-50 font-black text-gray-400 uppercase tracking-[0.2em] border-b">
                    <tr>
                        <th class="px-8 py-6">Nº Documento</th>
                        <th class="px-8 py-6">Cliente</th>
                        <th class="px-8 py-6">Data</th>
                        <th class="px-8 py-6 text-right">Total Bruto</th>
                        <th class="px-8 py-6">Estado</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                    <tr class="hover:bg-slate-50 transition-all cursor-pointer">
                        <td class="px-8 py-6 font-bold text-blue-600">FR 2024/001</td>
                        <td class="px-8 py-6 font-bold text-slate-800">Consumidor Final</td>
                        <td class="px-8 py-6 text-gray-400 font-medium">14 Out 2024</td>
                        <td class="px-8 py-6 text-right font-black text-slate-800">12.500,00 Kz</td>
                        <td class="px-8 py-6">
                            <span class="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Liquidado</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    `;
}

function renderRH(container) {
    container.innerHTML = `
    <div class="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
        <div class="flex items-center justify-between">
            <h3 class="font-bold text-slate-800 uppercase tracking-[0.2em] text-[10px]">Colaboradores Adminsitrados</h3>
            <button class="bg-blue-600 text-white px-6 py-2.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-lg hover:bg-blue-500">Admitir Novo</button>
        </div>
        <div class="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
            <table class="w-full text-left text-[11px]">
                <thead class="bg-gray-50 font-black text-gray-400 uppercase tracking-[0.2em] border-b">
                    <tr>
                        <th class="px-8 py-6">Colaborador</th>
                        <th class="px-8 py-6">Cargo / Função</th>
                        <th class="px-8 py-6 text-right">Salário Base</th>
                        <th class="px-8 py-6">Status</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                    <tr class="hover:bg-slate-50 transition-all">
                        <td class="px-8 py-6 font-bold text-slate-800 uppercase">INACIOO</td>
                        <td class="px-8 py-6 text-gray-500 font-medium">Secretariado Executivo</td>
                        <td class="px-8 py-6 text-right font-black text-blue-700">100.000,00 Kz</td>
                        <td class="px-8 py-6"><span class="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[9px] font-black uppercase">Ativo</span></td>
                    </tr>
                    <tr class="hover:bg-slate-50 transition-all">
                        <td class="px-8 py-6 font-bold text-slate-800 uppercase">João Manuel Baptista</td>
                        <td class="px-8 py-6 text-gray-500 font-medium">Gestor de TI</td>
                        <td class="px-8 py-6 text-right font-black text-blue-700">450.000,00 Kz</td>
                        <td class="px-8 py-6"><span class="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[9px] font-black uppercase">Ativo</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    `;
}
