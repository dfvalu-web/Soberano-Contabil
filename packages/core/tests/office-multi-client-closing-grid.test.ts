import { describe, it, expect } from 'vitest';
import {
  processOfficeMultiClientClosingGridEngine,
  processOfficePortfolioHealthKpiEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Cockpit Multi-Empresa em Grade Única com Semáforos (Fase 2)', () => {
  it('1. Deve consolidar grade com 3 clientes avaliando status geral e taxa de fechamento', () => {
    const resGrid = processOfficeMultiClientClosingGridEngine({
      escritorioCnpj: '00.000.000/0001-00',
      escritorioNome: 'Soberano Contabilidade & Consultoria',
      competenciaMesAno: '2026-08',
      clientesStatus: [
        {
          clienteCnpj: '11.111.111/0001-11',
          razaoSocial: 'Cliente Alpha S/A',
          regimeTributario: 'LUCRO_REAL',
          statusDpFolha: 'CONCLUIDO',
          statusFiscalSped: 'CONCLUIDO',
          statusContabilBalancete: 'CONCLUIDO',
          statusGuiasDctfWeb: 'CONCLUIDO',
          statusCndRegularidade: 'VALIDA'
        },
        {
          clienteCnpj: '22.222.222/0001-22',
          razaoSocial: 'Cliente Beta Ltda',
          regimeTributario: 'SIMPLES_NACIONAL',
          statusDpFolha: 'CONCLUIDO',
          statusFiscalSped: 'CONCLUIDO',
          statusContabilBalancete: 'EM_ANDAMENTO',
          statusGuiasDctfWeb: 'EM_ANDAMENTO',
          statusCndRegularidade: 'VALIDA'
        },
        {
          clienteCnpj: '33.333.333/0001-33',
          razaoSocial: 'Cliente Gamma ME',
          regimeTributario: 'SIMPLES_NACIONAL',
          statusDpFolha: 'PENDENTE',
          statusFiscalSped: 'PENDENTE',
          statusContabilBalancete: 'PENDENTE',
          statusGuiasDctfWeb: 'PENDENTE',
          statusCndRegularidade: 'EXPIRADA_OU_COM_PENDENCIA'
        }
      ]
    });

    const dataGrid = unwrap(resGrid);
    expect(dataGrid.totalClientesCarteiraCount).toBe(3);
    expect(dataGrid.totalClientesTotalmenteFechadosCount).toBe(1); // Alpha
    expect(dataGrid.totalClientesEmAndamentoCount).toBe(1); // Beta
    expect(dataGrid.totalClientesComPendenciaCriticaCount).toBe(1); // Gamma
    expect(dataGrid.taxaFechamentoEscritorioPercent).toBe(33.33);
    expect(dataGrid.clientesAvaliados[0].statusGeralCliente).toBe('TOTALMENTE_FECHADO_VERDE');
    expect(dataGrid.clientesAvaliados[2].statusGeralCliente).toBe('ATENCAO_CRITICA_VERMELHO');
    expect(dataGrid.statusGrade).toBe('GRADE_MULTI_EMPRESA_CONSOLIDADA_COM_SUCESSO');
    expect(dataGrid.diagnosticoGrade).toContain('Cockpit Multi-Empresa');
  });

  it('2. Deve calcular KPIs de saude da carteira com identificacao de risco e SLA regular', () => {
    const resKpi = processOfficePortfolioHealthKpiEngine({
      escritorioNome: 'Soberano Contabilidade & Consultoria',
      competenciaMesAno: '2026-08',
      totalClientesCarteiraCount: 100,
      totalClientesFechadosCount: 85,
      totalPendenciasCriticasCount: 5
    });

    const dataKpi = unwrap(resKpi);
    expect(dataKpi.indiceProdutividadeEquipePercent).toBe(85.00);
    expect(dataKpi.nivelRiscoOperacional).toBe('BAIXO_RISCO');
    expect(dataKpi.slaCumprimentoStatus).toBe('DENTRO_DO_PRAZO_REGULAR');
    expect(dataKpi.statusKpi).toBe('KPIS_SAUDE_CARTEIRA_CALCULADOS');
    expect(dataKpi.diagnosticoKpi).toContain('Saúde da Carteira');
  });
});
