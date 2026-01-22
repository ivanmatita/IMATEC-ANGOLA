
import { getEmpresaData } from './supabase.js';

/**
 * Renderiza o Dashboard principal
 */
export function renderDashboardLayout(user, empresa) {
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = `
    <div class="flex h-screen bg-slate-50 overflow-hidden font-inter animate-in fade-in duration-500">
        <!-- Sidebar -->
        <aside class="w-72 bg-blue-900 text-white flex flex-col shrink-0 shadow-2xl">
            <div class="p-8 border-b border-blue-800 flex items-center space-x-3">
                <div class="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center font-bold shadow-lg">I</div>
                <div class="font-bold tracking-tight text-xs uppercase">IMATEC ERP</div>
            </div>

            <nav class="flex-1 py-8 px-4 space-y-2">
                <button onclick="window.navigate('home')" id="nav-home" class="nav-btn w-full flex items-center space-x-3 px-5 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-800 transition-all">
                    <i data-lucide="layout-dashboard"></i> <span>Dashboard</span>
                </button>
                <button onclick="window.navigate('rh')" id="nav-rh" class="nav-btn w-full flex items-center space-x-3 px-5 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-800 transition-all">
                    <i data-lucide="users"></i> <span>Recursos Humanos</span>
                </button>
                <button onclick="window.navigate('faturacao')" id="nav-faturacao" class="nav-btn w-full flex items-center space-x-3 px-5 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-800 transition-all">
                    <i data-lucide="file-text"></i> <span>Faturação</span>
                </button>
            </nav>

            <div class="p-8 bg-blue-950/40 border-t border-blue-800">
                <div class="flex items-center space-x-3 mb-6">
                    <div class="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold border-2 border-blue-400">${user.nome.charAt(0)}</div>
                    <div class="overflow-hidden">
                        <p class="text-[10px] font-black truncate uppercase tracking-widest">${user.nome}</p>
                        <p class="text-[8px] text-blue-400 truncate uppercase font-bold">${empresa.nome}</p>
                    </div>
                </div>
                <button onclick="window.logout()" class="w-full py-3 bg-red-500/10 text-red-300 text-[10px] font-bold uppercase tracking-widest rounded-xl border border-red-500/20 hover:bg-red-500 hover:text-white transition-all">Sair</button>
            </div>
        </aside>

        <!-- Main -->
        <div class="flex-1 flex flex-col overflow-hidden">
            <header class="h-20 bg-white border-b flex items-center justify-between px-10 shadow-sm z-10">
                <h2 id="pageTitle" class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Resumo Administrativo</h2>
                <div class="bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
                    <span class="text-[9px] font-black text-blue-600 uppercase tracking-widest">Empresa: ${empresa.nome}</span>
                </div>
            </header>
            <main id="mainContent" class="flex-1 overflow-y-auto p-12">
                <!-- Conteúdo SPA -->
            </main>
        </div>
    </div>
    `;

    // Função de navegação interna (SPA)
    window.navigate = async (page) => {
        const content = document.getElementById('mainContent');
        const title = document.getElementById('pageTitle');
        if (!content || !title) return;

        content.innerHTML = `<div class="h-full flex items-center justify-center animate-pulse"><div class="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>`;

        switch(page) {
            case 'home':
                title.innerText = "Dashboard Geral";
                renderHome(content, empresa);
                break;
            case 'rh':
                title.innerText = "RH e Pessoal";
                await renderRH(content, empresa);
                break;
            case 'faturacao':
                title.innerText = "Documentos de Venda";
                await renderFaturacao(content, empresa);
                break;
        }
        
        if (window.lucide) window.lucide.createIcons();
    };

    window.logout = () => {
        localStorage.removeItem('imatec_session');
        window.location.reload();
    };

    // Inicializa a primeira página
    window.navigate('home');
}

