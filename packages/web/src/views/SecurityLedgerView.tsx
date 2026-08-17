import React, { useState } from 'react';
import { SecurityEngine, AuditTrailManager, ImmutableLedgerChain, LgpdComplianceManager, PersonalDataRecord } from '@soberano/core';
import { ShieldCheck, Lock, Key, Database, RefreshCw, UserX, Eye, CheckCircle2, AlertTriangle, FileCode } from 'lucide-react';

export const SecurityLedgerView: React.FC = () => {
  const [security] = useState(() => new SecurityEngine());
  const [auditTrail] = useState(() => new AuditTrailManager(security));
  const [ledgerChain] = useState(() => {
    const chain = new ImmutableLedgerChain(security);
    chain.createGenesisBlock('tenant-01', 'comp-01');
    chain.sealBlock('tenant-01', 'comp-01', [
      {
        id: 'JE-101',
        tenantId: 'tenant-01',
        numeroLancamento: 1,
        data: '2026-01-02',
        historicoPadrao: 'Integralização de Capital Social Inicial',
        linhas: [],
        totalDebito: 150000,
        totalCredito: 150000,
        criadoEm: new Date(),
        hashTransacao: security.sha256('JE101_CONTENT')
      },
      {
        id: 'JE-102',
        tenantId: 'tenant-01',
        numeroLancamento: 2,
        data: '2026-01-05',
        historicoPadrao: 'Aquisição de Mercadorias para Revenda com Crédito Fiscal',
        linhas: [],
        totalDebito: 40000,
        totalCredito: 40000,
        criadoEm: new Date(),
        hashTransacao: security.sha256('JE102_CONTENT')
      }
    ]);
    return chain;
  });

  const [lgpdManager] = useState(() => new LgpdComplianceManager(security));

  const [colaborador, setColaborador] = useState<PersonalDataRecord>({
    id: 'COLAB-9876',
    nome: 'Carlos Eduardo Oliveira da Silva',
    cpf: '38849201844',
    email: 'carlos.eduardo@empresa.com.br',
    salario: 14500.00,
    dadosBancarios: {
      banco: '341 - Itaú Unibanco',
      agencia: '0450',
      conta: '98765-4'
    },
    consentimentoLgpdColetado: true,
    dataConsentimento: '2026-01-10T09:00:00Z'
  });

  const [exibirAnonimizado, setExibirAnonimizado] = useState(false);
  const [chainStatus, setChainStatus] = useState(() => ledgerChain.verifyChainIntegrity());

  const handleAuditChain = () => {
    const status = ledgerChain.verifyChainIntegrity();
    setChainStatus(status);
  };

  const maskedData = lgpdManager.maskForViewer(colaborador);

  return (
    <div>
      {/* Header Banner */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em' }}>
            Central de Segurança, LGPD & Append-Only Ledger
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Auditoria criptográfica contínua, governança de dados pessoais e integridade imutável da escrituração.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <span className="badge badge-emerald">
            <Lock size={14} /> AES-256-GCM Ativo
          </span>
          <span className="badge badge-cyan">
            <ShieldCheck size={14} /> SHA-256 Merkle Ledger
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid-cards-4">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Integridade do Ledger</span>
            <ShieldCheck size={20} color="var(--emerald-400)" />
          </div>
          <div className="metric-value" style={{ color: chainStatus.isValid ? 'var(--emerald-400)' : 'var(--rose-500)' }}>
            {chainStatus.isValid ? '100% ÍNTEGRO' : 'VIOLADO'}
          </div>
          <div className="metric-sub">
            Cadeia de blocos validada criptograficamente
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Blocos Selados</span>
            <Database size={20} color="var(--cyan-500)" />
          </div>
          <div className="metric-value font-mono">{ledgerChain.getBlocks().length} Blocos</div>
          <div className="metric-sub">
            Merkle Root por fechamento contábil
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Certificado Digital A1</span>
            <Key size={20} color="var(--indigo-500)" />
          </div>
          <div className="metric-value" style={{ fontSize: '1.25rem', color: 'var(--emerald-400)' }}>VÁLIDO (280 dias)</div>
          <div className="metric-sub">
            AC Certisign RFB G5 — Chave protegida
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Conformidade LGPD</span>
            <Lock size={20} color="var(--emerald-400)" />
          </div>
          <div className="metric-value" style={{ color: 'var(--emerald-400)' }}>ATIVADA</div>
          <div className="metric-sub">
            Mascaramento dinâmico em telas e relatórios
          </div>
        </div>
      </div>

      {/* Ledger Block Inspector */}
      <div className="panel-card">
        <div className="panel-title-bar">
          <h2><Database size={20} color="var(--emerald-500)" /> Inspetor Visual da Cadeia de Blocos do Ledger (Append-Only)</h2>
          <button className="btn-primary" onClick={handleAuditChain}>
            <RefreshCw size={15} /> Auditar Integridade Criptográfica
          </button>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Seq.</th>
                <th>Data/Hora Selagem</th>
                <th>Merkle Root Hash (SHA-256)</th>
                <th>Hash do Bloco Anterior</th>
                <th>Hash do Bloco Atual</th>
                <th>Lançamentos</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {ledgerChain.getBlocks().map(b => (
                <tr key={b.sequence}>
                  <td className="font-mono" style={{ fontWeight: 800 }}>#{b.sequence}</td>
                  <td className="font-mono">{b.timestamp.substring(0, 19).replace('T', ' ')}</td>
                  <td className="font-mono" style={{ color: 'var(--cyan-500)', fontSize: '0.78rem' }}>{b.merkleRootHash.substring(0, 20)}...</td>
                  <td className="font-mono" style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{b.previousBlockHash.substring(0, 20)}...</td>
                  <td className="font-mono" style={{ color: 'var(--emerald-400)', fontSize: '0.78rem' }}>{b.blockHash.substring(0, 20)}...</td>
                  <td className="font-mono" style={{ textAlign: 'center' }}>{b.entries.length} lancs</td>
                  <td><span className="badge badge-emerald">Selado</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* LGPD & Privacy Governance */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="panel-card">
          <div className="panel-title-bar">
            <h2><Lock size={18} color="var(--cyan-500)" /> Governança de Dados Pessoais (LGPD)</h2>
            <button
              className="btn-secondary"
              onClick={() => setExibirAnonimizado(!exibirAnonimizado)}
            >
              {exibirAnonimizado ? <Eye size={14} /> : <UserX size={14} />}
              {exibirAnonimizado ? 'Exibir Mascarado' : 'Simular Anonimização Permanente'}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Titular do Dado:</span>
              <span style={{ fontWeight: 700 }}>{exibirAnonimizado ? lgpdManager.anonymizePermanently(colaborador).nome : maskedData.nome}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>CPF (Mascaramento em Repouso):</span>
              <span className="font-mono" style={{ color: 'var(--emerald-400)' }}>{exibirAnonimizado ? '000.***.***-00' : maskedData.cpf}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>E-mail Corporativo:</span>
              <span className="font-mono">{exibirAnonimizado ? 'anonimizado@soberano.internal' : maskedData.email}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Remuneração Contratual:</span>
              <span className="font-mono" style={{ color: 'var(--amber-500)' }}>{maskedData.salario}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Conta Bancária Folha:</span>
              <span className="font-mono">{maskedData.dadosBancarios.banco} | Conta: {maskedData.dadosBancarios.conta}</span>
            </div>
          </div>
        </div>

        <div className="panel-card">
          <div className="panel-title-bar">
            <h2><Key size={18} color="var(--indigo-500)" /> Cofre Criptográfico de Certificados Digitais A1</h2>
            <span className="badge badge-emerald">Hardware Security Standard</span>
          </div>

          <div style={{ background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <CheckCircle2 size={20} color="var(--emerald-400)" />
              <span style={{ fontWeight: 700 }}>Certificado A1 Carregado & Operacional</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              A chave privada PKCS#12 (.pfx) é fragmentada e criptografada com chave de 256 bits derivada via PBKDF2 e armazenada em cofre protegido contra exportação direta.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.82rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Titular do Certificado:</span>
              <span className="font-mono">SOBERANO INDUSTRIA E TECNOLOGIA S/A:12345678000195</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Autoridade Certificadora:</span>
              <span>AC SOLUTI Multipla v5</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Assinaturas Automáticas:</span>
              <span style={{ color: 'var(--emerald-400)', fontWeight: 700 }}>NF-e, CT-e, MDF-e, ECD e eSocial</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
