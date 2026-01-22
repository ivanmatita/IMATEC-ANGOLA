
import { renderLogin } from './js/auth.js';
import { renderDashboardLayout } from './js/dashboard.js';

/**
 * Motor de Arranque do Sistema
 */
export const startApp = () => {
    console.log("[IMATEC] Verificando integridade da sessão...");
    
    const app = document.getElementById('app');
    if (!app) return;

    // Limpa o loader inicial do HTML
    app.innerHTML = '';

    const sessionData = localStorage.getItem('imatec_session');
    
    if (sessionData) {
        try {
            const { user, empresa } = JSON.parse(sessionData);
            console.log(`[IMATEC] Empresa Ativa: ${empresa.nome}`);
            renderDashboardLayout(user, empresa);
        } catch (err) {
            console.error("[IMATEC] Erro ao processar sessão:", err);
            localStorage.removeItem('imatec_session');
            renderLogin();
        }
    } else {
        console.log("[IMATEC] Nenhuma sessão encontrada. Abrindo Login.");
        renderLogin();
    }
};

// Inicialização imediata
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startApp);
} else {
    startApp();
}

// Expõe globalmente para transições entre módulos
(window as any).startIMATEC = startApp;
