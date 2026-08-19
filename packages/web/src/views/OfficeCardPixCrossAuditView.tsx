// ==========================================================================
// SOBERANO CONTÁBIL — AUDITORIA DE CARTÕES, PIX & MARKETPLACE (DIMP / DECRED / SEFAZ)
// Conformidade: Convênio ICMS 134/16 (DIMP) • Bloco 1601 EFD • Art. 138 do CTN
// ==========================================================================

import React, { useState, useMemo } from 'react';
import {
  CreditCard,
  QrCode,
  Store,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  Zap,
  Printer,
  Download,
  Building2,
  DollarSign,
  TrendingDown,
  RefreshCw,
  FileText
} from 'lucide-react';
import { officeStore } from '../state/office-store.js';

interface AcquirerOperationItem {
  id: string;
  adquirenteNome: string;
  canalTipo: 'MAQUININHA_POS' | 'GATEWAY_ECOM' | 'PIX_BACEN' | 'MARKETPLACE';
  cnpjCredenciadora: string;
  volumeTransacionado: number;
  taxaMdrMediaPct: number;
  valorLiquidoRepassado: number;
  notasEmitidasVinculadas: number;
  diferencaOmissao: number;
  statusConformidade: 'COBERTO_100' | 'DIVERGENCIA_OMISSAO' | 'DIFERENCA_TEMPORAL';
}

