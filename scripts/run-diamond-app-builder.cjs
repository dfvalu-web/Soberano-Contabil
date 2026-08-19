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
    cases += '          {currentModuleId === \'' + i.id + '\' && (\n';
    cases += '            <div className="view-content-wrapper" style={{ animation: \'fadeIn 0.25s ease-out\' }}>\n';
    cases += '              <' + i.file + ' />\n';
    cases += '            </div>\n';
    cases += '          )}\n';
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

    // Filter by Top Category Tab if not 'TODOS'
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
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-deep)', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>
      {/* ========================================================================= */}
      {/* SIDEBAR DIAMANTE ENTERPRISE                                              */}
      {/* ========================================================================= */}
      <aside style={{
        width: isSidebarOpen ? '320px' : '0px',
        minWidth: isSidebarOpen ? '320px' : '0px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #0D1322 0%, #080C16 100%)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '4px 0 24px rgba(0, 0, 0, 0.5)'
      }}>
        {/* Brand Header */}
        <div style={{
          padding: '20px 22px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #10B981, #06B6D4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.3rem',
              color: '#070B12',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
            }}>
              S
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                Soberano <span style={{ color: 'var(--emerald-400)' }}>ERP</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }}></span>
                181 Módulos • Diamante
              </div>
            </div>
          </div>
          <span style={{
            background: 'rgba(16, 185, 129, 0.12)',
            color: 'var(--emerald-400)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            padding: '3px 8px',
            borderRadius: '6px',
            fontSize: '0.68rem',
            fontWeight: 800
          }}>
            PRO
          </span>
        </div>

        {/* Global Search Filter & Quick Actions */}
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-medium)',
            borderRadius: '10px',
            padding: '8px 12px',
            gap: '10px',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
          }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>🔍</span>
            <input
              type="text"
              placeholder="Buscar entre os 181 módulos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '0.82rem',
                outline: 'none',
                width: '100%',
                fontWeight: 500
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

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            <span>Exibindo: <strong style={{ color: 'var(--emerald-400)' }}>{totalVisibleModules}</strong> módulos</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={expandAllCategories}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.72rem' }}
                title="Expandir todas as categorias"
              >
                Expandir
              </button>
              <span>•</span>
              <button
                onClick={collapseAllCategories}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.72rem' }}
                title="Recolher categorias"
              >
                Recolher
              </button>
            </div>
          </div>
        </div>

        {/* Categories & Modules List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filteredCategories.map((catGroup) => {
            const isCollapsed = !searchQuery && collapsedCategories[catGroup.category];
            return (
              <div key={catGroup.category} style={{
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.04)',
                background: 'rgba(255, 255, 255, 0.015)',
                overflow: 'hidden'
              }}>
                <button
                  onClick={() => toggleCategory(catGroup.category)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'transparent',
                    border: 'none',
                    color: '#E2E8F0',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    letterSpacing: '0.02em',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1rem' }}>{catGroup.icon}</span>
                    <span style={{ textAlign: 'left' }}>{catGroup.category}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      background: 'rgba(255, 255, 255, 0.06)',
                      color: 'var(--text-secondary)',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      fontSize: '0.7rem',
                      fontWeight: 700
                    }}>
                      {catGroup.items.length}
                    </span>
                    <span style={{ fontSize: '0.65rem', transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease', color: 'var(--text-muted)' }}>
                      ▼
                    </span>
                  </div>
                </button>

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
                            padding: '9px 12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            background: isActive ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.22), rgba(6, 182, 212, 0.12))' : 'transparent',
                            color: isActive ? '#34D399' : 'var(--text-secondary)',
                            fontWeight: isActive ? 700 : 500,
                            fontSize: '0.81rem',
                            borderLeft: isActive ? '3px solid #10B981' : '3px solid transparent',
                            borderTop: 'none',
                            borderRight: 'none',
                            borderBottom: 'none',
                            borderRadius: '0 6px 6px 0',
                            textAlign: 'left',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
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

        {/* Sidebar Footer Status */}
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid var(--border-subtle)',
          background: 'rgba(0, 0, 0, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981' }}></span>
              Core Engine :4000
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--emerald-400)' }}>437 Testes 100% Verdes</div>
          </div>
          <span style={{
            background: 'rgba(16, 185, 129, 0.1)',
            color: 'var(--emerald-400)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            padding: '3px 8px',
            borderRadius: '6px',
            fontSize: '0.68rem',
            fontWeight: 700
          }}>
            v4.2.0
          </span>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MAIN VIEWPORT                                                             */}
      {/* ========================================================================= */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100vh', overflowY: 'auto' }}>
        {/* Top Header Bar */}
        <header style={{
          background: 'rgba(17, 23, 38, 0.95)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '12px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          backdropFilter: 'blur(16px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35)'
        }}>
          {/* Left: Menu toggle + Current View Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <button
              onClick={() => setIsSidebarOpen(prev => !prev)}
              style={{
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-medium)',
                color: '#fff',
                padding: '8px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              <span>☰</span> {isSidebarOpen ? 'Recolher' : 'Módulos'}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>{activeModule.category}</span>
              <span style={{ color: 'var(--text-muted)' }}>/</span>
              <span style={{
                color: '#fff',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255, 255, 255, 0.04)',
                padding: '4px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.06)'
              }}>
                <span>{activeModule.icon}</span> {activeModule.label}
              </span>
            </div>
          </div>

          {/* Right: Tenant, Live Clock, Latency & 1-Click Action */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Live Clock & Latency */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'rgba(0, 0, 0, 0.25)',
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.76rem',
              color: 'var(--text-secondary)'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px #10B981' }}></span>
                ACID 4ms
              </span>
              <span style={{ color: 'var(--text-muted)' }}>|</span>
              <span className="font-mono" style={{ color: '#fff', fontWeight: 600 }}>{currentTime || '00:00:00'}</span>
            </div>

            {/* Tenant Selector Dropdown */}
            <div style={{
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-medium)',
              borderRadius: '10px',
              padding: '6px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
            }}>
              <span style={{ fontSize: '1.1rem' }}>🏢</span>
              <div>
                <select
                  value={selectedTenant}
                  onChange={(e) => setSelectedTenant(e.target.value)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="Soberano Tech S/A" style={{ background: '#111726', color: '#fff' }}>Soberano Tech S/A (Lucro Real)</option>
                  <option value="Drogaria Alvorada Ltda" style={{ background: '#111726', color: '#fff' }}>Drogaria Alvorada Ltda (Simples Nacional)</option>
                  <option value="Indústria Mecânica Progresso S/A" style={{ background: '#111726', color: '#fff' }}>Indústria Mecânica Progresso S/A (Lucro Real)</option>
                  <option value="Agropecuária Santa Luzia" style={{ background: '#111726', color: '#fff' }}>Agropecuária Santa Luzia (Lucro Presumido)</option>
                </select>
                <div style={{ fontSize: '0.68rem', color: 'var(--emerald-400)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>CNPJ 12.345.678/0001-90</span>
                  <span>•</span>
                  <span>🟢 CND 100% REGULAR</span>
                </div>
              </div>
            </div>

            {/* 1-Click Master Action */}
            <button
              onClick={() => setCurrentModuleId('office_batch_dispatch_bundle')}
              className="btn-diamond-primary"
              style={{ padding: '8px 16px', fontSize: '0.82rem' }}
            >
              <span>🚀</span> 1-Click Fechamento
            </button>
          </div>
        </header>

        {/* Quick Strategic Filter Pill Tabs (Never hides any category) */}
        <div style={{
          background: 'rgba(13, 19, 34, 0.8)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '10px 28px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          overflowX: 'auto',
          backdropFilter: 'blur(10px)'
        }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginRight: '4px' }}>
            Navegação:
          </span>
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
                style={{
                  background: isSelected ? 'var(--emerald-500)' : 'var(--bg-surface-elevated)',
                  color: isSelected ? '#070B12' : 'var(--text-secondary)',
                  border: isSelected ? '1px solid var(--emerald-400)' : '1px solid var(--border-subtle)',
                  borderRadius: '20px',
                  padding: '5px 14px',
                  fontSize: '0.76rem',
                  fontWeight: isSelected ? 800 : 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? '0 0 12px rgba(16, 185, 129, 0.35)' : 'none'
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Executive Shortcuts Toolbar */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.015)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '8px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.78rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Atalhos Rápidos:</span>
            <button
              onClick={() => setCurrentModuleId('office_multi_client_grid')}
              style={{ background: 'transparent', border: 'none', color: 'var(--emerald-400)', cursor: 'pointer', fontWeight: 600 }}
            >
              🚦 Grade Multi-Empresa
            </button>
            <span style={{ color: 'var(--text-muted)' }}>•</span>
            <button
              onClick={() => setCurrentModuleId('office_universal_dropzone_ocr')}
              style={{ background: 'transparent', border: 'none', color: 'var(--cyan-400)', cursor: 'pointer', fontWeight: 600 }}
            >
              📂 Dropzone Massivo OCR
            </button>
            <span style={{ color: 'var(--text-muted)' }}>•</span>
            <button
              onClick={() => setCurrentModuleId('payroll')}
              style={{ background: 'transparent', border: 'none', color: '#E2E8F0', cursor: 'pointer', fontWeight: 600 }}
            >
              👥 Folha DP
            </button>
            <span style={{ color: 'var(--text-muted)' }}>•</span>
            <button
              onClick={() => setCurrentModuleId('tax')}
              style={{ background: 'transparent', border: 'none', color: '#E2E8F0', cursor: 'pointer', fontWeight: 600 }}
            >
              ⚖️ Simulador Tributário
            </button>
            <span style={{ color: 'var(--text-muted)' }}>•</span>
            <button
              onClick={() => setCurrentModuleId('office_annual_closing_are')}
              style={{ background: 'transparent', border: 'none', color: '#E2E8F0', cursor: 'pointer', fontWeight: 600 }}
            >
              📚 ARE 1-Click
            </button>
            <span style={{ color: 'var(--text-muted)' }}>•</span>
            <button
              onClick={() => setCurrentModuleId('sped')}
              style={{ background: 'transparent', border: 'none', color: '#E2E8F0', cursor: 'pointer', fontWeight: 600 }}
            >
              📄 Suíte SPED
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Status da Empresa:</span>
            <span className="badge-pill badge-emerald">🟢 100% EM CONFORMIDADE</span>
          </div>
        </div>

        {/* View Main Content Workspace */}
        <main style={{
          flex: 1,
          padding: '24px 32px 60px 32px',
          maxWidth: '1800px',
          width: '100%',
          margin: '0 auto'
        }}>
${cases}
        </main>
      </div>
    </div>
  );
};

export default App;
`;

fs.writeFileSync('packages/web/src/App.tsx', code, 'utf8');
console.log('App.tsx updated with Diamond-Tier Design System and Quick Category Bar!');
