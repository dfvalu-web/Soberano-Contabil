function normalizeText(text: string): string {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

﻿/**
 * SOBERANO CONTÁBIL — PLATINUM SUITE ENTERPRISE v4.5
 * Componente Modular de Navegação Departamental & Inteligência Setorial por CNAE
 * Padrão Visual Diamond Champion: 100% Alinhado, Rolagem Fluida Garantida e Acesso a Todos os 181 Módulos
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  DepartmentCategory,
  NavigationModule,
  DepartmentId,
  DEPARTMENT_CATEGORIES,
  ALL_MODULES,
  DEFAULT_FAVORITE_MODULE_IDS,
  getModuleById
} from '../config/navigation-modules';
import { CompanyTenant } from '../state/office-store';
import {
  matchSectorProfile,
  isModuleRecommendedForTenant,
  getRecommendedModulesForTenant
} from '../config/cnae-sector-matcher';
import {
  Search,
  X,
  ChevronDown,
  ChevronRight,
  Star,
  Sparkles,
  Layers,
  Building2,
  Users,
  Scale,
  BookOpen,
  Globe,
  ChevronsDown,
  ChevronsUp,
  ShieldCheck,
  CheckCircle2,
  Target
} from 'lucide-react';

export type QuickFilterTab = 'todos' | 'cnae' | 'core' | 'dp' | 'fiscal' | 'contabil' | 'setoriais';

export interface SidebarNavigationProps {
  currentModuleId: string;
  onSelectModule: (moduleId: string) => void;
  tenant?: CompanyTenant | null;
  className?: string;
  activeFilter?: QuickFilterTab;
  onFilterChange?: (filter: QuickFilterTab) => void;
}

const STORAGE_FAVORITES_KEY = 'soberano_favorite_modules';

/**
 * Real-time text match highlighting component
 */
function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query || !query.trim()) {
    return <span>{text}</span>;
  }
  const cleanQuery = query.trim();
  const escaped = cleanQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp('(' + escaped + ')', 'gi');
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === cleanQuery.toLowerCase() ? (
          <mark
            key={i}
            style={{
              background: 'rgba(245, 158, 11, 0.25)',
              color: '#FBBF24',
              borderRadius: '4px',
              padding: '1px 4px',
              fontWeight: 800
            }}
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  currentModuleId,
  onSelectModule,
  tenant,
  className = '',
  activeFilter: controlledActiveFilter,
  onFilterChange: controlledOnFilterChange
}) => {
  // 1. Search Query State
  const [searchQuery, setSearchQuery] = useState('');

  // 2. Quick Filter Tab State (Controlled or Uncontrolled)
  const [internalActiveFilter, setInternalActiveFilter] = useState<QuickFilterTab>('todos');
  const activeFilter = controlledActiveFilter !== undefined ? controlledActiveFilter : internalActiveFilter;
  const setActiveFilter = (filter: QuickFilterTab) => {
    setInternalActiveFilter(filter);
    if (controlledOnFilterChange) {
      controlledOnFilterChange(filter);
    }
  };

  // 3. Matched Sector Profile for active tenant
  const activeSectorProfile = useMemo(() => matchSectorProfile(tenant), [tenant]);
  const recommendedCount = useMemo(() => {
    return getRecommendedModulesForTenant(tenant).length;
  }, [tenant]);

  // 4. Pinned / Favorite Routines State with localStorage persistence
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_FAVORITES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return Array.from(new Set([...DEFAULT_FAVORITE_MODULE_IDS, ...parsed]));
        }
      }
    } catch {
      // ignore
    }
    return DEFAULT_FAVORITE_MODULE_IDS;
  });

  // 5. Accordion Open/Collapsed State
  const [collapsedDepts, setCollapsedDepts] = useState<Record<DepartmentId, boolean>>({
    gestao: false,
    dp: false,
    fiscal: false,
    contabil: false,
    setoriais: true
  });

  // Toggle single department
  const toggleDepartment = (deptId: DepartmentId) => {
    setCollapsedDepts(prev => ({
      ...prev,
      [deptId]: !prev[deptId]
    }));
  };

  // Mass Expand / Collapse
  const expandAllDepartments = () => {
    setCollapsedDepts({
      gestao: false,
      dp: false,
      fiscal: false,
      contabil: false,
      setoriais: false
    });
  };

  const collapseAllDepartments = () => {
    setCollapsedDepts({
      gestao: true,
      dp: true,
      fiscal: true,
      contabil: true,
      setoriais: true
    });
  };

  // Toggle Favorite Module
  const toggleFavorite = (moduleId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavoriteIds(prev => {
      const next = prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId];
      try {
        localStorage.setItem(STORAGE_FAVORITES_KEY, JSON.stringify(next));
      } catch (err) {
        console.warn('Failed to save favorites to localStorage', err);
      }
      return next;
    });
  };

  // 6. Filter & Search Logic
  const filteredDepartments = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return DEPARTMENT_CATEGORIES.map(dept => {
      let matchesFilter = true;
      if (activeFilter === 'core') {
        matchesFilter = dept.isCore;
      } else if (activeFilter === 'dp') {
        matchesFilter = dept.id === 'dp';
      } else if (activeFilter === 'fiscal') {
        matchesFilter = dept.id === 'fiscal';
      } else if (activeFilter === 'contabil') {
        matchesFilter = dept.id === 'contabil';
      } else if (activeFilter === 'setoriais') {
        matchesFilter = dept.id === 'setoriais';
      }

      if (!matchesFilter && !query) {
        return { ...dept, visibleModules: [] };
      }

      let modulesToFilter = dept.modules;
      if (activeFilter === 'cnae' && tenant) {
        modulesToFilter = modulesToFilter.filter(m => isModuleRecommendedForTenant(m.id, tenant));
      }

      if (!query) {
        return { ...dept, visibleModules: modulesToFilter };
      }

      const normQuery = normalizeText(query);
      const matchingModules = modulesToFilter.filter(m => {
        const normName = normalizeText(m.name);
        const normLabel = normalizeText(m.label);
        const normId = normalizeText(m.id);
        const normBadge = m.badge ? normalizeText(m.badge) : '';
        const normFile = m.file ? normalizeText(m.file) : '';
        return normName.includes(normQuery) || 
               normLabel.includes(normQuery) || 
               normId.includes(normQuery) || 
               normBadge.includes(normQuery) ||
               normFile.includes(normQuery);
      });

      return { ...dept, visibleModules: matchingModules };
    }).filter(dept => dept.visibleModules.length > 0);
  }, [searchQuery, activeFilter, tenant]);

  // Total matching modules count
  const totalMatchesCount = useMemo(() => {
    return filteredDepartments.reduce((acc, d) => acc + d.visibleModules.length, 0);
  }, [filteredDepartments]);

  // Favorite Modules resolved
  const favoriteModules = useMemo(() => {
    return favoriteIds
      .map(id => getModuleById(id))
      .filter((m): m is NavigationModule => Boolean(m));
  }, [favoriteIds]);

  // Auto-expand accordions when searching, selecting CNAE filter or switching module
  useEffect(() => {
    if (searchQuery.trim().length > 0 || activeFilter === 'cnae') {
      setCollapsedDepts({
        gestao: false,
        dp: false,
        fiscal: false,
        contabil: false,
        setoriais: false
      });
    }
  }, [searchQuery, activeFilter]);

  useEffect(() => {
    const mod = getModuleById(currentModuleId);
    if (mod && mod.departmentId) {
      setCollapsedDepts(prev => ({
        ...prev,
        [mod.departmentId]: false
      }));
    }
  }, [currentModuleId]);

  const quickFilterTabs: { id: QuickFilterTab; label: string; count?: number; isSpecial?: boolean }[] = [
    { id: 'todos', label: 'Todos', count: ALL_MODULES.length },
    {
      id: 'cnae',
      label: '🎯 CNAE',
      count: recommendedCount > 0 ? recommendedCount : undefined,
      isSpecial: true
    },
    { id: 'core', label: 'Core', count: ALL_MODULES.filter(m => m.isCore).length },
    { id: 'dp', label: 'DP', count: DEPARTMENT_CATEGORIES.find(d => d.id === 'dp')?.modules.length },
    { id: 'fiscal', label: 'Fiscal', count: DEPARTMENT_CATEGORIES.find(d => d.id === 'fiscal')?.modules.length },
    { id: 'contabil', label: 'Contábil', count: DEPARTMENT_CATEGORIES.find(d => d.id === 'contabil')?.modules.length },
    { id: 'setoriais', label: 'Setoriais', count: DEPARTMENT_CATEGORIES.find(d => d.id === 'setoriais')?.modules.length }
  ];

  return (
    <nav
      className={`app-sidebar-left ${className}`}
      aria-label="Navegação Soberano Contábil"
    >
      
      {/* 1. Header & Brand */}
      <div className="sidebar-brand-container" style={{ flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #10B981, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#070B12', fontWeight: 900, fontSize: '0.85rem', boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)' }}>
            SC
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.02em' }}>SOBERANO</span>
              <span style={{ fontSize: '0.65rem', fontWeight: 900, background: 'rgba(16, 185, 129, 0.2)', color: 'var(--emerald-400)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '1px 5px', borderRadius: '4px' }}>PRO</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 500 }}>Platinum Suite v4.5</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            type="button"
            onClick={expandAllDepartments}
            title="Expandir todos os departamentos"
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', padding: '4px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#34D399')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            <ChevronsDown size={15} />
          </button>
          <button
            type="button"
            onClick={collapseAllDepartments}
            title="Recolher todos os departamentos"
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', padding: '4px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#34D399')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            <ChevronsUp size={15} />
          </button>
        </div>
      </div>

      {/* 2. Smart Tenant Context Indicator */}
      {tenant && (
        <div className="sidebar-tenant-badge" style={{ flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
            <span style={{ fontSize: '0.9rem', flexShrink: 0 }}>{activeSectorProfile?.icon || '🏢'}</span>
            <div style={{ minWidth: 0, overflow: 'hidden' }}>
              <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#F1F5F9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {tenant.name}
              </div>
              <div className="font-mono" style={{ fontSize: '0.64rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {tenant.cnaePrincipal.split('-')[0]} • {tenant.regime.replace('_', ' ')}
              </div>
            </div>
          </div>

          {recommendedCount > 0 && (
            <button
              type="button"
              onClick={() => setActiveFilter(activeFilter === 'cnae' ? 'todos' : 'cnae')}
              style={{
                fontSize: '0.64rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '12px',
                border: activeFilter === 'cnae' ? '1px solid #34D399' : '1px solid rgba(16, 185, 129, 0.3)',
                background: activeFilter === 'cnae' ? 'linear-gradient(135deg, #10B981, #059669)' : 'rgba(16, 185, 129, 0.15)',
                color: activeFilter === 'cnae' ? '#070B12' : 'var(--emerald-400)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                flexShrink: 0,
                transition: 'all 0.15s ease'
              }}
            >
              <Target size={10} />
              <span>{recommendedCount} Nicho</span>
            </button>
          )}
        </div>
      )}

      {/* 3. Search Bar */}
      <div className="sidebar-search-container" style={{ flexShrink: 0 }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={13} style={{ position: 'absolute', left: '10px', color: 'var(--text-muted)', pointerEvents: 'none' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar em 181 rotinas..."
            style={{
              width: '100%',
              padding: '6px 28px 6px 28px',
              fontSize: '0.74rem',
              background: '#0B1120',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '6px',
              color: '#F8FAFC',
              outline: 'none'
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              style={{ position: 'absolute', right: '8px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '2px' }}
            >
              <X size={12} />
            </button>
          )}
        </div>

        {searchQuery.trim() && (
          <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
            <span>Resultados: <strong style={{ color: 'var(--emerald-400)' }}>{totalMatchesCount}</strong> módulos</span>
            <span style={{ color: 'var(--text-secondary)' }}>Highlight ativo</span>
          </div>
        )}
      </div>

      {/* 4. Quick Filter Tabs (Pills) */}
      <div className="sidebar-pills-bar no-scrollbar" style={{ flexShrink: 0 }}>
        {quickFilterTabs.map(tab => {
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id)}
              className={`sidebar-pill-btn ${isActive ? 'active' : ''}`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span style={{
                  fontSize: '0.62rem',
                  padding: '1px 5px',
                  borderRadius: '10px',
                  background: isActive ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.08)',
                  color: isActive ? '#070B12' : 'var(--text-secondary)',
                  fontWeight: 800
                }}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 5. Main Scrollable Navigation Area (Garantia de Rolagem Fluida) */}
      <div
        className="sidebar-nav-scroll sidebar-scrollable-content"
        style={{
          flex: '1 1 0%',
          minHeight: '0px',
          height: '100%',
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '10px 8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
      >
        
        {/* Pinned / Favorite Routines */}
        {favoriteModules.length > 0 && !searchQuery.trim() && activeFilter === 'todos' && (
          <div style={{ background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '8px', padding: '8px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', padding: '0 4px' }}>
              <span style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--amber-400)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Star size={11} className="fill-amber-400 text-amber-400" />
                Rotinas Favoritas ({favoriteModules.length})
              </span>
              <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>Fixadas</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {favoriteModules.map(module => {
                const isActive = currentModuleId === module.id;
                const isRecommended = isModuleRecommendedForTenant(module.id, tenant);
                return (
                  <button
                    key={module.id}
                    type="button"
                    onClick={() => onSelectModule(module.id)}
                    className={`module-item-btn routine-item ${isActive ? 'active' : ''}`}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px', minWidth: 0, flex: 1 }}>
                      <span style={{ fontSize: '0.85rem', flexShrink: 0 }}>{module.icon}</span>
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{module.name}</span>
                      {isRecommended && (
                        <span style={{ fontSize: '0.58rem', fontWeight: 800, padding: '1px 4px', borderRadius: '3px', background: 'rgba(16, 185, 129, 0.2)', color: 'var(--emerald-400)', border: '1px solid rgba(16, 185, 129, 0.4)', flexShrink: 0 }}>
                          ⭐ CNAE
                        </span>
                      )}
                    </div>
                    <span
                      onClick={e => toggleFavorite(module.id, e)}
                      title="Remover dos favoritos"
                      style={{ padding: '2px', color: 'var(--amber-400)', cursor: 'pointer', display: 'flex', alignItems: 'center', flexShrink: 0 }}
                    >
                      <Star size={11} className="fill-amber-400" />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 5 Department Accordions */}
        {filteredDepartments.length === 0 ? (
          <div style={{ padding: '24px 12px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
            Nenhum módulo encontrado para "{searchQuery}".
          </div>
        ) : (
          filteredDepartments.map(dept => {
            const isCollapsed = Boolean(collapsedDepts[dept.id]);
            const moduleCount = dept.visibleModules.length;
            const hasActiveChild = dept.visibleModules.some(m => m.id === currentModuleId);

            return (
              <div
                key={dept.id}
                className={`department-accordion dept-accordion-card ${hasActiveChild ? 'active-dept' : ''}`}
                style={{ flexShrink: 0 }}
              >
                {/* Accordion Header */}
                <button
                  type="button"
                  onClick={() => toggleDepartment(dept.id)}
                  className="dept-header-btn"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                    <span style={{ fontSize: '0.85rem', flexShrink: 0 }}>{dept.icon}</span>
                    <span style={{ fontSize: '0.76rem', fontWeight: 700, color: hasActiveChild ? 'var(--emerald-400)' : '#F1F5F9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {dept.name}
                    </span>
                    {dept.isCore && (
                      <span style={{ fontSize: '0.58rem', fontWeight: 800, padding: '1px 4px', borderRadius: '3px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--emerald-400)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                        CORE
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                    <span style={{ fontSize: '0.64rem', fontWeight: 700, padding: '1px 6px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.08)', color: 'var(--text-secondary)' }}>
                      {moduleCount}
                    </span>
                    <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', transition: 'transform 0.2s ease', transform: isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)' }}>
                      <ChevronDown size={13} />
                    </span>
                  </div>
                </button>

                {/* Accordion Body */}
                {!isCollapsed && (
                  <div style={{ padding: '4px 6px 6px 6px', borderTop: '1px solid rgba(255, 255, 255, 0.04)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {dept.visibleModules.map(module => {
                      const isActive = currentModuleId === module.id;
                      const isFavorited = favoriteIds.includes(module.id);
                      const isRecommended = isModuleRecommendedForTenant(module.id, tenant);

                      return (
                        <button
                          key={module.id}
                          type="button"
                          onClick={() => onSelectModule(module.id)}
                          className={`module-item-btn routine-item ${isActive ? 'active' : ''}`}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', minWidth: 0, flex: 1 }}>
                            <span style={{ fontSize: '0.85rem', flexShrink: 0 }}>{module.icon}</span>
                            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              <HighlightMatch text={module.name} query={searchQuery} />
                            </span>
                            {isRecommended && (
                              <span style={{ fontSize: '0.58rem', fontWeight: 800, padding: '1px 4px', borderRadius: '3px', background: 'rgba(16, 185, 129, 0.2)', color: 'var(--emerald-400)', border: '1px solid rgba(16, 185, 129, 0.4)', flexShrink: 0 }}>
                                ⭐ CNAE
                              </span>
                            )}
                            {module.badge && !isRecommended && (
                              <span style={{ fontSize: '0.58rem', fontWeight: 700, padding: '1px 4px', borderRadius: '3px', background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc', border: '1px solid rgba(99, 102, 241, 0.3)', flexShrink: 0 }}>
                                {module.badge}
                              </span>
                            )}
                          </div>

                          <span
                            onClick={e => toggleFavorite(module.id, e)}
                            title={isFavorited ? 'Remover dos favoritos' : 'Favoritar rotina'}
                            style={{
                              padding: '2px',
                              color: isFavorited ? 'var(--amber-400)' : 'var(--text-muted)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              flexShrink: 0,
                              opacity: isFavorited ? 1 : 0.4
                            }}
                            onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                            onMouseLeave={e => (e.currentTarget.style.opacity = isFavorited ? '1' : '0.4')}
                          >
                            <Star size={11} className={isFavorited ? 'fill-amber-400' : ''} />
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* 6. Footer & Live Status */}
      <div className="sidebar-footer" style={{ padding: '8px 12px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', background: '#090E1A', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--emerald-400)', display: 'inline-block', boxShadow: '0 0 6px rgba(16, 185, 129, 0.8)' }} />
          <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>181 Módulos Ativos</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--emerald-400)', background: 'rgba(16, 185, 129, 0.12)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.25)', fontWeight: 700, fontSize: '0.62rem' }}>
          <ShieldCheck size={10} />
          <span>mTLS v1.3</span>
        </div>
      </div>
    </nav>
  );
};

export default SidebarNavigation;