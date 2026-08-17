import { Result, Ok, Err } from '../../types/result.js';

export interface MoverProjectInput {
  empresaHabilitadaId: string;
  anoExercicio: number;
  dispendiosPDIInovacaoDescarbonizacaoBrl: number;
  habilitacaoRegimeMoverNumero: string;
  importacoesAutopeçasSemSimilarNacionalUsd: number;
  taxaCambialPtax: number;
}

export interface MoverProjectResult {
  empresaId: string;
  numeroHabilitacao: string;
  dispendiosTotaisPDI: number;
  creditoFinanceiroIrpjCsllGerado50Percent: number;
  isencaoImpostoImportacaoAutopeçasBrl: number;
  totalBeneficioMoverBrl: number;
  diagnosticoMover: string;
}

export function calculateMoverTaxIncentives(input: MoverProjectInput): Result<MoverProjectResult, Error> {
  const {
    empresaHabilitadaId,
    dispendiosPDIInovacaoDescarbonizacaoBrl,
    habilitacaoRegimeMoverNumero,
    importacoesAutopeçasSemSimilarNacionalUsd,
    taxaCambialPtax
  } = input;

  if (dispendiosPDIInovacaoDescarbonizacaoBrl <= 0) {
    return Err(new Error('Dispêndios em P&D para o Programa MOVER devem ser superiores a zero.'));
  }

  // 1. Crédito Financeiro de até 50% dos dispêndios de P&D qualificados (Lei nº 14.902/2024)
  const creditoFinanceiro = Number((dispendiosPDIInovacaoDescarbonizacaoBrl * 0.50).toFixed(2));

  // 2. Redução a 0% do II em autopeças sem similar nacional (Regime de Autopeças Não Produzidas)
  const importacaoCifBrl = importacoesAutopeçasSemSimilarNacionalUsd * taxaCambialPtax;
  const isencaoIi = Number((importacaoCifBrl * 0.16).toFixed(2)); // Alíquota padrão 16% zerada

  const totalBeneficio = Number((creditoFinanceiro + isencaoIi).toFixed(2));

  const diagnostico = 'Programa MOVER (Lei nº 14.902/2024 - Habilitação ' + habilitacaoRegimeMoverNumero + '): Crédito Financeiro apurado de R$ ' + creditoFinanceiro.toFixed(2) + ' para compensação com tributos federais e desoneração aduaneira de R$ ' + isencaoIi.toFixed(2) + '.';

  return Ok({
    empresaId: empresaHabilitadaId,
    numeroHabilitacao: habilitacaoRegimeMoverNumero,
    dispendiosTotaisPDI: dispendiosPDIInovacaoDescarbonizacaoBrl,
    creditoFinanceiroIrpjCsllGerado50Percent: creditoFinanceiro,
    isencaoImpostoImportacaoAutopeçasBrl: isencaoIi,
    totalBeneficioMoverBrl: totalBeneficio,
    diagnosticoMover: diagnostico
  });
}
