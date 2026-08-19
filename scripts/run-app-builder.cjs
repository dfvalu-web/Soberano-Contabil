const fs = require('fs');

const p1 = JSON.parse(fs.readFileSync('scripts/cat-part1.json', 'utf8'));
const p2 = JSON.parse(fs.readFileSync('scripts/cat-part2.json', 'utf8'));
const p3 = JSON.parse(fs.readFileSync('scripts/cat-part3.json', 'utf8'));
const all = [...p1, ...p2, ...p3];

let imports = 'import React, { useState, useMemo } from \'react\';\n';
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
  const [collapsedCategories, setCollapsedCategories] = useState<{ [key: string]: boolean }>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  const toggleCategory = (catName: string) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [catName]: !prev[catName]
    }));
  };

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return CATEGORIES;
    const query = searchQuery.toLowerCase();

    return CATEGORIES.map(cat => {
      const matchedItems = cat.items.filter(
        item => item.label.toLowerCase().includes(query) || item.id.toLowerCase().includes(query) || cat.category.toLowerCase().includes(query)
      );
      return {
        ...cat,
        items: matchedItems
      };
    }).filter(cat => cat.items.length > 0);
  }, [searchQuery]);

  const activeModule = useMemo(() => {
    for (const cat of CATEGORIES) {
      const found = cat.items.find(i => i.id === currentModuleId);
      if (found) return { ...found, category: cat.category };
    }
    return { id: 'office_multi_client_grid', label: 'Cockpit Multi-Empresa Grade', icon: '🚦', file: 'OfficeMultiClientClosingGridView', category: 'Cockpit & Gestão Executiva' };
  }, [currentModuleId]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>
      {/* SIDEBAR ENTERPRISE */}
      <aside style={{
        width: isSidebarOpen ? '320px' : '0px',
        minWidth: isSidebarOpen ? '320px' : '0px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        {/* Sidebar Brand Header */}
        <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-surface-elevated)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #10B981, #06B6D4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.2rem',
              color: '#fff',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.35)'
            }}>
              S
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#fff', letterSpacing: '-0.02em' }}>
                Soberano Contábil
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--emerald-400)', fontWeight: 700 }}>
                181 MÓDULOS • ENTERPRISE ERP
              </div>
            </div>
          </div>
        </div>

        {/* Global Search Filter */}
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '8px 12px',
            gap: '8px'
          }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>🔍</span>
            <input
              type="text"
              placeholder="Filtrar 181 módulos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '0.82rem',
                outline: 'none',
                width: '100%'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Categories & Modules Navigation List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filteredCategories.map((catGroup) => {
            const isCollapsed = !searchQuery && collapsedCategories[catGroup.category];
            return (
              <div key={catGroup.category} style={{ borderRadius: '8px', overflow: 'hidden', background: 'rgba(255, 255, 255, 0.015)' }}>
                {/* Category Header Button */}
                <button
                  onClick={() => toggleCategory(catGroup.category)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{catGroup.icon}</span>
                    <span>{catGroup.category}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      padding: '2px 6px',
                      borderRadius: '10px',
                      fontSize: '0.7rem',
                      color: 'var(--text-muted)'
                    }}>
                      {catGroup.items.length}
                    </span>
                    <span style={{ fontSize: '0.65rem', transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}>
                      ▼
                    </span>
                  </div>
                </button>

                {/* Sub-items */}
                {!isCollapsed && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', padding: '4px 6px 8px 6px' }}>
                    {catGroup.items.map((item) => {
                      const isActive = currentModuleId === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setCurrentModuleId(item.id)}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            background: isActive ? 'var(--emerald-500)' : 'transparent',
                            color: isActive ? '#0B0F17' : 'var(--text-secondary)',
                            fontWeight: isActive ? 700 : 500,
                            fontSize: '0.82rem',
                            border: 'none',
                            borderRadius: '6px',
                            textAlign: 'left',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            boxShadow: isActive ? '0 2px 10px rgba(16, 185, 129, 0.3)' : 'none'
                          }}
                        >
                          <span style={{ fontSize: '0.95rem' }}>{item.icon}</span>
                          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer Info */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-surface-elevated)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>Soberano Core :4000</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--emerald-400)' }}>437 Testes 100% Verdes</div>
          </div>
          <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700 }}>
            v4.1.10
          </span>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100vh', overflowY: 'auto' }}>
        {/* TOP NAVBAR */}
        <header style={{
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          backdropFilter: 'blur(12px)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => setIsSidebarOpen(prev => !prev)}
              style={{
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
                padding: '6px 10px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 600
              }}
            >
              ☰ Menu
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>{activeModule.category}</span>
              <span style={{ color: 'var(--text-muted)' }}>/</span>
              <span style={{ color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>{activeModule.icon}</span> {activeModule.label}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Empresa / Tenant Selector */}
            <div style={{
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '6px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span style={{ fontSize: '0.9rem' }}>🏢</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#fff' }}>Soberano Tech S/A</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--emerald-400)' }}>CNPJ 12.345.678/0001-90 • Lucro Real</div>
              </div>
              <span style={{ background: '#10b98120', color: '#10b981', padding: '2px 8px', borderRadius: '12px', fontSize: '0.68rem', fontWeight: 700 }}>
                CND VÁLIDA
              </span>
            </div>

            {/* Quick 1-Click Action */}
            <button
              onClick={() => setCurrentModuleId('office_batch_dispatch_bundle')}
              style={{
                background: 'linear-gradient(135deg, #10B981, #06B6D4)',
                border: 'none',
                color: '#fff',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
              }}
            >
              <span>🚀</span> 1-Click Fechamento
            </button>
          </div>
        </header>

        {/* MAIN VIEW CONTENT CONTAINER */}
        <main style={{ flex: 1, padding: '28px 32px' }}>
${cases}
        </main>
      </div>
    </div>
  );
};

export default App;
`;

fs.writeFileSync('packages/web/src/App.tsx', code, 'utf8');
console.log('Successfully wrote App.tsx with 181 modules and ERP sidebar!');
