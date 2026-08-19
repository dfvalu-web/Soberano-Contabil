const fs = require('fs');

const p1 = JSON.parse(fs.readFileSync('scripts/cat-part1.json', 'utf8'));
const p2 = JSON.parse(fs.readFileSync('scripts/cat-part2.json', 'utf8'));
const p3 = JSON.parse(fs.readFileSync('scripts/cat-part3.json', 'utf8'));
const all = [...p1, ...p2, ...p3];

let imports = 'import React, { useState, useMemo, useEffect } from \'react\';\n';
const unique = new Set();
all.forEach(c => c.items.forEach(i => unique.add(i.file)));
unique.forEach(f => {
  imports += 'import { ' + f + ' } from \'./views/' + f + '.js\';\n';
});

let cases = '';
all.forEach(c => {
  c.items.forEach(i => {
    cases += '          {currentModuleId === \'' + i.id + '\' && <' + i.file + ' />}\n';
  });
});

const code = `${imports}
export interface ModuleItem {
  id: string;
  label: string;
  icon: string;
  file: string;
}

export interface CategoryGroup {
  category: string;
  icon: string;
  items: ModuleItem[];
}

const CATEGORIES: CategoryGroup[] = ${JSON.stringify(all, null, 2)};

export const App: React.FC = () => {
  const [currentModuleId, setCurrentModuleId] = useState<string>('office_multi_client_grid');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('TODOS');
  const [collapsedCategories, setCollapsedCategories] = useState<{ [key: string]: boolean }>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [selectedTenant, setSelectedTenant] = useState<string>('Soberano Tech S/A');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleCategory = (catName: string) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [catName]: !prev[catName]
    }));
  };

  const expandAllCategories = () => {
    setCollapsedCategories({});
  };

  const collapseAllCategories = () => {
    const collapsed: { [key: string]: boolean } = {};
    CATEGORIES.forEach(c => { collapsed[c.category] = true; });
    setCollapsedCategories(collapsed);
  };

  const filteredCategories = useMemo(() => {
    let list = CATEGORIES;

    if (selectedCategoryTab !== 'TODOS') {
      list = list.filter(cat => cat.category.toLowerCase().includes(selectedCategoryTab.toLowerCase()));
    }

    if (!searchQuery.trim()) return list;
    const query = searchQuery.toLowerCase();

    return list.map(cat => {
      const matchedItems = cat.items.filter(
        item => item.label.toLowerCase().includes(query) || item.id.toLowerCase().includes(query) || cat.category.toLowerCase().includes(query)
      );
      return {
        ...cat,
        items: matchedItems
      };
    }).filter(cat => cat.items.length > 0);
  }, [searchQuery, selectedCategoryTab]);

  const totalVisibleModules = useMemo(() => {
    return filteredCategories.reduce((acc, cat) => acc + cat.items.length, 0);
  }, [filteredCategories]);

  const activeModule = useMemo(() => {
    for (const cat of CATEGORIES) {
      const found = cat.items.find(i => i.id === currentModuleId);
      if (found) return { ...found, category: cat.category };
    }
    return { id: 'office_multi_client_grid', label: 'Cockpit Multi-Empresa Grade', icon: '🚦', file: 'OfficeMultiClientClosingGridView', category: 'Cockpit & Gestão Executiva' };
  }, [currentModuleId]);

  return (
    <div className="app-shell">
      {/* SIDEBAR */}
      <aside className={\`app-sidebar \${isSidebarOpen ? '' : 'collapsed'}\`}>
        {/* Brand Header */}
        <div className="sidebar-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #10B981, #06B6D4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.1rem',
              color: '#070B12'
            }}>
              S
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff', letterSpacing: '-0.02em' }}>
                Soberano <span style={{ color: 'var(--emerald-400)' }}>ERP</span>
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                181 Módulos Ativos
              </div>
            </div>
          </div>
          <span style={{
            background: 'rgba(16, 185, 129, 0.12)',
            color: 'var(--emerald-400)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '0.65rem',
            fontWeight: 800
          }}>
            PRO
          </span>
        </div>

        {/* Search & Counter */}
        <div className="sidebar-search">
          <div className="sidebar-search-box">
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>🔍</span>
            <input
              type="text"
              placeholder="Filtrar 181 módulos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="sidebar-search-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.75rem' }}
              >
                ✕
              </button>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            <span>Visíveis: <strong style={{ color: 'var(--emerald-400)' }}>{totalVisibleModules}</strong></span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={expandAllCategories} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.7rem' }}>
                Expandir
              </button>
              <span>•</span>
              <button onClick={collapseAllCategories} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.7rem' }}>
                Recolher
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tree */}
        <div className="sidebar-nav-list">
          {filteredCategories.map((catGroup) => {
            const isCollapsed = !searchQuery && collapsedCategories[catGroup.category];
            return (
              <div key={catGroup.category} className="category-card">
                <button onClick={() => toggleCategory(catGroup.category)} className="category-btn">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{catGroup.icon}</span>
                    <span style={{ textAlign: 'left' }}>{catGroup.category}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      color: 'var(--text-secondary)',
                      padding: '1px 6px',
                      borderRadius: '10px',
                      fontSize: '0.68rem',
                      fontWeight: 700
                    }}>
                      {catGroup.items.length}
                    </span>
                    <span style={{ fontSize: '0.6rem', transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease', color: 'var(--text-muted)' }}>
                      ▼
                    </span>
                  </div>
                </button>

                {!isCollapsed && (
                  <div style={{ display: 'flex', flexDirection: 'column', padding: '2px 0 6px 0' }}>
                    {catGroup.items.map((item) => {
                      const isActive = currentModuleId === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setCurrentModuleId(item.id)}
                          className={\`module-item-btn \${isActive ? 'active' : ''}\`}
                        >
                          <span style={{ fontSize: '0.9rem' }}>{item.icon}</span>
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="sidebar-footer">
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }}></span>
            Core :4000
          </div>
          <span style={{
            background: 'rgba(16, 185, 129, 0.1)',
            color: 'var(--emerald-400)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '0.65rem',
            fontWeight: 700
          }}>
            437 Testes 100%
          </span>
        </div>
      </aside>

      {/* MAIN VIEW */}
      <div className="app-main">
        {/* Top Navbar (Fixed 64px, zero clashing) */}
        <header className="app-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button onClick={() => setIsSidebarOpen(prev => !prev)} className="btn-toggle-menu">
              <span>☰</span> {isSidebarOpen ? 'Recolher' : 'Menu'}
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>{activeModule.category}</span>
              <span style={{ color: 'var(--text-muted)' }}>/</span>
              <span style={{
                color: '#fff',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '4px 10px',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <span>{activeModule.icon}</span> {activeModule.label}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Clock */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(0, 0, 0, 0.25)',
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.74rem',
              color: 'var(--text-secondary)'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }}></span>
                ACID 4ms
              </span>
              <span style={{ color: 'var(--text-muted)' }}>|</span>
              <span className="font-mono" style={{ color: '#fff', fontWeight: 600 }}>{currentTime || '00:00:00'}</span>
            </div>

            {/* Tenant Selector */}
            <div style={{
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-medium)',
              borderRadius: '8px',
              padding: '5px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ fontSize: '0.95rem' }}>🏢</span>
              <select
                value={selectedTenant}
                onChange={(e) => setSelectedTenant(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.79rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="Soberano Tech S/A" style={{ background: '#111726', color: '#fff' }}>Soberano Tech S/A (Lucro Real)</option>
                <option value="Drogaria Alvorada Ltda" style={{ background: '#111726', color: '#fff' }}>Drogaria Alvorada Ltda (Simples)</option>
                <option value="Indústria Mecânica Progresso S/A" style={{ background: '#111726', color: '#fff' }}>Indústria Mecânica Progresso (Lucro Real)</option>
                <option value="Agropecuária Santa Luzia" style={{ background: '#111726', color: '#fff' }}>Agropecuária Santa Luzia (Presumido)</option>
              </select>
            </div>

            {/* 1-Click Action */}
            <button onClick={() => setCurrentModuleId('office_batch_dispatch_bundle')} className="btn-primary-action">
              <span>🚀</span> 1-Click Fechamento
            </button>
          </div>
        </header>

        {/* Content Workspace (Single Scroll Engine) */}
        <main className="app-content">
          {/* Strategic Navigation Pills */}
          <div className="category-filter-bar">
            {[
              { id: 'TODOS', label: 'Todos (181)', icon: '💎' },
              { id: 'Cockpit & Gestão Executiva', label: 'Executivo (12)', icon: '📊' },
              { id: 'Produtividade 1-Click', label: '1-Click & Automações (9)', icon: '⚡' },
              { id: 'Departamento Pessoal', label: 'DP / RH & eSocial (18)', icon: '👥' },
              { id: 'Fiscal', label: 'Fiscal & Tributário (22)', icon: '⚖️' },
              { id: 'Contabilidade', label: 'Contabilidade & IFRS (14)', icon: '📚' },
              { id: 'Suíte SPED', label: 'SPED & DF-e (9)', icon: '📑' },
              { id: 'Societário', label: 'Societário & Advisory (11)', icon: '🏛️' },
              { id: 'Segurança', label: 'Segurança & HSM (12)', icon: '🛡️' },
              { id: 'Setoriais', label: 'Setoriais & Agro (74)', icon: '🌐' }
            ].map(tab => {
              const isSelected = selectedCategoryTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setSelectedCategoryTab(tab.id);
                    if (tab.id === 'TODOS') setSearchQuery('');
                  }}
                  className={\`category-filter-pill \${isSelected ? 'active' : ''}\`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active View Container */}
          <div className="view-wrapper">
${cases}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
`;

fs.writeFileSync('packages/web/src/App.tsx', code, 'utf8');
console.log('App.tsx written with clean non-overlapping layout.');
