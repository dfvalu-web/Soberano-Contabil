import { Result, Ok, Err } from '../../types/result.js';

export type FreightOperationType = 'FRETE_SOBRE_VENDAS_ONUS_VENDEDOR' | 'FRETE_SOBRE_COMPRAS_INSUMOS' | 'SUBCONTRATACAO_DE_TRANSPORTE';
export type CarrierTaxRegimeType = 'LUCRO_REAL_NAO_CUMULATIVO' | 'LUCRO_PRESUMIDO_CUMULATIVO' | 'SIMPLES_NACIONAL';

export interface FreightTaxInput {
  cteNumero: string;
  tipoOperacaoFrete: FreightOperationType;
  regimeTomadorFrete: CarrierTaxRegimeType;
  valorTotalFreteCteBrl: number;
  aliquotaIcmsFretePercent?: number; // Ex: 12% ou 7% interestadual
  optanteCreditoOutorgadoIcms?: boolean; // Convênio ICMS 106/96 (20% de crédito outorgado)
}

export interface FreightTaxResult {
  cteNumero: string;
  tipoOperacaoFrete: FreightOperationType;
  creditoPisFreteBrl: number;
  creditoCofinsFreteBrl: number;
  totalCreditoPisCofinsBrl: number;
  debitoIcmsFreteBrl: number;
  creditoOutorgadoIcmsBrl: number;
  icmsLiquidoDevidoBrl: number;
  diagnosticoFiscal: string;
}

export function processFreightTransportationTaxEngine(input: FreightTaxInput): Result<FreightTaxResult, Error> {
  const {
    cteNumero,
    tipoOperacaoFrete,
    regimeTomadorFrete,
    valorTotalFreteCteBrl,
    aliquotaIcmsFretePercent = 12.0,
    optanteCreditoOutorgadoIcms = false
  } = input;

  if (valorTotalFreteCteBrl <= 0) {
    return Err(new Error('Valor total do frete CT-e deve ser superior a zero.'));
  }

  let credPis = 0;
  let credCofins = 0;

  // Lei nº 10.833/2003, Art. 3º, II e IX: Crédito de PIS (1,65%) e COFINS (7,60%) no Lucro Real
  if (regimeTomadorFrete === 'LUCRO_REAL_NAO_CUMULATIVO' && tipoOperacaoFrete !== 'SUBCONTRATACAO_DE_TRANSPORTE') {
    credPis = Number((valorTotalFreteCteBrl * 0.0165).toFixed(2));
    credCofins = Number((valorTotalFreteCteBrl * 0.0760).toFixed(2));
  }

  const totalPisCofins = Number((credPis + credCofins).toFixed(2));

  // ICMS Transporte:
  let debitoIcms = 0;
  let credOutorgado = 0;
  let icmsLiquido = 0;

  if (tipoOperacaoFrete !== 'SUBCONTRATACAO_DE_TRANSPORTE') {
    debitoIcms = Number((valorTotalFreteCteBrl * (aliquotaIcmsFretePercent / 100)).toFixed(2));
    if (optanteCreditoOutorgadoIcms) {
      // Convênio ICMS 106/1996: 20% de Crédito Outorgado sobre o ICMS devido
      credOutorgado = Number((debitoIcms * 0.20).toFixed(2));
      icmsLiquido = Number((debitoIcms - credOutorgado).toFixed(2));
    } else {
      icmsLiquido = debitoIcms;
    }
  }

  const diag = 'Setor de Transporte e Fretes (Lei nº 10.833/03 & Convênio ICMS 106/96): CT-e ' + cteNumero + ' (' + tipoOperacaoFrete + '). ' + (totalPisCofins > 0 ? 'Créditos Não Cumulativos de PIS (1,65%: R$ ' + credPis.toFixed(2) + ') e COFINS (7,60%: R$ ' + credCofins.toFixed(2) + ') totalizando R$ ' + totalPisCofins.toFixed(2) + '. ' : 'Sem crédito de PIS/COFINS. ') + (tipoOperacaoFrete === 'SUBCONTRATACAO_DE_TRANSPORTE' ? 'Subcontratação com ICMS e PIS/COFINS recolhidos na transportadora principal.' : 'ICMS devido: R$ ' + icmsLiquido.toFixed(2) + ' (Débito R$ ' + debitoIcms.toFixed(2) + (credOutorgado > 0 ? ' - Crédito Outorgado 20% R$ ' + credOutorgado.toFixed(2) : '') + ').');

  return Ok({
    cteNumero,
    tipoOperacaoFrete,
    creditoPisFreteBrl: credPis,
    creditoCofinsFreteBrl: credCofins,
    totalCreditoPisCofinsBrl: totalPisCofins,
    debitoIcmsFreteBrl: debitoIcms,
    creditoOutorgadoIcmsBrl: credOutorgado,
    icmsLiquidoDevidoBrl: icmsLiquido,
    diagnosticoFiscal: diag
  });
}
