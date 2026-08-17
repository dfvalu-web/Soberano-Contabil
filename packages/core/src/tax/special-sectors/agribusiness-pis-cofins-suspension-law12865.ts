import { Result, Ok, Err } from '../../types/result.js';

export type AgriSupplierType = 'PRODUTOR_RURAL_PESSOA_FISICA' | 'COOPERATIVA_AGROPECUARIA' | 'PJ_LUCRO_REAL';

export interface AgribusinessPisCofinsInput {
  operacaoId: string;
  agroindustriaNome: string;
  tipoFornecedor: AgriSupplierType;
  valorAquisicaoGraosInNaturaBrl: number;
  percentualAliquotaCreditoPresumidoPercent?: number; // Ex: 50% ou 27% da alíquota básica (Art. 31 Lei 12.865/13)
}

export interface AgribusinessPisCofinsResult {
  operacaoId: string;
  agroindustriaNome: string;
  tipoFornecedor: AgriSupplierType;
  aquisicaoComSuspensaoPisCofins: boolean;
  aliquotaPisPresumidoPercent: number;
  valorCreditoPresumidoPisBrl: number;
  aliquotaCofinsPresumidoPercent: number;
  valorCreditoPresumidoCofinsBrl: number;
  totalCreditoPresumidoApuradoBrl: number;
  diagnosticoFiscal: string;
}

export function processAgribusinessPisCofinsSuspensionLaw12865(input: AgribusinessPisCofinsInput): Result<AgribusinessPisCofinsResult, Error> {
  const {
    operacaoId,
    agroindustriaNome,
    tipoFornecedor,
    valorAquisicaoGraosInNaturaBrl,
    percentualAliquotaCreditoPresumidoPercent = 50.0 // 50% de 1.65% e 7.60%
  } = input;

  if (valorAquisicaoGraosInNaturaBrl <= 0) {
    return Err(new Error('Valor de aquisição de grãos agropecuários deve ser superior a zero.'));
  }

  // Art. 9º da Lei nº 12.865/2013: Vendas de soja/cereais in natura por PF ou Cooperativa para PJ são com SUSPENSÃO de PIS/COFINS
  const isSuspensao = tipoFornecedor === 'PRODUTOR_RURAL_PESSOA_FISICA' || tipoFornecedor === 'COOPERATIVA_AGROPECUARIA';

  // Art. 31 da Lei nº 12.865/2013: Agroindústria tem direito a Crédito Presumido
  // Alíquota básica: PIS 1.65% e COFINS 7.60% * (percentual / 100)
  const fator = percentualAliquotaCreditoPresumidoPercent / 100;
  const aliqPisPresumido = Number((1.65 * fator).toFixed(4));
  const aliqCofinsPresumido = Number((7.60 * fator).toFixed(4));

  const credPis = Number((valorAquisicaoGraosInNaturaBrl * (aliqPisPresumido / 100)).toFixed(2));
  const credCofins = Number((valorAquisicaoGraosInNaturaBrl * (aliqCofinsPresumido / 100)).toFixed(2));
  const totalCredito = Number((credPis + credCofins).toFixed(2));

  const diag = 'Agroindústria (Art. 9º e 31 da Lei nº 12.865/13): Aquisição R$ ' + valorAquisicaoGraosInNaturaBrl.toFixed(2) + ' de ' + tipoFornecedor + '. ' + (isSuspensao ? 'OPERAÇÃO COM SUSPENSÃO DE PIS/COFINS. ' : 'OPERAÇÃO NORMAL. ') + 'Crédito Presumido (' + percentualAliquotaCreditoPresumidoPercent + '% da básica): PIS (' + aliqPisPresumido + '%: R$ ' + credPis.toFixed(2) + ') + COFINS (' + aliqCofinsPresumido + '%: R$ ' + credCofins.toFixed(2) + ') = Total R$ ' + totalCredito.toFixed(2) + ' (Ressarcível via PER/DCOMP).';

  return Ok({
    operacaoId,
    agroindustriaNome,
    tipoFornecedor,
    aquisicaoComSuspensaoPisCofins: isSuspensao,
    aliquotaPisPresumidoPercent: aliqPisPresumido,
    valorCreditoPresumidoPisBrl: credPis,
    aliquotaCofinsPresumidoPercent: aliqCofinsPresumido,
    valorCreditoPresumidoCofinsBrl: credCofins,
    totalCreditoPresumidoApuradoBrl: totalCredito,
    diagnosticoFiscal: diag
  });
}
