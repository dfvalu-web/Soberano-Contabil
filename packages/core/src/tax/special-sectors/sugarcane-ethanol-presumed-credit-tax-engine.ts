import { Result, Ok, Err } from '../../types/result.js';

export interface SugarcaneEthanolInput {
  usinaId: string;
  usinaNome: string;
  valorAquisicaoCanaProdutorRuralBrl: number;
  percentualCreditoPresumidoPercent?: number; // 50% ou 60% da alíquota de 9,25% (Padrão 50% = 4,625%)
}

export interface SugarcaneEthanolResult {
  usinaId: string;
  usinaNome: string;
  valorAquisicaoCanaProdutorRuralBrl: number;
  aliquotaEfetivaCreditoPresumidoPercent: number; // 4.625%
  valorCreditoPresumidoPisCofinsBrl: number; // Compensável via PER/DCOMP
  valorCreditoPisBrl: number; // 0.825%
  valorCreditoCofinsBrl: number; // 3.800%
  diagnosticoFiscal: string;
}

export function processSugarcaneEthanolPresumedCreditTaxEngine(input: SugarcaneEthanolInput): Result<SugarcaneEthanolResult, Error> {
  const {
    usinaId,
    usinaNome,
    valorAquisicaoCanaProdutorRuralBrl,
    percentualCreditoPresumidoPercent = 50.0 // 50% de 9,25% = 4,625%
  } = input;

  if (valorAquisicaoCanaProdutorRuralBrl <= 0) {
    return Err(new Error('Valor de aquisição de cana-de-açúcar deve ser superior a zero.'));
  }

  // Lei nº 12.865/2013 Art. 31 e Lei nº 12.058/2009:
  // A pessoa jurídica que industrializa produtos agroindustriais (etanol/açúcar)
  // pode descontar créditos presumidos de PIS e COFINS sobre o valor da cana adquirida de pessoa física.
  // Alíquota: 50% de 1,65% PIS (0,825%) e 50% de 7,60% COFINS (3,800%) = 4,625% total.
  const aliquotaPis = Number((0.0165 * (percentualCreditoPresumidoPercent / 100)).toFixed(5));
  const aliquotaCofins = Number((0.0760 * (percentualCreditoPresumidoPercent / 100)).toFixed(5));
  const aliquotaTotal = Number((aliquotaPis + aliquotaCofins).toFixed(5));

  const valorPis = Number((valorAquisicaoCanaProdutorRuralBrl * aliquotaPis).toFixed(2));
  const valorCofins = Number((valorAquisicaoCanaProdutorRuralBrl * aliquotaCofins).toFixed(2));
  const totalCredito = Number((valorPis + valorCofins).toFixed(2));

  const diag = 'Agroindústria Canavieira & Etanol (Lei nº 12.865/2013 Art. 31): ' + usinaNome + '. Aquisição de Cana de Produtor Rural: R$ ' + valorAquisicaoCanaProdutorRuralBrl.toFixed(2) + '. CRÉDITO PRESUMIDO AGROINDUSTRIAL (' + (aliquotaTotal * 100).toFixed(3) + '%): PIS R$ ' + valorPis.toFixed(2) + ' + COFINS R$ ' + valorCofins.toFixed(2) + ' = Total R$ ' + totalCredito.toFixed(2) + ' (Compensável via PER/DCOMP).';

  return Ok({
    usinaId,
    usinaNome,
    valorAquisicaoCanaProdutorRuralBrl,
    aliquotaEfetivaCreditoPresumidoPercent: Number((aliquotaTotal * 100).toFixed(3)),
    valorCreditoPresumidoPisCofinsBrl: totalCredito,
    valorCreditoPisBrl: valorPis,
    valorCreditoCofinsBrl: valorCofins,
    diagnosticoFiscal: diag
  });
}
