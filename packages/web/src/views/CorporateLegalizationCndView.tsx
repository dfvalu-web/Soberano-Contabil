import React from 'react';

export const CorporateLegalizationCndView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="no-print" style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={() => window.print()} className="btn-primary-action" style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
          🖨️ Imprimir Certificado de Regularidade Fiscal CNDs (A4)
        </button>
      </div>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>🏛️</span> Legalização Societária, Redesim & Monitor de CNDs
          </h2>
          <p style={{ margin: '6px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Esteira completa de abertura, alteração e encerramento de empresas, integração com Juntas Comerciais/DBE e varredura automática de certidões.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{ background: '#10b98120', color: '#10b981', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700 }}>
            REDESIM & CND: 100% CONECTADO
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Esteira de Processos Societários */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Processos Societários</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              JUNTAS COMERCIAIS
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Aberturas em Andamento:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>6 processos</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Alterações Contratuais:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>12 processos</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Viabilidades & DBE Deferidos:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>100% Aprovados</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Tempo Médio de Registro:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>Até 3 dias úteis</span>
            </div>
          </div>
        </div>

        {/* Monitor Automático de CNDs da Carteira */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Monitor de Certidões (CNDs)</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              VARREDURA DIÁRIA
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>CND Federal / PGFN:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>128 Válidas (100%)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>CND Estadual (SEFAZ):</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>128 Válidas (100%)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>CRF Caixa (FGTS):</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>128 Válidas (100%)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Status da Carteira:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>TOTALMENTE REGULAR</span>
            </div>
          </div>
        </div>

        {/* Contratos de Prestação de Serviços CFC */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Contratos & Procurações</h3>
            <span style={{ background: '#f59e0b20', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              CFC & E-CAC RFB
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Contratos de Serviços Contábeis:</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>Assinatura eletrônica Gov.br / ICP-Brasil</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Procurações Eletrônicas e-CAC:</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>Vigências monitoradas com alertas de renovação</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Blindagem Jurídica:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>100% EM CONFORMIDADE</span>
            </div>
          </div>
        </div>
      </div>
    
      {/* DOSSIÊ EXECUTIVO OFICIAL (PADRÃO DIAMANTE) */}
      <div className="diamond-paper-a4" style={{ marginTop: '14px' }}>
        <div className="diamond-header">
          <div>
            <div className="diamond-title">EMPRESA CLIENTE S/A</div>
            <div className="diamond-subtitle">CERTIFICADO DE REGULARIDADE FISCAL, SOCIETÁRIA & MONITOR CONSOLIDADO DE CNDs</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.70rem' }}>
            <div>CNPJ / CPF: <strong>00.000.000/0001-00</strong></div>
            <div>COMPETÊNCIA: <strong>08/2026</strong></div>
            <div style={{ color: '#047857', fontWeight: 800 }}>REDESIM & CNDS 100% REGULARES</div>
          </div>
        </div>

        <div className="diamond-meta-grid">
          <div className="diamond-meta-item">
            <strong>CND Conjunta RFB/PGFN</strong>
            <span className="font-mono" style={{ color: "#047857", fontWeight: 800 }}>✓ Válida (Emitida)</span>
          </div>
          <div className="diamond-meta-item">
            <strong>CND Estadual (SEFAZ)</strong>
            <span className="font-mono" style={{ color: "#047857", fontWeight: 800 }}>✓ Válida (Emitida)</span>
          </div>
          <div className="diamond-meta-item">
            <strong>CND Municipal (ISS)</strong>
            <span className="font-mono" style={{ color: "#047857", fontWeight: 800 }}>✓ Válida (Emitida)</span>
          </div>
          <div className="diamond-meta-item">
            <strong>CRF FGTS (Caixa Econômica)</strong>
            <span className="font-mono" style={{ color: "#047857", fontWeight: 800 }}>✓ Válida (Emitida)</span>
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
              <td>Receita Federal do Brasil & PGFN: Certidão Conjunta Negativa</td>
              <td style={{ textAlign: 'center' }}>28/02/2027</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>✓ Negativa</td>
            </tr>
            <tr>
              <td>Secretaria da Fazenda Estadual (SEFAZ): Dívida Ativa Estadual</td>
              <td style={{ textAlign: 'center' }}>15/02/2027</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>✓ Negativa</td>
            </tr>
            <tr>
              <td>Prefeitura Municipal: Tributos Mobiliários e Imobiliários</td>
              <td style={{ textAlign: 'center' }}>30/11/2026</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>✓ Negativa</td>
            </tr>
            <tr className="diamond-table-total">
              <td><strong>Caixa Econômica Federal: Certificado de Regularidade FGTS (CRF)</strong></td>
              <td style={{ textAlign: 'center' }}>29/09/2026</td>
              <td className="font-mono" style={{ textAlign: 'right', color: "#047857" }}>✓ Negativa</td>
            </tr>
          </tbody>
        </table>

        <div className="diamond-signatures">
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">DIRETORIA JURÍDICA CLIENTE</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Homologação Oficial</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">RESPONSÁVEL TÉCNICO CONTÁBIL</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Homologação Oficial</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">SETOR DE LEGALIZAÇÃO</div>
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
