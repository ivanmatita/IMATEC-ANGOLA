
/**
 * IMATEC SOFTWARE - DEFINITIVE SPA ENGINE
 */

// ---------------------------------------------------------
// 1. SIMULAÇÃO DE BANCO DE DATA (MULTI-EMPRESA)
// ---------------------------------------------------------
const DB = {
    funcionarios: [
        { id: 'f1', empresa_id: 'emp-001', nome: 'INACIOO', cargo: 'Secretaria', salario: 100000 },
        { id: 'f2', empresa_id: 'emp-001', nome: 'João Manuel Baptista', cargo: 'TI', salario: 450000 },
        { id: 'f3', empresa_id: 'emp-002', nome: 'Carlos Silva', cargo: 'Vendedor', salario: 85000 },
    ],
    vendas: [
        { id: 'v1', empresa_id: 'emp-001', cliente: 'Cliente A', valor: 12500, data: '2024-10-14' },
        { id: 'v2', empresa_id: 'emp-002', cliente: 'Cliente B', valor: 50000, data: '2024-10-15' },
    ]
};

// ---------------------------------------------------------
// 2. UTILITÁRIOS DE RENDERIZAÇÃO
// ---------------------------------------------------------
const render = (html: string) => {
    const app = document.getElementById('app');
    if (app) {
        app.innerHTML = html;
        if ((window as any).lucide) (window as any).lucide.createIcons();
    }
};

// ---------------------------------------------------------
// 3. MÓDULO DE AUTENTICAÇÃO
// ---------------------------------------------------------
const showLogin = () => {
    render(`
    <div class="min-h-screen flex items-center justify-center p-4 bg-slate-100 animate-in fade-in duration-500">
        <div class="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
            <div class="bg-blue-900 p-12 text-center relative">
                <div class="w-16 h-16 bg-blue-500 rounded-2xl mx-auto flex items-center justify-center text-white font-bold text-3xl mb-4 shadow-xl">I</div>
                <h1 class="text-2xl font-bold text-white font-lato uppercase tracking-tight">IMATEC SOFTWARE</h1>
                <p class="text-blue-300 text-[10px] mt-2 font-black uppercase tracking-widest">Multi-Company Cloud ERP</p>
            </div>
            <form id="loginForm" class="p-10 space-y-6">
                <div class="space-y-1.5">
                    <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Administrativo</label>
                    <input type="email" id="email" required class="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="admin@imatec.co.ao">
                </div>
                <div class="space-y-1.5">
                    <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Palavra-passe</label>
                    <input type="password" id="password" required class="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="••••••••">
                </div>
                <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-xl transition-all uppercase text-xs tracking-widest">Entrar no Sistema</button>
            </form>
        </div>
    </div>
    `);

    document.getElementById('loginForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = (document.getElementById('email') as HTMLInputElement).value;
        
        // Simulação de roteamento multiempresa
        const mockEmpresa = {
            id: email.includes('imatec') ? 'emp-001' : 'emp-002',
            nome: email.includes('imatec') ? 'IMATEC SOFTWARE' : 'CLIENTE EXTERNO, LDA',
            nif: '5409876543'
        };
        const mockUser = { nome: 'Gestor ERP', email };

        localStorage.setItem('imatec_session', JSON.stringify({ user: mockUser, empresa: mockEmpresa }));
        init(); // Reinicia para carregar o dashboard
    });
};

