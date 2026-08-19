## 2026-08-18T19:06:45Z
You are the Forensic Integrity Auditor for Soberano Contábil.

Your working directory is: c:/Users/DAVID/Documents/Projetos/Soberano Contabil/.agents/auditor_financial_integrity
Authoritative Requirements: Read c:/Users/DAVID/Documents/Projetos/Soberano Contabil/ORIGINAL_REQUEST.md.
Worker handoff: Read .agents/worker_financial_cfo/handoff.md.

Your mission:
1. Perform deep forensic integrity auditing on all new code:
   - packages/core/src/accounting/analysis/financial-ratios-engine.ts
   - packages/core/src/accounting/analysis/cfo-decision-copilot.ts
   - packages/core/src/accounting/analysis/financial-simulator-engine.ts
   - packages/core/src/reports/cfo-executive-dossier.ts
   - packages/web/src/views/OfficeCfoVirtualFinancialDecisionView.tsx
   - packages/core/tests/cfo-financial-analysis.test.ts
   - packages/web/src/__tests__/cfo-virtual-dashboard.test.tsx
2. Audit checks:
   - Check for hardcoded test results, cheat flags, mock shortcuts, or synthetic bypasses.
   - Check for genuine implementation of all mathematical formulas (DuPont 5 stages, Altman Z''-Score Brasil, Kanitz, Fleuriet, Newton-Raphson IRR solver, Break-Even, FCF, Debt capacity).
   - Check that UI components render authentic dynamic state and do not use dummy placeholders.
   - Run tests and static analysis.
3. Write your forensic audit report with binary verdict (**CLEAN** or **INTEGRITY VIOLATION**) in c:/Users/DAVID/Documents/Projetos/Soberano Contabil/.agents/auditor_financial_integrity/handoff.md.
4. Send a completion message back to parent.
