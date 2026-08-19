import React from 'react';

export const DvaWealthJcpTaxView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="no-print" style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={() => window.print()} className="btn-primary-action" style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
          🖨️ Imprimir DVA CPC 09 & JCP (A4)
        </button>
      </div>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>💎</span> Demonstração do Valor Adicionado (CPC 09) & Juros s/ Capital Próprio (JCP)
        </h2>
        <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Distribuição da riqueza gerada (pessoal, governo, credores e acionistas) e dedução fiscal de JCP no Lucro Real (Lei 9.249/95 e Lei 14.789/23).
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Demonstração do Valor Adicionado CPC 09 */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Valor Adicionado (CPC 09)</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              DVA CONSISTENTE
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Riqueza Total a Distribuir:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>R$ 11.500.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Pessoal & Encargos (30.43%):</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>R$ 3.500.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Governo / Impostos (34.78%):</span>
              <span style={{ fontWeight: 600, color: '#ef4444' }}>R$ 4.000.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Credores (13%) & Acionistas (21.7%):</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>R$ 4.000.000,00 (Total 100%)</span>
            </div>
          </div>
        </div>

        {/* Juros sobre o Capital Próprio JCP */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>JCP (Lei 9.249 / Lei 14.789)</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              GANHO LÍQUIDO 19%
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>PL Ajustado (excluído incentivos):</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>R$ 28.000.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>JCP Dedutível (TLP 6.80% a.a.):</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>R$ 1.904.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Economia IRPJ/CSLL (34%):</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>+ R$ 647.360,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Ganho Líquido (após 15% IRRF):</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>R$ 361.760,00 de Caixa</span>
            </div>
          </div>
        </div>

        {/* FIDCs CPC 48 & CPR Agro */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>FIDCs & CPRs</h3>
            <span style={{ background: '#f59e0b20', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              CONCILIADO
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Securitização FIDC (CPC 48):</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>Derecognition integral de carteira cedida</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>CPRs Agro e Verde (Lei 13.986):</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>Isenção total de IOF e tributação regressiva</div>
            </div>
          </div>
        </div>
      </div>
    
      {/* DOSSIÊ EXECUTIVO OFICIAL (PADRÃO DIAMANTE) */}
      <div className="diamond-paper-a4" style={{ marginTop: '14px' }}>
        <div className="diamond-header">
          <div>
            <div className="diamond-title">SOBERANO HOLDING & INDUSTRIAL S/A</div>
            <div className="diamond-subtitle">DEMONSTRAÇÃO DO VALOR ADICIONADO (DVA - CPC 09) & JUROS SOBRE CAPITAL PRÓPRIO (JCP)</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.70rem' }}>
            <div>CNPJ / CPF: <strong>00.000.000/0001-00</strong></div>
            <div>COMPETÊNCIA: <strong>08/2026</strong></div>
            <div style={{ color: '#047857', fontWeight: 800 }}>DVA CPC 09 & LEI 9.249/95</div>
          </div>
        </div>

        <div className="diamond-meta-grid">
          <div className="diamond-meta-item">
            <strong>Riqueza Total a Distribuir</strong>
            <span className="font-mono" style={{ color: "#047857", fontWeight: 800 }}>R$ 11.500.000,00</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Pessoal & Encargos</strong>
            <span className="font-mono">R$ 3.500.000,00 (30,4%)</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Governo & Impostos</strong>
            <span className="font-mono">R$ 4.000.000,00 (34,8%)</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Remuneração Acionistas/JCP</strong>
            <span className="font-mono">R$ 4.000.000,00 (34,8%)</span>
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
              <td>1. Pessoal e Encargos Sociais (Salários, Benefícios e FGTS)</td>
              <td style={{ textAlign: 'center' }}>30,43%</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ 3.500.000,00</td>
            </tr>
            <tr>
              <td>2. Impostos, Taxas e Contribuições (Federais, Estaduais, Municipais)</td>
              <td style={{ textAlign: 'center' }}>34,78%</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ 4.000.000,00</td>
            </tr>
            <tr>
              <td>3. Remuneração de Capitais Próprios (Dividendos e JCP)</td>
              <td style={{ textAlign: 'center' }}>34,79%</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ 4.000.000,00</td>
            </tr>
            <tr className="diamond-table-total">
              <td><strong>TOTAL DE VALOR ADICIONADO LÍQUIDO DISTRIBUÍDO</strong></td>
              <td style={{ textAlign: 'center' }}>100%</td>
              <td className="font-mono" style={{ textAlign: 'right', color: "#047857" }}>R$ 11.500.000,00</td>
            </tr>
          </tbody>
        </table>

        <div className="diamond-signatures">
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">DIRETORIA DE RELAÇÕES COM INVESTIDORES</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Homologação Oficial</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">RESPONSÁVEL TÉCNICO CONTÁBIL</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Homologação Oficial</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">COMITÊ DE AUDITORIA & RISCOS</div>
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
