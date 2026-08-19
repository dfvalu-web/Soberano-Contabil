import React, { useState } from 'react';

export const OfficeDailyOperationsHubView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'contabil' | 'fiscal' | 'dp'>('contabil');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>⚡</span> Operações Diárias: Contábil, Fiscal & RH/DP
          </h2>
          <p style={{ margin: '6px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Centro de comando das rotinas diárias do escritório: Conciliação OFX/CNAB, Apurador e Emissor de Guias DAS/DARF/ISS e Folha/Holerites com Fechamento eSocial S-1299.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{ background: '#10b98120', color: '#10b981', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700 }}>
            ROTINAS OPERACIONAIS 100% ACID
          </span>
        </div>
      </div>

      {/* Sub-navegação interna entre os 3 pilares */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
        <button
          onClick={() => setActiveSubTab('contabil')}
          style={{
            background: activeSubTab === 'contabil' ? 'var(--primary)' : 'var(--surface-secondary)',
            color: activeSubTab === 'contabil' ? '#fff' : 'var(--text-secondary)',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.9rem'
          }}
        >
          📊 1. Rotina Contábil (OFX / Partidas Dobradas)
        </button>
        <button
          onClick={() => setActiveSubTab('fiscal')}
          style={{
            background: activeSubTab === 'fiscal' ? 'var(--primary)' : 'var(--surface-secondary)',
            color: activeSubTab === 'fiscal' ? '#fff' : 'var(--text-secondary)',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.9rem'
          }}
        >
          🧾 2. Rotina Fiscal (Apuração & Guias Pix)
        </button>
        <button
          onClick={() => setActiveSubTab('dp')}
          style={{
            background: activeSubTab === 'dp' ? 'var(--primary)' : 'var(--surface-secondary)',
            color: activeSubTab === 'dp' ? '#fff' : 'var(--text-secondary)',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.9rem'
          }}
        >
          👥 3. Rotina DP / RH (Folha, Pró-Labore & eSocial)
        </button>
      </div>

      {/* Conteúdo dinâmico por pilar */}
      {activeSubTab === 'contabil' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Importação e Conciliação OFX</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Banco / Conta:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Banco Itaú (341) - Ag: 1234 / CC: 56789-0</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Transações Importadas:</span>
                <span style={{ fontWeight: 600, color: '#3b82f6' }}>148 lançamentos</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Total Entradas / Saídas:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>R$ 480.000,00 / R$ 310.000,00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Status da Conciliação:</span>
                <span style={{ fontWeight: 700, color: '#10b981' }}>100% CONCILIADO (ZERO DIFERENÇA)</span>
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Lançamentos Automáticos</h3>
            <div style={{ background: 'var(--surface-secondary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem' }}>
              <div style={{ color: '#10b981', fontWeight: 600 }}>D: 1.1.01.002 - Banco Itaú C/Movimento</div>
              <div style={{ color: '#3b82f6', fontWeight: 600 }}>C: 1.1.02.001 - Clientes a Receber (NF 1042)</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Histórico: Recebimento ref. Venda de Mercadorias</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem' }}>
              <div style={{ color: '#ef4444', fontWeight: 600 }}>D: 2.1.01.001 - Fornecedores Nacionais</div>
              <div style={{ color: '#10b981', fontWeight: 600 }}>C: 1.1.01.002 - Banco Itaú C/Movimento</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Histórico: Pagamento ref. Fornecedor Insumos Ltda</div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'fiscal' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Apuração de Impostos do Mês</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Regime Tributário:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Simples Nacional (Anexo III)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Faturamento do Período:</span>
                <span style={{ fontWeight: 600, color: '#3b82f6' }}>R$ 125.000,00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Alíquota Efetiva PGDAS-D:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>6,00%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Valor Total DAS:</span>
                <span style={{ fontWeight: 700, color: '#10b981' }}>R$ 7.500,00 (Vencimento 20/09)</span>
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Guias com Código de Barras & Pix</h3>
            <div style={{ background: 'var(--surface-secondary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem' }}>
              <div style={{ fontWeight: 700, color: '#10b981' }}>Guia DAS Simples Nacional</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Código de Barras: 858300000018 75000000000 00000000000 00000000000</div>
              <div style={{ color: '#3b82f6', fontWeight: 600, fontSize: '0.8rem' }}>Pix Copia e Cola: 00020126580014br.gov.bcb.pix0136DAS_0001_PGDAS</div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'dp' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Resumo da Folha & Pró-Labore</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Colaboradores CLT / Sócios:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>12 Funcionários + 2 Sócios</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Folha Bruta Total:</span>
                <span style={{ fontWeight: 600, color: '#3b82f6' }}>R$ 65.400,00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>INSS Retido / FGTS Digital (Pix):</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>R$ 6.820,00 / R$ 4.432,00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Líquido a Pagar (Bancário):</span>
                <span style={{ fontWeight: 700, color: '#10b981' }}>R$ 55.380,00</span>
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Fechamento eSocial & Holerites</h3>
            <div style={{ background: 'var(--surface-secondary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem' }}>
              <div style={{ fontWeight: 700, color: '#10b981' }}>Evento S-1299 (Fechamento) Transmitido com Sucesso</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Recibo Governamental: 1.2.202609.0000000000123456789</div>
              <div style={{ color: '#3b82f6', fontWeight: 600, fontSize: '0.8rem' }}>14 Holerites gerados e disponibilizados no Portal do Cliente</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
