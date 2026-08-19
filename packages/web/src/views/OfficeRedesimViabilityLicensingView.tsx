import React from 'react';

export const OfficeRedesimViabilityLicensingView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>🏢</span> Viabilidade Redesim & Licenciamento Integrado
          </h2>
          <p style={{ margin: '6px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Automação de Consulta Prévia de Endereço (Prefeitura / IPTU), pesquisa de nome empresarial (Junta Comercial) e classificação de risco (Lei 13.874/19 - Bombeiros e Vigilância).
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{ background: '#10b98120', color: '#10b981', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700 }}>
            REDESIM • LEI 13.874/19
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Painel de Viabilidade de Endereço & Zoneamento */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Consulta Prévia de Endereço</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              APROVADO PREFEITURA
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Inscrição Imobiliária (IPTU):</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>045.123.4567-8</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Zoneamento Urbano Municipal:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>Zona Mista Comercial / Serviços</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>CNAE Principal:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>6201-5/01 (Desenvolvimento de Software)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Protocolo de Viabilidade:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>SPV87452109 ATIVO</span>
            </div>
          </div>
        </div>

        {/* Viabilidade de Nome Empresarial (Junta Comercial) */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Nome Empresarial</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              SEM COLIDÊNCIA
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Razão Social / Denominação:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>✓ Aprovada pela Junta Comercial</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Pesquisa Fonética no Registro:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>Nenhuma similaridade impeditiva</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Integração Coleta Web:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>DBE pronto para transmissão</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Status da Etapa:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>LIBERADO PARA CONTRATO SOCIAL</span>
            </div>
          </div>
        </div>

        {/* Licenciamento Integrado & Lei da Liberdade Econômica */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Classificação de Risco</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              BAIXO RISCO (NÍVEL I)
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Dispensa de Alvarás (Lei 13.874/19):</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>Início imediato sem vistoria prévia</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Corpo de Bombeiros & Vigilância:</div>
              <div style={{ fontWeight: 700, color: '#3b82f6', marginTop: '2px' }}>CLCB Simplificado emitido eletronicamente</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Tempo de Abertura:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>CNPJ ATIVO EM MENOS DE 2 HORAS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
