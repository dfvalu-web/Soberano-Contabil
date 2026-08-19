import React from 'react';

export const BenefitsRetView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="no-print" style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={() => window.print()} className="btn-primary-action" style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
          🖨️ Imprimir Dossiê RET Imobiliário 4% (A4)
        </button>
      </div>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>🏢</span> Benefícios Atuariais, RET Imobiliário & Operações Descontinuadas
        </h2>
        <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Gestão de déficits atuariais (CPC 33), alíquota unificada de 4% no RET (Lei 10.931) e ativos mantidos para venda (CPC 31).
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Ativos Mantidos para Venda CPC 31 */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Mantidos para Venda (CPC 31)</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              RECLASSIFICADO
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Ativo em Desinvestimento:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Unidade Fabril Embalagens</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>VCL Original:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>R$ 15.000.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Valor Justo Líquido:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>R$ 14.500.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Status da Depreciação:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>Cessada Imediatamente</span>
            </div>
          </div>
        </div>

        {/* RET Imobiliário 4% */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>RET Incorporação (Lei 10.931)</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              4,00% UNIFICADO
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Receita Mensal Afetada:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>R$ 10.000.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Tributo Unificado (4%):</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>R$ 400.000,00</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              IRPJ 1,26% | CSLL 0,66% | PIS 0,37% | COFINS 1,71%
            </div>
          </div>
        </div>

        {/* Faturamento Antecipado SINIEF */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Entrega Futura (SINIEF 01/03)</h3>
            <span style={{ background: '#f59e0b20', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              CFOP 5.922 & 5.116
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Simples Faturamento (5.922):</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>Sem débito de ICMS/IPI (Passivo CPC 47)</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Remessa Efetiva (5.116):</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>Destaque de tributos e baixa de CPV</div>
            </div>
          </div>
        </div>
      </div>
    
      {/* DOSSIÊ EXECUTIVO OFICIAL (PADRÃO DIAMANTE) */}
      <div className="diamond-paper-a4" style={{ marginTop: '14px' }}>
        <div className="diamond-header">
          <div>
            <div className="diamond-title">INCORPORADORA & CONSTRUTORA SOBERANO S/A</div>
            <div className="diamond-subtitle">DOSSIÊ TRIBUTÁRIO DE REGIME ESPECIAL DE TRIBUTAÇÃO (RET 4% - LEI 10.931/04) & PATRIMÔNIO DE AFETAÇÃO</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.70rem' }}>
            <div>CNPJ / CPF: <strong>00.000.000/0001-00</strong></div>
            <div>COMPETÊNCIA: <strong>08/2026</strong></div>
            <div style={{ color: '#047857', fontWeight: 800 }}>RET 4% LEI 10.931/04</div>
          </div>
        </div>

        <div className="diamond-meta-grid">
          <div className="diamond-meta-item">
            <strong>Receita Bruta Afetada (Mês)</strong>
            <span className="font-mono">R$ 10.000.000,00</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Alíquota Unificada do RET</strong>
            <span className="font-mono" style={{ color: "#047857", fontWeight: 800 }}>4,00% (IRPJ/CSLL/PIS/COF)</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Tributo Unificado a Recolher</strong>
            <span className="font-mono">R$ 400.000,00</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Economia vs Lucro Presumido</strong>
            <span className="font-mono" style={{ color: "#047857", fontWeight: 800 }}>R$ 270.000,00 / mês</span>
          </div>
        </div>

        <table className="diamond-table">
          <thead>
            <tr>
              <th>Demonstrativo Técnico / Rubrica</th>
              <th style={{ textAlign: 'center' }}>Enquadramento</th>
              <th style={{ textAlign: 'right' }}>Valor Consolidado (R$)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>IRPJ Quota Unificada RET (DARF 4095)</td>
              <td style={{ textAlign: 'center' }}>1,26%</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ 126.000,00</td>
            </tr>
            <tr>
              <td>CSLL Quota Unificada RET (DARF 4095)</td>
              <td style={{ textAlign: 'center' }}>0,66%</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ 66.000,00</td>
            </tr>
            <tr>
              <td>PIS/PASEP & COFINS Quota Unificada RET (DARF 4095)</td>
              <td style={{ textAlign: 'center' }}>2,08%</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ 208.000,00</td>
            </tr>
            <tr className="diamond-table-total">
              <td><strong>TOTAL UNIFICADO DO RET A RECOLHER NO DARF 4095</strong></td>
              <td style={{ textAlign: 'center' }}>DARF 4095</td>
              <td className="font-mono" style={{ textAlign: 'right', color: "#047857" }}>R$ 400.000,00</td>
            </tr>
          </tbody>
        </table>

        <div className="diamond-signatures">
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">INCORPORADORA RESPONSÁVEL</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Homologação Oficial</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">RESPONSÁVEL TÉCNICO CONTÁBIL</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Homologação Oficial</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">COMISSÃO DE REPRESENTANTES DOS ADQUIRENTES</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Homologação Oficial</div>
          </div>
        </div>

        <div className="diamond-watermark-seal">
          <div>SOBERANO CONTÁBIL • LAUDO EXECUTIVO DIAMANTE • CERTIFICAÇÃO DIGITAL SHA-256: <code>AA991088BCFF00</code></div>
          <div>PÁGINA 1 DE 1 • DOCUMENTO OFICIAL HOMOLOGADO</div>
        </div>
      </div>
    </div>
  );
};
