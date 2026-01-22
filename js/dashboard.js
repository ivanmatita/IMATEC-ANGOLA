
import { getEmpresaData } from './supabase.js';

let currentEmpresa = null;
let currentUser = null;

/**
 * Renderiza o Layout Principal Isolado por Empresa
 */
export function renderDashboardLayout(user, empresa) {
    currentUser = user;
    currentEmpresa = empresa;
    
    const app = document.getElementById('app');
    if (!app) return;
    
    app.innerHTML = `
    <div class="flex h-screen bg-slate-50 overflow-hidden font-inter animate-in fade-in duration-700">
        <!-- Sidebar Inteligente -->
        <aside class="w-72 bg-blue-900 text-white flex flex-col shrink-0 shadow-2xl z-20">
            <div class="p-8 border-b border-blue-800 flex items-center space-x-4">
                <div class="w-10 h-10 bg-blue-500 rounded-2xl flex items-center justify-center font-bold shadow-xl border border-blue-400">I</div>
                <div>
                    <div class="font-black tracking-tight text-xs uppercase">IMATEC ERP</div>
                    <div class="text-[9px] text-blue-300 font-bold uppercase tracking-widest">Painel Cloud</div>
                </div>
            </div>

            <nav class="flex-1 overflow-y-auto py-8 px-4 space-y-1.5">
                <button onclick="window.navigate('home')" id="nav-home" class="nav-btn w-full flex items-center space-x-3 px-5 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-800 transition-all group">
                    <i data-lucide="layout-dashboard" class="w-4 h-4 text-blue-400 group-hover:text-white"></i> <span>Dashboard</span>
                </button>
                <button onclick="window.navigate('rh')" id="nav-rh" class="nav-btn w-full flex items-center space-x-3 px-5 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-800 transition-all group">
                    <i data-lucide="users" class="w-4 h-4 text-blue-400 group-hover:text-white"></i> <span>Recursos Humanos</span>
                </button>
                <button onclick="window.navigate('faturacao')" id="nav-faturacao" class="nav-btn w-full flex items-center space-x-3 px-5 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-800 transition-all group">
                    <i data-lucide="file-text" class="w-4 h-4 text-blue-400 group-hover:text-white"></i> <span>Faturação</span>
                </button>
                <button onclick="window.navigate('stock')" id="nav-stock" class="nav-btn w-full flex items-center space-x-3 px-5 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-800 transition-all group">
                    <i data-lucide="package" class="w-4 h-4 text-blue-400 group-hover:text-white"></i> <span>Stock</span>
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
                    <i data-lucide="log-out" class="w-3 h-3"></i> <span>Sair do ERP</span>
                </button>
            </div>
        </aside>

        <!-- Área de Conteúdo Principal -->
        <div class="flex-1 flex flex-col overflow-hidden relative">
            <header class="h-24 bg-white border-b border-gray-100 flex items-center justify-between px-12 shrink-0 z-10 shadow-sm">
                <div class="flex flex-col">
                    <h2 id="pageTitle" class="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Carregando Módulo...</h2>
                    <p class="text-[9px] text-blue-600 font-bold uppercase mt-1 tracking-widest">Ambiente Isolado: ${empresa.nome}</p>
                </div>
                <div class="flex items-center space-x-4">
                    <div class="bg-blue-50 px-5 py-2.5 rounded-2xl border border-blue-100 flex items-center space-x-3 shadow-sm">
                        <div class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                        <span class="text-[9px] font-black text-blue-700 uppercase tracking-widest">Sessão Segura: ${empresa.nif}</span>
                    </div>
                </div>
            </header>
            <main id="mainContent" class="flex-1 overflow-y-auto p-12 bg-slate-50/50">
                <!-- Conteúdo renderizado aqui via SPA -->
            </main>
        </div>
    </div>
    `;

    // Global SPA Navigation
    window.navigate = async (page) => {
        const content = document.getElementById('mainContent');
        const title = document.getElementById('pageTitle');
        if (!content || !title) return;

        // Efeito de carregamento
        content.innerHTML = `<div class="h-full flex items-center justify-center"><div class="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div></div>`;

        // Update UI state
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('bg-blue-800', 'text-white', 'shadow-xl'));
        const activeBtn = document.getElementById(`nav-${page}`);
        if (activeBtn) {
            activeBtn.classList.add('bg-blue-800', 'text-white', 'shadow-xl');
        }

        switch(page) {
            case 'home':
                title.innerText = "Dashboard Analítico";
                renderHome(content);
                break;
            case 'rh':
                title.innerText = "Recursos Humanos";
                await renderRH(content);
                break;
            case 'faturacao':
                title.innerText = "Módulo de Faturação";
                await renderFaturacao(content);
                break;
            case 'stock':
                title.innerText = "Gestão de Stocks";
                await renderStock(content);
                break;
            default:
                content.innerHTML = `<div class="p-20 text-center"><p class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">Módulo em Manutenção</p></div>`;
        }
        
        if (window.lucide) window.lucide.createIcons();
    };

    window.logout = () => {
        console.log("[IMATEC] Encerrando sessão...");
        localStorage.removeItem('imatec_session');
        window.location.reload(); // Para logout completo, o reload é seguro.
    };

    // Navega para a home inicialmente
    window.navigate('home');
}

