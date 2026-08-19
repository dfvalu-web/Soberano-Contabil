import { describe, it, expect } from 'vitest';
import {
  processOfficeClientProfitabilityBiEngine,
  processOfficeComplexityFeePricingEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: BI de Rentabilidade da Carteira & Precificação por Complexidade', () => {
  it('1. Deve calcular rentabilidade da carteira, margem de contribuicao e identificar clientes deficitarios', () => {
    const resBi = processOfficeClientProfitabilityBiEngine({
      escritorioNome: 'Soberano Contabilidade & Consultoria S/S',
      mesCompetencia: '2026-08',
      carteiraClientes: [
        {
          clienteCnpj: '11.111.111/0001-11',
          razaoSocial: 'Supermercado Progresso Ltda',
          regimeTributario: 'LUCRO_REAL',
          honorarioMensalBrl: 5000.00,
          horasContabilMes: 15,
          horasFiscalMes: 20,
          horasDpMes: 10, // Total 45h * 60 = 2700 + 80 = 2780
          custoHoraMediaEquipeBrl: 60.00,
          custoSoftwaresLicencasBrl: 80.00
        },
        {
          clienteCnpj: '22.222.222/0001-22',
          razaoSocial: 'Padaria e Confeitaria Bella Ltda',
          regimeTributario: 'SIMPLES_NACIONAL',
          honorarioMensalBrl: 800.00,
          horasContabilMes: 5,
          horasFiscalMes: 10,
          horasDpMes: 8, // Total 23h * 60 = 1380 + 50 = 1430 -> Prejuízo
          custoHoraMediaEquipeBrl: 60.00,
          custoSoftwaresLicencasBrl: 50.00
        }
      ]
    });

    const dataBi = unwrap(resBi);
    expect(dataBi.totalClientesAnalisados).toBe(2);
    expect(dataBi.faturamentoTotalHonorariosBrl).toBe(5800.00);
    expect(dataBi.totalClientesDeficitarios).toBe(1); // Padaria Bella é deficitária
    expect(dataBi.detalhePorCliente[0].classificacaoRentabilidade).toBe('RENTABILIDADE_ADEQUADA');
    expect(dataBi.detalhePorCliente[1].classificacaoRentabilidade).toBe('CLIENTE_DEFICITARIO_PREJUIZO');
    expect(dataBi.statusBI).toBe('RENTABILIDADE_CARTEIRA_CALCULADA_COM_SUCESSO');
    expect(dataBi.diagnosticoBI).toContain('BI de Rentabilidade');
  });

  it('2. Deve calcular score de complexidade e sugerir repactuacao de honorarios defasados', () => {
    const resPricing = processOfficeComplexityFeePricingEngine({
      clienteCnpj: '33.333.333/0001-33',
      razaoSocial: 'Distribuidora de Peças Automotivas S/A',
      regimeTributario: 'LUCRO_REAL', // +40 pts
      volumeNotasFiscaisMes: 500, // +30 pts
      quantidadeFuncionariosFolha: 10, // +20 pts
      possuiSubstituicaoTributariaOuMonofasicos: true, // +15 pts
      possuiIntegracaoBancariaAutomatica: false, // +10 pts -> Score total alto
      honorarioAtualCobradoBrl: 1500.00, // Defasado
      margemDesejadaPercent: 40.0
    });

    const dataPricing = unwrap(resPricing);
    expect(dataPricing.scoreComplexidadePontos).toBeGreaterThanOrEqual(80);
    expect(dataPricing.honorarioSugeridoIdealBrl).toBeGreaterThan(3000.00);
    expect(dataPricing.acaoRecomendada).toBe('REPACTUAR_REAJUSTAR_HONORARIOS');
    expect(dataPricing.statusPrecificacao).toBe('SCORE_COMPLEXIDADE_PRECIFICADO_COM_SUCESSO');
    expect(dataPricing.diagnosticoPrecificacao).toContain('Ação: REPACTUAR_REAJUSTAR_HONORARIOS');
  });
});
