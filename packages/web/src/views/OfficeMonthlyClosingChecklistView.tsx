import React from 'react';

export const OfficeMonthlyClosingChecklistView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="no-print" style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={() => window.print()} className="btn-primary-action" style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
          🖨️ Imprimir Dossiê Mensal do Cliente (A4)
        </button>
      </div>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>🔒</span> Fechamento Mensal dos 3 Pilares & Dossiê
          </h2>
          <p style={{ margin: '6px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Checklist de encerramento mensal (Contábil, Fiscal e DP), trava de competência contra alterações retroativas e geração do Dossiê do Cliente.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{ background: '#10b98120', color: '#10b981', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700 }}>
            COMPETÊNCIA 08/2026 FECHADA
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Checklist dos 3 Pilares */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Checklist de Encerramento</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              7/7 ITENS (100%)
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Conciliação Bancária OFX:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>✓ 100% Conciliado</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Apuração Tributária & Guias:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>✓ PGDAS / DARFs Emitidos</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>EFD-Reinf & DCTFWeb:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>✓ Transmitidas com Recibo</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Folha & eSocial S-1299:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>✓ Fechada com Sucesso</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Trava Contábil do Mês:</span>
              <span style={{ fontWeight: 700, color: '#3b82f6' }}>🔒 ATIVADA (BLOQUEIO RETROATIVO)</span>
            </div>
          </div>
        </div>

        {/* Dossiê Mensal do Cliente */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Dossiê Digital do Cliente</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              PACOTE MENSAL
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Balancete & DRE Gerencial:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>✓ Disponibilizado em PDF</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Folha Analítica & Holerites:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>✓ Disponibilizado no Portal B2B</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Guias DAS / DARF com Pix:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>✓ Enviadas via WhatsApp/E-mail</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Protocolo de Entrega:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>ENTREGUE COM VALIDADE JURÍDICA</span>
            </div>
          </div>
        </div>

        {/* Produtividade do Escritório */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Governança Operacional</h3>
            <span style={{ background: '#f59e0b20', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              SLA DA EQUIPE
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Conformidade sem Retrabalho:</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>Zero divergências entre balancete e DCTFWeb</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Presteza no Atendimento:</div>
              <div style={{ fontWeight: 700, color: '#3b82f6', marginTop: '2px' }}>Dossiê entregue até o 5º dia útil do mês</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Nível de Serviço:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>PADRÃO EXECUTIVO 100% AUDITADO</span>
            </div>
          </div>
        </div>
      </div>
    
      {/* DOSSIÊ EXECUTIVO OFICIAL (PADRÃO DIAMANTE) */}
      <div className="diamond-paper-a4" style={{ marginTop: '14px' }}>
        <div className="diamond-header">
          <div>
            <div className="diamond-title">EMPRESA CLIENTE S/A</div>
            <div className="diamond-subtitle">DOSSIÊ MENSAL DE FECHAMENTO CONTÁBIL, FISCAL & DEPARTAMENTO PESSOAL</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.70rem' }}>
            <div>CNPJ / CPF: <strong>00.000.000/0001-00</strong></div>
            <div>COMPETÊNCIA: <strong>08/2026</strong></div>
            <div style={{ color: '#047857', fontWeight: 800 }}>GOVERNANÇA & TRAVA MENSAL</div>
          </div>
        </div>

        <div className="diamond-meta-grid">
          <div className="diamond-meta-item">
            <strong>Conciliação OFX</strong>
            <span className="font-mono" style={{ color: "#047857", fontWeight: 800 }}>100% Conciliado</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Apuração Tributária</strong>
            <span className="font-mono">DAS / Guias Emitidas</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Folha eSocial S-1299</strong>
            <span className="font-mono">Fechada e Transmitida</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Trava Contábil Mensal</strong>
            <span className="font-mono">🔒 Bloqueio Ativo</span>
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
              <td>Conciliação Bancária & Diário Geral (OFX-20260830-BB)</td>
              <td style={{ textAlign: 'center' }}>30/08/2026</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>✓ 100% Conciliado</td>
            </tr>
            <tr>
              <td>Apuração Fiscal: PGDAS-D / EFD-Reinf / DCTFWeb (REC-RFB-99882210)</td>
              <td style={{ textAlign: 'center' }}>30/08/2026</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>✓ Guias Emitidas</td>
            </tr>
            <tr>
              <td>Folha de Pagamento & Encargos: eSocial S-1299 (S1299-88102938)</td>
              <td style={{ textAlign: 'center' }}>30/08/2026</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>✓ Transmitido</td>
            </tr>
            <tr className="diamond-table-total">
              <td><strong>STATUS CONSOLIDADO DO ENCERRAMENTO MENSAL</strong></td>
              <td style={{ textAlign: 'center' }}>30/08/2026</td>
              <td className="font-mono" style={{ textAlign: 'right', color: "#047857" }}>✓ HOMOLOGADO</td>
            </tr>
          </tbody>
        </table>

        <div className="diamond-signatures">
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">DIRETORIA CLIENTE</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Homologação Oficial</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">RESPONSÁVEL TÉCNICO CONTÁBIL</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Homologação Oficial</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">AUDITORIA DE QUALIDADE</div>
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
