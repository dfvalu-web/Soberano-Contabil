import { Result, Ok, Err } from '../types/result.js';

export interface DividendDistributionInput {
  empresaCnpj: string;
  razaoSocial: string;
  lucroLiquidoExercicioBrl: number;
  capitalSocialBrl: number;
  saldoReservaLegalAtualBrl: number;
  percentualDistribuicaoSociosPercent: number; // Ex: 80% do lucro
}

export interface DividendDistributionResult {
  empresaCnpj: string;
  razaoSocial: string;
  valorConstituicaoReservaLegal5PercentBrl: number;
  valorLucroDisponivelDistribuicaoBrl: number;
  valorDividendosIsentosDistribuidosBrl: number;
  valorLucrosRetidosExpansaoPlBrl: number;
  partidaDobradaReservaLegal: string;
  partidaDobradaDistribuicaoDividendos: string;
  isencaoFiscalArt10Lei9249: true;
  statusDestinacao: 'LUCROS_DESTINADOS_DIVIDENDOS_ISENTOS_APURADOS';
  diagnosticoDestinacao: string;
}

export function processOfficeDividendDistributionDmplEngine(input: DividendDistributionInput): Result<DividendDistributionResult, Error> {
  const {
    empresaCnpj,
    razaoSocial,
    lucroLiquidoExercicioBrl,
    capitalSocialBrl,
    saldoReservaLegalAtualBrl,
    percentualDistribuicaoSociosPercent
  } = input;

  if (!empresaCnpj || lucroLiquidoExercicioBrl <= 0 || capitalSocialBrl <= 0) {
    return Err(new Error('CNPJ, lucro líquido positivo e capital social são obrigatórios.'));
  }

  // Teto da Reserva Legal = 20% do capital social (Art. 193 Lei 6.404/76)
  const tetoReservaLegal = (capitalSocialBrl * 20.0) / 100;
  const espacoReserva = Math.max(0, tetoReservaLegal - saldoReservaLegalAtualBrl);
  const reservaCalculada5Percent = (lucroLiquidoExercicioBrl * 5.0) / 100;
  const valorReservaLegal = Math.min(reservaCalculada5Percent, espacoReserva);

  const lucroAposReserva = lucroLiquidoExercicioBrl - valorReservaLegal;
  const dividendosDistribuidos = (lucroAposReserva * percentualDistribuicaoSociosPercent) / 100;
  const lucrosRetidosPl = lucroAposReserva - dividendosDistribuidos;

  const lancamentoReserva = "D - 2.4.03.001 Lucros Acumulados | C - 2.4.02.001 Reserva Legal no valor de R$ " + valorReservaLegal.toFixed(2);
  const lancamentoDividendos = "D - 2.4.03.001 Lucros Acumulados | C - 2.1.03.001 Dividendos a Pagar aos Sócios no valor de R$ " + dividendosDistribuidos.toFixed(2);

  const diag = "Destinação do Lucro (" + razaoSocial + "): Lucro: R$ " + lucroLiquidoExercicioBrl.toFixed(2) + " | Reserva Legal (5%): R$ " + valorReservaLegal.toFixed(2) + " | Dividendos Isentos aos Sócios (Lei 9.249/95): R$ " + dividendosDistribuidos.toFixed(2) + " | Retenção no PL: R$ " + lucrosRetidosPl.toFixed(2) + ".";

  return Ok({
    empresaCnpj,
    razaoSocial,
    valorConstituicaoReservaLegal5PercentBrl: parseFloat(valorReservaLegal.toFixed(2)),
    valorLucroDisponivelDistribuicaoBrl: parseFloat(lucroAposReserva.toFixed(2)),
    valorDividendosIsentosDistribuidosBrl: parseFloat(dividendosDistribuidos.toFixed(2)),
    valorLucrosRetidosExpansaoPlBrl: parseFloat(lucrosRetidosPl.toFixed(2)),
    partidaDobradaReservaLegal: lancamentoReserva,
    partidaDobradaDistribuicaoDividendos: lancamentoDividendos,
    isencaoFiscalArt10Lei9249: true,
    statusDestinacao: 'LUCROS_DESTINADOS_DIVIDENDOS_ISENTOS_APURADOS',
    diagnosticoDestinacao: diag
  });
}