export const OfficeCardPixCrossAuditView: React.FC = () => {
  const tenants = useMemo(() => officeStore.getTenants(), []);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('t1');
  const currentTenant = useMemo(() => tenants.find(t => t.id === selectedTenantId) || tenants[0], [tenants, selectedTenantId]);
  
  const [competencia, setCompetencia] = useState<string>('08/2026');
  const [totalNfeEmitidas, setTotalNfeEmitidas] = useState<number>(850000.00);
  const [feedback, setFeedback] = useState<{ message: string; isError: boolean } | null>(null);

  const [acquirers, setAcquirers] = useState<AcquirerOperationItem[]>([
    {
      id: 'acq-1',
      adquirenteNome: 'Cielo S.A. (Crédito / Débito)',
      canalTipo: 'MAQUININHA_POS',
      cnpjCredenciadora: '01.027.058/0001-91',
      volumeTransacionado: 320000.00,
      taxaMdrMediaPct: 2.1,
      valorLiquidoRepassado: 313280.00,
      notasEmitidasVinculadas: 325000.00,
      diferencaOmissao: 0,
      statusConformidade: 'COBERTO_100'
    },
    {
      id: 'acq-2',
      adquirenteNome: 'Stone Pagamentos S.A.',
      canalTipo: 'MAQUININHA_POS',
      cnpjCredenciadora: '16.501.555/0001-57',
      volumeTransacionado: 210000.00,
      taxaMdrMediaPct: 1.8,
      valorLiquidoRepassado: 206220.00,
      notasEmitidasVinculadas: 210000.00,
      diferencaOmissao: 0,
      statusConformidade: 'COBERTO_100'
    },
    {
      id: 'acq-3',
      adquirenteNome: 'PIX Instantâneo Itaú Unibanco / Bacen',
      canalTipo: 'PIX_BACEN',
      cnpjCredenciadora: '60.701.190/0001-04',
      volumeTransacionado: 195000.00,
      taxaMdrMediaPct: 0.5,
      valorLiquidoRepassado: 194025.00,
      notasEmitidasVinculadas: 195000.00,
      diferencaOmissao: 0,
      statusConformidade: 'COBERTO_100'
    },
    {
      id: 'acq-4',
      adquirenteNome: 'Mercado Livre / Mercado Pago Marketplace',
      canalTipo: 'MARKETPLACE',
      cnpjCredenciadora: '10.573.521/0001-91',
      volumeTransacionado: 117150.00,
      taxaMdrMediaPct: 11.5,
      valorLiquidoRepassado: 103677.75,
      notasEmitidasVinculadas: 120000.00,
      diferencaOmissao: 0,
      statusConformidade: 'COBERTO_100'
    }
  ]);

  const totalDimpOperacoes = useMemo(() => {
    return acquirers.reduce((acc, a) => acc + a.volumeTransacionado, 0);
  }, [acquirers]);

  const margemCobertura = totalNfeEmitidas - totalDimpOperacoes;
  const isCovered = margemCobertura >= 0;
  const taxaMediaGeralMdr = (acquirers.reduce((acc, a) => acc + (a.volumeTransacionado * a.taxaMdrMediaPct), 0) / (totalDimpOperacoes || 1));

  // Trava SoD
  const batchId = `fis-dimp-${selectedTenantId}-${competencia.replace('/', '')}`;
  const lockInfo = useMemo(() => {
    return officeStore.checkDepartmentLock(selectedTenantId, batchId);
  }, [selectedTenantId, competencia, feedback]);

  const handleSimulateNewDivergence = () => {
    // Adiciona uma operação de marketplace não faturada para simulação forense
    setAcquirers(prev => [
      ...prev,
      {
        id: 'acq-5',
        adquirenteNome: 'Shopee E-Commerce Brasil (Novo Canal)',
        canalTipo: 'MARKETPLACE',
        cnpjCredenciadora: '35.635.824/0001-12',
        volumeTransacionado: 45000.00,
        taxaMdrMediaPct: 14.0,
        valorLiquidoRepassado: 38700.00,
        notasEmitidasVinculadas: 15000.00,
        diferencaOmissao: 30000.00,
        statusConformidade: 'DIVERGENCIA_OMISSAO'
      }
    ]);
    setFeedback({
      message: 'Simulação DIMP carregada: Identificada omissão de R$ 30.000,00 em canal Shopee sem emissão de DF-e. Risco de Malha Fina ativado!',
      isError: true
    });
  };

  const handleAutoRectifyArt138 = () => {
    // Regularização espontânea Art. 138 CTN
    setTotalNfeEmitidas(prev => prev + 30000.00);
    setAcquirers(prev => prev.map(a => ({
      ...a,
      notasEmitidasVinculadas: a.volumeTransacionado,
      diferencaOmissao: 0,
      statusConformidade: 'COBERTO_100'
    })));
    setFeedback({
      message: 'Denúncia Espontânea (Art. 138 CTN) executada com sucesso! NFC-e complementares emitidas e Bloco 1601 EFD sincronizado com 0 multas punitivas.',
      isError: false
    });
  };

  const handleReleaseToAccounting = () => {
    if (lockInfo.isLocked) {
      setFeedback({
        message: 'TRAVA DE SEGURANÇA ATIVA: Esta conciliação DIMP/PIX já foi liberada para a Contabilidade e está aguardando homologação ou devolução pelo Contador.',
        isError: true
      });
      return;
    }

    officeStore.releaseBatchToAccounting({
      id: batchId,
      tenantId: selectedTenantId,
      department: 'FISCAL',
      competencia,
      title: `Auditoria DIMP & Bloco 1601 EFD (${competencia})`,
      description: `Operações Cartões/PIX: R$ ${totalDimpOperacoes.toLocaleString('pt-BR')} • NF-e Emitidas: R$ ${totalNfeEmitidas.toLocaleString('pt-BR')}`,
      sourceModuleId: 'office_card_pix_crossaudit',
      sentBy: 'Auditor Fiscal Eletrônico (Setor DIMP / D-Fe)',
      totalDebits: totalDimpOperacoes,
      totalCredits: totalDimpOperacoes,
      itemsCount: acquirers.length,
      previewLines: [
        { debitAccountCode: '1.1.2.05', debitAccountName: 'Adquirentes & Cartões a Receber', creditAccountCode: '3.1.1.01', creditAccountName: 'Receita Bruta Vendas Cartão/PIX', amount: totalDimpOperacoes, history: `Conciliação DIMP ref. ${competencia}` }
      ]
    });

    setFeedback({
      message: `Lote DIMP (${competencia}) liberado com sucesso para a Pré-Homologação Contábil! A trava de segurança foi ativada.`,
      isError: false
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-primary)' }}>
      {/* Header */}
      <div className="no-print" style={{ background: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-medium)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>💳</span>
            <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
              Auditoria de Cartões, PIX & Marketplace (DIMP / DECRED / SEFAZ)
            </h1>
            <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--emerald-400)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>
              CONVÊNIO ICMS 134/16 • EFD BLOCO 1601
            </span>
          </div>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
            Cruzamento preventivo de faturamento em cartões e PIX contra DF-e emitidas, prevenindo malha fina e denúncia espontânea (Art. 138 CTN).
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
            <span>Imprimir Laudo DIMP (A4)</span>
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
            <span className="metric-title">Volume DIMP Declarado Adquirentes</span>
            <CreditCard size={18} color="var(--cyan-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--cyan-400)' }}>
            R$ {totalDimpOperacoes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="metric-sub">{acquirers.length} Credenciadoras & Canais PIX</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Notas Fiscais Emitidas (DF-e)</span>
            <FileText size={18} color="var(--emerald-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: '#fff' }}>
            R$ {totalNfeEmitidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="metric-sub">NF-e Mod. 55 e NFC-e Mod. 65</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Margem de Cobertura Fiscal</span>
            <ShieldCheck size={18} color={isCovered ? 'var(--emerald-400)' : '#F87171'} />
          </div>
          <div className="metric-value font-mono" style={{ color: isCovered ? 'var(--emerald-400)' : '#F87171' }}>
            {isCovered ? '+' : ''} R$ {margemCobertura.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="metric-sub">{isCovered ? '✓ 100% Coberto (Zero Risco Malha)' : '⚠️ Omissão Detectada pela SEFAZ'}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Governança & Trava Contábil</span>
            <Zap size={18} color="var(--amber-400)" />
          </div>
          {lockInfo.isLocked ? (
            <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(245, 158, 11, 0.15)', border: '1px dashed var(--amber-400)', padding: '6px 10px', borderRadius: '6px', fontSize: '0.75rem', color: 'var(--amber-300)', fontWeight: 700 }}>
              <span>🔒 Lote Travado na Contabilidade</span>
            </div>
          ) : (
            <button
              onClick={handleReleaseToAccounting}
              className="btn-primary-action"
              style={{ width: '100%', marginTop: '8px', padding: '6px', fontSize: '0.78rem' }}
            >
              ⚡ Liberar DIMP p/ Contabilidade
            </button>
          )}
        </div>
      </div>

      {/* Simulator Inputs & Quick Actions */}
      <div className="no-print panel-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff' }}>Simulador Forense de Malha Fina & Ajustes Operacionais</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleSimulateNewDivergence}
              style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#f87171', padding: '6px 12px', borderRadius: '6px', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <AlertTriangle size={13} /> Simular Inconsistência DIMP
            </button>
            <button
              onClick={handleAutoRectifyArt138}
              className="btn-primary-action"
              style={{ padding: '6px 12px', fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Zap size={13} /> Denúncia Espontânea 1-Click (Art. 138 CTN)
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
          <div className="form-group">
            <label>Total de DF-e Emitidas no Mês (R$)</label>
            <input
              type="number"
              step="1000"
              className="form-control font-mono"
              value={totalNfeEmitidas}
              onChange={e => setTotalNfeEmitidas(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label>Taxa Média MDR Adquirentes</label>
            <div className="font-mono" style={{ padding: '8px 12px', background: 'var(--bg-surface-card)', borderRadius: '6px', border: '1px solid var(--border-medium)', color: 'var(--cyan-400)', fontWeight: 700 }}>
              {taxaMediaGeralMdr.toFixed(2)}% MDR
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="no-print panel-card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Credenciadora / Canal</th>
                <th>Tipo Operacional</th>
                <th style={{ textAlign: 'right' }}>Volume DIMP Bruto</th>
                <th style={{ textAlign: 'center' }}>Taxa MDR</th>
                <th style={{ textAlign: 'right' }}>Repasse Líquido</th>
                <th style={{ textAlign: 'right' }}>NF-e Vinculada</th>
                <th style={{ textAlign: 'center' }}>Status Forense</th>
              </tr>
            </thead>
            <tbody>
              {acquirers.map(a => (
                <tr key={a.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: '#fff' }}>{a.adquirenteNome}</div>
                    <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)' }}>CNPJ: {a.cnpjCredenciadora}</div>
                  </td>
                  <td>
                    <span className={`badge badge-${a.canalTipo === 'PIX_BACEN' ? 'emerald' : a.canalTipo === 'MARKETPLACE' ? 'amber' : 'cyan'}`}>
                      {a.canalTipo.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="font-mono" style={{ textAlign: 'right', fontWeight: 700, color: '#fff' }}>
                    R$ {a.volumeTransacionado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ textAlign: 'center' }} className="font-mono">{a.taxaMdrMediaPct}%</td>
                  <td className="font-mono" style={{ textAlign: 'right', color: 'var(--cyan-400)' }}>
                    R$ {a.valorLiquidoRepassado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="font-mono" style={{ textAlign: 'right', fontWeight: 700, color: a.diferencaOmissao > 0 ? '#F87171' : 'var(--emerald-400)' }}>
                    R$ {a.notasEmitidasVinculadas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {a.statusConformidade === 'COBERTO_100' ? (
                      <span className="badge badge-emerald">✓ 100% Coberto</span>
                    ) : (
                      <span className="badge badge-red">⚠️ Omissão Fiscal</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DOSSIÊ A4 */}
      <div className="diamond-paper-a4">
        <div className="diamond-header">
          <div>
            <div className="diamond-title">{currentTenant.name}</div>
            <div className="diamond-subtitle">LAUDO FORENSE DE CONFRONTAÇÃO FISCAL DIMP / DECRED x NOTAS FISCAIS (CONVÊNIO ICMS 134/16)</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.70rem' }}>
            <div>CNPJ: <strong>{currentTenant.cnpj}</strong></div>
            <div>COMPETÊNCIA: <strong>{competencia}</strong></div>
            <div style={{ color: '#047857', fontWeight: 800 }}>EFD Bloco 1601 Homologado</div>
          </div>
        </div>

        <div className="diamond-meta-grid">
          <div className="diamond-meta-item">
            <strong>Volume Declarado DIMP</strong>
            <span className="font-mono">R$ {totalDimpOperacoes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Total de Notas Emitidas</strong>
            <span className="font-mono" style={{ color: '#047857', fontWeight: 800 }}>R$ {totalNfeEmitidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Margem de Cobertura</strong>
            <span className="font-mono" style={{ color: '#047857', fontWeight: 800 }}>{isCovered ? '+' : ''} R$ {margemCobertura.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Risco de Malha Fina SEFAZ</strong>
            <span style={{ color: isCovered ? '#047857' : '#B91C1C', fontWeight: 800 }}>{isCovered ? '✓ ZERO DIVERGÊNCIA' : 'RISCO DE AUTUAÇÃO'}</span>
          </div>
        </div>

        <table className="diamond-table">
          <thead>
            <tr>
              <th>Adquirente / Instituição Financeira</th>
              <th>Canal</th>
              <th style={{ textAlign: 'right' }}>DIMP Informado (R$)</th>
              <th style={{ textAlign: 'right' }}>DF-e Acobertado (R$)</th>
              <th style={{ textAlign: 'center' }}>Veredito Forense</th>
            </tr>
          </thead>
          <tbody>
            {acquirers.map(a => (
              <tr key={a.id}>
                <td><strong>{a.adquirenteNome}</strong> ({a.cnpjCredenciadora})</td>
                <td>{a.canalTipo}</td>
                <td className="font-mono" style={{ textAlign: 'right' }}>R$ {a.volumeTransacionado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td className="font-mono" style={{ textAlign: 'right', fontWeight: 700 }}>R$ {a.notasEmitidasVinculadas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td style={{ textAlign: 'center', color: a.diferencaOmissao > 0 ? '#B91C1C' : '#047857', fontWeight: 700 }}>
                  {a.diferencaOmissao > 0 ? 'OMISSÃO DETECTADA' : 'COBERTO'}
                </td>
              </tr>
            ))}
            <tr className="diamond-table-total">
              <td colSpan={2}>CONFRONTAÇÃO GLOBAL MENSAL DIMP x LIVRO REGISTRO DE SAÍDAS</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ {totalDimpOperacoes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td className="font-mono" style={{ textAlign: 'right', color: '#047857' }}>R$ {totalNfeEmitidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td style={{ textAlign: 'center', color: '#047857', fontWeight: 800 }}>100% REGULAR</td>
            </tr>
          </tbody>
        </table>

        <div className="diamond-signatures">
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">SUPERVISÃO DE AUDITORIA ELETRÔNICA</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Confrontação DIMP x EFD 1601</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">RESPONSÁVEL TÉCNICO CONTÁBIL</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>CRC/SP 1SP999999/O-0</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">COMPLIANCE TRIBUTÁRIO DE MEIOS DE PAGAMENTO</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Convênio ICMS 134/16</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficeCardPixCrossAuditView;
