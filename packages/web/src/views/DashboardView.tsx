import React from 'react';
import { Activity, ShieldCheck, Zap, TrendingUp, AlertTriangle, Layers, FileCheck } from 'lucide-react';

export const DashboardView: React.FC = () => {
  return (
    <div>
      {/* Top Banner / Hero */}
      <div className="no-print" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em' }}>
            Cockpit Fiscal & Contábil Autônomo
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Monitoramento em tempo real de conformidade SPED, apuração híbrida (Legado + Reforma EC 132/2023) e pipeline DF-e Zero-Touch.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <span className="badge badge-emerald">
            <Zap size={14} /> Pipeline Zero-Touch Ativo
          </span>
          <button onClick={() => window.print()} className="btn-primary-action" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
            🖨️ Imprimir Dossiê Executivo (A4)
          </button>
          <span className="badge badge-cyan">
            <ShieldCheck size={14} /> Pre-Flight PVA 100% Ok
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="no-print grid-cards-4">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Score Fiscal Pre-Flight</span>
            <ShieldCheck size={20} color="var(--emerald-400)" />
          </div>
          <div className="metric-value" style={{ color: 'var(--emerald-400)' }}>98.4%</div>
          <div className="metric-sub">
            <span style={{ color: 'var(--emerald-400)', fontWeight: 700 }}>+2.1%</span> vs mês anterior (0 inconsistências críticas)
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">DF-e Ingeridos (Zero-Touch)</span>
            <Zap size={20} color="var(--cyan-500)" />
          </div>
          <div className="metric-value">14.820</div>
          <div className="metric-sub">
            <span style={{ color: 'var(--cyan-500)', fontWeight: 700 }}>99.2%</span> contabilizados automaticamente
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Tributos Apurados (Mês)</span>
            <TrendingUp size={20} color="var(--indigo-500)" />
          </div>
          <div className="metric-value">R$ 482.350</div>
          <div className="metric-sub">
            DAS, DCTFWeb, IRPJ/CSLL e CBS/IBS simulados
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Obrigações SPED Status</span>
            <FileCheck size={20} color="var(--emerald-400)" />
          </div>
          <div className="metric-value" style={{ color: 'var(--emerald-400)' }}>5 / 5</div>
          <div className="metric-sub">
            ECD, ECF, EFD-ICMS, Contribuições & Reinf
          </div>
        </div>
      </div>

      {/* Main Panels */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div className="no-print panel-card">
          <div className="panel-title-bar">
            <h2><Activity size={18} color="var(--emerald-500)" /> Matriz de Auditoria Cruzada & Pre-Flight</h2>
            <span className="badge badge-emerald">Auditoria Contínua</span>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Cruzamento Fiscal</th>
                  <th>Período</th>
                  <th>Status</th>
                  <th>Impacto Risco</th>
                  <th>Diagnóstico</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 600 }}>EFD-ICMS/IPI x EFD-Contribuições</td>
                  <td className="font-mono">2026-01</td>
                  <td><span className="badge badge-emerald">Conciliado</span></td>
                  <td className="font-mono">R$ 0,00</td>
                  <td style={{ color: 'var(--text-secondary)' }}>Faturamento 100% aderente entre blocos C e M</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>ECF Bloco L/P x ECD Bloco J (DRE)</td>
                  <td className="font-mono">2025-Anual</td>
                  <td><span className="badge badge-emerald">Validado</span></td>
                  <td className="font-mono">R$ 0,00</td>
                  <td style={{ color: 'var(--text-secondary)' }}>Resultado contábil amarrado ao Lalur Parte A</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>DCTFWeb x eSocial S-1299 x Reinf</td>
                  <td className="font-mono">2026-01</td>
                  <td><span className="badge badge-emerald">Sincronizado</span></td>
                  <td className="font-mono">R$ 0,00</td>
                  <td style={{ color: 'var(--text-secondary)' }}>Guias de INSS e retenções federais batidas ao centavo</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>Reforma Dual-Engine (CBS/IBS vs PIS/COFINS)</td>
                  <td className="font-mono">2026-Transição</td>
                  <td><span className="badge badge-cyan">Em Simulação</span></td>
                  <td className="font-mono">R$ 1.000,00</td>
                  <td style={{ color: 'var(--text-secondary)' }}>Ano-teste: alíquotas CBS 0,9% e IBS 0,1% compensáveis</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel-card">
          <div className="panel-title-bar">
            <h2><Layers size={18} color="var(--indigo-500)" /> Regimes Ativos</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '0.85rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Simples Nacional</span>
                <span className="font-mono" style={{ color: 'var(--emerald-400)', fontWeight: 700 }}>45% das empresas</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Monitoramento automático de Fator R e sublimites estaduais</p>
            </div>

            <div style={{ padding: '0.85rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Lucro Presumido</span>
                <span className="font-mono" style={{ color: 'var(--cyan-500)', fontWeight: 700 }}>35% das empresas</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Apuração trimestral IRPJ/CSLL com retenções compensadas</p>
            </div>

            <div style={{ padding: '0.85rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Lucro Real & Lalur</span>
                <span className="font-mono" style={{ color: 'var(--indigo-500)', fontWeight: 700 }}>20% das empresas</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Trava de 30% prejuízos Parte B e PIS/COFINS não-cumulativo</p>
            </div>
          </div>
        </div>
      </div>
    
      {/* DOSSIÊ EXECUTIVO OFICIAL (PADRÃO DIAMANTE) */}
      <div className="diamond-paper-a4" style={{ marginTop: '14px' }}>
        <div className="diamond-header">
          <div>
            <div className="diamond-title">DAVID AUDITORIA, CONTROLADORIA & BPO CONTÁBIL</div>
            <div className="diamond-subtitle">RELATÓRIO EXECUTIVO CONSOLIDADO • CONFORMIDADE FISCAL, CONTÁBIL & DF-e ZERO-TOUCH</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.70rem' }}>
            <div>CNPJ / CPF: <strong>00.000.000/0001-00</strong></div>
            <div>COMPETÊNCIA: <strong>08/2026</strong></div>
            <div style={{ color: '#047857', fontWeight: 800 }}>ISO 9001 • CFC • NBC TG</div>
          </div>
        </div>

        <div className="diamond-meta-grid">
          <div className="diamond-meta-item">
            <strong>Score Fiscal Pre-Flight</strong>
            <span className="font-mono" style={{ color: "#047857", fontWeight: 800 }}>98,4% (Zero Inconsistências)</span>
          </div>
          <div className="diamond-meta-item">
            <strong>DF-e Ingeridos (Zero-Touch)</strong>
            <span className="font-mono">14.820 Notas</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Tributos Totais Apurados</strong>
            <span className="font-mono">R$ 482.350,00</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Massa Salarial Gerenciada</strong>
            <span className="font-mono">R$ 1.840.000,00</span>
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
              <td>Fiscal & Tributário: SPED Fiscal, EFD-Reinf, PGDAS-D & Retenções</td>
              <td style={{ textAlign: 'center' }}>14.820 DF-e</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>99,2% Automatizado</td>
            </tr>
            <tr>
              <td>Departamento Pessoal: Folha CLT, eSocial S-1299 & DCTFWeb</td>
              <td style={{ textAlign: 'center' }}>48 Vidas</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>100% Conforme</td>
            </tr>
            <tr>
              <td>Contabilidade & IFRS: Partidas Dobradas, DRE, Balanço & ARE</td>
              <td style={{ textAlign: 'center' }}>3.410 Lançamentos</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>100% Equilibrado</td>
            </tr>
            <tr className="diamond-table-total">
              <td><strong>NÍVEL GERAL DE CONFORMIDADE E SEGURANÇA JURÍDICA DA CARTEIRA</strong></td>
              <td style={{ textAlign: 'center' }}>Geral</td>
              <td className="font-mono" style={{ textAlign: 'right', color: "#047857" }}>EXCELÊNCIA DIAMANTE</td>
            </tr>
          </tbody>
        </table>

        <div className="diamond-signatures">
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">DIRETORIA EXECUTIVA / CEO</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Homologação Oficial</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">RESPONSÁVEL TÉCNICO CONTÁBIL</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Homologação Oficial</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">AUDITORIA INDEPENDENTE / IFRS</div>
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
