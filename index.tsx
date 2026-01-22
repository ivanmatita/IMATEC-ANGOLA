
import { renderLogin } from './js/auth.js';
import { renderDashboardLayout } from './js/dashboard.js';

/**
 * Função principal de verificação e roteamento
 */
export const checkAuthAndRender = () => {
    const app = document.getElementById('app');
    if (!app) return;

    // Recupera sessão multiempresa
    const sessionData = localStorage.getItem('imatec_session');
    
    if (sessionData) {
        try {
            const { user, empresa } = JSON.parse(sessionData);
            if (!user || !empresa) throw new Error("Sessão incompleta");
            
            console.log(`[IMATEC] Sessão ativa para empresa: ${empresa.nome}`);
            renderDashboardLayout(user, empresa);
        } catch (e) {
            console.error("[IMATEC] Erro na sessão, voltando ao login.", e);
            localStorage.removeItem('imatec_session');
            renderLogin();
        }
    } else {
        console.log("[IMATEC] Sem sessão. Renderizando Login.");
        renderLogin();
    }
};

// Inicializa o app assim que o script carregar
// O ambiente importará este arquivo automaticamente como módulo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkAuthAndRender);
} else {
    checkAuthAndRender();
}

// Expõe globalmente para transições SPA
(window as any).checkAuthAndRender = checkAuthAndRender;
