import React from 'react';

export const CryptoVaspIn1888ComplianceView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
    </div>
  );
};