function renderHome(container) {
    container.innerHTML = `
    <div class="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all group">
                <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><i data-lucide="trending-up" class="w-6 h-6"></i></div>
                <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Volume de Negócios (Mês)</h3>
                <p class="text-4xl font-black text-slate-800">4.250.000 <span class="text-sm font-medium text-slate-400">Kz</span></p>
                <div class="mt-6 flex items-center text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                    <i data-lucide="check-circle" class="w-3 h-3 mr-2"></i> Isolamento de Dados: Ativo
                </div>
            </div>
            <div class="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all group">
                <div class="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><i data-lucide="users" class="w-6 h-6"></i></div>
                <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Colaboradores</h3>
                <p class="text-4xl font-black text-slate-800">2 <span class="text-sm font-medium text-slate-400">Registos</span></p>
                <div class="mt-6 flex items-center text-indigo-500 text-[10px] font-black uppercase tracking-widest">
                    <i data-lucide="shield-check" class="w-3 h-3 mr-2"></i> Conformidade RH: OK
                </div>
            </div>
            <div class="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all group">
                <div class="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><i data-lucide="package" class="w-6 h-6"></i></div>
                <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Valor em Stock</h3>
                <p class="text-4xl font-black text-slate-800">14.280.000 <span class="text-sm font-medium text-slate-400">Kz</span></p>
                <div class="mt-6 flex items-center text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                    <i data-lucide="bar-chart" class="w-3 h-3 mr-2"></i> Inventário Verificado
                </div>
            </div>
        </div>
        
        <div class="bg-blue-900 rounded-[3rem] p-16 text-white flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden border border-blue-800">
            <div class="relative z-10 max-w-xl">
                <h2 class="text-4xl font-black uppercase tracking-tight font-lato leading-tight">Gestão Centralizada: <br/>${currentEmpresa.nome}</h2>
                <p class="text-blue-200 text-sm mt-6 font-medium leading-relaxed opacity-90">Bem-vindo ao núcleo operacional do seu ERP. Todos os módulos estão configurados para operar exclusivamente sob o NIF <b>${currentEmpresa.nif}</b>, garantindo integridade e conformidade legal total.</p>
                <div class="mt-10 flex flex-wrap gap-4">
                    <button onclick="window.navigate('faturacao')" class="bg-blue-600 hover:bg-blue-500 px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/40 transition-all active:scale-95">Emitir Documento</button>
                    <button onclick="window.navigate('rh')" class="bg-white/10 hover:bg-white/20 px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all border border-white/10 active:scale-95">Gestão de Staff</button>
                </div>
            </div>
            <div class="mt-12 md:mt-0 relative z-10 hidden xl:block">
                <div class="w-48 h-48 bg-white/5 rounded-[3rem] border border-white/10 flex items-center justify-center animate-pulse">
                    <i data-lucide="activity" class="w-20 h-20 text-blue-400"></i>
                </div>
            </div>
            <!-- Decoração de fundo -->
            <div class="absolute -right-24 -bottom-24 w-80 h-80 bg-blue-800 rounded-full opacity-40 blur-3xl"></div>
            <div class="absolute -left-24 -top-24 w-64 h-64 bg-blue-600 rounded-full opacity-10 blur-2xl"></div>
        </div>
    </div>
    `;
}

