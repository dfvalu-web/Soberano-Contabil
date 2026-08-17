import React from 'react';

export const AgriDerivativesView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>🌾</span> Agronegócio, Derivativos Cambiais & Webhooks
        </h2>
        <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Valoração de ativos biológicos (CPC 29), gestão de contratos a termo NDF com Hedge Accounting e despacho de eventos em tempo real.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Ativos Biológicos */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Ativos Biológicos (CPC 29)</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              +R$ 400.000,00 Variação
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Rebanho Bovino Nelore (500 cabeças)</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>R$ 1.900.000,00</div>
              <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '2px' }}>Valor Justo Líquido (R$ 3.800,00 / cab)</div>
            </div>

            <div style={{ background: 'var(--surface-secondary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Safra de Soja 2026 (20.000 sacas)</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>R$ 2.600.000,00</div>
              <div style={{ fontSize: '0.75rem', color: '#3b82f6', marginTop: '2px' }}>Livro Caixa Digital do Produtor (LCDPR)</div>
            </div>
          </div>
        </div>

        {/* Derivativos NDF */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Derivativos NDF (CPC 48)</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              Hedge de Fluxo de Caixa (DRA)
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Contrato:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>NDF-USD-SOJA-2026</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Montante Nocional:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>US$ 1.000.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Taxa Termo x Spot:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>R$ 5,20 x R$ 5,50</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', paddingTop: '8px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Ganho no PL (DRA):</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>+R$ 300.000,00</span>
            </div>
          </div>
        </div>

        {/* Webhook Dispatcher */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Webhooks (HMAC-SHA256)</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              ONLINE (200 OK)
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontWeight: 600, color: 'var(--accent-color)' }}>EVT-DFE-AUTORIZADA</div>
              <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>https://api.erp-legado.com.br/webhooks</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontWeight: 600, color: 'var(--accent-color)' }}>EVT-FECHAMENTO-MENSAL</div>
              <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>Assinatura: sha256=9f83ab...</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
