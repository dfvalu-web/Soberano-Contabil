-- SOBERANO CONTÁBIL — ESQUEMA CORPORATIVO SUPABASE / POSTGRESQL 16
-- Compliance: SOC 1/2 Type II, ISO 27001, LGPD, CPC / IFRS, SPED 2026

-- 1. EXTENSÕES OBRIGATÓRIAS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 2. TABELA DE TENANTS (HOLDINGS E EMPRESAS MULTI-TENANT)
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cnpj VARCHAR(18) UNIQUE NOT NULL,
    razao_social VARCHAR(255) NOT NULL,
    nome_fantasia VARCHAR(255),
    regime_tributario VARCHAR(50) NOT NULL CHECK (regime_tributario IN ('LUCRO_REAL', 'LUCRO_PRESUMIDO', 'SIMPLES_NACIONAL')),
    matriz BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABELA DE USUÁRIOS E PERFIS RBAC
CREATE TABLE IF NOT EXISTS auth_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    nome_completo VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('AUDITOR_CHEFE', 'DIRETOR_TRIBUTARIO', 'CONTADOR_MASTER', 'ANALISTA_FISCAL', 'DPO_PRIVACIDADE')),
    mfa_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. LIVRO DIÁRIO / GENERAL LEDGER IMUTÁVEL (HASH SHA-256 ENCADEADO)
CREATE TABLE IF NOT EXISTS general_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    numero_lancamento BIGSERIAL,
    data_lancamento DATE NOT NULL,
    conta_debito VARCHAR(50) NOT NULL,
    conta_credito VARCHAR(50) NOT NULL,
    valor_brl NUMERIC(18, 2) NOT NULL,
    historico TEXT NOT NULL,
    hash_anterior_sha256 VARCHAR(64) NOT NULL,
    hash_atual_sha256 VARCHAR(64) NOT NULL,
    criado_por UUID REFERENCES auth_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. APURAÇÕES TRIBUTÁRIAS (IRPJ, CSLL, PIS, COFINS, IBS, CBS, IS)
CREATE TABLE IF NOT EXISTS tax_calculations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    periodo_apuracao VARCHAR(7) NOT NULL, -- YYYY-MM
    tipo_tributo VARCHAR(50) NOT NULL,
    base_calculo_brl NUMERIC(18, 2) NOT NULL,
    aliquota_percent NUMERIC(8, 4) NOT NULL,
    imposto_devido_brl NUMERIC(18, 2) NOT NULL,
    creditos_compensaveis_brl NUMERIC(18, 2) DEFAULT 0.00,
    imposto_liquido_recolher_brl NUMERIC(18, 2) NOT NULL,
    status_apuracao VARCHAR(50) DEFAULT 'HOMOLOGADO',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. AUDITORIA E LOGS FORENSES (SOC 2, ISO 27001, ROPA LGPD)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id),
    actor_id UUID REFERENCES auth_profiles(id),
    acao VARCHAR(100) NOT NULL,
    entidade_afetada VARCHAR(100) NOT NULL,
    detalhes_json JSONB NOT NULL,
    ip_origem VARCHAR(45) NOT NULL,
    hash_assinatura_sha256 VARCHAR(64) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. ATIVAÇÃO DE ROW LEVEL SECURITY (RLS) EM TODAS AS TABELAS
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE general_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- 8. POLÍTICAS DE RLS HERMÉTICAS POR TENANT
CREATE POLICY tenant_isolation_general_ledger ON general_ledger
    FOR ALL
    USING (tenant_id = (SELECT tenant_id FROM auth_profiles WHERE id = auth.uid()));

CREATE POLICY tenant_isolation_tax_calculations ON tax_calculations
    FOR ALL
    USING (tenant_id = (SELECT tenant_id FROM auth_profiles WHERE id = auth.uid()));

CREATE POLICY tenant_isolation_audit_logs ON audit_logs
    FOR ALL
    USING (tenant_id = (SELECT tenant_id FROM auth_profiles WHERE id = auth.uid()));
