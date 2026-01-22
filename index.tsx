
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// 1. CONFIGURAÇÃO SUPABASE
const SUPABASE_URL = 'https://bgudiehufcvdbjaekxyu.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJndWRpZWh1ZmN2ZGJqYWVreHl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NDM5MjUsImV4cCI6MjA4NDExOTkyNX0.HjJbxhHaEhP4pDQ3fdYsoXKSmwZnBunzGEiTm_Bpks0';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const render = (html: string) => {
    const app = document.getElementById('app');
    if (app) {
        app.innerHTML = html;
        if ((window as any).lucide) (window as any).lucide.createIcons();
    }
};

// 2. ENVIO DE EMAIL (SMTPJS) - COM PROTEÇÃO CONTRA UNDEFINED
const sendActivationEmail = (email: string, empresaNome: string, pass: string) => {
    const Email = (window as any).Email;
    
    // Verifica se a biblioteca SMTPJS foi carregada corretamente
    if (!Email || typeof Email.send !== 'function') {
        console.warn("[IMATEC] SMTPJS não disponível. O e-mail não será enviado, mas o registo continuará.");
        return;
    }
    
    try {
        Email.send({
            Host: "smtp.gmail.com",
            Username: "imatec38@gmail.com",
            Password: "odji bakq atmf xqcd",
            To: email,
            From: "imatec38@gmail.com",
            Subject: "Ativação de Conta - IMATEC SOFTWARE",
            Body: `
                <div style="font-family: sans-serif; color: #1e3a8a; padding: 40px; border: 1px solid #e2e8f0; border-radius: 24px; max-width: 600px; margin: auto;">
                    <h1 style="color: #1e40af; text-transform: uppercase;">IMATEC SOFTWARE</h1>
                    <p>A sua empresa <b>${empresaNome}</b> foi registada com sucesso.</p>
                    <div style="background: #f8fafc; padding: 20px; border-radius: 16px; border: 1px solid #eee;">
                        <p><b>E-mail de Acesso:</b> ${email}</p>
                        <p><b>Palavra-passe:</b> ${pass}</p>
                    </div>
                    <p style="font-size: 11px; color: #64748b; margin-top: 20px;">Este é um e-mail automático do sistema ERP Multi-Empresa.</p>
                </div>
            `
        });
    } catch (err) {
        console.error("[IMATEC] Erro ao tentar disparar e-mail:", err);
    }
};

// 3. PÁGINA DE LOGIN
const showLogin = () => {
    render(`
    <div class="min-h-screen flex items-center justify-center p-4 bg-slate-100 animate-in fade-in duration-500">
        <div class="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
            <div class="bg-blue-900 p-10 text-center">
                <div class="w-14 h-14 bg-blue-500 rounded-2xl mx-auto flex items-center justify-center text-white font-bold text-2xl mb-4 shadow-lg">I</div>
                <h1 class="text-white font-bold text-xl uppercase tracking-tighter">IMATEC SOFTWARE</h1>
                <p class="text-blue-300 text-[10px] font-black uppercase tracking-widest mt-1">Painel Multi-Empresa</p>
            </div>
            <form id="loginForm" class="p-10 space-y-4">
                <div class="space-y-1">
                   <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">E-mail do Administrador</label>
                   <input type="email" id="email" required placeholder="ADMIN@EMPRESA.COM" class="w-full px-5 py-4 bg-gray-50 border rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                </div>
                <div class="space-y-1">
                   <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Palavra-passe</label>
                   <input type="password" id="password" required placeholder="••••••••" class="w-full px-5 py-4 bg-gray-50 border rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                </div>
                <button type="submit" id="loginSubmit" class="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl uppercase text-xs tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20">Entrar no ERP</button>
                <p class="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest pt-4">
                    Ainda não tem conta? <button type="button" onclick="window.showRegister()" class="text-blue-600 hover:underline font-black">Registar Empresa</button>
                </p>
            </form>
        </div>
    </div>
    `);

    document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('loginSubmit') as HTMLButtonElement;
        const email = (document.getElementById('email') as HTMLInputElement).value;
        const pass = (document.getElementById('password') as HTMLInputElement).value;

        btn.disabled = true;
        btn.innerText = "A AUTENTICAR...";

        try {
            const { data: user, error } = await supabase
                .from('usuarios')
                .select('*, empresas(*)')
                .eq('email', email)
                .eq('password', pass)
                .single();

            if (error || !user) throw new Error("Credenciais inválidas. Verifique o e-mail e a senha.");

            localStorage.setItem('imatec_session', JSON.stringify({ user, empresa: user.empresas }));
            initApp();
        } catch (err: any) { 
            alert(err.message); 
            btn.disabled = false;
            btn.innerText = "ENTRAR NO ERP";
        }
    });
};

