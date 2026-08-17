import React from 'react';

export const CrossBorderMaSafeHarborView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>✈️</span> M&A Cross-Border, Safe Harbors TP (IN 2.161/23) & Ganho de Capital Exterior
        </h2>
        <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Combinação de negócios internacional (CPC 15 / IFRS 3), regime simplificado de preços de transferência e tributação de alienação de ativos no exterior (Lei 12.973).
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* M&A Cross-Border & Goodwill */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>M&A Cross-Border (PPA)</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              CPC 15 / IFRS 3
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Alocação Preço Compra (PPA):</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Valor Justo Identificável</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Goodwill em Moeda Estrangeira:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>Ajuste Acumulado de Conversão (DRA)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Mais-Valia de Ativos:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>Amortização Conforme Vida Útil</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Status Contábil:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>HOMOLOGADO BIG FOUR</span>
            </div>
          </div>
        </div>

        {/* Safe Harbor de Preços de Transferência */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Safe Harbor TP (IN 2.161/23)</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              MARGEM 5% FIXA
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Serviços Intragrupo Elegíveis:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Baixo Valor Agregado (TI / RH / ADM)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Mark-up Padronizado:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>5% sobre Custos Totais</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Dispensa de Benchmarking:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>Alinhamento com Diretrizes da OCDE</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Risco de Ajuste Fiscal:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>ZERO RISCO DE GLOSA</span>
            </div>
          </div>
        </div>

        {/* Ganho de Capital no Exterior */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Ganho de Capital no Exterior</h3>
            <span style={{ background: '#f59e0b20', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              LEI 12.973 ART. 21
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Apuração de Ganho em Moeda Estrangeira:</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>Conversão pelo Câmbio PTAX na data do evento</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Tributação de IRPJ/CSLL:</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>34% sobre Ganho de Capital Líquido</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
