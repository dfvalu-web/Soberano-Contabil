import { describe, it, expect } from 'vitest';
import {
  evaluateForestryBiologicalAssetFcdCpc29,
  processDebtForEquitySwapIcpc09,
  unwrap
} from '../src/index.js';

describe('TESTES: Florestas por FCD (CPC 29) & Debt-for-Equity Swaps (ICPC 09)', () => {
  it('1. Deve mensurar ativos biologicos florestais a valor justo por fluxo de caixa descontado (CPC 29 / IAS 41)', () => {
    const resForest = evaluateForestryBiologicalAssetFcdCpc29({
      florestaId: 'FOREST-EUC-01',
      empresaNome: 'Soberano Papel & Celulose S.A.',
      especieFlorestal: 'Eucalyptus Urophylla Clone 1528',
      areaPlantioHectares: 10000, // 10.000 ha
      idadeFlorestaAnos: 4, // 4 anos de 7
      volumeProjetadoMadeiraM3PorHectare: 300, // 300 m³/ha -> 3.000.000 m³
      precoLiquidoEsperadoMadeiraEmPeBrlPorM3: 120.00, // 3M * 120 = 360M no corte
      taxaDescontoWaccAnualPercent: 11.5, // 11,5% a.a. por 3 anos restantes
      saldoAnteriorValorJustoBrl: 100000000.00 // 100M
    });

    const dataForest = unwrap(resForest);
    expect(dataForest.volumeTotalProjetadoM3).toBe(3000000);
    expect(dataForest.receitaBrutaProjetadaCorteBrl).toBe(360000000.00);
    expect(dataForest.anosAteCorteFinal).toBe(3);
    expect(dataForest.valorJustoFcdAtualizadoBrl).toBeGreaterThan(140000000.00);
    expect(dataForest.variacaoValorJustoPeriodoDrebBrl).toBeGreaterThan(40000000.00);
    expect(dataForest.partidasDobrada.length).toBe(2);
    expect(dataForest.diagnosticoCpc29).toContain('CPC 29 / IAS 41 FCD');
  });

  it('2. Deve extinguir passivo financeiro com acoes ao valor justo reconhecendo ganho na DRE (ICPC 09 / IFRIC 19)', () => {
    const resDebt = processDebtForEquitySwapIcpc09({
      operacaoId: 'SWAP-RJ-01',
      devedorNome: 'Soberano Infraestrutura S.A. - Em Recuperação Judicial',
      credorNome: 'Consórcio de Bancos Credores',
      valorContabilPassivoExtintoBrl: 100000000.00, // Dívida 100M
      quantidadeAcoesEmitidas: 10000000, // 10M ações
      valorJustoUnitarioAcaoBrl: 7.00, // Cotação 7,00 -> Valor Justo Total 70M
      valorNominalCapitalSocialUnitarioBrl: 1.00 // Capital 10M + Ágio 60M
    });

    const dataDebt = unwrap(resDebt);
    expect(dataDebt.valorPassivoExtintoBrl).toBe(100000000.00);
    expect(dataDebt.valorJustoTotalAcoesEmitidasBrl).toBe(70000000.00);
    expect(dataDebt.aumentoCapitalSocialBrl).toBe(10000000.00);
    expect(dataDebt.reservaAgioSubscricaoBrl).toBe(60000000.00);
    expect(dataDebt.ganhoExtincaoDividaDrebBrl).toBe(30000000.00); // 100M - 70M = 30M Ganho DRE
    expect(dataDebt.partidasDobrada.length).toBe(4);
    expect(dataDebt.diagnosticoIcpc09).toContain('GANHO RECONHECIDO NA DRE: R$ 30000000.00');
  });
});
