
let currentEmpresa = null;
let currentUser = null;

/**
 * Renderiza o Layout Principal
 */
export function renderDashboardLayout(user, empresa) {
    currentUser = user;
    currentEmpresa = empresa;
    
    const app = document.getElementById('app');
    if (!app) return;
    
    app.innerHTML = `
    <div class="flex h-screen bg-slate-50 overflow-hidden font-inter animate-in fade-in duration-500">
        <!-- Sidebar -->
        <aside class="w-64 bg-blue-900 text-white flex flex-col shrink-0">
            <div class="p-8 border-b border-blue-800 flex items-center space-x-3">
                <div class="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center font-bold shadow-lg text-sm">I</div>
                <div class="font-bold tracking-tight text-xs uppercase">IMATEC ERP</div>
            </div>

            <nav class="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                <button onclick="window.navigate('home')" id="nav-home" class="nav-btn w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-800 transition-all">
                    <i data-lucide="layout-dashboard" class="w-4 h-4"></i> <span>Dashboard</span>
                </button>
                <button onclick="window.navigate('rh')" id="nav-rh" class="nav-btn w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-800 transition-all">
                    <i data-lucide="users" class="w-4 h-4"></i> <span>Recursos Humanos</span>
                </button>
                <button onclick="window.navigate('faturacao')" id="nav-faturacao" class="nav-btn w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-800 transition-all">
                    <i data-lucide="file-text" class="w-4 h-4"></i> <span>Faturação</span>
                </button>
            </nav>

            <div class="p-6 bg-blue-950/50 border-t border-blue-800">
                <div class="flex items-center space-x-3 mb-4">
                    <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold">${user.nome.charAt(0)}</div>
                    <div class="overflow-hidden">
                        <p class="text-[10px] font-bold truncate">${user.nome}</p>
                        <p class="text-[9px] text-blue-400 truncate uppercase font-bold tracking-tighter">${empresa.nome}</p>
                    </div>
                </div>
                <button onclick="window.logout()" class="w-full flex items-center space-x-2 px-3 py-2 text-[9px] font-bold uppercase tracking-widest text-red-300 hover:bg-red-500/10 rounded-xl border border-red-500/20 transition-all">
                    <i data-lucide="log-out" class="w-3 h-3"></i> <span>Sair</span>
                </button>
            </div>
        </aside>

        <!-- Main Area -->
        <div class="flex-1 flex flex-col overflow-hidden">
            <header class="h-20 bg-white border-b flex items-center justify-between px-10 shrink-0 shadow-sm z-10">
                <h2 id="pageTitle" class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Resumo da Empresa</h2>
                <div class="flex items-center space-x-4">
                    <div class="bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
                        <span class="text-[9px] font-black text-blue-600 uppercase tracking-widest">${empresa.nome}</span>
                    </div>
                </div>
            </header>
            <main id="mainContent" class="flex-1 overflow-y-auto p-10 bg-slate-50">
                <!-- Conteúdo renderizado aqui -->
            </main>
        </div>
    </div>
    `;

    window.navigate = (page) => {
        const content = document.getElementById('mainContent');
        const title = document.getElementById('pageTitle');
        if (!content || !title) return;

        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('bg-blue-800', 'text-white'));
        document.getElementById(`nav-${page}`)?.classList.add('bg-blue-800', 'text-white');

        switch(page) {
            case 'home':
                title.innerText = "Dashboard Geral";
                renderHome(content);
                break;
            case 'rh':
                title.innerText = "Gestão de Recursos Humanos";
                renderRH(content);
                break;
            case 'faturacao':
                title.innerText = "Faturação Isolada";
                renderFaturacao(content);
                break;
            default:
                content.innerHTML = `<p class="text-gray-400 font-bold uppercase text-[10px] tracking-widest text-center mt-20">Módulo em desenvolvimento</p>`;
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
    <div class="space-y-8 animate-in fade-in duration-500">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Volume de Vendas</h3>
                <p class="text-3xl font-black text-slate-800">4.250.000 <span class="text-xs text-gray-400">Kz</span></p>
                <div class="mt-4 flex items-center text-emerald-500 text-[9px] font-bold uppercase tracking-widest">
                    <i data-lucide="trending-up" class="w-3 h-3 mr-1"></i> Empresa: ${currentEmpresa.nome}
                </div>
            </div>
            <div class="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Total Funcionários</h3>
                <p class="text-3xl font-black text-slate-800">2 <span class="text-xs text-gray-400">Ativos</span></p>
                <div class="mt-4 flex items-center text-blue-500 text-[9px] font-bold uppercase tracking-widest">
                    <i data-lucide="users" class="w-3 h-3 mr-1"></i> Isolamento OK
                </div>
            </div>
            <div class="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">NIF Verificado</h3>
                <p class="text-xl font-bold text-emerald-500 uppercase tracking-tighter">${currentEmpresa.nif}</p>
                <div class="mt-4 flex items-center text-gray-400 text-[9px] font-bold uppercase tracking-widest">
                    Registo AGT em Dia
                </div>
            </div>
        </div>

        <div class="bg-blue-900 rounded-[2rem] p-10 text-white shadow-2xl relative overflow-hidden">
            <div class="relative z-10">
                <h2 class="text-2xl font-bold font-lato uppercase tracking-tight">Painel de Controlo Multiempresa</h2>
                <p class="text-blue-200 text-sm mt-2 font-medium">Os dados exibidos pertencem exclusivamente à <b>${currentEmpresa.nome}</b>.</p>
                <div class="mt-8 flex space-x-4">
                    <button onclick="window.navigate('faturacao')" class="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-xl transition-all">Ver Faturas</button>
                    <button onclick="window.navigate('rh')" class="bg-white/10 hover:bg-white/20 px-8 py-3 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all">Gerir RH</button>
                </div>
            </div>
            <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-800 rounded-full opacity-20"></div>
        </div>
    </div>
    `;
}

function renderRH(container) {
    // Aqui simulamos a filtragem por empresa_id
    container.innerHTML = `
    <div class="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
        <div class="flex items-center justify-between">
            <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Quadro de Pessoal: ${currentEmpresa.nome}</h3>
            <button class="bg-blue-600 text-white px-6 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest shadow-lg">Admitir Novo</button>
        </div>
        <div class="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
            <table class="w-full text-left text-[11px]">
                <thead class="bg-gray-50 font-black text-gray-400 uppercase border-b">
                    <tr>
                        <th class="px-8 py-5">Colaborador</th>
                        <th class="px-8 py-5">Função</th>
                        <th class="px-8 py-5 text-right">Salário (Base)</th>
                        <th class="px-8 py-5 text-center">Isolamento</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                    <tr class="hover:bg-slate-50 transition-all">
                        <td class="px-8 py-5 font-bold text-slate-800">INACIOO</td>
                        <td class="px-8 py-5 text-gray-500">Secretariado Executivo</td>
                        <td class="px-8 py-5 text-right font-black text-blue-700">100.000,00 Kz</td>
                        <td class="px-8 py-5 text-center">
                            <span class="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[8px] font-black uppercase">Empresa OK</span>
                        </td>
                    </tr>
                    <tr class="hover:bg-slate-50 transition-all">
                        <td class="px-8 py-5 font-bold text-slate-800">João Manuel Baptista</td>
                        <td class="px-8 py-5 text-gray-500">Gestor de TI</td>
                        <td class="px-8 py-5 text-right font-black text-blue-700">450.000,00 Kz</td>
                        <td class="px-8 py-5 text-center">
                            <span class="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[8px] font-black uppercase">Empresa OK</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    `;
}

function renderFaturacao(container) {
    container.innerHTML = `
    <div class="space-y-6 animate-in fade-in duration-500">
        <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
                <h3 class="font-bold text-slate-800 text-sm uppercase tracking-wider">Histórico de Faturas</h3>
                <p class="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Visualizando apenas dados da empresa logada</p>
            </div>
            <button class="bg-blue-600 text-white px-8 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl">Nova Fatura</button>
        </div>
        <div class="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
            <table class="w-full text-left text-[11px]">
                <thead class="bg-gray-50 font-black text-gray-400 uppercase tracking-widest border-b">
                    <tr>
                        <th class="px-8 py-5">Série/Nº</th>
                        <th class="px-8 py-5">Cliente</th>
                        <th class="px-8 py-5 text-right">Total Bruto</th>
                        <th class="px-8 py-5">Estado</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                    <tr class="hover:bg-slate-50 transition-all">
                        <td class="px-8 py-5 font-bold text-blue-600">FR 2024/001</td>
                        <td class="px-8 py-5 font-bold text-slate-800">Consumidor Final (Empresa Teste)</td>
                        <td class="px-8 py-5 text-right font-black text-slate-800">12.500,00 Kz</td>
                        <td class="px-8 py-5">
                            <span class="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Liquidado</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    `;
}
