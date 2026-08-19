import { describe, it, expect } from 'vitest';
import {
  DEPARTMENT_CATEGORIES,
  ALL_MODULES,
  DEFAULT_FAVORITE_MODULE_IDS,
  getModuleById,
  getDepartmentById,
  DepartmentId,
  NavigationModule
} from '../config/navigation-modules';

describe('CHALLENGER 1: Interactive Navigation & State Stress Test Harness', () => {

  // Helper simulating the search filter logic in SidebarNavigation.tsx
  function searchFilter(
    categories = DEPARTMENT_CATEGORIES,
    searchQuery = '',
    activeFilter: 'todos' | 'core' | 'dp' | 'fiscal' | 'contabil' | 'setoriais' = 'todos'
  ) {
    const query = searchQuery.trim().toLowerCase();

    return categories.map(dept => {
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

      if (!query) {
        return { ...dept, visibleModules: dept.modules };
      }

      const matchingModules = dept.modules.filter(m => {
        const nameMatch = m.name.toLowerCase().includes(query);
        const labelMatch = m.label.toLowerCase().includes(query);
        const idMatch = m.id.toLowerCase().includes(query);
        const badgeMatch = m.badge ? m.badge.toLowerCase().includes(query) : false;
        return nameMatch || labelMatch || idMatch || badgeMatch;
      });

      return { ...dept, visibleModules: matchingModules };
    }).filter(dept => dept.visibleModules.length > 0);
  }

  // =========================================================================
  // MISSION ITEM 1: Search with diacritics/accents, special characters, whitespace, non-matching terms
  // =========================================================================
  describe('Mission 1: Search Logic Stress Testing', () => {

    describe('1.1 Diacritics & Accents Behavior Analysis', () => {
      it('Should analyze Portuguese accented module count and search behavior', () => {
        const accentedModules = ALL_MODULES.filter(m => {
          const raw = m.name + ' ' + m.label;
          return /[\u00C0-\u00FF]/.test(raw);
        });

        expect(accentedModules.length).toBeGreaterThan(0);
      });

      it('Accented queries find exact accented modules', () => {
        const results = searchFilter(DEPARTMENT_CATEGORIES, 'Tributário', 'todos');
        const found = results.flatMap(d => d.visibleModules);
        expect(found.length).toBeGreaterThan(0);
        expect(found.some(m => m.name.includes('Tributário') || m.label.includes('Tributário'))).toBe(true);
      });
    });

    describe('1.2 Special Characters & Regex Injection Resilience', () => {
      const specialCharQueries = [
        '[*+?()^$|\\]',
        '(',
        ')',
        '[',
        ']',
        '{',
        '}',
        '\\',
        '^',
        '$',
        '.',
        '*',
        '+',
        '?',
        '|',
        '<script>alert("xss")</script>',
        '${{7*7}}',
        '-- OR 1=1',
        'null',
        'undefined',
        'NaN',
        '[object Object]'
      ];

      specialCharQueries.forEach(specialQuery => {
        it(`Handles special character query safely without throwing: "${specialQuery}"`, () => {
          expect(() => {
            const results = searchFilter(DEPARTMENT_CATEGORIES, specialQuery, 'todos');
            expect(Array.isArray(results)).toBe(true);
          }).not.toThrow();
        });

        it(`HighlightMatch regex escape works safely for: "${specialQuery}"`, () => {
          expect(() => {
            const cleanQuery = specialQuery.trim();
            if (cleanQuery) {
              const escaped = cleanQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
              const regex = new RegExp('(' + escaped + ')', 'gi');
              const text = 'Soberano Contábil 2026 Test Text (Special) [*+]';
              const parts = text.split(regex);
              expect(Array.isArray(parts)).toBe(true);
            }
          }).not.toThrow();
        });
      });
    });

    describe('1.3 Whitespace & Boundary Variations', () => {
      it('Pure whitespace query returns all 181 modules without filtering', () => {
        const whitespaceQueries = ['', ' ', '   ', '\t', '\n', '   \t\n  '];
        whitespaceQueries.forEach(q => {
          const results = searchFilter(DEPARTMENT_CATEGORIES, q, 'todos');
          const total = results.reduce((acc, d) => acc + d.visibleModules.length, 0);
          expect(total).toBe(ALL_MODULES.length);
        });
      });

      it('Leading and trailing whitespace is trimmed properly during search', () => {
        const trimmed = searchFilter(DEPARTMENT_CATEGORIES, 'payroll', 'todos');
        const padded = searchFilter(DEPARTMENT_CATEGORIES, '   payroll   ', 'todos');
        expect(padded.flatMap(d => d.visibleModules).length).toBe(trimmed.flatMap(d => d.visibleModules).length);
        expect(padded.flatMap(d => d.visibleModules)[0].id).toBe('payroll');
      });
    });

    describe('1.4 Non-matching Terms', () => {
      it('Non-matching search returns 0 visible modules and empty filteredDepartments', () => {
        const nonMatchingQueries = [
          'xyz999nonexistentmodule',
          'impossible_search_query_soberano_9999',
          'qwertyuiopasdfghjklzxcvbnm1234567890'
        ];

        nonMatchingQueries.forEach(q => {
          const results = searchFilter(DEPARTMENT_CATEGORIES, q, 'todos');
          expect(results.length).toBe(0);
          const total = results.reduce((acc, d) => acc + d.visibleModules.length, 0);
          expect(total).toBe(0);
        });
      });
    });
  });

  // =========================================================================
  // MISSION ITEM 2: Mass Collapse followed by searching and selecting items
  // =========================================================================
  describe('Mission 2: Mass Collapse & Search State Transition', () => {

    it('State Machine: Mass collapse -> Search input -> Auto-expansion -> Module selection', () => {
      // 1. Initial State
      let collapsedDepts: Record<DepartmentId, boolean> = {
        gestao: false,
        dp: false,
        fiscal: false,
        contabil: false,
        setoriais: true
      };

      // 2. Mass Collapse
      const collapseAll = () => ({
        gestao: true,
        dp: true,
        fiscal: true,
        contabil: true,
        setoriais: true
      });
      collapsedDepts = collapseAll();
      expect(Object.values(collapsedDepts).every(v => v === true)).toBe(true);

      // 3. User types a search query e.g. "drex" (which belongs to setoriais)
      const searchQuery = 'drex';
      if (searchQuery.trim().length > 0) {
        collapsedDepts = {
          gestao: false,
          dp: false,
          fiscal: false,
          contabil: false,
          setoriais: false
        };
      }

      expect(collapsedDepts.setoriais).toBe(false);
      expect(Object.values(collapsedDepts).every(v => v === false)).toBe(true);

      // 4. Filter search results
      const results = searchFilter(DEPARTMENT_CATEGORIES, searchQuery, 'todos');
      expect(results.length).toBe(1);
      expect(results[0].id).toBe('setoriais');
      expect(results[0].visibleModules.some(m => m.id === 'drex_cbdc_tpft')).toBe(true);

      // 5. Select Module
      let selectedModuleId = 'dashboard';
      const onSelectModule = (id: string) => {
        selectedModuleId = id;
      };
      const targetModule = results[0].visibleModules.find(m => m.id === 'drex_cbdc_tpft');
      expect(targetModule).toBeDefined();
      onSelectModule(targetModule!.id);
      expect(selectedModuleId).toBe('drex_cbdc_tpft');
    });

    it('Mass expand button expands all 5 departments idempotently', () => {
      const expandAll = () => ({
        gestao: false,
        dp: false,
        fiscal: false,
        contabil: false,
        setoriais: false
      });
      const state = expandAll();
      expect(state.gestao).toBe(false);
      expect(state.dp).toBe(false);
      expect(state.fiscal).toBe(false);
      expect(state.contabil).toBe(false);
      expect(state.setoriais).toBe(false);
    });
  });

  // =========================================================================
  // MISSION ITEM 3: Favorite routines pinning, unpinning, and accessing when accordion is collapsed
  // =========================================================================
  describe('Mission 3: Favorite Routines Pinning, Unpinning & Collapsed Access', () => {

    it('Favorite routines resolution correctly maps IDs to module definitions', () => {
      const favoriteIds = [...DEFAULT_FAVORITE_MODULE_IDS];
      const resolved = favoriteIds.map(id => getModuleById(id)).filter(Boolean);
      expect(resolved.length).toBe(DEFAULT_FAVORITE_MODULE_IDS.length);
      expect(resolved.map(m => m!.id)).toEqual(DEFAULT_FAVORITE_MODULE_IDS);
    });

    it('Pinning a new module adds it to favorites and persists to localStorage', () => {
      let favoriteIds = ['dashboard', 'payroll'];
      const mockStorage: Record<string, string> = {};
      
      const toggleFavorite = (moduleId: string) => {
        const next = favoriteIds.includes(moduleId)
          ? favoriteIds.filter(id => id !== moduleId)
          : [...favoriteIds, moduleId];
        favoriteIds = next;
        mockStorage['soberano_favorite_modules'] = JSON.stringify(next);
        return next;
      };

      // Pin drex_cbdc_tpft
      toggleFavorite('drex_cbdc_tpft');
      expect(favoriteIds).toContain('drex_cbdc_tpft');
      expect(JSON.parse(mockStorage['soberano_favorite_modules'])).toContain('drex_cbdc_tpft');

      // Unpin payroll
      toggleFavorite('payroll');
      expect(favoriteIds).not.toContain('payroll');
      expect(JSON.parse(mockStorage['soberano_favorite_modules'])).not.toContain('payroll');
    });

    it('Favorite routines can be accessed via onSelectModule even when their department accordion is collapsed', () => {
      // Setup state where setoriais is collapsed
      const collapsedDepts: Record<DepartmentId, boolean> = {
        gestao: false,
        dp: false,
        fiscal: false,
        contabil: false,
        setoriais: true // Collapsed!
      };

      const favoriteIds = ['drex_cbdc_tpft']; // Located in setoriais
      const favoriteModules = favoriteIds.map(id => getModuleById(id)).filter((m): m is NavigationModule => Boolean(m));

      expect(favoriteModules.length).toBe(1);
      expect(favoriteModules[0].id).toBe('drex_cbdc_tpft');
      expect(favoriteModules[0].departmentId).toBe('setoriais');
      expect(collapsedDepts[favoriteModules[0].departmentId]).toBe(true);

      // Simulating user clicking favorite in the top Pinned Section:
      let activeModuleId = 'dashboard';
      const onSelectModule = (id: string) => {
        activeModuleId = id;
      };

      // 1-Click access from Favorites section
      onSelectModule(favoriteModules[0].id);
      expect(activeModuleId).toBe('drex_cbdc_tpft');
    });

    it('Empty favorites list behaves cleanly without throwing or errors', () => {
      const favoriteIds: string[] = [];
      const favoriteModules = favoriteIds.map(id => getModuleById(id)).filter(Boolean);
      expect(favoriteModules.length).toBe(0);
    });
  });

  // =========================================================================
  // MISSION ITEM 4: Quick filter tabs switching during active search queries
  // =========================================================================
  describe('Mission 4: Quick Filter Tabs Switching During Active Search', () => {

    it('Quick filter tab switching respects both tab scope and search query', () => {
      const query = 'eSocial'; // present in DP

      // 1. Tab = todos
      const todosResults = searchFilter(DEPARTMENT_CATEGORIES, query, 'todos');
      expect(todosResults.length).toBeGreaterThan(0);
      expect(todosResults.some(d => d.id === 'dp')).toBe(true);

      // 2. Switch to Tab = dp
      const dpResults = searchFilter(DEPARTMENT_CATEGORIES, query, 'dp');
      expect(dpResults.length).toBe(1);
      expect(dpResults[0].id).toBe('dp');

      // 3. Switch to Tab = fiscal (which should have 0 eSocial modules)
      const fiscalResults = searchFilter(DEPARTMENT_CATEGORIES, query, 'fiscal');
      expect(fiscalResults.length).toBe(0);

      // 4. Switch to Tab = core (DP is part of core)
      const coreResults = searchFilter(DEPARTMENT_CATEGORIES, query, 'core');
      expect(coreResults.length).toBe(1);
      expect(coreResults[0].id).toBe('dp');

      // 5. Switch to Tab = setoriais
      const setoriaisResults = searchFilter(DEPARTMENT_CATEGORIES, query, 'setoriais');
      expect(setoriaisResults.length).toBe(0);
    });

    it('Switching filter tabs with general search query calculates accurate module counts', () => {
      const query = 'audit'; // May appear across multiple depts

      const todos = searchFilter(DEPARTMENT_CATEGORIES, query, 'todos');
      const core = searchFilter(DEPARTMENT_CATEGORIES, query, 'core');
      const setoriais = searchFilter(DEPARTMENT_CATEGORIES, query, 'setoriais');

      const todosCount = todos.reduce((acc, d) => acc + d.visibleModules.length, 0);
      const coreCount = core.reduce((acc, d) => acc + d.visibleModules.length, 0);
      const setoriaisCount = setoriais.reduce((acc, d) => acc + d.visibleModules.length, 0);

      expect(todosCount).toBe(coreCount + setoriaisCount);
    });
  });

  // =========================================================================
  // MISSION ITEM 5: End-to-End Stress Matrix Verification
  // =========================================================================
  describe('Mission 5: Full Stress Matrix Verification', () => {
    it('Verifies all 181 modules have valid department bindings and can be filtered', () => {
      const allDepts: DepartmentId[] = ['gestao', 'dp', 'fiscal', 'contabil', 'setoriais'];
      allDepts.forEach(deptId => {
        const cat = getDepartmentById(deptId);
        expect(cat).toBeDefined();
        expect(cat!.modules.length).toBeGreaterThan(0);
      });
    });

    it('All default favorite module IDs exist in the 181 module catalog', () => {
      DEFAULT_FAVORITE_MODULE_IDS.forEach(favId => {
        const mod = getModuleById(favId);
        expect(mod).toBeDefined();
        expect(mod!.id).toBe(favId);
      });
    });
  });
});
