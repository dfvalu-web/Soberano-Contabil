import { Result, Ok, Err } from '../../types/result.js';

export interface JcpCalculationInput {
  patrimonioLiquidoAjustado: number; // PL excluindo reservas de reavaliação não realizadas
  taxaTjlpAnualPercent: number; // e.g. 0.075 (7.5% a.a.)
  mesesProporcional: number; // 1 a 12
  lucroExercicioAntesJcp: number;
  lucrosAcumuladosEReservasDeLucros: number;
}

export interface JcpCalculationResult {
  limiteTjlpSobrePl: number;
  limiteLucroExercicio50Percent: number;
  limiteLucrosAcumulados50Percent: number;
  valorMaximoJcpDedutivel: number;
  irrfRetidoNaFonte15Percent: number;
  jcpLiquidoAosSocios: number;
  economiaTributariaIrpjCsll34Percent: number;
  vantagemFinanceiraLiquida: number;
}

export function calculateJcp(input: JcpCalculationInput): Result<JcpCalculationResult, Error> {
  const {
    patrimonioLiquidoAjustado,
    taxaTjlpAnualPercent,
    mesesProporcional = 12,
    lucroExercicioAntesJcp,
    lucrosAcumuladosEReservasDeLucros
  } = input;

  if (patrimonioLiquidoAjustado <= 0) {
    return Err(new Error('Patrimonio Liquido ajustado deve ser positivo para calculo de JCP.'));
  }

  // Limite 1: Aplicação da TJLP sobre o PL ajustado (pro rata tempore)
  const fatorTempo = mesesProporcional / 12;
  const limiteTjlpSobrePl = Number((patrimonioLiquidoAjustado * taxaTjlpAnualPercent * fatorTempo).toFixed(2));

  // Limite 2: Maior entre 50% do Lucro Líquido do Exercício (antes do JCP) e 50% dos Lucros Acumulados + Reservas
  const limiteLucroExercicio50Percent = Number((Math.max(0, lucroExercicioAntesJcp) * 0.50).toFixed(2));
  const limiteLucrosAcumulados50Percent = Number((Math.max(0, lucrosAcumuladosEReservasDeLucros) * 0.50).toFixed(2));
  const limiteLucroOuReservas = Math.max(limiteLucroExercicio50Percent, limiteLucrosAcumulados50Percent);

  // O valor máximo dedutível é o menor entre o limite TJLP e o limite de Lucro/Reservas
  const valorMaximoJcpDedutivel = Number(Math.min(limiteTjlpSobrePl, limiteLucroOuReservas).toFixed(2));

  // Retenção de IRRF de 15% exclusiva na fonte (Art. 9º da Lei nº 9.249/1995)
  const irrfRetidoNaFonte15Percent = Number((valorMaximoJcpDedutivel * 0.15).toFixed(2));
  const jcpLiquidoAosSocios = Number((valorMaximoJcpDedutivel - irrfRetidoNaFonte15Percent).toFixed(2));

  // Economia Fiscal na PJ (dedução de IRPJ 25% + CSLL 9% = 34%)
  const economiaTributariaIrpjCsll34Percent = Number((valorMaximoJcpDedutivel * 0.34).toFixed(2));
  const vantagemFinanceiraLiquida = Number((economiaTributariaIrpjCsll34Percent - irrfRetidoNaFonte15Percent).toFixed(2));

  return Ok({
    limiteTjlpSobrePl,
    limiteLucroExercicio50Percent,
    limiteLucrosAcumulados50Percent,
    valorMaximoJcpDedutivel,
    irrfRetidoNaFonte15Percent,
    jcpLiquidoAosSocios,
    economiaTributariaIrpjCsll34Percent,
    vantagemFinanceiraLiquida
  });
}

// Tributos Diferidos (CPC 32 / IAS 12)
export interface DeferredTaxInput {
  diferencasTemporariasAdicoes: number; // e.g. provisões indedutíveis no momento, dedutíveis no futuro
  diferencasTemporariasExclusoes: number; // e.g. depreciação acelerada incentivada
  prejuizoFiscalCompensavelFuturo: number;
  aliquotaIrpjCsllCombinada?: number; // padrão 0.34 (34%)
}

export interface DeferredTaxResult {
  ativoFiscalDiferido: number;
  passivoFiscalDiferido: number;
  efeitoLiquidoResultado: number;
}

export function calculateDeferredTaxes(input: DeferredTaxInput): Result<DeferredTaxResult, Error> {
  const {
    diferencasTemporariasAdicoes,
    diferencasTemporariasExclusoes,
    prejuizoFiscalCompensavelFuturo,
    aliquotaIrpjCsllCombinada = 0.34
  } = input;

  const baseAtivoDiferido = diferencasTemporariasAdicoes + prejuizoFiscalCompensavelFuturo;
  const ativoFiscalDiferido = Number((baseAtivoDiferido * aliquotaIrpjCsllCombinada).toFixed(2));

  const passivoFiscalDiferido = Number((diferencasTemporariasExclusoes * aliquotaIrpjCsllCombinada).toFixed(2));
  const efeitoLiquidoResultado = Number((ativoFiscalDiferido - passivoFiscalDiferido).toFixed(2));

  return Ok({
    ativoFiscalDiferido,
    passivoFiscalDiferido,
    efeitoLiquidoResultado
  });
}
