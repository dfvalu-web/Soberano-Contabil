// ==========================================================================
// SOBERANO CONTÁBIL — EQUIVALÊNCIA PATRIMONIAL (MEP - CPC 18 R2 / IAS 28)
// Conformidade: CPC 18 • Art. 248 Lei 6.404/76 • LALUR Bloco M300 ECF
// ==========================================================================

import React, { useState, useMemo } from 'react';
import {
  Building2,
  TrendingUp,
  Percent,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Printer,
  ShieldCheck,
  Scale,
  FileText,
  DollarSign
} from 'lucide-react';
import { officeStore } from '../state/office-store.js';

export const OfficeEquityMethodCpc18View: React.FC = () => {
  const tenants = useMemo(() => officeStore.getTenants(), []);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('t1');
  const currentTenant = useMemo(() => tenants.find(t => t.id === selectedTenantId) || tenants[0], [tenants, selectedTenantId]);

  const [competencia, setCompetencia] = useState<string>('12/2026');
  const [coligadaNome, setColigadaNome] = useState<string>('Alpha Logística & Transportes S/A');
  const [coligadaCnpj, setColigadaCnpj] = useState<string>('23.456.789/0001-01');
  const [percentualParticipacao, setPercentualParticipacao] = useState<number>(40.0);
  const [patrimonioLiquidoColigada, setPatrimonioLiquidoColigada] = useState<number>(3500000.00);
  const [lucroLiquidoPeriodo, setLucroLiquidoPeriodo] = useState<number>(450000.00);
  const [lucrosNaoRealizadosIntercompany, setLucrosNaoRealizadosIntercompany] = useState<number>(30000.00);
  const [dividendosPropostos, setDividendosPropostos] = useState<number>(60000.00);
  const [maisValiaAtivosLiquidos, setMaisValiaAtivosLiquidos] = useState<number>(120000.00);
  const [feedback, setFeedback] = useState<{ message: string; isError: boolean } | null>(null);

  // Cálculos determinísticos CPC 18 (R2)
  const baseCalculoMep = lucroLiquidoPeriodo - lucrosNaoRealizadosIntercompany;
  const ganhoResultadoMep = (baseCalculoMep * (percentualParticipacao / 100));
  const valorInvestimentoContabil = (patrimonioLiquidoColigada * (percentualParticipacao / 100)) + maisValiaAtivosLiquidos;
  const dividendosRecebiveis = (dividendosPropostos * (percentualParticipacao / 100));

  // Trava SoD
  const batchId = `acc-mep-${selectedTenantId}-${competencia.replace('/', '')}`;
  const lockInfo = useMemo(() => {
    return officeStore.checkDepartmentLock(selectedTenantId, batchId);
  }, [selectedTenantId, competencia, feedback]);

  const handleReleaseToLedger = () => {
    if (lockInfo.isLocked) {
      setFeedback({
        message: 'TRAVA DE SEGURANÇA ATIVA: A equivalência patrimonial já foi liberada para a Contabilidade e está na caixa de homologação do Contador.',
        isError: true
      });
      return;
    }

    officeStore.releaseBatchToAccounting({
      id: batchId,
      tenantId: selectedTenantId,
      department: 'CONTABIL',
      competencia,
      title: `Equivalência Patrimonial CPC 18 (${coligadaNome} - ${percentualParticipacao}%)`,
      description: `Ganho de MEP no Exercício: R$ ${ganhoResultadoMep.toLocaleString('pt-BR')} • Exclusão LALUR M300`,
      sourceModuleId: 'office_equity_method_cpc18',
      sentBy: 'Especialista em Demonstrações Consolidadas & IFRS',
      totalDebits: ganhoResultadoMep,
      totalCredits: ganhoResultadoMep,
      itemsCount: 1,
      previewLines: [
        { debitAccountCode: '1.2.2.01', debitAccountName: 'Investimentos em Coligadas / Controladas (MEP)', creditAccountCode: '3.2.1.01', creditAccountName: 'Resultado Positivo de Equivalência Patrimonial (DRE)', amount: ganhoResultadoMep, history: `Reconhecimento MEP ref. ${competencia} coligada ${coligadaNome}` }
      ]
    });

    setFeedback({
      message: `Lote de MEP (${competencia}) liberado com sucesso para a Pré-Homologação Contábil!`,
      isError: false
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-primary)' }}>
      {/* Header */}
      <div className="no-print" style={{ background: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-medium)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>🏢</span>
            <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
              Equivalência Patrimonial (MEP - CPC 18 R2 / IAS 28)
            </h1>
            <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--emerald-400)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>
              CPC 18 • ART. 248 LSA • LALUR BLOCO M300
            </span>
          </div>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
            Apuração da variação de Patrimônio Líquido em investidas, eliminação de lucros não realizados e exclusão tributária no LALUR/ECF.
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
            <span>Imprimir Laudo MEP (A4)</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="no-print" style={{ background: feedback.isError ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)', border: `1px solid ${feedback.isError ? 'var(--red-500)' : 'var(--emerald-500)'}`, padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          {feedback.isError ? <AlertTriangle size={20} color="#F87171" /> : <CheckCircle2 size={20} color="var(--emerald-400)" />}
          <span style={{ fontSize: '0.88rem', color: '#fff', fontWeight: 600 }}>{feedback.message}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="no-print grid-cards-4">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Saldo do Investimento no Ativo</span>
            <Building2 size={18} color="var(--cyan-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--cyan-400)' }}>
            R$ {valorInvestimentoContabil.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="metric-sub">{percentualParticipacao}% do PL da Investida + Mais-Valia</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Resultado de MEP (DRE)</span>
            <TrendingUp size={18} color="var(--emerald-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--emerald-400)' }}>
            + R$ {ganhoResultadoMep.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="metric-sub">Receita de Equivalência Patrimonial Líquida</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Exclusão no LALUR (ECF M300)</span>
            <ShieldCheck size={18} color="var(--indigo-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--indigo-400)' }}>
            R$ {ganhoResultadoMep.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="metric-sub">Não tributável p/ IRPJ e CSLL (Art. 34 DL 1.598)</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Contabilização & Trava SoD</span>
            <Zap size={18} color="var(--amber-400)" />
          </div>
          {lockInfo.isLocked ? (
            <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(245, 158, 11, 0.15)', border: '1px dashed var(--amber-400)', padding: '6px 10px', borderRadius: '6px', fontSize: '0.75rem', color: 'var(--amber-300)', fontWeight: 700 }}>
              <span>🔒 Lote Travado na Contabilidade</span>
            </div>
          ) : (
            <button
              onClick={handleReleaseToLedger}
              className="btn-primary-action"
              style={{ width: '100%', marginTop: '8px', padding: '6px', fontSize: '0.78rem' }}
            >
              ⚡ Contabilizar MEP no Diário Geral
            </button>
          )}
        </div>
      </div>

      {/* Simulator Inputs */}
      <div className="no-print panel-card">
        <div style={{ padding: '12px 0 16px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fff' }}>Parâmetros da Coligada & Participação Societária</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div className="form-group">
            <label>Razão Social da Investida / Coligada</label>
            <input
              type="text"
              className="form-control"
              value={coligadaNome}
              onChange={e => setColigadaNome(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>CNPJ da Investida</label>
            <input
              type="text"
              className="form-control font-mono"
              value={coligadaCnpj}
              onChange={e => setColigadaCnpj(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Participação no Capital Votante (%)</label>
            <input
              type="number"
              step="0.5"
              className="form-control font-mono"
              value={percentualParticipacao}
              onChange={e => setPercentualParticipacao(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label>Patrimônio Líquido da Investida (R$)</label>
            <input
              type="number"
              step="10000"
              className="form-control font-mono"
              value={patrimonioLiquidoColigada}
              onChange={e => setPatrimonioLiquidoColigada(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label>Lucro Líquido do Exercício (Investida)</label>
            <input
              type="number"
              step="5000"
              className="form-control font-mono"
              value={lucroLiquidoPeriodo}
              onChange={e => setLucroLiquidoPeriodo(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label>Lucros Não Realizados Intercompany (R$)</label>
            <input
              type="number"
              step="1000"
              className="form-control font-mono"
              value={lucrosNaoRealizadosIntercompany}
              onChange={e => setLucrosNaoRealizadosIntercompany(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label>Mais-Valia de Ativos Líquidos (CPC 15)</label>
            <input
              type="number"
              step="5000"
              className="form-control font-mono"
              value={maisValiaAtivosLiquidos}
              onChange={e => setMaisValiaAtivosLiquidos(Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      {/* DOSSIÊ A4 */}
      <div className="diamond-paper-a4">
        <div className="diamond-header">
          <div>
            <div className="diamond-title">{currentTenant.name}</div>
            <div className="diamond-subtitle">LAUDO PERICIAL — MÉTODO DA EQUIVALÊNCIA PATRIMONIAL (MEP - CPC 18 R2 / ART. 248 LSA)</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.70rem' }}>
            <div>CNPJ INVESTIDORA: <strong>{currentTenant.cnpj}</strong></div>
            <div>COMPETÊNCIA: <strong>{competencia}</strong></div>
            <div style={{ color: '#047857', fontWeight: 800 }}>ECF Bloco M300 Conciliado</div>
          </div>
        </div>

        <div className="diamond-meta-grid">
          <div className="diamond-meta-item">
            <strong>Investida / Coligada</strong>
            <span>{coligadaNome}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Participação Societária</strong>
            <span className="font-mono">{percentualParticipacao}% (Influência Significativa)</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Valor Contábil do Investimento</strong>
            <span className="font-mono" style={{ color: '#047857', fontWeight: 800 }}>R$ {valorInvestimentoContabil.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Ganho de MEP no Período</strong>
            <span className="font-mono" style={{ color: '#047857', fontWeight: 800 }}>+ R$ {ganhoResultadoMep.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        <table className="diamond-table">
          <thead>
            <tr>
              <th>Demonstrativo da Memória de Cálculo de MEP</th>
              <th style={{ textAlign: 'right' }}>Valor Base (R$)</th>
              <th style={{ textAlign: 'center' }}>% Participação</th>
              <th style={{ textAlign: 'right' }}>Efeito Contábil (R$)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Patrimônio Líquido Contábil da Investida</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ {patrimonioLiquidoColigada.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td style={{ textAlign: 'center' }} className="font-mono">{percentualParticipacao}%</td>
              <td className="font-mono" style={{ textAlign: 'right', fontWeight: 700 }}>R$ {(patrimonioLiquidoColigada * (percentualParticipacao / 100)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
            </tr>
            <tr>
              <td>Mais-Valia de Ativos Líquidos Identificados (CPC 15)</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ {maisValiaAtivosLiquidos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td style={{ textAlign: 'center' }}>-</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ {maisValiaAtivosLiquidos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
            </tr>
            <tr>
              <td>Lucro Líquido Declarado pela Investida no Exercício</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ {lucroLiquidoPeriodo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td style={{ textAlign: 'center' }} className="font-mono">{percentualParticipacao}%</td>
              <td className="font-mono" style={{ textAlign: 'right', color: '#047857' }}>+ R$ {(lucroLiquidoPeriodo * (percentualParticipacao / 100)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
            </tr>
            <tr>
              <td>(-) Expurgo de Lucros Não Realizados em Operações Intercompany</td>
              <td className="font-mono" style={{ textAlign: 'right', color: '#B91C1C' }}>- R$ {lucrosNaoRealizadosIntercompany.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td style={{ textAlign: 'center' }}>100%</td>
              <td className="font-mono" style={{ textAlign: 'right', color: '#B91C1C' }}>- R$ {(lucrosNaoRealizadosIntercompany * (percentualParticipacao / 100)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
            </tr>
            <tr className="diamond-table-total">
              <td colSpan={3}>RESULTADO LÍQUIDO DE EQUIVALÊNCIA PATRIMONIAL A RECONHECER NA DRE</td>
              <td className="font-mono" style={{ textAlign: 'right', color: '#047857', fontWeight: 800 }}>+ R$ {ganhoResultadoMep.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
            </tr>
          </tbody>
        </table>

        <div className="diamond-signatures">
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">SUPERVISÃO DE CONSOLIDAÇÃO SOCIETÁRIA</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Avaliação de Investimentos CPC 18</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">RESPONSÁVEL TÉCNICO CONTÁBIL</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>CRC/SP 1SP999999/O-0</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">DIRETORIA FINANCEIRA & CONTROLADORIA</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Exclusão Tributária LALUR M300</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficeEquityMethodCpc18View;
