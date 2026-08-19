import React from 'react';

export const CattleAgroLcdprView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="no-print" style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={() => window.print()} className="btn-primary-action" style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
          🖨️ Imprimir Dossiê Agro & LCDPR (A4)
        </button>
      </div>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>🐂</span> Pecuária de Corte (CPC 29) & LCDPR / IRPF Rural (Lei 8.023)
        </h2>
        <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Mensuração de rebanho bovino a valor justo por arroba (CPC 29) e Livro Caixa Digital do Produtor Rural com planejamento tributário IRPF.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Pecuária CPC 29 Valor Justo */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Rebanho Bovino (CPC 29)</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              VALOR JUSTO / ARROBA
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Rebanho em Engorda:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>5.000 cabeças (90.000 @)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Cotação de Mercado:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>R$ 240,00 / @ (R$ 21,6M Bruto)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Valor Justo Líquido (Balanço):</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>R$ 20.952.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Ganho de Transformação Biológica:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>+ R$ 5.952.000,00 na DRE</span>
            </div>
          </div>
        </div>

        {/* LCDPR & IRPF Rural */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>LCDPR & IRPF Rural</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              LEI 8.023/90
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Receita da Safra / Boi Gordo:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>R$ 15.000.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Despesas de Custeio / Máquinas:</span>
              <span style={{ fontWeight: 600, color: '#ef4444' }}>- R$ 13.500.000,00 (100% dedutível)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Regime Tributário Otimizado:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>Resultado Real (Economia de 50%)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Arquivo LCDPR RFB:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>Gerado e Validado sem Pendências</span>
            </div>
          </div>
        </div>

        {/* Paradas Programadas & SUDENE */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Paradas & SUDENE</h3>
            <span style={{ background: '#f59e0b20', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              CONCILIADO
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Paradas Industriais (CPC 27):</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>Capitalização de overhaul e desreconhecimento</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Reinvestimento SUDENE (30%):</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>Depósito BNB e Reserva de Incentivos no PL</div>
            </div>
          </div>
        </div>
      </div>
    
      {/* DOSSIÊ EXECUTIVO OFICIAL (PADRÃO DIAMANTE) */}
      <div className="diamond-paper-a4" style={{ marginTop: '14px' }}>
        <div className="diamond-header">
          <div>
            <div className="diamond-title">FAZENDA & AGROPECUÁRIA SANTA FÉ</div>
            <div className="diamond-subtitle">DOSSIÊ EXECUTIVO DE PECUÁRIA (CPC 29 VALOR JUSTO) & LCDPR RURAL (IN RFB 1.848/18)</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.70rem' }}>
            <div>CNPJ / CPF: <strong>00.000.000/0001-00</strong></div>
            <div>COMPETÊNCIA: <strong>08/2026</strong></div>
            <div style={{ color: '#047857', fontWeight: 800 }}>CPC 29 ATIVO BIOLÓGICO & IN 1.848</div>
          </div>
        </div>

        <div className="diamond-meta-grid">
          <div className="diamond-meta-item">
            <strong>Rebanho Bovino em Engorda</strong>
            <span className="font-mono">5.000 Cabeças (90.000 @)</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Valor Justo do Rebanho</strong>
            <span className="font-mono">R$ 20.952.000,00</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Receita Bruta Agropecuária</strong>
            <span className="font-mono">R$ 15.000.000,00</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Resultado Líquido Rural (IRPF)</strong>
            <span className="font-mono" style={{ color: "#047857", fontWeight: 800 }}>R$ 3.000.000,00 (20%)</span>
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
              <td>Valor Justo do Ativo Biológico (Rebanho Bovino Líquido)</td>
              <td style={{ textAlign: 'center' }}>CPC 29</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ 20.952.000,00</td>
            </tr>
            <tr>
              <td>Ganho por Transformação Biológica (Ganho de Peso / Arroba)</td>
              <td style={{ textAlign: 'center' }}>DRE</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>+ R$ 5.952.000,00</td>
            </tr>
            <tr>
              <td>Livro Caixa Digital do Produtor Rural (LCDPR): Receita da Safra</td>
              <td style={{ textAlign: 'center' }}>LCDPR</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ 15.000.000,00</td>
            </tr>
            <tr className="diamond-table-total">
              <td><strong>BASE DE CÁLCULO DO IRPF RURAL PELO RESULTADO ARBITRADO (20%)</strong></td>
              <td style={{ textAlign: 'center' }}>IRPF Rural</td>
              <td className="font-mono" style={{ textAlign: 'right', color: "#047857" }}>R$ 3.000.000,00</td>
            </tr>
          </tbody>
        </table>

        <div className="diamond-signatures">
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">PRODUTOR RURAL TITULAR</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Homologação Oficial</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">RESPONSÁVEL TÉCNICO CONTÁBIL</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Homologação Oficial</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">PERÍCIA AGROPECUÁRIA CPC 29</div>
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
