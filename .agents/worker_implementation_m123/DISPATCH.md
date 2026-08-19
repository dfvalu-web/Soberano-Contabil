## 2026-08-18T16:55:13Z

You are Worker 1 (Navigation Architecture & UI Implementation Worker).

Working directory: `c:/Users/DAVID/Documents/Projetos/Soberano Contabil/.agents/worker_implementation_m123`
Workspace root: `c:/Users/DAVID/Documents/Projetos/Soberano Contabil`

MANDATORY FIRST STEP:
1. Read `c:/Users/DAVID/Documents/Projetos/Soberano Contabil/ORIGINAL_REQUEST.md` completely.
2. Read `c:/Users/DAVID/Documents/Projetos/Soberano Contabil/PROJECT.md` completely.
3. Read `.agents/explorer_survey_arch/survey_arch.md` and `.agents/explorer_survey_ui/survey_ui.md` for architectural context.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Scope of Work (Exclusive File Ownership: `packages/web/src/config/navigation-modules.ts`, `packages/web/src/components/SidebarNavigation.tsx`, `packages/web/src/App.tsx`, `packages/web/src/index.css`):

1. **R1: Departmental Accordions & Module Catalog**:
   - Create `packages/web/src/config/navigation-modules.ts` with all 181 modules mapped to the 5 official departments:
     1. `gestao`: Gestão & Cockpit do Escritório (Multi-cliente, Fechamentos, Disparos, BPO, CNDs, Honorários, etc.)
     2. `dp`: Departamento Pessoal & Folha (Folha CLT, TRCT, eSocial, Benefícios, Ponto, etc.)
     3. `fiscal`: Fiscal & Tributário (Dropzone OCR, Monofásicos, PGDAS-D, SPED, Retenções, DIFAL, etc.)
     4. `contabil`: Contabilidade & IFRS (Conciliação OFX, Partidas Dobradas, ARE, DRE, Balanço, etc.)
     5. `setoriais`: Módulos Setoriais & Especiais (Agro, Imobiliário, Cripto, M&A, etc. - defaultCollapsed: true)
   - Ensure every module ID used in `App.tsx` is preserved and renders its respective view.
   - Accordions must show dedicated department icon, title, count badge of routines, chevron arrow, and allow individual expand/collapse + mass expand/collapse ("Expandir Todos" / "Recolher Todos").

2. **R2: Custom Ultra-Fluid Scrollbar**:
   - In `packages/web/src/index.css`, implement custom scrollbar for `.sidebar-nav-scroll` (`::-webkit-scrollbar` 5px width, transparent track, emerald thumb with hover glow, `scrollbar-width: thin; scrollbar-color: #10B981 #0F172A;`).
   - Independent vertical scrolling container (`overflow-y: auto; overflow-x: hidden;`) with zero scroll bleed into Topbar or Canvas.

3. **R3: Quick Filters, Instant Search & Favorite Routines**:
   - Quick filter tabs at top of Sidebar (`Core`, `DP`, `Fiscal`, `Contábil`, `Todos`).
   - Instant search input with real-time match count badge and `<mark>` text highlighting of matched terms in module titles.
   - Pinned / Favorite Routines section at top of Sidebar with 1-click access, star toggle icon on each module item, and persistence in `localStorage` (`soberano_favorite_modules`).

4. **R4: Diamond Champion Polish & Layout Integrity**:
   - 150ms micro-interactions (`transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);`), hover `translateX(2px)`.
   - Active module styling: 3px emerald left border, gradient background, bold text, glow indicator.
   - Zero overlap across desktop, notebook, and widescreen viewports.

5. **Build & Test Verification**:
   - Run `npm run build` (or `npx vite build packages/web`) -> must pass with 0 errors.
   - Run `npm test` (or `npx vitest run`) -> all 202 test files (437 tests) must remain 100% green.
   - Document commands, code changes, and test results in `handoff.md` in your working directory `.agents/worker_implementation_m123/`.

Coordinate via send_message when finished.
