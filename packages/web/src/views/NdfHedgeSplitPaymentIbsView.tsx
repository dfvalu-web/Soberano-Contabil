import React from 'react';

export const NdfHedgeSplitPaymentIbsView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>📈</span> NDF Hedge Cambial (CPC 48) & Split Payment IBS/CBS (Reforma EC 132/23)
        </h2>
        <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Contabilidade de cobertura para derivativos cambiais em DRA/PL e liquidação bancária com retenção automática de IBS/CBS via BACEN.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* NDF Hedge Accounting CPC 48 */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>NDF Hedge (CPC 48 / IFRS 9)</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              EFICÁCIA 98% (PL/DRA)
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Nocional Protegido:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>US$ 1.000.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Taxa Contratada vs Atual:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>R$ 5,2000 ➔ R$ 5,5000</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Valor Justo do Ativo NDF:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>+ R$ 300.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Destinação Contábil:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>R$ 294k no PL (DRA) / R$ 6k na DRE</span>
            </div>
          </div>
        </div>

        {/* Split Payment IBS/CBS EC 132/23 */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Split Payment IBS / CBS</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              LIQUIDAÇÃO BACEN PIX
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Fatura Bruta da Operação:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>R$ 100.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Crédito Líquido ao Fornecedor:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>R$ 73.700,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Retenção Split (IBS 17.5% + CBS 8.8%):</span>
              <span style={{ fontWeight: 600, color: '#ef4444' }}>R$ 26.300,00 (Direto para RFB/Comitê)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Crédito Financeiro Adquirente:</span>
              <span style={{ fontWeight: 700, color: '#3b82f6' }}>R$ 26.300,00 Instantâneo no Domicílio</span>
            </div>
          </div>
        </div>

        {/* PVA SPED & SOC 2 Pilar 6 */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>PVA SPED & SOC 2</h3>
            <span style={{ background: '#f59e0b20', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              CONCILIADO
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Validação PVA Oficial RFB:</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>Zero erros e compatibilidade ReceitaNet</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Certificação SOC 2 / ISO 27001:</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>100% de controles auditados</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
