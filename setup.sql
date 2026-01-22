
-- SCRIPT DE CONFIGURAÇÃO IMATEC ERP - MULTI-COMPANY (CORRIGIDO)

-- 1. Extensão para UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Tabela de Empresas
CREATE TABLE IF NOT EXISTS empresas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome_empresa TEXT NOT NULL,
    nif_empresa TEXT NOT NULL UNIQUE,
    administrador TEXT NOT NULL, -- Email do gestor
    contacto TEXT NOT NULL,
    tipo_empresa TEXT NOT NULL DEFAULT 'Pequena',
    email TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabela de Utilizadores (Perfis vinculado ao Auth)
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Pode ser o mesmo ID do auth.users
    empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL, -- Mantido para compatibilidade, mas o Auth usa o dele
    nome TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabela de Funcionários (Exemplo isolado)
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

-- 5. Tabela de Faturação (Exemplo isolado)
CREATE TABLE IF NOT EXISTS faturacao (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
    numero TEXT NOT NULL,
    cliente TEXT NOT NULL,
    total DECIMAL(12,2) DEFAULT 0,
    estado TEXT DEFAULT 'Pago',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ativar RLS para segurança multi-empresa
ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE funcionarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE faturacao ENABLE ROW LEVEL SECURITY;

-- Exemplo de política: Utilizador só vê dados da sua empresa_id
-- CREATE POLICY "Isolamento por Empresa" ON funcionarios FOR ALL USING (empresa_id = (SELECT empresa_id FROM usuarios WHERE email = auth.jwt()->>'email'));
