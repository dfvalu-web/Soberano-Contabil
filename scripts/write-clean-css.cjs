const fs = require('fs');

const css = `/* ==========================================================================
   SOBERANO CONTÁBIL — DESIGN SYSTEM DIAMANTE ENTERPRISE v4.2
   Layout 100% Imune a Sobreposição (Zero Overflow / Zero Clashing)
   ========================================================================== */

@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

:root {
  --font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Palette */
  --bg-deep: #080C15;
  --bg-main: #0B101D;
  --bg-surface: #101728;
  --bg-surface-elevated: #182238;
  --bg-card: #131C30;
  --bg-card-hover: #1C2742;

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
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-full);
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Font Mono */
.font-mono {
  font-family: var(--font-mono);
}

/* App Shell Structure */
.app-shell {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

/* Sidebar */
.app-sidebar {
  width: 290px;
  min-width: 290px;
  max-width: 290px;
  height: 100vh;
  background: #0D1322;
  border-right: 1px solid var(--border-subtle);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow: hidden;
  transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 30;
}

.app-sidebar.collapsed {
  width: 0px;
  min-width: 0px;
  border-right: none;
}

.sidebar-header {
  height: 64px;
  min-height: 64px;
  padding: 0 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-subtle);
  background: rgba(255, 255, 255, 0.02);
}

.sidebar-search {
  padding: 12px 14px;
  border-bottom: 1px solid var(--border-subtle);
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: rgba(0, 0, 0, 0.15);
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

.sidebar-search-input {
  background: transparent;
  border: none;
  color: #fff;
  font-size: 0.8rem;
  outline: none;
  width: 100%;
}

.sidebar-nav-list {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 10px 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.sidebar-footer {
  height: 52px;
  min-height: 52px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--border-subtle);
  background: rgba(0, 0, 0, 0.3);
}

/* Category Group in Sidebar */
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
  border-left: 2px solid transparent;
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
  background: linear-gradient(90deg, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.08));
  color: var(--emerald-400);
  font-weight: 700;
  border-left-color: var(--emerald-500);
}

/* Main Workspace */
.app-main {
  flex: 1;
  min-width: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--bg-deep);
}

/* Top Navbar */
.app-topbar {
  height: 64px;
  min-height: 64px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-subtle);
  background: #0F172A;
  flex-shrink: 0;
  z-index: 20;
}

/* Content Container (Single Scroll Engine) */
.app-content {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 24px 32px 64px 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Category Filter Bar */
.category-filter-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
  flex-shrink: 0;
}

.category-filter-pill {
  padding: 6px 14px;
  border-radius: var(--radius-full);
  font-size: 0.76rem;
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

/* View Wrapper */
.view-wrapper {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 24px;
  box-shadow: var(--shadow-md);
  min-height: 500px;
}

/* Buttons */
.btn-primary-action {
  background: linear-gradient(135deg, #10B981, #06B6D4);
  color: #070B12;
  font-weight: 800;
  font-size: 0.8rem;
  padding: 8px 16px;
  border-radius: var(--radius-sm);
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  box-shadow: var(--shadow-glow);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.btn-primary-action:hover {
  transform: translateY(-1px);
  box-shadow: 0 0 25px rgba(16, 185, 129, 0.45);
}

.btn-toggle-menu {
  background: var(--bg-surface-elevated);
  border: 1px solid var(--border-subtle);
  color: #fff;
  padding: 7px 12px;
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: background 0.15s ease;
}

.btn-toggle-menu:hover {
  background: var(--bg-card-hover);
}
`;

fs.writeFileSync('packages/web/src/index.css', css.trim() + '\n', 'utf8');
console.log('Clean index.css generated.');
