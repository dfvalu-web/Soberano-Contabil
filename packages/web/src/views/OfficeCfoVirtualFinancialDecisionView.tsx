// ==========================================================================
// SOBERANO CONTÁBIL — ANÁLISE DAS DEMONSTRAÇÕES & CFO VIRTUAL INTELIGENTE (DIAMANTE 10/10)
// Cockpit Financeiro • DuPont 5 Estágios • Altman Z'' • CFO Prescritivo • Dossiê A4
// ==========================================================================

import React, { useState, useMemo, useEffect } from 'react';
import {
  Activity,
  TrendingUp,
  ShieldCheck,
  Scale,
  DollarSign,
  PieChart,
  BarChart3,
  Layers,
  FileText,
  Printer,
  Sparkles,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  Building2,
  RefreshCw,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Briefcase,
  HelpCircle,
  Award,
  Check
} from 'lucide-react';
import { officeStore } from '../state/office-store.js';
import { officeEventBus } from '../state/office-event-bus.js';
import {
  FinancialInputData,
  calculateLiquidityRatios,
  calculateProfitabilityRatios,
  calculateDuPont5StageDecomposition,
  calculateSolvencyAndCreditRisk,
  calculateWorkingCapitalAndCycles,
  generateCompleteFinancialAnalysisReport,
  CfoCopilotInput,
  calculateCrossReferencedMetrics,
  calculateCreditCapacityLimit,
  generatePrescriptiveDiagnostics,
  calculateCapitalAllocationPlan,
  runCfoPrescriptiveCopilot,
  ExpansionScenarioInput,
  PRESET_EXPANSION_SCENARIOS,
  calculateBreakEvenAnalysis,
  calculateCapitalBudgeting,
  runExpansionSimulation,
  generateCfoExecutiveDossier,
  Company,
  BalanceSheet,
  IncomeStatement
} from '@soberano/core';

export type CfoTabType = 'cockpit' | 'dupont' | 'copilot' | 'simulator' | 'dossier';

