import React from 'react';

export const OfficeTaxWithholdingsReinfView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="no-print" style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={() => window.print()} className="btn-primary-action" style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
          🖨️ Imprimir Comprovante de Retenções na Fonte (A4)
        </button>
      </div>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>📑</span> Retenções Tributárias na Fonte & EFD-Reinf
          </h2>
          <p style={{ margin: '6px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Apuração de retenções (IRRF, CSRF 4,65%, INSS 11% e ISSQN), transmissão dos eventos da Série R-4000 e integração com a DCTFWeb.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{ background: '#10b98120', color: '#10b981', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700 }}>
            EFD-REINF R-4000 & DCTFWEB
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Retenções Federais e Municipais */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Retenções na Fonte</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              SERVIÇOS TOMADOS
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>IRRF Retido (1,5% Serviços Profissionais):</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>R$ 4.500,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>CSRF Retida (4,65% PIS/COFINS/CSLL):</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>R$ 13.950,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>INSS Retido (11% Cessão Mão de Obra):</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>R$ 11.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Total Retido no Mês:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>R$ 29.450,00</span>
            </div>
          </div>
        </div>

        {/* EFD-Reinf Série R-4000 */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Transmissão EFD-Reinf</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              SÉRIE R-4000
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Eventos R-4020 (Pagamentos a PJ):</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>✓ 26 Eventos Transmitidos</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Eventos R-4010 (Pagamentos a PF):</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>✓ 4 Eventos Transmitidos</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Evento R-4099 (Fechamento):</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>Protocolado com Sucesso</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Integração DCTFWeb:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>DARF NUMERADO GERADO</span>
            </div>
          </div>
        </div>

        {/* Informes de Rendimentos aos Fornecedores */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Informes & Comprovantes</h3>
            <span style={{ background: '#f59e0b20', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              AUTO-ENVIO AOS FORNECEDORES
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Comprovante de Retenção de IRRF/CSRF:</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>Envio automático para os e-mails dos prestadores</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Extinção da DIRF (Substituição por Reinf):</div>
              <div style={{ fontWeight: 700, color: '#3b82f6', marginTop: '2px' }}>Conformidade plena com a Instrução Normativa RFB</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Segurança Fiscal:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>ZERO MALHA FINA NA DCTFWEB</span>
            </div>
          </div>
        </div>
      </div>
    
      {/* DOSSIÊ EXECUTIVO OFICIAL (PADRÃO DIAMANTE) */}
      <div className="diamond-paper-a4" style={{ marginTop: '14px' }}>
        <div className="diamond-header">
          <div>
            <div className="diamond-title">EMPRESA TOMADORA DE SERVIÇOS S/A</div>
            <div className="diamond-subtitle">COMPROVANTE ANUAL DE RETENÇÃO DE TRIBUTOS NA FONTE (EFD-REINF R-4000 & DIRF / DCTFWEB)</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.70rem' }}>
            <div>CNPJ / CPF: <strong>00.000.000/0001-00</strong></div>
            <div>COMPETÊNCIA: <strong>08/2026</strong></div>
            <div style={{ color: '#047857', fontWeight: 800 }}>IN RFB 2.043/21 & LEI 10.833/03</div>
          </div>
        </div>

        <div className="diamond-meta-grid">
          <div className="diamond-meta-item">
            <strong>IRRF Retido (1,5%)</strong>
            <span className="font-mono">R$ 4.500,00</span>
          </div>
          <div className="diamond-meta-item">
            <strong>CSRF Retida (4,65%)</strong>
            <span className="font-mono">R$ 13.950,00 (PIS/COF/CSLL)</span>
          </div>
          <div className="diamond-meta-item">
            <strong>INSS Retido (11%)</strong>
            <span className="font-mono">R$ 11.000,00</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Total Retido e Recolhido</strong>
            <span className="font-mono" style={{ color: "#047857", fontWeight: 800 }}>R$ 29.450,00</span>
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
              <td>IRRF Serviços Profissionais (DARF 1708)</td>
              <td style={{ textAlign: 'center' }}>1,50%</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ 4.500,00</td>
            </tr>
            <tr>
              <td>CSRF Retenção Lei 10.833/03 (DARF 5952)</td>
              <td style={{ textAlign: 'center' }}>4,65%</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ 13.950,00</td>
            </tr>
            <tr>
              <td>INSS Retenção Cessão de Mão de Obra (DCTFWeb)</td>
              <td style={{ textAlign: 'center' }}>11,00%</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ 11.000,00</td>
            </tr>
            <tr className="diamond-table-total">
              <td><strong>TOTAL DE RETENÇÕES TRIBUTÁRIAS TRANSMITIDAS NA SÉRIE R-4000</strong></td>
              <td style={{ textAlign: 'center' }}>Recolhido</td>
              <td className="font-mono" style={{ textAlign: 'right', color: "#047857" }}>R$ 29.450,00</td>
            </tr>
          </tbody>
        </table>

        <div className="diamond-signatures">
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">FONTE PAGADORA RESPONSÁVEL</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Homologação Oficial</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">RESPONSÁVEL TÉCNICO CONTÁBIL</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Homologação Oficial</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">BENEFICIÁRIO DO RENDIMENTO</div>
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
