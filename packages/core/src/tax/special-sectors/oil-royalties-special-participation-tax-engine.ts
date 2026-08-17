import { Result, Ok, Err } from '../../types/result.js';

export interface OilRoyaltiesInput {
  campoProducaoId: string;
  concessionariaNome: string; // Ex: 'Petróleo & Gás Soberano S.A.'
  campoNome: string; // Ex: 'Campo Offshore de Búzios / Pré-Sal'
  volumeProducaoBarrisBoe: number; // Volume em Barris Equivalentes de Petróleo (BOE)
  precoReferenciaAnpBrlPorBoe: number; // Preço de Referência fixado pela ANP
  aliquotaRoyaltiesPercent?: number; // Padrão 10% (Art. 47 Lei 9.478/97)
  custosOperacionaisOpexBrl?: number; // Para Participação Especial
  depreciacaoTrimestralCapexBrl?: number; // Para Participação Especial
  aliquotaParticipacaoEspecialPercent?: number; // De 10% a 40% (Art. 50 Lei 9.478/97)
}

export interface OilRoyaltiesResult {
  campoProducaoId: string;
  concessionariaNome: string;
  campoNome: string;
  valorBrutoProducaoAnpBrl: number;
  aliquotaRoyaltiesPercent: number;
  valorRoyaltiesDevidosAnpBrl: number;
  baseCalculoParticipacaoEspecialBrl: number;
  aliquotaParticipacaoEspecialPercent: number;
  valorParticipacaoEspecialDevidaBrl: number;
  totalParticipacoesGovernamentaisBrl: number;
  diagnosticoFiscal: string;
}

export function processOilRoyaltiesSpecialParticipationTaxEngine(input: OilRoyaltiesInput): Result<OilRoyaltiesResult, Error> {
  const {
    campoProducaoId,
    concessionariaNome,
    campoNome,
    volumeProducaoBarrisBoe,
    precoReferenciaAnpBrlPorBoe,
    aliquotaRoyaltiesPercent = 10.0,
    custosOperacionaisOpexBrl = 0,
    depreciacaoTrimestralCapexBrl = 0,
    aliquotaParticipacaoEspecialPercent = 0 // Se campo de grande produção (ex: 20%)
  } = input;

  if (volumeProducaoBarrisBoe <= 0 || precoReferenciaAnpBrlPorBoe <= 0) {
    return Err(new Error('Volume e preço de referência da ANP devem ser superiores a zero.'));
  }

  // 1. Valor Bruto da Produção (VBP) = Volume (BOE) * Preço de Referência ANP
  const vbp = Number((volumeProducaoBarrisBoe * precoReferenciaAnpBrlPorBoe).toFixed(2));

  // 2. Royalties da ANP (Art. 47 Lei nº 9.478/1997): Alíquota sobre o VBP
  const valorRoyalties = Number((vbp * (aliquotaRoyaltiesPercent / 100)).toFixed(2));

  // 3. Participação Especial (Art. 50 Lei nº 9.478/1997 & Dec. nº 2.705/1998):
  // Base de Cálculo = VBP - Deduções Legais (Royalties Pagos + Opex Operacional + Depreciação Capex)
  let basePE = 0;
  let valorPE = 0;

  if (aliquotaParticipacaoEspecialPercent > 0) {
    const deducoesLegais = valorRoyalties + custosOperacionaisOpexBrl + depreciacaoTrimestralCapexBrl;
    basePE = Number((Math.max(0, vbp - deducoesLegais)).toFixed(2));
    valorPE = Number((basePE * (aliquotaParticipacaoEspecialPercent / 100)).toFixed(2));
  }

  const totalParticipacoes = Number((valorRoyalties + valorPE).toFixed(2));

  const diag = 'Petróleo e Gás (Lei nº 9.478/97 & Dec. nº 2.705/98): ' + concessionariaNome + ' - ' + campoNome + '. Produção: ' + volumeProducaoBarrisBoe.toLocaleString('pt-BR') + ' BOE x R$ ' + precoReferenciaAnpBrlPorBoe.toFixed(2) + ' = VBP R$ ' + vbp.toFixed(2) + '. Royalties ANP (' + aliquotaRoyaltiesPercent + '%): R$ ' + valorRoyalties.toFixed(2) + ' | Participação Especial (' + aliquotaParticipacaoEspecialPercent + '%): R$ ' + valorPE.toFixed(2) + ' (Total Governamental: R$ ' + totalParticipacoes.toFixed(2) + ').';

  return Ok({
    campoProducaoId,
    concessionariaNome,
    campoNome,
    valorBrutoProducaoAnpBrl: vbp,
    aliquotaRoyaltiesPercent,
    valorRoyaltiesDevidosAnpBrl: valorRoyalties,
    baseCalculoParticipacaoEspecialBrl: basePE,
    aliquotaParticipacaoEspecialPercent,
    valorParticipacaoEspecialDevidaBrl: valorPE,
    totalParticipacoesGovernamentaisBrl: totalParticipacoes,
    diagnosticoFiscal: diag
  });
}