function renderHome(container, empresa) {
    container.innerHTML = `
    <div class="space-y-10 animate-in fade-in duration-700">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                <h3 class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Vendas (Mês)</h3>
                <p class="text-3xl font-black text-slate-800">1.250.000 <span class="text-xs font-medium text-slate-400 tracking-normal">Kz</span></p>
                <p class="text-[8px] mt-4 font-bold text-emerald-500 uppercase tracking-widest">Isolado para ID: ${empresa.id}</p>
            </div>
            <div class="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                <h3 class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Colaboradores Ativos</h3>
                <p class="text-3xl font-black text-slate-800">2 <span class="text-xs font-medium text-slate-400 tracking-normal">Efetivos</span></p>
            </div>
            <div class="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                <h3 class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">NIF Verificado</h3>
                <p class="text-xl font-bold text-blue-600">${empresa.nif}</p>
            </div>
        </div>

        <div class="bg-blue-900 rounded-[2.5rem] p-12 text-white shadow-2xl relative overflow-hidden">
            <div class="relative z-10">
                <h2 class="text-3xl font-black uppercase tracking-tight font-lato">Bem-vindo, Gestor</h2>
                <p class="text-blue-200 text-sm mt-4 font-medium opacity-80">Você está a gerir a empresa <b>${empresa.nome}</b>. Todos os dados abaixo estão isolados.</p>
                <div class="mt-8 flex space-x-4">
                    <button onclick="window.navigate('faturacao')" class="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-2xl font-black text-[9px] uppercase tracking-widest transition-all shadow-xl shadow-blue-500/30">Emitir Fatura</button>
                    <button onclick="window.navigate('rh')" class="bg-white/10 hover:bg-white/20 px-8 py-3 rounded-2xl font-black text-[9px] uppercase tracking-widest transition-all">Ver Equipa</button>
                </div>
            </div>
            <div class="absolute -right-20 -bottom-20 w-64 h-64 bg-blue-800 rounded-full opacity-30"></div>
        </div>
    </div>
    `;
}

async function renderRH(container, empresa) {
    // CHAMADA REAL AO SUPABASE COM FILTRO empresa_id
    const funcionarios = await getEmpresaData('funcionarios');

    container.innerHTML = `
    <div class="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
        <div class="flex items-center justify-between">
            <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Quadro de Pessoal: ${empresa.nome}</h3>
            <button class="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-widest">Novo Cadastro</button>
        </div>
        <div class="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
            <table class="w-full text-left text-[11px]">
                <thead class="bg-gray-50 font-black text-gray-400 uppercase border-b">
                    <tr>
                        <th class="px-8 py-6">Nome</th>
                        <th class="px-8 py-6">Cargo</th>
                        <th class="px-8 py-6 text-right">Salário Base</th>
                        <th class="px-8 py-6">Empresa ID</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    ${funcionarios.length > 0 ? funcionarios.map(f => `
                        <tr>
                            <td class="px-8 py-5 font-bold text-slate-800">${f.nome}</td>
                            <td class="px-8 py-5 text-gray-500">${f.cargo}</td>
                            <td class="px-8 py-5 text-right font-black text-blue-700">${f.salario_base.toLocaleString()},00 Kz</td>
                            <td class="px-8 py-5"><span class="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[8px] font-bold">${f.empresa_id}</span></td>
                        </tr>
                    `).join('') : `
                        <tr>
                            <td colspan="4" class="px-8 py-20 text-center text-gray-400 font-bold uppercase text-[9px] tracking-widest">Nenhum funcionário encontrado para esta empresa.</td>
                        </tr>
                    `}
                </tbody>
            </table>
        </div>
    </div>
    `;
}

async function renderFaturacao(container, empresa) {
    const faturas = await getEmpresaData('faturacao');

    container.innerHTML = `
    <div class="space-y-8 animate-in fade-in duration-500">
        <div class="bg-white p-8 rounded-[2rem] border border-gray-100 flex items-center justify-between">
            <div>
                <h3 class="font-black text-slate-800 text-sm uppercase tracking-wider">Histórico de Vendas</h3>
                <p class="text-[9px] text-gray-400 font-bold uppercase mt-1">Ambiente Isolado: ${empresa.nome}</p>
            </div>
            <button class="bg-blue-600 text-white px-8 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-xl">Nova Fatura</button>
        </div>
        
        <div class="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
            <table class="w-full text-left text-[11px]">
                <thead class="bg-gray-50 font-black text-gray-400 uppercase border-b">
                    <tr>
                        <th class="px-8 py-6">Fatura Nº</th>
                        <th class="px-8 py-6">Cliente</th>
                        <th class="px-8 py-6 text-right">Total Bruto</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    ${faturas.length > 0 ? faturas.map(f => `
                        <tr>
                            <td class="px-8 py-5 font-bold text-blue-600">${f.numero}</td>
                            <td class="px-8 py-5 font-bold text-slate-800">${f.cliente}</td>
                            <td class="px-8 py-5 text-right font-black text-slate-800">${f.total.toLocaleString()},00 Kz</td>
                        </tr>
                    `).join('') : `
                        <tr>
                            <td colspan="3" class="px-8 py-20 text-center text-gray-400 font-bold uppercase text-[9px] tracking-widest">Nenhuma fatura encontrada.</td>
                        </tr>
                    `}
                </tbody>
            </table>
        </div>
    </div>
    `;
}
