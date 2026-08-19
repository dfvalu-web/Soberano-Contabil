import React from 'react';

export const DfcMergerBackupView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="no-print" style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={() => window.print()} className="btn-primary-action" style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
          🖨️ Imprimir DFC Direto Oficial (A4)
        </button>
      </div>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>🏢</span> DFC Direto, M&A Societário & Disaster Recovery
        </h2>
        <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Demonstração direta dos fluxos financeiros (CPC 03), simulação de cisão/incorporação (Art. 581 RIR) e cofres de backup AES-256-GCM.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* DFC Direto */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>DFC Método Direto (CPC 03)</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              +R$ 1.300.000,00 Líquido
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>(+) Recebimentos de Clientes:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>+R$ 5.000.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>(-) Pagamento a Fornecedores:</span>
              <span style={{ fontWeight: 600, color: '#ef4444' }}>-R$ 2.000.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>(-) Salários e Encargos:</span>
              <span style={{ fontWeight: 600, color: '#ef4444' }}>-R$ 1.000.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>(-) Tributos Operacionais:</span>
              <span style={{ fontWeight: 600, color: '#ef4444' }}>-R$ 500.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid var(--border-color)', fontWeight: 600 }}>
              <span style={{ color: 'var(--text-primary)' }}>Fluxo Operacional Líquido:</span>
              <span style={{ color: '#10b981' }}>+R$ 1.400.000,00</span>
            </div>
          </div>
        </div>

        {/* M&A Societário */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>M&A e Cisão Parcial (Art. 581 RIR)</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              40% Acervo Vertido
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Acervo Contábil:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>R$ 4.000.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Acervo a Valor Justo:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>R$ 5.000.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Ganho de Capital:</span>
              <span style={{ fontWeight: 600, color: '#f59e0b' }}>R$ 1.000.000,00 (IRPJ 34%)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Prejuízo Fiscal Mantido:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>R$ 600.000,00</span>
            </div>
          </div>
        </div>

        {/* Disaster Recovery Backup */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Backup Criptografado AES-256</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              SELO MERKLE VÁLIDO
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontWeight: 600, color: 'var(--accent-color)' }}>BKP-SOBERANO-2026-NIGHTLY</div>
              <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>Algoritmo: AES-256-GCM (Auth Tag 128 bits)</div>
              <div style={{ color: '#10b981', marginTop: '2px' }}>Dry-Run Restore: 100% íntegro e autêntico</div>
            </div>
          </div>
        </div>
      </div>
    
      {/* DOSSIÊ EXECUTIVO OFICIAL (PADRÃO DIAMANTE) */}
      <div className="diamond-paper-a4" style={{ marginTop: '14px' }}>
        <div className="diamond-header">
          <div>
            <div className="diamond-title">EMPRESA INDUSTRIAL SOBERANO S/A</div>
            <div className="diamond-subtitle">DEMONSTRAÇÃO DOS FLUXOS DE CAIXA (DFC - CPC 03 R2 / IAS 7) • MÉTODO DIRETO</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.70rem' }}>
            <div>CNPJ / CPF: <strong>00.000.000/0001-00</strong></div>
            <div>COMPETÊNCIA: <strong>08/2026</strong></div>
            <div style={{ color: '#047857', fontWeight: 800 }}>CPC 03 (R2) • IAS 7</div>
          </div>
        </div>

        <div className="diamond-meta-grid">
          <div className="diamond-meta-item">
            <strong>Recebimentos Operacionais</strong>
            <span className="font-mono">R$ 5.000.000,00</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Pagamento Fornecedores & Folha</strong>
            <span className="font-mono">R$ 3.000.000,00</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Tributos Pagos</strong>
            <span className="font-mono">R$ 500.000,00</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Geração Líquida Operacional</strong>
            <span className="font-mono" style={{ color: "#047857", fontWeight: 800 }}>R$ 1.400.000,00</span>
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
              <td>1. FLUXO DE CAIXA DAS ATIVIDADES OPERACIONAIS</td>
              <td style={{ textAlign: 'center' }}>Operacional</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>+ R$ 1.400.000,00</td>
            </tr>
            <tr>
              <td>2. FLUXO DE CAIXA DAS ATIVIDADES DE INVESTIMENTO (CAPEX)</td>
              <td style={{ textAlign: 'center' }}>Investimento</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>- R$ 400.000,00</td>
            </tr>
            <tr>
              <td>3. FLUXO DE CAIXA DAS ATIVIDADES DE FINANCIAMENTO (Dívidas)</td>
              <td style={{ textAlign: 'center' }}>Financiamento</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>- R$ 200.000,00</td>
            </tr>
            <tr className="diamond-table-total">
              <td><strong>AUMENTO LÍQUIDO NAS DISPONIBILIDADES DE CAIXA</strong></td>
              <td style={{ textAlign: 'center' }}>Variação Líquida</td>
              <td className="font-mono" style={{ textAlign: 'right', color: "#047857" }}>+ R$ 800.000,00</td>
            </tr>
          </tbody>
        </table>

        <div className="diamond-signatures">
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">DIRETORIA TESOURARIA / CFO</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Homologação Oficial</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">RESPONSÁVEL TÉCNICO CONTÁBIL</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Homologação Oficial</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">AUDITORIA FINANCEIRA IFRS</div>
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
