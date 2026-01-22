
-- SCRIPT DE CONFIGURAÇÃO IMATEC SOFTWARE - MULTI-COMPANY
-- Execute este script no SQL Editor do seu projeto Supabase

-- 1. Extensões Necessárias
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Tabela de Empresas
CREATE TABLE IF NOT EXISTS empresas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome_empresa TEXT NOT NULL,
    nif_empresa TEXT NOT NULL UNIQUE,
    administrador TEXT NOT NULL, -- Email do gestor principal
    contacto TEXT NOT NULL,
    tipo_empresa TEXT NOT NULL DEFAULT 'Pequena',
    email TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabela de Utilizadores (Mapeia Username -> Email Auth)
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY, -- ID sincronizado com auth.users
    empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL, -- Cópia apenas para consulta de interface, o Auth gere a real
    nome TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT username_no_at CHECK (username NOT LIKE '%@%')
);

-- 4. Tabelas de Negócio (Exemplos de Isolamento)
CREATE TABLE IF NOT EXISTS funcionarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    cargo TEXT,
    salario_base DECIMAL(12,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Ativar Row Level Security (RLS)
ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE funcionarios ENABLE ROW LEVEL SECURITY;

-- Políticas de Isolamento (O utilizador só vê o que pertence à sua empresa)
CREATE POLICY "Empresas: Ver apenas a própria" ON empresas FOR SELECT USING (id IN (SELECT empresa_id FROM usuarios WHERE id = auth.uid()));
CREATE POLICY "Usuarios: Ver apenas da mesma empresa" ON usuarios FOR SELECT USING (empresa_id IN (SELECT empresa_id FROM usuarios WHERE id = auth.uid()));
CREATE POLICY "Funcionários: Isolamento total" ON funcionarios FOR ALL USING (empresa_id IN (SELECT empresa_id FROM usuarios WHERE id = auth.uid()));
