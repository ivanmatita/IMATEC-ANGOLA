
/**
 * IMATEC SOFTWARE - Motor de Inicialização (EntryPoint)
 */
import { renderLogin } from './js/auth.js';
import { renderDashboardLayout } from './js/dashboard.js';

/**
 * Função principal de arranque
 */
const startApp = () => {
    console.log("[IMATEC] Motor inicializado.");

    // Garante que o container root #app existe
    let app = document.getElementById('app');
    if (!app) {
        console.warn("[IMATEC] Root #app não encontrado. Criando...");
        app = document.createElement('div');
        app.id = 'app';
        document.body.prepend(app);
    }

    // Limpa o loader inicial
    app.innerHTML = '';

    // Verifica sessão multi-empresa no LocalStorage
    const sessionData = localStorage.getItem('imatec_session');
    
    if (sessionData) {
        try {
            const { user, empresa } = JSON.parse(sessionData);
            if (!user || !empresa) throw new Error("Sessão corrompida");
            
            console.log(`[IMATEC] Sessão encontrada para: ${empresa.nome}`);
            renderDashboardLayout(user, empresa);
        } catch (err) {
            console.error("[IMATEC] Erro ao processar sessão:", err);
            localStorage.removeItem('imatec_session');
            renderLogin();
        }
    } else {
        console.log("[IMATEC] Nenhuma sessão ativa. Carregando portal de acesso.");
        renderLogin();
    }
};

// Garante execução após o DOM estar pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startApp);
} else {
    // Caso o script carregue após o DOMContentLoaded (async/defer)
    startApp();
}

// Captura de erros globais
window.onerror = function(msg, url, line) {
    console.error(`[IMATEC CRITICAL]: ${msg} em ${url}:${line}`);
    return false;
};
