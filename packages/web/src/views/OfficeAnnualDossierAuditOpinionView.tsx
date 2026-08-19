import React from 'react';

export const OfficeAnnualDossierAuditOpinionView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>🏆</span> Dossiê Anual, Carta da Administração (NBC TA 580) & Parecer de Auditoria
          </h2>
          <p style={{ margin: '6px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Marco Histórico de 150 Módulos: Emissão da Carta de Responsabilidade da Administração (NBC TA 580), Parecer de Auditoria Independente (NBC TA 700) e Balanço Social.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{ background: '#10b98120', color: '#10b981', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700 }}>
            150 ABAS CORPORATIVAS • NBC TA 580/700
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Carta de Responsabilidade da Administração (NBC TA 580) */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Carta da Administração</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              BLINDAGEM DO CONTADOR
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Norma de Referência CFC:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>NBC TA 580 / Res. CFC 1.457</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Declaração de Veracidade da Diretoria:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>✓ Assinada pelo Diretor/Sócio</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Inexistência de Fraudes Ocultas:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>Atestada Formalmente</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Proteção Jurídica:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>ISENÇÃO DE RESPONSABILIDADE CIVIL</span>
            </div>
          </div>
        </div>

        {/* Parecer dos Auditores Independentes (NBC TA 700) */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Parecer de Auditoria</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              OPINIÃO LIMPA
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Tipo de Parecer Emitido:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>Sem Ressalvas (Opinião Limpa)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Auditor Responsável Técnico:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>CNA / CRC Ativo</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Conformidade IFRS/CPC:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>100% Adequado às Normas</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Aceitação Bancária:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>APROVAÇÃO MÁXIMA DE CRÉDITO</span>
            </div>
          </div>
        </div>

        {/* Balanço Social & Indicadores ESG do Cliente */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Balanço Social (NBC T 15)</h3>
            <span style={{ background: '#f59e0b20', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              VALOR ADICIONADO
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Tributos Recolhidos à Sociedade:</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>Distribuição transparente de impostos e encargos</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Geração de Riqueza e Empregos:</div>
              <div style={{ fontWeight: 700, color: '#3b82f6', marginTop: '2px' }}>Remuneração da equipe e benefícios corporativos</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Dossiê do Cliente:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>100% COMPLETO E AUDITADO</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
