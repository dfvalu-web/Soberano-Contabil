import React from 'react';

export const OfficeTaxCreditRecoveryView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="no-print" style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={() => window.print()} className="btn-primary-action" style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
          🖨️ Imprimir Laudo de Recuperação de Créditos (A4)
        </button>
      </div>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>💰</span> Recuperação de Créditos Tributários & PER/DCOMP Web
          </h2>
          <p style={{ margin: '6px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Diagnóstico fiscal de produtos monofásicos (Simples Nacional), Exclusão do ICMS da base do PIS/COFINS (Tema 69 STF) e compensação com SELIC.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{ background: '#10b98120', color: '#10b981', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700 }}>
            TEMA 69 STF & MONOFÁSICOS PIS/COFINS
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Scanner de Monofásicos & Tese do Século */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Créditos Apurados (60 Meses)</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              DIAGNÓSTICO FISCAL
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Créditos Monofásicos (Farmácias/Autopeças):</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>R$ 142.500,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Exclusão ICMS PIS/COFINS (Tema 69 STF):</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>R$ 285.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Total Principal Apurado:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>R$ 427.500,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Segurança Jurídica:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>100% PAUTADO EM SÚMULAS VINCULANTES</span>
            </div>
          </div>
        </div>

        {/* Atualização SELIC & PER/DCOMP Web */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Compensação PER/DCOMP</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              TAXA SELIC ACUMULADA
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Correção Monetária SELIC (+ 25,4%):</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>+ R$ 108.585,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Total Líquido Recuperável:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>R$ 536.085,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Compensação via DARF / Restituição Pix:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Protocolado e Aprovado RFB</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Status da Transmissão:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>DCOMP EMITIDA COM SUCESSO</span>
            </div>
          </div>
        </div>

        {/* Honorários de Êxito do Escritório */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Honorários de Êxito (Success Fee)</h3>
            <span style={{ background: '#f59e0b20', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              RECEITA EXTRA ESCRITÓRIO
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Percentual Contratado de Êxito:</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>20,0% sobre o valor financeiro efetivamente recuperado</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Faturamento de Honorários do Escritório:</div>
              <div style={{ fontWeight: 700, color: '#3b82f6', marginTop: '2px' }}>R$ 107.217,00 (Geração de Caixa Imediata)</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Satisfação do Cliente:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>MÁXIMA (DINHEIRO NO CAIXA)</span>
            </div>
          </div>
        </div>
      </div>
    
      {/* DOSSIÊ EXECUTIVO OFICIAL (PADRÃO DIAMANTE) */}
      <div className="diamond-paper-a4" style={{ marginTop: '14px' }}>
        <div className="diamond-header">
          <div>
            <div className="diamond-title">EMPRESA BENEFICIÁRIA S/A</div>
            <div className="diamond-subtitle">LAUDO PERICIAL DE AUDITORIA & RECUPERAÇÃO DE CRÉDITOS TRIBUTÁRIOS (TEMA 69 STF & MONOFÁSICOS)</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.70rem' }}>
            <div>CNPJ / CPF: <strong>00.000.000/0001-00</strong></div>
            <div>COMPETÊNCIA: <strong>08/2026</strong></div>
            <div style={{ color: '#047857', fontWeight: 800 }}>TEMA 69 STF & SÚMULA CARF</div>
          </div>
        </div>

        <div className="diamond-meta-grid">
          <div className="diamond-meta-item">
            <strong>Monofásicos (PIS/COFINS)</strong>
            <span className="font-mono">R$ 142.500,00</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Exclusão ICMS (Tema 69 STF)</strong>
            <span className="font-mono">R$ 285.000,00</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Atualização SELIC Acumulada</strong>
            <span className="font-mono">R$ 87.200,00</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Total Geral de Crédito Recuperável</strong>
            <span className="font-mono" style={{ color: "#047857", fontWeight: 800 }}>R$ 514.700,00</span>
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
              <td>Produtos Monofásicos: Farmácias, Autopeças e Cosméticos</td>
              <td style={{ textAlign: 'center' }}>Lei 10.147/00</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ 171.500,00</td>
            </tr>
            <tr>
              <td>Tese do Século (Tema 69 STF): Exclusão do ICMS na base PIS/COFINS</td>
              <td style={{ textAlign: 'center' }}>RE 574.706 STF</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ 343.200,00</td>
            </tr>
            <tr className="diamond-table-total">
              <td><strong>TOTAL DE CRÉDITO LÍQUIDO E CERTO HOMOLOGADO PARA PER/DCOMP</strong></td>
              <td style={{ textAlign: 'center' }}>Homologado</td>
              <td className="font-mono" style={{ textAlign: 'right', color: "#047857" }}>R$ 514.700,00</td>
            </tr>
          </tbody>
        </table>

        <div className="diamond-signatures">
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">DIRETORIA FINANCEIRA / CEO</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Homologação Oficial</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">PERITO AUDITOR TRIBUTÁRIO</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Homologação Oficial</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">CONSULTORIA JURÍDICO-TRIBUTÁRIA</div>
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
