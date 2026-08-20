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
import { CompanyTenant, officeStore } from '../state/office-store';
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
  currentUser?: {
    name: string;
    roleLabel: string;
    avatarIcon: string;
    email: string;
  };
  onLogout?: () => void;
}

const STORAGE_FAVORITES_KEY = 'soberano_favorite_modules';

/**
 * Real-time text match highlighting component
 */
function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query || !query.trim()) {
    return <span>{text}</span>;
  }
  const tokens = query.trim().split(/[\s,;+&|/\-]+/).filter(Boolean);
  if (tokens.length === 0) return <span>{text}</span>;
  
  try {
    const escapedTokens = tokens.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, (m) => "\\" + m)).join("|");
    const regex = new RegExp("(" + escapedTokens + ")", "gi");
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, i) =>
          tokens.some(t => t.toLowerCase() === part.toLowerCase()) ? (
            <mark
              key={i}
              style={{
                background: "rgba(245, 158, 11, 0.3)",
                color: "#FBBF24",
                borderRadius: "4px",
                padding: "1px 4px",
                fontWeight: 800
              }}
            >
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    );
  } catch {
    return <span>{text}</span>;
  }
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  currentModuleId,
  onSelectModule,
  tenant,
  className = '',
  activeFilter: controlledActiveFilter,
  onFilterChange: controlledOnFilterChange,
  currentUser,
  onLogout
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

  // 5. Accordion Open/Collapsed State (Todos os Módulos Encolhidos por Padrão)
  const [isFavoritesCollapsed, setIsFavoritesCollapsed] = useState(true);
  const [collapsedDepts, setCollapsedDepts] = useState<Record<DepartmentId, boolean>>({
    gestao: true,
    dp: true,
    fiscal: true,
    contabil: true,
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
    setIsFavoritesCollapsed(false);
    setCollapsedDepts({
      gestao: false,
      dp: false,
      fiscal: false,
      contabil: false,
      setoriais: false
    });
  };

  const collapseAllDepartments = () => {
    setIsFavoritesCollapsed(true);
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

  // 5.1 Permissão Modular RBAC por Usuário/Empresa
  const userEmail = currentUser?.email || 'dfvalu@gmail.com';
  const isMasterOwner = !currentUser || userEmail.toLowerCase() === 'dfvalu@gmail.com' || userEmail.toLowerCase() === 'david.valu@soberanocontabil.com.br';
  const isModulePermitted = (m: NavigationModule) => {
    if (isMasterOwner) return true;
    if (m.id === 'office_login_security_governance') return false;
    return officeStore.isModuleAllowedForUser(userEmail, m.id, m.departmentId);
  };

  // 6. Universal Multi-Word Tokenized Filter & Search Logic
  const filteredDepartments = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    // Se houver busca digitada, pesquisa em TODOS os módulos de TODOS os departamentos
    if (query) {
      const tokens = normalizeText(query).split(/[\s,;+&|/\-]+/).filter(Boolean);

      return DEPARTMENT_CATEGORIES.map(dept => {
        const matchingModules = dept.modules
          .filter(isModulePermitted)
          .filter(m => {
          const searchCorpus = normalizeText(`${m.name} ${m.label} ${m.id} ${m.badge || ''} ${m.file || ''} ${dept.name}`);
          return tokens.every(token => searchCorpus.includes(token));
        });

        return { ...dept, visibleModules: matchingModules };
      }).filter(dept => dept.visibleModules.length > 0);
    }

    // Se NÃO houver busca, respeita as abas de filtro
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

      if (!matchesFilter) {
        return { ...dept, visibleModules: [] };
      }

      let modulesToFilter = dept.modules.filter(isModulePermitted);
      if (activeFilter === 'cnae' && tenant) {
        modulesToFilter = modulesToFilter.filter(m => isModuleRecommendedForTenant(m.id, tenant));
      }

      return { ...dept, visibleModules: modulesToFilter };
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

  // Mantém os módulos encolhidos por padrão, permitindo que o usuário expanda manualmente com 1 clique

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
      
            {/* 1. Search Bar & Quick Controls (Início da Barra Lateral) */}
      <div className="sidebar-search-container" style={{ flexShrink: 0, paddingTop: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', flex: 1 }}>
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <button
              type="button"
              onClick={expandAllDepartments}
              title="Expandir todos os departamentos"
              style={{ background: '#0B1120', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'var(--text-muted)', padding: '5px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#34D399')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              <ChevronsDown size={14} />
            </button>
            <button
              type="button"
              onClick={collapseAllDepartments}
              title="Recolher todos os departamentos"
              style={{ background: '#0B1120', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'var(--text-muted)', padding: '5px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#34D399')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              <ChevronsUp size={14} />
            </button>
          </div>
        </div>

        {searchQuery.trim() && (
          <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
            <span>Resultados: <strong style={{ color: 'var(--emerald-400)' }}>{totalMatchesCount}</strong> módulos</span>
            <span style={{ color: 'var(--text-secondary)' }}>Highlight ativo</span>
          </div>
        )}
      </div>

      {/* 2. Quick Filter Tabs (Pills) */}
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
        
        {/* Pinned / Favorite Routines (3D 4K Gold/Amber Luxury Accordion) */}
        {favoriteModules.length > 0 && !searchQuery.trim() && activeFilter === 'todos' && (
          <div style={{
            background: 'linear-gradient(180deg, rgba(245, 158, 11, 0.14) 0%, rgba(18, 26, 44, 0.85) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            borderBottom: '2px solid rgba(180, 83, 9, 0.65)',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.22), 0 3px 10px rgba(245, 158, 11, 0.2), 0 2px 6px rgba(0, 0, 0, 0.4)',
            borderRadius: '9px',
            padding: '6px 8px',
            flexShrink: 0
          }}>
            {/* Header / Toggle Button */}
            <button
              type="button"
              onClick={() => setIsFavoritesCollapsed(prev => !prev)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'transparent',
                border: 'none',
                padding: '2px 4px',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <span style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--amber-400)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Star size={11} className="fill-amber-400 text-amber-400" />
                Rotinas Favoritas ({favoriteModules.length})
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>Fixadas</span>
                <span style={{ color: 'var(--amber-400)', display: 'flex', alignItems: 'center', transition: 'transform 0.2s ease', transform: isFavoritesCollapsed ? 'rotate(0deg)' : 'rotate(180deg)' }}>
                  <ChevronDown size={12} />
                </span>
              </div>
            </button>

            {/* Accordion Body */}
            {!isFavoritesCollapsed && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '6px', borderTop: '1px solid rgba(245, 158, 11, 0.15)', paddingTop: '4px' }}>
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
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: isActive ? '#34D399' : '#8B9BB4', fontWeight: isActive ? 800 : 500, fontSize: '0.74rem' }}>{module.name}</span>
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
            )}
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
                    <span style={{ fontSize: '0.76rem', fontWeight: 700, color: hasActiveChild ? '#34D399' : '#FFFFFF', fontWeight: 800, fontSize: '0.80rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {dept.name}
                    </span>
                    {dept.isCore && (
                      <span className="dept-core-badge-3d">
                        CORE
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                    <span className="dept-counter-badge-3d">
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
                            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: isActive ? '#34D399' : '#8B9BB4', fontWeight: isActive ? 800 : 500, fontSize: '0.74rem' }}>
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

      {/* 6. Footer & User Logout Card */}
      <div className="sidebar-footer" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', background: '#090E1A', flexShrink: 0, padding: '8px 10px' }}>
        {currentUser && (
          <div
            style={{
              background: 'linear-gradient(180deg, #141E34 0%, #0C1220 100%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '6px 8px',
              marginBottom: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '6px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
              <span style={{ fontSize: '0.90rem' }}>{currentUser.avatarIcon}</span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {currentUser.name}
                </div>
                <div style={{ fontSize: '0.58rem', color: '#34D399', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {currentUser.roleLabel.split('•')[0]}
                </div>
              </div>
            </div>

            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                title="Deslogar e voltar para a Página Principal"
                style={{
                  background: 'linear-gradient(180deg, #3B1818 0%, #200D0D 100%)',
                  border: '1px solid rgba(239, 68, 68, 0.5)',
                  borderBottom: '2px solid rgba(185, 28, 28, 0.8)',
                  color: '#FCA5A5',
                  padding: '3px 7px',
                  borderRadius: '6px',
                  fontSize: '0.64rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  flexShrink: 0,
                  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15)'
                }}
              >
                <span>🚪</span> Sair
              </button>
            )}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.64rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--emerald-400)', display: 'inline-block', boxShadow: '0 0 6px rgba(16, 185, 129, 0.8)' }} />
            <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>181 Módulos Ativos</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: 'var(--emerald-400)', background: 'rgba(16, 185, 129, 0.12)', padding: '1px 5px', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.25)', fontWeight: 700, fontSize: '0.58rem' }}>
            <ShieldCheck size={9} />
            <span>mTLS v1.3</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SidebarNavigation;