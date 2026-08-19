# Soberano Contabil — Navigation Architecture & Diamond Champion UI Redesign

## Architecture
The application layout is structured into 4 isolated zones within App.tsx and index.css:
1. **Global Topbar** (.app-topbar-global): Height 60px, fixed z-index: 50, lex-shrink: 0.
2. **Left Navigation Sidebar** (.app-sidebar-left): Width 280px, lex-shrink: 0, independent vertical scrolling container (.sidebar-nav-scroll) with custom ultra-fluid scrollbar.
3. **Central Workspace Canvas** (.app-center-workspace): lex: 1, min-width: 0, independent vertical scrolling, zero overlap.
4. **Right Copilot Deck** (.app-right-deck): Width 320px, lex-shrink: 0, collapsible assistant pane.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| F1 | 5 Official Departmental Accordions | Reorganize all 181 modules into 5 departments: Gestao & Cockpit (25), DP & Folha (16), Fiscal & Tributario (26), Contabilidade & IFRS (15), Modulos Setoriais & Especiais (99, collapsed by default). Dedicated icons, titles, and routine count badges. | M1 | ORIGINAL_REQUEST §R1 |
| F2 | Accordion Toggles (Individual & Mass) | Expand/collapse individual accordions + Global " Expandir Todos\ / \Recolher Todos\ buttons. | M1 | ORIGINAL_REQUEST §R1 |
| F3 | Custom Ultra-Fluid Scrollbar | Custom scrollbar in .sidebar-nav-scroll with ::-webkit-scrollbar (5px, transparent track, emerald thumb with hover glow) and scrollbar-width: thin. No bleed into Topbar/Canvas. | M2 | ORIGINAL_REQUEST §R2 |
| F4 | Quick Filter Tabs & Instant Search | Tabs at sidebar top (Todos, Core, DP, Fiscal, Contabil, Setoriais) + Instant search input with real-time match count badge and <mark> term highlighting. | M2 | ORIGINAL_REQUEST §R3 |
| F5 | Pinned / Favorite Routines | Pinned routines section at the top of the sidebar with 1-click direct access, star toggle, and LocalStorage persistence. | M2 | ORIGINAL_REQUEST §R3 |
| F6 | Diamond Champion Polish & Micro-interactions | 150ms transitions, active module indicator (3px emerald line + subtle glow), calibrated HSL tokens, crisp typography, and 0 layout overlap across desktop, notebook, widescreen. | M3 | ORIGINAL_REQUEST §R4 |
| F7 | E2E & Component Test Suite | 4-Tier test suite verifying all 5 departmental accordions, search, filters, favorites, scrollbars, and zero build/test regressions (618 tests green). | M4 | ORIGINAL_REQUEST §Acceptance Criteria |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Navigation Architecture & Departmental Structure | Extract navigation config to packages/web/src/config/navigation-modules.ts, categorize 181 modules into 5 official departments, implement accordion expand/collapse & mass toggle. | none | DONE |
| M2 | Ultra-Fluid Scrollbar, Search, Filters & Favorites | Implement custom scrollbar in CSS, quick filter tabs, instant search with <mark> highlight, and LocalStorage favorites system. | M1 | DONE |
| M3 | Diamond Champion Visual Polish & Layout Integrity | CSS token refinement in index.css, active states, 150ms transitions, responsive container isolation, zero overlap across resolutions. | M2 | DONE |
| M4 | E2E & Component Test Suite Verification | Comprehensive test suite in packages/web testing all features (Tiers 1-4), verify 100% green tests & 0 build errors. | M1, M2, M3 | DONE |

## Interface Contracts
### NavigationModule & DepartmentCategory
` ypescript
export interface NavigationModule {
 id: string;
 name: string;
 badge?: string;
 isNew?: boolean;
 departmentId: 'gestao' | 'dp' | 'fiscal' | 'contabil' | 'setoriais';
}

export interface DepartmentCategory {
 id: 'gestao' | 'dp' | 'fiscal' | 'contabil' | 'setoriais';
 name: string;
 iconName: string;
 defaultCollapsed: boolean;
 modules: NavigationModule[];
}
`

## Code Layout
- packages/web/src/config/navigation-modules.ts — 181 modules organized into 5 official departments.
- packages/web/src/components/SidebarNavigation.tsx — Modular Sidebar with search, filters, favorites, accordions, and scrollbar.
- packages/web/src/App.tsx — Root layout tying Topbar, SidebarNavigation, Central Canvas, and Copilot Deck.
- packages/web/src/index.css — Global CSS tokens, scrollbar styling, active states, micro-interactions.
- packages/web/src/__tests__/sidebar-navigation.test.ts — Comprehensive test suite for navigation, accordions, search, filters, and favorites (46 tests).
