const fs = require('fs');

const allCategories = JSON.parse(fs.readFileSync('scripts/core-and-advanced-categories.json', 'utf8'));

let imports = 'import React, { useState, useMemo, useEffect } from \'react\';\n';
const unique = new Set();
allCategories.forEach(c => c.items.forEach(i => unique.add(i.file)));
unique.forEach(f => {
  imports += 'import { ' + f + ' } from \'./views/' + f + '.js\';\n';
});

let cases = '';
allCategories.forEach(c => {
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
  isCore?: boolean;
  tag?: string;
  items: ModuleItem[];
}

const CATEGORIES: CategoryGroup[] = ${JSON.stringify(allCategories, null, 2)};

export const App: React.FC = () => {
  const [currentModuleId, setCurrentModuleId] = useState<string>('office_multi_client_grid');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('CORE');
  const [collapsedCategories, setCollapsedCategories] = useState<{ [key: string]: boolean }>({
    'Módulos Setoriais & Especiais (Sob Demanda)': true
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isRightDeckOpen, setIsRightDeckOpen] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [selectedTenant, setSelectedTenant] = useState<string>('Soberano Tech S/A');
  const [selectedCompetencia, setSelectedCompetencia] = useState<string>('08/2026');

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

    if (selectedCategoryTab === 'CORE') {
      list = list.filter(cat => cat.isCore);
    } else if (selectedCategoryTab !== 'TODOS') {
      list = list.filter(cat => 
        (cat.tag && cat.tag === selectedCategoryTab) ||
        cat.category.toLowerCase().includes(selectedCategoryTab.toLowerCase())
      );
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
    return { id: 'office_multi_client_grid', label: 'Cockpit Multi-Empresa em Grade', icon: '🚦', file: 'OfficeMultiClientClosingGridView', category: 'Gestão & Produtividade do Escritório' };
  }, [currentModuleId]);

  return (
    <div className="app-container">
      {/* ========================================================================= */}
      {/* 1. TOPBAR GLOBAL CORPORATIVA (HEADER PRINCIPAL)                          */}
      {/* ========================================================================= */}
      <header className="app-topbar-global">
        {/* Esquerda: Logo + Botão Menu + Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={() => setIsSidebarOpen(prev => !prev)}
            style={{
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              color: '#fff',
              padding: '6px 10px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.82rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>☰</span> {isSidebarOpen ? 'Recolher' : 'Menu'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #10B981, #06B6D4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1rem',
              color: '#070B12',
              boxShadow: '0 0 12px rgba(16, 185, 129, 0.35)'
            }}>
              S
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#fff', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                Soberano <span style={{ color: 'var(--emerald-400)' }}>ERP</span>
                <span style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: 'var(--emerald-400)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '1px 6px',
                  borderRadius: '4px',
                  fontSize: '0.62rem',
                  fontWeight: 800
                }}>
                  MASTER
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', marginLeft: '8px' }}>
            <span style={{ color: 'var(--text-muted)' }}>/</span>
            <span style={{ color: 'var(--text-secondary)' }}>{activeModule.category}</span>
            <span style={{ color: 'var(--text-muted)' }}>/</span>
            <span style={{
              color: '#fff',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '3px 8px',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <span>{activeModule.icon}</span> {activeModule.label}
            </span>
          </div>
        </div>

        {/* Centro: Competência + Status Conexões Gov */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Seletor de Competência */}
          <div style={{
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '6px',
            padding: '4px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.75rem'
          }}>
            <span style={{ color: 'var(--text-muted)' }}>📅 Mês:</span>
            <select
              value={selectedCompetencia}
              onChange={(e) => setSelectedCompetencia(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--emerald-400)',
                fontWeight: 800,
                fontSize: '0.78rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="08/2026" style={{ background: '#111726', color: '#fff' }}>Agosto / 2026 (Aberto)</option>
              <option value="07/2026" style={{ background: '#111726', color: '#fff' }}>Julho / 2026 (Fechado)</option>
              <option value="06/2026" style={{ background: '#111726', color: '#fff' }}>Junho / 2026 (Fechado)</option>
              <option value="2026" style={{ background: '#111726', color: '#fff' }}>Exercício 2026 Completo</option>
            </select>
          </div>

          {/* Status Gov Live */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.7rem' }}>
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: 'rgba(16, 185, 129, 0.1)',
              color: 'var(--emerald-400)',
              padding: '3px 8px',
              borderRadius: '4px',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              fontWeight: 700
            }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10B981' }}></span>
              SEFAZ Online
            </span>
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: 'rgba(6, 182, 212, 0.1)',
              color: 'var(--cyan-400)',
              padding: '3px 8px',
              borderRadius: '4px',
              border: '1px solid rgba(6, 182, 212, 0.25)',
              fontWeight: 700
            }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#06B6D4' }}></span>
              eSocial Conectado
            </span>
          </div>
        </div>

        {/* Direita: Empresa Ativa + 1-Click Fechamento + Toggle Copiloto Deck */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Seletor de Tenant */}
          <div style={{
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-medium)',
            borderRadius: '8px',
            padding: '4px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '0.9rem' }}>🏢</span>
            <div>
              <select
                value={selectedTenant}
                onChange={(e) => setSelectedTenant(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="Soberano Tech S/A" style={{ background: '#111726', color: '#fff' }}>Soberano Tech S/A (Lucro Real)</option>
                <option value="Drogaria Alvorada Ltda" style={{ background: '#111726', color: '#fff' }}>Drogaria Alvorada Ltda (Comércio • Simples)</option>
                <option value="Indústria Metalúrgica Alpha S/A" style={{ background: '#111726', color: '#fff' }}>Indústria Metalúrgica Alpha (Lucro Real)</option>
                <option value="Clínica Médica & Serviços Ltda" style={{ background: '#111726', color: '#fff' }}>Clínica Médica & Serviços (Presumido)</option>
              </select>
            </div>
            <span style={{
              background: 'rgba(16, 185, 129, 0.15)',
              color: 'var(--emerald-400)',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '0.65rem',
              fontWeight: 800
            }}>
              CND OK
            </span>
          </div>

          {/* Botão 1-Click */}
          <button
            onClick={() => setCurrentModuleId('office_batch_dispatch_bundle')}
            className="btn-primary-action"
          >
            <span>🚀</span> 1-Click Fechamento
          </button>

          {/* Toggle Painel Direito */}
          <button
            onClick={() => setIsRightDeckOpen(prev => !prev)}
            style={{
              background: isRightDeckOpen ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.1))' : 'var(--bg-surface-elevated)',
              border: isRightDeckOpen ? '1px solid var(--emerald-500)' : '1px solid var(--border-subtle)',
              color: isRightDeckOpen ? 'var(--emerald-400)' : '#fff',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            <span>🤖</span> {isRightDeckOpen ? 'Ocultar Copiloto' : 'Copiloto & Ações'}
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* CORPO PRINCIPAL COM 3 COLUNAS (SIDEBAR + WORKSPACE + RIGHT DECK)          */}
      {/* ========================================================================= */}
      <div className="app-body-layout">
        {/* ======================================================================= */}
        {/* 2. SIDEBAR ESQUERDA (NAVEGAÇÃO CATEGORIZADA CORE)                       */}
        {/* ======================================================================= */}
        <aside className={\`app-sidebar-left \${isSidebarOpen ? '' : 'collapsed'}\`}>
          {/* Busca & Contador */}
          <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(0, 0, 0, 0.15)' }}>
            <div className="sidebar-search-box">
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>🔍</span>
              <input
                type="text"
                placeholder="Buscar módulo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '0.8rem', outline: 'none', width: '100%' }}
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

          {/* Lista de Categorias e Módulos */}
          <div className="sidebar-nav-scroll">
            {filteredCategories.map((catGroup) => {
              const isCollapsed = !searchQuery && collapsedCategories[catGroup.category];
              return (
                <div key={catGroup.category} className="category-card" style={{
                  borderLeft: catGroup.isCore ? '3px solid rgba(16, 185, 129, 0.4)' : '3px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <button onClick={() => toggleCategory(catGroup.category)} className="category-btn">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>{catGroup.icon}</span>
                      <span style={{ textAlign: 'left' }}>{catGroup.category}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{
                        background: catGroup.isCore ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                        color: catGroup.isCore ? 'var(--emerald-400)' : 'var(--text-secondary)',
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

          {/* Footer Sidebar */}
          <div style={{
            height: '48px',
            minHeight: '48px',
            padding: '0 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid var(--border-subtle)',
            background: 'rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
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

        {/* ======================================================================= */}
        {/* 3. WORKSPACE CENTRAL (CANVAS PRINCIPAL DO MÓDULO)                       */}
        {/* ======================================================================= */}
        <main className="app-center-workspace">
          {/* Barra de Filtro Estratégico de Abas */}
          <div className="category-filter-bar">
            {[
              { id: 'CORE', label: '💎 Core Escritório (68)', icon: '🏛️' },
              { id: 'ESCRITORIO', label: '📊 Gestão & Produtividade (10)', icon: '⚡' },
              { id: 'COMERCIO', label: '🏪 Comércio & Varejo (8)', icon: '📦' },
              { id: 'INDUSTRIA', label: '🏭 Indústria & Manufatura (7)', icon: '⚙️' },
              { id: 'SERVICOS', label: '💼 Serviços & PJ (8)', icon: '💼' },
              { id: 'DP', label: '👥 Folha DP & eSocial (12)', icon: '👥' },
              { id: 'CONTABIL', label: '📚 Contabilidade & SPED (9)', icon: '📚' },
              { id: 'SOCIETARIO', label: '🏛️ Societário & CNDs (8)', icon: '📜' },
              { id: 'TODOS', label: '🌐 Todos os 181 Módulos', icon: '💎' }
            ].map(tab => {
              const isSelected = selectedCategoryTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setSelectedCategoryTab(tab.id);
                    if (tab.id === 'CORE' || tab.id === 'TODOS') setSearchQuery('');
                  }}
                  className={\`category-filter-pill \${isSelected ? 'active' : ''}\`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Renderização do Módulo Ativo */}
          <div className="view-card-container">
${cases}
          </div>
        </main>

        {/* ======================================================================= */}
        {/* 4. PAINEL LATERAL DIREITO (COPILOTO IA & COCKPIT DE AÇÕES IMEDIATAS)     */}
        {/* ======================================================================= */}
        <aside className={\`app-right-deck \${isRightDeckOpen ? '' : 'collapsed'}\`}>
          {/* Header do Deck Direito */}
          <div className="right-deck-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '0.82rem', color: '#fff' }}>
              <span>🤖</span> Copiloto & Inteligência IA
            </div>
            <button
              onClick={() => setIsRightDeckOpen(false)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem' }}
              title="Fechar painel"
            >
              ✕
            </button>
          </div>

          {/* Conteúdo Rolável do Deck Direito */}
          <div className="right-deck-scroll">
            {/* 1. Semáforo em Tempo Real da Empresa Ativa */}
            <div className="deck-card">
              <div className="deck-card-title">
                <span>🚦 Semáforo de Fechamento</span>
                <span style={{ color: 'var(--emerald-400)', fontSize: '0.7rem' }}>{selectedCompetencia}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.76rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>👥 Folha DP / eSocial:</span>
                  <span style={{ color: 'var(--emerald-400)', fontWeight: 700 }}>🟢 100% Transmitida</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>⚖️ Fiscal / DAS & DARFs:</span>
                  <span style={{ color: 'var(--amber-400)', fontWeight: 700 }}>🟡 Calculado (Pendente Disparo)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>📚 Contábil / ARE Balancete:</span>
                  <span style={{ color: 'var(--emerald-400)', fontWeight: 700 }}>🟢 D=C Zero Dif (ACID)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>📜 CNDs Fed/Est/Mun:</span>
                  <span style={{ color: 'var(--emerald-400)', fontWeight: 700 }}>🟢 Todas Válidas</span>
                </div>
              </div>
            </div>

            {/* 2. Dicas & Insights do Copiloto Contábil IA */}
            <div className="deck-card" style={{ borderLeft: '3px solid #06B6D4' }}>
              <div className="deck-card-title">
                <span>💡 Diagnóstico Forense IA</span>
                <span style={{ color: 'var(--cyan-400)' }}>Ativo</span>
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                <p style={{ marginBottom: '6px' }}>
                  📌 <strong>Oportunidade Tributária:</strong> Esta empresa possui produtos com NCM monofásico que podem reduzir o DAS em até <strong style={{ color: 'var(--emerald-400)' }}>34%</strong>.
                </p>
                <p>
                  🛡️ <strong>Alerta Preventivo:</strong> Divergência zero detectada entre NF-e de entrada e extrato bancário DDA.
                </p>
              </div>
              <button
                onClick={() => setCurrentModuleId('office_monophasic_tax')}
                style={{
                  background: 'rgba(6, 182, 212, 0.15)',
                  color: 'var(--cyan-400)',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  marginTop: '4px'
                }}
              >
                🔍 Otimizar Tributos Agora
              </button>
            </div>

            {/* 3. Ações Rápidas de 1-Click */}
            <div className="deck-card">
              <div className="deck-card-title">
                <span>⚡ Ações Rápidas 1-Click</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <button
                  onClick={() => setCurrentModuleId('office_batch_dispatch_bundle')}
                  className="btn-deck-action"
                >
                  <span>🚀 Disparo Lote WhatsApp/Pix</span>
                  <span>➔</span>
                </button>
                <button
                  onClick={() => setCurrentModuleId('office_universal_dropzone_ocr')}
                  className="btn-deck-action"
                >
                  <span>📂 Arraste OCR Massivo</span>
                  <span>➔</span>
                </button>
                <button
                  onClick={() => setCurrentModuleId('office_sped_batch_prevalidator')}
                  className="btn-deck-action"
                >
                  <span>🔍 Pré-Validar SPED em Lote</span>
                  <span>➔</span>
                </button>
                <button
                  onClick={() => setCurrentModuleId('office_annual_closing_are')}
                  className="btn-deck-action"
                >
                  <span>🏁 Encerramento ARE 1-Click</span>
                  <span>➔</span>
                </button>
              </div>
            </div>

            {/* 4. Protocolos Digitais & Trilha de Auditoria */}
            <div className="deck-card">
              <div className="deck-card-title">
                <span>🔒 Protocolos Digitais (SHA-256)</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.7rem' }}>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '6px 8px', borderRadius: '4px' }}>
                  <div style={{ color: '#fff', fontWeight: 600 }}>Fechamento Folha {selectedCompetencia}</div>
                  <div className="font-mono" style={{ color: 'var(--text-muted)', fontSize: '0.64rem' }}>HASH: 8f9b2a...3c41</div>
                  <div style={{ color: 'var(--emerald-400)', fontSize: '0.65rem' }}>Assinado ICP-Brasil • 100% Válido</div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '6px 8px', borderRadius: '4px' }}>
                  <div style={{ color: '#fff', fontWeight: 600 }}>Pacote Guias DAS Disparado</div>
                  <div className="font-mono" style={{ color: 'var(--text-muted)', fontSize: '0.64rem' }}>HASH: 4e71a0...99f2</div>
                  <div style={{ color: 'var(--emerald-400)', fontSize: '0.65rem' }}>Entrega Comprovada WhatsApp</div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default App;
`;

fs.writeFileSync('packages/web/src/App.tsx', code, 'utf8');
console.log('App.tsx written with complete 3-Zone Architecture!');
