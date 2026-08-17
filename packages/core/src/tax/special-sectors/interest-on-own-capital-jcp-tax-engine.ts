import { Result, Ok, Err } from '../../types/result.js';

export interface JcpTaxInput {
  empresaCnpj: string;
  anoCalendario: number;
  capitalSocialIntegralizadoBrl: number; // Ex: R$ 20.000.000,00
  reservasDeLucrosElegiveisBrl: number; // Ex: R$ 10.000.000,00
  reservaIncentivosFiscaisExcluidasLei14789Brl: number; // Ex: R$ 2.000.000,00 (Não entra na base)
  taxaTlpTjlpAnualPercent: number; // Ex: 6.80% a.a.
  lucroLiquidoExercicioAntesJcpBrl: number; // Ex: R$ 6.000.000,00 (Limite 50% = R$ 3M)
  lucrosAcumuladosEReservasBrl: number; // Ex: R$ 10.000.000,00 (Limite 50% = R$ 5M)
}

export interface JcpTaxResult {
  empresaCnpj: string;
  anoCalendario: number;
  patrimonioLiquidoAjustadoBaseJcpBrl: number;
  valorJcpCalculadoPelaTlpBrl: number;
  limiteDedutibilidadeLucroExercicioBrl: number; // 50% do lucro do ano
  valorJcpDedutivelMaximoBrl: number;
  economiaTributariaIrpjCsllBrl: number; // 34% (25% IRPJ + 9% CSLL)
  irrfRetidoFonte15PercentBrl: number; // 15% de IRRF
  ganhoFiscalLiquidoEfetivoBrl: number; // Economia (34%) - IRRF (15%) = 19%
  statusDedutibilidade: 'JCP_DEDUTIVEL_LUCRO_REAL_CONFORME';
  escrituracaoEcfBlocoM300: {
    registroM300ExclusaoJcp: string;
    valorExclusaoLalur: number;
  };
  diagnosticoJcp: string;
}

export function processInterestOnOwnCapitalJcpTaxEngine(input: JcpTaxInput): Result<JcpTaxResult, Error> {
  const {
    empresaCnpj,
    anoCalendario,
    capitalSocialIntegralizadoBrl,
    reservasDeLucrosElegiveisBrl,
    reservaIncentivosFiscaisExcluidasLei14789Brl,
    taxaTlpTjlpAnualPercent,
    lucroLiquidoExercicioAntesJcpBrl,
    lucrosAcumuladosEReservasBrl
  } = input;

  if (capitalSocialIntegralizadoBrl <= 0 || taxaTlpTjlpAnualPercent <= 0) {
    return Err(new Error('Capital social e taxa TLP devem ser positivos.'));
  }

  // 1. Base de Cálculo do PL Ajustado conforme Lei 14.789/2023 (Exclui Reservas de Incentivos e Reavaliação)
  const plAjustado = Number((capitalSocialIntegralizadoBrl + reservasDeLucrosElegiveisBrl - reservaIncentivosFiscaisExcluidasLei14789Brl).toFixed(2));

  // 2. JCP Calculado = PL Ajustado * Taxa TLP pró-rata
  const jcpCalculado = Number((plAjustado * (taxaTlpTjlpAnualPercent / 100)).toFixed(2));

  // 3. Limites de Dedutibilidade Legal (Art. 9º da Lei 9.249/95):
  // Maior entre 50% do Lucro do Exercício antes do JCP ou 50% dos Lucros Acumulados e Reservas de Lucro
  const limiteLucroExercicio = Number((lucroLiquidoExercicioAntesJcpBrl * 0.50).toFixed(2));
  const limiteLucrosAcumulados = Number((lucrosAcumuladosEReservasBrl * 0.50).toFixed(2));
  const limiteMaximoDedutivel = Math.max(limiteLucroExercicio, limiteLucrosAcumulados);

  // Valor Efetivamente Dedutível
  const jcpDedutivel = Math.min(jcpCalculado, limiteMaximoDedutivel);

  // 4. Economia Tributária (34% IRPJ + CSLL) vs Retenção de IRRF (15%)
  const economiaFiscalIrpjCsll = Number((jcpDedutivel * 0.34).toFixed(2));
  const irrfRetido = Number((jcpDedutivel * 0.15).toFixed(2));
  const ganhoLiquido = Number((economiaFiscalIrpjCsll - irrfRetido).toFixed(2)); // Ganho real de 19% líquido

  const diag = "Juros sobre o Capital Proprio (Lei 9.249/95 & Lei 14.789/23): CNPJ " + empresaCnpj + " (" + anoCalendario + ") | PL Ajustado: R$ " + plAjustado.toFixed(2) + " (TLP " + taxaTlpTjlpAnualPercent + "%) -> JCP Dedutivel: R$ " + jcpDedutivel.toFixed(2) + " | Economia IRPJ/CSLL (34%): R$ " + economiaFiscalIrpjCsll.toFixed(2) + " - IRRF (15%): R$ " + irrfRetido.toFixed(2) + " -> Ganho Tributario Liquido: R$ " + ganhoLiquido.toFixed(2) + ".";

  return Ok({
    empresaCnpj,
    anoCalendario,
    patrimonioLiquidoAjustadoBaseJcpBrl: plAjustado,
    valorJcpCalculadoPelaTlpBrl: jcpCalculado,
    limiteDedutibilidadeLucroExercicioBrl: limiteLucroExercicio,
    valorJcpDedutivelMaximoBrl: jcpDedutivel,
    economiaTributariaIrpjCsllBrl: economiaFiscalIrpjCsll,
    irrfRetidoFonte15PercentBrl: irrfRetido,
    ganhoFiscalLiquidoEfetivoBrl: ganhoLiquido,
    statusDedutibilidade: 'JCP_DEDUTIVEL_LUCRO_REAL_CONFORME',
    escrituracaoEcfBlocoM300: {
      registroM300ExclusaoJcp: 'M300_EXCLUSAO_JCP_ART9_LEI9249',
      valorExclusaoLalur: jcpDedutivel
    },
    diagnosticoJcp: diag
  });
}
