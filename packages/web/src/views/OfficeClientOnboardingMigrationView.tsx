import React from 'react';

export const OfficeClientOnboardingMigrationView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>🚀</span> Onboarding Digital de Clientes & Migração Contábil
          </h2>
          <p style={{ margin: '6px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Workflow de acolhimento de novos clientes, diagnóstico 360º de CNDs, procurações eletrônicas e robô de importação de saldos de abertura.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{ background: '#10b98120', color: '#10b981', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700 }}>
            INTEGRAÇÃO 100% AUTOMATIZADA
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Checklist de Onboarding Digital */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Workflow de Integração</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              PRONTIDÃO 100%
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Procuração Eletrônica e-CAC RFB:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>Ativa e Homologada</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Procuração SEFAZ & Prefeitura:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>Vinculada ao e-CNPJ do Escritório</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Diagnóstico CNDs (Federal, FGTS, CNDT):</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>100% Negativas (Sem Débitos)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Kit de Boas-Vindas & Acesso Portal B2B:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>DISPARADO AUTOMATICAMENTE</span>
            </div>
          </div>
        </div>

        {/* Robô de De-Para e Migração de Saldos */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Migração de Dados Contábeis</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              DE-PARA DE PLANO DE CONTAS
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Origem dos Dados:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>ECD Anterior / Arquivo TXT/CSV</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Contas Mapeadas para Plano Soberano:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>248 contas analíticas</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Equação Patrimonial de Abertura:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>Ativo R$ 3.2M == Passivo+PL R$ 3.2M</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Status da Migração:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>CONCLUÍDO SEM DIVERGÊNCIAS</span>
            </div>
          </div>
        </div>

        {/* Experiência do Cliente no Início */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Experiência & Acolhimento</h3>
            <span style={{ background: '#f59e0b20', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              ENCANTAMENTO
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Tempo Médio de Onboarding:</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>Redução de 15 dias para apenas 48 horas</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Alinhamento Tributário Inicial:</div>
              <div style={{ fontWeight: 700, color: '#3b82f6', marginTop: '2px' }}>Diagnóstico de oportunidades de economia fiscal</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Resultado:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>CLIENTE 100% OPERACIONAL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
