import React from 'react';

export const OfficeCarneLeaoCashBookIrpfView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="no-print" style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={() => window.print()} className="btn-primary-action" style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
          🖨️ Imprimir Carnê-Leão & Livro Caixa (A4)
        </button>
      </div>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>🦁</span> Carnê-Leão Web & Livro Caixa IRPF
          </h2>
          <p style={{ margin: '6px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Apuração mensal do IRPF para profissionais liberais e locadores (IN 1.500/14), Livro Caixa Digital com deduções de consultório e exportação IRPF com 1-Click.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{ background: '#10b98120', color: '#10b981', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700 }}>
            IN RFB 1.500/14 • DARF 0190
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Painel de Rendimentos e DARF 0190 */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Rendimentos Recebidos (PF)</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              COMPETÊNCIA 08/2026
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Honorários de Consultório / Aluguéis:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>R$ 28.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Deduções do Livro Caixa:</span>
              <span style={{ fontWeight: 600, color: '#ef4444' }}>- R$ 8.500,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Dedução de Dependentes (2):</span>
              <span style={{ fontWeight: 600, color: '#ef4444' }}>- R$ 379,18</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>DARF Código 0190 Devido:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>R$ 4.360,23 (Guia com Pix)</span>
            </div>
          </div>
        </div>

        {/* Livro Caixa Digital e Deduções Operacionais */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Livro Caixa Digital</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              DESPESAS DEDUTÍVEIS
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Aluguel, Condomínio & IPTU:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>R$ 4.200,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Salário Secretária + INSS Patronal:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>R$ 3.100,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Materiais Odonto/Médicos & Anuidade:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>R$ 1.200,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Economia Tributária Gerada:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>R$ 2.337,50 (27,5% IRPF)</span>
            </div>
          </div>
        </div>

        {/* Integração Automática com a Declaração Anual IRPF */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Exportação IRPF Anual</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              1-CLICK e-CAC
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Sincronização com o Carnê-Leão Web:</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>Importação automática na DIRPF Pré-Preenchida</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Auditoria de Recibos Médicos / DMED:</div>
              <div style={{ fontWeight: 700, color: '#3b82f6', marginTop: '2px' }}>Conferência de CPFs dos pacientes para blindar malha fina</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Status da Declaração:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>BLINDADA RECEITA FEDERAL</span>
            </div>
          </div>
        </div>
      </div>
    
      {/* DOSSIÊ EXECUTIVO OFICIAL (PADRÃO DIAMANTE) */}
      <div className="diamond-paper-a4" style={{ marginTop: '14px' }}>
        <div className="diamond-header">
          <div>
            <div className="diamond-title">DR(A). PROFISSIONAL LIBERAL / MÉDICO / ADVOGADO</div>
            <div className="diamond-subtitle">DEMONSTRATIVO OFICIAL DO LIVRO CAIXA & CARNÊ-LEÃO WEB IRPF (IN RFB 1.500/14)</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.70rem' }}>
            <div>CNPJ / CPF: <strong>00.000.000/0001-00</strong></div>
            <div>COMPETÊNCIA: <strong>08/2026</strong></div>
            <div style={{ color: '#047857', fontWeight: 800 }}>IN RFB 1.500/14 & DARF 0190</div>
          </div>
        </div>

        <div className="diamond-meta-grid">
          <div className="diamond-meta-item">
            <strong>Rendimentos Brutos Recebidos</strong>
            <span className="font-mono">R$ 28.000,00</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Despesas Dedutíveis (Livro Caixa)</strong>
            <span className="font-mono">R$ 8.500,00</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Base de Cálculo Líquida IRPF</strong>
            <span className="font-mono">R$ 19.120,82</span>
          </div>
          <div className="diamond-meta-item">
            <strong>DARF 0190 a Recolher</strong>
            <span className="font-mono" style={{ color: "#047857", fontWeight: 800 }}>R$ 4.360,23</span>
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
              <td>(+) Honorários Profissionais Recebidos de Pessoas Físicas</td>
              <td style={{ textAlign: 'center' }}>Receita PF</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ 28.000,00</td>
            </tr>
            <tr>
              <td>(-) Aluguel de Consultório, Condomínio, IPTU & Energia</td>
              <td style={{ textAlign: 'center' }}>Dedutível</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>- R$ 4.200,00</td>
            </tr>
            <tr>
              <td>(-) Salários de Secretária, Encargos & Material de Consumo</td>
              <td style={{ textAlign: 'center' }}>Dedutível</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>- R$ 4.300,00</td>
            </tr>
            <tr>
              <td>(-) Dedução Legal de Dependentes (2)</td>
              <td style={{ textAlign: 'center' }}>Legal</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>- R$ 379,18</td>
            </tr>
            <tr className="diamond-table-total">
              <td><strong>IMPOSTO DE RENDA DEVIDO NO MÊS (DARF CÓDIGO 0190)</strong></td>
              <td style={{ textAlign: 'center' }}>DARF 0190</td>
              <td className="font-mono" style={{ textAlign: 'right', color: "#047857" }}>R$ 4.360,23</td>
            </tr>
          </tbody>
        </table>

        <div className="diamond-signatures">
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">CONTRIBUINTE TITULAR</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Homologação Oficial</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">RESPONSÁVEL TÉCNICO CONTÁBIL</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Homologação Oficial</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">AUDITORIA LIVRO CAIXA</div>
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