// ---------------------------------------------------------
// 4. MÓDULO DASHBOARD (SPA)
// ---------------------------------------------------------
const showDashboard = (user: any, empresa: any) => {
    render(`
    <div class="flex h-screen bg-slate-50 overflow-hidden">
        <!-- Sidebar -->
        <aside class="w-64 bg-blue-900 text-white flex flex-col shrink-0 shadow-2xl">
            <div class="p-8 border-b border-blue-800 flex items-center space-x-3">
                <div class="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center font-bold">I</div>
                <div class="font-bold tracking-tight text-xs uppercase">IMATEC ERP</div>
            </div>
            <nav class="flex-1 py-8 px-4 space-y-2">
                <button onclick="window.navigate('home')" id="nav-home" class="nav-btn w-full flex items-center space-x-3 px-5 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-800 transition-all">
                    <i data-lucide="layout-dashboard" class="w-4 h-4"></i> <span>Dashboard</span>
                </button>
                <button onclick="window.navigate('rh')" id="nav-rh" class="nav-btn w-full flex items-center space-x-3 px-5 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-800 transition-all">
                    <i data-lucide="users" class="w-4 h-4"></i> <span>Recursos Humanos</span>
                </button>
                <button onclick="window.navigate('faturacao')" id="nav-faturacao" class="nav-btn w-full flex items-center space-x-3 px-5 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-800 transition-all">
                    <i data-lucide="file-text" class="w-4 h-4"></i> <span>Faturação</span>
                </button>
            </nav>
            <div class="p-6 bg-blue-950/40 border-t border-blue-800">
                <div class="flex items-center space-x-3 mb-6">
                    <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-[10px] uppercase">${user.nome.charAt(0)}</div>
                    <div class="overflow-hidden">
                        <p class="text-[10px] font-black truncate uppercase tracking-widest">${user.nome}</p>
                        <p class="text-[8px] text-blue-400 truncate uppercase font-bold">${empresa.nome}</p>
                    </div>
                </div>
                <button onclick="window.logout()" class="w-full py-3 bg-red-500/10 text-red-300 text-[9px] font-bold uppercase tracking-widest rounded-xl border border-red-500/20 hover:bg-red-500 hover:text-white transition-all">Sair</button>
            </div>
        </aside>

        <!-- Main -->
        <div class="flex-1 flex flex-col overflow-hidden">
            <header class="h-20 bg-white border-b flex items-center justify-between px-10 shadow-sm z-10">
                <h2 id="pageTitle" class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Resumo Administrativo</h2>
                <div class="bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 flex items-center space-x-2">
                    <span class="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                    <span class="text-[9px] font-black text-blue-600 uppercase tracking-widest">${empresa.nome}</span>
                </div>
            </header>
            <main id="mainContent" class="flex-1 overflow-y-auto p-12">
                <!-- Conteúdo SPA via navigate() -->
            </main>
        </div>
    </div>
    `);

    // Global SPA Navigation
    (window as any).navigate = (page: string) => {
        const content = document.getElementById('mainContent');
        const title = document.getElementById('pageTitle');
        if (!content || !title) return;

        // Estilo dos botões
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('bg-blue-800', 'text-white'));
        document.getElementById(`nav-${page}`)?.classList.add('bg-blue-800', 'text-white');

        // Filtragem de dados por empresa (O CORAÇÃO DO SISTEMA)
        const empresaId = empresa.id;

        switch(page) {
            case 'home':
                title.innerText = "Painel de Controlo";
                content.innerHTML = `
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in slide-in-from-bottom-4 duration-500">
                    <div class="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                        <h3 class="text-[9px] font-black text-slate-400 uppercase mb-4">Funcionários Ativos</h3>
                        <p class="text-3xl font-black">${DB.funcionarios.filter(f => f.empresa_id === empresaId).length}</p>
                    </div>
                    <div class="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                        <h3 class="text-[9px] font-black text-slate-400 uppercase mb-4">Vendas Registadas</h3>
                        <p class="text-3xl font-black">${DB.vendas.filter(v => v.empresa_id === empresaId).length}</p>
                    </div>
                    <div class="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                        <h3 class="text-[9px] font-black text-slate-400 uppercase mb-4">Sessão Segura</h3>
                        <p class="text-xs font-bold text-emerald-500 uppercase tracking-widest">Empresa: ${empresaId}</p>
                    </div>
                </div>
                `;
                break;

            case 'rh':
                title.innerText = "Gestão de Recursos Humanos";
                const funcs = DB.funcionarios.filter(f => f.empresa_id === empresaId);
                content.innerHTML = `
                <div class="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm animate-in fade-in duration-500">
                    <table class="w-full text-left text-[11px]">
                        <thead class="bg-gray-50 text-gray-400 uppercase font-black tracking-widest border-b">
                            <tr><th class="px-8 py-6">Nome</th><th class="px-8 py-6">Cargo</th><th class="px-8 py-6 text-right">Vencimento</th></tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50">
                            ${funcs.map(f => `<tr><td class="px-8 py-5 font-bold">${f.nome}</td><td class="px-8 py-5">${f.cargo}</td><td class="px-8 py-5 text-right font-black">${f.salario.toLocaleString()} Kz</td></tr>`).join('')}
                            ${funcs.length === 0 ? '<tr><td colspan="3" class="px-8 py-10 text-center text-gray-400 font-bold uppercase">Nenhum registo encontrado</td></tr>' : ''}
                        </tbody>
                    </table>
                </div>
                `;
                break;

            case 'faturacao':
                title.innerText = "Histórico de Faturação";
                const vendas = DB.vendas.filter(v => v.empresa_id === empresaId);
                content.innerHTML = `
                <div class="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm animate-in fade-in duration-500">
                    <table class="w-full text-left text-[11px]">
                        <thead class="bg-gray-50 text-gray-400 uppercase font-black tracking-widest border-b">
                            <tr><th class="px-8 py-6">Cliente</th><th class="px-8 py-6">Data</th><th class="px-8 py-6 text-right">Total</th></tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50">
                            ${vendas.map(v => `<tr><td class="px-8 py-5 font-bold">${v.cliente}</td><td class="px-8 py-5 text-gray-400">${v.data}</td><td class="px-8 py-5 text-right font-black text-blue-600">${v.valor.toLocaleString()} Kz</td></tr>`).join('')}
                            ${vendas.length === 0 ? '<tr><td colspan="3" class="px-8 py-10 text-center text-gray-400 font-bold uppercase">Sem faturas nesta empresa</td></tr>' : ''}
                        </tbody>
                    </table>
                </div>
                `;
                break;
        }

        if ((window as any).lucide) (window as any).lucide.createIcons();
    };

    (window as any).logout = () => {
        localStorage.removeItem('imatec_session');
        init();
    };

    (window as any).navigate('home');
};

// ---------------------------------------------------------
// 5. INICIALIZAÇÃO DO MOTOR
// ---------------------------------------------------------
const init = () => {
    console.log("[IMATEC] Motor iniciado.");
    const session = localStorage.getItem('imatec_session');
    
    if (session) {
        try {
            const { user, empresa } = JSON.parse(session);
            showDashboard(user, empresa);
        } catch (e) {
            localStorage.removeItem('imatec_session');
            showLogin();
        }
    } else {
        showLogin();
    }
};

window.addEventListener('DOMContentLoaded', init);
