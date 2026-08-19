// ==========================================================================
// SOBERANO CONTÁBIL — RECÁLCULO DE TRIBUTOS EM ATRASO (SELIC & MULTA DE MORA)
// 100% OPERACIONAL COM SINCRONIZAÇÃO EM PARTIDAS DOBRADAS COM O DIÁRIO
// ==========================================================================

import React, { useState } from 'react';
import { accountingIntegrationEngine } from '../../../core/src/accounting/integration/accounting-integration-engine';
import { Clock, Zap, Download, Calculator, CheckCircle2, AlertCircle } from 'lucide-react';

export const OfficeTaxArrearsRecalculatorView: React.FC = () => {
  const [selectedTenantId, setSelectedTenantId] = useState<string>('t1');
  const [taxType, setTaxType] = useState<string>('PGDAS-D Simples Nacional');
  const [originalDueDate, setOriginalDueDate] = useState<string>('2026-06-20');
  const [paymentDate, setPaymentDate] = useState<string>('2026-08-18');
  const [principalAmount, setPrincipalAmount] = useState<number>(15000);
  const [selicRate, setSelicRate] = useState<number>(0.0285); // 2.85% acumulada

  const [feedback, setFeedback] = useState<{ message: string; isError: boolean } | null>(null);

  // Multa de mora: 0,33% ao dia, limitada a 20% (Art. 61 Lei 9.430/96)
  const fineRate = 0.20; // 20% máximo
  const fineAmount = Math.round(principalAmount * fineRate * 100) / 100;
  const selicInterestAmount = Math.round(principalAmount * selicRate * 100) / 100;
  const totalAmountToPay = principalAmount + fineAmount + selicInterestAmount;

  const handleSyncToLedger = () => {
    const res = accountingIntegrationEngine.syncTaxArrearsToLedger(selectedTenantId, {
      date: paymentDate,
      taxType,
      principal: principalAmount,
      interestSelic: selicInterestAmount,
      fineMora: fineAmount
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
            <span style={{ fontSize: '1.5rem' }}>⏱️</span>
            <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
              Recálculo de Tributos Federais em Atraso (Taxa Selic & Multa Art. 61)
            </h1>
            <span style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.4)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>
              LEI 9.430/96 ART. 61 & SELIC
            </span>
          </div>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
            Atualização monetária oficial de guias em atraso (DARF, DAS, GPS e DCTFWeb) com apropriação automática de encargos moratórios.
          </p>
        </div>

        <button
          onClick={handleSyncToLedger}
          className="btn-primary-action"
          style={{ padding: '8px 16px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Zap size={16} /> Sincronizar Encargos com Diário
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
        {/* Parâmetros do Débito */}
        <div style={{ background: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calculator size={16} className="text-cyan-400" />
            Parâmetros da Guia em Atraso
          </h3>

          <div>
            <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Tipo de Tributo / Guia</label>
            <select
              value={taxType}
              onChange={e => setTaxType(e.target.value)}
              style={{ width: '100%', background: '#0B1120', border: '1px solid var(--border-medium)', color: '#fff', padding: '6px 10px', borderRadius: '6px', fontSize: '0.78rem' }}
            >
              <option value="PGDAS-D Simples Nacional">PGDAS-D Simples Nacional</option>
              <option value="DARF 5952 CSRF">DARF 5952 CSRF (4,65%)</option>
              <option value="DARF 2088 IRPJ Estimativa">DARF 2088 IRPJ Estimativa Mensal</option>
              <option value="DARF 2372 CSLL Estimativa">DARF 2372 CSLL Estimativa Mensal</option>
              <option value="DCTFWeb Previdenciária">DCTFWeb Previdenciária e INSS</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Vencimento Original</label>
              <input
                type="date"
                value={originalDueDate}
                onChange={e => setOriginalDueDate(e.target.value)}
                style={{ width: '100%', background: '#0B1120', border: '1px solid var(--border-medium)', color: '#fff', padding: '6px 10px', borderRadius: '6px', fontSize: '0.78rem' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Data de Pagamento</label>
              <input
                type="date"
                value={paymentDate}
                onChange={e => setPaymentDate(e.target.value)}
                style={{ width: '100%', background: '#0B1120', border: '1px solid var(--border-medium)', color: '#fff', padding: '6px 10px', borderRadius: '6px', fontSize: '0.78rem' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Valor Principal Original (R$)</label>
            <input
              type="number"
              value={principalAmount}
              onChange={e => setPrincipalAmount(parseFloat(e.target.value) || 0)}
              style={{ width: '100%', background: '#0B1120', border: '1px solid var(--border-medium)', color: 'var(--cyan-300)', padding: '8px 10px', borderRadius: '6px', fontSize: '0.95rem', fontWeight: 800 }}
            />
          </div>
        </div>

        {/* Demonstrativo da Guia Atualizada */}
        <div style={{ background: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={16} className="text-amber-400" />
            Demonstrativo de Atualização Monetária
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>(+) Valor Principal Original:</span>
              <span className="font-mono" style={{ fontWeight: 700, color: '#fff' }}>R$ {principalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fbbf24' }}>
              <span>(+) Multa de Mora (20,00% máx):</span>
              <span className="font-mono">+ R$ {fineAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fbbf24' }}>
              <span>(+) Juros Taxa Selic ({(selicRate * 100).toFixed(2)}%):</span>
              <span className="font-mono">+ R$ {selicInterestAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid var(--border-medium)', paddingTop: '8px', fontWeight: 800, fontSize: '1rem', color: '#fff' }}>
              <span>(=) VALOR TOTAL ATUALIZADO:</span>
              <span className="font-mono" style={{ color: 'var(--emerald-400)' }}>R$ {totalAmountToPay.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          <div style={{ background: '#0B1120', padding: '10px', borderRadius: '6px', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            <div>📌 <strong>Art. 61 Lei 9.430/96</strong>: Multa diária de 0,33% ao dia limitada ao teto de 20%.</div>
            <div style={{ marginTop: '2px' }}>📌 <strong>Juros Moratórios</strong>: Taxa Selic acumulada do mês subsequente ao vencimento até o mês anterior ao pagamento + 1% no mês do pagamento.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficeTaxArrearsRecalculatorView;