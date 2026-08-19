const fs = require('fs');

const css = `/* ==========================================================================
   SOBERANO CONTÁBIL — PLATINUM SUITE ENTERPRISE v4.3
   Arquitetura 3-Zonas: Header Global + Sidebar + Canvas Central + Right Copilot Deck
   ========================================================================== */

@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

:root {
  --font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Palette */
  --bg-deep: #070B14;
  --bg-main: #0B101D;
  --bg-surface: #101728;
  --bg-surface-elevated: #162035;
  --bg-surface-card: #131C30;
  --bg-surface-hover: #1C2844;

  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-medium: rgba(255, 255, 255, 0.14);
  --border-highlight: rgba(16, 185, 129, 0.4);

  --text-primary: #F8FAFC;
  --text-secondary: #94A3B8;
  --text-muted: #64748B;

  --emerald-500: #10B981;
  --emerald-400: #34D399;
  --emerald-bg: rgba(16, 185, 129, 0.12);

  --cyan-500: #06B6D4;
  --cyan-400: #22D3EE;
  --cyan-bg: rgba(6, 182, 212, 0.12);

  --blue-500: #3B82F6;
  --blue-400: #60A5FA;
  --blue-bg: rgba(59, 130, 246, 0.12);

  --amber-500: #F59E0B;
  --amber-400: #FBBF24;
  --amber-bg: rgba(245, 158, 11, 0.12);

  --rose-500: #EF4444;
  --rose-400: #F87171;
  --rose-bg: rgba(239, 68, 68, 0.12);

  --purple-500: #8B5CF6;
  --purple-400: #A78BFA;
  --purple-bg: rgba(139, 92, 246, 0.12);

  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.5);
  --shadow-glow: 0 0 20px rgba(16, 185, 129, 0.3);

  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --radius-full: 9999px;
}

/* Reset Global */
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #root {
  width: 100%;
  height: 100%;
  min-height: 100vh;
  overflow: hidden;
  font-family: var(--font-sans);
  background-color: var(--bg-deep);
  color: var(--text-primary);
  -webkit-font-smoothing: antialiased;
}

/* Custom Scrollbar */
* {
  scrollbar-width: thin;
  scrollbar-color: #334155 #0B101D;
}
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: #0B101D;
}
::-webkit-scrollbar-thumb {
  background: #334155;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #475569;
}

.font-mono {
  font-family: var(--font-mono);
}

/* ==========================================================================
   ESTRUTURA DE 3 ZONAS (TOPBAR + SIDEBAR + WORKSPACE + RIGHT COPILOT)
   ========================================================================== */

.app-container {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

/* 1. TOPBAR GLOBAL CORPORATIVA */
.app-topbar-global {
  height: 60px;
  min-height: 60px;
  background: #0E1526;
  border-bottom: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  flex-shrink: 0;
  z-index: 50;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
}

/* Layout dos Painéis Internos */
.app-body-layout {
  flex: 1;
  min-height: 0;
  display: flex;
  width: 100%;
  overflow: hidden;
  position: relative;
}

/* 2. SIDEBAR ESQUERDA */
.app-sidebar-left {
  width: 280px;
  min-width: 280px;
  background: #0C1220;
  border-right: 1px solid var(--border-subtle);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow: hidden;
  transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 30;
}

.app-sidebar-left.collapsed {
  width: 0px;
  min-width: 0px;
  border-right: none;
}

.sidebar-search-box {
  display: flex;
  align-items: center;
  background: var(--bg-surface-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  padding: 7px 10px;
  gap: 8px;
}

.sidebar-search-box:focus-within {
  border-color: var(--emerald-500);
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}

.sidebar-nav-scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 10px 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  scrollbar-width: thin;
  scrollbar-color: #10B981 #0F172A;
}

.category-card {
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.015);
  overflow: hidden;
}

.category-btn {
  width: 100%;
  padding: 9px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-size: 0.77rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s ease;
}

.category-btn:hover {
  background: rgba(255, 255, 255, 0.04);
}

.module-item-btn {
  width: 100%;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 9px;
  background: transparent;
  border: none;
  border-left: 3px solid transparent;
  color: var(--text-secondary);
  font-size: 0.79rem;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.module-item-btn:hover {
  background: rgba(255, 255, 255, 0.04);
  color: #fff;
}

.module-item-btn.active {
  background: linear-gradient(90deg, rgba(16, 185, 129, 0.22), rgba(6, 182, 212, 0.08));
  color: var(--emerald-400);
  font-weight: 700;
  border-left-color: var(--emerald-500);
}

/* 3. WORKSPACE CENTRAL (CANVAS) */
.app-center-workspace {
  flex: 1;
  min-width: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  background: var(--bg-deep);
  padding: 20px 24px 60px 24px;
  gap: 16px;
}

.view-card-container {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 24px;
  box-shadow: var(--shadow-md);
  min-height: 500px;
}

/* 4. PAINEL LATERAL DIREITO (COPILOTO IA & COCKPIT DE AÇÕES) */
.app-right-deck {
  width: 320px;
  min-width: 320px;
  background: #0E1424;
  border-left: 1px solid var(--border-subtle);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow: hidden;
  transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 30;
}

.app-right-deck.collapsed {
  width: 0px;
  min-width: 0px;
  border-left: none;
}

.right-deck-header {
  height: 52px;
  min-height: 52px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-subtle);
  background: rgba(255, 255, 255, 0.02);
}

.right-deck-scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 16px 14px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Widgets no Painel Direito */
.deck-card {
  background: var(--bg-surface-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: var(--shadow-sm);
}

.deck-card-title {
  font-size: 0.76rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Category Filter Bar */
.category-filter-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 2px;
  flex-shrink: 0;
}

.category-filter-pill {
  padding: 5px 12px;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
  transition: all 0.15s ease;
}

.category-filter-pill:hover {
  border-color: var(--border-medium);
  color: #fff;
}

.category-filter-pill.active {
  background: var(--emerald-500);
  border-color: var(--emerald-400);
  color: #070B12;
  font-weight: 800;
  box-shadow: var(--shadow-glow);
}

/* Buttons */
.btn-primary-action {
  background: linear-gradient(135deg, #10B981, #06B6D4);
  color: #070B12;
  font-weight: 800;
  font-size: 0.8rem;
  padding: 7px 14px;
  border-radius: var(--radius-sm);
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  box-shadow: var(--shadow-glow);
  transition: transform 0.15s ease;
}

.btn-primary-action:hover {
  transform: translateY(-1px);
}

.btn-deck-action {
  width: 100%;
  padding: 9px 12px;
  border-radius: var(--radius-sm);
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid var(--border-subtle);
  background: var(--bg-surface-card);
  color: var(--text-primary);
  transition: all 0.15s ease;
}

.btn-deck-action:hover {
  background: var(--bg-surface-hover);
  border-color: var(--emerald-500);
  color: #fff;
}
`;

fs.writeFileSync('packages/web/src/index.css', css.trim() + '\n', 'utf8');
console.log('3-Zone CSS written successfully!');
