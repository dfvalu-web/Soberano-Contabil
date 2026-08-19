import React from 'react';

export const OfficeStateOfTheArtDailyAutomationView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>⚡</span> Operações de Ponta 1-Click: Contábil, Fiscal & RH
          </h2>
          <p style={{ margin: '6px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Tecnologias de ponta para a rotina do escritório: Conciliação Bancária com Aprendizado de Padrões por IA, Apuração Fiscal e Folha em Lote com Fechamento do eSocial.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{ background: '#10b98120', color: '#10b981', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700 }}>
            ROBÔ 1-CLICK MULTI-EMPRESAS
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Pilar Contábil de Ponta */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Contábil: Conciliação por IA</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              99.2% DE ACURÁCIA
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Transações Processadas no Mês:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>1.450 Lançamentos</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Classificação Contábil Automática:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>✓ 1.438 Conciliadas por IA</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Segregação de Tarifas e Juros:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>Lançamentos Múltiplos Automáticos</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Economia de Tempo na Digitação:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>95% DE REDUÇÃO DE TEMPO</span>
            </div>
          </div>
        </div>

        {/* Pilar Fiscal de Ponta */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Fiscal: Apuração em Lote 1-Click</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              CARTEIRA COMPLETA
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Empresas Apuradas Simultâneas:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>48 Clientes (Simples/Presumido)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Segregação Monofásica e ICMS-ST:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>Economia Automática Aplicada</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Guias Geradas com Pix Copia e Cola:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>✓ 100% das Guias Prontas</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Tempo de Execução em Lote:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>APENAS 1.2 SEGUNDOS</span>
            </div>
          </div>
        </div>

        {/* Pilar RH / DP de Ponta */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>RH/DP: Folha & eSocial 1-Click</h3>
            <span style={{ background: '#f59e0b20', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              FECHAMENTO S-1299
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Cálculo de Folha e Pró-Labore em Lote:</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>320 holerites gerados com médias automáticas</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Transmissão eSocial S-1200 / S-1210 / S-1299:</div>
              <div style={{ fontWeight: 700, color: '#3b82f6', marginTop: '2px' }}>Envio mTLS direto com certificado A1</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Disponibilização:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>AUTO-ENVIO AOS COLABORADORES</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
