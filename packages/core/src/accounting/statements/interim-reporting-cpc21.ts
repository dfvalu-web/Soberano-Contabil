import { Result, Ok, Err } from '../../types/result.js';

export interface InterimPeriodInput {
  periodoTrimestre: 1 | 2 | 3 | 4;
  anoExercicio: number;
  receitaLiquidaTrimestre: number;
  lucroAntesImpostosTrimestre: number;
  aliquotaEfetivaEstimadaAnoCompletoPercent: number; // e.g. 28.5%
  despesasSazonaisDiferidas: number;
}

export interface InterimPeriodResult {
  periodoTrimestre: number;
  anoExercicio: number;
  receitaLiquidaTrimestre: number;
  lucroAntesImpostosTrimestre: number;
  despesaProvisaoIrpjCsllTrimestre: number;
  lucroLiquidoIntermediarioTrimestre: number;
  aliquotaEfetivaAplicada: number;
  diagnosticoCpc21: string;
}

export function calculateInterimFinancialStatements(input: InterimPeriodInput): Result<InterimPeriodResult, Error> {
  const {
    periodoTrimestre,
    anoExercicio,
    receitaLiquidaTrimestre,
    lucroAntesImpostosTrimestre,
    aliquotaEfetivaEstimadaAnoCompletoPercent
  } = input;

  if (receitaLiquidaTrimestre <= 0) {
    return Err(new Error('Receita líquida do período intermediário deve ser superior a zero.'));
  }

  // CPC 21 item 30(c): O tributo sobre o lucro em período intermediário deve ser apurado
  // com base na melhor estimativa da taxa média anual ponderada de imposto de renda esperada.
  const despesaTributo = Number((lucroAntesImpostosTrimestre * (aliquotaEfetivaEstimadaAnoCompletoPercent / 100)).toFixed(2));
  const lucroLiquido = Number((lucroAntesImpostosTrimestre - despesaTributo).toFixed(2));

  const diagnostico = 'Demonstração Intermediária ' + periodoTrimestre + 'T/' + anoExercicio + ' (CPC 21 R1): Aplicada alíquota efetiva média ponderada estimada de ' + aliquotaEfetivaEstimadaAnoCompletoPercent.toFixed(2) + '%, apurando provisão de R$ ' + despesaTributo.toFixed(2) + ' e lucro líquido condensado de R$ ' + lucroLiquido.toFixed(2) + '.';

  return Ok({
    periodoTrimestre,
    anoExercicio,
    receitaLiquidaTrimestre,
    lucroAntesImpostosTrimestre,
    despesaProvisaoIrpjCsllTrimestre: despesaTributo,
    lucroLiquidoIntermediarioTrimestre: lucroLiquido,
    aliquotaEfetivaAplicada: aliquotaEfetivaEstimadaAnoCompletoPercent,
    diagnosticoCpc21: diagnostico
  });
}
