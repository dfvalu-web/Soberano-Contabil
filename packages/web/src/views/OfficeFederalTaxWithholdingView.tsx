// ==========================================================================
// SOBERANO CONTÁBIL — RETENÇÕES FEDERAIS CSRF 4,65% & IRRF 1,5% (EFD-REINF)
// 100% OPERACIONAL COM SINCRONIZAÇÃO EM PARTIDAS DOBRADAS COM O DIÁRIO
// ==========================================================================

import React, { useState } from 'react';
import { accountingIntegrationEngine } from '../../../core/src/accounting/integration/accounting-integration-engine';
import { ShieldCheck, Zap, Download, Calculator, CheckCircle2, AlertCircle } from 'lucide-react';

export const OfficeFederalTaxWithholdingView: React.FC = () => {
  const [selectedTenantId, setSelectedTenantId] = useState<string>('t1');
  const [grossAmount, setGrossAmount] = useState<number>(10000);
  const [providerName, setProviderName] = useState<string>('Tech Consulting & Auditoria Ltda');
  const [invoiceNumber, setInvoiceNumber] = useState<string>('NF-9821');
  const [serviceDate, setServiceDate] = useState<string>('2026-08-18');
  const [hasCsrf, setHasCsrf] = useState<boolean>(true);
  const [hasIrrf, setHasIrrf] = useState<boolean>(true);
  const [hasIss, setHasIss] = useState<boolean>(false);
  const [issRate, setIssRate] = useState<number>(0.02);

  const [feedback, setFeedback] = useState<{ message: string; isError: boolean } | null>(null);

  // Cálculos determinísticos
  const csrfAmount = hasCsrf ? Math.round(grossAmount * 0.0465 * 100) / 100 : 0;
  const pisAmount = hasCsrf ? Math.round(grossAmount * 0.0065 * 100) / 100 : 0;
  const cofinsAmount = hasCsrf ? Math.round(grossAmount * 0.0300 * 100) / 100 : 0;
  const csllAmount = hasCsrf ? Math.round(grossAmount * 0.0100 * 100) / 100 : 0;
  const irrfAmount = hasIrrf ? Math.round(grossAmount * 0.0150 * 100) / 100 : 0;
  const issAmount = hasIss ? Math.round(grossAmount * issRate * 100) / 100 : 0;

  const totalRetentions = csrfAmount + irrfAmount + issAmount;
  const netAmount = grossAmount - totalRetentions;

  const handleSyncToLedger = () => {
    const res = accountingIntegrationEngine.syncFiscalWithholdingsToLedger(selectedTenantId, {
      date: serviceDate,
      providerName,
      invoiceNumber,
      grossAmount,
      csrfAmount,
      irrfAmount,
      issAmount
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
            <span style={{ fontSize: '1.5rem' }}>🏛️</span>
            <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
              Retenções Federais & Municipais (CSRF 4,65%, IRRF 1,5% & EFD-Reinf R-4020)
            </h1>
            <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--emerald-400)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>
              100% SINCRONIZADO COM DIÁRIO
            </span>
          </div>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
            Apuração exata de PIS (0,65%), COFINS (3,00%), CSLL (1,00%), IRRF (1,50%) sobre serviços tomados (Lei 10.833/03 e RIR/18) e geração do DARF 5952 / 1708.
          </p>
        </div>

        <button
          onClick={handleSyncToLedger}
          className="btn-primary-action"
          style={{ padding: '8px 16px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Zap size={16} /> Sincronizar com o Diário Contábil
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

      {/* Formulário Interativo & Painéis */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Painel de Parâmetros */}
        <div style={{ background: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calculator size={16} className="text-cyan-400" />
            Parâmetros do Serviço Tomado
          </h3>

          <div>
            <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Prestador de Serviços (PJ)</label>
            <input
              type="text"
              value={providerName}
              onChange={e => setProviderName(e.target.value)}
              style={{ width: '100%', background: '#0B1120', border: '1px solid var(--border-medium)', color: '#fff', padding: '6px 10px', borderRadius: '6px', fontSize: '0.78rem' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Nº da Nota / NFS-e</label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={e => setInvoiceNumber(e.target.value)}
                style={{ width: '100%', background: '#0B1120', border: '1px solid var(--border-medium)', color: '#fff', padding: '6px 10px', borderRadius: '6px', fontSize: '0.78rem' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Data da Emissão</label>
              <input
                type="date"
                value={serviceDate}
                onChange={e => setServiceDate(e.target.value)}
                style={{ width: '100%', background: '#0B1120', border: '1px solid var(--border-medium)', color: '#fff', padding: '6px 10px', borderRadius: '6px', fontSize: '0.78rem' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Valor Bruto do Serviço (R$)</label>
            <input
              type="number"
              value={grossAmount}
              onChange={e => setGrossAmount(parseFloat(e.target.value) || 0)}
              style={{ width: '100%', background: '#0B1120', border: '1px solid var(--border-medium)', color: 'var(--cyan-300)', padding: '8px 10px', borderRadius: '6px', fontSize: '1rem', fontWeight: 800 }}
            />
          </div>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#fff', cursor: 'pointer' }}>
              <input type="checkbox" checked={hasCsrf} onChange={e => setHasCsrf(e.target.checked)} />
              Retenção CSRF (4,65%)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#fff', cursor: 'pointer' }}>
              <input type="checkbox" checked={hasIrrf} onChange={e => setHasIrrf(e.target.checked)} />
              Retenção IRRF (1,50%)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#fff', cursor: 'pointer' }}>
              <input type="checkbox" checked={hasIss} onChange={e => setHasIss(e.target.checked)} />
              Retenção ISS Tomador (2,00%)
            </label>
          </div>
        </div>

        {/* Painel de Apuração e Demonstrativo */}
        <div style={{ background: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={16} className="text-emerald-400" />
            Demonstrativo de Retenções na Fonte
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>(+) Valor Bruto do Serviço:</span>
              <span className="font-mono" style={{ fontWeight: 700, color: '#fff' }}>R$ {grossAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f87171' }}>
              <span>(-) PIS Retido (0,65%):</span>
              <span className="font-mono">- R$ {pisAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f87171' }}>
              <span>(-) COFINS Retido (3,00%):</span>
              <span className="font-mono">- R$ {cofinsAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f87171' }}>
              <span>(-) CSLL Retida (1,00%):</span>
              <span className="font-mono">- R$ {csllAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f87171' }}>
              <span>(-) IRRF Retido (1,50%):</span>
              <span className="font-mono">- R$ {irrfAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            {hasIss && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f87171' }}>
                <span>(-) ISS Tomador Retido (2,00%):</span>
                <span className="font-mono">- R$ {issAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '6px', fontWeight: 700, color: 'var(--cyan-400)' }}>
              <span>(=) Total de Tributos Retidos:</span>
              <span className="font-mono">R$ {totalRetentions.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid var(--border-medium)', paddingTop: '8px', fontWeight: 800, fontSize: '0.95rem', color: 'var(--emerald-400)' }}>
              <span>(=) Líquido a Pagar ao Fornecedor:</span>
              <span className="font-mono">R$ {netAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          <div style={{ background: '#0B1120', padding: '10px', borderRadius: '6px', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            <div>📌 <strong>DARF 5952</strong>: CSRF R$ {csrfAmount.toFixed(2)} (Vencimento até o último dia útil do 2º decêndio do mês subsequente).</div>
            <div style={{ marginTop: '2px' }}>📌 <strong>DARF 1708</strong>: IRRF R$ {irrfAmount.toFixed(2)} • Evento <strong>EFD-Reinf R-4020</strong>.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficeFederalTaxWithholdingView;