
/**
 * IMATEC SOFTWARE - DEFINITIVE MULTI-COMPANY SPA ENGINE
 * Otimizado para GitHub Pages e Isolamento de Dados
 */

// 1. BANCO DE DADOS SIMULADO (MULTI-EMPRESA)
const IMATEC_DB = {
    empresas: [
        { id: 'emp-imatec', nome: 'IMATEC SOFTWARE, LDA', nif: '5409876543', saldo: '12.450.000', vendas: '4.250.000' },
        { id: 'emp-cliente', nome: 'CLIENTE ANGOLA, SA', nif: '5401122334', saldo: '2.100.000', vendas: '980.000' }
    ],
    funcionarios: [
        { id: 'f1', empresa_id: 'emp-imatec', nome: 'INACIOO', cargo: 'Secretaria', salario: 100000 },
        { id: 'f2', empresa_id: 'emp-imatec', nome: 'João Manuel Baptista', cargo: 'Gestor de TI', salario: 450000 },
        { id: 'f3', empresa_id: 'emp-cliente', nome: 'Carlos Alberto', cargo: 'Contabilista', salario: 350000 },
        { id: 'f4', empresa_id: 'emp-cliente', nome: 'Maria dos Anjos', cargo: 'Vendedora', salario: 120000 }
    ],
    faturas: [
        { id: 'v1', empresa_id: 'emp-imatec', numero: 'FR 2024/001', cliente: 'AGT Angola', total: 125000, estado: 'Pago' },
        { id: 'v2', empresa_id: 'emp-imatec', numero: 'FR 2024/002', cliente: 'Banco BAI', total: 850000, estado: 'Pendente' },
        { id: 'v3', empresa_id: 'emp-cliente', numero: 'FR 2024/001', cliente: 'Consumidor Final', total: 5000, estado: 'Pago' }
    ]
};

// 2. MOTOR DE RENDERIZAÇÃO
const renderApp = (html: string) => {
    const container = document.getElementById('app');
    if (container) {
        container.innerHTML = html;
        // Reinicializa os ícones do Lucide após cada troca de página
        if ((window as any).lucide) (window as any).lucide.createIcons();
    }
};

// 3. MÓDULO DE AUTENTICAÇÃO
const showLoginPage = () => {
    renderApp(`
    <div class="min-h-screen flex items-center justify-center p-4 bg-slate-100 animate-in fade-in duration-500">
        <div class="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
            <div class="bg-blue-900 p-12 text-center relative">
                <div class="relative z-10">
                    <div class="w-16 h-16 bg-blue-500 rounded-2xl mx-auto flex items-center justify-center text-white font-bold text-3xl mb-4 shadow-xl">I</div>
                    <h1 class="text-2xl font-bold text-white font-lato uppercase tracking-tight">IMATEC SOFTWARE</h1>
                    <p class="text-blue-300 text-[10px] mt-2 font-black uppercase tracking-[0.2em]">Multi-Company Cloud ERP</p>
                </div>
                <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-800 rounded-full opacity-20"></div>
            </div>

            <form id="loginForm" class="p-10 space-y-6">
                <div class="space-y-1.5">
                    <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Utilizador Administrativo</label>
                    <input type="email" id="email" required class="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" placeholder="admin@imatec.co.ao">
                </div>

                <div class="space-y-1.5">
                    <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Palavra-passe</label>
                    <input type="password" id="password" required class="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" placeholder="••••••••">
                </div>

                <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center space-x-2">
                    <span class="uppercase text-xs tracking-widest">Iniciar Sessão ERP</span>
                </button>

                <div class="text-center pt-4">
                    <p class="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                        Ambiente Seguro &middot; Angola 2024
                    </p>
                </div>
            </form>
        </div>
    </div>
    `);

    document.getElementById('loginForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = (document.getElementById('email') as HTMLInputElement).value;
        
        // Lógica Multi-empresa baseada no email (Simulação)
        const isImatec = email.includes('imatec');
        const empresa = isImatec ? IMATEC_DB.empresas[0] : IMATEC_DB.empresas[1];
        const user = { nome: isImatec ? 'Eng. Inácio' : 'Gestor Externo', email };

        localStorage.setItem('imatec_session', JSON.stringify({ user, empresa }));
        initApp(); // Reinicia o motor para carregar o Dashboard
    });
};

