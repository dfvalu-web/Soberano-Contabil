import React, { useState } from 'react';

export const AccountingOfficeHubView: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState('2026-08');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Principal do Escritório */}
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>🏢</span> Central do Escritório de Contabilidade (4 Pilares)
          </h2>
          <p style={{ margin: '6px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Painel operacional integrado para escritórios contábeis: Fechamento Contábil, Apuração Fiscal, Folha de Pagamento/RH e Auditoria Preventiva da Carteira.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Competência:</span>
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{ background: 'var(--surface-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '8px 14px', borderRadius: '8px', fontWeight: 600 }}
          >
            <option value="2026-08">Agosto / 2026 (Atual)</option>
            <option value="2026-07">Julho / 2026</option>
            <option value="2026-06">Junho / 2026</option>
          </select>
          <span style={{ background: '#10b98120', color: '#10b981', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700 }}>
            CARTEIRA: 100% AUDITADA
          </span>
        </div>
      </div>

      {/* Os 4 Grandes Pilares do Escritório */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* PILAR 1: CONTÁBIL */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📊</span> 1. Pilar Contábil
            </h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
              FECHAMENTO EM LOTE
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Conciliação Bancária (OFX/Open Finance):</span>
                <span style={{ fontWeight: 700, color: '#10b981' }}>100% Conciliado</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Lançamentos Contábeis do Mês:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>14.850 partidas dobradas</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Plano de Contas Referencial:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>RFB / IFRS Atualizado</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Demonstrações Emitidas:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Balancete, BP, DRE, DFC e DMPL</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Status da Carteira Contábil:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>PRONTO PARA SPED ECD</span>
            </div>
          </div>
        </div>

        {/* PILAR 2: FISCAL */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🧾</span> 2. Pilar Fiscal & Tributário
            </h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
              TODOS OS REGIMES
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Simples Nacional (PGDAS-D / DAS):</span>
                <span style={{ fontWeight: 700, color: '#10b981' }}>Guias Geradas</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Lucro Presumido / Real (DARFs):</span>
                <span style={{ fontWeight: 700, color: '#10b981' }}>Apuração Fechada</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Importação DF-e (XMLs):</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>NF-e, NFS-e, NFC-e & CT-e</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>SPED Fiscal & Contribuições:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>Arquivos Validados no PVA</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Cruzamento de Impostos:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>ZERO DIVERGÊNCIA SEFAZ/RFB</span>
            </div>
          </div>
        </div>

        {/* PILAR 3: RH & DEPARTAMENTO PESSOAL */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>👥</span> 3. Pilar RH & Dep. Pessoal
            </h3>
            <span style={{ background: '#8b5cf620', color: '#8b5cf6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
              ESOCIAL & FGTS DIGITAL
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Folha de Pagamento & Pró-Labore:</span>
                <span style={{ fontWeight: 700, color: '#10b981' }}>Processada (100%)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Vidas / Colaboradores Ativos:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>1.240 colaboradores</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Eventos eSocial Periódicos:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>S-1200 e S-1210 Transmitidos</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Guias DCTFWeb & FGTS Digital:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>Emitidas com Código de Barras / PIX</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Conformidade Trabalhista:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>SST & CLT 100% REGULAR</span>
            </div>
          </div>
        </div>

        {/* PILAR 4: AUDITORIA PREVENTIVA & COMPLIANCE */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🛡️</span> 4. Pilar Auditoria Preventiva
            </h3>
            <span style={{ background: '#f59e0b20', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
              MALHA FINA ZERO
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Calendário de Obrigações Acessórias:</span>
                <span style={{ fontWeight: 700, color: '#10b981' }}>0 Vencimentos Pendentes</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Inconsistências Evitadas pelo Robô:</span>
                <span style={{ fontWeight: 700, color: '#10b981' }}>42 alertas sanados</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Cruzamento Folha x eSocial x DCTF:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>Bate 100% no Centavo</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Auditoria DF-e x SPED EFD:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>Sem notas faltantes</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Segurança para o Contador:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>PROTEÇÃO TOTAL CONTRA MULTAS</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
