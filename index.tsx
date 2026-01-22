
import { renderLogin } from './js/auth.js';
import { renderDashboardLayout } from './js/dashboard.js';

/**
 * Inicialização do Sistema IMATEC
 * Este motor decide entre a tela de login ou o dashboard baseado na sessão.
 */
export const initSystem = () => {
    const app = document.getElementById('app');
    if (!app) return;

    console.log("[IMATEC] Motor de arranque iniciado.");

    // Verifica sessão no localStorage
    const sessionData = localStorage.getItem('imatec_session');
    
    if (sessionData) {
        try {
            const { user, empresa } = JSON.parse(sessionData);
            if (!user || !empresa) throw new Error("Dados de sessão corrompidos");
            
            console.log(`[IMATEC] Sessão ativa: ${user.nome} @ ${empresa.nome}`);
            // Renderiza o Dashboard diretamente
            renderDashboardLayout(user, empresa);
        } catch (e) {
            console.error("[IMATEC] Falha na sessão:", e);
            localStorage.removeItem('imatec_session');
            renderLogin();
        }
    } else {
        console.log("[IMATEC] Sem sessão detectada. Redirecionando para Login.");
        renderLogin();
    }
};

// Evento de carregamento do DOM para evitar tela branca
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSystem);
} else {
    initSystem();
}

// Expõe para o escopo global para permitir navegação programática
(window as any).initIMATEC = initSystem;
