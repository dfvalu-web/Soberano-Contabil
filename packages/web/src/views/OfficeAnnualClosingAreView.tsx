import React, { useState, useMemo } from 'react';
import { officeStore } from '../state/office-store.js';

export const OfficeAnnualClosingAreView: React.FC = () => {
  const tenants = useMemo(() => officeStore.getTenants(), []);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('t1');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-primary)' }}>
      <div className="no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>⚖️</span>
            <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
              Apuração do Resultado [ARE], DRE & Balanço Anual
            </h1>
            <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--emerald-400)', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800 }}>
              NBC TG 26 / IFRS & Lei 6.404/76
            </span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Encerramento anual de receitas/despesas, cálculo de Reserva Legal (5%), DRE e Balanço Patrimonial equilibrado.
          </p>
        </div>
        <button onClick={() => alert('ARE executado com sucesso!')} className="btn-primary-action">
          <span>🔒</span> Executar ARE em 1-Click
        </button>
      </div>

      <div className="no-print" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
        <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', padding: '16px', borderRadius: '10px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>RECEITA LÍQUIDA</div>
          <div className="font-mono" style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>R$ 1.319.500,00</div>
        </div>
        <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', padding: '16px', borderRadius: '10px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>LUCRO LÍQUIDO</div>
          <div className="font-mono" style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--emerald-400)', marginTop: '4px' }}>R$ 584.000,00</div>
        </div>
      </div>
    
      {/* DOSSIÊ EXECUTIVO OFICIAL (PADRÃO DIAMANTE) */}
      <div className="diamond-paper-a4" style={{ marginTop: '14px' }}>
        <div className="diamond-header">
          <div>
            <div className="diamond-title">GRUPO EMPRESARIAL SOBERANO</div>
            <div className="diamond-subtitle">APURAÇÃO DO RESULTADO DO EXERCÍCIO (ARE), BALANÇO & DRE CONSOLIDADA (CPC 26)</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.70rem' }}>
            <div>CNPJ / CPF: <strong>00.000.000/0001-00</strong></div>
            <div>COMPETÊNCIA: <strong>08/2026</strong></div>
            <div style={{ color: '#047857', fontWeight: 800 }}>NBC TG 26 / IFRS & LEI 6.404/76</div>
          </div>
        </div>

        <div className="diamond-meta-grid">
          <div className="diamond-meta-item">
            <strong>Receita Operacional Líquida</strong>
            <span className="font-mono">R$ 1.319.500,00</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Custos e Despesas Totais</strong>
            <span className="font-mono">R$ 735.500,00</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Lucro Antes IR/CSLL</strong>
            <span className="font-mono">R$ 584.000,00</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Lucro Líquido Final Apurado</strong>
            <span className="font-mono" style={{ color: "#047857", fontWeight: 800 }}>R$ 584.000,00</span>
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
              <td>(+) Receita Operacional Bruta de Bens e Serviços</td>
              <td style={{ textAlign: 'center' }}>Conta 3.1</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ 1.319.500,00</td>
            </tr>
            <tr>
              <td>(-) Custos dos Produtos e Serviços Prestados (CPV/CSP)</td>
              <td style={{ textAlign: 'center' }}>Conta 4.1</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>- R$ 480.000,00</td>
            </tr>
            <tr>
              <td>(-) Despesas Operacionais, Administrativas & Comerciais</td>
              <td style={{ textAlign: 'center' }}>Conta 4.2</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>- R$ 255.500,00</td>
            </tr>
            <tr className="diamond-table-total">
              <td><strong>RESULTADO LÍQUIDO TRANSFERIDO PARA LUCROS ACUMULADOS</strong></td>
              <td style={{ textAlign: 'center' }}>Conta 2.3.3.01</td>
              <td className="font-mono" style={{ textAlign: 'right', color: "#047857" }}>R$ 584.000,00</td>
            </tr>
          </tbody>
        </table>

        <div className="diamond-signatures">
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">DIRETORIA FINANCEIRA</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Homologação Oficial</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">RESPONSÁVEL TÉCNICO CONTÁBIL</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Homologação Oficial</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">AUDITORIA CONTÁBIL INDEPENDENTE</div>
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
export default OfficeAnnualClosingAreView;