// 4. PÁGINA DE REGISTO (CORREÇÃO DE CONSTRAINTS E ERROS)
const showRegister = () => {
    render(`
    <div class="min-h-screen flex items-center justify-center p-4 bg-slate-100 animate-in fade-in duration-500">
        <div class="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
            <div class="bg-blue-900 p-8 text-center text-white">
                <h1 class="text-xl font-bold uppercase tracking-tight">Novo Registo Cloud</h1>
                <p class="text-blue-300 text-[9px] uppercase font-bold tracking-widest">Multi-Company Setup</p>
            </div>
            <form id="regForm" class="p-8 space-y-3">
                <div class="space-y-1">
                   <label class="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Nome da Empresa</label>
                   <input type="text" id="regNome" required placeholder="DESIGNÇÃO SOCIAL" class="w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm uppercase outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div class="space-y-1">
                       <label class="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">NIF Fiscal</label>
                       <input type="text" id="regNif" required placeholder="540XXXXXXXX" class="w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div class="space-y-1">
                       <label class="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Contacto Telefónico</label>
                       <input type="text" id="regContacto" required placeholder="9XXXXXXXX" class="w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                </div>
                <div class="space-y-1">
                   <label class="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 text-blue-600">Dimensão/Tipo de Empresa</label>
                   <select id="regTipo" required class="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Selecione...</option>
                        <option value="Pequena">Pequena Empresa (Micro)</option>
                        <option value="Media">Média Empresa (PME)</option>
                        <option value="Grande">Grande Empresa / Grupo</option>
                   </select>
                </div>
                <div class="space-y-1">
                   <label class="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">E-mail do Administrador</label>
                   <input type="email" id="regEmail" required placeholder="ADMIN@EMPRESA.COM" class="w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div class="space-y-1">
                   <label class="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Definir Palavra-passe</label>
                   <input type="password" id="regPass" required placeholder="••••••••" class="w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <button type="submit" id="regSubmit" class="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl uppercase text-xs shadow-lg mt-2 hover:bg-emerald-700 transition-all">Ativar ERP Agora</button>
                <button type="button" onclick="window.showLogin()" class="w-full text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-2">Já tenho uma conta</button>
            </form>
        </div>
    </div>
    `);

    document.getElementById('regForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('regSubmit') as HTMLButtonElement;
        btn.disabled = true;
        btn.innerText = "A PROCESSAR...";

        const nome = (document.getElementById('regNome') as HTMLInputElement).value;
        const nif = (document.getElementById('regNif') as HTMLInputElement).value;
        const contacto = (document.getElementById('regContacto') as HTMLInputElement).value;
        const tipo = (document.getElementById('regTipo') as HTMLSelectElement).value;
        const email = (document.getElementById('regEmail') as HTMLInputElement).value;
        const pass = (document.getElementById('regPass') as HTMLInputElement).value;

        try {
            // 1. Inserir Empresa - GARANTINDO CAMPOS OBRIGATÓRIOS
            const { data: emp, error: errEmp } = await supabase
                .from('empresas')
                .insert([{ 
                    nome_empresa: nome, 
                    nif_empresa: nif, 
                    administrador: email, 
                    contacto: contacto, 
                    tipo_empresa: tipo, 
                    email: email, 
                    created_at: new Date()
                }])
                .select().single();

            if (errEmp) {
                if (errEmp.code === '23505') throw new Error("Este NIF já está registado no sistema.");
                throw errEmp;
            }

            // 2. Criar Utilizador associado
            const { error: errUser } = await supabase
                .from('usuarios')
                .insert([{ 
                    empresa_id: emp.id, 
                    email: email, 
                    password: pass, 
                    nome: 'Admin ' + nome,
                    role: 'admin'
                }]);

            if (errUser) {
                // Erro de e-mail duplicado
                if (errUser.code === '23505') {
                    throw new Error("Este e-mail já está em uso por outro administrador.");
                }
                throw errUser;
            }
            
            // 3. Envio de E-mail (Seguro)
            sendActivationEmail(email, nome, pass);

            alert("Sucesso! A sua plataforma multi-empresa foi ativada. Faça login para começar.");
            showLogin();
        } catch (err: any) { 
            alert("Erro no Registo: " + (err.message || "Ocorreu um erro inesperado. Verifique os dados."));
            btn.disabled = false;
            btn.innerText = "ATIVAR ERP AGORA";
        }
    });
};

// 5. DASHBOARD
const showDashboard = (user: any, empresa: any) => {
    const nomeExibicao = empresa.nome_empresa || "IMATEC ERP";
    
    render(`
    <div class="flex h-screen bg-slate-50 overflow-hidden">
        <aside class="w-64 bg-blue-900 text-white flex flex-col p-6 space-y-6 shrink-0 shadow-2xl">
            <div class="font-black text-xs tracking-widest uppercase border-b border-blue-800 pb-6 flex items-center space-x-2">
                <div class="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center text-[10px]">I</div>
                <span>IMATEC SOFTWARE</span>
            </div>
            <nav class="flex-1 space-y-2">
                <button onclick="window.navigate('home')" class="w-full text-left p-4 hover:bg-blue-800 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Visão Geral</button>
                <button onclick="window.navigate('rh')" class="w-full text-left p-4 hover:bg-blue-800 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Recursos Humanos</button>
            </nav>
            <div class="pt-6 border-t border-blue-800">
                <p class="text-[9px] font-black uppercase text-blue-400 mb-2 truncate">${nomeExibicao}</p>
                <button onclick="window.logout()" class="w-full p-4 bg-red-500/10 text-red-300 rounded-2xl text-[10px] font-black uppercase border border-red-500/20 hover:bg-red-500 hover:text-white transition-all">Terminar Sessão</button>
            </div>
        </aside>
        <div class="flex-1 flex flex-col overflow-hidden">
            <header class="h-20 bg-white border-b flex items-center justify-between px-10 shadow-sm shrink-0">
                <h2 class="text-[10px] font-black uppercase text-slate-400 tracking-widest">Painel Administrativo Cloud</h2>
                <div class="flex items-center space-x-4">
                    <div class="bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
                        <span class="text-[9px] font-black text-blue-600 uppercase tracking-widest">ORG: ${nomeExibicao}</span>
                    </div>
                </div>
            </header>
            <main id="mainContent" class="flex-1 p-10 overflow-y-auto">
                <!-- Conteúdo Dinâmico -->
            </main>
        </div>
    </div>
    `);

    (window as any).navigate = async (page: string) => {
        const content = document.getElementById('mainContent')!;
        if (page === 'home') {
            content.innerHTML = `
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-700">
                    <div class="bg-white p-10 rounded-[2.5rem] border shadow-sm">
                        <p class="text-[10px] font-black uppercase text-slate-400 mb-2">Detalhes da Empresa</p>
                        <h3 class="text-2xl font-black text-slate-800 uppercase">${nomeExibicao}</h3>
                        <p class="text-xs text-blue-600 mt-4 font-bold">NIF: ${empresa.nif_empresa}</p>
                        <p class="text-[10px] text-slate-400 font-bold uppercase mt-1">E-mail: ${empresa.email}</p>
                        <p class="text-[10px] text-slate-400 font-bold uppercase mt-1">Contacto: ${empresa.contacto}</p>
                        <p class="text-[10px] text-emerald-600 font-bold uppercase mt-4">Tipo: ${empresa.tipo_empresa}</p>
                    </div>
                    <div class="bg-blue-900 p-10 rounded-[2.5rem] text-white shadow-xl">
                        <p class="text-[10px] font-black uppercase opacity-60 mb-2 tracking-widest">Isolamento Cloud</p>
                        <p class="text-sm font-medium">Os seus dados estão seguros. Cada empresa possui o seu próprio identificador (UUID) na nossa base de dados.</p>
                        <p class="text-[10px] text-blue-300 mt-8 font-mono">ID: ${empresa.id}</p>
                    </div>
                </div>
            `;
        } else if (page === 'rh') {
            const { data } = await supabase.from('funcionarios').select('*').eq('empresa_id', empresa.id);
            content.innerHTML = `
                <div class="bg-white rounded-[2.5rem] border shadow-sm overflow-hidden animate-in fade-in duration-500">
                    <div class="p-8 border-b flex justify-between items-center">
                        <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quadro de Pessoal (Isolado)</h3>
                        <button class="bg-blue-600 text-white px-4 py-2 rounded-xl text-[9px] font-bold uppercase">Novo Colaborador</button>
                    </div>
                    <table class="w-full text-left text-xs">
                        <thead class="bg-gray-50 border-b">
                            <tr><th class="p-8 text-[10px] font-black uppercase text-slate-400">Trabalhador</th><th class="p-8 text-[10px] font-black uppercase text-slate-400 text-right">Vencimento</th></tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50">
                            ${data?.length ? data.map(f => `<tr><td class="p-8 font-black text-slate-800 uppercase">${f.nome}</td><td class="p-8 text-right font-black text-blue-600">${f.salario_base.toLocaleString()} Kz</td></tr>`).join('') : '<tr><td colspan="2" class="p-24 text-center font-bold text-gray-400 uppercase tracking-widest">Sem funcionários nesta empresa.</td></tr>'}
                        </tbody>
                    </table>
                </div>`;
        }
    };
    (window as any).navigate('home');
};

const initApp = () => {
    (window as any).showRegister = showRegister;
    (window as any).showLogin = showLogin;
    (window as any).logout = () => { localStorage.removeItem('imatec_session'); initApp(); };

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

initApp();
