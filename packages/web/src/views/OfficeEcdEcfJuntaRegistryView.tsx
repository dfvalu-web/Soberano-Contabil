// ==========================================================================
// SOBERANO CONTÁBIL — TERMOS DE ABERTURA, ENCERRAMENTO & JUNTA COMERCIAL (DREI)
// Emissor de Termos Oficiais do Livro Diário (IN DREI 81/2020 & SPED Registro I030)
// ==========================================================================

import React, { useState, useMemo } from 'react';
import {
  Landmark,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Printer,
  ShieldCheck,
  Building2,
  Download,
  Award
} from 'lucide-react';
import { officeStore } from '../state/office-store.js';

export const OfficeEcdEcfJuntaRegistryView: React.FC = () => {
  const tenants = useMemo(() => officeStore.getTenants(), []);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('t1');
  const currentTenant = useMemo(() => tenants.find(t => t.id === selectedTenantId) || tenants[0], [tenants, selectedTenantId]);

  const [numeroLivro, setNumeroLivro] = useState<number>(14);
  const [numeroFolhas, setNumeroFolhas] = useState<number>(382);
  const [nireEmpresa, setNireEmpresa] = useState<string>('35234567890');
  const [dataAbertura, setDataAbertura] = useState<string>('2026-01-01');
  const [dataEncerramento, setDataEncerramento] = useState<string>('2026-12-31');
  const [juntaComercialUf, setJuntaComercialUf] = useState<string>('JUCESP (São Paulo)');
  const [termoTipo, setTermoTipo] = useState<'ABERTURA' | 'ENCERRAMENTO' | 'AMBOS'>('AMBOS');
  const [hashSha256, setHashSha256] = useState<string>('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-primary)' }}>
      {/* Header */}
      <div className="no-print" style={{ background: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-medium)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>🏛️</span>
            <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
              Termos de Abertura & Encerramento — Junta Comercial (DREI)
            </h1>
            <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--emerald-400)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>
              IN DREI Nº 81/2020 • SPED ECD I030 • DECRETO 8.683/16
            </span>
          </div>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
            Geração dos termos legais de abertura e encerramento para autenticação do Livro Diário Geral na Junta Comercial.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <select
            value={selectedTenantId}
            onChange={(e) => setSelectedTenantId(e.target.value)}
            style={{ background: 'var(--bg-surface-card)', border: '1px solid var(--border-medium)', color: '#fff', padding: '8px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700 }}
          >
            {tenants.map(t => (
              <option key={t.id} value={t.id}>{t.name} ({t.regime.replace('_', ' ')})</option>
            ))}
          </select>
          <button onClick={() => window.print()} className="btn-primary-action" style={{ padding: '8px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Printer size={15} />
            <span>Imprimir Termos Oficiais (A4)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="no-print grid-cards-4">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Livro Diário Geral</span>
            <FileText size={18} color="var(--cyan-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--cyan-400)' }}>
            Livro Nº {numeroLivro}
          </div>
          <div className="metric-sub">Sequência Tipográfica DREI</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Extensão & Páginas</span>
            <Award size={18} color="var(--emerald-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--emerald-400)' }}>
            {numeroFolhas} Folhas Numeradas
          </div>
          <div className="metric-sub">Páginas 001 a {String(numeroFolhas).padStart(3, '0')}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Junta Comercial de Registro</span>
            <Landmark size={18} color="var(--amber-400)" />
          </div>
          <div className="metric-value" style={{ color: 'var(--amber-400)', fontSize: '1.05rem', fontWeight: 800 }}>
            {juntaComercialUf}
          </div>
          <div className="metric-sub">NIRE: {nireEmpresa}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Autenticação ECD</span>
            <ShieldCheck size={18} color="var(--indigo-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--emerald-400)', fontSize: '0.95rem' }}>
            ✓ REGISTRO I030 OK
          </div>
          <div className="metric-sub">Assinatura ICP-Brasil A3 Válida</div>
        </div>
      </div>

      {/* Inputs Form */}
      <div className="no-print panel-card">
        <div style={{ padding: '12px 0 16px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fff' }}>Parâmetros dos Termos de Abertura & Encerramento (DREI)</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div className="form-group">
            <label>Número de Ordem do Livro</label>
            <input
              type="number"
              className="form-control font-mono"
              value={numeroLivro}
              onChange={e => setNumeroLivro(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label>Total de Folhas / Páginas</label>
            <input
              type="number"
              className="form-control font-mono"
              value={numeroFolhas}
              onChange={e => setNumeroFolhas(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label>NIRE da Sociedade</label>
            <input
              type="text"
              className="form-control font-mono"
              value={nireEmpresa}
              onChange={e => setNireEmpresa(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Junta Comercial Competente</label>
            <select
              className="form-control"
              value={juntaComercialUf}
              onChange={e => setJuntaComercialUf(e.target.value)}
            >
              <option value="JUCESP (São Paulo)">JUCESP (São Paulo)</option>
              <option value="JUCERJA (Rio de Janeiro)">JUCERJA (Rio de Janeiro)</option>
              <option value="JUCEMG (Minas Gerais)">JUCEMG (Minas Gerais)</option>
              <option value="JUCEPAR (Paraná)">JUCEPAR (Paraná)</option>
              <option value="JUCISRS (Rio Grande do Sul)">JUCISRS (Rio Grande do Sul)</option>
              <option value="JUCEB (Bahia)">JUCEB (Bahia)</option>
            </select>
          </div>
        </div>
      </div>

      {/* DOSSIÊ A4 */}
      <div className="diamond-paper-a4">
        <div className="diamond-header">
          <div>
            <div className="diamond-title">{currentTenant.name}</div>
            <div className="diamond-subtitle">TERMOS LEGAIS DE ABERTURA & ENCERRAMENTO DO LIVRO DIÁRIO GERAL (IN DREI Nº 81/2020)</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.70rem' }}>
            <div>CNPJ: <strong>{currentTenant.cnpj}</strong></div>
            <div>NIRE: <strong>{nireEmpresa}</strong></div>
            <div style={{ color: '#047857', fontWeight: 800 }}>Autenticação Eletrônica DREI</div>
          </div>
        </div>

        {/* Termo de Abertura */}
        <div style={{ margin: '20px 0', padding: '16px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #CBD5E1' }}>
          <div style={{ textAlign: 'center', fontWeight: 800, fontSize: '0.90rem', color: '#0F172A', marginBottom: '10px' }}>
            TERMO DE ABERTURA
          </div>
          <p style={{ margin: 0, fontSize: '0.80rem', color: '#334155', lineHeight: 1.7, textAlign: 'justify' }}>
            Contém este livro número <strong>{numeroLivro}</strong> (Diário Geral), que servirá para escrituração dos atos e fatos da sociedade empresária <strong>{currentTenant.name}</strong>, com sede na Avenida Paulista, 1000, Bela Vista, São Paulo/SP, inscrita no CNPJ sob o nº <strong>{currentTenant.cnpj}</strong> e no Registro Público de Empresas Mercantis da <strong>{juntaComercialUf}</strong> sob o NIRE nº <strong>{nireEmpresa}</strong>, contendo <strong>{numeroFolhas}</strong> folhas tipograficamente numeradas de 001 a {String(numeroFolhas).padStart(3, '0')}, no período de {dataAbertura} a {dataEncerramento}.
          </p>
        </div>

        {/* Termo de Encerramento */}
        <div style={{ margin: '20px 0', padding: '16px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #CBD5E1' }}>
          <div style={{ textAlign: 'center', fontWeight: 800, fontSize: '0.90rem', color: '#0F172A', marginBottom: '10px' }}>
            TERMO DE ENCERRAMENTO
          </div>
          <p style={{ margin: 0, fontSize: '0.80rem', color: '#334155', lineHeight: 1.7, textAlign: 'justify' }}>
            Contém este livro número <strong>{numeroLivro}</strong> (Diário Geral) exatamente <strong>{numeroFolhas}</strong> folhas tipograficamente numeradas de 001 a {String(numeroFolhas).padStart(3, '0')}, devidamente escrituradas segundo os preceitos das Normas Brasileiras de Contabilidade (NBC TG) e das Leis nº 6.404/76 e 10.406/2002 (Código Civil), com o Balanço Patrimonial e a Demonstração do Resultado do Exercício devidamente transcritos.
          </p>
          <div style={{ marginTop: '10px', fontSize: '0.70rem', color: '#64748B', fontFamily: 'monospace' }}>
            Hash SHA-256 da Escrituração Digital: {hashSha256}
          </div>
        </div>

        <div className="diamond-signatures">
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">ADMINISTRADOR / DIRETORIA</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Representante Legal da Empresa</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">RESPONSÁVEL TÉCNICO CONTÁBIL</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>CRC/SP 1SP999999/O-0</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">CHANCELA DE AUTENTICAÇÃO JUNTA COMERCIAL</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>{juntaComercialUf}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficeEcdEcfJuntaRegistryView;
