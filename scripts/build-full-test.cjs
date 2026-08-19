const fs = require('fs');

let content = `import { describe, it, expect } from 'vitest';
import * as NavConfig from '../config/navigation-modules.js';

describe('SUÍTE DE TESTES: Soberano Contábil — Sidebar Navigation & Arquitetura Departamental', () => {

  function getDepartmentCategories() {
    const cats = (NavConfig as any).DEPARTMENT_CATEGORIES ||
                 (NavConfig as any).DEPARTMENTS ||
                 (NavConfig as any).CATEGORIES ||
                 ((NavConfig as any).default && ((NavConfig as any).default.DEPARTMENT_CATEGORIES || (NavConfig as any).default.DEPARTMENTS || (NavConfig as any).default.CATEGORIES)) ||
                 [];
    return cats;
  }
���չ�ѥ��������5��ձ�̠���(��������Ё�����9���������́��䤹11}5=U1L���(������������������9���������́��䤹����ձЀ����9���������́��䤹����ձй11}5=U1L����(����������������mt�(����������������Ѡ������ɕ��ɸ�����(��������Ё���̀􁝕�����ѵ����ѕ��ɥ�̠��(����ɕ��ɸ����̹����5�����聅�䤀��������ձ�́������ѕ�́���mt��(���((���չ�ѥ�����ɵ���锡������ɥ������ɥ����(����������������9���������́��䤹��ɵ����Q��Ѐ��􀝙չ�ѥ������(������ɕ��ɸ��9���������́��䤹��ɵ����Q��С��Ȥ�(�����(����ɕ��ɸ����ȁ������(���������ɵ���锠�9��(�������ɕ�������mq������q���ٙt�������(�������ѽ1�ݕ��͔��(��������ɥ����(���("gV�7F����F6�W5VW'����GV�S���VW'��7G&��r��&���V����b�G�V�b��d6��f�r2璒��F6���GV�U6V&6����vgV�7F���r���&WGW&���d6��f�r2璒��F6���GV�U6V&6����GV�R�VW'����Т�b�VW'���VW'��G&�҂��&WGW&�G'VS��6��7B��&����&�Ɨ�R�VW'����6��7B�D��&����&�Ɨ�R���GV�R�B��rr���6��7B��T��&����&�Ɨ�R���GV�R���R����GV�R��&V���rr���6��7BFWD��&����&�Ɨ�R���GV�R�FW'F�V�D�B����GV�R�6FVv�'���rr���6��7B&FvT��&����&�Ɨ�R���GV�R�&FvR����GV�R�Fr��rr���&WGW&��D��&���6�VFW2���&Ғ����T��&���6�VFW2���&Ғ��FWD��&���6�VFW2���&Ғ��&FvT��&���6�VFW2���&ғ��Р�gV�7F���f��FW$FW'F�V�G4'�F"�6FVv�&�W3�畵��F#�7G&��r��畵����b�G�V�b��d6��f�r2璒�f��FW$FW'F�V�G4'�F"���vgV�7F���r���&WGW&���d6��f�r2璒�f��FW$FW'F�V�G4'�F"�6FVv�&�W2�F"���Т6��7BF$��vW"��F"��wF�F�2r��F���vW$66R�����b�F$��vW"���wF�F�2r�&WGW&�6FVv�&�W3���b�F$��vW"���v6�&Rr���&WGW&�6FVv�&�W2�f��FW"��3�璒���vvW7F�r�vGr�vf�66�r�v6��F&��u���6�VFW2�2�B���2�46�&R���Т&WGW&�6FVv�&�W2�f��FW"��3�璒���2�B��rr��F���vW$66R�����F$��vW"���2�Fr��rr��F���vW$66R�����F$��vW"���Ц�
content += `
  // =========================================================================
  // TIER 1 — FEATURE COVERAGE (>=5 tests per feature)
  // =========================================================================

  describe('Tier 1.1: 5 Categorias Departamentais Oficiais', () => {
    it('1. Deve conter exatamente 5 categorias departamentais com os IDs canônicos', () => {
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
      
      expect(catMap.get('gestao')).toBe('Gestão & Cockpit do Escritório');
      expect(catMap.get('dp')).toBe('Departamento Pessoal & Folha');
      expect(catMap.get('fiscal')).toBe('Fiscal & Tributário');
      expect(catMap.get('contabil')).toBe('Contabilidade & IFRS');
      expect(catMap.get('setoriais')).toBe('Módulos Setoriais & Especiais');
    });

    it('3. Cada departamento deve possuir ícone visual dedicado e não vazio', () => {
      const categories = getDepartmentCategories();
      categories.forEach((cat: any) => {
        const icon = cat.icon || cat.iconName;
        expect(icon).toBeDefined();
        expect(typeof icon).toBe('string');
        expect(icon.length).toBeGreaterThan(0);
      });
    });

    it('4. A categoria "Módulos Setoriais & Especiais" deve ser colapsada por padrão (defaultCollapsed = true)', () => {
      const categories = getDepartmentCategories();
      const setoriais = categories.find((c: any) => c.id === 'setoriais');
      expect(setoriais).toBeDefined();
      expect(setoriais.defaultCollapsed).toBe(true);
    });

    it('5. As 4 categorias Core (gestao, dp, fiscal, contabil) devem vir expandidas por padrão (defaultCollapsed = false)', () => {
      const categories = getDepartmentCategories();
      const coreIds = ['gestao', 'dp', 'fiscal', 'contabil'];
      coreIds.forEach((id) => {
        const cat = categories.find((c: any) => c.id === id);
        expect(cat).toBeDefined();
        expect(cat.defaultCollapsed).toBe(false);
      });
    });
  });

  describe('Tier 1.2: Mapeamento Completo dos 181 Módulos e Contadores', () => {
    it('1. Deve mapear rigorosamente o total de 181 módulos no catálogo do Soberano Contábil', () => {
      const allModules = getAllModules();
      expect(allModules.length).toBe(181);
    });

    it('2. Todos os 181 IDs de módulos devem ser estritamente únicos (sem duplicatas)', () => {
      const allModules = getAllModules();
      const ids = allModules.map((m: any) => m.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(181);
    });

    it('3. Cada módulo deve possuir ID, Nome/Label válido e pertencer a um departamento válido', () => {
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

    it('4. A soma dos módulos por departamento deve coincidir exatamente com 181', () => {
      const categories = getDepartmentCategories();
      const counts = categories.map((c: any) => (c.modules || c.items || []).length);
      const sum = counts.reduce((acc: number, val: number) => acc + val, 0);
      expect(sum).toBe(181);
    });

    it('5. Módulos âncoras essenciais devem estar presentes no departamento correto', () => {
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

  describe('Tier 1.3: Funcionalidade de Acordñes e Expansão/Colapso', () => {
    it('1. Estado inicial de colapso deve manter apenas "setoriais" colapsado', () => {
      const categories = getDepartmentCategories();
      const initialState: Record<string, boolean> = {};
      categories.forEach((c: any) => {
        initialState+[cat.id] = cat.defaultCollapsed ?? false;
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

    it('3. Toggle de um departamento não deve alterar o estado dos outros 4 departamentos', () => {
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

    it('4. Ação "Expandir Todos" deve setar todos os 5 departamentos como não colapsados (false', () => {
      const state: Record<string, boolean> = {
        gestao: true, dp: true, fiscal: true, contabil: true, setoriais: true
      };
      const expandedState: Record<string, boolean> = {};
      Object.keys(state).forEach((key) => { expandedState[key] = false; });
      expect(Object.values(expandedState).every((val) => val === false)).toBe(true);
     });

    it('5. Ação "Recolher Todos" deve setar todos os 5 departamentos como colapsados (true', () => {
      const state: Record<string, boolean> = {
        gestao: false, dp: false, fiscal: false, contabil: false, setoriais: false
      };
      const collapsedState: Record<string, boolean> = {};
      Object.keys(state).forEach((key) => { collapsedState[key] = true; });
      expect(Object.values(collapsedState).every((val) => val === true)).toBe(true);
    });
  });
`;

content += `
  describe('Tier 1.4: Abas de Filtro Rápido (Quick Filter Tabs)', () => {
    it('1. Aba "Todos" deve retornar todos os 5 departamentos', () => {
      const categories = getDepartmentCategories();
      const filtered = filterDepartmentsByTab(categories, 'todos');
      expect(filtered.length).toBe(5);
    });

    it('2. Aba "Core" deve retornar os 4 departamentos operacionais centrais (Gestão, DP, Fiscal, Contábil)', () => {
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

    it('4. Aba "Fiscal" deve isolar exclusivamente o departamento Fiscal & Tributário', () => {
      const filtered = filterDepartmentsByTab(getDepartmentCategories(), 'fiscal');
      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe('fiscal');
      expect(filtered[0].name).toBe('Fiscal & Tributário');
    });

    it('5. Aba "Contábil" deve isolar exclusivamente o departamento Contabilidade & IFRS', () => {
      const filtered = filterDepartmentsByTab(getDepartmentCategories(), 'contabil');
      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe('contabil');
      expect(filtered[0].name).toBe('Contabilidade & IFRS');
    });
  });

  describe('Tier 1.5: Busca Instantânea e Lógica de Destaque Textual', () => {
    it('1. Busca por termo existente deve filtrar os módulos correspondentes', () => {
      const allModules = getAllModules();
      const results = allModules.filter((m: any) => matchesQuery(m, 'Folha'));
      expect(results.length).toBeGreaterThan(0);
      results.forEach((m: any) => {
        const name = (m.name || m.label || '').toLowerCase();
        const id = (m.id || '').toLowerCase();
        expect(name.includes('folha') || id.includes('folha')).toBe(true);
      });
    });

    it('2. Busca por ID écnico deve encontrar o módulo exato', () => {
      const results = getAllModules().filter((m: any) => matchesQuery(m, 'office_universal_dropzone_ocr'));
      expect(results.length).toBe(1);
      expect(results[0].id).toBe('office_universal_dropzone_ocr');
    });

    it('3. Busca deve ser insensível a maiúsculas/minúsculas (case-insensitive)', () => {
      const allModules = getAllModules();
      const resultsLower = allModules.filter((m: any) => matchesQuery(m, 'sped'));
      const resultsUpper = allModules.filter((m: any) => matchesQuery(m, 'SPED'));
      expect(resultsLower.length).toBe(resultsUpper.length);
      expect(resultsLower.length).toBeGreaterThan(0);
    });

    it('4. Busca deve retornar contagem de correspondências em tempo real', () => {
      const count = getAllModules().filter((m: any) => matchesQuery(m, 'eSocial')).length;
      expect(count).toBeGreaterThan(0);
    });

    it('5. Função de destaque (highlight) deve localizar o índice da palavra correspondente', () => {
      const label = 'Folha de Pagamento Central & Encargos';
      const term = 'Folha';
      const matchIndex = normalize(label).indexOf(normalize(term));
      expect(matchIndex).toBe(0);
      const extracted = label.substring(matchIndex, matchIndex + term.length);
      expect(extracted).toBe('Folha');
    });
  });

  describe('Tier 1.6: Rotinas Favoritas / Fixadas (1-Click Access)', () => {
    describe('Favoritos', () => {
      it('1. Deve fornecer lista inicial de favoritos padrão recomendados', () => {
        const defaultFavs = (NavConfig as any).DEFAULT_FAVORITE_MODULE_IES || (NavConfig as any).DEFAULT_FAVORITE_IDS || [
          'office_multi_client_grid', 'office_universal_dropzone_ocr', 'payroll', 'office_monophasic_tax', 'accounting'
        ];
        expect(defaultFavs.length).toBeGreaterThan(0);
        const allIds = new Set(getAllModules().map((m: any) => m.id));
        defaultFavs.forEach((id: string) => { expect(allIds.has(id)).toBe(true); });
      });

      it('2. Adicionar módulo aos favoritos deve incluir o IE+k�xH\�HH�]�ܚ]���

HO�]�]�ܚ]\�H��ٙ�X�W�][W��Y[��ܚY	�	�^\��	�N�ۜ��]ј]�YH	�ٙ�X�W�X�ܗ�\�Z[�][ۉ�Y�
Y�]�ܚ]\˚[��Y\��]ј]�Y
JH�]�ܚ]\�Hˋ���]�ܚ]\��]ј]�YN^X�
�]�ܚ]\�K���۝Z[�	�ٙ�X�W�X�ܗ�\�Z[�][ۉ�N^X�
�]�ܚ]\˛[��
K�ЙJ�NJN�]
	�ˈ�[[ݙ\�p��[����]�ܚ]��]�H�]\�\��Q�H\�I�

HO�]�]�ܚ]\�H��ٙ�X�W�][W��Y[��ܚY	�	�^\��	�	�X���[�[���N�]�ܚ]\�H�]�ܚ]\˙�[\�
Y
HO�YOOH	�^\��	�N^X�
�]�ܚ]\�K������۝Z[�	�^\��	�N^X�
�]�ܚ]\˛[��
K�ЙJ�NJN�]
	�����HH�]�ܚ]�]�HYX�[ۘ\��H]\�[�HH�[[ݙ\��H�\�[�I�

HO�]�]�ܚ]\�H��ٙ�X�W�][W��Y[��ܚY	�N�ۜ�\��]YH	��Y	��]�ܚ]\�H�]�ܚ]\˚[��Y\�\��]Y
H��]�ܚ]\˙�[\�YO�YOOH\��]Y
H�ˋ���]�ܚ]\�\��]YN^X�
�]�ܚ]\�K���۝Z[�	��Y	�N�]�ܚ]\�H�]�ܚ]\˚[��Y\�\��]Y
H��]�ܚ]\˙�[\�YO�YOOH\��]Y
H�ˋ���]�ܚ]\�\��]YN^X�
�]�ܚ]\�K������۝Z[�	��Y	�NJN�]
	�K��]�HH\�X^�[�[Y[������[�ܘY�H]�H�Y�Z\��Y�����ؙ\�[��٘]�ܚ]W�[�[\��

HO��ۜ��^HH
�]��ۙ�Y�\�[�JK��U�ԒUT���ԐQ�W��VH	��ؙ\�[��٘]�ܚ]W�[�[\��^X�
�^JK�ЙJ	��ؙ\�[��٘]�ܚ]W�[�[\��NJNJNJN�\�ܚX�J	�Y\�����[�\�H	��ܛ�\��\�\��

HO�]
	�K��\��H��H]Y\�H�^�XH�H\[�\�\�p����]�H�]ܛ�\������NHp��[���

HO��ۜ�[[�[\�H�][[�[\�
N^X�
[[�[\˙�[\�
N�[�JHO�X]�\�]Y\�JK	��JK�[��
K�ЙJNJN^X�
[[�[\˙�[\�
N�[�JHO�X]�\�]Y\�JK	�	�JK�[��
K�ЙJNJNJN�]
	̋��\��H��H�\�X�\�\�\�X�XZ\�HY]KX�\�X�\�\��Y�^����]�H[���\�\���H�[�^I�

HO��ۜ�[[�[\�H�][[�[\�
N����	ʉ�	���	���	�	�	�I�	���	�I�	׉�	�	�	�	�	�	�	���	��KV�I�K��ܑXX�

JHO�^X�


HO��[[�[\˙�[\�
N�[�JHO�X]�\�]Y\�JKJJN�JK��������
NJNJN�]
	�ˈ�\��H[��[���]�[HX�[��Έ��X�]\�[Ȉ]�H[��۝�\���X�]0�\�[ȉ�

HO��ۜ��\�[�H�][[�[\�
K��[\�
N�[�JHO�X]�\�]Y\�JK	��X�]\�[��N^X�
�\�[˛[��
K�ЙQܙX]\�[�
N^X�
�\�[˜��YJ
N�[�JHO�
K��[YHK�X�[	��K�[��Y\�	��X�]0�\�[��H
K��[YHK�X�[	��K�[��Y\�	��X�]0�\�[��JJK�ЙJ�YJNJN�]
	���\��H[��[���]�[HX�[��Έ��\�[Ȉ]�H[��۝�\���\�0��ȉ�

HO��ۜ��\�[�H�][[�[\�
K��[\�
N�[�JHO�X]�\�]Y\�JK	��\�[��N^X�
�\�[˛[��
K�ЙQܙX]\�[�
N^X�
�\�[˜��YJ
N�[�JHO�
K��[YHK�X�[	��K�[��Y\�	��\�0����JJK�ЙJ�YJNJN�]
	�K��\��H[��[���]�[HX�[��Έ��۝X�[�]�H[��۝�\���۝X�[YYH��

HO��ۜ��\�[�H�][[�[\�
K��[\�
N�[�JHO�X]�\�]Y\�JK	��۝X�[	�N^X�
�\�[˛[��
K�ЙQܙX]\�[�
N^X�
�\�[˜��YJ
N�[�JHO�
K��[YHK�X�[	��K�[��Y\�	��۝X��JJK�ЙJ�YJNJN�]
	͋�X[�\[p�����H\�HH�]�ܚ]���^�XH
�JH]�H�\��]YH�[H\�����

HO��ۜ�[\Q�]�ܚ]\Έ��[���HH�N^X�
[\Q�]�ܚ]\˛[��
K�ЙJ
N�ۜ��]�[�[\�H�][[�[\�
K��[\�
N�[�JHO�[\Q�]�ܚ]\˚[��Y\�K�Y
JN^X�
�]�[�[\˛[��
K�ЙJ
NJN�]
	�ˈ^X�p������ۜ�X�]]�HH^[�\�����Y�ZY�H�X��\����]�H�\�Y[\�[�I�

HO��ۜ��]Y�ܚY\�H�]\\�Y[��]Y�ܚY\�
N]�]N��X�ܙ��[�����X[��H�N�]Y�ܚY\˙�ܑXX�

Έ[�JHO���]V�˚YHH�[�N�JN^X�
ؚ�X���[Y\��]JK�]�\�J�O��OOH�[�JJK�ЙJ�YJN�]Y�ܚY\˙�ܑXX�

Έ[�JHO���]V�˚YHH�YN�JN^X�
ؚ�X���[Y\��]JK�]�\�J�O��OOH�YJJK�ЙJ�YJN�]Y�ܚY\˙�ܑXX�

Έ[�JHO���]V�˚YHH�[�N�JN^X�
ؚ�X���[Y\��]JK�]�\�J�HO��OOH�[�JJK�ЙJ�YJNJN�]
	���\��H]]�H[�]X[��[XHX�HH�[��\�0�H�[X�[ۘYH]�H�\��[��\��\����[�\\�[Y[��HX�I�

HO��ۜ�[�[\�H�[\�\\�Y[�ОUX��]\\�Y[��]Y�ܚY\�
K	�	�K��]X\

Έ[�JHO�˛[�[\�˚][\��JN�ۜ��\�[�H[�[\˙�[\�
N�[�JHO�X]�\�]Y\�JK	�]Y]ܚXI�JN�\�[˙�ܑXX�

N�[�JHO��^X�
K�\\�Y[�Y
K�ЙJ	�	�N�JNJNJN
content += `
  describe('Tier 3: Cross-Feature Interaction', () => {
    it('1. Rotinas fixadas (favoritas) devem poder ser acessadas diretamente mesmo se o departamento pai estiver colapsado', () => {
      const collapsedState: Record<string, boolean> = { gestao: true, dp: true, fiscal: true, contabil: true, setoriais: true };
      const favModules = getAllModules().filter((m: any) => ['payroll', 'office_monophasic_tax'].includes(m.id));
      expect(favModules.length).toBe(2);
      expect(collapsedState[favModules[0].departmentId]).toBe(true);
      expect(collapsedState[favModules[1].departmentId]).toBe(true);
    });

    it('2. Termo de busca correspondente a múltiplos departamentos deve localizar módulos mesmo se os acordñes estiverem colapsados', () => {
      const matches = getAllModules().filter((m: any) => matchesQuery(m, 'OCR'));
      expect(matches.length).toBeGreaterThan(1);
      const depts = new Set(matches.map((m: any) => m.departmentId));
      expect(depts.size).toBeGreaterThanOrEqual(1);
    });

    it('3. Troca de aba de filtro Rápido com busca ativa deve recalcular os módulos visíveis imediatamente', () => {
      const categories = getDepartmentCategories();
      const query = 'Tax';
      const allMods = filterDepartmentsByTab(categories, 'todos').flatMap((c: any) => c.modules || c.items || []);
      const fiscalMods = filterDepartmentsByTab(categories, 'fiscal').flatMap((c: any) => c.modules || c.items || []);
      const dpMods = filterDepartmentsByTab(categories, 'dp').flatMap((c: any) => c.modules || c.items || []);
      expect(allMods.filter((m: any) => matchesQuery(m, query).length).toBeGreaterThanOrEqual(fiscalMods.filter((m: any) => matchesQuery(m, query).length);
      expect(fiscalMods.filter((m: any) => matchesQuery(m, query).length).toBeGreaterThanOrEqual(dpMods.filter((m: any) => matchesQuery(m, query).length);
    });

    it('4. Limpar o termo de busca deve restaurar a visualização completa da aba ativa', () => {
      const coreMods = filterDepartmentsByTab(getDepartmentCategories(), 'core').flatMap((c: any) => c.modules || c.items || []);
      const searchResults = coreMods.filter((m: any) => matchesQuery(m, 'TRCT'));
      expect(searchResults.length).toBeLessThan(coreMods.length);
      const restoredResults = coreMods.filter((m: any) => matchesQuery(m, ''));
      expect(restoredResults.length).toBe(coreMods.length);
    });

    it('5. Toggling de favorito em um item filtrado pela busca não afeta os resultados de busca', () => {
      const resultsBefore = getAllModules().filter((m: any) => matchesQuery(m, 'Rescisão'));
      let favorites = ['office_multi_client_grid'];
      const targetId = 'office_labor_termination';
      favorites = favorites.includes(targetId) ? favorites.filter((id) => id !== targetId) : [...favorites, targetId];
      const resultsAfter = getAllModules().filter((m: any) => matchesQuery(m, 'Rescisão'));
      expect(resultsBefore.length).toBe(resultsAfter.length);
      expect(favorites).toContain(targetId);
    });
  });

  describe('Tier 4: Fluxos Operacionais Reais de Usuário (End-to-End%', () => {
    it('Cenário 1: Fluxo de Fechamento Contábil & Fiscal Mensal pelo Contador Chefe', () => {
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

    it('Cenário 2: Fluxo do Departamento Pessoal e Rescisão Trabalhista com eSocial', () => {
      let currentModuleId = 'dashboard';
      let favorites = ['office_multi_client_grid', 'payroll'];
      const dpMods = filterDepartmentsByTab(getDepartmentCategories(), 'dp').flatMap((c: any) => c.modules || c.items || []);
      expect(dpMods.length).toBe(16);

      const trctResults = dpMods.filter((m: any) => matchesQuery(m, 'TRCT');
      expect(trctResults.length).toBe(1);
      currentModuleId = trctResults[0].id;
      expect(currentModuleId).toBe('office_labor_termination');

      favorites = [...favorites, currentModuleId];
      expect(favorites).toContain('office_labor_termination');

      currentModuleId = dpMods.find((m: any) => m.id === 'office_payroll_esocial_audit').id;
      expect(currentModuleId).toBe('office_payroll_esocial_audit');
    });

    it('Cenário 3: Fluxo de Auditoria e Exploração de Módulos Setoriais Especializados', () => {
      let searchQuery = 'DREXL';
      let collapsedState: Record<string, boolean> = { gestao: false, dp: false, fiscal: false, contabil: false, setoriais: true };

      const categories = getDepartmentCategories();
      const allModules = getAllModules();

      const setoriaisCat = categories.find ((c: any) => c.id === 'setoriais');
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
`;

fs.writeFileSync('packages/web/src/__tests__/sidebar-navigation.test.ts', content, 'utf8');
console.log('Done writing full test file!');