// 4. MÓDULO DASHBOARD
const showDashboard = (user: any, empresa: any) => {
    renderApp(`
    <div class="flex h-screen bg-slate-50 overflow-hidden font-inter">
        <!-- Sidebar -->
        <aside class="w-72 bg-blue-900 text-white flex flex-col shrink-0 shadow-2xl z-20">
            <div class="p-8 border-b border-blue-800 flex items-center space-x-4">
                <div class="w-10 h-10 bg-blue-500 rounded-2xl flex items-center justify-center font-bold shadow-xl border border-blue-400 text-sm">I</div>
                <div>
                    <div class="font-black tracking-tight text-xs uppercase">IMATEC ERP</div>
                    <div class="text-[9px] text-blue-300 font-bold uppercase tracking-widest">Cloud V2.5</div>
                </div>
            </div>

            <nav class="flex-1 overflow-y-auto py-8 px-4 space-y-1.5">
                <button onclick="window.navigate('home')" id="nav-home" class="nav-btn w-full flex items-center space-x-3 px-5 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-800 transition-all group">
                    <i data-lucide="layout-dashboard" class="w-4 h-4 text-blue-400 group-hover:text-white"></i> <span>Painel Principal</span>
                </button>
                <button onclick="window.navigate('rh')" id="nav-rh" class="nav-btn w-full flex items-center space-x-3 px-5 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-800 transition-all group">
                    <i data-lucide="users" class="w-4 h-4 text-blue-400 group-hover:text-white"></i> <span>Recursos Humanos</span>
                </button>
                <button onclick="window.navigate('faturacao')" id="nav-faturacao" class="nav-btn w-full flex items-center space-x-3 px-5 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-800 transition-all group">
                    <i data-lucide="file-text" class="w-4 h-4 text-blue-400 group-hover:text-white"></i> <span>Faturação</span>
                </button>
            </nav>

            <div class="p-6 bg-blue-950/40 border-t border-blue-800/50">
                <div class="flex items-center space-x-3 mb-6 p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div class="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-xs font-bold border border-blue-400 shadow-inner">${user.nome.charAt(0)}</div>
                    <div class="overflow-hidden">
                        <p class="text-[10px] font-bold truncate uppercase tracking-wider">${user.nome}</p>
                        <p class="text-[8px] text-blue-400 truncate uppercase font-black tracking-widest mt-0.5">${empresa.nome}</p>
                    </div>
                </div>
                <button onclick="window.logout()" class="w-full flex items-center justify-center space-x-2 px-4 py-4 text-[9px] font-bold uppercase tracking-[0.2em] text-red-300 hover:bg-red-500/10 rounded-2xl border border-red-500/20 transition-all">
                    <i data-lucide="log-out" class="w-3 h-3"></i> <span>Sair do Sistema</span>
                </button>
            </div>
        </aside>

        <!-- Main Area -->
        <div class="flex-1 flex flex-col overflow-hidden">
            <header class="h-24 bg-white border-b border-gray-100 flex items-center justify-between px-12 shrink-0 z-10 shadow-sm">
                <div class="flex flex-col">
                    <h2 id="pageTitle" class="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Carregando...</h2>
                    <p class="text-[9px] text-blue-600 font-bold uppercase mt-1 tracking-widest">Controlo Isolado: ${empresa.nome}</p>
                </div>
                <div class="bg-blue-50 px-5 py-2.5 rounded-2xl border border-blue-100 flex items-center space-x-3">
                    <div class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                    <span class="text-[9px] font-black text-blue-700 uppercase tracking-widest">NIF: ${empresa.nif}</span>
                </div>
            </header>

            <main id="mainContent" class="flex-1 overflow-y-auto p-12 bg-slate-50/50">
                <!-- Conteúdo Injetado via Navegação -->
            </main>
        </div>
    </div>
    `);

    // FUNÇÃO DE NAVEGAÇÃO SPA
    (window as any).navigate = (page: string) => {
        const content = document.getElementById('mainContent');
        const title = document.getElementById('pageTitle');
        if (!content || !title) return;

        // Atualiza estilo dos botões
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('bg-blue-800', 'text-white', 'shadow-xl'));
        const activeBtn = document.getElementById(`nav-${page}`);
        if (activeBtn) activeBtn.classList.add('bg-blue-800', 'text-white', 'shadow-xl');

        // ISOLAMENTO DE DADOS (O filtro por empresa_id acontece aqui)
        const empresaId = empresa.id;

        switch(page) {
            case 'home':
                title.innerText = "Dashboard Analítico";
                content.innerHTML = `
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in slide-in-from-bottom-4 duration-500">
                    <div class="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
                        <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Volume de Negócios</h3>
                        <p class="text-4xl font-black text-slate-800">${empresa.vendas} <span class="text-xs font-medium text-slate-400">Kz</span></p>
                    </div>
                    <div class="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
                        <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Colaboradores</h3>
                        <p class="text-4xl font-black text-slate-800">${IMATEC_DB.funcionarios.filter(f => f.empresa_id === empresaId).length}</p>
                    </div>
                    <div class="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
                        <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Saldo Disponível</h3>
                        <p class="text-4xl font-black text-blue-600">${empresa.saldo} <span class="text-xs">Kz</span></p>
                    </div>
                </div>
                <div class="mt-12 bg-blue-900 rounded-[3rem] p-16 text-white shadow-2xl relative overflow-hidden">
                    <div class="relative z-10">
                        <h2 class="text-4xl font-black uppercase font-lato">Bem-vindo à Gestão Multi-Empresa</h2>
                        <p class="text-blue-200 text-sm mt-6 max-w-2xl leading-relaxed">Você está a operar no ambiente isolado da <b>${empresa.nome}</b>. Todas as operações, faturas e processamentos de RH estão vinculados exclusivamente ao NIF <b>${empresa.nif}</b>.</p>
                        <button onclick="window.navigate('faturacao')" class="mt-10 bg-blue-600 hover:bg-blue-500 px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-blue-500/30">Emitir Nova Fatura</button>
                    </div>
                    <div class="absolute -right-24 -bottom-24 w-80 h-80 bg-blue-800 rounded-full opacity-40 blur-3xl"></div>
                </div>
                `;
                break;

            case 'rh':
                title.innerText = "Recursos Humanos";
                const rhData = IMATEC_DB.funcionarios.filter(f => f.empresa_id === empresaId);
                content.innerHTML = `
                <div class="space-y-8 animate-in fade-in duration-500">
                    <div class="flex items-center justify-between bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                        <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Quadro de Pessoal (${rhData.length})</h3>
                        <button class="bg-blue-600 text-white px-8 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest">Admitir Novo</button>
                    </div>
                    <div class="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
                        <table class="w-full text-left text-[11px]">
                            <thead class="bg-slate-50 font-black text-slate-400 uppercase border-b">
                                <tr>
                                    <th class="px-10 py-7">Colaborador</th>
                                    <th class="px-10 py-7">Cargo</th>
                                    <th class="px-10 py-7 text-right">Vencimento</th>
                                    <th class="px-10 py-7 text-center">Isolamento</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-50">
                                ${rhData.map(f => `
                                    <tr class="hover:bg-slate-50 transition-all">
                                        <td class="px-10 py-6 font-black text-slate-800 uppercase">${f.nome}</td>
                                        <td class="px-10 py-6 text-slate-500 font-bold">${f.cargo}</td>
                                        <td class="px-10 py-6 text-right font-black text-blue-700">${f.salario.toLocaleString()},00 Kz</td>
                                        <td class="px-10 py-6 text-center"><span class="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[8px] font-black">EMPRESA OK</span></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
                `;
                break;

            case 'faturacao':
                title.innerText = "Histórico de Faturação";
                const fatData = IMATEC_DB.faturas.filter(f => f.empresa_id === empresaId);
                content.innerHTML = `
                <div class="space-y-8 animate-in fade-in duration-500">
                    <div class="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center justify-between">
                        <div>
                            <h3 class="font-black text-slate-800 text-sm uppercase tracking-wider">Documentos Fiscais</h3>
                            <p class="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">Ambiente certificado pela AGT</p>
                        </div>
                        <button class="bg-emerald-600 text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 transition-all">Nova Venda</button>
                    </div>
                    <div class="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
                        <table class="w-full text-left text-[11px]">
                            <thead class="bg-slate-50 font-black text-slate-400 uppercase border-b">
                                <tr><th class="px-10 py-7">Nº / Série</th><th class="px-10 py-7">Cliente</th><th class="px-10 py-7 text-right">Total</th><th class="px-10 py-7">Estado</th></tr>
                            </thead>
                            <tbody class="divide-y divide-gray-50">
                                ${fatData.map(v => `
                                    <tr class="hover:bg-slate-50 transition-all">
                                        <td class="px-10 py-6 font-black text-blue-600 uppercase">${v.numero}</td>
                                        <td class="px-10 py-6 font-bold text-slate-800">${v.cliente}</td>
                                        <td class="px-10 py-6 text-right font-black">${v.total.toLocaleString()},00 Kz</td>
                                        <td class="px-10 py-6"><span class="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-[9px] font-black uppercase">${v.estado}</span></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
                `;
                break;
        }

        if ((window as any).lucide) (window as any).lucide.createIcons();
    };

    (window as any).logout = () => {
        localStorage.removeItem('imatec_session');
        initApp();
    };

    // Navega para a home inicialmente
    (window as any).navigate('home');
};

// 5. INICIALIZAÇÃO DO APP
const initApp = () => {
    console.log("[IMATEC] Verificando sessão...");
    const session = localStorage.getItem('imatec_session');
    
    if (session) {
        try {
            const { user, empresa } = JSON.parse(session);
            showDashboard(user, empresa);
        } catch (e) {
            localStorage.removeItem('imatec_session');
            showLoginPage();
        }
    } else {
        showLoginPage();
    }
};

// Dispara a inicialização assim que o script carregar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
