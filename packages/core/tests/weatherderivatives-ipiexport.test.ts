import { describe, it, expect } from 'vitest';
import {
  evaluateWeatherDerivativesClimateSwapsCpc48,
  processIpiExportPresumedCreditLaw9363,
  unwrap
} from '../src/index.js';

describe('TESTES: Derivativos Climáticos (CPC 48) & Crédito Presumido IPI Exportação (Lei 9.363/96)', () => {
  it('1. Deve apurar payoff e resultado de derivativo climatico de precipitacao pluvial (CPC 48 FVTPL)', () => {
    const resWeather = evaluateWeatherDerivativesClimateSwapsCpc48({
      contratoId: 'WEATH-AGRO-01',
      contraparteNome: 'Banco Global de Seguros & Derivativos S.A.',
      tipoIndiceClimatico: 'INDICE_PRECIPITACAO_CHUVA_MM',
      indiceStrikeContratado: 400, // 400 mm
      indiceEfetivoApurado: 250, // 250 mm -> Déficit = 150 mm
      multiplicadorFinanceiroPorPontoBrl: 5000.00, // 150 * 5000 = 750.000 Payoff
      premioPagoAntecipadoBrl: 100000.00 // Prêmio = 100k -> Líquido = 650k
    });

    const dataWeather = unwrap(resWeather);
    expect(dataWeather.payoffLiquidacaoFinanceiraBrl).toBe(750000.00);
    expect(dataWeather.resultadoLiquidoDrebBrl).toBe(650000.00);
    expect(dataWeather.partidasDobrada.length).toBe(2);
    expect(dataWeather.diagnosticoCpc48).toContain('CPC 48 / FVTPL');
  });

  it('2. Deve apurar credito presumido de IPI para ressarcimento de PIS/COFINS na exportacao (Lei 9.363/96)', () => {
    const resIpi = processIpiExportPresumedCreditLaw9363({
      empresaId: 'EXP-AGRO-01',
      empresaExportadoraNome: 'Soberano Açúcar, Etanol & Bioenergia S.A.',
      produtoExportadoDescricao: 'Açúcar VHP a Granel',
      receitaExportacaoBrl: 80000000.00, // 80M
      receitaOperacionalBrutaTotalBrl: 100000000.00, // 100M -> CE = 80%
      custoTotalAquisicaoInsumosNacionaisBrl: 50000000.00, // 50M * 80% = 40M Base Insumos
      aliquotaPresumidaPadraoPercent: 5.37 // 40M * 5.37% = 2.148.000 Crédito
    });

    const dataIpi = unwrap(resIpi);
    expect(dataIpi.coeficienteExportacaoPercent).toBe(80.00);
    expect(dataIpi.baseCalculoInsumosExportacaoBrl).toBe(40000000.00);
    expect(dataIpi.valorCreditoPresumidoIpiRessarcimentoBrl).toBe(2148000.00);
    expect(dataIpi.diagnosticoFiscal).toContain('CRÉDITO PRESUMIDO DE IPI (5.37%)');
  });
});
