import React from 'react';

export const OfficeStrategicAdvisoryValuationView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="no-print" style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={() => window.print()} className="btn-primary-action" style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
          🖨️ Imprimir Laudo de Valuation & Advisory (A4)
        </button>
      </div>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>🏛️</span> Consultoria Estratégica, Benchmarking & Valuation
          </h2>
          <p style={{ margin: '6px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Avaliação de empresas clientes (Múltiplos EV/EBITDA e FCD), análise DuPont de rentabilidade e benchmarking setorial de alta performance.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{ background: '#10b98120', color: '#10b981', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700 }}>
            VALUATION & ADVISORY M&A
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Valuation de Empresas (Múltiplos & FCD) */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Valuation de Equity</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              AVALIAÇÃO ECONÔMICA
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>EBITDA LTM do Cliente:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>R$ 2.400.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Múltiplos Setoriais (8.5x EV/EBITDA):</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>R$ 20.400.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Fluxo de Caixa Descontado (WACC 13.5%):</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>R$ 19.800.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Valor de Mercado Sugerido:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>R$ 20.100.000,00 (EQUITY VALUE)</span>
            </div>
          </div>
        </div>

        {/* Análise DuPont (ROE Decomposto) */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Análise DuPont do ROE</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              RENTABILIDADE
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Margem Líquida:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>16,2%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Giro do Ativo Total:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>1,45x</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Alavancagem Financeira (Ativo/PL):</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>1,28x</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>ROE Final vs Média do Setor (18%):</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>30,1% (DESEMPENHO SUPERIOR)</span>
            </div>
          </div>
        </div>

        {/* Honorários de Consultoria Estratégica */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Serviços Consultivos</h3>
            <span style={{ background: '#f59e0b20', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              ALTO VALOR AGREGADO
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Laudos de Avaliação para M&A e Sócios:</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>Emissão de relatórios técnicos assinados pelo Contador</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Reestruturação Societária & Holdins:</div>
              <div style={{ fontWeight: 700, color: '#3b82f6', marginTop: '2px' }}>Planejamento de cisões, fusões e proteção patrimonial</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Posicionamento:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>CONTABILIDADE CONSULTIVA DE ELITE</span>
            </div>
          </div>
        </div>
      </div>
    
      {/* DOSSIÊ EXECUTIVO OFICIAL (PADRÃO DIAMANTE) */}
      <div className="diamond-paper-a4" style={{ marginTop: '14px' }}>
        <div className="diamond-header">
          <div>
            <div className="diamond-title">EMPRESA CLIENTE AVALIADA S/A</div>
            <div className="diamond-subtitle">LAUDO PERICIAL DE AVALIAÇÃO ECONÔMICA, VALUATION (FCD / MÚLTIPLOS) & BENCHMARKING</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.70rem' }}>
            <div>CNPJ / CPF: <strong>00.000.000/0001-00</strong></div>
            <div>COMPETÊNCIA: <strong>08/2026</strong></div>
            <div style={{ color: '#047857', fontWeight: 800 }}>VALUATION & ADVISORY IFRS 13</div>
          </div>
        </div>

        <div className="diamond-meta-grid">
          <div className="diamond-meta-item">
            <strong>EBITDA LTM (12 Meses)</strong>
            <span className="font-mono">R$ 2.400.000,00</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Múltiplo EV/EBITDA Setorial</strong>
            <span className="font-mono">8,5x EBITDA</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Taxa de Desconto (WACC)</strong>
            <span className="font-mono">13,5% ao ano</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Valor de Mercado Justo (Equity)</strong>
            <span className="font-mono" style={{ color: "#047857", fontWeight: 800 }}>R$ 20.100.000,00</span>
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
              <td>Múltiplos de Mercado (EV/EBITDA): Transações Comparáveis (8.5x)</td>
              <td style={{ textAlign: 'center' }}>Múltiplos</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ 20.400.000,00</td>
            </tr>
            <tr>
              <td>Fluxo de Caixa Descontado (FCD): WACC 13.5% a.a.</td>
              <td style={{ textAlign: 'center' }}>FCD</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ 19.800.000,00</td>
            </tr>
            <tr className="diamond-table-total">
              <td><strong>VALOR DE MERCADO CONSENSUAL SUGERIDO PARA M&A (EQUITY VALUE)</strong></td>
              <td style={{ textAlign: 'center' }}>Laudo</td>
              <td className="font-mono" style={{ textAlign: 'right', color: "#047857" }}>R$ 20.100.000,00</td>
            </tr>
          </tbody>
        </table>

        <div className="diamond-signatures">
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">DIRETORIA EXECUTIVA / ACIONISTAS</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Homologação Oficial</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">PERITO AVALIADOR DE EMPRESAS</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Homologação Oficial</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">ADVISORY DE M&A E CORPORATE FINANCE</div>
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
