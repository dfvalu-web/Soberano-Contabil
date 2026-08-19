import React from 'react';

export const OfficeSpedBatchPrevalidatorView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>⚡</span> Auditoria Contínua de SPEDs em Lote & Pré-Validador
          </h2>
          <p style={{ margin: '6px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Varredura preventiva e em lote de arquivos ECD, ECF, EFD-Contribuições, EFD-ICMS/IPI e EFD-Reinf com correção inteligente de PVA.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{ background: '#10b98120', color: '#10b981', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700 }}>
            ECD, ECF & EFD 100% VALIDADOS
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Painel de Validação em Lote */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Lote de Arquivos da Carteira</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              VARREDURA EM TEMPO REAL
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Arquivos SPED Auditados no Mês:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>450 arquivos</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Arquivos 100% Aprovados (Zero Erros):</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>442 arquivos (98,2%)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Arquivos com Inconsistências Pendentes:</span>
              <span style={{ fontWeight: 600, color: '#f59e0b' }}>8 arquivos em auto-correção</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Taxa de Sucesso na Transmissão RFB:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>100% PROTOCOLADOS NO PRAZO</span>
            </div>
          </div>
        </div>

        {/* Radar de Regras Cruzadas (ECD x ECF x EFD) */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Cruzamentos Críticos SPED</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              MALHA FINA RFB
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Recuperação de ECD na ECF (Blocos J/K):</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>Saldos e Mapeamento 100% Iguais</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>EFD-Contribuições x Bloco C170/A100:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>CSTs de Crédito Alinhados com CFOP</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>EFD-ICMS Bloco 1601 x DIMP:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>Cartões e PIX Conciliados</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Segurança Fiscal:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>ZERO RISCO DE AUTUAÇÃO</span>
            </div>
          </div>
        </div>

        {/* Robô de Auto-Retificação */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Robô de Auto-Retificação</h3>
            <span style={{ background: '#f59e0b20', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              CORREÇÃO AUTOMÁTICA
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Mapeamento de Plano Referencial:</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>Correção automática de contas analíticas sem de-para</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Novo Arquivo Retificador Gerado:</div>
              <div style={{ fontWeight: 700, color: '#3b82f6', marginTop: '2px' }}>Hash PVA atualizado e pronto para assinatura ICP-Brasil</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Produtividade:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>ECONOMIA DE HORAS MANUAIS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
