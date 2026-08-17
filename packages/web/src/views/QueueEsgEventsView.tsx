import React from 'react';

export const QueueEsgEventsView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>⚡</span> Filas Assíncronas, Eventos Subsequentes & Mobilidade Verde
        </h2>
        <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Processamento em lote com Dead Letter Queue, eventos pós-balanço (CPC 24), créditos de logística reversa e programa MOVER (Lei 14.902).
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Async Job Queue */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Async Job Queue & DLQ</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              FILA OPERACIONAL
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>JOB-LOTE-DFE-50K</span>
                <span style={{ color: '#10b981', fontWeight: 600 }}>CONCLUÍDO</span>
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '4px' }}>50.000 NF-e processadas e auditadas</div>
            </div>

            <div style={{ background: 'var(--surface-secondary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Dead Letter Queue (DLQ)</span>
                <span style={{ color: '#3b82f6', fontWeight: 600 }}>0 Falhas Críticas</span>
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '4px' }}>Isolamento automático após 3 retries</div>
            </div>
          </div>
        </div>

        {/* Eventos Subsequentes CPC 24 */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Eventos Subsequentes (CPC 24)</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              AUDITORIA BIG 4
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Classificação:</span>
              <span style={{ fontWeight: 600, color: 'var(--accent-color)' }}>Ajustável Retroativo</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Fato:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Sentença Arbitral Transitada</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Ajuste no Balanço:</span>
              <span style={{ fontWeight: 600, color: '#ef4444' }}>R$ 350.000,00</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#10b981', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              ✓ Partidas dobradas geradas em 31/12 retroativamente
            </div>
          </div>
        </div>

        {/* Programa MOVER & Logística Reversa */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Programa MOVER (Lei 14.902)</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              50% CRÉDITO P&D
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Crédito Financeiro IRPJ/CSLL:</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>R$ 2.500.000,00 (50% de R$ 5M P&D)</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Logística Reversa (PNRS):</div>
              <div style={{ fontWeight: 700, color: 'var(--accent-color)', marginTop: '2px' }}>R$ 106.250,00 Créditos PIS/ICMS</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
