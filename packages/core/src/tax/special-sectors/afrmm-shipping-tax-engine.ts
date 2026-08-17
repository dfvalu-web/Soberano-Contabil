import { Result, Ok, Err } from '../../types/result.js';

export type MaritimeNavigationType = 'LONGO_CURSO' | 'CABOTAGEM' | 'FLUVIAL_LACUSTRE_NORTE_NORDESTE';
export type ShippingSpecialConditionType = 'OPERACAO_GERAL' | 'DESTINACAO_ZONA_FRANCA_MANAUS' | 'EMBARCACAO_REGISTRO_REB';

export interface AfrmmShippingTaxInput {
  conhecimentoEmbarqueId: string;
  tipoNavegacao: MaritimeNavigationType;
  condicaoEspecial: ShippingSpecialConditionType;
  valorFreteMaritimoBrl: number;
}

export interface AfrmmShippingTaxResult {
  conhecimentoEmbarqueId: string;
  tipoNavegacao: MaritimeNavigationType;
  condicaoEspecial: ShippingSpecialConditionType;
  isIsentoOuSuspenso: boolean;
  aliquotaAfrmmPercent: number;
  valorAfrmmDevidoBrl: number;
  integracaoCustoEstoqueBrl: number;
  diagnosticoFiscal: string;
}

export function processAfrmmShippingTaxEngine(input: AfrmmShippingTaxInput): Result<AfrmmShippingTaxResult, Error> {
  const {
    conhecimentoEmbarqueId,
    tipoNavegacao,
    condicaoEspecial,
    valorFreteMaritimoBrl
  } = input;

  if (valorFreteMaritimoBrl <= 0) {
    return Err(new Error('Valor do frete marítimo deve ser superior a zero.'));
  }

  // Isenção do AFRMM para ZFM/ALC e Embarcações REB (Lei 10.893/04 & Lei 14.301/22)
  if (condicaoEspecial === 'DESTINACAO_ZONA_FRANCA_MANAUS' || condicaoEspecial === 'EMBARCACAO_REGISTRO_REB') {
    const diag = 'AFRMM (Lei nº 10.893/04 & Lei nº 14.301/22 - BR do Mar): ' + conhecimentoEmbarqueId + '. ISENÇÃO / SUSPENSÃO APLICADA (' + condicaoEspecial + '). Alíquota 0% de AFRMM (R$ 0,00).';

    return Ok({
      conhecimentoEmbarqueId,
      tipoNavegacao,
      condicaoEspecial,
      isIsentoOuSuspenso: true,
      aliquotaAfrmmPercent: 0,
      valorAfrmmDevidoBrl: 0,
      integracaoCustoEstoqueBrl: 0,
      diagnosticoFiscal: diag
    });
  }

  // Alíquotas atualizadas pela Lei nº 14.301/2022 (BR do Mar):
  // 1. Longo Curso: 8%
  // 2. Cabotagem: 8%
  // 3. Fluvial e Lacustre (Granéis líquidos no Norte/Nordeste): 40%
  let aliqAfrmm = 8.0;

  if (tipoNavegacao === 'FLUVIAL_LACUSTRE_NORTE_NORDESTE') {
    aliqAfrmm = 40.0;
  }

  const valorAfrmm = Number((valorFreteMaritimoBrl * (aliqAfrmm / 100)).toFixed(2));

  const diag = 'AFRMM (Lei nº 10.893/04 & BR do Mar Lei nº 14.301/22): ' + conhecimentoEmbarqueId + ' (' + tipoNavegacao + '). Frete Marítimo R$ ' + valorFreteMaritimoBrl.toFixed(2) + '. AFRMM Devido (' + aliqAfrmm + '%): R$ ' + valorAfrmm.toFixed(2) + ' integrado ao custo de aquisição do estoque (CPC 16).';

  return Ok({
    conhecimentoEmbarqueId,
    tipoNavegacao,
    condicaoEspecial,
    isIsentoOuSuspenso: false,
    aliquotaAfrmmPercent: aliqAfrmm,
    valorAfrmmDevidoBrl: valorAfrmm,
    integracaoCustoEstoqueBrl: valorAfrmm,
    diagnosticoFiscal: diag
  });
}
