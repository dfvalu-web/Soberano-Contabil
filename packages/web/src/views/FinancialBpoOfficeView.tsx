import React from 'react';

export const FinancialBpoOfficeView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="no-print" style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={() => window.print()} className="btn-primary-action" style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
          🖨️ Imprimir Relatório de BPO Financeiro (A4)
        </button>
      </div>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>📈</span> BPO Financeiro do Escritório (Open Finance & DRE)
          </h2>
          <p style={{ margin: '6px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Gestão integrada de Contas a Pagar/Receber, conciliação bancária via Open Finance e relatórios gerenciais com EBITDA para clientes.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{ background: '#10b98120', color: '#10b981', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700 }}>
            INTEGRAÇÃO CONTÁBIL AUTOMÁTICA
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Painel de Contas a Pagar e Receber */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Contas a Pagar & Receber</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              ESTEIRA BPO
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Pagamentos do Mês (Fornecedores/Folha):</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>R$ 480.250,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Recebimentos Conciliados:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>R$ 720.800,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Saldo Líquido Operacional:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>+ R$ 240.550,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Lançamentos Contábeis Gerados:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>100% AUTOMATIZADOS</span>
            </div>
          </div>
        </div>

        {/* Conciliação Open Finance em Tempo Real */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Open Finance API</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              BANCO CENTRAL DO BRASIL
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Bancos Conectados (Itaú, Bradesco, BB):</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>Sincronização Ativa</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Extratos OFX & Pix Instantâneo:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Leitura em tempo real</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Divergências Bancárias:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>0 pendências</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Status da Conciliação:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>CONCILIADO NO CENTAVO</span>
            </div>
          </div>
        </div>

        {/* DRE Gerencial & Métricas EBITDA */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>DRE Gerencial & EBITDA</h3>
            <span style={{ background: '#f59e0b20', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              GESTÃO ESTRATÉGICA
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Margem de Contribuição / Bruta:</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>42,5% sobre a Receita Líquida</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>EBITDA Operacional:</div>
              <div style={{ fontWeight: 700, color: '#3b82f6', marginTop: '2px' }}>28,4% (Lucro antes de Juros, Tributos e Amortização)</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Apresentação ao Cliente:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>RELATÓRIOS EM PDF & DASHBOARD</span>
            </div>
          </div>
        </div>
      </div>
    
      {/* DOSSIÊ EXECUTIVO OFICIAL (PADRÃO DIAMANTE) */}
      <div className="diamond-paper-a4" style={{ marginTop: '14px' }}>
        <div className="diamond-header">
          <div>
            <div className="diamond-title">CLIENTE GESTÃO BPO S/A</div>
            <div className="diamond-subtitle">RELATÓRIO EXECUTIVO DE BPO FINANCEIRO, FLUXO DE CAIXA & EBITDA GERENCIAL</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.70rem' }}>
            <div>CNPJ / CPF: <strong>00.000.000/0001-00</strong></div>
            <div>COMPETÊNCIA: <strong>08/2026</strong></div>
            <div style={{ color: '#047857', fontWeight: 800 }}>OPEN FINANCE & IFRS GERENCIAL</div>
          </div>
        </div>

        <div className="diamond-meta-grid">
          <div className="diamond-meta-item">
            <strong>Recebimentos Conciliados</strong>
            <span className="font-mono" style={{ color: "#047857", fontWeight: 800 }}>R$ 720.800,00</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Pagamentos Realizados</strong>
            <span className="font-mono">R$ 480.250,00</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Saldo Líquido Operacional</strong>
            <span className="font-mono">+ R$ 240.550,00</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Margem EBITDA Operacional</strong>
            <span className="font-mono">33,4% (Saudável)</span>
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
              <td>Contas a Receber de Clientes (Faturamento Conciliado)</td>
              <td style={{ textAlign: 'center' }}>Open Finance</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>+ R$ 720.800,00</td>
            </tr>
            <tr>
              <td>Contas a Pagar: Fornecedores & Insumos Operacionais</td>
              <td style={{ textAlign: 'center' }}>DDA / CNAB</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>- R$ 280.150,00</td>
            </tr>
            <tr>
              <td>Folha de Pagamento & Encargos Trabalhistas/Sociais</td>
              <td style={{ textAlign: 'center' }}>Remessa</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>- R$ 200.100,00</td>
            </tr>
            <tr className="diamond-table-total">
              <td><strong>SALDO FINANCEIRO LÍQUIDO DISPONÍVEL NO ENCERRAMENTO</strong></td>
              <td style={{ textAlign: 'center' }}>Saldo Final</td>
              <td className="font-mono" style={{ textAlign: 'right', color: "#047857" }}>+ R$ 240.550,00</td>
            </tr>
          </tbody>
        </table>

        <div className="diamond-signatures">
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">GESTOR FINANCEIRO CLIENTE</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Homologação Oficial</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">HEAD DE BPO FINANCEIRO</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Homologação Oficial</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">AUDITORIA DE TESOURARIA</div>
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
