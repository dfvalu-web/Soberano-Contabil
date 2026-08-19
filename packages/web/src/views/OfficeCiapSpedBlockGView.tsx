// ==========================================================================
// SOBERANO CONTÁBIL — CIAP BLOCO G (1/48 AVOS ICMS ATIVO IMOBILIZADO)
// 100% OPERACIONAL COM SINCRONIZAÇÃO EM PARTIDAS DOBRADAS COM O DIÁRIO
// ==========================================================================

import React, { useState } from 'react';
import { accountingIntegrationEngine } from '../../../core/src/accounting/integration/accounting-integration-engine';
import { Layers, Zap, Download, Calculator, CheckCircle2, AlertCircle } from 'lucide-react';

export const OfficeCiapSpedBlockGView: React.FC = () => {
  const [selectedTenantId, setSelectedTenantId] = useState<string>('t1');
  const [assetName, setAssetName] = useState<string>('Torno CNC Industrial Multieixos 5 Eixos');
  const [invoiceNumber, setInvoiceNumber] = useState<string>('NF-44120');
  const [totalIcmsAsset, setTotalIcmsAsset] = useState<number>(60000);
  const [currentParcel, setCurrentParcel] = useState<number>(14);
  const [taxedSales, setTaxedSales] = useState<number>(450000);
  const [totalSales, setTotalSales] = useState<number>(500000);
  const [competencia, setCompetencia] = useState<string>('2026-08');

  const [feedback, setFeedback] = useState<{ message: string; isError: boolean } | null>(null);

  // Fator de saídas tributadas (Art. 20 § 5º LC 87/96)
  const factor = totalSales > 0 ? Math.min(1, Math.max(0, taxedSales / totalSales)) : 1;
  const baseMonthlyQuota = totalIcmsAsset / 48;
  const monthlyCredit = Math.round(baseMonthlyQuota * factor * 100) / 100;
  const remainingParcels = 48 - currentParcel;
  const remainingBalance = Math.round((totalIcmsAsset - (baseMonthlyQuota * currentParcel)) * 100) / 100;

  const handleSyncToLedger = () => {
    const res = accountingIntegrationEngine.syncCiapCreditToLedger(selectedTenantId, {
      date: `${competencia}-28`,
      competencia,
      monthlyCreditAmount: monthlyCredit,
      assetName,
      parcelNumber: currentParcel
    });

    setFeedback({
      message: res.message,
      isError: !res.success
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-primary)' }}>
      {/* Header */}
      <div style={{ background: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-medium)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>🏗️</span>
            <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
              CIAP Bloco G — Apropriação de ICMS sobre Imobilizado (1/48 Avos)
            </h1>
            <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--emerald-400)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>
              SPED FISCAL BLOCO G & LC 87/96
            </span>
          </div>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
            Controle das 48 quotas mensais de crédito de ICMS sobre bens do Ativo Permanente, coeficiente de saídas tributadas e contabilização automática.
          </p>
        </div>

        <button
          onClick={handleSyncToLedger}
          className="btn-primary-action"
          style={{ padding: '8px 16px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Zap size={16} /> Sincronizar Crédito CIAP com Diário
        </button>
      </div>

      {feedback && (
        <div style={{
          padding: '12px 16px',
          borderRadius: '8px',
          background: feedback.isError ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
          border: `1px solid ${feedback.isError ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`,
          color: feedback.isError ? '#f87171' : 'var(--emerald-300)',
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          {feedback.isError ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Painéis */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Parâmetros do Bem */}
        <div style={{ background: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calculator size={16} className="text-cyan-400" />
            Dados do Bem & Coeficiente de Saídas
          </h3>

          <div>
            <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Descrição do Bem Imobilizado</label>
            <input
              type="text"
              value={assetName}
              onChange={e => setAssetName(e.target.value)}
              style={{ width: '100%', background: '#0B1120', border: '1px solid var(--border-medium)', color: '#fff', padding: '6px 10px', borderRadius: '6px', fontSize: '0.78rem' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>ICMS Destacado Total (R$)</label>
              <input
                type="number"
                value={totalIcmsAsset}
                onChange={e => setTotalIcmsAsset(parseFloat(e.target.value) || 0)}
                style={{ width: '100%', background: '#0B1120', border: '1px solid var(--border-medium)', color: 'var(--cyan-300)', padding: '6px 10px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 800 }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Parcela Atual (de 48)</label>
              <input
                type="number"
                min="1"
                max="48"
                value={currentParcel}
                onChange={e => setCurrentParcel(parseInt(e.target.value) || 1)}
                style={{ width: '100%', background: '#0B1120', border: '1px solid var(--border-medium)', color: '#fff', padding: '6px 10px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 800 }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Saídas Tributadas (R$)</label>
              <input
                type="number"
                value={taxedSales}
                onChange={e => setTaxedSales(parseFloat(e.target.value) || 0)}
                style={{ width: '100%', background: '#0B1120', border: '1px solid var(--border-medium)', color: '#fff', padding: '6px 10px', borderRadius: '6px', fontSize: '0.78rem' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Saídas Totais do Mês (R$)</label>
              <input
                type="number"
                value={totalSales}
                onChange={e => setTotalSales(parseFloat(e.target.value) || 0)}
                style={{ width: '100%', background: '#0B1120', border: '1px solid var(--border-medium)', color: '#fff', padding: '6px 10px', borderRadius: '6px', fontSize: '0.78rem' }}
              />
            </div>
          </div>
        </div>

        {/* Ficha CIAP & Apuração */}
        <div style={{ background: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={16} className="text-emerald-400" />
            Ficha de Crédito Mensal CIAP (Bloco G125/G126)
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Quota Teórica Mensal (1/48):</span>
              <span className="font-mono" style={{ fontWeight: 700, color: '#fff' }}>R$ {baseMonthlyQuota.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Fator de Saídas Tributadas:</span>
              <span className="font-mono" style={{ fontWeight: 700, color: 'var(--cyan-400)' }}>{(factor * 100).toFixed(2)}% ({taxedSales} / {totalSales})</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '6px', fontWeight: 800, fontSize: '1rem', color: 'var(--emerald-400)' }}>
              <span>(=) Crédito de ICMS Apropriável no Mês:</span>
              <span className="font-mono">R$ {monthlyCredit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Parcelas Restantes:</span>
              <span>{remainingParcels} parcelas de 48</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Saldo Remanescente a Apropriar:</span>
              <span className="font-mono">R$ {remainingBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          <div style={{ background: '#0B1120', padding: '10px', borderRadius: '6px', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            <div>📌 <strong>Lançamento Contábil</strong>: D: 1.1.2.03 (ICMS a Recuperar) / C: 1.2.1.01 (Imobilizado)</div>
            <div style={{ marginTop: '2px' }}>📌 <strong>EFD-ICMS/IPI</strong>: Registros <strong>G110</strong> (Totalização), <strong>G125</strong> (Bem) e <strong>G126</strong> (Outorga).</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficeCiapSpedBlockGView;