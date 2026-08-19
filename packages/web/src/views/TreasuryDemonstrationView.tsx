// ==========================================================================
// SOBERANO CONTÁBIL — CONTRATOS POC, ENGENHARIA & LOCAÇÃO / COMODATO (DIAMANTE 10/10)
// Reconhecimento de Receita de Obras (CPC 47 / IFRS 15) & Locação (STF Súmula 31)
// ==========================================================================

import React, { useState, useMemo } from 'react';
import {
  HardHat,
  Building,
  Calculator,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Printer,
  FileText,
  DollarSign,
  TrendingUp,
  Percent,
  Layers,
  ArrowRight
} from 'lucide-react';
import { officeStore } from '../state/office-store.js';

export const TreasuryDemonstrationView: React.FC = () => {
  const tenants = useMemo(() => officeStore.getTenants(), []);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('t1');
  const currentTenant = useMemo(() => tenants.find(t => t.id === selectedTenantId) || tenants[0], [tenants, selectedTenantId]);

  // Parâmetros da Obra / Contrato de Longo Prazo (CPC 47 / IFRS 15)
  const [nomeObra, setNomeObra] = useState<string>('Complexo Hospitalar Metropolitano — Bloco Cirúrgico');
  const [valorTotalContrato, setValorTotalContrato] = useState<number>(45000000.00); // R$ 45M
  const [custoTotalOrcado, setCustoTotalOrcado] = useState<number>(31500000.00); // R$ 31.5M (Margem 30%)
  const [custosIncorridosAcumulados, setCustosIncorridosAcumulados] = useState<number>(20475000.00); // R$ 20.475M (65%)
  const [faturamentoEmitidoAcumulado, setFaturamentoEmitidoAcumulado] = useState<number>(25000000.00); // R$ 25M

  // Parâmetros de Locação de Equipamentos / Comodato (STF Súmula 31)
  const [faturamentoLocacaoMensal, setFaturamentoLocacaoMensal] = useState<number>(180000.00);
  const [quantidadeEquipamentos, setQuantidadeEquipamentos] = useState<number>(14);

  // Cálculos Determinísticos POC (CPC 47)
  const percentualExecucaoPoc = useMemo(() => {
    if (custoTotalOrcado <= 0) return 0;
    return Math.min(100, (custosIncorridosAcumulados / custoTotalOrcado) * 100);
  }, [custosIncorridosAcumulados, custoTotalOrcado]);

  const receitaReconhecidaPoc = useMemo(() => {
    return (valorTotalContrato * percentualExecucaoPoc) / 100;
  }, [valorTotalContrato, percentualExecucaoPoc]);

  const lucroBrutoObra = useMemo(() => {
    return receitaReconhecidaPoc - custosIncorridosAcumulados;
  }, [receitaReconhecidaPoc, custosIncorridosAcumulados]);

  const diferencaContrato = useMemo(() => {
    return receitaReconhecidaPoc - faturamentoEmitidoAcumulado;
  }, [receitaReconhecidaPoc, faturamentoEmitidoAcumulado]);

  const isAtivoContrato = diferencaContrato >= 0; // Se receita > faturamento: Ativo de Contrato (A Faturar). Senão: Passivo de Contrato (Adiantamento)

  // Cálculos de Locação / Comodato (Súmula Vinculante 31 STF)
  const economiaIssLocacao = (faturamentoLocacaoMensal * 0.05); // 5% de ISS economizado
  const pisCofinsLocacao = (faturamentoLocacaoMensal * 0.0365); // 3.65% Cumulativo

  // Trava de Segurança SoD
  const [batchStatus, setBatchStatus] = useState<'PENDING' | 'RELEASED_TO_ACCOUNTING' | 'HOMOLOGATED'>('PENDING');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleReleaseToAccounting = () => {
    officeStore.releaseBatchToAccounting({
      id: `batch-poc-${Date.now()}`,
      tenantId: currentTenant.id,
      department: 'FISCAL_SECTORIAL',
      title: `Reconhecimento POC CPC 47 — ${nomeObra} (${percentualExecucaoPoc.toFixed(1)}% Executado)`,
      amount: receitaReconhecidaPoc,
      entries: [
        {
          debitAccountCode: isAtivoContrato ? '1.1.2.05' : '2.1.3.01',
          creditAccountCode: '3.1.1.03',
          amount: Math.abs(diferencaContrato),
          history: `Ajuste Patrimonial IFRS 15 POC — ${nomeObra} (${isAtivoContrato ? 'Ativo de Contrato' : 'Passivo de Contrato'})`
        }
      ],
      createdAt: new Date().toISOString()
    });

    setBatchStatus('RELEASED_TO_ACCOUNTING');
    setFeedback('Lote de Reconhecimento POC enviado ao Hub de Pré-Homologação Contábil com Trava SoD!');
    setTimeout(() => setFeedback(null), 5000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-primary)' }}>
      {/* Header */}
      <div className="no-print" style={{ background: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-medium)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>🏗️</span>
            <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
              Contratos POC, Engenharia & Locação / Comodato (CPC 47 / IFRS 15)
            </h1>
            <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--emerald-400)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>
              MÉTODO POC • ATIVOS/PASSIVOS DE CONTRATO • SÚMULA 31 STF
            </span>
          </div>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
            Reconhecimento contínuo de receita de engenharia pelo percentual de evolução física/financeira e blindagem fiscal em locação de bens.
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
            <span>Imprimir Laudo POC (A4)</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="no-print" style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid var(--emerald-500)', padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle2 size={20} color="var(--emerald-400)" />
          <span style={{ fontSize: '0.88rem', color: '#fff', fontWeight: 600 }}>{feedback}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="no-print grid-cards-4">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Evolução da Obra (POC)</span>
            <Percent size={18} color="var(--emerald-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--emerald-400)' }}>
            {percentualExecucaoPoc.toFixed(2)}%
          </div>
          <div className="metric-sub">Custos Incorridos vs Orçamento</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Receita Reconhecida CPC 47</span>
            <TrendingUp size={18} color="var(--cyan-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--cyan-400)' }}>
            R$ {receitaReconhecidaPoc.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="metric-sub">Margem Bruta: R$ {lucroBrutoObra.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">{isAtivoContrato ? 'Ativo de Contrato (A Faturar)' : 'Passivo de Contrato (Adiantamento)'}</span>
            <Layers size={18} color={isAtivoContrato ? 'var(--emerald-400)' : 'var(--amber-400)'} />
          </div>
          <div className="metric-value font-mono" style={{ color: isAtivoContrato ? 'var(--emerald-400)' : 'var(--amber-400)' }}>
            R$ {Math.abs(diferencaContrato).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="metric-sub">{isAtivoContrato ? 'Receita > Faturamento' : 'Faturamento > Receita'}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Blindagem STF 31 (Locação)</span>
            <ShieldCheck size={18} color="var(--indigo-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--emerald-400)' }}>
            ISS 0% • ICMS 0%
          </div>
          <div className="metric-sub">Economia ISS: R$ {economiaIssLocacao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês</div>
        </div>
      </div>

      {/* Simulator Forms Grid */}
      <div className="no-print" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '16px' }}>
        {/* Painel 1: Engenharia & Obra POC */}
        <div className="panel-card">
          <div style={{ padding: '10px 0 14px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HardHat size={18} color="var(--cyan-400)" />
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fff' }}>Parâmetros da Obra de Engenharia (CPC 47 / IFRS 15)</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="form-group">
              <label>Nome / Identificação do Contrato de Obra</label>
              <input
                type="text"
                className="form-control"
                value={nomeObra}
                onChange={e => setNomeObra(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label>Valor Total do Contrato (R$)</label>
                <input
                  type="number"
                  step="100000"
                  className="form-control font-mono"
                  value={valorTotalContrato}
                  onChange={e => setValorTotalContrato(Number(e.target.value))}
                />
              </div>

              <div className="form-group">
                <label>Custo Total Orçado (R$)</label>
                <input
                  type="number"
                  step="100000"
                  className="form-control font-mono"
                  value={custoTotalOrcado}
                  onChange={e => setCustoTotalOrcado(Number(e.target.value))}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label>Custos Incorridos Acumulados (R$)</label>
                <input
                  type="number"
                  step="50000"
                  className="form-control font-mono"
                  value={custosIncorridosAcumulados}
                  onChange={e => setCustosIncorridosAcumulados(Number(e.target.value))}
                />
              </div>

              <div className="form-group">
                <label>Faturamento Emitido (R$)</label>
                <input
                  type="number"
                  step="50000"
                  className="form-control font-mono"
                  value={faturamentoEmitidoAcumulado}
                  onChange={e => setFaturamentoEmitidoAcumulado(Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Painel 2: Locação & Comodato (STF 31) */}
        <div className="panel-card">
          <div style={{ padding: '10px 0 14px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building size={18} color="var(--emerald-400)" />
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fff' }}>Regime de Locação de Bens & Comodato (STF 31)</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label>Faturamento Mensal Locação (R$)</label>
                <input
                  type="number"
                  step="10000"
                  className="form-control font-mono"
                  value={faturamentoLocacaoMensal}
                  onChange={e => setFaturamentoLocacaoMensal(Number(e.target.value))}
                />
              </div>

              <div className="form-group">
                <label>Equipamentos em Locação/Comodato</label>
                <input
                  type="number"
                  className="form-control font-mono"
                  value={quantidadeEquipamentos}
                  onChange={e => setQuantidadeEquipamentos(Number(e.target.value))}
                />
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface-elevated)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-medium)', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Remessa Locação (CFOP 5.908):</span>
                <span style={{ fontWeight: 700, color: 'var(--emerald-400)' }}>Não-Incidência de ICMS & ISS (STF 31)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Economia Mensal de ISS (5%):</span>
                <span className="font-mono" style={{ fontWeight: 700, color: 'var(--emerald-400)' }}>R$ {economiaIssLocacao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>PIS / COFINS Locação (3,65%):</span>
                <span className="font-mono" style={{ fontWeight: 700, color: '#fff' }}>R$ {pisCofinsLocacao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '8px' }}>
              <button
                type="button"
                onClick={handleReleaseToAccounting}
                disabled={batchStatus !== 'PENDING'}
                className="btn-primary-action"
                style={{ width: '100%', padding: '10px', fontSize: '0.82rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
              >
                <Zap size={16} />
                <span>{batchStatus === 'PENDING' ? 'Liberar Reconhecimento POC para Contabilidade (Trava SoD)' : '✓ Lote Homologado no Diário Geral'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DOSSIÊ A4 */}
      <div className="diamond-paper-a4">
        <div className="diamond-header">
          <div>
            <div className="diamond-title">{currentTenant.name}</div>
            <div className="diamond-subtitle">LAUDO DE RECONHECIMENTO DE RECEITA POR MEDIÇÃO POC (CPC 47 / IFRS 15) & LOCAÇÃO</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.70rem' }}>
            <div>CNPJ: <strong>{currentTenant.cnpj}</strong></div>
            <div>CONTRATO: <strong>{nomeObra}</strong></div>
            <div style={{ color: '#047857', fontWeight: 800 }}>Norma IFRS 15 / CPC 47</div>
          </div>
        </div>

        <div className="diamond-meta-grid">
          <div className="diamond-meta-item">
            <strong>Valor Contratual Global</strong>
            <span className="font-mono">R$ {valorTotalContrato.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Evolução Física/Financeira</strong>
            <span className="font-mono" style={{ color: '#047857', fontWeight: 800 }}>{percentualExecucaoPoc.toFixed(2)}% Concluído</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Receita Bruta Reconhecida</strong>
            <span className="font-mono" style={{ color: '#047857', fontWeight: 800 }}>R$ {receitaReconhecidaPoc.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Posição Patrimonial de Contrato</strong>
            <span style={{ color: isAtivoContrato ? '#047857' : '#B45309', fontWeight: 800 }}>
              {isAtivoContrato ? 'ATIVO DE CONTRATO (A FATURAR)' : 'PASSIVO DE CONTRATO (ADIANTAMENTO)'}
            </span>
          </div>
        </div>

        <table className="diamond-table">
          <thead>
            <tr>
              <th>Demonstrativo de Medição & Apuração IFRS 15</th>
              <th style={{ textAlign: 'right' }}>Valor Orçado (R$)</th>
              <th style={{ textAlign: 'right' }}>Realizado / Apurado (R$)</th>
              <th style={{ textAlign: 'center' }}>% Execução</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Custos Diretos e Indiretos da Obra (Insumos, Mão de Obra e Subcontratos)</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ {custoTotalOrcado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ {custosIncorridosAcumulados.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td style={{ textAlign: 'center' }} className="font-mono">{percentualExecucaoPoc.toFixed(1)}%</td>
            </tr>
            <tr>
              <td>Receita Bruta Acumulada da Obra (Reconhecida pelo POC CPC 47)</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ {valorTotalContrato.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td className="font-mono" style={{ textAlign: 'right', color: '#047857', fontWeight: 700 }}>R$ {receitaReconhecidaPoc.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td style={{ textAlign: 'center' }} className="font-mono">{percentualExecucaoPoc.toFixed(1)}%</td>
            </tr>
            <tr>
              <td>Faturamento Tributado Emitido em Notas de Medição</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ {valorTotalContrato.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ {faturamentoEmitidoAcumulado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td style={{ textAlign: 'center' }} className="font-mono">{((faturamentoEmitidoAcumulado / valorTotalContrato) * 100).toFixed(1)}%</td>
            </tr>
            <tr className="diamond-table-total">
              <td>{isAtivoContrato ? 'ATIVO DE CONTRATO A FATURAR (CONFORME CPC 47)' : 'PASSIVO DE CONTRATO / ADIANTAMENTO DE CLIENTE'}</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>—</td>
              <td className="font-mono" style={{ textAlign: 'right', color: isAtivoContrato ? '#047857' : '#B45309', fontWeight: 800 }}>
                R$ {Math.abs(diferencaContrato).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </td>
              <td style={{ textAlign: 'center', fontWeight: 800 }}>✓ IFRS 15</td>
            </tr>
          </tbody>
        </table>

        <div className="diamond-signatures">
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">ENGENHEIRO RESIDENTE / RESPONSÁVEL</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>CREA / Relatório de Medição Física</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">RESPONSÁVEL TÉCNICO CONTÁBIL</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>CRC/SP 1SP999999/O-0</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">DIRETORIA FINANCEIRA / AUDITORIA</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Homologação de Receita POC</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreasuryDemonstrationView;
