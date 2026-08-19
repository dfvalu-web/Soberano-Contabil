import React from 'react';

export const OfficeAnnualAccountingClosingView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="no-print" style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={() => window.print()} className="btn-primary-action" style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
          🖨️ Imprimir Dossiê de Fechamento Anual (A4)
        </button>
      </div>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>📑</span> Fechamento Contábil Anual, Demonstrações & Notas Explicativas
          </h2>
          <p style={{ margin: '6px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Encerramento automático das contas de resultado (ARE), Reserva Legal (Art. 193 Lei 6.404/76), BP, DRE, DFC, DMPL, DVA e Notas Explicativas CPC 26.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{ background: '#10b98120', color: '#10b981', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700 }}>
            LEI 6.404/76 & NBC TG 26 (CPC 26 R1)
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Apuração do Resultado & Destinação do Lucro */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Destinação do Lucro (ARE)</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              ENCERRAMENTO ANUAL
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Lucro Líquido do Exercício:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>R$ 1.200.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Constituição Reserva Legal (5%):</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>R$ 60.000,00 (Art. 193 Lei 6.404)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Dividendos Propostos (25% Obrigatório):</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>R$ 285.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Retenção para Investimentos/Expansão:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>R$ 855.000,00 (100% DESTINADO)</span>
            </div>
          </div>
        </div>

        {/* Conjunto Completo de Demonstrações Financeiras */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Demonstrações Integradas</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              5 PEÇAS CONTÁBEIS
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Balanço Patrimonial (Ativo = Passivo+PL):</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>R$ 5.480.000,00 (Equilibrado)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>DRE & DFC (Fluxos Caixa CPC 03):</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Método Direto e Indireto</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>DMPL & DVA (Valor Adicionado):</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>Mutações e Riqueza Gerada</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Conformidade SPED ECD / Juntas:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>VALIDADO NO PVA SEM ERROS</span>
            </div>
          </div>
        </div>

        {/* Notas Explicativas & Livro Diário Encadernado */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Notas Explicativas CPC 26</h3>
            <span style={{ background: '#f59e0b20', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              PACOTE INSTITUCIONAL
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Compilação de Notas Explicativas:</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>12 notas padronizadas (Políticas, Riscos e Provisões)</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Termos de Abertura e Encerramento:</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>Assinatura qualificada ICP-Brasil do Contador e Sócios</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Entrega ao Cliente:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>LIVRO DIGITAL PDF & RECIBO SPED</span>
            </div>
          </div>
        </div>
      </div>
    
      {/* DOSSIÊ EXECUTIVO DE FECHAMENTO CONTÁBIL ANUAL (PADRÃO DIAMANTE) */}
      <div className="diamond-paper-a4" style={{ marginTop: '10px' }}>
        <div className="diamond-header">
          <div>
            <div className="diamond-title">EMPRESA CLIENTE S/A</div>
            <div className="diamond-subtitle">DOSSIÊ EXECUTIVO DE ENCERRAMENTO ANUAL, ARE & DESTINAÇÃO DE LUCROS (LEI 6.404/76)</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.70rem' }}>
            <div>CNPJ: <strong>00.000.000/0001-00</strong></div>
            <div>EXERCÍCIO SOCIAL: <strong>2026</strong></div>
            <div style={{ color: '#047857', fontWeight: 800 }}>Encerramento Homologado</div>
          </div>
        </div>

        <div className="diamond-meta-grid">
          <div className="diamond-meta-item">
            <strong>Lucro Líquido do Exercício</strong>
            <span className="font-mono" style={{ color: '#047857', fontWeight: 800 }}>R$ 1.200.000,00</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Reserva Legal (5%)</strong>
            <span className="font-mono">R$ 60.000,00 (Art. 193 LSA)</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Dividendos Obrigatórios (25%)</strong>
            <span className="font-mono">R$ 285.000,00 (Isentos IR)</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Reserva de Expansão (70%)</strong>
            <span className="font-mono">R$ 855.000,00 (100% Destinado)</span>
          </div>
        </div>

        <table className="diamond-table">
          <thead>
            <tr>
              <th>Destinação do Resultado Contábil (ARE)</th>
              <th>Fundamentação Legal (Lei 6.404/76)</th>
              <th style={{ textAlign: 'center' }}>Percentual</th>
              <th style={{ textAlign: 'right' }}>Valor Destinado (R$)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Reserva Legal Obrigatória:</strong> Proteção do Capital</td>
              <td>Artigo 193 da Lei 6.404/76</td>
              <td style={{ textAlign: 'center' }}>5,0%</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ 60.000,00</td>
            </tr>
            <tr>
              <td><strong>Dividendos Obrigatórios Propostos:</strong> Distribuição aos Sócios</td>
              <td>Artigo 202 da Lei 6.404/76</td>
              <td style={{ textAlign: 'center' }}>25,0%</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ 285.000,00</td>
            </tr>
            <tr>
              <td><strong>Reserva Estatutária de Retenção de Lucros:</strong> Expansão/CAPEX</td>
              <td>Artigo 196 da Lei 6.404/76</td>
              <td style={{ textAlign: 'center' }}>70,0%</td>
              <td className="font-mono" style={{ textAlign: 'right', fontWeight: 700 }}>R$ 855.000,00</td>
            </tr>
            <tr className="diamond-table-total">
              <td colSpan={3}>TOTAL DO LUCRO LÍQUIDO DO EXERCÍCIO DESTINADO NO PATRIMÔNIO LÍQUIDO</td>
              <td className="font-mono" style={{ textAlign: 'right', color: '#047857' }}>R$ 1.200.000,00</td>
            </tr>
          </tbody>
        </table>

        <div className="diamond-signatures">
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">DIRETORIA EXECUTIVA</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Aprovação das Demonstrações</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">RESPONSÁVEL TÉCNICO CONTÁBIL</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>CRC/SP 1SP999999/O-0</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">ASSEMBLEIA GERAL ORDINÁRIA</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Homologação Societária</div>
          </div>
        </div>

        <div className="diamond-watermark-seal">
          <div>SOBERANO CONTÁBIL • ENCERRAMENTO ANUAL • CERTIFICAÇÃO DIGITAL SHA-256: <code>88CC10988BA91</code></div>
          <div>PÁGINA 1 DE 1 • DOSSIÊ SOCIETÁRIO OFICIAL</div>
        </div>
      </div>

    </div>
  );
};
