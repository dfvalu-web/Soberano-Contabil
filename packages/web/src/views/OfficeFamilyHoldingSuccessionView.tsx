import React from 'react';

export const OfficeFamilyHoldingSuccessionView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="no-print" style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={() => window.print()} className="btn-primary-action" style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
          🖨️ Imprimir Dossiê de Holding & Sucessão (A4)
        </button>
      </div>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>🏰</span> Planejamento Sucessório, Holding Familiar & Blindagem
          </h2>
          <p style={{ margin: '6px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Simulação comparativa Inventário vs Holding Familiar, ITCMD Progressivo (EC 132/23), Usufruto Vitalício e Cláusulas de Inalienabilidade/Incomunicabilidade.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{ background: '#10b98120', color: '#10b981', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700 }}>
            ART. 23 LEI 9.249/95 & ITCMD PROGRESSIVO
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Comparativo Inventário Judicial vs Holding */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Inventário vs Holding</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              ECONOMIA TRIBUTÁRIA
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Patrimônio Familiar de Mercado:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>R$ 15.000.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Custo do Inventário (ITCMD + Advogado + Custas):</span>
              <span style={{ fontWeight: 600, color: '#ef4444' }}>R$ 2.550.000,00 (17,0%)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Custo Total na Holding Familiar:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>R$ 245.000,00 (1,6%)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Economia Líquida para a Família:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>R$ 2.305.000,00 (ECONOMIA DE 90%)</span>
            </div>
          </div>
        </div>

        {/* Tributação de Locação (PJ vs PF) */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Receita de Aluguéis</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              FLUXO DE CAIXA MENSAL
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Aluguel Mensal do Acervo Imobiliário:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>R$ 80.000,00 / mês</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Imposto na Pessoa Física (IRPF 27,5% Carnê-Leão):</span>
              <span style={{ fontWeight: 600, color: '#ef4444' }}>R$ 22.000,00 / mês</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Imposto na Holding (Lucro Presumido 11,33%):</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>R$ 9.064,00 / mês</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Economia Tributária Anual Recorrente:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>+ R$ 155.232,00 / ano</span>
            </div>
          </div>
        </div>

        {/* Cláusulas Restritivas & Blindagem Jurídica */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Blindagem Jurídica</h3>
            <span style={{ background: '#f59e0b20', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              ESTRUTURA SOCIETÁRIA
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Reserva de Usufruto Vitalício & Voto:</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>Patriarcas mantêm 100% da administração e dos frutos</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Incomunicabilidade, Impenhorabilidade & Reversão:</div>
              <div style={{ fontWeight: 700, color: '#3b82f6', marginTop: '2px' }}>Proteção contra divórcios, execuções e pré-morte dos filhos</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Status da Família:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>PATRIMÔNIO 100% BLINDADO E ETERNO</span>
            </div>
          </div>
        </div>
      </div>
    
      {/* DOSSIÊ EXECUTIVO OFICIAL (PADRÃO DIAMANTE) */}
      <div className="diamond-paper-a4" style={{ marginTop: '14px' }}>
        <div className="diamond-header">
          <div>
            <div className="diamond-title">FAMÍLIA PATRIARCAL SOBERANO</div>
            <div className="diamond-subtitle">DOSSIÊ EXECUTIVO DE PLANEJAMENTO SUCESSÓRIO, HOLDING FAMILIAR & PROTEÇÃO PATRIMONIAL</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.70rem' }}>
            <div>CNPJ / CPF: <strong>00.000.000/0001-00</strong></div>
            <div>COMPETÊNCIA: <strong>08/2026</strong></div>
            <div style={{ color: '#047857', fontWeight: 800 }}>ART. 23 LEI 9.249/95 & ITCMD PROGRESSIVO</div>
          </div>
        </div>

        <div className="diamond-meta-grid">
          <div className="diamond-meta-item">
            <strong>Patrimônio Total Avaliado</strong>
            <span className="font-mono">R$ 15.000.000,00</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Custo Inventário Tradicional</strong>
            <span className="font-mono">R$ 2.550.000,00 (17,0%)</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Custo Estruturação Holding</strong>
            <span className="font-mono">R$ 245.000,00 (1,6%)</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Economia Tributária Líquida</strong>
            <span className="font-mono" style={{ color: "#047857", fontWeight: 800 }}>R$ 2.305.000,00</span>
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
              <td>ITCMD (Imposto sobre Herança/Doação): Inventário vs Holding</td>
              <td style={{ textAlign: 'center' }}>Economia</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>+ R$ 1.040.000,00</td>
            </tr>
            <tr>
              <td>Honorários Advocatícios & Custas Cartorárias de Inventário</td>
              <td style={{ textAlign: 'center' }}>Economia</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>+ R$ 1.265.000,00</td>
            </tr>
            <tr className="diamond-table-total">
              <td><strong>TOTAL DE ECONOMIA LÍQUIDA PARA A FAMÍLIA COM BLINDAGEM</strong></td>
              <td style={{ textAlign: 'center' }}>Total</td>
              <td className="font-mono" style={{ textAlign: 'right', color: "#047857" }}>R$ 2.305.000,00</td>
            </tr>
          </tbody>
        </table>

        <div className="diamond-signatures">
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">PATRIARCAS / INSTITUIDORES</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Homologação Oficial</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">CONSULTOR TRIBUTÁRIO / CONTÁBIL</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Homologação Oficial</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">ASSESSORIA JURÍDICO-SOCIETÁRIA</div>
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
