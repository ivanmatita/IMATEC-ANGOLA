
/**
 * IMATEC SOFTWARE - Entry Point (Vanilla Logic)
 */
import { renderLogin } from './js/auth.js';
import { renderDashboardLayout } from './js/dashboard.js';

/**
 * Função central de roteamento interno
 */
export const initApp = () => {
    console.log("[IMATEC] Motor inicializado.");

    const app = document.getElementById('app');
    if (!app) return;

    // Limpa o loader inicial
    app.innerHTML = '';

    // Tenta recuperar sessão existente
    const sessionData = localStorage.getItem('imatec_session');
    
    if (sessionData) {
        try {
            const { user, empresa } = JSON.parse(sessionData);
            console.log(`[IMATEC] Bem-vindo de volta: ${user.nome} (${empresa.nome})`);
            renderDashboardLayout(user, empresa);
        } catch (e) {
            console.error("[IMATEC] Erro ao carregar sessão:", e);
            localStorage.removeItem('imatec_session');
            renderLogin();
        }
    } else {
        console.log("[IMATEC] Nenhuma sessão encontrada. Abrindo Login.");
        renderLogin();
    }
};

// Inicializa quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Expõe globalmente para que outros módulos (como logout ou login) possam chamar se necessário
(window as any).initApp = initApp;
