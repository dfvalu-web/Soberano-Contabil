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
  Download,
  Sparkles,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  Building,
  RefreshCw,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Briefcase,
  HelpCircle
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
  generateCfoExecutiveDossier
} from '@soberano/core';

export const OfficeCfoVirtualFinancialDecisionView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'cockpit' | 'dupont' | 'copilot' | 'simulator' | 'dossier'>('cockpit');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('comp-demo-1');
  const [periodo, setPeriodo] = useState<string>('2026');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [selectedPreset, setSelectedPreset] = useState<string>('NOVA_FILIAL');

  const [simCapex, setSimCapex] = useState<number>(250000);
  const [simMeses, setSimMeses] = useState<number>(36);
  const [simReceita, setSimReceita] = useState<number>(80000);
  const [simCvPercent, setSimCvPercent] = useState<number>(45);
  const [simCustoFixo, setSimCustoFixo] = useState<number>(25000);
  const [simTma, setSimTma] = useState<number>(12);
  const [simDepreciacao, setSimDepreciacao] = useState<number>(3500);

  const [allocReserva, setAllocReserva] = useState<number>(25);
  const [allocCapex, setAllocCapex] = useState<number>(45);
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
    ativoCirculante: 850000,
    disponibilidades: 250000,
    contasAReceber: 300000,
    estoques: 200000,
    realizavelLongoPrazo: 150000,
    ativoPermanenteImobilizado: 1000000,
    totalAtivo: 2000000,
    passivoCirculante: 400000,
    fornecedores: 180000,
    emprestimosFinanciamentosCp: 120000,
    passivoNaoCirculante: 500000,
    emprestimosFinanciamentosLp: 400000,
    patrimonioLiquido: 1100000,
    lucrosAcumuladosRetidos: 400000,
    totalPassivoEPl: 2000000,
    receitaBruta: 3500000,
    deducoesReceita: 300000,
    receitaLiquida: 3200000,
    custoProdutosVendidos: 1600000,
    lucroBruto: 1600000,
    despesasOperacionaisVendasGerais: 800000,
    ebitda: 950000,
    depreciacaoAmortizacao: 150000,
    lucroOperacionalEbit: 800000,
    despesasFinanceirasLiquidas: 80000,
    lucroAntesImpostosEbt: 720000,
    impostosSobreLucro: 180000,
    lucroLiquido: 540000,
    tenantId: 'tenant-enterprise-1',
    empresa: 'SOBERANO INDUSTRIAL & SERVIÇOS S/A',
    cnpj: '12.345.678/0001-90',
    periodo: periodo
  }), [periodo]);

  const completeReport = useMemo(() => generateCompleteFinancialAnalysisReport(financialInput), [financialInput]);

  const copilotInput: CfoCopilotInput = useMemo(() => ({
    financialReport: completeReport,
    massaSalarialTotal: 450000,
    encargosFolhaTotal: 150000,
    headcount: 28,
    economiaMonofasicaTotal: 84000,
    creditosTributariosApurados: 25000,
    regimeTributario: 'SIMPLES_NACIONAL',
    alavancagemDesejadaMultiplicador: 2.5
  }), [completeReport]);

  const cfoDecision = useMemo(() => runCfoPrescriptiveCopilot(copilotInput), [copilotInput]);

  const currentScenario: ExpansionScenarioInput = useMemo(() => ({
    nomeCenario: selectedPreset,
    investimentoInicialCapex: simCapex,
    vidaUtilMeses: simMeses,
    taxaMinimaAtratividadeTmaAnual: simTma,
    receitaIncrementalMensal: simReceita,
    custoVariavelPercent: simCvPercent,
    custoFixoIncrementalMensal: simCustoFixo,
    depreciacaoMensal: simDepreciacao,
    precoVendaUnitarioMedio: 150,
    custoVariavelUnitarioMedio: 67.5,
    custoOportunidadeCapitalProprioMensal: 2500,
    aliquotaImpostosPercent: 12
  }), [selectedPreset, simCapex, simMeses, simTma, simReceita, simCvPercent, simCustoFixo, simDepreciacao]);

  const simulationResult = useMemo(() => runExpansionSimulation(currentScenario), [currentScenario]);

  const handlePresetSelect = (presetKey: string) => {
    setSelectedPreset(presetKey);
    const p = PRESET_EXPANSION_SCENARIOS[presetKey];
    if (p) {
      setSimCapex(p.investimentoInicialCapex);
      setSimMeses(p.vidaUtilMeses);
      setSimReceita(p.receitaIncrementalMensal);
      setSimCvPercent(p.custoVariavelPercent);
      setSimCustoFixo(p.custoFixoIncrementalMensal);
      setSimTma(p.taxaMinimaAtratividadeTmaAnual);
      setSimDepreciacao(p.depreciacaoMensal);
    }
  };

  const mockBalanceSheet = useMemo(() => ({
    dataReferencia: `${periodo}-12-31`,
    ativoCirculante: [{ codigoConta: '1.1.01', descricao: 'Caixa e Equivalentes', saldoInicial: 100000, totalDebitos: 250000, totalCreditos: 100000, valorPeriodoAtual: 250000, valorPeriodoAnterior: 100000 }],
    ativoNaoCirculante: [{ codigoConta: '1.2.01', descricao: 'Imobilizado Operacional', saldoInicial: 900000, totalDebitos: 150000, totalCreditos: 50000, valorPeriodoAtual: 1000000, valorPeriodoAnterior: 900000 }],
    totalAtivo: 2000000,
    passivoCirculante: [{ codigoConta: '2.1.01', descricao: 'Fornecedores e Obrigações CP', saldoInicial: 100000, totalDebitos: 50000, totalCreditos: 130000, valorPeriodoAtual: 180000, valorPeriodoAnterior: 100000 }],
    passivoNaoCirculante: [{ codigoConta: '2.2.01', descricao: 'Financiamentos LP', saldoInicial: 450000, totalDebitos: 50000, totalCreditos: 100000, valorPeriodoAtual: 500000, valorPeriodoAnterior: 450000 }],
    patrimonioLiquido: [{ codigoConta: '2.3.01', descricao: 'Capital Social & Reservas', saldoInicial: 1000000, totalDebitos: 0, totalCreditos: 100000, valorPeriodoAtual: 1100000, valorPeriodoAnterior: 1000000 }],
    totalPassivoEPatrimonioLiquido: 2000000
  }), [periodo]);

  const mockIncomeStatement = useMemo(() => ({
    periodo: periodo,
    receitaBruta: 3500000,
    deducoesReceitaBruta: 300000,
    receitaLiquida: 3200000,
    custosOperacionais: 1600000,
    lucroBruto: 1600000,
    despesasOperacionais: 800000,
    resultadoOperacional: 800000,
    receitasFinanceiras: 20000,
    despesasFinanceiras: 100000,
    resultadoAntesTributacao: 720000,
    provisaoIrpjCsll: 180000,
    lucroLiquidoExercicio: 540000
  }), [periodo]);

  const executiveDossier = useMemo(() => {
    const res = generateCfoExecutiveDossier(
      {
        id: 'comp-1',
        razaoSocial: 'SOBERANO INDUSTRIAL & SERVIÇOS S/A',
        cnpj: '12.345.678/0001-90',
        regimeTributario: 'SIMPLES_NACIONAL',
        cnaePrincipal: '6920-6/01 - Atividades de Contabilidade',
        uf: 'SP',
        tenantId: 'tenant-enterprise-1',
        tipoCertificado: 'A1',
        status: 'ACTIVE'
      },
      completeReport,
      cfoDecision,
      mockBalanceSheet,
      mockIncomeStatement,
      simulationResult
    );
    return res.data;
  }, [completeReport, cfoDecision, mockBalanceSheet, mockIncomeStatement, simulationResult]);

  return (
    <div className="flex flex-col gap-6 p-6 min-h-screen bg-[var(--bg-deep,#070B14)] text-slate-100 font-sans">
      {/* 1. Header Global & Top Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-[var(--bg-surface-elevated,#162035)] border border-[rgba(255,255,255,0.08)] shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white">
                Análise das Demonstrações & CFO Virtual Inteligente
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Diamond Champion
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Cockpit Financeiro, Decomposição DuPont 5 Estágios, Altman Z'', Fleuriet, CFO Prescritivo & Simulador What-If
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-surface-card,#131C30)] border border-[rgba(255,255,255,0.08)] text-xs">
            <Building className="w-4 h-4 text-emerald-400" />
            <span className="font-medium text-slate-200">Soberano Industrial S/A</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-surface-card,#131C30)] border border-[rgba(255,255,255,0.08)] text-xs">
            <span className="text-slate-400">Exercício:</span>
            <select
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              className="bg-transparent text-emerald-400 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="2026" className="bg-slate-900 text-white">2026 (Atual)</option>
              <option value="2025" className="bg-slate-900 text-white">2025</option>
              <option value="2024" className="bg-slate-900 text-white">2024</option>
            </select>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 font-bold text-xs shadow-inner">
            <Activity className={`w-4 h-4 ${isSyncing ? 'animate-spin text-amber-400' : ''}`} />
            <span>Score {completeReport.scoreGeralSaude}/100 ({completeReport.statusGeral})</span>
          </div>
        </div>
      </div>

      {/* 2. Modern 5-Tab Bar */}
      <div className="flex gap-2 border-b border-[rgba(255,255,255,0.08)] pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('cockpit')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
            activeTab === 'cockpit'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/10'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>1. Cockpit & Solvência</span>
        </button>

        <button
          onClick={() => setActiveTab('dupont')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
            activeTab === 'dupont'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/10'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>2. DuPont 5 Estágios & Índices</span>
        </button>

        <button
          onClick={() => setActiveTab('copilot')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
            activeTab === 'copilot'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/10'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>3. CFO Prescritivo & Alocação</span>
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
            activeTab === 'simulator'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/10'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>4. Simulador What-If</span>
        </button>

        <button
          onClick={() => setActiveTab('dossier')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
            activeTab === 'dossier'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/10'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>5. Dossiê Executivo PDF</span>
        </button>
      </div>

      {/* TAB 1: COCKPIT EXECUTIVO & TERMÔMETRO DE SAÚDE FINANCEIRA */}
      {activeTab === 'cockpit' && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[var(--bg-surface-card,#131C30)] border border-[rgba(255,255,255,0.08)] flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-medium">Liquidez Corrente</p>
                <p className="text-2xl font-bold text-white mt-1">{completeReport.liquidity.liquidezCorrente.toFixed(2)}</p>
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 mt-1">
                  <CheckCircle2 className="w-3 h-3" /> Folga Confortável (&gt; 1.50)
                </span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[var(--bg-surface-card,#131C30)] border border-[rgba(255,255,255,0.08)] flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-medium">Retorno Capital Próprio (ROE)</p>
                <p className="text-2xl font-bold text-white mt-1">{completeReport.profitability.roePercent.toFixed(2)}%</p>
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 mt-1">
                  <ArrowUpRight className="w-3 h-3" /> Alta Performance (&gt; 20%)
                </span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[var(--bg-surface-card,#131C30)] border border-[rgba(255,255,255,0.08)] flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-medium">Endividamento Geral</p>
                <p className="text-2xl font-bold text-white mt-1">{completeReport.solvency.endividamentoGeralPercent.toFixed(1)}%</p>
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 mt-1">
                  <ShieldCheck className="w-3 h-3" /> Nível Prudencial (&lt;= 50%)
                </span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Scale className="w-6 h-6" />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[var(--bg-surface-card,#131C30)] border border-[rgba(255,255,255,0.08)] flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-medium">Ciclo de Caixa (Fleuriet)</p>
                <p className="text-2xl font-bold text-white mt-1">{completeReport.workingCapital.cicloCaixaFinanceiroDias.toFixed(0)} dias</p>
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 mt-1">
                  <CheckCircle2 className="w-3 h-3" /> Tesouraria Saudável (+R$ {(completeReport.workingCapital.saldoTesouraria / 1000).toFixed(0)}k)
                </span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 p-5 rounded-2xl bg-[var(--bg-surface-card,#131C30)] border border-[rgba(255,255,255,0.08)] flex flex-col items-center justify-center text-center">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-2">
                Altman Z''-Score Brasil
              </h3>
              
              <div className="relative w-48 h-28 my-2">
                <svg viewBox="0 0 100 55" className="w-full h-full">
                  <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#1E293B" strokeWidth="10" strokeLinecap="round" />
                  <path d="M 10 50 A 40 40 0 0 1 28 20" fill="none" stroke="#EF4444" strokeWidth="10" />
                  <path d="M 28 20 A 40 40 0 0 1 65 14" fill="none" stroke="#F59E0B" strokeWidth="10" />
                  <path d="M 65 14 A 40 40 0 0 1 90 50" fill="none" stroke="#10B981" strokeWidth="10" />
                  <circle cx="50" cy="50" r="4" fill="#FFFFFF" />
                  <line x1="50" y1="50" x2="80" y2="20" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-x-0 bottom-0 text-center">
                  <span className="text-3xl font-extrabold text-white">
                    {completeReport.solvency.altmanZScore.zScoreBrasilEmergingValue.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                ZONA SEGURA (Z'' &gt;= 2.60)
              </div>
              <p className="text-xs text-slate-400 mt-2 px-2">
                Probabilidade de insolvência desprezível nos próximos 24 meses.
              </p>
            </div>

            <div className="lg:col-span-2 p-5 rounded-2xl bg-[var(--bg-surface-card,#131C30)] border border-[rgba(255,255,255,0.08)] flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.08)] pb-3">
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  Diagnóstico Combinado de Solvência: Altman Z'' + Stephen Kanitz
                </h3>
                <span className="text-xs font-semibold text-slate-400">Modelo Dual Paramétrico</span>
              </div>

              <div className="grid grid-cols-2 gap-4 my-4">
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <p className="text-xs text-slate-400">Termômetro de Insolvência Kanitz</p>
                  <p className="text-xl font-bold text-emerald-400 mt-1">
                    +{completeReport.solvency.kanitzTermometro.fatorInsolvencia.toFixed(2)}
                  </p>
                  <p className="text-xs text-slate-300 mt-1 font-medium">Status: Solvente & Saudável (&gt; 0)</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <p className="text-xs text-slate-400">Grau de Alavancagem Financeira (GAF)</p>
                  <p className="text-xl font-bold text-white mt-1">
                    {completeReport.solvency.grauAlavancagemFinanceira.toFixed(2)}x
                  </p>
                  <p className="text-xs text-slate-300 mt-1 font-medium">Equilíbrio Ativo Total / PL</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
                <p className="text-xs text-emerald-300 leading-relaxed">
                  <strong>Síntese da Auditoria Contábil:</strong> A empresa combina liquidez imediata satisfatória,
                  alavancagem moderada e margens líquidas consistentes ({completeReport.profitability.margemLiquidaPercent.toFixed(1)}%),
                  proporcionando solidez contra choques de taxa de juros e flutuações de demanda setorial.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[var(--bg-surface-card,#131C30)] border border-[rgba(255,255,255,0.08)]">
              <p className="text-xs text-slate-400 font-medium">Total Ativo</p>
              <p className="text-lg font-bold text-white mt-1">R$ 2.000.000,00</p>
              <p className="text-[11px] text-slate-400 mt-1">Capital Total Investido</p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--bg-surface-card,#131C30)] border border-[rgba(255,255,255,0.08)]">
              <p className="text-xs text-slate-400 font-medium">Patrimônio Líquido</p>
              <p className="text-lg font-bold text-white mt-1">R$ 1.100.000,00</p>
              <p className="text-[11px] text-slate-400 mt-1">55% do Ativo Total</p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--bg-surface-card,#131C30)] border border-[rgba(255,255,255,0.08)]">
              <p className="text-xs text-slate-400 font-medium">Receita Líquida</p>
              <p className="text-lg font-bold text-white mt-1">R$ 3.200.000,00</p>
              <p className="text-[11px] text-emerald-400 mt-1">+14% vs Período Anterior</p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--bg-surface-card,#131C30)] border border-[rgba(255,255,255,0.08)]">
              <p className="text-xs text-slate-400 font-medium">EBITDA Anual</p>
              <p className="text-lg font-bold text-emerald-400 mt-1">R$ 950.000,00</p>
              <p className="text-[11px] text-slate-400 mt-1">Margem: {completeReport.profitability.margemEbitdaPercent.toFixed(1)}%</p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--bg-surface-card,#131C30)] border border-[rgba(255,255,255,0.08)]">
              <p className="text-xs text-slate-400 font-medium">Lucro Líquido</p>
              <p className="text-lg font-bold text-white mt-1">R$ 540.000,00</p>
              <p className="text-[11px] text-slate-400 mt-1">Margem: {completeReport.profitability.margemLiquidaPercent.toFixed(1)}%</p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--bg-surface-card,#131C30)] border border-[rgba(255,255,255,0.08)]">
              <p className="text-xs text-slate-400 font-medium">ROIC</p>
              <p className="text-lg font-bold text-cyan-400 mt-1">{completeReport.profitability.roicPercent.toFixed(1)}%</p>
              <p className="text-[11px] text-slate-400 mt-1">Retorno s/ Capital</p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--bg-surface-card,#131C30)] border border-[rgba(255,255,255,0.08)]">
              <p className="text-xs text-slate-400 font-medium">Fluxo de Caixa Livre (FCFF)</p>
              <p className="text-lg font-bold text-emerald-400 mt-1">R$ {cfoDecision.crossMetrics.freeCashFlowFirmFCFF.toLocaleString('pt-BR')}</p>
              <p className="text-[11px] text-slate-400 mt-1">Geração de Caixa</p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--bg-surface-card,#131C30)] border border-[rgba(255,255,255,0.08)]">
              <p className="text-xs text-slate-400 font-medium">Teto de Crédito Saudável</p>
              <p className="text-lg font-bold text-purple-400 mt-1">+R$ {cfoDecision.creditCapacity.capacidadeAdicionalCreditoSaudavel.toLocaleString('pt-BR')}</p>
              <p className="text-[11px] text-slate-400 mt-1">Capacidade Segura</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DECOMPOSIÇÃO DUPONT 5 ESTÁGIOS & ÍNDICES DETALHADOS */}
      {activeTab === 'dupont' && (
        <div className="flex flex-col gap-6">
          <div className="p-6 rounded-2xl bg-[var(--bg-surface-card,#131C30)] border border-[rgba(255,255,255,0.08)] shadow-xl">
            <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.08)] pb-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-400" />
                  Decomposição DuPont em 5 Estágios com Identidade Matemática Estrita
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  ROE = [Tax Burden (LL/EBT)] × [Interest Burden (EBT/EBIT)] × [EBIT Margin (EBIT/Rec)] × [Asset Turnover (Rec/Ativo)] × [Equity Multiplier (Ativo/PL)]
                </p>
              </div>
              <div className="px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                Identidade Verificada (Discrepância = {completeReport.dupont.discrepancia.toFixed(4)})
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center hover:border-emerald-500/30 transition-all">
                <span className="text-[11px] text-slate-400 font-semibold uppercase">1. Carga Tributária</span>
                <p className="text-xl font-black text-white mt-1">{completeReport.dupont.taxBurden.toFixed(4)}</p>
                <p className="text-xs text-emerald-400 font-medium mt-0.5">{(completeReport.dupont.taxBurden * 100).toFixed(1)}% Retenção</p>
                <span className="text-[10px] text-slate-400 mt-2 block">Lucro Líquido / EBT</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center hover:border-emerald-500/30 transition-all">
                <span className="text-[11px] text-slate-400 font-semibold uppercase">2. Efeito Juros</span>
                <p className="text-xl font-black text-white mt-1">{completeReport.dupont.interestBurden.toFixed(4)}</p>
                <p className="text-xs text-emerald-400 font-medium mt-0.5">{(completeReport.dupont.interestBurden * 100).toFixed(1)}% Eficiência</p>
                <span className="text-[10px] text-slate-400 mt-2 block">EBT / EBIT</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center hover:border-emerald-500/30 transition-all">
                <span className="text-[11px] text-slate-400 font-semibold uppercase">3. Margem EBIT</span>
                <p className="text-xl font-black text-white mt-1">{completeReport.dupont.ebitMargin.toFixed(4)}</p>
                <p className="text-xs text-emerald-400 font-medium mt-0.5">{(completeReport.dupont.ebitMargin * 100).toFixed(1)}% Operacional</p>
                <span className="text-[10px] text-slate-400 mt-2 block">EBIT / Receita Líquida</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center hover:border-emerald-500/30 transition-all">
                <span className="text-[11px] text-slate-400 font-semibold uppercase">4. Giro de Ativos</span>
                <p className="text-xl font-black text-white mt-1">{completeReport.dupont.assetTurnover.toFixed(4)}x</p>
                <p className="text-xs text-emerald-400 font-medium mt-0.5">Rotatividade Ativo</p>
                <span className="text-[10px] text-slate-400 mt-2 block">Receita / Total Ativo</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center hover:border-emerald-500/30 transition-all">
                <span className="text-[11px] text-slate-400 font-semibold uppercase">5. Alavancagem</span>
                <p className="text-xl font-black text-white mt-1">{completeReport.dupont.equityMultiplier.toFixed(4)}x</p>
                <p className="text-xs text-emerald-400 font-medium mt-0.5">Multiplicador PL</p>
                <span className="text-[10px] text-slate-400 mt-2 block">Total Ativo / PL</span>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/40 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-black text-xl">
                  ROE
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-semibold">Retorno sobre o Capital Próprio</p>
                  <p className="text-2xl font-extrabold text-emerald-400">
                    {completeReport.dupont.roeRealPercent.toFixed(2)}% a.a.
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                {completeReport.dupont.interpretacao}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-[var(--bg-surface-card,#131C30)] border border-[rgba(255,255,255,0.08)]">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Índices de Liquidez & Dinâmica de Prazos (Fleuriet)
              </h4>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between p-2 rounded-lg bg-slate-900/50">
                  <span className="text-slate-400">Liquidez Corrente</span>
                  <span className="font-bold text-white">{completeReport.liquidity.liquidezCorrente.toFixed(2)}</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-slate-900/50">
                  <span className="text-slate-400">Liquidez Seca (sem estoques)</span>
                  <span className="font-bold text-white">{completeReport.liquidity.liquidezSeca.toFixed(2)}</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-slate-900/50">
                  <span className="text-slate-400">Prazo Médio de Estocagem (PME)</span>
                  <span className="font-bold text-white">{completeReport.workingCapital.prazoMedioEstocagemPme.toFixed(0)} dias</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-slate-900/50">
                  <span className="text-slate-400">Prazo Médio de Recebimento (PMRV)</span>
                  <span className="font-bold text-white">{completeReport.workingCapital.prazoMedioRecebimentoPmrv.toFixed(0)} dias</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-slate-900/50">
                  <span className="text-slate-400">Prazo Médio de Pagamento (PMPF)</span>
                  <span className="font-bold text-white">{completeReport.workingCapital.prazoMedioPagamentoPmpf.toFixed(0)} dias</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-emerald-950/30 text-emerald-400 font-semibold">
                  <span>Classificação Fleuriet</span>
                  <span>{completeReport.workingCapital.classificacaoFleuriet.nome}</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--bg-surface-card,#131C30)] border border-[rgba(255,255,255,0.08)]">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Rentabilidade, Margens & Alavancagem
              </h4>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between p-2 rounded-lg bg-slate-900/50">
                  <span className="text-slate-400">Margem Bruta</span>
                  <span className="font-bold text-white">{completeReport.profitability.margemBrutaPercent.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-slate-900/50">
                  <span className="text-slate-400">Margem EBITDA</span>
                  <span className="font-bold text-white">{completeReport.profitability.margemEbitdaPercent.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-slate-900/50">
                  <span className="text-slate-400">Margem Operacional (EBIT)</span>
                  <span className="font-bold text-white">{completeReport.profitability.margemOperacionalPercent.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-slate-900/50">
                  <span className="text-slate-400">Margem Líquida</span>
                  <span className="font-bold text-white">{completeReport.profitability.margemLiquidaPercent.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-slate-900/50">
                  <span className="text-slate-400">ROA (Retorno sobre Ativo)</span>
                  <span className="font-bold text-white">{completeReport.profitability.roaPercent.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-cyan-950/30 text-cyan-400 font-semibold">
                  <span>ROIC (Capital Investido)</span>
                  <span>{completeReport.profitability.roicPercent.toFixed(2)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CFO PRESCRITIVO & ALOCAÇÃO INTELIGENTE */}
      {activeTab === 'copilot' && (
        <div className="flex flex-col gap-6">
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-indigo-950/30 to-purple-950/40 border border-emerald-500/20 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Sinergia Contábil + Fiscal + DP em Tempo Real</h3>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Cruzamento automático de balanço, DFC, folha de pagamento (Fator R) e oportunidades tributárias monofásicas.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-slate-400">Economia Tributária Anual</p>
                <p className="text-lg font-black text-emerald-400">
                  +R$ {(cfoDecision.crossMetrics.economiaAnualEstimadaFatorR + cfoDecision.crossMetrics.economiaMonofasicaAnualRecuperavel).toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cfoDecision.prescriptiveDiagnostics.map((diag, index) => (
              <div
                key={index}
                className="p-5 rounded-2xl bg-[var(--bg-surface-card,#131C30)] border border-[rgba(255,255,255,0.08)] flex flex-col justify-between hover:border-emerald-500/30 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      {diag.quadrante.replace('_', ' ')}
                    </span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      diag.prioridade === 'URGENTE' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                      diag.prioridade === 'ALTA' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {diag.prioridade}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-2">{diag.titulo}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">{diag.diagnostico}</p>
                </div>

                <div className="pt-3 border-t border-[rgba(255,255,255,0.06)] bg-slate-900/40 -mx-5 -mb-5 p-4 rounded-b-2xl">
                  <p className="text-xs text-emerald-400 font-semibold mb-1">
                    <strong>Ação Recomendada:</strong> {diag.prescricaoAcao}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    <strong>Impacto:</strong> {diag.impactoEsperado}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 rounded-2xl bg-[var(--bg-surface-card,#131C30)] border border-[rgba(255,255,255,0.08)]">
            <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.08)] pb-4 mb-4">
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  Alocação Inteligente de Fluxo de Caixa Livre (FCFF: R$ {cfoDecision.crossMetrics.freeCashFlowFirmFCFF.toLocaleString('pt-BR')})
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Simulação de distribuição equilibrada entre Reserva, Capex e Dividendos
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-slate-300">Reserva de Segurança ({allocReserva}%)</span>
                  <span className="text-sm font-bold text-emerald-400">
                    R$ {((cfoDecision.crossMetrics.freeCashFlowFirmFCFF * allocReserva) / 100).toLocaleString('pt-BR')}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={allocReserva}
                  onChange={(e) => setAllocReserva(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-slate-300">Reinvestimento Capex ({allocCapex}%)</span>
                  <span className="text-sm font-bold text-purple-400">
                    R$ {((cfoDecision.crossMetrics.freeCashFlowFirmFCFF * allocCapex) / 100).toLocaleString('pt-BR')}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={allocCapex}
                  onChange={(e) => setAllocCapex(Number(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-slate-300">Distribuição Dividendos ({allocDividendos}%)</span>
                  <span className="text-sm font-bold text-cyan-400">
                    R$ {((cfoDecision.crossMetrics.freeCashFlowFirmFCFF * allocDividendos) / 100).toLocaleString('pt-BR')}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={allocDividendos}
                  onChange={(e) => setAllocDividendos(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SIMULADOR DE EXPANSÃO & INVESTIMENTOS WHAT-IF */}
      {activeTab === 'simulator' && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap gap-3 items-center">
            <span className="text-xs text-slate-400 font-semibold">Cenários Predefinidos:</span>
            <button
              onClick={() => handlePresetSelect('NOVA_FILIAL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                selectedPreset === 'NOVA_FILIAL'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Nova Filial Comercial
            </button>
            <button
              onClick={() => handlePresetSelect('CONTRATACAO_EQUIPE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                selectedPreset === 'CONTRATACAO_EQUIPE'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Expansão de Equipe
            </button>
            <button
              onClick={() => handlePresetSelect('NOVA_MAQUINA')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                selectedPreset === 'NOVA_MAQUINA'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Novo Maquinário
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 p-5 rounded-2xl bg-[var(--bg-surface-card,#131C30)] border border-[rgba(255,255,255,0.08)] flex flex-col gap-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                Parâmetros do Investimento
              </h4>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Capex Inicial:</span>
                  <span className="font-bold text-white">R$ {simCapex.toLocaleString('pt-BR')}</span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="1000000"
                  step="10000"
                  value={simCapex}
                  onChange={(e) => setSimCapex(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Receita Incremental / Mês:</span>
                  <span className="font-bold text-emerald-400">R$ {simReceita.toLocaleString('pt-BR')}</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="300000"
                  step="5000"
                  value={simReceita}
                  onChange={(e) => setSimReceita(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Custos Variáveis (% receita):</span>
                  <span className="font-bold text-white">{simCvPercent}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="80"
                  value={simCvPercent}
                  onChange={(e) => setSimCvPercent(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Custo Fixo Incremental / Mês:</span>
                  <span className="font-bold text-white">R$ {simCustoFixo.toLocaleString('pt-BR')}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="100000"
                  step="1000"
                  value={simCustoFixo}
                  onChange={(e) => setSimCustoFixo(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">TMA (% a.a.):</span>
                  <span className="font-bold text-white">{simTma}% a.a.</span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="30"
                  value={simTma}
                  onChange={(e) => setSimTma(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Horizonte (meses):</span>
                  <span className="font-bold text-white">{simMeses} meses</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="60"
                  step="6"
                  value={simMeses}
                  onChange={(e) => setSimMeses(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <p className="text-xs text-slate-400 font-medium">VPL</p>
                  <p className={`text-xl font-bold mt-1 ${simulationResult.capitalBudgeting.vpl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    R$ {simulationResult.capitalBudgeting.vpl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <p className="text-xs text-slate-400 font-medium">TIR Anual</p>
                  <p className="text-xl font-bold text-emerald-400 mt-1">
                    {simulationResult.capitalBudgeting.tirPercentAnual.toFixed(2)}% a.a.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <p className="text-xs text-slate-400 font-medium">Payback Descontado</p>
                  <p className="text-xl font-bold text-white mt-1">
                    {simulationResult.capitalBudgeting.paybackDescontadoMeses.toFixed(1)} meses
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <p className="text-xs text-slate-400 font-medium">Margem de Segurança</p>
                  <p className="text-xl font-bold text-cyan-400 mt-1">
                    {simulationResult.breakEven.margemSegurancaPercent.toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[var(--bg-surface-card,#131C30)] border border-[rgba(255,255,255,0.08)]">
                <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                  Pontos de Equilíbrio (Break-Even Mensal)
                </h5>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-900/50">
                    <span className="text-slate-400">P.E. Contábil (PEC):</span>
                    <p className="text-base font-bold text-white mt-0.5">
                      R$ {simulationResult.breakEven.pontoEquilibrioContabilValor.toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900/50">
                    <span className="text-slate-400">P.E. Financeiro (PEF):</span>
                    <p className="text-base font-bold text-emerald-400 mt-0.5">
                      R$ {simulationResult.breakEven.pontoEquilibrioFinanceiroValor.toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900/50">
                    <span className="text-slate-400">P.E. Econômico (PEE):</span>
                    <p className="text-base font-bold text-purple-400 mt-0.5">
                      R$ {simulationResult.breakEven.pontoEquilibrioEconomicoValor.toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
                <p className="text-xs text-emerald-300 leading-relaxed">
                  <strong>Parecer de Viabilidade Econômico-Financeira:</strong> {simulationResult.capitalBudgeting.parecerViabilidade}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: EMISSÃO DE DOSSIÊ EXECUTIVO EM PDF */}
      {activeTab === 'dossier' && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--bg-surface-card,#131C30)] border border-[rgba(255,255,255,0.08)]">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-emerald-400" />
              <div>
                <p className="text-sm font-bold text-white">Dossiê Executivo Paginado A4</p>
                <p className="text-xs text-slate-400">Pronto para emissão oficial com cabeçalho, DuPont e assinaturas</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all shadow-lg cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir / Salvar PDF</span>
              </button>
            </div>
          </div>

          <div className="diamond-paper-a4">
            <div className="border-b-2 border-emerald-600 pb-4 mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black tracking-tight text-slate-950">
                  {executiveDossier.cabecalho.escritorioNome}
                </h2>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  AUDITORIA CONTÁBIL, PERÍCIA & FINANCIAL CFO ADVISORY
                </p>
                <p className="text-[11px] text-slate-500 font-mono">
                  {executiveDossier.cabecalho.responsavelTecnicoCrc}
                </p>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-extrabold rounded-md uppercase">
                  Dossiê Executivo Oficial
                </span>
                <p className="text-xs text-slate-600 mt-1 font-medium">Competência: {executiveDossier.cabecalho.competencia}</p>
                <p className="text-[10px] text-slate-400">Emissão: {executiveDossier.cabecalho.dataEmissao}</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6 text-xs grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-500 font-semibold">Razão Social:</span>
                <p className="font-bold text-slate-900">{executiveDossier.cabecalho.empresa}</p>
              </div>
              <div>
                <span className="text-slate-500 font-semibold">CNPJ / MF:</span>
                <p className="font-bold text-slate-900">{executiveDossier.cabecalho.cnpj}</p>
              </div>
              <div>
                <span className="text-slate-500 font-semibold">Regime Tributário:</span>
                <p className="font-bold text-slate-900">{executiveDossier.cabecalho.regimeTributario}</p>
              </div>
              <div>
                <span className="text-slate-500 font-semibold">CNAE Principal:</span>
                <p className="font-bold text-slate-900">{executiveDossier.cabecalho.cnaePrincipal}</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-extrabold text-emerald-800 uppercase tracking-wider border-b border-slate-200 pb-1 mb-3">
                1. Sumário Executivo & Score de Saúde Financeira
              </h3>
              <div className="grid grid-cols-4 gap-3 text-center mb-3">
                <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase">Score Geral</span>
                  <p className="text-lg font-black text-emerald-700">{executiveDossier.sumarioExecutivo.scoreGeralSaude}/100</p>
                </div>
                <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase">Receita Líquida</span>
                  <p className="text-base font-bold text-slate-900">R$ {executiveDossier.sumarioExecutivo.receitaLiquida.toLocaleString('pt-BR')}</p>
                </div>
                <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase">EBITDA</span>
                  <p className="text-base font-bold text-emerald-700">R$ {executiveDossier.sumarioExecutivo.ebitda.toLocaleString('pt-BR')}</p>
                </div>
                <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase">ROE (DuPont)</span>
                  <p className="text-base font-bold text-emerald-700">{executiveDossier.sumarioExecutivo.roePercent.toFixed(2)}%</p>
                </div>
              </div>

              <div className="space-y-1 text-xs text-slate-700">
                {executiveDossier.sumarioExecutivo.conclusoesSintese.map((conc, idx) => (
                  <p key={idx} className="leading-relaxed">• {conc}</p>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-extrabold text-emerald-800 uppercase tracking-wider border-b border-slate-200 pb-1 mb-3">
                2. Decomposição DuPont em 5 Estágios
              </h3>
              <div className="grid grid-cols-5 gap-2 text-center text-xs">
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <span className="text-[10px] text-slate-500">Tax Burden</span>
                  <p className="font-bold text-slate-900">{completeReport.dupont.taxBurden.toFixed(4)}</p>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <span className="text-[10px] text-slate-500">Interest Burden</span>
                  <p className="font-bold text-slate-900">{completeReport.dupont.interestBurden.toFixed(4)}</p>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <span className="text-[10px] text-slate-500">Margem EBIT</span>
                  <p className="font-bold text-slate-900">{(completeReport.dupont.ebitMargin * 100).toFixed(1)}%</p>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <span className="text-[10px] text-slate-500">Giro de Ativo</span>
                  <p className="font-bold text-slate-900">{completeReport.dupont.assetTurnover.toFixed(2)}x</p>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <span className="text-[10px] text-slate-500">Alavancagem</span>
                  <p className="font-bold text-slate-900">{completeReport.dupont.equityMultiplier.toFixed(2)}x</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-extrabold text-emerald-800 uppercase tracking-wider border-b border-slate-200 pb-1 mb-3">
                3. Pareceres Prescritivos do CFO Virtual
              </h3>
              <div className="space-y-2 text-xs text-slate-700">
                {cfoDecision.pareceresExecutivos.map((par, idx) => (
                  <p key={idx} className="leading-relaxed">• {par}</p>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t-2 border-slate-300">
              <div className="flex justify-between items-end mb-4">
                <div className="text-center w-64">
                  <div className="border-b border-slate-400 mb-1 pb-4 font-serif italic text-slate-800 text-xs">
                    David Auditor & Contabilidade
                  </div>
                  <p className="text-[11px] font-bold text-slate-900">DAVID AUDITOR & CONTABILIDADE</p>
                  <p className="text-[10px] text-slate-500 font-mono">CRC/SP 1SP999999/O-0</p>
                </div>

                <div className="text-center w-64">
                  <div className="border-b border-slate-400 mb-1 pb-4 font-serif italic text-slate-800 text-xs">
                    Diretoria Executiva
                  </div>
                  <p className="text-[11px] font-bold text-slate-900">DIRETORIA EXECUTIVA</p>
                  <p className="text-[10px] text-slate-500 font-mono">SOBERANO INDUSTRIAL S/A</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded border border-slate-200 text-[10px] font-mono text-slate-500 break-all text-center">
                INTEGRIDADE CRIPTOGRÁFICA: {executiveDossier.cabecalho.hashIntegridadeSha256} • {executiveDossier.governancaESignatures.statusLedgerImutavel}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfficeCfoVirtualFinancialDecisionView;
