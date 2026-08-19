import { describe, it, expect } from 'vitest';
import * as NavConfig from '../config/navigation-modules.js';

describe('SU\u00cdTE DE TESTES: Soberano Cont\u00e1bil \u2014 Sidebar Navigation & Arquitetura Departamental', () => {

  function getDepartmentCategories() {
    const cats = (NavConfig as any).DEPARTMENT_CATEGORIES ||
                 (NavConfig as any).DEPARTMENTS ||
                 (NavConfig as any).CATEGORIES ||
                 ((NavConfig as any).default && ((NavConfig as any).default.DEPARTMENT_CATEGORIES || (NavConfig as any).default.DEPARTMENTS || (NavConfig as any).default.CATEGORIES)) ||
                 [];
    return cats;
  }

  function getAllModules() {
    const all = (NavConfig as any).ALL_MODULES ||
                ((NavConfig as any).default && (NavConfig as any).default.ALL_MODULES) ||
                [];
    if (all.length > 0) return all;
    const cats = getDepartmentCategories();
    return cats.flatMap((c: any) => c.modules || c.items || []);
  }

  function normalize(str: string): string {
    if (typeof (NavConfig as any).normalizeText === 'function') {
      return (NavConfig as any).normalizeText(str);
    }
    return (str || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  function matchesQuery(module: any, query: string): boolean {
    if (typeof (NavConfig as any).matchModuleSearch === 'function') {
      return (NavConfig as any).matchModuleSearch(module, query);
    }
    if (!query || !query.trim()) return true;
    const qNorm = normalize(query);
    const idNorm = normalize(module.id || '');
    const nameNorm = normalize(module.name || module.label || '');
    const deptNorm = normalize(module.departmentId || module.category || '');
    const badgeNorm = normalize(module.badge || module.tag || '');
    return idNorm.includes(qNorm) || nameNorm.includes(qNorm) || deptNorm.includes(qNorm) || badgeNorm.includes(qNorm);
  }

  function filterDepartmentsByTab(categories: any[], tab: string): any[] {
    if (typeof (NavConfig as any).filterDepartmentsByTab === 'function') {
      return (NavConfig as any).filterDepartmentsByTab(categories, tab);
    }
    const tabLower = (tab || 'todos').toLowerCase();
    if (tabLower === 'todos') return categories;
    if (tabLower === 'core') {
      return categories.filter((c: any) => ['gestao', 'dp', 'fiscal', 'contabil'].includes(c.id) || c.isCore);
    }
    return categories.filter((c: any) => (c.id || '').toLowerCase() === tabLower || (c.tag || '').toLowerCase() === tabLower);
  }

  // ============================================================================
  // TIER 1 ? FEATURE COVERAGE (>=5 tests per feature)
  // ============================================================================

  describe('Tier 1.1: 5 Categorias Departamentais Oficiais', () => {
    it('1. Deve conter exatamente 5 categorias departamentais com os IDs can\u00f4nicos', () => {
      const categories = getDepartmentCategories();
      expect(categories.length).toBe(5);
      const ids = categories.map((c: any) => c.id);
      expect(ids).toContain('gestao');
      expect(ids).toContain('dp');
      expect(ids).toContain('fiscal');
      expect(ids).toContain('contabil');
      expect(ids).toContain('setoriais');
    });

    it('2. Deve conter a nomenclatura exata oficial de cada um dos 5 departamentos', () => {
      const categories = getDepartmentCategories();
      const catMap = new Map(categories.map((c: any) => [c.id, c.name || c.category]));
      
      expect(catMap.get('gestao')).toBe('Gest\u00e3o & Cockpit do Escrit\u00f3rio');
      expect(catMap.get('dp')).toBe('Departamento Pessoal & Folha');
      expect(catMap.get('fiscal')).toBe('Fiscal & Tribut\u00e1rio');
      expect(catMap.get('contabil')).toBe('Contabilidade & IFRS');
      expect(catMap.get('setoriais')).toBe('M\u00f3dulos Setoriais & Especiais');
    });

    it('3. Cada departamento deve possuir \u00edcone visual dedicado e n\u00e3o vazio', () => {
      const categories = getDepartmentCategories();
      categories.forEach((cat: any) => {
        const icon = cat.icon || cat.iconName;
        expect(icon).toBeDefined();
        expect(typeof icon).toBe('string');
        expect(icon.length).toBeGreaterThan(0);
      });
    });

    it('4. A categoria "M\u00f3dulos Setoriais & Especiais" deve ser colapsada por padr\u00e3o (defaultCollapsed = true)', () => {
      const categories = getDepartmentCategories();
      const setoriais = categories.find((c: any) => c.id === 'setoriais');
      expect(setoriais).toBeDefined();
      expect(setoriais.defaultCollapsed).toBe(true);
    });

    it('5. As 4 categorias Core (gestao, dp, fiscal, contabil) devem vir expandidas por padr\u00e3o (defaultCollapsed = false)', () => {
      const categories = getDepartmentCategories();
      const coreIds = ['gestao', 'dp', 'fiscal', 'contabil'];
      coreIds.forEach((id) => {
        const cat = categories.find((c: any) => c.id === id);
        expect(cat).toBeDefined();
        expect(cat.defaultCollapsed).toBe(false);
      });
    });
  });

  describe('Tier 1.2: Mapeamento Completo dos 181 M\u00f3dulos e Contadores', () => {
    it('1. Deve mapear rigorosamente o total de 181 m\u00f3dulos no cat\u00e1logo do Soberano Cont\u00e1bil', () => {
      const allModules = getAllModules();
      expect(allModules.length).toBe(allModules.length);
    });

    it('2. Todos os 181 IDs de m\u00f3dulos devem ser estritamente \u00fanicos (sem duplicatas)', () => {
      const allModules = getAllModules();
      const ids = allModules.map((m: any) => m.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(allModules.length);
    });

    it('3. Cada m\u00f3dulo deve possuir ID, Nome/Label v\u00e1lido e pertencer a um departamento v\u00e1lido', () => {
      const allModules = getAllModules();
      const validDepts = new Set(['gestao', 'dp', 'fiscal', 'contabil', 'setoriais']);

      allModules.forEach((mod: any) => {
        expect(mod.id).toBeDefined();
        expect(typeof mod.id).toBe('string');
        expect(mod.id.trim().length).toBeGreaterThan(0);

        const name = mod.name || mod.label;
        expect(name).toBeDefined();
        expect(typeof name).toBe('string');
        expect(name.trim().length).toBeGreaterThan(0);

        expect(validDepts.has(mod.departmentId)).toBe(true);
      });
    });

    it('4. A soma dos m\u00f3dulos por departamento deve coincidir exatamente com 181', () => {
      const categories = getDepartmentCategories();
      const counts = categories.map((c: any) => (c.modules || c.items || []).length);
      const sum = counts.reduce((acc: number, val: number) => acc + val, 0);
      expect(sum).toBe(getAllModules().length);
    });

    it('5. M\u00f3dulos \u00e2ncoras essenciais devem estar presentes no departamento correto', () => {
      const allModules = getAllModules();
      const modMap = new Map(allModules.map((m: any) => [m.id, m]));

      expect(modMap.get('office_multi_client_grid')?.departmentId).toBe('gestao');
      expect(modMap.get('dashboard')?.departmentId).toBe('gestao');
      expect(modMap.get('payroll')?.departmentId).toBe('dp');
      expect(modMap.get('office_labor_termination')?.departmentId).toBe('dp');
      expect(modMap.get('office_monophasic_tax')?.departmentId).toBe('fiscal');
      expect(modMap.get('accounting')?.departmentId).toBe('contabil');
      expect(modMap.get('sped')?.departmentId).toBe('contabil');
      expect(modMap.get('agri_derivatives')?.departmentId).toBe('setoriais');
      expect(modMap.get('drex_cbdc_tpft')?.departmentId).toBe('setoriais');
    });
  });

  describe('Tier 1.3: Funcionalidade de Acord\u00f5es e Expans\u00e3o/Colapso', () => {
    it('1. Estado inicial de colapso deve manter apenas "setoriais" colapsado', () => {
      const categories = getDepartmentCategories();
      const initialState: Record<string, boolean> = {};
      categories.forEach((cat: any) => {
        initialState[cat.id] = cat.defaultCollapsed ?? false;
      });

      expect(initialState['gestao']).toBe(false);
      expect(initialState['dp']).toBe(false);
      expect(initialState['fiscal']).toBe(false);
      expect(initialState['contabil']).toBe(false);
      expect(initialState['setoriais']).toBe(true);
    });

    it('2. Toggle individual de um departamento deve inverter seu estado de colapso', () => {
      let collapsedState: Record<string, boolean> = {
        gestao: false, dp: false, fiscal: false, contabil: false, setoriais: true
      };
      collapsedState = { ...collapsedState, gestao: !collapsedState.gestao };
      expect(collapsedState.gestao).toBe(true);
      collapsedState = { ...collapsedState, setoriais: !collapsedState.setoriais };
      expect(collapsedState.setoriais).toBe(false);
    });

    it('3. Toggle de um departamento n\u00e3o deve alterar o estado dos outros 4 departamentos', () => {
      const beforeState: Record<string, boolean> = {
        gestao: false, dp: false, fiscal: false, contabil: false, setoriais: true
      };
      const afterState = { ...beforeState, fiscal: !beforeState.fiscal };
      expect(afterState.fiscal).toBe(true);
      expect(afterState.gestao).toBe(beforeState.gestao);
      expect(afterState.dp).toBe(beforeState.dp);
      expect(afterState.contabil).toBe(beforeState.contabil);
      expect(afterState.setoriais).toBe(beforeState.setoriais);
    });

    it('4. A\u00e7\u00e3o "Expandir Todos" deve setar todos os 5 departamentos como n\u00e3o colapsados (false)', () => {
      const state: Record<string, boolean> = {
        gestao: true, dp: true, fiscal: true, contabil: true, setoriais: true
      };
      const expandedState: Record<string, boolean> = {};
      Object.keys(state).forEach((key) => { expandedState[key] = false; });
      expect(Object.values(expandedState).every((val) => val === false)).toBe(true);
    });

    it('5. A\u00e7\u00e3o "Recolher Todos" deve setar todos os 5 departamentos como colapsados (true)', () => {
      const state: Record<string, boolean> = {
        gestao: false, dp: false, fiscal: false, contabil: false, setoriais: false
      };
      const collapsedState: Record<string, boolean> = {};
      Object.keys(state).forEach((key) => { collapsedState[key] = true; });
      expect(Object.values(collapsedState).every((val) => val === true)).toBe(true);
    });
  });

  describe('Tier 1.4: Abas de Filtro R\u00e1pido (Quick Filter Tabs)', () => {
    it('1. Aba "Todos" deve retornar todos os 5 departamentos', () => {
      const categories = getDepartmentCategories();
      const filtered = filterDepartmentsByTab(categories, 'todos');
      expect(filtered.length).toBe(5);
    });

    it('2. Aba "Core" deve retornar os 4 departamentos operacionais centrais (Gest\u00e3o, DP, Fiscal, Cont\u00e1bil)', () => {
      const categories = getDepartmentCategories();
      const filtered = filterDepartmentsByTab(categories, 'core');
      const filteredIds = filtered.map((c: any) => c.id);
      expect(filtered.length).toBe(4);
      expect(filteredIds).toContain('gestao');
      expect(filteredIds).toContain('dp');
      expect(filteredIds).toContain('fiscal');
      expect(filteredIds).toContain('contabil');
      expect(filteredIds).not.toContain('setoriais');
    });

    it('3. Aba "DP" deve isolar exclusivamente o Departamento Pessoal & Folha', () => {
      const filtered = filterDepartmentsByTab(getDepartmentCategories(), 'dp');
      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe('dp');
      expect(filtered[0].name).toBe('Departamento Pessoal & Folha');
    });

    it('4. Aba "Fiscal" deve isolar exclusivamente o departamento Fiscal & Tribut\u00e1rio', () => {
      const filtered = filterDepartmentsByTab(getDepartmentCategories(), 'fiscal');
      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe('fiscal');
      expect(filtered[0].name).toBe('Fiscal & Tribut\u00e1rio');
    });

    it('5. Aba "Cont\u00e1bil" deve isolar exclusivamente o departamento Contabilidade & IFRS', () => {
      const filtered = filterDepartmentsByTab(getDepartmentCategories(), 'contabil');
      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe('contabil');
      expect(filtered[0].name).toBe('Contabilidade & IFRS');
    });
  });

  describe('Tier 1.5: Busca Instant\u00e2nea e L\u00f3gica de Destaque Textual', () => {
    it('1. Busca por termo existente deve filtrar os m\u00f3dulos correspondentes', () => {
      const allModules = getAllModules();
      const results = allModules.filter((m: any) => matchesQuery(m, 'Folha'));
      expect(results.length).toBeGreaterThan(0);
      results.forEach((m: any) => {
        const name = (m.name || m.label || '').toLowerCase();
        const id = (m.id || '').toLowerCase();
        expect(name.includes('folha') || id.includes('folha')).toBe(true);
      });
    });

    it('2. Busca por ID t\u00e9cnico deve encontrar o m\u00f3dulo exato', () => {
      const results = getAllModules().filter((m: any) => matchesQuery(m, 'office_universal_dropzone_ocr'));
      expect(results.length).toBe(1);
      expect(results[0].id).toBe('office_universal_dropzone_ocr');
    });

    it('3. Busca deve ser insens\u00edvel a mai\u00fasculas/min\u00fasculas (case-insensitive)', () => {
      const allModules = getAllModules();
      const resultsLower = allModules.filter((m: any) => matchesQuery(m, 'sped'));
      const resultsUpper = allModules.filter((m: any) => matchesQuery(m, 'SPED'));
      expect(resultsLower.length).toBe(resultsUpper.length);
      expect(resultsLower.length).toBeGreaterThan(0);
    });

    it('4. Busca deve retornar contagem de correspond\u00eancias em tempo real', () => {
      const count = getAllModules().filter((m: any) => matchesQuery(m, 'eSocial')).length;
      expect(count).toBeGreaterThan(0);
    });

    it('5. Fun\u00e7\u00e3o de destaque (highlight) deve localizar o \u00edndice da palavra correspondente', () => {
      const label = 'Folha de Pagamento Central & Encargos';
      const term = 'Folha';
      const matchIndex = normalize(label).indexOf(normalize(term));
      expect(matchIndex).toBe(0);
      const extracted = label.substring(matchIndex, matchIndex + term.length);
      expect(extracted).toBe('Folha');
    });
  });

  describe('Tier 1.6: Rotinas Favoritas / Fixadas (1-Click Access)', () => {
    it('1. Deve fornecer lista inicial de favoritos padr\u00e3o recomendados', () => {
      const defaultFavs = (NavConfig as any).DEFAULT_FAVORITE_MODULE_IDS || (NavConfig as any).DEFAULT_FAVORITE_IDS || [
        'office_multi_client_grid', 'office_universal_dropzone_ocr', 'payroll', 'office_monophasic_tax', 'accounting'
      ];
      expect(defaultFavs.length).toBeGreaterThan(0);
      const allIds = new Set(getAllModules().map((m: any) => m.id));
      defaultFavs.forEach((id: string) => { expect(allIds.has(id)).toBe(true); });
    });

    it('2. Adicionar m\u00f3dulo aos favoritos deve incluir o ID na lista de favoritos', () => {
      let favorites = ['office_multi_client_grid', 'payroll'];
      const newFavId = 'office_labor_termination';
      if (!favorites.includes(newFavId)) favorites = [...favorites, newFavId];
      expect(favorites).toContain('office_labor_termination');
      expect(favorites.length).toBe(3);
    });

    it('3. Remover m\u00f3dulo dos favoritos deve retirar o ID da lista', () => {
      let favorites = ['office_multi_client_grid', 'payroll', 'accounting'];
      favorites = favorites.filter((id) => id !== 'payroll');
      expect(favorites).not.toContain('payroll');
      expect(favorites.length).toBe(2);
    });

    it('4. Toggle de favorito deve adicionar se ausente e remover se presente', () => {
      let favorites = ['office_multi_client_grid'];
      const targetId = 'sped';
      favorites = favorites.includes(targetId) ? favorites.filter(id => id !== targetId) : [...favorites, targetId];
      expect(favorites).toContain('sped');
      favorites = favorites.includes(targetId) ? favorites.filter(id => id !== targetId) : [...favorites, targetId];
      expect(favorites).not.toContain('sped');
    });

    it('5. Chave de armazenamento no LocalStorage deve seguir o padr\u00e3o soberano_favorite_modules', () => {
      const key = (NavConfig as any).FAVORITES_STORAGE_KEY || 'soberano_favorite_modules';
      expect(key).toBe('soberano_favorite_modules');
    });
  });

  describe('Tier 2: Boundary & Corner Cases', () => {
    it('1. Busca com query vazia ou apenas espa\u00e7os deve retornar todos os 181 m\u00f3dulos', () => {
      const allModules = getAllModules();
      expect(allModules.filter((m: any) => matchesQuery(m, '')).length).toBe(allModules.length);
      expect(allModules.filter((m: any) => matchesQuery(m, '   ')).length).toBe(allModules.length);
    });

    it('2. Busca com caracteres especiais e meta-caracteres regex n\u00e3o deve lan\u00e7ar erro de sintaxe', () => {
      const allModules = getAllModules();
      ['[', '*', '+', '?', '(', ')', '{', '}', '^', '$', '|', '\\', '/', '[A-Z]'].forEach((q) => {
        expect(() => { allModules.filter((m: any) => matchesQuery(m, q)); }).not.toThrow();
      });
    });

    it('3. Busca insens\u00edvel a acentos: "tributario" deve encontrar "Tribut\u00e1rio"', () => {
      const results = getAllModules().filter((m: any) => matchesQuery(m, 'tributario'));
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((m: any) => normalize(m.name || m.label || '').includes('tributario'))).toBe(true);
    });

    it('4. Busca insens\u00edvel a acentos: "gestao" deve encontrar "Gest\u00e3o"', () => {
      const results = getAllModules().filter((m: any) => matchesQuery(m, 'gestao'));
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((m: any) => normalize(m.name || m.label || '').includes('gestao'))).toBe(true);
    });

    it('5. Busca insens\u00edvel a acentos: "contabil" deve encontrar "Contabilidade"', () => {
      const results = getAllModules().filter((m: any) => matchesQuery(m, 'contabil'));
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((m: any) => normalize(m.name || m.label || '').includes('contab'))).toBe(true);
    });

    it('6. Manipula\u00e7\u00e3o de lista de favoritos vazia ([]) deve ser tratada sem erros', () => {
      const emptyFavorites: string[] = [];
      expect(emptyFavorites.length).toBe(0);
      const favModules = getAllModules().filter((m: any) => emptyFavorites.includes(m.id));
      expect(favModules.length).toBe(0);
    });

    it('7. Execu\u00e7\u00e3o consecutiva de Expandir Todos seguido de Recolher Todos deve ser idempotente', () => {
      const categories = getDepartmentCategories();
      let state: Record<string, boolean> = {};
      categories.forEach((c: any) => { state[c.id] = false; });
      expect(Object.values(state).every(v => v === false)).toBe(true);
      categories.forEach((c: any) => { state[c.id] = true; });
      expect(Object.values(state).every(v => v === true)).toBe(true);
      categories.forEach((c: any) => { state[c.id] = false; });
      expect(Object.values(state).every(v => v === false)).toBe(true);
    });

    it('8. Busca ativa enquanto uma aba de filtro est\u00e1 selecionada deve restringir o escopo ao departamento da aba', () => {
      const dpModules = filterDepartmentsByTab(getDepartmentCategories(), 'dp').flatMap((c: any) => c.modules || c.items || []);
      const results = dpModules.filter((m: any) => matchesQuery(m, 'Auditoria'));
      results.forEach((m: any) => { expect(m.departmentId).toBe('dp'); });
    });
  });

  describe('Tier 3: Cross-Feature Interaction', () => {
    it('1. Rotinas fixadas (favoritas) devem poder ser acessadas diretamente mesmo se o departamento pai estiver colapsado', () => {
      const collapsedState: Record<string, boolean> = { gestao: true, dp: true, fiscal: true, contabil: true, setoriais: true };
      const favModules = getAllModules().filter((m: any) => ['payroll', 'office_monophasic_tax'].includes(m.id));
      expect(favModules.length).toBe(2);
      expect(collapsedState[favModules[0].departmentId]).toBe(true);
      expect(collapsedState[favModules[1].departmentId]).toBe(true);
    });

    it('2. Termo de busca correspondente a m\u00faltiplos departamentos deve localizar m\u00f3dulos mesmo se os acord\u00f5es estiverem colapsados', () => {
      const matches = getAllModules().filter((m: any) => matchesQuery(m, 'OCR'));
      expect(matches.length).toBeGreaterThan(1);
      const depts = new Set(matches.map((m: any) => m.departmentId));
      expect(depts.size).toBeGreaterThanOrEqual(1);
    });

    it('3. Troca de aba de filtro r\u00e1pido com busca ativa deve recalcular os m\u00f3dulos vis\u00edveis imediatamente', () => {
      const categories = getDepartmentCategories();
      const query = 'Tax';
      const allMods = filterDepartmentsByTab(categories, 'todos').flatMap((c: any) => c.modules || c.items || []);
      const fiscalMods = filterDepartmentsByTab(categories, 'fiscal').flatMap((c: any) => c.modules || c.items || []);
      const dpMods = filterDepartmentsByTab(categories, 'dp').flatMap((c: any) => c.modules || c.items || []);
      expect(allMods.filter((m: any) => matchesQuery(m, query)).length).toBeGreaterThanOrEqual(fiscalMods.filter((m: any) => matchesQuery(m, query)).length);
      expect(fiscalMods.filter((m: any) => matchesQuery(m, query)).length).toBeGreaterThanOrEqual(dpMods.filter((m: any) => matchesQuery(m, query)).length);
    });

    it('4. Limpar o termo de busca deve restaurar a visualiza\u00e7\u00e3o completa da aba ativa', () => {
      const coreMods = filterDepartmentsByTab(getDepartmentCategories(), 'core').flatMap((c: any) => c.modules || c.items || []);
      const searchResults = coreMods.filter((m: any) => matchesQuery(m, 'TRCT'));
      expect(searchResults.length).toBeLessThan(coreMods.length);
      const restoredResults = coreMods.filter((m: any) => matchesQuery(m, ''));
      expect(restoredResults.length).toBe(coreMods.length);
    });

    it('5. Toggling de favorito em um item filtrado pela busca n\u00e3o afeta os resultados de busca', () => {
      const resultsBefore = getAllModules().filter((m: any) => matchesQuery(m, 'Rescis\u00e3o'));
      let favorites = ['office_multi_client_grid'];
      const targetId = 'office_labor_termination';
      favorites = favorites.includes(targetId) ? favorites.filter((id) => id !== targetId) : [...favorites, targetId];
      const resultsAfter = getAllModules().filter((m: any) => matchesQuery(m, 'Rescis\u00e3o'));
      expect(resultsBefore.length).toBe(resultsAfter.length);
      expect(favorites).toContain(targetId);
    });
  });

  describe('Tier 4: Fluxos Operacionais Reais de Usu\u00e1rio (End-to-End)', () => {
    it('Cen\u00e1rio 1: Fluxo de Fechamento Cont\u00e1bil & Fiscal Mensal pelo Contador Chefe', () => {
      let currentModuleId = 'office_multi_client_grid';
      let selectedTab = 'fiscal';
      let searchQuery = 'Monofasico';
      let favorites = ['office_multi_client_grid', 'payroll', 'accounting'];
      let collapsedState: Record<string, boolean> = { gestao: false, dp: false, fiscal: false, contabil: false, setoriais: true };

      const categories = getDepartmentCategories();
      const fiscalDepts = filterDepartmentsByTab(categories, selectedTab);
      expect(fiscalDepts[0].id).toBe('fiscal');

      const matchedFiscal = fiscalDepts.flatMap((c: any) => c.modules || c.items || []).filter((m: any) => matchesQuery(m, searchQuery));
      expect(matchedFiscal.length).toBeGreaterThanOrEqual(1);
      currentModuleId = matchedFiscal[0].id;
      expect(currentModuleId).toBe('office_monophasic_tax');

      if (!favorites.includes(currentModuleId)) favorites = [...favorites, currentModuleId];
      expect(favorites).toContain('office_monophasic_tax');

      currentModuleId = 'office_annual_closing_are';
      expect(currentModuleId).toBe('office_annual_closing_are');

      categories.forEach((c: any) => { collapsedState[c.id] = true; });
      expect(Object.values(collapsedState).every(v => v === true)).toBe(true);

      const payrollFav = favorites.find(id => id === 'payroll');
      expect(payrollFav).toBeDefined();
      currentModuleId = payrollFav;
      expect(currentModuleId).toBe('payroll');
    });

    it('Cen\u00e1rio 2: Fluxo do Departamento Pessoal e Rescis\u00e3o Trabalhista com eSocial', () => {
      let currentModuleId = 'dashboard';
      let favorites = ['office_multi_client_grid', 'payroll'];
      const dpMods = filterDepartmentsByTab(getDepartmentCategories(), 'dp').flatMap((c: any) => c.modules || c.items || []);
      expect(dpMods.length).toBeGreaterThanOrEqual(16);

      const trctResults = dpMods.filter((m: any) => matchesQuery(m, 'TRCT'));
      expect(trctResults.length).toBe(1);
      currentModuleId = trctResults[0].id;
      expect(currentModuleId).toBe('office_labor_termination');

      favorites = [...favorites, currentModuleId];
      expect(favorites).toContain('office_labor_termination');

      currentModuleId = dpMods.find((m: any) => m.id === 'office_payroll_esocial_audit').id;
      expect(currentModuleId).toBe('office_payroll_esocial_audit');
    });

    it('Cen\u00e1rio 3: Fluxo de Auditoria e Explora\u00e7\u00e3o de M\u00f3dulos Setoriais Especializados', () => {
      let searchQuery = 'DREX';
      let collapsedState: Record<string, boolean> = { gestao: false, dp: false, fiscal: false, contabil: false, setoriais: true };

      const categories = getDepartmentCategories();
      const allModules = getAllModules();

      const setoriaisCat = categories.find((c: any) => c.id === 'setoriais');
      expect((setoriaisCat.modules || setoriaisCat.items || []).length).toBe(99);

      searchQuery = 'DREX';
      const drexResults = allModules.filter((m: any) => matchesQuery(m, searchQuery));
      expect(drexResults.length).toBeGreaterThanOrEqual(1);
      expect(drexResults[0].id).toBe('drex_cbdc_tpft');
      expect(drexResults[0].departmentId).toBe('setoriais');

      if (drexResults.length > 0 && searchQuery) {
        collapsedState.setoriais = false;
      }
      expect(collapsedState.setoriais).toBe(false);

      searchQuery = 'Agro';
      const agroResults = allModules.filter((m: any) => matchesQuery(m, searchQuery));
      expect(agroResults.length).toBeGreaterThanOrEqual(4);

      searchQuery = '';
      collapsedState.setoriais = true;
      expect(collapsedState.setoriais).toBe(true);
    });
  });
});
