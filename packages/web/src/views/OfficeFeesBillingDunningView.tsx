import React from 'react';

export const OfficeFeesBillingDunningView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="no-print" style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={() => window.print()} className="btn-primary-action" style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
          🖨️ Imprimir Extrato de Honorários & Faturamento (A4)
        </button>
      </div>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>💰</span> Honorários do Escritório, NFS-e & Cobrança PIX Recorrente
          </h2>
          <p style={{ margin: '6px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Gestão de contratos e mensalidades, emissão em lote de NFS-e do escritório, cobrança automática por PIX/Boleto e controle de inadimplência.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{ background: '#10b98120', color: '#10b981', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700 }}>
            FATURAMENTO EM LOTE: ATIVO
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Contratos de Honorários e Adicionais DP */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Contratos Recorrentes</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              MENSALIDADES CFC
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Clientes Faturados (Mês):</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>128 contratos ativos</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Faturamento Base:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>R$ 192.400,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Adicionais (Vidas DP + DF-e):</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>+ R$ 24.650,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Total da Receita Recorrente:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>R$ 217.050,00 / mês</span>
            </div>
          </div>
        </div>

        {/* Emissor de NFS-e do Escritório */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Emissão em Lote de NFS-e</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              PADRÃO NACIONAL & PREFEITURAS
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>NFS-e Emitidas no Lote:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>128 notas autorizadas</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>ISSQN Municipal Apurado:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>R$ 6.511,50 (3.0%)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Envio Automático ao Tomador:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>XML e PDF por E-mail</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Status da Prefeitura:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>100% SINCRONIZADO</span>
            </div>
          </div>
        </div>

        {/* Régua de Inadimplência & Cobrança PIX */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Régua de Cobrança PIX</h3>
            <span style={{ background: '#f59e0b20', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              AUTO-DUNNING
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Recebimento em Dia (PIX/Boleto):</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>96,8% de Adimplência</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Régua Escalonada:</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>Lembretes automáticos via WhatsApp e suspensão preventiva em 60 dias</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Previsão de Caixa:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>FLUXO SAUDÁVEL</span>
            </div>
          </div>
        </div>
      </div>
    
      {/* DOSSIÊ EXECUTIVO OFICIAL (PADRÃO DIAMANTE) */}
      <div className="diamond-paper-a4" style={{ marginTop: '14px' }}>
        <div className="diamond-header">
          <div>
            <div className="diamond-title">DAVID AUDITORIA & CONTABILIDADE</div>
            <div className="diamond-subtitle">EXTRATO EXECUTIVO DE HONORÁRIOS CONTÁBEIS, NFS-e & FATURAMENTO RECORRENTE (CFC)</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.70rem' }}>
            <div>CNPJ / CPF: <strong>00.000.000/0001-00</strong></div>
            <div>COMPETÊNCIA: <strong>08/2026</strong></div>
            <div style={{ color: '#047857', fontWeight: 800 }}>PADRÃO NACIONAL NFS-E & CFC</div>
          </div>
        </div>

        <div className="diamond-meta-grid">
          <div className="diamond-meta-item">
            <strong>Contratos Ativos Faturados</strong>
            <span className="font-mono">128 Empresas Clientes</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Honorários Base Recorrentes</strong>
            <span className="font-mono">R$ 192.400,00</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Adicionais Variáveis (DP & DF-e)</strong>
            <span className="font-mono">R$ 24.650,00</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Receita Recorrente Total (MRR)</strong>
            <span className="font-mono" style={{ color: "#047857", fontWeight: 800 }}>R$ 217.050,00</span>
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
              <td>Honorários Mensais Contratuais: Assessoria Contábil, Fiscal & DP</td>
              <td style={{ textAlign: 'center' }}>128 Contratos</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ 192.400,00</td>
            </tr>
            <tr>
              <td>Adicional por Funcionário Ativo (DP): Processamento Folha CLT</td>
              <td style={{ textAlign: 'center' }}>480 Vidas</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ 14.400,00</td>
            </tr>
            <tr>
              <td>Adicional por Volume de Documentos Fiscais: Excedente DF-e</td>
              <td style={{ textAlign: 'center' }}>10.250 DF-e</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ 10.250,00</td>
            </tr>
            <tr className="diamond-table-total">
              <td><strong>TOTAL GERAL FATURADO COM NFS-e & COBRANÇA PIX AUTOMATIZADA</strong></td>
              <td style={{ textAlign: 'center' }}>Total MRR</td>
              <td className="font-mono" style={{ textAlign: 'right', color: "#047857" }}>R$ 217.050,00</td>
            </tr>
          </tbody>
        </table>

        <div className="diamond-signatures">
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">DIRETORIA COMERCIAL DO ESCRITÓRIO</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Homologação Oficial</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">RESPONSÁVEL TÉCNICO CONTÁBIL</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Homologação Oficial</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">CONTROLE DE INADIMPLÊNCIA & COBRANÇA</div>
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
