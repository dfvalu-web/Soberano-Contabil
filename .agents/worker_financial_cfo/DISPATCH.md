## 2026-08-18T18:33:00Z
You are the Lead Full-Stack & Financial Worker for Soberano Contábil.

Your working directory is: c:/Users/DAVID/Documents/Projetos/Soberano Contabil/.agents/worker_financial_cfo
Authoritative Requirements: Read c:/Users/DAVID/Documents/Projetos/Soberano Contabil/ORIGINAL_REQUEST.md (specifically the Follow-up section).
Technical Blueprints: Read .agents/explorer_financial_arch/handoff.md, .agents/explorer_financial_calc/handoff.md, and .agents/explorer_financial_ui_pdf/handoff.md.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. An auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Your Tasks:
1. Implement in packages/core/src/types/:
   - financial-analysis.ts: LiquidityRatios, ProfitabilityRatios, DuPont5StageDecomposition, SolvencyAndCreditRisk, WorkingCapitalAndCycles, CompleteFinancialAnalysisReport, HealthStatus.
   - cfo-decision.ts: PrescriptiveDiagnostic, CrossReferencedMetrics, CapitalAllocationPlan, CreditCapacityLimit.
   - financial-simulator.ts: ExpansionScenarioInput, BreakEvenAnalysisResult, CapitalBudgetingResult.

2. Implement in packages/core/src/accounting/analysis/:
   - financial-ratios-engine.ts: Full deterministic implementation of Liquidity, Margins & Profitability, 5-Stage DuPont Decomposition, Solvency (Altman Z''-Score Brasil, Kanitz Termômetro, Grau de Endividamento, Cobertura de Juros), Working Capital & Cycles (PME, PMRV, PMPF, Ciclo Operacional, Ciclo de Caixa, NCG, Saldo de Tesouraria e Efeito Tesoura).
   - cfo-decision-copilot.ts: Prescriptive AI Copilot cross-referencing Balance Sheet, DRE, DFC, Monophasic tax savings, Fator R, and payroll costs. Calculates FCFF/FCFE, healthy debt capacity ceiling, automated diagnostic text generator.
   - financial-simulator-engine.ts: What-If Expansion Simulator with Break-Even, Margin of Safety, NPV, IRR (Newton-Raphson), and Payback.

3. Implement in packages/core/src/reports/:
   - cfo-executive-dossier.ts: Structured Executive Dossier model with digital verification signatures.

4. Update packages/core/src/index.ts: Export all.
5. Implement packages/web/src/views/OfficeCfoVirtualFinancialDecisionView.tsx: 5 tabs.
6. Register in packages/web/src/config/navigation-modules.ts & App.tsx.
7. Test suites in packages/core/tests/ & packages/web/src/__tests__/.
8. Verify npm run test & npm run build.
