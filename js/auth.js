
import { client } from './supabase.js';
import { renderDashboardLayout } from './dashboard.js';

/**
 * Renderiza o portal de acesso (Login)
 */
export function renderLogin() {
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = `
    <div class="min-h-screen flex items-center justify-center p-4 bg-slate-100 animate-in fade-in duration-500">
        <div class="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
            <div class="bg-blue-900 p-8 text-center">
                <div class="w-16 h-16 bg-blue-500 rounded-2xl mx-auto flex items-center justify-center text-white font-bold text-3xl mb-4 shadow-lg">I</div>
                <h1 class="text-2xl font-bold text-white font-lato uppercase tracking-tight">IMATEC SOFTWARE</h1>
                <p class="text-blue-300 text-sm mt-1">Multi-Company Cloud ERP</p>
            </div>

            <form id="loginForm" class="p-8 space-y-6">
                <div id="loginError" class="hidden p-3 bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-bold rounded-lg mb-4 uppercase text-center"></div>
                
                <div class="space-y-1">
                    <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Administrativo</label>
                    <input type="email" id="email" required class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="admin@imatec.co.ao">
                </div>

                <div class="space-y-1">
                    <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Palavra-passe</label>
                    <input type="password" id="password" required class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="••••••••">
                </div>

                <button type="submit" id="loginBtn" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition-all flex items-center justify-center space-x-2">
                    <span id="btnText">Entrar no ERP</span>
                    <div id="btnLoader" class="hidden w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                </button>

                <p class="text-center text-xs text-gray-500 mt-6">
                    Ainda não tem acesso? <button type="button" class="text-blue-600 font-bold hover:underline">Registar Empresa</button>
                </p>
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
            const errorDiv = document.getElementById('loginError');
            
            errorDiv.classList.add('hidden');
            btnText.classList.add('hidden');
            btnLoader.classList.remove('hidden');

            // Simulação de autenticação multi-empresa
            setTimeout(() => {
                const mockEmpresa = { 
                    id: 'emp-imatec-001', 
                    nome: 'IMATEC SOFTWARE, LDA', 
                    nif: '5409876543' 
                };
                const mockUser = { 
                    id: 'usr-001', 
                    nome: 'Gestor Principal', 
                    email: email, 
                    role: 'admin' 
                };
                
                console.log("[IMATEC] Login bem-sucedido. Salvando sessão e renderizando...");
                
                // 1. Persistência
                localStorage.setItem('imatec_session', JSON.stringify({ user: mockUser, empresa: mockEmpresa }));
                
                // 2. Transição Imediata (SEM RECARREGAR A PÁGINA)
                renderDashboardLayout(mockUser, mockEmpresa);
                
            }, 800);
        };
    }
}
