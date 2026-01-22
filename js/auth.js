
import { renderDashboardLayout } from './dashboard.js';

/**
 * Renderiza a interface de autenticação
 */
export function renderLogin() {
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = `
    <div class="min-h-screen flex items-center justify-center p-4 bg-slate-100 animate-in fade-in duration-500">
        <div class="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
            <div class="bg-blue-900 p-12 text-center relative overflow-hidden">
                <div class="relative z-10">
                    <div class="w-16 h-16 bg-blue-500 rounded-2xl mx-auto flex items-center justify-center text-white font-bold text-3xl mb-4 shadow-xl">I</div>
                    <h1 class="text-2xl font-bold text-white font-lato uppercase tracking-tight">IMATEC SOFTWARE</h1>
                    <p class="text-blue-300 text-[10px] mt-2 font-black uppercase tracking-[0.2em]">Multi-Company Cloud ERP</p>
                </div>
                <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-800 rounded-full opacity-20"></div>
            </div>

            <form id="loginForm" class="p-10 space-y-6">
                <div id="loginError" class="hidden p-4 bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-bold rounded-2xl mb-4 uppercase text-center"></div>
                
                <div class="space-y-1.5">
                    <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Utilizador Administrativo</label>
                    <input type="email" id="email" required class="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" placeholder="ex: admin@imatec.co.ao">
                </div>

                <div class="space-y-1.5">
                    <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Palavra-passe</label>
                    <input type="password" id="password" required class="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" placeholder="••••••••">
                </div>

                <button type="submit" id="loginBtn" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center space-x-2 group">
                    <span id="btnText" class="uppercase text-xs tracking-widest">Iniciar Sessão ERP</span>
                    <div id="btnLoader" class="hidden w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                </button>

                <div class="text-center pt-4">
                    <p class="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                        Não tem licença? <button type="button" class="text-blue-600 hover:underline">Registar Empresa</button>
                    </p>
                </div>
            </form>
        </div>
    </div>
    `;

    const form = document.getElementById('loginForm');
    if (form) {
        form.onsubmit = async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const btnText = document.getElementById('btnText');
            const btnLoader = document.getElementById('btnLoader');
            
            btnText.classList.add('hidden');
            btnLoader.classList.remove('hidden');

            // Simulação de login Multi-Empresa
            // Em produção, isso seria uma chamada ao Supabase buscando a empresa vinculada ao e-mail
            setTimeout(() => {
                const mockEmpresa = { 
                    id: 'emp-imatec-001', 
                    nome: 'IMATEC SOFTWARE, LDA', 
                    nif: '5409876543',
                    logo: 'https://imatec.co.ao/logo.png'
                };
                const mockUser = { 
                    id: 'usr-001', 
                    nome: 'Gestor Principal', 
                    email: email, 
                    role: 'admin' 
                };
                
                console.log("[IMATEC] Login OK. Gravando sessão multi-empresa...");
                
                // 1. Salva a sessão no localStorage
                localStorage.setItem('imatec_session', JSON.stringify({ user: mockUser, empresa: mockEmpresa }));
                
                // 2. Transição Instantânea sem reload (Fix para GitHub Pages)
                renderDashboardLayout(mockUser, mockEmpresa);
                
            }, 800);
        };
    }
}
