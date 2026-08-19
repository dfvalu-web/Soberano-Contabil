// ==========================================================================
// SOBERANO CONTÁBIL — ESTOQUES & INVENTÁRIO SPED (BLOCO H / BLOCO K)
// 100% OPERACIONAL COM SINCRONIZAÇÃO EM PARTIDAS DOBRADAS COM O DIÁRIO
// ==========================================================================

import React, { useState } from 'react';
import { accountingIntegrationEngine } from '../../../core/src/accounting/integration/accounting-integration-engine';
import { Package, Zap, Download, Calculator, CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';

export const OfficeInventoryBlockHKTaxAdjustmentView: React.FC = () => {
  const [selectedTenantId, setSelectedTenantId] = useState<string>('t1');
  const [itemCode, setItemCode] = useState<string>('PROD-882');
  const [itemName, setItemName] = useState<string>('Insumo Químico Reagente Grau Industrial');
  const [unitOfMeasure, setUnitOfMeasure] = useState<string>('KG');
  const [physicalQuantity, setPhysicalQuantity] = useState<number>(1200);
  const [unitCost, setUnitCost] = useState<number>(45.00);
  const [lossQuantity, setLossQuantity] = useState<number>(50);
  const [lossReason, setLossReason] = useState<string>('Avaria no transporte e umidade em armazém');
  const [adjustmentDate, setAdjustmentDate] = useState<string>('2026-08-18');

  const [feedback, setFeedback] = useState<{ message: string; isError: boolean } | null>(null);

  const totalInventoryValue = physicalQuantity * unitCost;
  const totalLossValue = lossQuantity * unitCost;
  const finalAdjustedQuantity = Math.max(0, physicalQuantity - lossQuantity);
  const finalAdjustedValue = finalAdjustedQuantity * unitCost;

  const handleSyncAdjustmentToLedger = () => {
    const res = accountingIntegrationEngine.syncInventoryAdjustmentToLedger(selectedTenantId, {
      date: adjustmentDate,
      reason: lossReason,
      adjustmentAmount: totalLossValue,
      itemCode,
      itemName
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
            <span style={{ fontSize: '1.5rem' }}>📦</span>
            <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
              Estoques & Inventário SPED (Bloco H / Bloco K & Ajuste CFOP 5.927)
            </h1>
            <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--emerald-400)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>
              CPC 16 / RIR 2018
            </span>
          </div>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
            Auditoria de inventário físico (Registro H010) vs produção (K200), conciliação com Balanço Patrimonial e ajuste contábil/fiscal de perdas e quebras.
          </p>
        </div>

        <button
          onClick={handleSyncAdjustmentToLedger}
          className="btn-primary-action"
          style={{ padding: '8px 16px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Zap size={16} /> Sincronizar Ajuste com Diário Contábil
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
        {/* Dados do Item & Inventário */}
        <div style={{ background: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Package size={16} className="text-cyan-400" />
            Item do Estoque (Registro H010)
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Código do Item</label>
              <input
                type="text"
                value={itemCode}
                onChange={e => setItemCode(e.target.value)}
                style={{ width: '100%', background: '#0B1120', border: '1px solid var(--border-medium)', color: '#fff', padding: '6px 10px', borderRadius: '6px', fontSize: '0.78rem' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Descrição da Mercadoria / Insumo</label>
              <input
                type="text"
                value={itemName}
                onChange={e => setItemName(e.target.value)}
                style={{ width: '100%', background: '#0B1120', border: '1px solid var(--border-medium)', color: '#fff', padding: '6px 10px', borderRadius: '6px', fontSize: '0.78rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Qtd Contada no Inventário</label>
              <input
                type="number"
                value={physicalQuantity}
                onChange={e => setPhysicalQuantity(parseFloat(e.target.value) || 0)}
                style={{ width: '100%', background: '#0B1120', border: '1px solid var(--border-medium)', color: 'var(--cyan-300)', padding: '6px 10px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 800 }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Custo Médio Unitário (R$)</label>
              <input
                type="number"
                step="0.01"
                value={unitCost}
                onChange={e => setUnitCost(parseFloat(e.target.value) || 0)}
                style={{ width: '100%', background: '#0B1120', border: '1px solid var(--border-medium)', color: '#fff', padding: '6px 10px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 800 }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '0.74rem', color: '#f87171', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Qtd Avariada / Quebra</label>
              <input
                type="number"
                value={lossQuantity}
                onChange={e => setLossQuantity(parseFloat(e.target.value) || 0)}
                style={{ width: '100%', background: '#0B1120', border: '1px solid rgba(239,68,68,0.4)', color: '#f87171', padding: '6px 10px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 800 }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Motivo do Sinistro / Ajuste</label>
              <input
                type="text"
                value={lossReason}
                onChange={e => setLossReason(e.target.value)}
                style={{ width: '100%', background: '#0B1120', border: '1px solid var(--border-medium)', color: '#fff', padding: '6px 10px', borderRadius: '6px', fontSize: '0.78rem' }}
              />
            </div>
          </div>
        </div>

        {/* Resumo do Inventário & Ajuste */}
        <div style={{ background: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calculator size={16} className="text-emerald-400" />
            Valorização Contábil & Fiscal
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Valor Total Bruto do Estoque:</span>
              <span className="font-mono" style={{ fontWeight: 700, color: '#fff' }}>R$ {totalInventoryValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f87171' }}>
              <span>(-) Baixa de Perdas e Quebras (CFOP 5.927):</span>
              <span className="font-mono">- R$ {totalLossValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ({lossQuantity} {unitOfMeasure})</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '6px', fontWeight: 800, fontSize: '1rem', color: 'var(--emerald-400)' }}>
              <span>(=) Estoque Final Líquido Ajustado:</span>
              <span className="font-mono">R$ {finalAdjustedValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ({finalAdjustedQuantity} {unitOfMeasure})</span>
            </div>
          </div>

          <div style={{ background: '#0B1120', padding: '10px', borderRadius: '6px', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            <div>📌 <strong>Lançamento Contábil</strong>: D: 4.1.3.01 (Perdas em Estoque) / C: 1.1.3.01 (Estoques).</div>
            <div style={{ marginTop: '2px' }}>📌 <strong>Emissão NF-e</strong>: CFOP 5.927 (Lançamento efetuado a título de baixa de estoque decorrente de perda, roubo ou deterioração).</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficeInventoryBlockHKTaxAdjustmentView;