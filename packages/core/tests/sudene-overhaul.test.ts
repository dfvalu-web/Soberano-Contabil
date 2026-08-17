import { describe, it, expect } from 'vitest';
import {
  processMajorOverhaulDerecognitionCpc27,
  processSudeneSudamReinvestmentTaxEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Paradas Programadas (CPC 27) & Reinvestimento SUDENE/SUDAM (MP 2.199)', () => {
  it('1. Deve capitalizar custos de grande parada no imobilizado e desreconhecer saldo anterior (CPC 27)', () => {
    const resOverhaul = processMajorOverhaulDerecognitionCpc27({
      equipamentoId: 'FORNO-02',
      equipamentoNome: 'Alto-Forno Metalúrgico 02',
      empresaNome: 'Soberano Siderurgia S.A.',
      custoNovaRevisaoGeralOverhaulBrl: 12000000.00, // 12M capitalizados
      vidaUtilNovaRevisaoMeses: 48, // 4 anos -> 250k/mês
      saldoResidualContabilRevisaoAnteriorBrl: 1500000.00 // 1.5M desreconhecido na DRE
    });

    const dataOverhaul = unwrap(resOverhaul);
    expect(dataOverhaul.custoCapitalizadoNovoImobilizadoBrl).toBe(12000000.00);
    expect(dataOverhaul.baixaDesreconhecimentoRevisaoAnteriorBrl).toBe(1500000.00);
    expect(dataOverhaul.novaQuotaDepreciacaoMensalBrl).toBe(250000.00);
    expect(dataOverhaul.lancamentosContabeis.length).toBe(2);
    expect(dataOverhaul.diagnosticoCpc27).toContain('Custo Nova Revisao: R$ 12000000.00 capitalizado no Imobilizado');
  });

  it('2. Deve apurar reinvestimento de 30% do IRPJ com contrapartida de 50% no BNB e reserva de lucros no PL (SUDENE)', () => {
    const resSudene = processSudeneSudamReinvestmentTaxEngine({
      empresaId: 'IND-SUDENE-01',
      empresaNome: 'Soberano Têxtil do Nordeste S.A.',
      regiaoIncentivo: 'SUDENE',
      anoExercicio: 2026,
      lucroDaExploracaoBrl: 40000000.00, // 40M
      irpjDevidoSemIncentivoBrl: 10000000.00, // 10M IRPJ
      percentualReinvestimentoPercent: 30.0, // 30% = 3M
      percentualContrapartidaRecursosPropriosPercent: 50.0 // 50% = 1.5M
    });

    const dataSudene = unwrap(resSudene);
    expect(dataSudene.irpjReinvestimento30PercentBrl).toBe(3000000.00); // 3M
    expect(dataSudene.contrapartidaRecursosProprios50PercentBrl).toBe(1500000.00); // 1.5M
    expect(dataSudene.totalDepositoBancarioVinculadoBrl).toBe(4500000.00); // 4.5M depositado no BNB
    expect(dataSudene.irpjEfetivoARecolherUniaoBrl).toBe(7000000.00); // 7M (70%)
    expect(dataSudene.reservaIncentivosFiscaisPlBrl).toBe(3000000.00); // 3M no PL
    expect(dataSudene.diagnosticoSudeneSudam).toContain('Total Deposito Bloqueado no Banco do Nordeste (BNB): R$ 4500000.00');
  });
});
