import React from 'react';

export const OfficeEquityMethodCpc18View: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="no-print" style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={() => window.print()} className="btn-primary-action" style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
          🖨️ Imprimir Laudo de MEP CPC 18 (A4)
        </button>
      </div>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>🏢</span> Equivalência Patrimonial (MEP - CPC 18 & LALUR ECF)
          </h2>
          <p style={{ margin: '6px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Apuração de variações de PL em coligadas/controladas (CPC 18 R2), expurgo de lucros intercompany e exclusão no LALUR (Bloco M300 ECF).
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{ background: '#10b98120', color: '#10b981', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700 }}>
            CPC 18 (R2) • LALUR M300 • ART. 248 LSA
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Painel de Apuração do MEP */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Investimento em Coligada (40%)</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              INFLUÊNCIA SIGNIFICATIVA
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Lucro Líquido do Período (Investida):</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>R$ 200.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Expurgo de Lucros Não Realizados:</span>
              <span style={{ fontWeight: 600, color: '#ef4444' }}>- R$ 0,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Ganho de MEP no Período (40%):</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>+ R$ 80.000,00 (Resultado DRE)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Dividendos Propostos (Redução Saldo):</span>
              <span style={{ fontWeight: 700, color: '#3b82f6' }}>R$ 20.000,00 (Ativo Circulante)</span>
            </div>
          </div>
        </div>

        {/* LALUR ECF Bloco M300 (Não Incidência Fiscal) */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>LALUR & ECF (Bloco M300)</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              EXCLUSÃO FISCAL
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Exclusão no LALUR (IRPJ):</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>- R$ 80.000,00 (Isenção Art. 386 RIR)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Exclusão no LACS (CSLL):</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>- R$ 80.000,00 (Base Zerada)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Tributação PIS/COFINS:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>Não Incidência (Receita Não Operacional)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Status da ECF:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>100% BLINDADA RECEITA FEDERAL</span>
            </div>
          </div>
        </div>

        {/* Lançamentos no Razão Contábil */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Razão & Ativo Investimentos</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              BALANÇO PATRIMONIAL
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Reconhecimento do Ganho de MEP:</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>D - Investimentos em Coligadas | C - Receita de MEP (DRE)</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Reconhecimento dos Dividendos:</div>
              <div style={{ fontWeight: 700, color: '#3b82f6', marginTop: '2px' }}>D - Dividendos a Receber | C - Investimentos em Coligadas</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Auditoria Contábil NBC TG 18:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>TOTALMENTE CONCILIADO</span>
            </div>
          </div>
        </div>
      </div>
    
      {/* DOSSIÊ EXECUTIVO OFICIAL (PADRÃO DIAMANTE) */}
      <div className="diamond-paper-a4" style={{ marginTop: '14px' }}>
        <div className="diamond-header">
          <div>
            <div className="diamond-title">CONTROLADORA SOBERANO PARTICIPAÇÕES S/A</div>
            <div className="diamond-subtitle">LAUDO DE AVALIAÇÃO DE INVESTIMENTOS PELO MÉTODO DA EQUIVALÊNCIA PATRIMONIAL (CPC 18 R2)</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.70rem' }}>
            <div>CNPJ / CPF: <strong>00.000.000/0001-00</strong></div>
            <div>COMPETÊNCIA: <strong>08/2026</strong></div>
            <div style={{ color: '#047857', fontWeight: 800 }}>CPC 18 (R2) • LALUR M300 • ART. 248 LSA</div>
          </div>
        </div>

        <div className="diamond-meta-grid">
          <div className="diamond-meta-item">
            <strong>Sociedade Investida</strong>
            <span className="font-mono">Coligada Estratégica S/A</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Percentual de Participação</strong>
            <span className="font-mono">40,0% (Influência Significativa)</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Lucro Líquido da Investida</strong>
            <span className="font-mono">R$ 200.000,00</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Ganho de MEP Reconhecido</strong>
            <span className="font-mono" style={{ color: "#047857", fontWeight: 800 }}>R$ 80.000,00 (Receita DRE)</span>
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
              <td>Ganho por Equivalência Patrimonial (MEP): DRE</td>
              <td style={{ textAlign: 'center' }}>40,0%</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ 80.000,00</td>
            </tr>
            <tr>
              <td>Dividendos Propostos pela Investida (Redução Investimento)</td>
              <td style={{ textAlign: 'center' }}>40,0%</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ 20.000,00</td>
            </tr>
            <tr>
              <td>Exclusão no LALUR (Bloco M300 ECF - Não Tributável)</td>
              <td style={{ textAlign: 'center' }}>Isento</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>- R$ 80.000,00</td>
            </tr>
            <tr className="diamond-table-total">
              <td><strong>VALOR CONTÁBIL FINAL DA PARTICIPAÇÃO SOCIETÁRIA</strong></td>
              <td style={{ textAlign: 'center' }}>CPC 18</td>
              <td className="font-mono" style={{ textAlign: 'right', color: "#047857" }}>R$ 480.000,00</td>
            </tr>
          </tbody>
        </table>

        <div className="diamond-signatures">
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">DIRETORIA DE INVESTIMENTOS</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Homologação Oficial</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">RESPONSÁVEL TÉCNICO CONTÁBIL</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Homologação Oficial</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">AUDITORIA CONSOLIDAÇÃO IFRS</div>
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
