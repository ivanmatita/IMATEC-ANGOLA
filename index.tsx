
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// 1. CONFIGURAÇÃO SUPABASE
const SUPABASE_URL = 'https://bgudiehufcvdbjaekxyu.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJndWRpZWh1ZmN2ZGJqYWVreHl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NDM5MjUsImV4cCI6MjA4NDExOTkyNX0.HjJbxhHaEhP4pDQ3fdYsoXKSmwZnBunzGEiTm_Bpks0';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. UTILITÁRIOS DE RENDERIZAÇÃO
const render = (html: string) => {
    const app = document.getElementById('app');
    if (app) {
        app.innerHTML = html;
        if ((window as any).lucide) (window as any).lucide.createIcons();
    }
};

// 3. ENVIO DE E-MAIL (SMTPJS)
const sendActivationEmail = (email: string, empresaNome: string) => {
    console.log(`[IMATEC] Enviando e-mail de ativação para ${email}...`);
    (window as any).Email.send({
        Host: "smtp.gmail.com",
        Username: "imatec38@gmail.com",
        Password: "odji bakq atmf xqcd",
        To: email,
        From: "imatec38@gmail.com",
        Subject: "Acesso ao Sistema IMATEC SOFTWARE",
        Body: `
            <div style="font-family: Arial, sans-serif; color: #1e3a8a; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #1e3a8a;">Bem-vindo à IMATEC SOFTWARE!</h2>
                <p>Sua empresa <b>${empresaNome}</b> foi registada com sucesso no nosso sistema multi-empresa.</p>
                <p>Pode agora aceder ao seu dashboard utilizando o seu email e a palavra-passe definida.</p>
                <br>
                <p style="font-size: 12px; color: #666;">Este é um email automático, por favor não responda.</p>
                <p>Atenciosamente,<br><b>Equipa Técnica IMATEC</b></p>
            </div>
        `
    }).then((message: string) => console.log("[IMATEC] Status do Email:", message));
};

// 4. MÓDULO DE REGISTO
const showRegister = () => {
    render(`
    <div class="min-h-screen flex items-center justify-center p-4 bg-slate-100 animate-in fade-in duration-500">
        <div class="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
            <div class="bg-blue-900 p-10 text-center relative">
                <div class="w-16 h-16 bg-blue-500 rounded-2xl mx-auto flex items-center justify-center text-white font-bold text-3xl mb-4 shadow-xl">I</div>
                <h1 class="text-xl font-bold text-white uppercase tracking-tight">Registar Empresa</h1>
                <p class="text-blue-300 text-[10px] mt-2 font-black uppercase tracking-widest">Configuração Multi-Empresa</p>
            </div>
            <form id="registerForm" class="p-8 space-y-4">
                <div class="space-y-1">
                    <label class="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Designação Social</label>
                    <input type="text" id="regNome" required placeholder="NOME DA EMPRESA" class="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all uppercase">
                </div>
                <div class="space-y-1">
                    <label class="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">NIF Fiscal</label>
                    <input type="text" id="regNif" required placeholder="540XXXXXXXX" class="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                </div>
                <div class="space-y-1">
                    <label class="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email do Administrador</label>
                    <input type="email" id="regEmail" required placeholder="admin@empresa.com" class="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                </div>
                <div class="space-y-1">
                    <label class="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Palavra-passe de Acesso</label>
                    <input type="password" id="regPass" required placeholder="••••••••" class="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                </div>
                
                <button type="submit" id="regBtn" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-xl transition-all uppercase text-xs tracking-widest flex items-center justify-center space-x-2 mt-4">
                    <span id="regBtnText">Finalizar Registo</span>
                    <div id="regLoader" class="hidden w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                </button>
                <p class="text-center text-[10px] text-gray-400 mt-4 font-bold uppercase tracking-widest">
                    Já tem acesso? <button type="button" onclick="window.showLogin()" class="text-blue-600 hover:underline">Entrar aqui</button>
                </p>
            </form>
        </div>
    </div>
    `);

    document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nome = (document.getElementById('regNome') as HTMLInputElement).value;
        const nif = (document.getElementById('regNif') as HTMLInputElement).value;
        const email = (document.getElementById('regEmail') as HTMLInputElement).value;
        const pass = (document.getElementById('regPass') as HTMLInputElement).value;
        
        const btnText = document.getElementById('regBtnText');
        const btnLoader = document.getElementById('regLoader');
        btnText?.classList.add('hidden');
        btnLoader?.classList.remove('hidden');

        try {
            // 1. Criar Empresa (USANDO NOMES DE COLUNAS REAIS DO SEU SUPABASE)
            const { data: empresa, error: empError } = await supabase
                .from('empresas')
                .insert([{ 
                    nome_empresa: nome, 
                    nif_empresa: nif, 
                    email: email 
                }])
                .select()
                .single();

            if (empError) throw empError;

            // 2. Criar Utilizador associado
            const { error: userError } = await supabase
                .from('usuarios')
                .insert([{ 
                    empresa_id: empresa.id, 
                    email: email, 
                    password: pass, 
                    nome: 'Administrador Principal',
                    role: 'admin'
                }]);

            if (userError) throw userError;

            // 3. Enviar Email de Ativação
            sendActivationEmail(email, nome);

            alert("Sucesso! Empresa registada. Verifique o seu email e faça login.");
            showLogin();
        } catch (err: any) {
            console.error(err);
            alert("Erro ao registar: " + err.message);
        } finally {
            btnText?.classList.remove('hidden');
            btnLoader?.classList.add('hidden');
        }
    });
};

