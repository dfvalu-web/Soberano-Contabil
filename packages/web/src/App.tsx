import { useState, useTransition } from 'react';
import { DashboardView } from './views/DashboardView.js';
import { TaxEngineView } from './views/TaxEngineView.js';
import { AccountingView } from './views/AccountingView.js';
import { SpedView } from './views/SpedView.js';
import { PayrollView } from './views/PayrollView.js';
import { DfeAuditView } from './views/DfeAuditView.js';
import { SecurityLedgerView } from './views/SecurityLedgerView.js';
import { ExecutiveReportsView } from './views/ExecutiveReportsView.js';
import { LayoutDashboard, Calculator, BookOpen, FileCode, Users, Zap, Building2, ShieldCheck, Award } from 'lucide-react';

export type AppView = 'DASHBOARD' | 'TAX' | 'ACCOUNTING' | 'SPED' | 'PAYROLL' | 'DFE_AUDIT' | 'SECURITY' | 'REPORTS';

export const App = () => {
  const [currentView, setCurrentView] = useState<AppView>('DASHBOARD');
  const [, startTransition] = useTransition();

  const handleNav = (view: AppView) => {
    startTransition(() => {
      setCurrentView(view);
    });
  };

  return (
    <div className="app-container">
      <header className="top-navbar">
        <div className="brand-badge">
          <div className="brand-icon">S</div>
          <div className="brand-info">
            <h1>Soberano Contábil</h1>
            <p>ERP Autônomo & Inteligência Fiscal</p>
          </div>
        </div>

        <nav className="nav-tabs">
          <button
            className={`nav-tab-btn ${currentView === 'DASHBOARD' ? 'active' : ''}`}
            onClick={() => handleNav('DASHBOARD')}
          >
            <LayoutDashboard size={16} /> Cockpit
          </button>
          <button
            className={`nav-tab-btn ${currentView === 'TAX' ? 'active' : ''}`}
            onClick={() => handleNav('TAX')}
          >
            <Calculator size={16} /> Tributário Híbrido
          </button>
          <button
            className={`nav-tab-btn ${currentView === 'ACCOUNTING' ? 'active' : ''}`}
            onClick={() => handleNav('ACCOUNTING')}
          >
            <BookOpen size={16} /> Contabilidade IFRS
          </button>
          <button
            className={`nav-tab-btn ${currentView === 'SPED' ? 'active' : ''}`}
            onClick={() => handleNav('SPED')}
          >
            <FileCode size={16} /> Suite SPED & PVA
          </button>
          <button
            className={`nav-tab-btn ${currentView === 'PAYROLL' ? 'active' : ''}`}
            onClick={() => handleNav('PAYROLL')}
          >
            <Users size={16} /> Folha & eSocial
          </button>
          <button
            className={`nav-tab-btn ${currentView === 'DFE_AUDIT' ? 'active' : ''}`}
            onClick={() => handleNav('DFE_AUDIT')}
          >
            <Zap size={16} /> DF-e & Auditoria
          </button>
          <button
            className={`nav-tab-btn ${currentView === 'SECURITY' ? 'active' : ''}`}
            onClick={() => handleNav('SECURITY')}
          >
            <ShieldCheck size={16} /> Segurança & Ledger
          </button>
          <button
            className={`nav-tab-btn ${currentView === 'REPORTS' ? 'active' : ''}`}
            onClick={() => handleNav('REPORTS')}
          >
            <Award size={16} /> Dossiê Executivo
          </button>
        </nav>

        <div className="tenant-selector">
          <Building2 size={16} color="var(--emerald-400)" />
          <span style={{ fontWeight: 600, color: '#fff' }}>Soberano Tech S/A</span>
          <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>Lucro Real</span>
        </div>
      </header>

      <main className="main-content">
        {currentView === 'DASHBOARD' && <DashboardView />}
        {currentView === 'TAX' && <TaxEngineView />}
        {currentView === 'ACCOUNTING' && <AccountingView />}
        {currentView === 'SPED' && <SpedView />}
        {currentView === 'PAYROLL' && <PayrollView />}
        {currentView === 'DFE_AUDIT' && <DfeAuditView />}
        {currentView === 'SECURITY' && <SecurityLedgerView />}
        {currentView === 'REPORTS' && <ExecutiveReportsView />}
      </main>
    </div>
  );
};

export default App;