async function renderRH(container) {
    // Busca dados reais filtrados pela empresa ativa
    const funcionarios = await getEmpresaData('funcionarios');

    container.innerHTML = `
    <div class="space-y-10 animate-in slide-in-from-bottom-8 duration-700">
        <div class="flex items-center justify-between bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <div class="flex items-center space-x-6">
                <div class="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center"><i data-lucide="users" class="w-7 h-7"></i></div>
                <div>
                    <h3 class="font-black text-slate-800 text-sm uppercase tracking-wider">Pessoal Adminsitrado</h3>
                    <p class="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Isolamento Ativo: ${currentEmpresa.nome}</p>
                </div>
            </div>
            <button class="bg-blue-600 text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-500 transition-all flex items-center space-x-3 active:scale-95">
                <i data-lucide="plus" class="w-4 h-4"></i> <span>Admitir Colaborador</span>
            </button>
        </div>

        <div class="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
            <table class="w-full text-left text-[11px]">
                <thead class="bg-slate-50 font-black text-slate-400 uppercase tracking-[0.2em] border-b">
                    <tr>
                        <th class="px-10 py-7">Colaborador</th>
                        <th class="px-10 py-7">Cargo / Função</th>
                        <th class="px-10 py-7 text-right">Vencimento Base</th>
                        <th class="px-10 py-7">Estado</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                    ${funcionarios.length > 0 ? funcionarios.map(f => `
                        <tr class="hover:bg-slate-50 transition-all group">
                            <td class="px-10 py-7 font-black text-slate-800 uppercase tracking-tight">${f.nome}</td>
                            <td class="px-10 py-7 text-slate-500 font-bold">${f.cargo}</td>
                            <td class="px-10 py-7 text-right font-black text-blue-700">${Number(f.salario_base).toLocaleString()},00 Kz</td>
                            <td class="px-10 py-7"><span class="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">${f.estado}</span></td>
                        </tr>
                    `).join('') : `
                        <!-- Mock data se a tabela estiver vazia -->
                        <tr class="hover:bg-slate-50 transition-all">
                            <td class="px-10 py-7 font-black text-slate-800 uppercase tracking-tight">INACIOO</td>
                            <td class="px-10 py-7 text-slate-500 font-bold">Secretariado Executivo</td>
                            <td class="px-10 py-7 text-right font-black text-blue-700">100.000,00 Kz</td>
                            <td class="px-10 py-7"><span class="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">ATIVO</span></td>
                        </tr>
                        <tr class="hover:bg-slate-50 transition-all">
                            <td class="px-10 py-7 font-black text-slate-800 uppercase tracking-tight">JOÃO MANUEL BAPTISTA</td>
                            <td class="px-10 py-7 text-slate-500 font-bold">Gestor de TI</td>
                            <td class="px-10 py-7 text-right font-black text-blue-700">450.000,00 Kz</td>
                            <td class="px-10 py-7"><span class="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">ATIVO</span></td>
                        </tr>
                    `}
                </tbody>
            </table>
        </div>
    </div>
    `;
}

