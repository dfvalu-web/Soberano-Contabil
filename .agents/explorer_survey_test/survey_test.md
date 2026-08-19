# Test & Build Harness Survey Report — Soberano Contábil

**Author**: Explorer 3 (Test & Build Harness Survey)  
**Date**: 2026-08-18  
**Working Directory**: `.agents/explorer_survey_test/`  
**Workspace Root**: `c:/Users/DAVID/Documents/Projetos/Soberano Contabil`  
**Integrity Mode**: Development / Exploration  

---

## 1. Executive Summary

This report documents the baseline health, build system, test runner infrastructure, existing test coverage, and test gap analysis for the **Soberano Contábil** redesign project against the specifications in `ORIGINAL_REQUEST.md`.

### Core Findings:
1. **Production Build Status**: **100% GREEN (PASSING)**. `npm run build` (`vite build packages/web`) compiles 2,433 modules in **6.88 seconds** with 0 errors.
2. **Core Unit & Integration Tests**: **100% GREEN (PASSING)**. `npm test`(`npx vitest run`) executes **202 test files** containing **437 test cases** with 100% success (0 failures, 0 regressions) in **240.87 seconds**.
3. **Frontend / UI Test Coverage**: **0% (COMPLETE GAP)**. All existing 437 tests reside exclusively in `packages/core/tests/` testing core accounting logic, SPED engines, tax rules, and payroll math. `packages/web`  has *zero* component or E2E tests.
4. **Acceptance Criteria Gaps**: The existing codebase lacks test harnesses for:
   - Sidebar 5-department accordion structure & routine counters (R1)
   - Custom ultra-fluid scrollbar & independent viewport scrolling (R2)
   - Quick filter tabs (`Core`, `DP`, `Fiscal`, `Contábil`, `Todos`), instant search highlighting, and Favorites/Pinned routines (R3)
   - Diamond Champion active states, micro-interactions, and zero layout overlapping (R4)
5. **Typecheck / Linting Gap**: `npm run lint` (`tsc --noEmit`) fails with exit code 1 because no `tsconfig.json` is configured in the repository root.

---

## 2. Monorepo & Build System Survey

**Workspace Architecture**: `core+server+web` in `pnpm-workspace.yaml`, single root `package.json`, Vite 8 build.

## 3. Test Runner & Baseline Test Health
- Vitest 4.1.10, 202 test files, 437 tests passed (100% success), 240.87s duration.

## 4. Feature Coverage vs. Acceptance Criteria Matrix
- Sidebar 5-Department Accordions (R1): 0% Test Coverage (CRITICAL GAP)
- Custom Scrollbar (R2): 0% Test Coverage (HIGH GAP)
- Quick Filters & Favorites (R3): 0% Test Coverage (CRITICAL GAP)
- Diamond Visual Champion (R4): 0% Test Coverage (HIGH GAP)
- Build Compilation (0 errors): 100% Verified (PASS)
- Suite de testes (100% unit green): 100% unit green (PASS Core / GAP Web)


## 5. Proposed Testing Strategy
1. Component Tests (Vitest + JSDOM): `categories.test.tsx`, `filters-search.test.tsx`, `favorites.test.tsx`, `active-state.test.tsx`.
2. Core Regression Guard: Run all 437 core tests.
3. visual & E2E Viewport Checks: 1920x1080, 1366x768, 128px800.
