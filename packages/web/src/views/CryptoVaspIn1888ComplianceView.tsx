import React from 'react';

export const CryptoVaspIn1888ComplianceView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="no-print" style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={() => window.print()} className="btn-primary-action" style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
          🖨️ Imprimir Dossiê Cripto & IN 1888 (A4)
        </button>
      </div>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>🪙</span> Marco Legal Cripto (Lei 14.478/22), VASP & Declaração IN RFB 1.888/19
        </h2>
        <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Segregação patrimonial para Prestadoras de Serviços de Ativos Virtuais (VASPs), prova de reservas on-chain e declaração mensal à Receita Federal.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Segregação Patrimonial VASP (Lei 14.478/22) */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Segregação Patrimonial VASP</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              LEI 14.478/2022
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Isolamento de Custódia:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Blindagem contra Penhora e Falência</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Prova de Reservas On-Chain:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>&ge; 100% de Cobertura em Cold Wallets</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Auditoria de Smart Contracts:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>Validação Criptográfica Contínua</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Status Regulatório:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>HOMOLOGADO BACEN / CVM</span>
            </div>
          </div>
        </div>

        {/* Declaração Mensal Cripto (IN RFB 1.888/19) */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Declaração IN RFB 1.888/19</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              LEIAUTE OFICIAL RFB
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Obrigatoriedade:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Todas as Operações Mensais</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Tributação Ganho de Capital:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>Tabela Progressiva de 15% a 22,5%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Isenção Pessoa Física:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>Vendas até R$ 35.000,00 / Mês</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Transmissão em Lote:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>Conexão Direta e-CAC / RFB</span>
            </div>
          </div>
        </div>

        {/* Integração Contábil OCPC 08 / CPC 16 */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Contabilização OCPC 08</h3>
            <span style={{ background: '#f59e0b20', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              ESTOQUE VS INTANGÍVEL
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Ativos Próprios para Negociação:</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>CPC 16 (Estoques a Valor Justo)</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Custódia Fiduciária de Terceiros:</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>Contas de Compensação Fora do Balanço</div>
            </div>
          </div>
        </div>
      </div>
    
      {/* DOSSIÊ EXECUTIVO OFICIAL (PADRÃO DIAMANTE) */}
      <div className="diamond-paper-a4" style={{ marginTop: '14px' }}>
        <div className="diamond-header">
          <div>
            <div className="diamond-title">VASP & CRIPTO ASSETS S/A</div>
            <div className="diamond-subtitle">DOSSIÊ REGULATÓRIO DE CRIPTOATIVOS (LEI 14.478/22 & DECLARAÇÃO IN RFB 1.888/19)</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.70rem' }}>
            <div>CNPJ / CPF: <strong>00.000.000/0001-00</strong></div>
            <div>COMPETÊNCIA: <strong>08/2026</strong></div>
            <div style={{ color: '#047857', fontWeight: 800 }}>LEI 14.478/22 & IN RFB 1.888/19</div>
          </div>
        </div>

        <div className="diamond-meta-grid">
          <div className="diamond-meta-item">
            <strong>Segregação Patrimonial VASP</strong>
            <span className="font-mono" style={{ color: "#047857", fontWeight: 800 }}>✓ Blindado (Lei 14.478)</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Volume Declarado (IN 1.888)</strong>
            <span className="font-mono">R$ 45.800.000,00</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Cobertura em Cold Wallets</strong>
            <span className="font-mono" style={{ color: "#047857", fontWeight: 800 }}>105,4% On-Chain</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Status Bacen / RFB</strong>
            <span className="font-mono">✓ Homologado</span>
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
              <td>Bitcoin (BTC): Ativo Virtual de Reserva (bc1q...4488fa)</td>
              <td style={{ textAlign: 'center' }}>On-Chain</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ 28.500.000,00</td>
            </tr>
            <tr>
              <td>Ethereum (ETH) & ERC-20: Smart Contracts (0x71...9910c)</td>
              <td style={{ textAlign: 'center' }}>On-Chain</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ 12.300.000,00</td>
            </tr>
            <tr>
              <td>Stablecoins (USDT / USDC): Moedas Pareadas (0x3b...8820f)</td>
              <td style={{ textAlign: 'center' }}>On-Chain</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ 5.000.000,00</td>
            </tr>
            <tr className="diamond-table-total">
              <td><strong>TOTAL DE OPERAÇÕES COM ATIVOS VIRTUAIS DECLARADAS NA IN 1.888</strong></td>
              <td style={{ textAlign: 'center' }}>Total Declarado</td>
              <td className="font-mono" style={{ textAlign: 'right', color: "#047857" }}>R$ 45.800.000,00</td>
            </tr>
          </tbody>
        </table>

        <div className="diamond-signatures">
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">OFFICER DE COMPLIANCE VASP</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Homologação Oficial</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">RESPONSÁVEL TÉCNICO CONTÁBIL</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Homologação Oficial</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">AUDITORIA ON-CHAIN INDEPENDENTE</div>
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
