import { Result, Ok, Err } from '../../types/result.js';

export type BiofuelSegmentType = 'PRODUTOR_FABRICANTE_BIODIESEL' | 'IMPORTADOR_BIODIESEL' | 'DISTRIBUIDORA_POSTO_COMBUSTIVEL';
export type SocialFuelStampCategoryType = 'COM_SELO_COMBUSTIVEL_SOCIAL' | 'SEM_SELO_COMBUSTIVEL_SOCIAL';

export interface BiodieselTaxInput {
  operacaoId: string;
  segmento: BiofuelSegmentType;
  categoriaSeloSocial: SocialFuelStampCategoryType;
  volumeMetrosCubicosM3: number; // Volume em m³ (1 m³ = 1.000 litros)
  precoTotalVendaBrl: number;
}

export interface BiodieselTaxResult {
  operacaoId: string;
  segmento: BiofuelSegmentType;
  categoriaSeloSocial: SocialFuelStampCategoryType;
  aliquotaPisAdRemPorM3Brl: number;
  aliquotaCofinsAdRemPorM3Brl: number;
  pisMonofasicoDevidoBrl: number;
  cofinsMonofasicoDevidoBrl: number;
  totalTributosDevidosBrl: number;
  tributacaoVarejoZero: boolean;
  diagnosticoFiscal: string;
}

export function processBiodieselEthanolMonophasicTaxEngine(input: BiodieselTaxInput): Result<BiodieselTaxResult, Error> {
  const {
    operacaoId,
    segmento,
    categoriaSeloSocial,
    volumeMetrosCubicosM3,
    precoTotalVendaBrl
  } = input;

  if (volumeMetrosCubicosM3 <= 0 || precoTotalVendaBrl <= 0) {
    return Err(new Error('Volume e preço da operação de biodiesel devem ser superiores a zero.'));
  }

  if (segmento === 'PRODUTOR_FABRICANTE_BIODIESEL' || segmento === 'IMPORTADOR_BIODIESEL') {
    // Alíquotas Ad Rem da Lei nº 11.116/2005 (Art. 5º):
    // Alíquota Básica: PIS R$ 25,50/m³ e COFINS R$ 117,50/m³ (Total R$ 143,00/m³)
    // Com Selo Combustível Social (Agricultura Familiar): Redução de 68% (PIS R$ 8,16/m³ e COFINS R$ 37,60/m³ = Total R$ 45,76/m³)
    let aliqPisM3 = 25.50;
    let aliqCofinsM3 = 117.50;

    if (categoriaSeloSocial === 'COM_SELO_COMBUSTIVEL_SOCIAL') {
      aliqPisM3 = 8.16;
      aliqCofinsM3 = 37.60;
    }

    const pis = Number((volumeMetrosCubicosM3 * aliqPisM3).toFixed(2));
    const cofins = Number((volumeMetrosCubicosM3 * aliqCofinsM3).toFixed(2));
    const total = Number((pis + cofins).toFixed(2));

    const diag = 'Produtor de Biodiesel (Lei nº 11.116/2005): ' + volumeMetrosCubicosM3 + ' m³ (' + categoriaSeloSocial + '). PIS Ad Rem (R$ ' + aliqPisM3.toFixed(2) + '/m³: R$ ' + pis.toFixed(2) + ') e COFINS Ad Rem (R$ ' + aliqCofinsM3.toFixed(2) + '/m³: R$ ' + cofins.toFixed(2) + ') totalizando R$ ' + total.toFixed(2) + ' recolhidos na usina (CST 02).';

    return Ok({
      operacaoId,
      segmento,
      categoriaSeloSocial,
      aliquotaPisAdRemPorM3Brl: aliqPisM3,
      aliquotaCofinsAdRemPorM3Brl: aliqCofinsM3,
      pisMonofasicoDevidoBrl: pis,
      cofinsMonofasicoDevidoBrl: cofins,
      totalTributosDevidosBrl: total,
      tributacaoVarejoZero: false,
      diagnosticoFiscal: diag
    });
  } else {
    // Distribuidoras e Postos de Combustíveis: Alíquota ZERO (CST 04)
    const diag = 'Distribuidora / Posto Varejista: Biodiesel. CST 04 (Operação Tributável Monofásica - Revenda a Alíquota Zero nos termos do Art. 3º da Lei nº 11.116/2005).';

    return Ok({
      operacaoId,
      segmento,
      categoriaSeloSocial,
      aliquotaPisAdRemPorM3Brl: 0,
      aliquotaCofinsAdRemPorM3Brl: 0,
      pisMonofasicoDevidoBrl: 0,
      cofinsMonofasicoDevidoBrl: 0,
      totalTributosDevidosBrl: 0,
      tributacaoVarejoZero: true,
      diagnosticoFiscal: diag
    });
  }
}