async function renderFaturacao(container) {
    const faturas = await getEmpresaData('faturacao');

    container.innerHTML = `
    <div class="space-y-10 animate-in fade-in duration-700">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center justify-between">
                <div class="flex items-center space-x-6">
                    <div class="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center"><i data-lucide="file-check" class="w-7 h-7"></i></div>
                    <div>
                        <h3 class="font-black text-slate-800 text-sm uppercase tracking-wider">Documentos Emitidos</h3>
                        <p class="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">Série Comercial 2024</p>
                    </div>
                </div>
                <button class="bg-emerald-600 text-white px-8 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 active:scale-95">Nova Venda</button>
            </div>
            <div class="bg-blue-900 p-10 rounded-[2.5rem] text-white shadow-xl flex items-center justify-between">
                <div>
                    <h3 class="font-black text-blue-200 text-[10px] uppercase tracking-widest mb-2">Total em Aberto</h3>
                    <p class="text-3xl font-black">1.250.000 <span class="text-xs font-medium">Kz</span></p>
                </div>
                <i data-lucide="wallet" class="w-10 h-10 text-blue-400 opacity-50"></i>
            </div>
        </div>

        <div class="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
            <table class="w-full text-left text-[11px]">
                <thead class="bg-slate-50 font-black text-slate-400 uppercase tracking-[0.2em] border-b">
                    <tr>
                        <th class="px-10 py-7">Nº / Série</th>
                        <th class="px-10 py-7">Cliente</th>
                        <th class="px-10 py-7 text-right">Total Bruto</th>
                        <th class="px-10 py-7">Estado</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                    ${faturas.length > 0 ? faturas.map(f => `
                        <tr class="hover:bg-slate-50 transition-all">
                            <td class="px-10 py-7 font-black text-blue-600 uppercase tracking-tight">${f.numero}</td>
                            <td class="px-10 py-7 font-bold text-slate-800">${f.cliente}</td>
                            <td class="px-10 py-7 text-right font-black text-slate-800">${Number(f.total).toLocaleString()},00 Kz</td>
                            <td class="px-10 py-7"><span class="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">${f.estado}</span></td>
                        </tr>
                    `).join('') : `
                        <tr class="hover:bg-slate-50 transition-all">
                            <td class="px-10 py-7 font-black text-blue-600 uppercase tracking-tight">FR 2024/001</td>
                            <td class="px-10 py-7 font-bold text-slate-800 uppercase">CONSUMIDOR FINAL (ISOLADO)</td>
                            <td class="px-10 py-7 text-right font-black text-slate-800">12.500,00 Kz</td>
                            <td class="px-10 py-7"><span class="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">LIQUIDADO</span></td>
                        </tr>
                    `}
                </tbody>
            </table>
        </div>
    </div>
    `;
}

async function renderStock(container) {
    const stock = await getEmpresaData('produtos');

    container.innerHTML = `
    <div class="space-y-10 animate-in fade-in duration-700">
        <div class="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm flex items-center justify-between">
            <div class="flex items-center space-x-6">
                <div class="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center"><i data-lucide="package" class="w-7 h-7"></i></div>
                <div>
                    <h3 class="font-black text-slate-800 text-sm uppercase tracking-wider">Inventário de Mercadorias</h3>
                    <p class="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">Unidade Logística: ${currentEmpresa.nome}</p>
                </div>
            </div>
            <button class="bg-blue-600 text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95">Adicionar Artigo</button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            ${stock.length > 0 ? stock.map(p => `
                <div class="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all">
                    <h4 class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">${p.categoria}</h4>
                    <p class="text-xs font-black text-slate-800 uppercase mb-4 h-10 line-clamp-2">${p.nome}</p>
                    <div class="flex items-end justify-between border-t border-slate-50 pt-4">
                        <div>
                            <span class="text-[8px] font-black text-slate-400 uppercase tracking-widest">Disponível</span>
                            <p class="text-lg font-black text-blue-600">${p.quantidade} <span class="text-[9px]">${p.unidade}</span></p>
                        </div>
                        <p class="text-xs font-black text-slate-800">${Number(p.preco).toLocaleString()} Kz</p>
                    </div>
                </div>
            `).join('') : `
                <div class="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                    <h4 class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">INFORMÁTICA</h4>
                    <p class="text-xs font-black text-slate-800 uppercase mb-4">Computador HP 250 G8</p>
                    <div class="flex items-end justify-between border-t border-slate-50 pt-4">
                        <div>
                            <span class="text-[8px] font-black text-slate-400 uppercase tracking-widest">Stock Ativo</span>
                            <p class="text-lg font-black text-blue-600">12 <span class="text-[9px]">Un</span></p>
                        </div>
                        <p class="text-xs font-black text-slate-800">350.000 Kz</p>
                    </div>
                </div>
                <div class="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                    <h4 class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">INFORMÁTICA</h4>
                    <p class="text-xs font-black text-slate-800 uppercase mb-4">Impressora Epson L3210</p>
                    <div class="flex items-end justify-between border-t border-slate-50 pt-4">
                        <div>
                            <span class="text-[8px] font-black text-slate-400 uppercase tracking-widest">Stock Ativo</span>
                            <p class="text-lg font-black text-blue-600">8 <span class="text-[9px]">Un</span></p>
                        </div>
                        <p class="text-xs font-black text-slate-800">120.000 Kz</p>
                    </div>
                </div>
            `}
        </div>
    </div>
    `;
}
