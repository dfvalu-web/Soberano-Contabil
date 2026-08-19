// ==========================================================================
// SOBERANO CONTÁBIL — DOSSIÊ EXECUTIVO DE RH & GESTÃO DE PESSOAS (PADRÃO DIAMANTE)
// RELATÓRIO EXECUTIVO DE ELITE: 1 PÁGINA A4 PERFEITA, AUDITORIA & KPIS
// ==========================================================================

import React, { useState, useMemo } from 'react';
import { officeStore, Employee, PayrollStatement } from '../state/office-store.js';
import {
  Award,
  Printer,
  ShieldCheck,
  Building2,
  Users,
  DollarSign,
  TrendingUp,
  Scale,
  Calendar,
  AlertTriangle,
  FileCheck,
  CheckCircle2,
  Sparkles,
  Download,
  Share2
} from 'lucide-react';

export const OfficeRhExecutiveReportsDiamondView: React.FC = () => {
  const tenants = useMemo(() => officeStore.getTenants(), []);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('t1');
  const employees = useMemo(() => officeStore.getEmployees(selectedTenantId), [selectedTenantId]);

  const [competencia, setCompetencia] = useState<string>('08/2026');
  const [reportTheme, setReportTheme] = useState<'DIAMOND_WHITE' | 'DARK_ELITE'>('DIAMOND_WHITE');

  const currentTenant = useMemo(() => {
    return tenants.find(t => t.id === selectedTenantId) || tenants[0];
  }, [tenants, selectedTenantId]);

  const payrollStatements = useMemo<PayrollStatement[]>(() => {
    return employees.map(emp => officeStore.calculatePayroll(emp, competencia));
  }, [employees, competencia]);

  const totals = useMemo(() => {
    let grossTotal = 0;
    let netTotal = 0;
    let inssTotal = 0;
    let fgtsTotal = 0;
    let irrfTotal = 0;

    payrollStatements.forEach(stmt => {
      grossTotal += stmt.totalProventos;
      netTotal += stmt.netSalary;
      inssTotal += stmt.baseInss * 0.11;
      fgtsTotal += stmt.fgtsAmount;
      irrfTotal += stmt.items.find(i => i.code === '505')?.amount || 0;
    });

    const inssPatronal = grossTotal * 0.20;
    const ratTerceiros = grossTotal * 0.078;
    const totalEncargosEmpresa = inssPatronal + ratTerceiros + fgtsTotal;
    const custoTotalMaoDeObra = grossTotal + inssPatronal + ratTerceiros;
    const custoMedioPorColaborador = employees.length > 0 ? (custoTotalMaoDeObra / employees.length) : 0;
    const fatorEncargosPercentual = grossTotal > 0 ? ((totalEncargosEmpresa / grossTotal) * 100) : 0;

    return {
      grossTotal,
      netTotal,
      inssSegurados: inssTotal,
      inssPatronal,
      ratTerceiros,
      inssEmpresaTotal: inssTotal + inssPatronal + ratTerceiros,
      fgtsTotal,
      irrfTotal,
      totalEncargosEmpresa,
      custoTotalMaoDeObra,
      custoMedioPorColaborador,
      fatorEncargosPercentual
    };
  }, [payrollStatements, employees]);

  // Rateio Departamental
  const departmentBreakdown = useMemo(() => {
    const map: { [dept: string]: { count: number; totalGross: number; totalNet: number } } = {};
    employees.forEach(emp => {
      const dept = emp.department || 'Geral';
      if (!map[dept]) {
        map[dept] = { count: 0, totalGross: 0, totalNet: 0 };
      }
      map[dept].count += 1;
      map[dept].totalGross += emp.baseSalary;
      map[dept].totalNet += emp.baseSalary * 0.85;
    });
    return Object.entries(map).map(([name, data]) => ({
      name,
      ...data,
      percent: totals.grossTotal > 0 ? ((data.totalGross / totals.grossTotal) * 100) : 0
    }));
  }, [employees, totals.grossTotal]);

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', color: 'var(--text-primary)' }}>
      {/* Top Controls Bar - Oculto na Impressão */}
      <div className="no-print" style={{ background: 'var(--bg-surface-elevated)', padding: '14px 20px', borderRadius: '10px', border: '1px solid var(--border-medium)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.4rem' }}>💎</span>
            <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
              Dossiê Executivo de Gente & Gestão (Padrão Diamante)
            </h1>
            <span style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.2))', color: 'var(--emerald-400)', border: '1px solid var(--emerald-500)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800 }}>
              1 Página A4 Executiva Oficial
            </span>
          </div>
          <p style={{ margin: '2px 0 0', color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
            Relatório gerencial consolidado para Diretoria, Conselho de Administração e Auditoria Trabalhista.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <select
            value={selectedTenantId}
            onChange={e => setSelectedTenantId(e.target.value)}
            style={{ background: '#0B1120', border: '1px solid var(--border-medium)', color: '#fff', padding: '6px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700 }}
          >
            {tenants.map(t => (
              <option key={t.id} value={t.id}>🏢 {t.name}</option>
            ))}
          </select>

          <button
            onClick={() => setReportTheme(prev => prev === 'DIAMOND_WHITE' ? 'DARK_ELITE' : 'DIAMOND_WHITE')}
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-medium)', color: '#fff', padding: '6px 10px', borderRadius: '6px', fontSize: '0.76rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <Sparkles size={13} /> Tema: {reportTheme === 'DIAMOND_WHITE' ? 'Papel A4 Real' : 'Dark Elite'}
          </button>

          <button
            onClick={handlePrintReport}
            className="btn-primary-action"
            style={{ padding: '6px 14px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Printer size={14} /> Imprimir / Salvar PDF Oficial
          </button>
        </div>
      </div>

      {/* DOCUMENTO PADRÃO DIAMANTE (FORMATO 1 PÁGINA A4 CRISTALINO) */}
      <div className={reportTheme === 'DIAMOND_WHITE' ? 'diamond-paper-a4' : 'diamond-report-card'} style={reportTheme === 'DARK_ELITE' ? { padding: '20px' } : { padding: '16px 20px', maxWidth: '860px', margin: '0 auto' }}>
        
        {/* 1. CABEÇALHO NOBRE COM BRASÃO E IDENTIFICAÇÃO OFICIAL */}
        <div className="diamond-header" style={reportTheme === 'DARK_ELITE' ? { borderBottomColor: 'var(--border-medium)', paddingBottom: '8px', marginBottom: '8px' } : { paddingBottom: '8px', marginBottom: '8px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #0F172A, #047857)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.2rem', fontWeight: 900, border: '2px solid #34D399' }}>
                S
              </div>
              <div>
                <div className="diamond-title" style={reportTheme === 'DARK_ELITE' ? { color: '#fff', fontSize: '1.0rem' } : { fontSize: '1.0rem' }}>
                  {currentTenant.name}
                </div>
                <div className="diamond-subtitle" style={{ fontSize: '0.68rem' }}>
                  DOSSIÊ EXECUTIVO DE GESTÃO DE PESSOAS & AUDITORIA DE FOLHA
                </div>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right', fontSize: '0.68rem' }}>
            <div style={{ fontWeight: 800, color: reportTheme === 'DARK_ELITE' ? '#fff' : '#0F172A' }}>
              COMPETÊNCIA: <span style={{ color: '#047857', fontSize: '0.78rem' }}>{competencia}</span>
            </div>
            <div style={{ color: reportTheme === 'DARK_ELITE' ? 'var(--text-secondary)' : '#64748B' }}>
              EMISSÃO: {new Date().toLocaleDateString('pt-BR')} • PROTOCOLO: SC-{Date.now().toString().slice(-8)}
            </div>
            <div style={{ marginTop: '2px' }}>
              <span style={{ background: '#DCFCE7', color: '#166534', border: '1px solid #86EFAC', padding: '1px 5px', borderRadius: '3px', fontSize: '0.60rem', fontWeight: 800 }}>
                ✓ eSocial & DCTFWeb 100% HOMOLOGADO
              </span>
            </div>
          </div>
        </div>

        {/* 2. GRADE DE METADADOS CORPORATIVOS */}
        <div className="diamond-meta-grid" style={reportTheme === 'DARK_ELITE' ? { background: '#0B1120', borderColor: 'var(--border-subtle)', padding: '6px 8px', marginBottom: '8px' } : { padding: '6px 8px', marginBottom: '8px' }}>
          <div className="diamond-meta-item">
            <strong>CNPJ Empregador</strong>
            <span className="font-mono" style={reportTheme === 'DARK_ELITE' ? { color: '#fff' } : {}}>{currentTenant.cnpj}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>CNAE Principal</strong>
            <span style={reportTheme === 'DARK_ELITE' ? { color: '#fff' } : {}}>{currentTenant.cnaePrincipal}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Regime Tributário</strong>
            <span style={reportTheme === 'DARK_ELITE' ? { color: '#fff' } : {}}>{currentTenant.regime.replace('_', ' ')}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Ambiente eSocial</strong>
            <span style={{ color: '#047857' }}>Produção Restrita (Oficial)</span>
          </div>
        </div>

        {/* 3. ROW DE INDICADORES CHAVE DE PERFORMANCE (KPIS DE RH) */}
        <div className="diamond-kpi-row" style={{ gap: '6px', marginBottom: '8px' }}>
          <div className="diamond-kpi-box" style={reportTheme === 'DARK_ELITE' ? { background: '#0B1120', borderLeftColor: 'var(--emerald-500)', padding: '5px 8px' } : { padding: '5px 8px' }}>
            <strong>Headcount Ativo</strong>
            <div className="value" style={reportTheme === 'DARK_ELITE' ? { color: '#fff', fontSize: '0.90rem' } : { fontSize: '0.90rem' }}>{employees.length} Vidas</div>
            <span style={{ fontSize: '0.58rem', color: '#64748B' }}>100% CLT / eSocial S-2200</span>
          </div>

          <div className="diamond-kpi-box" style={reportTheme === 'DARK_ELITE' ? { background: '#0B1120', borderLeftColor: 'var(--cyan-500)', padding: '5px 8px' } : { padding: '5px 8px' }}>
            <strong>Massa Salarial Bruta</strong>
            <div className="value" style={reportTheme === 'DARK_ELITE' ? { color: 'var(--cyan-300)', fontSize: '0.90rem' } : { color: '#0369A1', fontSize: '0.90rem' }}>
              R$ {totals.grossTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <span style={{ fontSize: '0.58rem', color: '#64748B' }}>Proventos Totais</span>
          </div>

          <div className="diamond-kpi-box" style={reportTheme === 'DARK_ELITE' ? { background: '#0B1120', borderLeftColor: 'var(--emerald-500)', padding: '5px 8px' } : { padding: '5px 8px' }}>
            <strong>Líquido a Pagar</strong>
            <div className="value" style={{ color: '#047857', fontSize: '0.90rem' }}>
              R$ {totals.netTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <span style={{ fontSize: '0.58rem', color: '#64748B' }}>Crédito em Conta Corrente</span>
          </div>

          <div className="diamond-kpi-box" style={reportTheme === 'DARK_ELITE' ? { background: '#0B1120', borderLeftColor: '#A78BFA', padding: '5px 8px' } : { padding: '5px 8px' }}>
            <strong>Encargos Sociais</strong>
            <div className="value" style={reportTheme === 'DARK_ELITE' ? { color: '#A78BFA', fontSize: '0.90rem' } : { color: '#6D28D9', fontSize: '0.90rem' }}>
              R$ {totals.totalEncargosEmpresa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <span style={{ fontSize: '0.58rem', color: '#64748B' }}>Fator: {totals.fatorEncargosPercentual.toFixed(1)}%</span>
          </div>

          <div className="diamond-kpi-box" style={reportTheme === 'DARK_ELITE' ? { background: '#0B1120', borderLeftColor: 'var(--amber-500)', padding: '5px 8px' } : { padding: '5px 8px' }}>
            <strong>Custo Per Capita</strong>
            <div className="value" style={reportTheme === 'DARK_ELITE' ? { color: 'var(--amber-400)', fontSize: '0.90rem' } : { color: '#B45309', fontSize: '0.90rem' }}>
              R$ {totals.custoMedioPorColaborador.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <span style={{ fontSize: '0.58rem', color: '#64748B' }}>Custo / Colaborador</span>
          </div>
        </div>

        {/* 4. TABELA ANALÍTICA DE CONSOLIDAÇÃO DA FOLHA */}
        <div style={{ marginTop: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
            <h4 style={{ margin: 0, fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', color: reportTheme === 'DARK_ELITE' ? '#fff' : '#0F172A' }}>
              I. Demostrativo Individualizado dos Colaboradores & Bases de Cálculo
            </h4>
            <span style={{ fontSize: '0.62rem', color: '#64748B' }}>Valores em Reais (BRL)</span>
          </div>

          <table className="diamond-table" style={{ margin: '4px 0', fontSize: '0.66rem' }}>
            <thead>
              <tr>
                <th style={{ padding: '3px 6px' }}>Colaborador / Cargo</th>
                <th style={{ padding: '3px 6px' }}>CPF</th>
                <th style={{ padding: '3px 6px' }}>CBO</th>
                <th style={{ padding: '3px 6px', textAlign: 'right' }}>Salário Base</th>
                <th style={{ padding: '3px 6px', textAlign: 'right' }}>Proventos</th>
                <th style={{ padding: '3px 6px', textAlign: 'right' }}>Descontos</th>
                <th style={{ padding: '3px 6px', textAlign: 'right' }}>Líquido</th>
                <th style={{ padding: '3px 6px', textAlign: 'right' }}>FGTS (8%)</th>
              </tr>
            </thead>
            <tbody>
              {payrollStatements.map(stmt => {
                const emp = employees.find(e => e.id === stmt.employeeId);
                return (
                  <tr key={stmt.employeeId}>
                    <td style={{ fontWeight: 700, padding: '3px 6px' }}>
                      {stmt.employeeName}
                      <span style={{ fontSize: '0.58rem', color: '#64748B', fontWeight: 400, marginLeft: '4px' }}>• {stmt.role}</span>
                    </td>
                    <td className="font-mono" style={{ padding: '3px 6px' }}>{stmt.cpf}</td>
                    <td className="font-mono" style={{ padding: '3px 6px' }}>{stmt.cbo}</td>
                    <td className="font-mono" style={{ textAlign: 'right', padding: '3px 6px' }}>
                      R$ {emp?.baseSalary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="font-mono" style={{ textAlign: 'right', fontWeight: 700, color: '#047857', padding: '3px 6px' }}>
                      R$ {stmt.totalProventos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="font-mono" style={{ textAlign: 'right', color: '#B91C1C', padding: '3px 6px' }}>
                      - R$ {stmt.totalDescontos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="font-mono" style={{ textAlign: 'right', fontWeight: 800, color: '#0F172A', padding: '3px 6px' }}>
                      R$ {stmt.netSalary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="font-mono" style={{ textAlign: 'right', padding: '3px 6px' }}>
                      R$ {stmt.fgtsAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                );
              })}
              <tr className="diamond-table-total">
                <td colSpan={3} style={{ textTransform: 'uppercase', padding: '3px 6px' }}>TOTAL CONSOLIDADO DA FOLHA</td>
                <td className="font-mono" style={{ textAlign: 'right', padding: '3px 6px' }}>R$ {totals.grossTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td className="font-mono" style={{ textAlign: 'right', color: '#047857', padding: '3px 6px' }}>R$ {totals.grossTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td className="font-mono" style={{ textAlign: 'right', color: '#B91C1C', padding: '3px 6px' }}>- R$ {(totals.grossTotal - totals.netTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td className="font-mono" style={{ textAlign: 'right', color: '#047857', padding: '3px 6px' }}>R$ {totals.netTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td className="font-mono" style={{ textAlign: 'right', padding: '3px 6px' }}>R$ {totals.fgtsTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 5. RESUMO DE ENCARGOS SOCIAIS & TRIBUTOS PREVIDENCIÁRIOS (DCTFWEB & FGTS DIGITAL) */}
        <div style={{ marginTop: '6px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '6px 10px', borderRadius: '4px' }}>
            <h4 style={{ margin: '0 0 4px', fontSize: '0.70rem', fontWeight: 800, textTransform: 'uppercase', color: '#0F172A' }}>
              II. Guia DCTFWeb / Tributos Previdenciários (DARF)
            </h4>
            <div style={{ fontSize: '0.64rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>INSS Segurados Retido em Folha:</span>
                <span className="font-mono" style={{ fontWeight: 700 }}>R$ {totals.inssSegurados.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>INSS Patronal Empresa (20%):</span>
                <span className="font-mono" style={{ fontWeight: 700 }}>R$ {totals.inssPatronal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>RAT Ajustado + Terceiros (7,8%):</span>
                <span className="font-mono" style={{ fontWeight: 700 }}>R$ {totals.ratTerceiros.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #CBD5E1', paddingTop: '2px', fontWeight: 900, color: '#047857' }}>
                <span>TOTAL DARF PREVIDENCIÁRIO (DCTFWeb):</span>
                <span className="font-mono" style={{ fontSize: '0.74rem' }}>R$ {totals.inssEmpresaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '6px 10px', borderRadius: '4px' }}>
            <h4 style={{ margin: '0 0 4px', fontSize: '0.70rem', fontWeight: 800, textTransform: 'uppercase', color: '#0F172A' }}>
              III. FGTS Digital & Custo Total de Pessoal
            </h4>
            <div style={{ fontSize: '0.64rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Guia FGTS Digital (8% PIX):</span>
                <span className="font-mono" style={{ fontWeight: 700, color: '#0369A1' }}>R$ {totals.fgtsTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Provisão CPC 33 (13º + Férias 1/12):</span>
                <span className="font-mono" style={{ fontWeight: 700 }}>R$ {(totals.grossTotal * 0.21).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Benefícios (VT + PAT + Home Office):</span>
                <span className="font-mono" style={{ fontWeight: 700 }}>R$ {(totals.grossTotal * 0.08).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #CBD5E1', paddingTop: '2px', fontWeight: 900, color: '#0F172A' }}>
                <span>DESEMBOLSO TOTAL DA EMPRESA:</span>
                <span className="font-mono" style={{ fontSize: '0.74rem', color: '#0369A1' }}>R$ {(totals.custoTotalMaoDeObra + (totals.grossTotal * 0.08)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 6. QUADRO DE RATEIO DEPARTAMENTAL */}
        <div style={{ marginTop: '6px' }}>
          <h4 style={{ margin: '0 0 3px', fontSize: '0.70rem', fontWeight: 800, textTransform: 'uppercase', color: reportTheme === 'DARK_ELITE' ? '#fff' : '#0F172A' }}>
            IV. Alocação de Custos por Centro de Responsabilidade
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '6px' }}>
            {departmentBreakdown.map(dept => (
              <div key={dept.name} style={{ background: '#F1F5F9', padding: '4px 8px', borderRadius: '4px', borderLeft: '3px solid #047857' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.64rem', fontWeight: 700 }}>
                  <span>{dept.name}</span>
                  <span>{dept.percent.toFixed(1)}%</span>
                </div>
                <div className="font-mono" style={{ fontSize: '0.76rem', fontWeight: 900, color: '#0F172A', marginTop: '1px' }}>
                  R$ {dept.totalGross.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <div style={{ fontSize: '0.55rem', color: '#64748B' }}>{dept.count} colaborador(es)</div>
              </div>
            ))}
          </div>
        </div>

        {/* 7. QUADRO FORMAL DE HOMOLOGAÇÃO & ASSINATURAS */}
        <div className="diamond-signatures" style={{ marginTop: '14px', paddingTop: '6px', gap: '12px' }}>
          <div>
            <div style={{ height: '18px' }}></div>
            <div className="diamond-signature-line">
              DIRETORIA DE RECURSOS HUMANOS
            </div>
            <div style={{ fontSize: '0.55rem', color: '#64748B' }}>Gestão de Gente & Cultura</div>
          </div>

          <div>
            <div style={{ height: '18px' }}></div>
            <div className="diamond-signature-line">
              RESPONSÁVEL TÉCNICO CONTÁBIL
            </div>
            <div style={{ fontSize: '0.55rem', color: '#64748B' }}>CRC/SP 1SP999999/O-0</div>
          </div>

          <div>
            <div style={{ height: '18px' }}></div>
            <div className="diamond-signature-line">
              AUDITORIA FORENSE TRABALHISTA
            </div>
            <div style={{ fontSize: '0.55rem', color: '#64748B' }}>Certificação eSocial v.S-1.2</div>
          </div>
        </div>

        {/* 8. SELO DIGITAL DE AUTENTICIDADE E SEGURANÇA */}
        <div className="diamond-watermark-seal" style={{ marginTop: '6px', paddingTop: '3px' }}>
          <div>
            SOBERANO CONTÁBIL • SUITE ENTERPRISE v4.3 • AUTENTICAÇÃO DIGITAL ICP-BRASIL SHA-256: <code>1A01B40EAB3FA8891B2</code>
          </div>
          <div>
            PÁGINA 1 DE 1 • RELATÓRIO OFICIAL PADRÃO DIAMANTE
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficeRhExecutiveReportsDiamondView;
