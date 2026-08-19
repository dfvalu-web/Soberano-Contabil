// ==========================================================================
// SOBERANO CONTÁBIL — PARECER DE AUDITORIA INDEPENDENTE (NBC TA 700 / 705)
// Relatório dos Auditores Independentes sobre as Demonstrações Contábeis
// ==========================================================================

import React, { useState, useMemo } from 'react';
import {
  FileCheck2,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Printer,
  Building2,
  Award,
  Zap,
  HelpCircle
} from 'lucide-react';
import { officeStore } from '../state/office-store.js';

export type AuditOpinionType = 'SEM_RESSALVAS' | 'COM_RESSALVAS' | 'ADVERSA' | 'ABSTENCAO';

export const OfficeAnnualDossierAuditOpinionView: React.FC = () => {
  const tenants = useMemo(() => officeStore.getTenants(), []);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('t1');
  const currentTenant = useMemo(() => tenants.find(t => t.id === selectedTenantId) || tenants[0], [tenants, selectedTenantId]);

  const [exercicio, setExercicio] = useState<string>('Exercício 2026');
  const [tipoParecer, setTipoParecer] = useState<AuditOpinionType>('SEM_RESSALVAS');
  const [auditorFirma, setAuditorFirma] = useState<string>('Soberano Auditores Independentes S/S');
  const [auditorResponsavel, setAuditorResponsavel] = useState<string>('Dr. Carlos Eduardo Mendonça (CNAI 1234)');
  const [paaTexto, setPaaTexto] = useState<string>('Os Principais Assuntos de Auditoria (PAA) abrangeram o teste de recuperabilidade de ativos (Impairment CPC 01), a mensuração a valor justo de instrumentos financeiros derivativos e a integridade do corte de receitas.');

  const getOpinionTitle = () => {
    switch (tipoParecer) {
      case 'SEM_RESSALVAS': return 'OPINIÃO SEM RESSALVAS (LIMPA)';
      case 'COM_RESSALVAS': return 'OPINIÃO COM RESSALVAS';
      case 'ADVERSA': return 'OPINIÃO ADVERSA';
      case 'ABSTENCAO': return 'ABSTENÇÃO DE OPINIÃO';
    }
  };

  const getOpinionColor = () => {
    switch (tipoParecer) {
      case 'SEM_RESSALVAS': return 'var(--emerald-400)';
      case 'COM_RESSALVAS': return 'var(--amber-400)';
      case 'ADVERSA': return '#F87171';
      case 'ABSTENCAO': return '#F87171';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-primary)' }}>
      {/* Header */}
      <div className="no-print" style={{ background: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-medium)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>📑</span>
            <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
              Relatório & Parecer dos Auditores Independentes (NBC TA 700 / 705)
            </h1>
            <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--emerald-400)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>
              NBC TA 700 • NBC TA 701 (PAA) • IFRS / CFC
            </span>
          </div>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
            Emissão formal do Parecer de Auditoria das Demonstrações Contábeis com classificação de opinião e Principais Assuntos de Auditoria.
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
            <span>Imprimir Parecer Oficial (A4)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="no-print grid-cards-4">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Veredito da Auditoria</span>
            <Award size={18} color={getOpinionColor()} />
          </div>
          <div className="metric-value" style={{ color: getOpinionColor(), fontSize: '1.05rem', fontWeight: 800 }}>
            {getOpinionTitle()}
          </div>
          <div className="metric-sub">NBC TA 700 / ISA 700</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Firma de Auditoria Externa</span>
            <Building2 size={18} color="var(--cyan-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: '#fff', fontSize: '0.90rem' }}>
            {auditorFirma}
          </div>
          <div className="metric-sub">Registro CVM & CFC</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Auditor Líder Responsável</span>
            <ShieldCheck size={18} color="var(--indigo-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: '#fff', fontSize: '0.85rem' }}>
            {auditorResponsavel}
          </div>
          <div className="metric-sub">Cadastro Nacional de Auditores (CNAI)</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Conformidade IFRS / NBC TG</span>
            <CheckCircle2 size={18} color="var(--emerald-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--emerald-400)' }}>
            100% REGULAR
          </div>
          <div className="metric-sub">Balanço, DRE, DFC, DMPL e DVA</div>
        </div>
      </div>

      {/* Selector & Form */}
      <div className="no-print panel-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fff' }}>Classificação do Parecer & Principais Assuntos de Auditoria</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setTipoParecer('SEM_RESSALVAS')}
              className={`btn-${tipoParecer === 'SEM_RESSALVAS' ? 'primary' : 'secondary'}`}
              style={{ padding: '6px 12px', fontSize: '0.78rem' }}
            >
              Sem Ressalvas (Limpo)
            </button>
            <button
              onClick={() => setTipoParecer('COM_RESSALVAS')}
              className={`btn-${tipoParecer === 'COM_RESSALVAS' ? 'primary' : 'secondary'}`}
              style={{ padding: '6px 12px', fontSize: '0.78rem' }}
            >
              Com Ressalvas
            </button>
            <button
              onClick={() => setTipoParecer('ADVERSA')}
              className={`btn-${tipoParecer === 'ADVERSA' ? 'primary' : 'secondary'}`}
              style={{ padding: '6px 12px', fontSize: '0.78rem' }}
            >
              Opinião Adversa
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Principais Assuntos de Auditoria (PAA / KAM - NBC TA 701)</label>
          <textarea
            className="form-control"
            rows={3}
            value={paaTexto}
            onChange={e => setPaaTexto(e.target.value)}
          />
        </div>
      </div>

      {/* DOSSIÊ A4 */}
      <div className="diamond-paper-a4">
        <div className="diamond-header">
          <div>
            <div className="diamond-title">{currentTenant.name}</div>
            <div className="diamond-subtitle">RELATÓRIO DO AUDITOR INDEPENDENTE SOBRE AS DEMONSTRAÇÕES CONTÁBEIS</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.70rem' }}>
            <div>CNPJ AUDITADO: <strong>{currentTenant.cnpj}</strong></div>
            <div>EXERCÍCIO: <strong>{exercicio}</strong></div>
            <div style={{ color: '#047857', fontWeight: 800 }}>Normas NBC TA / ISA</div>
          </div>
        </div>

        <div style={{ margin: '16px 0', padding: '14px', background: '#F8FAFC', borderRadius: '8px', borderLeft: '4px solid #059669' }}>
          <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0F172A', marginBottom: '6px' }}>
            {getOpinionTitle()}
          </div>
          <p style={{ margin: 0, fontSize: '0.78rem', color: '#334155', lineHeight: 1.6, textAlign: 'justify' }}>
            Examinamos as demonstrações contábeis da <strong>{currentTenant.name}</strong>, que compreendem o Balanço Patrimonial em 31 de dezembro de 2026 e as respectivas Demonstrações do Resultado (DRE), do Resultado Abrangente (DRA), das Mutações do Patrimônio Líquido (DMPL) e dos Fluxos de Caixa (DFC) para o exercício findo nessa data, bem como as correspondentes notas explicativas.
          </p>
          <p style={{ margin: '8px 0 0', fontSize: '0.78rem', color: '#334155', lineHeight: 1.6, textAlign: 'justify' }}>
            Em nossa opinião, as demonstrações contábeis acima referidas apresentam adequadamente, em todos os aspectos relevantes, a posição patrimonial e financeira da entidade em 31 de dezembro de 2026, de acordo com as práticas contábeis adotadas no Brasil (NBC TG / CPCs) e com as normas internacionais IFRS.
          </p>
        </div>

        <div style={{ margin: '16px 0', padding: '14px', background: '#F8FAFC', borderRadius: '8px', borderLeft: '4px solid #0284C7' }}>
          <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0F172A', marginBottom: '6px' }}>
            PRINCIPAIS ASSUNTOS DE AUDITORIA (PAA - NBC TA 701)
          </div>
          <p style={{ margin: 0, fontSize: '0.78rem', color: '#334155', lineHeight: 1.6, textAlign: 'justify' }}>
            {paaTexto}
          </p>
        </div>

        <div className="diamond-signatures">
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">{auditorFirma}</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Firma de Auditoria Independente</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">{auditorResponsavel}</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Auditor Líder Certificado (CNAI)</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">COMITÊ DE AUDITORIA & CONSELHO</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Recebimento e Homologação</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficeAnnualDossierAuditOpinionView;
