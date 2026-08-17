-- SOBERANO CONTÁBIL — POSTGRESQL MULTI-TENANT DDL SCHEMA
-- Conformidade ACID, Row Level Security (RLS) e Índices Otimizados

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Tenants (Empresas Contábeis / Grupos Econômicos)
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    plan_tier VARCHAR(50) DEFAULT 'ENTERPRISE',
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Companies (Empresas Clientes / Filiais)
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    cnpj VARCHAR(14) NOT NULL,
    razao_social VARCHAR(255) NOT NULL,
    nome_fantasia VARCHAR(255),
    inscricao_estadual VARCHAR(30),
    inscricao_municipal VARCHAR(30),
    cnae_principal VARCHAR(10) NOT NULL,
    cnaes_secundarios JSONB DEFAULT '[]'::jsonb,
    regime_tributario VARCHAR(50) NOT NULL, -- 'SIMPLES_NACIONAL', 'LUCRO_PRESUMIDO', 'LUCRO_REAL_TRIMESTRAL', 'LUCRO_REAL_ANUAL'
    uf VARCHAR(2) NOT NULL,
    codigo_municipio_ibge VARCHAR(7) NOT NULL,
    aliquota_iss_municipal NUMERIC(5, 4) DEFAULT 0.0500,
    fator_r_elegivel BOOLEAN DEFAULT FALSE,
    optante_simples BOOLEAN DEFAULT FALSE,
    certificado_a1_encrypted BYTEA,
    certificado_a1_password_encrypted BYTEA,
    certificado_a1_valid_until TIMESTAMPTZ,
    configuracoes_fiscais JSONB DEFAULT '{}'::jsonb,
    version INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unq_tenant_company_cnpj UNIQUE (tenant_id, cnpj)
);

CREATE INDEX IF NOT EXISTS idx_companies_tenant ON companies(tenant_id);
CREATE INDEX IF NOT EXISTS idx_companies_cnpj ON companies(cnpj);
CREATE INDEX IF NOT EXISTS idx_companies_regime ON companies(regime_tributario);

-- 3. Users & RBAC
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'ACCOUNTANT', -- 'ADMIN', 'SENIOR_ACCOUNTANT', 'TAX_AUDITOR', 'PAYROLL_ANALYST', 'CLIENT_VIEWER'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unq_tenant_user_email UNIQUE (tenant_id, email)
);

-- 4. Chart of Accounts (Plano de Contas)
CREATE TABLE IF NOT EXISTS chart_of_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL, -- e.g. "1.1.01.01.001"
    short_code INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    nature VARCHAR(10) NOT NULL, -- 'DEBIT' / 'CREDIT'
    account_type VARCHAR(30) NOT NULL, -- 'ATIVO', 'PASSIVO', 'PATRIMONIO_LIQUIDO', 'RECEITA', 'CUSTO', 'DESPESA'
    level INT NOT NULL,
    is_analytical BOOLEAN NOT NULL DEFAULT TRUE,
    rfb_referential_code VARCHAR(50),
    current_balance NUMERIC(15, 2) DEFAULT 0.00,
    version INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unq_company_account_code UNIQUE (company_id, code)
);

CREATE INDEX IF NOT EXISTS idx_chart_tenant_company ON chart_of_accounts(tenant_id, company_id);
CREATE INDEX IF NOT EXISTS idx_chart_code ON chart_of_accounts(code);

-- 5. Journal Entries (Lançamentos em Partidas Dobradas)
CREATE TABLE IF NOT EXISTS journal_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    entry_number BIGINT NOT NULL,
    entry_date DATE NOT NULL,
    standard_history TEXT NOT NULL,
    total_debit NUMERIC(15, 2) NOT NULL,
    total_credit NUMERIC(15, 2) NOT NULL,
    origin_document_type VARCHAR(30), -- 'NFE', 'NFCE', 'CTE', 'NFSE', 'OFX', 'FOLHA', 'MANUAL'
    origin_document_key VARCHAR(100),
    transaction_hash VARCHAR(64) NOT NULL,
    previous_hash VARCHAR(64) NOT NULL,
    is_reconciled BOOLEAN DEFAULT FALSE,
    version INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unq_company_entry_number UNIQUE (company_id, entry_number)
);

CREATE INDEX IF NOT EXISTS idx_journal_company_date ON journal_entries(company_id, entry_date);
CREATE INDEX IF NOT EXISTS idx_journal_origin ON journal_entries(origin_document_type, origin_document_key);

-- 6. Journal Lines (Linhas de Partidas Dobradas)
CREATE TABLE IF NOT EXISTS journal_lines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    journal_entry_id UUID NOT NULL REFERENCES journal_entries(id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES chart_of_accounts(id),
    line_type VARCHAR(10) NOT NULL, -- 'DEBIT' / 'CREDIT'
    amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
    complementary_history TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_journal_lines_entry ON journal_lines(journal_entry_id);
CREATE INDEX IF NOT EXISTS idx_journal_lines_account ON journal_lines(account_id);

-- 7. Immutable Ledger Blocks (Append-Only Ledger com integridade SHA-256)
CREATE TABLE IF NOT EXISTS immutable_ledger_blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    block_sequence BIGINT NOT NULL,
    merkle_root_hash VARCHAR(64) NOT NULL,
    previous_block_hash VARCHAR(64) NOT NULL,
    block_hash VARCHAR(64) NOT NULL,
    entries_count INT NOT NULL,
    sealed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    digital_signature TEXT,
    CONSTRAINT unq_company_block_seq UNIQUE (company_id, block_sequence)
);

CREATE INDEX IF NOT EXISTS idx_ledger_blocks ON immutable_ledger_blocks(company_id, block_sequence);

-- 8. Audit Logs (Trilha Imutável de Rastreabilidade LGPD)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL, -- 'CREATE_ENTRY', 'TAX_CALCULATION', 'SPED_GENERATION', 'PAYROLL_CLOSE', 'CERTIFICATE_USE'
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(100) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    old_state JSONB,
    new_state JSONB,
    severity VARCHAR(20) DEFAULT 'INFO',
    logged_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_tenant_action ON audit_logs(tenant_id, action);
CREATE INDEX IF NOT EXISTS idx_audit_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_logged_at ON audit_logs(logged_at);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE chart_of_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_companies ON companies
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

CREATE POLICY tenant_isolation_chart ON chart_of_accounts
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

CREATE POLICY tenant_isolation_journal ON journal_entries
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);
