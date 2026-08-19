// ==========================================================================
// SOBERANO CONTÁBIL — PARECER DE AUDITORIA INDEPENDENTE (NBC TA 700 / 705)
// Relatório dos Auditores Independentes sobre as Demonstrações Contábeis (DIAMANTE 10/10)
// ==========================================================================

import React, { useState, useMemo } from 'react';
import {
  FileCheck2,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Printer,
  Building2,
  Award,
  Zap,
  HelpCircle,
  FileText,
  Scale
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
  const [auditorResponsavel, setAuditorResponsavel] = useState<string>('Dr. Carlos Eduardo Mendonça (CNAI 1234 / CRC-SP 1SP888888)');
  const [ressalvaTexto, setRessalvaTexto] = useState<string>('Conforme descrito na Nota Explicativa 14, os estoques não puderam ser contados fisicamente no encerramento do exercício de 2025, impossibilitando a confirmação das quantidades iniciais.');
  const [paaTexto, setPaaTexto] = useState<string>('Os Principais Assuntos de Auditoria (PAA) abrangeram o teste de recuperabilidade de ativos intangíveis e ágio (Impairment CPC 01), a mensuração a valor justo de instrumentos derivativos e a integridade das receitas pelo método POC (CPC 47).');
  const [materialidadeGlobal, setMaterialidadeGlobal] = useState<number>(450000.00);

  const getOpinionTitle = () => {
    switch (tipoParecer) {
      case 'SEM_RESSALVAS': return 'OPINIÃO SEM RESSALVAS (LIMPA)';
      case 'COM_RESSALVAS': return 'OPINIÃO COM RESSALVAS (EXCETO POR)';
      case 'ADVERSA': return 'OPINIÃO ADVERSA';
      case 'ABSTENCAO': return 'ABSTENÇÃO DE OPINIÃO';
    }
  };

  const getOpinionColor = () => {
    switch (tipoParecer) {
      case 'SEM_RESSALVAS': return 'var(--emerald-400)';
      case 'COM_RESSALVAS': return 'var(--amber-400)';
      case 'ADVERSA': return '#F87171';
      case 'ABSTENCAO': return '#C084FC';
    }
  };

  const getOpinionBadgeText = () => {
    switch (tipoParecer) {
      case 'SEM_RESSALVAS': return 'NBC TA 700 • CONFORME';
      case 'COM_RESSALVAS': return 'NBC TA 705 • RESSALVADO';
      case 'ADVERSA': return 'NBC TA 705 • DISTORÇÃO GRAVE';
      case 'ABSTENCAO': return 'NBC TA 705 • LIMITAÇÃO ESCOPO';
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
            Emissão formal do Parecer de Auditoria das Demonstrações Contábeis com classificação de opinião, materialidade e Principais Assuntos de Auditoria.
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
          <div className="metric-sub">{getOpinionBadgeText()}</div>
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
          <div className="metric-value font-mono" style={{ color: '#fff', fontSize: '0.82rem' }}>
            {auditorResponsavel}
          </div>
          <div className="metric-sub">Cadastro Nacional de Auditores (CNAI)</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Matriz de Materialidade Global</span>
            <Scale size={18} color="var(--emerald-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--emerald-400)' }}>
            R$ {materialidadeGlobal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="metric-sub">1,5% do Ativo Total / Receita Líquida</div>
        </div>
      </div>

      {/* Seletor Segmentado de Alto Contraste Diamante */}
      <div className="no-print panel-card">
        <div style={{ padding: '10px 0 14px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fff' }}>Classificação do Tipo de Opinião de Auditoria (NBC TA 700 / 705 / ISA 700)</span>
          <span className="badge badge-emerald">Seletor Normativo Ativo</span>
        </div>

        {/* Grade de 4 Opções de Parecer */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '16px' }}>
          {/* 1. Sem Ressalvas */}
          <button
            type="button"
            onClick={() => setTipoParecer('SEM_RESSALVAS')}
            style={{
              padding: '12px 16px',
              borderRadius: '10px',
              fontSize: '0.85rem',
              fontWeight: tipoParecer === 'SEM_RESSALVAS' ? 800 : 600,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              background: tipoParecer === 'SEM_RESSALVAS' 
                ? 'linear-gradient(135deg, #059669 0%, #047857 100%)' 
                : 'rgba(15, 23, 42, 0.65)',
              color: tipoParecer === 'SEM_RESSALVAS' ? '#ffffff' : 'var(--text-secondary, #94A3B8)',
              border: tipoParecer === 'SEM_RESSALVAS' 
                ? '2px solid #34D399' 
                : '1.5px solid var(--border-medium, rgba(255, 255, 255, 0.12))',
              boxShadow: tipoParecer === 'SEM_RESSALVAS' 
                ? '0 6px 20px -2px rgba(5, 150, 105, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.2)' 
                : 'none',
              transform: tipoParecer === 'SEM_RESSALVAS' ? 'translateY(-1px)' : 'none'
            }}
          >
            <CheckCircle2 size={18} color={tipoParecer === 'SEM_RESSALVAS' ? '#ffffff' : '#34D399'} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ lineHeight: 1.2 }}>Sem Ressalvas</div>
              <div style={{ fontSize: '0.68rem', opacity: tipoParecer === 'SEM_RESSALVAS' ? 0.95 : 0.7 }}>Opinião Limpa (NBC TA 700)</div>
            </div>
            {tipoParecer === 'SEM_RESSALVAS' && (
              <span style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.25)', borderRadius: '999px', padding: '2px 8px', fontSize: '0.65rem', fontWeight: 900, color: '#fff' }}>ATIVO</span>
            )}
          </button>

          {/* 2. Com Ressalvas */}
          <button
            type="button"
            onClick={() => setTipoParecer('COM_RESSALVAS')}
            style={{
              padding: '12px 16px',
              borderRadius: '10px',
              fontSize: '0.85rem',
              fontWeight: tipoParecer === 'COM_RESSALVAS' ? 800 : 600,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              background: tipoParecer === 'COM_RESSALVAS' 
                ? 'linear-gradient(135deg, #D97706 0%, #B45309 100%)' 
                : 'rgba(15, 23, 42, 0.65)',
              color: tipoParecer === 'COM_RESSALVAS' ? '#ffffff' : 'var(--text-secondary, #94A3B8)',
              border: tipoParecer === 'COM_RESSALVAS' 
                ? '2px solid #FBBF24' 
                : '1.5px solid var(--border-medium, rgba(255, 255, 255, 0.12))',
              boxShadow: tipoParecer === 'COM_RESSALVAS' 
                ? '0 6px 20px -2px rgba(217, 119, 6, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.2)' 
                : 'none',
              transform: tipoParecer === 'COM_RESSALVAS' ? 'translateY(-1px)' : 'none'
            }}
          >
            <AlertTriangle size={18} color={tipoParecer === 'COM_RESSALVAS' ? '#ffffff' : '#FBBF24'} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ lineHeight: 1.2 }}>Com Ressalvas</div>
              <div style={{ fontSize: '0.68rem', opacity: tipoParecer === 'COM_RESSALVAS' ? 0.95 : 0.7 }}>"Exceto Por..." (NBC TA 705)</div>
            </div>
            {tipoParecer === 'COM_RESSALVAS' && (
              <span style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.25)', borderRadius: '999px', padding: '2px 8px', fontSize: '0.65rem', fontWeight: 900, color: '#fff' }}>ATIVO</span>
            )}
          </button>

          {/* 3. Opinião Adversa */}
          <button
            type="button"
            onClick={() => setTipoParecer('ADVERSA')}
            style={{
              padding: '12px 16px',
              borderRadius: '10px',
              fontSize: '0.85rem',
              fontWeight: tipoParecer === 'ADVERSA' ? 800 : 600,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              background: tipoParecer === 'ADVERSA' 
                ? 'linear-gradient(135deg, #E11D48 0%, #BE123C 100%)' 
                : 'rgba(15, 23, 42, 0.65)',
              color: tipoParecer === 'ADVERSA' ? '#ffffff' : 'var(--text-secondary, #94A3B8)',
              border: tipoParecer === 'ADVERSA' 
                ? '2px solid #FB7185' 
                : '1.5px solid var(--border-medium, rgba(255, 255, 255, 0.12))',
              boxShadow: tipoParecer === 'ADVERSA' 
                ? '0 6px 20px -2px rgba(225, 29, 72, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.2)' 
                : 'none',
              transform: tipoParecer === 'ADVERSA' ? 'translateY(-1px)' : 'none'
            }}
          >
            <ShieldAlert size={18} color={tipoParecer === 'ADVERSA' ? '#ffffff' : '#FB7185'} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ lineHeight: 1.2 }}>Opinião Adversa</div>
              <div style={{ fontSize: '0.68rem', opacity: tipoParecer === 'ADVERSA' ? 0.95 : 0.7 }}>Distorção Relevante (NBC 705)</div>
            </div>
            {tipoParecer === 'ADVERSA' && (
              <span style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.25)', borderRadius: '999px', padding: '2px 8px', fontSize: '0.65rem', fontWeight: 900, color: '#fff' }}>ATIVO</span>
            )}
          </button>

          {/* 4. Abstenção */}
          <button
            type="button"
            onClick={() => setTipoParecer('ABSTENCAO')}
            style={{
              padding: '12px 16px',
              borderRadius: '10px',
              fontSize: '0.85rem',
              fontWeight: tipoParecer === 'ABSTENCAO' ? 800 : 600,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              background: tipoParecer === 'ABSTENCAO' 
                ? 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)' 
                : 'rgba(15, 23, 42, 0.65)',
              color: tipoParecer === 'ABSTENCAO' ? '#ffffff' : 'var(--text-secondary, #94A3B8)',
              border: tipoParecer === 'ABSTENCAO' 
                ? '2px solid #C084FC' 
                : '1.5px solid var(--border-medium, rgba(255, 255, 255, 0.12))',
              boxShadow: tipoParecer === 'ABSTENCAO' 
                ? '0 6px 20px -2px rgba(124, 58, 237, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.2)' 
                : 'none',
              transform: tipoParecer === 'ABSTENCAO' ? 'translateY(-1px)' : 'none'
            }}
          >
            <HelpCircle size={18} color={tipoParecer === 'ABSTENCAO' ? '#ffffff' : '#C084FC'} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ lineHeight: 1.2 }}>Abstenção Opinião</div>
              <div style={{ fontSize: '0.68rem', opacity: tipoParecer === 'ABSTENCAO' ? 0.95 : 0.7 }}>Limitação de Escopo (NBC 705)</div>
            </div>
            {tipoParecer === 'ABSTENCAO' && (
              <span style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.25)', borderRadius: '999px', padding: '2px 8px', fontSize: '0.65rem', fontWeight: 900, color: '#fff' }}>ATIVO</span>
            )}
          </button>
        </div>

        {/* Campos de Texto e Justificativas da Opinião */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {tipoParecer !== 'SEM_RESSALVAS' && (
            <div className="form-group">
              <label style={{ color: getOpinionColor(), fontWeight: 800 }}>Base para {getOpinionTitle()} (Justificativa Técnica da Ressalva / Limitação)</label>
              <textarea
                className="form-control"
                rows={2}
                value={ressalvaTexto}
                onChange={e => setRessalvaTexto(e.target.value)}
              />
            </div>
          )}

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

        {/* Bloco de Opinião */}
        <div style={{ margin: '16px 0', padding: '14px', background: '#F8FAFC', borderRadius: '8px', borderLeft: `4px solid ${tipoParecer === 'SEM_RESSALVAS' ? '#059669' : tipoParecer === 'COM_RESSALVAS' ? '#D97706' : tipoParecer === 'ADVERSA' ? '#E11D48' : '#7C3AED'}` }}>
          <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0F172A', marginBottom: '6px' }}>
            {getOpinionTitle()}
          </div>
          <p style={{ margin: 0, fontSize: '0.78rem', color: '#334155', lineHeight: 1.6, textAlign: 'justify' }}>
            Examinamos as demonstrações contábeis da <strong>{currentTenant.name}</strong>, que compreendem o Balanço Patrimonial em 31 de dezembro de 2026 e as respectivas Demonstrações do Resultado (DRE), do Resultado Abrangente (DRA), das Mutações do Patrimônio Líquido (DMPL) e dos Fluxos de Caixa (DFC) para o exercício findo nessa data, bem como as correspondentes notas explicativas.
          </p>

          {tipoParecer === 'SEM_RESSALVAS' && (
            <p style={{ margin: '8px 0 0', fontSize: '0.78rem', color: '#334155', lineHeight: 1.6, textAlign: 'justify' }}>
              Em nossa opinião, as demonstrações contábeis acima referidas apresentam adequadamente, em todos os aspectos relevantes, a posição patrimonial e financeira da entidade em 31 de dezembro de 2026, o desempenho de suas operações e os seus fluxos de caixa para o exercício findo nessa data, de acordo com as práticas contábeis adotadas no Brasil (NBC TG / CPCs) e com as normas internacionais IFRS.
            </p>
          )}

          {tipoParecer === 'COM_RESSALVAS' && (
            <p style={{ margin: '8px 0 0', fontSize: '0.78rem', color: '#334155', lineHeight: 1.6, textAlign: 'justify' }}>
              Em nossa opinião, <strong>exceto pelos possíveis efeitos do assunto descrito na seção "Base para Opinião com Ressalvas"</strong>, as demonstrações contábeis apresentam adequadamente, em todos os aspectos relevantes, a posição patrimonial e financeira da entidade.
            </p>
          )}

          {tipoParecer === 'ADVERSA' && (
            <p style={{ margin: '8px 0 0', fontSize: '0.78rem', color: '#B91C1C', lineHeight: 1.6, textAlign: 'justify', fontWeight: 700 }}>
              Em nossa opinião, devido à relevância e à disseminação do assunto descrito na seção "Base para Opinião Adversa", as demonstrações contábeis NÃO apresentam adequadamente a posição patrimonial e financeira da entidade.
            </p>
          )}

          {tipoParecer === 'ABSTENCAO' && (
            <p style={{ margin: '8px 0 0', fontSize: '0.78rem', color: '#6D28D9', lineHeight: 1.6, textAlign: 'justify', fontWeight: 700 }}>
              Não expressamos uma opinião sobre as demonstrações contábeis da entidade. Devido à relevância do assunto descrito na seção "Base para Abstenção de Opinião", não nos foi possível obter evidência de auditoria apropriada e suficiente.
            </p>
          )}
        </div>

        {/* Base da Ressalva (se houver) */}
        {tipoParecer !== 'SEM_RESSALVAS' && (
          <div style={{ margin: '16px 0', padding: '14px', background: '#FFFBEB', borderRadius: '8px', borderLeft: '4px solid #D97706' }}>
            <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#78350F', marginBottom: '6px' }}>
              BASE PARA {getOpinionTitle()}
            </div>
            <p style={{ margin: 0, fontSize: '0.78rem', color: '#92400E', lineHeight: 1.6, textAlign: 'justify' }}>
              {ressalvaTexto}
            </p>
          </div>
        )}

        {/* PAA */}
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
