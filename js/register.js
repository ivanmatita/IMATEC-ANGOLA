let app = document.getElementById('app');
if (!app) {
    app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
}

export function renderRegisterPage() {
    app.innerHTML = `
        <div style="min-height:100vh; display:flex; align-items:center; justify-content:center; font-family:sans-serif;">
            <form style="background:white; padding:20px; border-radius:12px; width:300px;">
                <h1>Registo de Empresa</h1>
                <input type="text" placeholder="Nome da Empresa" id="reg_nome" required>
                <input type="text" placeholder="NIF" id="reg_nif" required>
                <input type="email" placeholder="Email Admin" id="reg_email" required>
                <input type="password" placeholder="Senha" id="reg_password" required>
                <button type="submit">Criar Empresa</button>
            </form>
        </div>
    `;
}
