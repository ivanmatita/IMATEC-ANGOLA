
-- SCRIPT DE CONFIGURAÇÃO IMATEC ERP - MULTI-COMPANY

-- 1. Tabela de Empresas
CREATE TABLE IF NOT EXISTS empresas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome_empresa TEXT NOT NULL,
    nif_empresa TEXT NOT NULL UNIQUE,
    administrador TEXT NOT NULL, -- Email do gestor mestre
    contacto TEXT NOT NULL,
    tipo_empresa TEXT NOT NULL,
    email TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabela de Utilizadores (Administradores/Operadores)
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    nome TEXT NOT NULL,
    role TEXT DEFAULT 'admin', -- admin, operador, contabilista
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabela de Funcionários (Exemplo de módulo RH isolado)
CREATE TABLE IF NOT EXISTS funcionarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    cargo TEXT,
    salario_base DECIMAL(12,2) DEFAULT 0,
    contacto TEXT,
    estado TEXT DEFAULT 'Ativo',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabela de Faturação (Exemplo de módulo de Vendas isolado)
CREATE TABLE IF NOT EXISTS faturacao (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
    numero TEXT NOT NULL,
    cliente TEXT NOT NULL,
    nif_cliente TEXT,
    total DECIMAL(12,2) DEFAULT 0,
    estado TEXT DEFAULT 'Pago',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- DICA DE SEGURANÇA (Opcional): Habilitar RLS no Supabase
-- ALTER TABLE funcionarios ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Acesso Isolado por Empresa" ON funcionarios
-- FOR ALL USING (empresa_id = (SELECT empresa_id FROM usuarios WHERE id = auth.uid()));
