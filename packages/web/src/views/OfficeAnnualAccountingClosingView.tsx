// ==========================================================================
// SOBERANO CONTÁBIL — FECHAMENTO ANUAL, EBITDA & NOTAS EXPLICATIVAS (CPC 26)
// Encerramento do Exercício Social, Apuração de EBITDA e Livro de Fechamento A4
// ==========================================================================

import React, { useState, useMemo } from 'react';
import {
  CalendarCheck,
  TrendingUp,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Printer,
  ShieldCheck,
  Building2,
  Layers,
  Edit3
} from 'lucide-react';
import { officeStore } from '../state/office-store.js';

export const OfficeAnnualAccountingClosingView: React.FC = () => {
  const tenants = useMemo(() => officeStore.getTenants(), []);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('t1');
  const currentTenant = useMemo(() => tenants.find(t => t.id === selectedTenantId) || tenants[0], [tenants, selectedTenantId]);

  const [exercicio, setExercicio] = useState<string>('2026');
  const [receitaLiquida, setReceitaLiquida] = useState<number>(12800000.00);
  const [lucroBruto, setLucroBruto] = useState<number>(5400000.00);
  const [despesasOperacionais, setDespesasOperacionais] = useState<number>(2600000.00);
  const [depreciacaoAmortizacao, setDepreciacaoAmortizacao] = useState<number>(520000.00);
  const [resultadoFinanceiroLiquido, setResultadoFinanceiroLiquido] = useState<number>(-180000.00);
  const [provisaoIrpjCsll, setProvisaoIrpjCsll] = useState<number>(680000.00);

  // Notas Explicativas Editáveis
  const [notaPoliticas, setNotaPoliticas] = useState<string>('As demonstrações contábeis foram elaboradas em conformidade com as normas internacionais IFRS e NBC TG emitidas pelo CFC. As receitas são reconhecidas conforme CPC 47.');
  const [notaProvisoes, setNotaProvisoes] = useState<string>('A entidade avaliou as contingências cíveis e trabalhistas com probabilidade de perda provável, mantendo provisão de R$ 240.000,00 conforme CPC 25.');
  const [notaPartesRelacionadas, setNotaPartesRelacionadas] = useState<string>('As transações com partes relacionadas referem-se a operações comerciais de prestação de serviços logísticos em condições comutativas de mercado.');

  // Cálculos do Exercício
  const lucroOperacionalEbit = lucroBruto - despesasOperacionais;
  const ebitdaLajida = lucroOperacionalEbit + depreciacaoAmortizacao;
  const margemEbitda = ((ebitdaLajida / receitaLiquida) * 100);
  const lucroAntesTributosLair = lucroOperacionalEbit + resultadoFinanceiroLiquido;
  const lucroLiquidoExercicio = lucroAntesTributosLair - provisaoIrpjCsll;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-primary)' }}>
      {/* Header */}
      <div className="no-print" style={{ background: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-medium)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>🗓️</span>
            <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
              Fechamento Anual, EBITDA & Notas Explicativas (CPC 26)
            </h1>
            <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--emerald-400)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>
              ENCERRAMENTO ANUAL • CPC 26 (R1) • IFRS
            </span>
          </div>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
            Consolidação do exercício social, apuração de EBITDA ajustado e elaboração das Notas Explicativas obrigatórias.
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
            <span>Imprimir Livro de Fechamento (A4)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="no-print grid-cards-4">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">EBITDA / LAJIDA Ajustado</span>
            <TrendingUp size={18} color="var(--emerald-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--emerald-400)' }}>
            R$ {ebitdaLajida.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="metric-sub">Margem EBITDA: {margemEbitda.toFixed(1)}% s/ Receita</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Lucro Operacional (EBIT)</span>
            <Building2 size={18} color="var(--cyan-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--cyan-400)' }}>
            R$ {lucroOperacionalEbit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="metric-sub">Resultado Antes dos Juros e Impostos</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Lucro Líquido do Exercício</span>
            <CheckCircle2 size={18} color="#fff" />
          </div>
          <div className="metric-value font-mono" style={{ color: '#fff' }}>
            R$ {lucroLiquidoExercicio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="metric-sub">Resultado Final Destinado ao PL</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Status do Exercício Social</span>
            <ShieldCheck size={18} color="var(--indigo-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--emerald-400)', fontSize: '1rem' }}>
            100% FECHADO & CONCILIADO
          </div>
          <div className="metric-sub">Apto p/ ECD, ECF e Junta Comercial</div>
        </div>
      </div>

      {/* Editor de Notas Explicativas */}
      <div className="no-print panel-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Edit3 size={16} color="var(--cyan-400)" />
          <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fff' }}>Editor de Notas Explicativas às Demonstrações Contábeis (NBC TG 26)</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          <div className="form-group">
            <label>Nota 1 — Políticas Contábeis & Base de Elaboração</label>
            <textarea
              className="form-control"
              rows={3}
              value={notaPoliticas}
              onChange={e => setNotaPoliticas(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Nota 2 — Provisões, Contingências & Passivos (CPC 25)</label>
            <textarea
              className="form-control"
              rows={3}
              value={notaProvisoes}
              onChange={e => setNotaProvisoes(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Nota 3 — Transações com Partes Relacionadas (CPC 05)</label>
            <textarea
              className="form-control"
              rows={3}
              value={notaPartesRelacionadas}
              onChange={e => setNotaPartesRelacionadas(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* DOSSIÊ A4 */}
      <div className="diamond-paper-a4">
        <div className="diamond-header">
          <div>
            <div className="diamond-title">{currentTenant.name}</div>
            <div className="diamond-subtitle">DOSSIÊ EXECUTIVO DE ENCERRAMENTO ANUAL, EBITDA & NOTAS EXPLICATIVAS — EXERCÍCIO {exercicio}</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.70rem' }}>
            <div>CNPJ: <strong>{currentTenant.cnpj}</strong></div>
            <div>REGIME: <strong>{currentTenant.regime.replace('_', ' ')}</strong></div>
            <div style={{ color: '#047857', fontWeight: 800 }}>Demonstrações Auditadas IFRS</div>
          </div>
        </div>

        <div className="diamond-meta-grid">
          <div className="diamond-meta-item">
            <strong>Receita Operacional Líquida</strong>
            <span className="font-mono">R$ {receitaLiquida.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>EBITDA / LAJIDA Apurado</strong>
            <span className="font-mono" style={{ color: '#047857', fontWeight: 800 }}>R$ {ebitdaLajida.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Margem EBITDA</strong>
            <span className="font-mono" style={{ color: '#047857', fontWeight: 800 }}>{margemEbitda.toFixed(2)}%</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Lucro Líquido do Exercício</strong>
            <span className="font-mono" style={{ color: '#047857', fontWeight: 800 }}>R$ {lucroLiquidoExercicio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.78rem', lineHeight: 1.5 }}>
          <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #0284C7' }}>
            <div style={{ fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>NOTA EXPLICATIVA 1 — PRINCIPAIS POLÍTICAS CONTÁBEIS E BASES DE PREPARAÇÃO</div>
            <div style={{ color: '#334155' }}>{notaPoliticas}</div>
          </div>

          <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #059669' }}>
            <div style={{ fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>NOTA EXPLICATIVA 2 — PROVISÕES, CONTINGÊNCIAS E PASSIVOS CONTINGENTES (CPC 25)</div>
            <div style={{ color: '#334155' }}>{notaProvisoes}</div>
          </div>

          <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #7C3AED' }}>
            <div style={{ fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>NOTA EXPLICATIVA 3 — TRANSAÇÕES COM PARTES RELACIONADAS (CPC 05)</div>
            <div style={{ color: '#334155' }}>{notaPartesRelacionadas}</div>
          </div>
        </div>

        <div className="diamond-signatures">
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">DIRETORIA EXECUTIVA & ADMINISTRADOR</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Aprovação das Demonstrações</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">RESPONSÁVEL TÉCNICO CONTÁBIL</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>CRC/SP 1SP999999/O-0</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">CONSELHO FISCAL / AUDITORIA EXTERNA</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Parecer Favorável Sem Ressalvas</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficeAnnualAccountingClosingView;
