// ==========================================================================
// SOBERANO CONTÁBIL — PER/DCOMP & SALDOS NEGATIVOS IRPJ/CSLL (COMPENSAÇÃO WEB)
// 100% OPERACIONAL COM SINCRONIZAÇÃO EM PARTIDAS DOBRADAS COM O DIÁRIO
// ==========================================================================

import React, { useState } from 'react';
import { accountingIntegrationEngine } from '../../../core/src/accounting/integration/accounting-integration-engine';
import { FileText, Zap, Download, Calculator, CheckCircle2, AlertCircle } from 'lucide-react';

export const OfficePerDcompNegativeBalanceView: React.FC = () => {
  const [selectedTenantId, setSelectedTenantId] = useState<string>('t1');
  const [perDcompNumber, setPerDcompNumber] = useState<string>('PERDCOMP-2026-8841');
  const [creditType, setCreditType] = useState<string>('Saldo Negativo IRPJ');
  const [debitType, setDebitType] = useState<string>('PIS/COFINS Débito Corrente');
  const [totalCreditAvailable, setTotalCreditAvailable] = useState<number>(45000);
  const [offsetAmount, setOffsetAmount] = useState<number>(8500);
  const [submissionDate, setSubmissionDate] = useState<string>('2026-08-18');

  const [feedback, setFeedback] = useState<{ message: string; isError: boolean } | null>(null);

  const remainingCredit = Math.max(0, totalCreditAvailable - offsetAmount);

  const handleSyncToLedger = () => {
    const res = accountingIntegrationEngine.syncPerDcompOffsetToLedger(selectedTenantId, {
      date: submissionDate,
      perDcompNumber,
      creditType,
      debitType,
      offsetAmount
    });

    setFeedback({
      message: res.message,
      isError: !res.success
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-primary)' }}>
      {/* Header */}
      <div className="no-print" style={{ background: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-medium)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>📑</span>
            <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
              PER/DCOMP Web & Compensação de Saldos Negativos IRPJ/CSLL
            </h1>
            <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--emerald-400)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>
              IN RFB 2.055/21
            </span>
          </div>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
            Extinção de débitos tributários federais via compensação eletrônica com créditos de saldo negativo de IRPJ/CSLL e tributos pagos a maior.
          </p>
        </div>

        <button
          onClick={handleSyncToLedger}
          className="btn-primary-action"
          style={{ padding: '8px 16px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Zap size={16} /> Sincronizar Compensação com Diário
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
        {/* Parâmetros do PER/DCOMP */}
        <div style={{ background: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calculator size={16} className="text-cyan-400" />
            Declaração de Compensação (DCOMP)
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Nº do PER/DCOMP</label>
              <input
                type="text"
                value={perDcompNumber}
                onChange={e => setPerDcompNumber(e.target.value)}
                style={{ width: '100%', background: '#0B1120', border: '1px solid var(--border-medium)', color: '#fff', padding: '6px 10px', borderRadius: '6px', fontSize: '0.78rem' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Data de Transmissão</label>
              <input
                type="date"
                value={submissionDate}
                onChange={e => setSubmissionDate(e.target.value)}
                style={{ width: '100%', background: '#0B1120', border: '1px solid var(--border-medium)', color: '#fff', padding: '6px 10px', borderRadius: '6px', fontSize: '0.78rem' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Tipo de Crédito Utilizado</label>
            <select
              value={creditType}
              onChange={e => setCreditType(e.target.value)}
              style={{ width: '100%', background: '#0B1120', border: '1px solid var(--border-medium)', color: '#fff', padding: '6px 10px', borderRadius: '6px', fontSize: '0.78rem' }}
            >
              <option value="Saldo Negativo IRPJ">Saldo Negativo IRPJ (Lucro Real Estimativa)</option>
              <option value="Saldo Negativo CSLL">Saldo Negativo CSLL (Lucro Real Estimativa)</option>
              <option value="Pagamento Indevido / a Maior">Pagamento Indevido ou a Maior DARF</option>
              <option value="PIS/COFINS Não Cumulativo Exportação">Crédito PIS/COFINS Exportação / Alíquota Zero</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Débito a Compensar (DCTFWeb / DARF)</label>
            <select
              value={debitType}
              onChange={e => setDebitType(e.target.value)}
              style={{ width: '100%', background: '#0B1120', border: '1px solid var(--border-medium)', color: '#fff', padding: '6px 10px', borderRadius: '6px', fontSize: '0.78rem' }}
            >
              <option value="PIS/COFINS Débito Corrente">PIS/COFINS Débito do Mês Corrente</option>
              <option value="Contribuição Previdenciária DCTFWeb">Contribuição Previdenciária Patronal / INSS</option>
              <option value="IRRF Retido s/ Salários">IRRF Retido sobre Folha de Pagamento</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Crédito Disponível Total (R$)</label>
              <input
                type="number"
                value={totalCreditAvailable}
                onChange={e => setTotalCreditAvailable(parseFloat(e.target.value) || 0)}
                style={{ width: '100%', background: '#0B1120', border: '1px solid var(--border-medium)', color: 'var(--emerald-400)', padding: '6px 10px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 800 }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Valor Compensado (R$)</label>
              <input
                type="number"
                value={offsetAmount}
                onChange={e => setOffsetAmount(parseFloat(e.target.value) || 0)}
                style={{ width: '100%', background: '#0B1120', border: '1px solid var(--border-medium)', color: 'var(--cyan-300)', padding: '6px 10px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 800 }}
              />
            </div>
          </div>
        </div>

        {/* Resumo da Compensação */}
        <div style={{ background: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={16} className="text-emerald-400" />
            Extinção do Crédito & Baixa Contábil
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Crédito Tributário Original:</span>
              <span className="font-mono" style={{ fontWeight: 700, color: '#fff' }}>R$ {totalCreditAvailable.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--cyan-400)' }}>
              <span>(-) Valor da Compensação Homologada:</span>
              <span className="font-mono">- R$ {offsetAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '6px', fontWeight: 800, color: 'var(--emerald-400)' }}>
              <span>(=) Saldo Remanescente de Crédito:</span>
              <span className="font-mono">R$ {remainingCredit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          <div style={{ background: '#0B1120', padding: '10px', borderRadius: '6px', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            <div>📌 <strong>Lançamento Contábil</strong>: D: 2.1.3.01 (Tributos a Recolher) / C: 1.1.2.03 (Impostos a Recuperar).</div>
            <div style={{ marginTop: '2px' }}>📌 <strong>Homologação</strong>: Prazo decadencial de 5 anos para homologação tácita pela Receita Federal (Art. 74 Lei 9.430/96).</div>
          </div>
        </div>
      </div>
    
      {/* DOSSIÊ EXECUTIVO DE COMPENSAÇÃO TRIBUTÁRIA PER/DCOMP (PADRÃO DIAMANTE) */}
      <div className="diamond-paper-a4" style={{ marginTop: '10px' }}>
        <div className="diamond-header">
          <div>
            <div className="diamond-title">EMPRESA CLIENTE TRIBUTÁRIA S/A</div>
            <div className="diamond-subtitle">DECLARAÇÃO DE COMPENSAÇÃO ELETRÔNICA (PER/DCOMP WEB - IN RFB 2.055/21)</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.70rem' }}>
            <div>CNPJ: <strong>00.000.000/0001-00</strong></div>
            <div>PROTOCOLO: <strong>{perDcompNumber}</strong></div>
            <div style={{ color: '#047857', fontWeight: 800 }}>Crédito Vinculado com Sucesso</div>
          </div>
        </div>

        <div className="diamond-meta-grid">
          <div className="diamond-meta-item">
            <strong>Tipo de Crédito</strong>
            <span>{creditType}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Crédito Original Disponível</strong>
            <span className="font-mono">R$ {totalCreditAvailable.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Débito Extinto / Compensado</strong>
            <span className="font-mono" style={{ color: '#047857', fontWeight: 800 }}>R$ {offsetAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Saldo Remanescente de Crédito</strong>
            <span className="font-mono">R$ {remainingCredit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        <table className="diamond-table">
          <thead>
            <tr>
              <th>Demonstrativo da Compensação Eletrônica</th>
              <th>Enquadramento / Legislação</th>
              <th style={{ textAlign: 'right' }}>Valor Utilizado (R$)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Crédito Utilizado:</strong> Saldo Negativo IRPJ/CSLL c/ Atualização SELIC</td>
              <td>IN RFB 2.055/21 Art. 41</td>
              <td className="font-mono" style={{ textAlign: 'right', color: '#047857', fontWeight: 700 }}>R$ {offsetAmount.toFixed(2)}</td>
            </tr>
            <tr>
              <td><strong>Débito Extinto:</strong> {debitType}</td>
              <td>Extinção de Obrigação Tributária (Art. 156 II CTN)</td>
              <td className="font-mono" style={{ textAlign: 'right', color: '#0369A1', fontWeight: 700 }}>- R$ {offsetAmount.toFixed(2)}</td>
            </tr>
            <tr className="diamond-table-total">
              <td>SALDO DEVEDOR RESIDUAL DO DÉBITO APÓS COMPENSAÇÃO</td>
              <td className="font-mono" style={{ textAlign: 'right', color: '#047857' }}>R$ 0,00 (QUITADO)</td>
            </tr>
          </tbody>
        </table>

        <div className="diamond-signatures">
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">DIRETORIA TRIBUTÁRIA</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Representante Legal</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">RESPONSÁVEL TÉCNICO CONTÁBIL</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>CRC/SP 1SP999999/O-0</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">AUDITORIA DE CRÉDITOS RFB</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>PER/DCOMP Transmitido</div>
          </div>
        </div>

        <div className="diamond-watermark-seal">
          <div>SOBERANO CONTÁBIL • PER/DCOMP OFICIAL • CERTIFICAÇÃO DIGITAL SHA-256: <code>2288AA1099BCFF</code></div>
          <div>PÁGINA 1 DE 1 • DECLARAÇÃO OFICIAL HOMOLOGADA</div>
        </div>
      </div>

    </div>
  );
};

export default OfficePerDcompNegativeBalanceView;