// 5. MÓDULO DE LOGIN
const showLogin = () => {
    render(`
    <div class="min-h-screen flex items-center justify-center p-4 bg-slate-100 animate-in fade-in duration-500">
        <div class="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
            <div class="bg-blue-900 p-12 text-center relative">
                <div class="w-16 h-16 bg-blue-500 rounded-2xl mx-auto flex items-center justify-center text-white font-bold text-3xl mb-4 shadow-xl">I</div>
                <h1 class="text-2xl font-bold text-white font-lato uppercase tracking-tight">IMATEC SOFTWARE</h1>
                <p class="text-blue-300 text-[10px] mt-2 font-black uppercase tracking-widest">Painel de Controlo ERP</p>
            </div>
            <form id="loginForm" class="p-10 space-y-6">
                <div class="space-y-1.5">
                    <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Utilizador (Email)</label>
                    <input type="email" id="email" required class="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="exemplo@empresa.com">
                </div>
                <div class="space-y-1.5">
                    <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Palavra-passe</label>
                    <input type="password" id="password" required class="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="••••••••">
                </div>
                <button type="submit" id="loginBtn" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-500/20 transition-all uppercase text-xs tracking-widest">Aceder ao Sistema</button>
                <p class="text-center text-[10px] text-gray-400 mt-4 font-bold uppercase tracking-widest">
                    Sem registo? <button type="button" onclick="window.showRegister()" class="text-blue-600 hover:underline">Criar Nova Empresa</button>
                </p>
            </form>
        </div>
    </div>
    `);

    document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = (document.getElementById('email') as HTMLInputElement).value;
        const pass = (document.getElementById('password') as HTMLInputElement).value;

        try {
            const { data: user, error } = await supabase
                .from('usuarios')
                .select('*, empresas(*)')
                .eq('email', email)
                .eq('password', pass)
                .single();

            if (error || !user) throw new Error("Email ou palavra-passe incorretos.");

            localStorage.setItem('imatec_session', JSON.stringify({ 
                user: { nome: user.nome, email: user.email }, 
                empresa: user.empresas 
            }));
            
            initApp();
        } catch (err: any) {
            alert(err.message);
        }
    });
};

// 6. DASHBOARD MULTI-EMPRESA
const showDashboard = (user: any, empresa: any) => {
    // Usamos empresa.nome_empresa pois é o nome da coluna no seu banco
    const nomeExibicao = empresa.nome_empresa || empresa.nome || "Empresa IMATEC";
    const nifExibicao = empresa.nif_empresa || empresa.nif || "---";

    render(`
    <div class="flex h-screen bg-slate-50 overflow-hidden">
        <!-- Sidebar -->
        <aside class="w-72 bg-blue-900 text-white flex flex-col shrink-0 shadow-2xl z-20">
            <div class="p-8 border-b border-blue-800 flex items-center space-x-3">
                <div class="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center font-bold text-xs">I</div>
                <div class="font-bold tracking-tight text-xs uppercase">IMATEC SOFTWARE</div>
            </div>
            <nav class="flex-1 py-8 px-4 space-y-1.5">
                <button onclick="window.navigate('home')" id="nav-home" class="nav-btn w-full flex items-center space-x-3 px-5 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-800 transition-all">
                    <i data-lucide="layout-dashboard" class="w-4 h-4 text-blue-400"></i> <span>Dashboard</span>
                </button>
                <button onclick="window.navigate('rh')" id="nav-rh" class="nav-btn w-full flex items-center space-x-3 px-5 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-800 transition-all">
                    <i data-lucide="users" class="w-4 h-4 text-blue-400"></i> <span>Recursos Humanos</span>
                </button>
                <button onclick="window.navigate('faturas')" id="nav-faturas" class="nav-btn w-full flex items-center space-x-3 px-5 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-800 transition-all">
                    <i data-lucide="file-text" class="w-4 h-4 text-blue-400"></i> <span>Faturação</span>
                </button>
            </nav>
            <div class="p-6 bg-blue-950/40 border-t border-blue-800">
                <div class="flex items-center space-x-3 mb-6">
                    <div class="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-xs border border-blue-400 shadow-inner">${user.nome.charAt(0)}</div>
                    <div class="overflow-hidden">
                        <p class="text-[10px] font-black truncate uppercase tracking-widest">${user.nome}</p>
                        <p class="text-[8px] text-blue-400 truncate uppercase font-bold">${nomeExibicao}</p>
                    </div>
                </div>
                <button onclick="window.logout()" class="w-full flex items-center justify-center space-x-2 py-4 bg-red-500/10 text-red-300 text-[9px] font-black uppercase tracking-widest rounded-2xl border border-red-500/20 hover:bg-red-500 hover:text-white transition-all">
                   <i data-lucide="log-out" class="w-3 h-3"></i> <span>Encerrar ERP</span>
                </button>
            </div>
        </aside>

        <!-- Main -->
        <div class="flex-1 flex flex-col overflow-hidden">
            <header class="h-24 bg-white border-b flex items-center justify-between px-12 shrink-0 z-10 shadow-sm">
                <div>
                    <h2 id="pageTitle" class="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Painel de Controlo</h2>
                    <p class="text-[9px] text-blue-600 font-bold uppercase mt-1 tracking-widest">NIF Fiscal: ${nifExibicao}</p>
                </div>
                <div class="bg-blue-50 px-5 py-2.5 rounded-2xl border border-blue-100 flex items-center space-x-3">
                    <div class="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
                    <span class="text-[9px] font-black text-blue-600 uppercase tracking-widest">${nomeExibicao}</span>
                </div>
            </header>
            <main id="mainContent" class="flex-1 overflow-y-auto p-12 bg-slate-50/50">
                <!-- Conteúdo SPA -->
            </main>
        </div>
    </div>
    `);

    (window as any).navigate = async (page: string) => {
        const content = document.getElementById('mainContent');
        const title = document.getElementById('pageTitle');
        if (!content || !title) return;

        content.innerHTML = `<div class="h-full flex items-center justify-center animate-pulse"><div class="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>`;
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('bg-blue-800', 'text-white'));
        document.getElementById(`nav-${page}`)?.classList.add('bg-blue-800', 'text-white');

        try {
            switch(page) {
                case 'home':
                    title.innerText = "Dashboard Analítico";
                    content.innerHTML = `
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in slide-in-from-bottom-4 duration-500">
                        <div class="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
                            <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Sessão Ativa</h3>
                            <div class="flex items-center space-x-4">
                                <div class="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center"><i data-lucide="check-circle" class="w-6 h-6"></i></div>
                                <div>
                                    <p class="text-xl font-black text-slate-800">CONECTADO</p>
                                    <p class="text-[9px] text-slate-400 font-bold uppercase">Base de Dados Supabase</p>
                                </div>
                            </div>
                        </div>
                        <div class="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
                            <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Empresa Isolada</h3>
                            <div class="flex items-center space-x-4">
                                <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center"><i data-lucide="building-2" class="w-6 h-6"></i></div>
                                <div>
                                    <p class="text-sm font-black text-slate-800 truncate">${nomeExibicao}</p>
                                    <p class="text-[9px] text-slate-400 font-bold uppercase">Isolamento Multi-empresa</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="mt-12 bg-blue-900 rounded-[3.5rem] p-16 text-white shadow-2xl relative overflow-hidden">
                        <div class="relative z-10">
                            <h2 class="text-4xl font-black uppercase font-lato leading-tight">Bem-vindo à Gestão Cloud</h2>
                            <p class="text-blue-200 text-sm mt-6 max-w-2xl leading-relaxed">O sistema IMATEC está a operar no ambiente seguro da empresa <b>${nomeExibicao}</b>. Todos os registos são filtrados automaticamente pelo seu ID de empresa único.</p>
                        </div>
                        <div class="absolute -right-20 -bottom-20 w-96 h-96 bg-blue-800 rounded-full opacity-30 blur-3xl"></div>
                    </div>
                    `;
                    break;

                case 'rh':
                    title.innerText = "Recursos Humanos";
                    const { data: staff } = await supabase.from('funcionarios').select('*').eq('empresa_id', empresa.id);
                    content.innerHTML = `
                    <div class="space-y-8 animate-in fade-in duration-500">
                        <div class="bg-white rounded-[3rem] border border-gray-100 overflow-hidden shadow-sm">
                            <table class="w-full text-left text-xs">
                                <thead class="bg-slate-50 text-slate-400 font-black uppercase tracking-[0.2em] border-b">
                                    <tr><th class="px-10 py-7">Nome do Trabalhador</th><th class="px-10 py-7">Cargo / Função</th><th class="px-10 py-7 text-right">Vencimento</th></tr>
                                </thead>
                                <tbody class="divide-y divide-gray-50">
                                    ${staff?.length ? staff.map((f:any) => `<tr><td class="px-10 py-6 font-bold text-slate-800 uppercase">${f.nome}</td><td class="px-10 py-6 text-slate-500">${f.cargo || '---'}</td><td class="px-10 py-6 text-right font-black">${(f.salario_base || 0).toLocaleString()} Kz</td></tr>`).join('') : '<tr><td colspan="3" class="px-10 py-24 text-center text-gray-400 font-bold uppercase tracking-widest">Nenhum registo encontrado para esta empresa.</td></tr>'}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    `;
                    break;

                case 'faturas':
                    title.innerText = "Faturação Certificada";
                    const { data: vnds } = await supabase.from('vendas').select('*').eq('empresa_id', empresa.id);
                    content.innerHTML = `
                    <div class="space-y-8 animate-in fade-in duration-500">
                        <div class="bg-white rounded-[3rem] border border-gray-100 overflow-hidden shadow-sm">
                            <table class="w-full text-left text-xs">
                                <thead class="bg-slate-50 text-slate-400 font-black uppercase tracking-[0.2em] border-b">
                                    <tr><th class="px-10 py-7">Nº Doc</th><th class="px-10 py-7">Cliente</th><th class="px-10 py-7 text-right">Valor Total</th></tr>
                                </thead>
                                <tbody class="divide-y divide-gray-50">
                                    ${vnds?.length ? vnds.map((v:any) => `<tr><td class="px-10 py-6 font-bold text-blue-600 uppercase">${v.numero}</td><td class="px-10 py-6 text-slate-800 font-bold">${v.cliente}</td><td class="px-10 py-6 text-right font-black">${(v.total || 0).toLocaleString()} Kz</td></tr>`).join('') : '<tr><td colspan="3" class="px-10 py-24 text-center text-gray-400 font-bold uppercase tracking-widest">Nenhuma fatura registada nesta empresa.</td></tr>'}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    `;
                    break;
            }
        } catch (err) {
            console.error(err);
        }

        if ((window as any).lucide) (window as any).lucide.createIcons();
    };

    (window as any).logout = () => {
        localStorage.removeItem('imatec_session');
        initApp();
    };

    (window as any).navigate('home');
};

// 7. INICIALIZAÇÃO DEFINITIVA
const initApp = () => {
    const session = localStorage.getItem('imatec_session');
    
    (window as any).showRegister = showRegister;
    (window as any).showLogin = showLogin;

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

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
