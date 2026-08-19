import React from 'react';

export const OfficeAmlCoafComplianceView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>🛡️</span> Prevenção à Lavagem de Dinheiro (PLD/CFT) & COAF / CFC
          </h2>
          <p style={{ margin: '6px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Conformidade com a Lei 9.613/98 e Resolução CFC 1.530/17: detecção de transações atípicas, triagem PEP e Declaração Anual de Não Ocorrência.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{ background: '#10b98120', color: '#10b981', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700 }}>
            LEI Nº 9.613/98 & RES. CFC 1.530/17
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Painel de Monitoramento PLD/CFT */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Monitor de Risco da Carteira</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              VARREDURA MENSAL
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Empresas Auditadas:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>128 clientes ativos</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Operações em Espécie &gt; R$ 50k:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>0 detectadas (100% bancarizado)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Incompatibilidade de Faturamento:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>Zero anomalias patrimoniais</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Status da Carteira:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>BAIXO RISCO DE CONFORMIDADE</span>
            </div>
          </div>
        </div>

        {/* Triagem de Pessoas Expostas Politicamente (PEP) */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Due Diligence & PEPs</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              KYC AUTOMATIZADO
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Sócios e Administradores Triados:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>340 CPFs verificados</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Cruzamento Base Transparência/PEP:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>Consulta diária integrada</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Sócios PEP Identificados:</span>
              <span style={{ fontWeight: 600, color: '#f59e0b' }}>2 sócios (Dossiê Reforçado Ativo)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Conformidade Know Your Customer:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>100% REGULAR E DOCUMENTADO</span>
            </div>
          </div>
        </div>

        {/* Declaração Anual de Não Ocorrência ao COAF / CFC */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Declaração COAF (DNO)</h3>
            <span style={{ background: '#f59e0b20', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              PROTEÇÃO PROFISSIONAL
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Declaração de Não Ocorrência (Exercício 2026):</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>Transmitida ao Conselho Federal de Contabilidade</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Recibo de Protocolo Digital:</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>COAF-2026-99A8B7C6D5E4F3A2</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Blindagem do Contador:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>ZERO RISCO DE MULTA OU SANÇÃO</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
