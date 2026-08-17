import { describe, it, expect } from 'vitest';
import {
  processShoppingMallVariableLeaseCpc06,
  processFiiRealEstateFundsTaxEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Arrendamento em Shopping Centers (CPC 06 R2) & Tributação de FIIs (Lei 14.754/23)', () => {
  it('1. Deve segregar Aluguel Minimo Garantido (AMG no Passivo) vs Parcela Variavel de Vendas (na DRE) (CPC 06 R2)', () => {
    const resMall = processShoppingMallVariableLeaseCpc06({
      lojaId: 'LOJA-MEGA-01',
      lojistaNome: 'Soberano Megastore Varejo S.A.',
      shoppingNome: 'Shopping Soberano Plaza',
      prazoContratoMeses: 60,
      aluguelMinimoMensalGarantidoAmgBrl: 50000.00, // AMG 50k
      percentualAluguelFaturamentoPercent: 6.0, // 6%
      faturamentoMensalLojaBrl: 1500000.00 // 1.5M vendas -> 90k aluguel calculado (50k AMG + 40k DRE)
    });

    const dataMall = unwrap(resMall);
    expect(dataMall.valorPassivoArrendamentoAmgInicialBrl).toBe(3000000.00); // 50k * 60
    expect(dataMall.aluguelTotalCalculadoMesBrl).toBe(90000.00);
    expect(dataMall.despesaArrendamentoVariavelExcedenteDreBrl).toBe(40000.00);
    expect(dataMall.despesaAmortizacaoDireitoUsoMensalBrl).toBe(50000.00);
    expect(dataMall.lancamentosContabeisMes.length).toBe(2);
    expect(dataMall.diagnosticoCpc06).toContain('AMG: R$ 50000.00 + Variavel DRE: R$ 40000.00');
  });

  it('2. Deve verificar distribuicao obrigatoria de 95% e isencao de IRRF PF com mais de 100 cotistas (Lei 14.754/23)', () => {
    const resFii = processFiiRealEstateFundsTaxEngine({
      fundoId: 'FII-LOG-01',
      fundoNome: 'Soberano Logística & Renda FII',
      semestreCompetencia: '2026-1S',
      lucroSemestralRegimeCaixaBrl: 20000000.00, // 20M
      totalCotistas: 12500, // > 100 cotistas
      cotasNegociadasEmBolsaB3: true,
      ganhoCapitalAlienacaoCotasBrl: 1000000.00 // 1M ganho -> 200k IRRF
    });

    const dataFii = unwrap(resFii);
    expect(dataFii.distribuicaoObrigatoria95PercentBrl).toBe(19000000.00); // 95% de 20M
    expect(dataFii.isencaoRendimentosPessoaFisicaAprovada).toBe(true);
    expect(dataFii.aliquotaIrrfRendimentosPfPercent).toBe(0);
    expect(dataFii.irrfGanhoCapitalAlienacaoCotas20PercentBrl).toBe(200000.00);
    expect(dataFii.diagnosticoFii).toContain('ISENCAO IRRF PF: APROVADA (Aliquota 0%)');
  });
});
