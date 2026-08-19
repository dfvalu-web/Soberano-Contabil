import { Result, Ok, Err } from '../types/result.js';

export interface AnnualClosingInput {
  clienteCnpj: string;
  razaoSocial: string;
  anoExercicio: number; // Ex: 2026
  capitalSocialIntegralizadoBrl: number;
  saldoReservaLegalAnteriorBrl: number;
  totalReceitasExercicioBrl: number;
  totalDespesasCustosExercicioBrl: number;
  percentualDividendosDistribuidosPercent: number; // Ex: 25% ou 50%
}

export interface AnnualClosingResult {
  clienteCnpj: string;
  razaoSocial: string;
  anoExercicio: number;
  lucroLiquidoExercicioBrl: number;
  constituicaoReservaLegal5Brl: number;
  totalDividendosDistribuidosBrl: number;
  saldoRetencaoLucrosInvestimentosBrl: number;
  statusFechamento: 'EXERCICIO_CONTABIL_ENCERRADO_COM_SUCESSO';
  diagnosticoFechamento: string;
}

export function processOfficeAnnualAccountingClosingEngine(input: AnnualClosingInput): Result<AnnualClosingResult, Error> {
  const {
    clienteCnpj,
    razaoSocial,
    anoExercicio,
    capitalSocialIntegralizadoBrl,
    saldoReservaLegalAnteriorBrl,
    totalReceitasExercicioBrl,
    totalDespesasCustosExercicioBrl,
    percentualDividendosDistribuidosPercent
  } = input;

  if (!clienteCnpj || totalReceitasExercicioBrl <= 0 || anoExercicio < 2020) {
    return Err(new Error('CNPJ, receitas positivas e ano de exercício válido são obrigatórios.'));
  }

  const lucroLiquido = totalReceitasExercicioBrl - totalDespesasCustosExercicioBrl;
  if (lucroLiquido <= 0) {
    return Ok({
      clienteCnpj,
      razaoSocial,
      anoExercicio,
      lucroLiquidoExercicioBrl: parseFloat(lucroLiquido.toFixed(2)),
      constituicaoReservaLegal5Brl: 0,
      totalDividendosDistribuidosBrl: 0,
      saldoRetencaoLucrosInvestimentosBrl: 0,
      statusFechamento: 'EXERCICIO_CONTABIL_ENCERRADO_COM_SUCESSO',
      diagnosticoFechamento: "Encerramento Anual (" + razaoSocial + " - " + anoExercicio + "): Prejuízo Contábil Apurado de R$ " + Math.abs(lucroLiquido).toLocaleString('pt-BR') + ". Sem destinação de lucros."
    });
  }

  // Reserva Legal: 5% do Lucro Líquido, limitada a 20% do Capital Social (Art. 193 Lei 6.404/76)
  const tetoReservaLegal = capitalSocialIntegralizadoBrl * 0.20;
  const espacoReserva = Math.max(0, tetoReservaLegal - saldoReservaLegalAnteriorBrl);
  const reservaLegalCalculada = lucroLiquido * 0.05;
  const reservaLegalEfetiva = Math.min(reservaLegalCalculada, espacoReserva);

  const baseCalculoDividendos = lucroLiquido - reservaLegalEfetiva;
  const dividendos = (baseCalculoDividendos * percentualDividendosDistribuidosPercent) / 100;
  const retencaoLucros = baseCalculoDividendos - dividendos;

  const diag = "Encerramento Anual (" + razaoSocial + " - " + anoExercicio + "): Lucro Líquido: R$ " + lucroLiquido.toLocaleString('pt-BR') + " | Reserva Legal (5%): R$ " + reservaLegalEfetiva.toLocaleString('pt-BR') + " | Dividendos: R$ " + dividendos.toLocaleString('pt-BR') + " | Retenção/Investimentos: R$ " + retencaoLucros.toLocaleString('pt-BR') + " -> Partidas de encerramento geradas.";

  return Ok({
    clienteCnpj,
    razaoSocial,
    anoExercicio,
    lucroLiquidoExercicioBrl: parseFloat(lucroLiquido.toFixed(2)),
    constituicaoReservaLegal5Brl: parseFloat(reservaLegalEfetiva.toFixed(2)),
    totalDividendosDistribuidosBrl: parseFloat(dividendos.toFixed(2)),
    saldoRetencaoLucrosInvestimentosBrl: parseFloat(retencaoLucros.toFixed(2)),
    statusFechamento: 'EXERCICIO_CONTABIL_ENCERRADO_COM_SUCESSO',
    diagnosticoFechamento: diag
  });
}