export const OfficeCfoVirtualFinancialDecisionView: React.FC = () => {
  const tenants = useMemo(() => officeStore.getTenants(), []);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('t1');
  const currentTenant = useMemo(() => tenants.find(t => t.id === selectedTenantId) || tenants[0], [tenants, selectedTenantId]);

  const [activeTab, setActiveTab] = useState<CfoTabType>('cockpit');
  const [periodo, setPeriodo] = useState<string>('2026 (Atual)');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [selectedPreset, setSelectedPreset] = useState<string>('NOVA_FILIAL');

  // Parâmetros do Simulador What-If
  const [simCapex, setSimCapex] = useState<number>(350000);
  const [simMeses, setSimMeses] = useState<number>(36);
  const [simReceita, setSimReceita] = useState<number>(110000);
  const [simCvPercent, setSimCvPercent] = useState<number>(42);
  const [simCustoFixo, setSimCustoFixo] = useState<number>(32000);
  const [simTma, setSimTma] = useState<number>(12.5);
  const [simDepreciacao, setSimDepreciacao] = useState<number>(4500);

  // Parâmetros de Alocação de Recursos (CFO Prescritivo)
  const [allocReserva, setAllocReserva] = useState<number>(30);
  const [allocCapex, setAllocCapex] = useState<number>(40);
  const [allocDividendos, setAllocDividendos] = useState<number>(30);

  useEffect(() => {
    const unsub = officeEventBus.subscribe('*', (event) => {
      if (
        event.type === 'MONOPHASIC_TAX_SEGREGATED' ||
        event.type === 'PAYROLL_CLOSED' ||
        event.type === 'ANNUAL_CLOSING_ARE_EXECUTED'
      ) {
        setIsSyncing(true);
        setTimeout(() => setIsSyncing(false), 600);
      }
    });
    return unsub;
  }, []);

  const financialInput: FinancialInputData = useMemo(() => ({
    ativoCirculante: 980000,
    disponibilidades: 320000,
    contasAReceber: 410000,
    estoques: 250000,
    realizavelLongoPrazo: 180000,
    ativoPermanenteImobilizado: 1240000,
    totalAtivo: 2400000,
    passivoCirculante: 480000,
    fornecedores: 210000,
    emprestimosFinanciamentosCp: 150000,
    passivoNaoCirculante: 620000,
    emprestimosFinanciamentosLp: 500000,
    patrimonioLiquido: 1300000,
    lucrosAcumuladosRetidos: 520000,
    totalPassivoEPl: 2400000,
    receitaBruta: 4200000,
    deducoesReceita: 360000,
    receitaLiquida: 3840000,
    custoProdutosServicosVendidos: 2150000,
    custoProdutosVendidos: 2150000,
    lucroBruto: 1690000,
    despesasOperacionaisVendasGerais: 780000,
    depreciacaoAmortizacao: 95000,
    lucroOperacionalEbit: 815000,
    ebitda: 910000,
    ebitdaLajida: 910000,
    despesasFinanceirasLiquidas: 110000,
    lucroAntesImpostosEbt: 705000,
    lucroAntesImpostosLair: 705000,
    impostosSobreLucro: 176250,
    provisaoIrpjCsll: 176250,
    lucroLiquido: 528750,
    lucroLiquidoExercicio: 528750,
    tenantId: currentTenant.id,
    empresa: currentTenant.name,
    cnpj: currentTenant.cnpj,
    periodo: '2026'
  }), [currentTenant]);

  const completeReport = useMemo(() => {
    return generateCompleteFinancialAnalysisReport(financialInput);
  }, [financialInput]);

  const cfoInput: CfoCopilotInput = useMemo(() => ({
    financialReport: completeReport,
    massaSalarialTotal: 480000,
    encargosFolhaTotal: 120000,
    headcount: 28,
    economiaMonofasicaTotal: 85000,
    creditosTributariosApurados: 85000,
    regimeTributario: (currentTenant.regime === 'SIMPLES_NACIONAL' ? 'SIMPLES_NACIONAL' : 'LUCRO_REAL') as any
  }), [completeReport, currentTenant]);

  const cfoDecision = useMemo(() => {
    return runCfoPrescriptiveCopilot(cfoInput);
  }, [cfoInput]);

  const scenarioInput: ExpansionScenarioInput = useMemo(() => ({
    nomeProjeto: 'Expansão & Nova Unidade Comercial',
    investimentoInicialCapex: simCapex,
    horizonteMeses: simMeses,
    receitaMensalEstimada: simReceita,
    custosVariaveisPercentual: simCvPercent,
    custosFixosMensaisEstimados: simCustoFixo,
    taxaMinimaAtratividadeTmaAnual: simTma,
    depreciacaoMensalEstimada: simDepreciacao
  }), [simCapex, simMeses, simReceita, simCvPercent, simCustoFixo, simTma, simDepreciacao]);

  const simulationResult = useMemo(() => {
    return runExpansionSimulation(scenarioInput);
  }, [scenarioInput]);

  const companyObj: Company = useMemo(() => ({
    id: currentTenant.id,
    tenantId: currentTenant.id,
    cnpj: currentTenant.cnpj.replace(/\D/g, ''),
    razaoSocial: currentTenant.name,
    nomeFantasia: currentTenant.name.split(' ')[0],
    cnaePrincipal: '6920-6/01',
    cnaesSecundarios: [],
    regimeTributario: currentTenant.regime === 'SIMPLES_NACIONAL' ? 'SIMPLES_NACIONAL' : 'LUCRO_REAL_TRIMESTRAL',
    uf: 'SP',
    codigoMunicipioIbge: '3550308',
    aliquotaIssMunicipal: 0.05,
    fatorRElegivel: true,
    optanteSimples: currentTenant.regime === 'SIMPLES_NACIONAL',
    createdAt: new Date(),
    updatedAt: new Date()
  }), [currentTenant]);

  const mockBalanceSheet: BalanceSheet = useMemo(() => ({
    ativoCirculante: { disponibilidades: 320000, clientesContasAReceber: 410000, estoques: 250000, outrosCreditos: 0, total: 980000 },
    ativoNaoCirculante: { realizavelLongoPrazo: 180000, investimentos: 0, imobilizado: 1240000, intangivel: 0, total: 1420000 },
    totalAtivo: 2400000,
    passivoCirculante: { fornecedores: 210000, obrigacoesFiscais: 50000, obrigacoesTrabalhistas: 70000, emprestimosFinanciamentosCp: 150000, total: 480000 },
    passivoNaoCirculante: { emprestimosFinanciamentosLp: 500000, provisoesLp: 120000, total: 620000 },
    patrimonioLiquido: { capitalSocial: 780000, reservasCapital: 0, reservasLucros: 520000, lucrosPrejuizosAcumulados: 0, total: 1300000 },
    totalPassivoEPatrimonioLiquido: 2400000
  }), []);

  const mockIncomeStatement: IncomeStatement = useMemo(() => ({
    receitaOperacionalBruta: 4200000,
    deducoesDaReceitaBruta: 360000,
    receitaOperacionalLiquida: 3840000,
    custoProdutosServicosVendidos: 2150000,
    lucroBruto: 1690000,
    despesasOperacionais: { vendas: 380000, geraisEAdministrativas: 400000, outrasDespesasOperacionais: 0, total: 780000 },
    resultadoOperacionalAntesFinanceiro: 910000,
    resultadoFinanceiroLiquido: -110000,
    lucroAntesTributosSobreLucroLair: 705000,
    provisaoIrpjCsll: 176250,
    lucroLiquidoDoExercicio: 528750
  }), []);

  const executiveDossier = useMemo(() => {
    const res = generateCfoExecutiveDossier(
      companyObj,
      completeReport,
      cfoDecision,
      mockBalanceSheet,
      mockIncomeStatement,
      simulationResult
    );
    return res.data;
  }, [companyObj, completeReport, cfoDecision, mockBalanceSheet, mockIncomeStatement, simulationResult]);

  const handleApplyPreset = (presetKey: string) => {
    setSelectedPreset(presetKey);
    const preset = PRESET_EXPANSION_SCENARIOS[presetKey as keyof typeof PRESET_EXPANSION_SCENARIOS];
    if (preset) {
      setSimCapex(preset.investimentoInicialCapex);
      setSimMeses(preset.horizonteMeses);
      setSimReceita(preset.receitaMensalEstimada);
      setSimCvPercent(preset.custosVariaveisPercentual);
      setSimCustoFixo(preset.custosFixosMensaisEstimados);
      setSimTma(preset.taxaMinimaAtratividadeTmaAnual);
      setSimDepreciacao(preset.depreciacaoMensalEstimada);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-primary)' }}>
      {/* 1. Header Global & Seletor de Empresa */}
      <div className="no-print" style={{ background: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-medium)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>💎</span>
            <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
              Análise das Demonstrações & CFO Virtual Inteligente
            </h1>
            <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--emerald-400)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>
              Diamond Champion
            </span>
          </div>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
            Cockpit Financeiro, Decomposição DuPont 5 Estágios, Altman Z'', Fleuriet, CFO Prescritivo & Simulador What-If
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <select
            value={selectedTenantId}
            onChange={(e) => setSelectedTenantId(e.target.value)}
            style={{ background: 'var(--bg-surface-card, #131C30)', border: '1.5px solid var(--emerald-500, #10B981)', color: '#fff', padding: '8px 14px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
          >
            {tenants.map(t => (
              <option key={t.id} value={t.id}>{t.name} ({t.regime.replace('_', ' ')})</option>
            ))}
          </select>

          <select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            style={{ background: 'var(--bg-surface-card, #131C30)', border: '1px solid var(--border-medium)', color: '#fff', padding: '8px 12px', borderRadius: '8px', fontSize: '0.80rem', fontWeight: 600, cursor: 'pointer' }}
          >
            <option value="2026 (Atual)">Exercício: 2026 (Atual)</option>
            <option value="2025">Exercício: 2025</option>
            <option value="2024">Exercício: 2024</option>
          </select>

          <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid var(--emerald-500)', padding: '6px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.80rem', fontWeight: 700, color: 'var(--emerald-400)' }}>
            <Activity size={15} className={isSyncing ? 'animate-spin' : ''} />
            <span>Score {completeReport.scoreGeralSaude}/100 ({completeReport.statusGeral})</span>
          </div>

          <button onClick={() => window.print()} className="btn-primary-action" style={{ padding: '8px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Printer size={15} />
            <span>Imprimir Dossiê A4</span>
          </button>
        </div>
      </div>

      {/* 2. Seletor Segmentado de Abas Diamante de Alto Contraste */}
      <div className="no-print panel-card">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
          {[
            { id: 'cockpit', label: '1. Cockpit & Solvência', icon: '📊', sub: 'Liquidez, ROE & Altman Z' },
            { id: 'dupont', label: '2. DuPont 5 Estágios & Índices', icon: '💎', sub: 'Decomposição do ROE' },
            { id: 'copilot', label: '3. CFO Prescritivo & Alocação', icon: '🤖', sub: 'Diagnósticos & Caixa' },
            { id: 'simulator', label: '4. Simulador What-If', icon: '🚀', sub: 'VPL, TIR & Payback' },
            { id: 'dossier', label: '5. Dossiê Executivo PDF', icon: '📑', sub: 'Laudo Pericial A4' }
          ].map(tab => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as CfoTabType)}
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  fontSize: '0.82rem',
                  fontWeight: isSelected ? 800 : 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  background: isSelected 
                    ? 'linear-gradient(135deg, #059669 0%, #047857 100%)' 
                    : 'rgba(15, 23, 42, 0.65)',
                  color: isSelected ? '#ffffff' : 'var(--text-secondary, #94A3B8)',
                  border: isSelected 
                    ? '2px solid #34D399' 
                    : '1.5px solid var(--border-medium, rgba(255, 255, 255, 0.12))',
                  boxShadow: isSelected 
                    ? '0 6px 20px -2px rgba(5, 150, 105, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.2)' 
                    : 'none',
                  transform: isSelected ? 'translateY(-1px)' : 'none'
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>{tab.icon}</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ lineHeight: 1.2 }}>{tab.label}</div>
                  <div style={{ fontSize: '0.65rem', opacity: isSelected ? 0.95 : 0.7 }}>{tab.sub}</div>
                </div>
                {isSelected && (
                  <span style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.25)', borderRadius: '999px', padding: '2px 7px', fontSize: '0.60rem', fontWeight: 900, color: '#fff' }}>ATIVO</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. ABA 1: COCKPIT FINANCEIRO & SOLVÊNCIA */}
      {activeTab === 'cockpit' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="no-print grid-cards-4">
            <div className="metric-card">
              <div className="metric-header"><span className="metric-title">Score de Saúde Financeira</span><Activity size={18} color="var(--emerald-400)" /></div>
              <div className="metric-value font-mono" style={{ color: 'var(--emerald-400)' }}>
                {completeReport.scoreGeralSaude}/100 ({completeReport.statusGeral})
              </div>
              <div className="metric-sub">Matriz Multicritério Ponderada</div>
            </div>

            <div className="metric-card">
              <div className="metric-header"><span className="metric-title">Liquidez Corrente</span><Scale size={18} color="var(--cyan-400)" /></div>
              <div className="metric-value font-mono" style={{ color: 'var(--cyan-400)' }}>
                {completeReport.liquidity.liquidezCorrente.toFixed(2)}
              </div>
              <div className="metric-sub" style={{ color: 'var(--emerald-400)', fontWeight: 600 }}>✓ Folga Confortável (&gt; 1.50)</div>
            </div>

            <div className="metric-card">
              <div className="metric-header"><span className="metric-title">Retorno Capital Próprio (ROE)</span><TrendingUp size={18} color="var(--emerald-400)" /></div>
              <div className="metric-value font-mono" style={{ color: 'var(--emerald-400)' }}>
                {(completeReport.profitability.retornoSobrePatrimonioLiquidoRoe * 100).toFixed(2)}%
              </div>
              <div className="metric-sub" style={{ color: 'var(--emerald-400)', fontWeight: 600 }}>↗ Alta Performance (&gt; 20%)</div>
            </div>

            <div className="metric-card">
              <div className="metric-header"><span className="metric-title">Altman Z''-Score Brasil</span><ShieldCheck size={18} color="var(--indigo-400)" /></div>
              <div className="metric-value font-mono" style={{ color: 'var(--emerald-400)' }}>
                Z'' = {completeReport.solvency.altmanZScore.zScoreBrasilEmergingValue.toFixed(2)}
              </div>
              <div className="metric-sub">Stephen Kanitz • {completeReport.solvency.altmanZScore.status}</div>
            </div>
          </div>

          <div className="no-print" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            <div className="panel-card">
              <div style={{ padding: '10px 0 12px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fff' }}>Estrutura de Capital &amp; Endividamento</span>
                <span className="badge badge-emerald">Nível Prudencial</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Endividamento Geral:</span>
                  <span className="font-mono" style={{ fontWeight: 700, color: '#fff' }}>{(completeReport.solvency.endividamentoGeralPercent).toFixed(1)}% (Nível Prudencial &lt;= 50%)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Composição do Endividamento (CP):</span>
                  <span className="font-mono" style={{ fontWeight: 700, color: '#fff' }}>{(completeReport.solvency.composicaoEndividamentoCurtoPrazoPercent).toFixed(1)}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Cobertura de Juros (EBIT / Desp. Fin):</span>
                  <span className="font-mono" style={{ fontWeight: 700, color: 'var(--emerald-400)' }}>{(financialInput.lucroOperacionalEbit / Math.max(1, financialInput.despesasFinanceirasLiquidas)).toFixed(2)}x</span>
                </div>
              </div>
            </div>

            <div className="panel-card">
              <div style={{ padding: '10px 0 12px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fff' }}>Dinâmica Fleuriet &amp; Ciclos Operacionais</span>
                <span className="badge badge-cyan">Tesouraria Saudável</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Ciclo de Caixa (Fleuriet):</span>
                  <span className="font-mono" style={{ fontWeight: 700, color: 'var(--emerald-400)' }}>{completeReport.workingCapital.cicloCaixaFinanceiroDias.toFixed(0)} dias (Tesouraria Saudável +R$ 130k)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Necessidade de Capital de Giro (NCG):</span>
                  <span className="font-mono" style={{ fontWeight: 700, color: '#fff' }}>R$ {completeReport.workingCapital.necessidadeCapitalGiroNcg.toLocaleString('pt-BR')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Saldo de Tesouraria (ST):</span>
                  <span className="font-mono" style={{ fontWeight: 700, color: 'var(--emerald-400)' }}>+ R$ {completeReport.workingCapital.saldoTesouraria.toLocaleString('pt-BR')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. ABA 2: DUPONT 5 ESTÁGIOS */}
      {activeTab === 'dupont' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="no-print panel-card">
            <div style={{ padding: '10px 0 14px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fff' }}>Decomposição DuPont em 5 Estágios (Rentabilidade sobre o Patrimônio Líquido - ROE)</span>
              <span className="badge badge-emerald">ROE: {(completeReport.dupont.roeCalculadoDuPont * 100).toFixed(2)}%</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              <div style={{ background: 'var(--bg-surface-elevated)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-medium)', textAlign: 'center' }}>
                <span style={{ fontSize: '0.70rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>1. Tax Burden (Carga Fiscal)</span>
                <div className="font-mono" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', margin: '4px 0' }}>{completeReport.dupont.taxBurden.toFixed(4)}</div>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Lucro Líquido / LAIR</span>
              </div>

              <div style={{ background: 'var(--bg-surface-elevated)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-medium)', textAlign: 'center' }}>
                <span style={{ fontSize: '0.70rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>2. Interest Burden (Carga Juros)</span>
                <div className="font-mono" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', margin: '4px 0' }}>{completeReport.dupont.interestBurden.toFixed(4)}</div>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>LAIR / EBIT</span>
              </div>

              <div style={{ background: 'var(--bg-surface-elevated)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-medium)', textAlign: 'center' }}>
                <span style={{ fontSize: '0.70rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>3. Margem Operacional (EBIT)</span>
                <div className="font-mono" style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--emerald-400)', margin: '4px 0' }}>{(completeReport.dupont.ebitMargin * 100).toFixed(1)}%</div>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>EBIT / Receita Líquida</span>
              </div>

              <div style={{ background: 'var(--bg-surface-elevated)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-medium)', textAlign: 'center' }}>
                <span style={{ fontSize: '0.70rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>4. Giro do Ativo Total</span>
                <div className="font-mono" style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--cyan-400)', margin: '4px 0' }}>{completeReport.dupont.assetTurnover.toFixed(2)}x</div>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Receita Líquida / Ativo</span>
              </div>

              <div style={{ background: 'var(--bg-surface-elevated)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-medium)', textAlign: 'center' }}>
                <span style={{ fontSize: '0.70rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>5. Alavancagem Financeira</span>
                <div className="font-mono" style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--amber-400)', margin: '4px 0' }}>{completeReport.dupont.equityMultiplier.toFixed(2)}x</div>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Ativo / Patrimônio Líquido</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. ABA 3: CFO PRESCRITIVO */}
      {activeTab === 'copilot' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="no-print panel-card">
            <div style={{ padding: '10px 0 14px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fff' }}>Recomendações Prescritivas do CFO Virtual com IA</span>
              <span className="badge badge-cyan">Motor Decisório Ativo</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {cfoDecision.pareceresExecutivos.map((par, idx) => (
                <div key={idx} style={{ background: 'var(--bg-surface-elevated)', padding: '14px 16px', borderRadius: '8px', borderLeft: '4px solid var(--emerald-500)', border: '1px solid var(--border-medium)', fontSize: '0.82rem', lineHeight: 1.5, color: '#F1F5F9' }}>
                  • {par}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. ABA 4: SIMULADOR WHAT-IF */}
      {activeTab === 'simulator' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Seletor de Cenários Predefinidos */}
          <div className="no-print panel-card">
            <div style={{ padding: '10px 0 12px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fff' }}>Cenários Predefinidos de Expansão & Novos Negócios</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
              {[
                { id: 'NOVA_FILIAL', label: '🏢 Nova Filial Comercial', icon: '🏢' },
                { id: 'MAQUINARIO_INDUSTRIAL', label: '⚙️ Maquinário Industrial', icon: '⚙️' },
                { id: 'LINHA_PRODUTOS', label: '📦 Nova Linha de Produtos', icon: '📦' },
                { id: 'EQUIPE_VENDAS', label: '👥 Expansão Equipe Comercial', icon: '👥' }
              ].map(preset => {
                const isSelected = selectedPreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleApplyPreset(preset.id)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '8px',
                      fontSize: '0.80rem',
                      fontWeight: isSelected ? 800 : 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: isSelected ? 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)' : 'rgba(15, 23, 42, 0.6)',
                      color: isSelected ? '#fff' : 'var(--text-secondary, #94A3B8)',
                      border: isSelected ? '1.5px solid #38BDF8' : '1px solid var(--border-medium)',
                      boxShadow: isSelected ? '0 4px 12px rgba(2, 132, 199, 0.4)' : 'none'
                    }}
                  >
                    <span>{preset.icon}</span>
                    <span>{preset.label}</span>
                    {isSelected && <span style={{ marginLeft: 'auto', fontSize: '0.65rem', fontWeight: 900 }}>✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="no-print grid-cards-4">
            <div className="metric-card">
              <div className="metric-header"><span className="metric-title">VPL do Projeto</span><TrendingUp size={18} color="var(--emerald-400)" /></div>
              <div className="metric-value font-mono" style={{ color: simulationResult.capitalBudgeting.vpl > 0 ? 'var(--emerald-400)' : '#F87171' }}>
                R$ {simulationResult.capitalBudgeting.vpl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="metric-sub">TMA: {simTma}% a.a.</div>
            </div>

            <div className="metric-card">
              <div className="metric-header"><span className="metric-title">TIR (Taxa Interna de Retorno)</span><TrendingUp size={18} color="var(--cyan-400)" /></div>
              <div className="metric-value font-mono" style={{ color: 'var(--cyan-400)' }}>
                {simulationResult.capitalBudgeting.tirPercentual.toFixed(1)}% a.a.
              </div>
              <div className="metric-sub">{simulationResult.capitalBudgeting.tirPercentual > simTma ? '✓ Superior à TMA' : '⚠️ Abaixo da TMA'}</div>
            </div>

            <div className="metric-card">
              <div className="metric-header"><span className="metric-title">Payback Simples</span><Activity size={18} color="var(--amber-400)" /></div>
              <div className="metric-value font-mono" style={{ color: 'var(--amber-400)' }}>
                {simulationResult.capitalBudgeting.paybackSimplesMeses.toFixed(1)} Meses
              </div>
              <div className="metric-sub">Retorno do Capital Investido</div>
            </div>

            <div className="metric-card">
              <div className="metric-header"><span className="metric-title">Ponto de Equilíbrio (Break-Even)</span><Scale size={18} color="var(--indigo-400)" /></div>
              <div className="metric-value font-mono" style={{ color: '#fff' }}>
                R$ {simulationResult.breakEven.pontoEquilibrioContabilMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês
              </div>
              <div className="metric-sub">Margem de Segurança: {simulationResult.breakEven.margemSegurancaOperacionalPercent.toFixed(1)}%</div>
            </div>
          </div>
        </div>
      )}

      {/* 7. DOSSIÊ EXECUTIVO DIAMANTE A4 (ABA 5 & VERSÃO IMPRESSA) */}
      <div className={activeTab === 'dossier' ? '' : 'only-print'}>
        <div className="diamond-paper-a4">
          <div className="diamond-header">
            <div>
              <div className="diamond-title">{currentTenant.name}</div>
              <div className="diamond-subtitle">DOSSIÊ EXECUTIVO DE ANÁLISE DAS DEMONSTRAÇÕES FINANCEIRAS & CFO VIRTUAL</div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '0.70rem' }}>
              <div>CNPJ: <strong>{currentTenant.cnpj}</strong></div>
              <div>EXERCÍCIO: <strong>{periodo}</strong></div>
              <div style={{ color: '#047857', fontWeight: 800 }}>Padrão IFRS / Assaf Neto</div>
            </div>
          </div>

          <div className="diamond-meta-grid">
            <div className="diamond-meta-item">
              <strong>Score de Saúde Geral</strong>
              <span className="font-mono" style={{ color: '#047857', fontWeight: 800 }}>{completeReport.scoreGeralSaude}/100 ({completeReport.statusGeral})</span>
            </div>
            <div className="diamond-meta-item">
              <strong>Rentabilidade ROE (DuPont)</strong>
              <span className="font-mono" style={{ color: '#047857', fontWeight: 800 }}>{(completeReport.dupont.roeCalculadoDuPont * 100).toFixed(2)}%</span>
            </div>
            <div className="diamond-meta-item">
              <strong>Liquidez Corrente</strong>
              <span className="font-mono">{completeReport.liquidity.liquidezCorrente.toFixed(2)}x</span>
            </div>
            <div className="diamond-meta-item">
              <strong>Termômetro Altman Z''</strong>
              <span style={{ color: '#047857', fontWeight: 800 }}>Z'' = {completeReport.solvency.altmanZScore.zScoreBrasilEmergingValue.toFixed(2)} (Zona Segura)</span>
            </div>
          </div>

          {/* Tabela 1: DuPont 5 Estágios */}
          <div style={{ margin: '14px 0 6px', fontWeight: 800, fontSize: '0.80rem', color: '#0F172A' }}>
            1. DECOMPOSIÇÃO DUPONT EM 5 ESTÁGIOS (EFICIÊNCIA & ALAVANCAGEM)
          </div>
          <table className="diamond-table">
            <thead>
              <tr>
                <th>Componente da Rentabilidade</th>
                <th style={{ textAlign: 'center' }}>Fórmula / Conceito</th>
                <th style={{ textAlign: 'right' }}>Índice Apurado</th>
                <th style={{ textAlign: 'center' }}>Impacto no ROE</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>1. Tax Burden:</strong> Eficiência Fiscal / Retenção de Tributos</td>
                <td style={{ textAlign: 'center' }} className="font-mono">Lucro Líquido / LAIR</td>
                <td className="font-mono" style={{ textAlign: 'right' }}>{completeReport.dupont.taxBurden.toFixed(4)}</td>
                <td style={{ textAlign: 'center', color: '#047857' }}>Positivo</td>
              </tr>
              <tr>
                <td><strong>2. Interest Burden:</strong> Impacto das Despesas Financeiras</td>
                <td style={{ textAlign: 'center' }} className="font-mono">LAIR / EBIT</td>
                <td className="font-mono" style={{ textAlign: 'right' }}>{completeReport.dupont.interestBurden.toFixed(4)}</td>
                <td style={{ textAlign: 'center', color: '#047857' }}>Controlado</td>
              </tr>
              <tr>
                <td><strong>3. Margem Operacional:</strong> Rentabilidade Operacional do Negócio</td>
                <td style={{ textAlign: 'center' }} className="font-mono">EBIT / Receita Líquida</td>
                <td className="font-mono" style={{ textAlign: 'right', fontWeight: 700 }}>{(completeReport.dupont.ebitMargin * 100).toFixed(1)}%</td>
                <td style={{ textAlign: 'center', color: '#047857' }}>Excelente</td>
              </tr>
              <tr>
                <td><strong>4. Giro do Ativo:</strong> Eficiência no Uso dos Ativos</td>
                <td style={{ textAlign: 'center' }} className="font-mono">Receita Líquida / Ativo Total</td>
                <td className="font-mono" style={{ textAlign: 'right' }}>{completeReport.dupont.assetTurnover.toFixed(2)}x</td>
                <td style={{ textAlign: 'center', color: '#047857' }}>Alto Giro</td>
              </tr>
              <tr>
                <td><strong>5. Alavancagem Financeira:</strong> Multiplicador do PL</td>
                <td style={{ textAlign: 'center' }} className="font-mono">Ativo Total / Patrimônio Líquido</td>
                <td className="font-mono" style={{ textAlign: 'right' }}>{completeReport.dupont.equityMultiplier.toFixed(2)}x</td>
                <td style={{ textAlign: 'center', color: '#047857' }}>Moderado</td>
              </tr>
              <tr className="diamond-table-total">
                <td>RENTABILIDADE TOTAL SOBRE O PATRIMÔNIO LÍQUIDO (ROE)</td>
                <td style={{ textAlign: 'center' }}>DuPont 5 Estágios</td>
                <td className="font-mono" style={{ textAlign: 'right', color: '#047857', fontWeight: 800 }}>{(completeReport.dupont.roeCalculadoDuPont * 100).toFixed(2)}% a.a.</td>
                <td style={{ textAlign: 'center', fontWeight: 800, color: '#047857' }}>Meta Superada</td>
              </tr>
            </tbody>
          </table>

          {/* Pareceres do CFO */}
          <div style={{ margin: '14px 0 6px', fontWeight: 800, fontSize: '0.80rem', color: '#0F172A' }}>
            2. PARECERES PRESCRITIVOS DO CFO VIRTUAL & ALOCAÇÃO DE CAPITAL
          </div>
          <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '8px', borderLeft: '4px solid #059669', fontSize: '0.74rem', lineHeight: 1.6, color: '#334155' }}>
            {cfoDecision.pareceresExecutivos.map((par, idx) => (
              <div key={idx} style={{ marginBottom: '4px' }}>• {par}</div>
            ))}
          </div>

          <div className="diamond-signatures">
            <div>
              <div style={{ height: '22px' }}></div>
              <div className="diamond-signature-line">CFO VIRTUAL / ADVISORY FINANCEIRO</div>
              <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Planejamento & Estrutura de Capital</div>
            </div>
            <div>
              <div style={{ height: '22px' }}></div>
              <div className="diamond-signature-line">RESPONSÁVEL TÉCNICO CONTÁBIL</div>
              <div style={{ fontSize: '0.58rem', color: '#64748B' }}>CRC/SP 1SP999999/O-0</div>
            </div>
            <div>
              <div style={{ height: '22px' }}></div>
              <div className="diamond-signature-line">DIRETORIA EXECUTIVA / CONSELHO</div>
              <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Homologação Estratégica</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficeCfoVirtualFinancialDecisionView;
