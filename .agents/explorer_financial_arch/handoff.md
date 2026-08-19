# Relatorio de Arquitetura Financeira e Mapeamento de Estado (Virtual CFO Hub)

## 1. Observation (Evidencias do Codebase)

A investigacao detalhada do monorepo do Soberano Contabil revelou a estrutura existente de dados, regras de negocio e barramento de eventos:

### 1.1. Gerenciamento de Estado Global & Entidades (packages/web/src/state/office-store.ts)
- Arquivo: packages/web/src/state/office-store.ts (Linhas 5-185 e 240-310)
- Estruturas Observadas:
  - CompanyTenant: gerencia as empresas cadastradas com regime tributario (SIMPLES_NACIONAL, LUCRO_PRESUMIDO, LUCRO_REAL), CNAE principal, status de CNDs e enquadramento CPRB/Fator R.
  - Employee: modela colaboradores com salarios-base, departamento, adicionais (periculosidade, insalubridade), horas extras e encargos.
  - OfficeStateStore: classe singleton reativa (officeStore) que gerencia tenants e employees, com persistencia em localStorage, mecanismo de subscricao (subscribe(listener)), calculo progressivo de folha (INSS/IRRF 2026) e rescisao trabalhista (calculateTermination).

### 1.2. Barramento de Eventos e Sincronizacao Contabil (packages/web/src/state/office-event-bus.ts)
- Arquivo: packages/web/src/state/office-event-bus.ts (Linhas 5-150)
- Tipos de Eventos Existentes:
  - MONOPHASIC_TAX_SEGREGATED: emite economia tributaria apurada para debito no passivo e credito no resultado.
  - PAYROLL_CLOSED: emite folha fechada (totalBruto, totalLiquido, totalInss, totalIrrf, totalFgts, employeesCount).
  - SECTORIAL_OPERATION_POSTED: lanca operacoes setoriais especializadas no Livro Diario com hash de auditoria.
  - LedgerSyncRecord: armazena partidas dobradas sincronizadas com flag isAcidSynced.

### 1.3. Demonstracoes Contabeis & Tipos em Core (packages/core/src/)
- Tipos: packages/core/src/types/accounting.ts
  - BalanceSheet (Linhas 46-58): ativoCirculante, ativoNaoCirculante, totalAtivo, passivoCirculante, passivoNaoCirculante, patrimonioLiquido, totalPassivoEPatrimonioLiquido, isEquilibrado, diferenca.
  - IncomeStatement (Linhas 60-73): receitaBruta, deducoesReceita, receitaLiquida, custosOperacionais, lucroBruto, despesasOperacionais, resultadoOperacional, provisaoIrpjCsll, lucroLiquidoExercicio.
  - FinancialStatementLine (Linhas 38-44): linhas hierarquicas das demonstracoes contabeis.
- Geradores de Demonstracoes:
  - packages/core/src/accounting/statements/financial-statements.ts: funcao generateFinancialStatements(accounts, inicio, fim) que calcula Balanco e DRE com fechamento contabil.
  - packages/core/src/accounting/statements/dfc-dmpl.ts: funcao generateDfcStatement(accounts, saldoInicial, inicio, fim, metodo) retornando DfcStatement (atividades operacionais, investimentos e financiamentos).
  - packages/core/src/reports/executive-dossier.ts: funcao generateExecutiveDossier(company, balanceSheet, incomeStatement, scoreConformidade).

### 1.4. Catalogo de Navegacao & Roteamento (packages/web/src/config/navigation-modules.ts & App.tsx)
- Catalogo de Modulos: DEPARTMENT_CATEGORIES organiza 181 rotinas em 5 departamentos:
  1. gestao (25 modulos) - Tag: GESTAO
  2. dp (16 modulos) - Tag: DP
  3. fiscal (26 modulos) - Tag: FISCAL
  4. contabil (15 modulos) - Tag: CONTABIL
  5. setoriais (99 modulos) - Tag: SETORIAIS
- Roteador Principal: packages/web/src/App.tsx utiliza o hook useState com currentModuleId renderizando condicionalmente a view ativa.
- Suite de Testes: 207 suites e 628 testes unitarios/integracao rodando e passando 100% verde com Vitest (npm run test).

---

## 2. Logic Chain (Fluxo de Dados & Integracao do CFO Virtual)

1. Agregacao de Dados: O modulo obtem a empresa selecionada (CompanyTenant), o plano de contas e lancamentos contabeis (BalanceSheet e IncomeStatement de generateFinancialStatements), a DFC (DfcStatement de generateDfcStatement), os dados da folha de pagamento (officeStore.getEmployees(tenantId)) e eventos fiscais (officeEventBus.getEventHistory(tenantId)).
2. Calculo Deterministico: O motor FinancialRatiosEngine computa os 5 blocos de indices financeiros com formulas padronizadas da CVM/CFC e IFRS:
   - Liquidez: Corrente, Seca, Imediata, Geral.
   - Rentabilidade & Margens: Bruta, EBITDA, Operacional, Liquida, ROE, ROA, ROI.
   - Decomposicao DuPont em 5 Estagios: Eficiencia Operacional (EBIT/Receita), Giro do Ativo (Receita/Ativo), Efeito Juros (EBT/EBIT), Efeito Impostos (LL/EBT), Alavancagem Financeira (Ativo/PL).
   - Solvencia & Risco: Endividamento Geral, Composicao da Divida, Cobertura de Juros, Altman Z-Score para Mercados Emergentes (Brasil).
   - Ciclo Financeiro & Capital de Giro: PME, PMRV, PMPF, Ciclo Operacional, Ciclo de Caixa, NCG, Saldo de Tesouraria e Efeito Tesoura.
3. Diagnostico Forense Prescritivo: O CfoDecisionCopilot correlaciona a geracao operacional de caixa, o custo da folha e as economias tributarias para prescrever alocacao estrategica de capital (distribuicao de dividendos isentos vs reinvestimento vs reserva de caixa operacional) e calcular a capacidade maxima saudavel de credito.
4. Simulacao Interativa: O FinancialSimulatorEngine permite ao usuario ajustar sliders de investimento, taxa de desconto (TMA) e custos para calcular VPL, Payback Simples e Descontado, Pontos de Equilibrio (Contabil, Financeiro e Economico) e Margem de Seguranca Operacional.
5. Dossie Executivo: Emite relatorio formal em PDF / impressao com sumario executivo, graficos de diagnostico e plano de acao assinado pelo Contador/CFO.

---

## 3. Integration Contracts (Contratos TypeScript & Extensoes Propostas)

### 3.1. Tipos do Motor de Indices (packages/core/src/types/financial-analysis.ts)
- LiquidityRatios: liquidezCorrente, liquidezSeca, liquidezImediata, liquidezGeral.
- ProfitabilityRatios: receitaLiquida, lucroBruto, ebitda, lucroOperacionalEbit, lucroLiquido, margemBrutaPercent, margemEbitdaPercent, margemOperacionalPercent, margemLiquidaPercent, roePercent, roaPercent, roiPercent.
- DuPont5Stages: eficienciaOperacional, giroDoAtivo, efeitoJuros, efeitoImpostos, alavancagemFinanceira, roeCalculadoDuPont.
- SolvencyAltmanZScore: endividamentoGeralPercent, composicaoEndividamentoCurtoPrazoPercent, coberturaJuros, x1CapitalGiroSobreAtivo, x2LucrosAcumuladosSobreAtivo, x3EbitSobreAtivo, x4PlSobrePassivoTotal, zScoreValue, statusSolvencia (ZONA_SEGURA | ZONA_ALERTA | ZONA_RISCO).
- WorkingCapitalCycle: prazoMedioEstocagemPme, prazoMedioRecebimentoPmrv, prazoMedioPagamentoPmpf, cicloOperacionalDias, cicloCaixaFinanceiroDias, necessidadeCapitalGiroNcg, saldoTesouraria, efeitoTesouraDetectado.
- FinancialRatiosReport: consolidado de todos os blocos acima.

### 3.2. Tipos da IA Decisoria & Alocacao de Recursos (packages/core/src/types/cfo-decision.ts)
- PrescriptiveDiagnostic: id, categoria, severidade (POSITIVO | ATENCAO | CRITICO), titulo, parecerTexto, impactoFinanceiroEstimado, recomendacaoAcao.
- ResourceAllocationAnalysis: freeCashFlow, capacidadeCreditoSaudavel, reinvestimentoRecomendadoValor, reinvestimentoRecomendadoPercent, distribuicaoDividendosIsentosValor, distribuicaoDividendosPercent, reservaEmergencialCicloCaixa, pareceres.

### 3.3. Tipos do Simulador What-If (packages/core/src/types/financial-simulator.ts)
- InvestmentSimulationParams: nomeProjeto, tipoProjeto (NOVA_FILIAL | EQUIPE_EXPANSAO | MAQUINARIO_TECNOLOGIA), investimentoInicialCapex, custoFixoAdicionalMensal, custoVariavelPercent, margemContribuicaoPercent, receitaIncrementalMensalEstimada, vidaUtilMeses, taxaMinimaAtratividadeTmaAnual.
- InvestmentSimulationResult: pontoEquilibrioContabilMensal, pontoEquilibrioFinanceiroMensal, pontoEquilibrioEconomicoMensal, margemSegurancaOperacionalPercent, fluxoCaixaProjetadoMensal, vpl, paybackSimplesMeses, paybackDescontadoMeses, statusViabilidade (ALTAMENTE_VIAVEL | VIAVEL_COM_RESSALVAS | INVIAVEL), parecerViabilidade.

---

## 4. Navigation & Routing Specification

Para integrar o novo modulo de forma harmoniosa no catalogo de 181 modulos:
- Module ID: office_cfo_virtual_financial_decision
- Nome Oficial: Analise das Demonstracoes & CFO Virtual
- Label Curto: CFO Virtual & Hub Decisorio
- Departamento Principal: contabil (Contabilidade & IFRS)
- Tag Departamental: CONTABIL
- Icone: TrendingUp
- Badge: NOVO - CFO IA
- Flag isCore: true (Acesso direto e prioritario na aba Core e Contabil)
- Arquivo View: OfficeCfoVirtualFinancialDecisionView (packages/web/src/views/OfficeCfoVirtualFinancialDecisionView.tsx)
- Deck de Acoes Rapidas no App.tsx: Inclusao de atalho rapido Diagnostico CFO Virtual no Copiloto Contabil IA da sidebar direita.

---

## 5. Caveats & Risks (Riscos e Tratamento de Excecoes)

1. Divisao por Zero / Valores Nulos:
   - Empresas em fase inicial ou sem faturamento podem ter Passivo Circulante = 0, Receita Liquida = 0 ou PL = 0.
   - Mitigacao: Implementar guards deterministicos (safeDivide(numerator, denominator, fallback = 0)) em todos os calculos de indices e simulacoes.
2. Patrimonio Liquido Negativo (Passivo a Descoberto):
   - Afeta a formula tradicional do ROE e o estagio de alavancagem de DuPont.
   - Mitigacao: Sinalizar explicitamente no semaforo STATUS: PASSIVO A DESCOBERTO e ajustar a decomposicao DuPont para evitar interpretacoes distorcidas de ROE positivo resultante de prejuizo duplo.
3. Reatividade do Store & Event Bus:
   - Alteracoes em lancamentos contabeis ou na folha de pagamento devem refletir imediatamente nos calculos do CFO Virtual.
   - Mitigacao: Utilizar subscricao no officeStore.subscribe() e listener no officeEventBus.subscribe("*") dentro de useEffect com memoizacao de calculos pesados via useMemo.

---

## 6. Conclusion (Recomendacoes e Decomposicao de Milestones)

A arquitetura do Soberano Contabil e altamente modular, desacoplada e 100% pronta para receber o modulo de CFO Virtual & Hub de Tomada de Decisao Financeira. Recomenda-se a seguinte decomposicao em sub-tarefas de implementacao:

- Milestone 1 - Core Engines & Mathematical Models:
  - Implementacao de financial-ratios-engine.ts, cfo-decision-copilot.ts e financial-simulator-engine.ts em packages/core/src/accounting/analysis/.
  - Implementacao do gerador de relatorio cfo-executive-dossier.ts em packages/core/src/reports/.
  - Exportacao oficial em packages/core/src/index.ts.
- Milestone 2 - Testes Unitarios de Rigor Matematico:
  - Criacao de packages/core/tests/cfo-financial-analysis.test.ts cobrindo todas as formulas (Liquidez, Rentabilidade, DuPont 5 estagios, Altman Z-Score, NCG, VPL, Payback e Casos Limite com zero).
- Milestone 3 - Visual Interface Diamond Champion:
  - Implementacao de OfficeCfoVirtualFinancialDecisionView.tsx em packages/web/src/views/ com 4 abas interativas (Cockpit de Indices, Diagnostico CFO com IA, Simulador What-If e Emissao de Dossie Executivo).
- Milestone 4 - Navegacao, Roteamento & Integracao Global:
  - Registro do modulo em packages/web/src/config/navigation-modules.ts.
  - Integracao no roteador de views do packages/web/src/App.tsx.
  - Testes de navegacao e verificacao da suite completa de testes (npm run test e npm run build).

---

## 7. Verification Method (Metodo de Verificacao Independente)

Para auditar e verificar de forma independente a arquitetura proposta:
1. Inspecao de Arquivos:
   - packages/web/src/config/navigation-modules.ts
   - packages/web/src/state/office-store.ts
   - packages/web/src/state/office-event-bus.ts
   - packages/core/src/types/accounting.ts
   - packages/core/src/accounting/statements/financial-statements.ts
2. Execucao de Testes do Projeto:
   npm run test
   Criterio de Sucesso: Todas as 207 suites existentes devem permanecer verdes (628+ testes passando).
3. Build do Frontend:
   npm run build
   Criterio de Sucesso: Compilacao do Vite sem erros de tipo TypeScript (0 errors).
