
import { renderDashboardLayout } from './dashboard.js';

export function renderLogin() {
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = `
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

                <button type="submit" id="loginBtn" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center space-x-2">
                    <span id="btnText" class="uppercase text-xs tracking-widest">Entrar no Sistema</span>
                    <div id="btnLoader" class="hidden w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                </button>

                <p class="text-center text-[10px] text-gray-400 mt-6 font-black uppercase tracking-widest">
                    Nova empresa? <button type="button" class="text-blue-600 hover:underline">Registar Agora</button>
                </p>
            </form>
        </div>
    </div>
    `;

    document.getElementById('loginForm').onsubmit = (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const btnText = document.getElementById('btnText');
        const btnLoader = document.getElementById('btnLoader');
        
        btnText.classList.add('hidden');
        btnLoader.classList.remove('hidden');

        // Simulação de autenticação com dados de empresa isolados
        setTimeout(() => {
            const mockEmpresa = { 
                id: email.includes('imatec') ? 'emp-001' : 'emp-002', 
                nome: email.includes('imatec') ? 'IMATEC SOFTWARE' : 'CLIENTE GENÉRICO, LDA', 
                nif: '5409876543' 
            };
            const mockUser = { id: 'usr-1', nome: 'Gestor ERP', email };

            localStorage.setItem('imatec_session', JSON.stringify({ user: mockUser, empresa: mockEmpresa }));

            // TRANSIÇÃO IMEDIATA (Fix para GitHub Pages)
            renderDashboardLayout(mockUser, mockEmpresa);
        }, 800);
    };
}
