import { Result, Ok, Err } from '../../types/result.js';

export type FuelSegmentType = 'REFINARIA_IMPORTADOR_PRODUTOR' | 'DISTRIBUIDORA_TRR_POSTO_VAREJO';
export type FuelProductType = 'DIESEL_S10' | 'GASOLINA_COMUM' | 'GLP_GAS_COZINHA' | 'BIODIESEL_B100';

export interface FuelMonophasicInput {
  operacaoId: string;
  segmento: FuelSegmentType;
  tipoCombustivel: FuelProductType;
  quantidadeLitrosOuKg: number;
  valorTotalOperacaoBrl: number;
}

export interface FuelMonophasicResult {
  operacaoId: string;
  segmento: FuelSegmentType;
  tipoCombustivel: FuelProductType;
  cstIcmsUtilizado: string;
  aliquotaAdRemPorUnidadeBrl: number;
  icmsMonofasicoTotalBrl: number;
  pisMonofasicoTotalBrl: number;
  cofinsMonofasicoTotalBrl: number;
  tributacaoVarejoZero: boolean;
  diagnosticoFiscal: string;
}

export function processFuelsAndLubricantsMonophasicTaxEngine(input: FuelMonophasicInput): Result<FuelMonophasicResult, Error> {
  const {
    operacaoId,
    segmento,
    tipoCombustivel,
    quantidadeLitrosOuKg,
    valorTotalOperacaoBrl
  } = input;

  if (quantidadeLitrosOuKg <= 0 || valorTotalOperacaoBrl <= 0) {
    return Err(new Error('Quantidade de combustível e valor total devem ser superiores a zero.'));
  }

  // Alíquotas Oficiais Ad Rem (LC 192/2022 & Convênios ICMS 199/22 e 15/23)
  let aliquotaAdRem = 1.0635; // Diesel padrão
  if (tipoCombustivel === 'GASOLINA_COMUM') {
    aliquotaAdRem = 1.3721; // R$/litro
  } else if (tipoCombustivel === 'GLP_GAS_COZINHA') {
    aliquotaAdRem = 1.4139; // R$/kg
  } else if (tipoCombustivel === 'BIODIESEL_B100') {
    aliquotaAdRem = 1.0635;
  }

  if (segmento === 'REFINARIA_IMPORTADOR_PRODUTOR') {
    // Recolhimento Único na Origem (Monofásico Ad Rem) - CST 02
    const icmsMonofasico = Number((quantidadeLitrosOuKg * aliquotaAdRem).toFixed(2));
    const pisMono = Number((valorTotalOperacaoBrl * 0.0508).toFixed(2)); // Alíquota concentrada
    const cofinsMono = Number((valorTotalOperacaoBrl * 0.2344).toFixed(2));

    const diag = 'Refinaria/Produtor (LC 192/2022): Produto ' + tipoCombustivel + ' (' + quantidadeLitrosOuKg + ' unid). ICMS Monofásico Ad Rem (R$ ' + aliquotaAdRem.toFixed(4) + '/unid): R$ ' + icmsMonofasico.toFixed(2) + ' (CST 02). PIS/COFINS monofásico na origem recolhido.';

    return Ok({
      operacaoId,
      segmento,
      tipoCombustivel,
      cstIcmsUtilizado: '02',
      aliquotaAdRemPorUnidadeBrl: aliquotaAdRem,
      icmsMonofasicoTotalBrl: icmsMonofasico,
      pisMonofasicoTotalBrl: pisMono,
      cofinsMonofasicoTotalBrl: cofinsMono,
      tributacaoVarejoZero: false,
      diagnosticoFiscal: diag
    });
  } else {
    // Distribuidora, TRR e Posto de Combustíveis - CST 61 e Alíquota ZERO PIS/COFINS
    const diag = 'Revenda/Distribuição de Combustíveis: CST 61 (ICMS Monofásico Cobrado Anteriormente na Refinaria). ICMS Próprio: R$ 0,00. PIS/COFINS: Alíquota ZERO na revenda nos termos do Art. 2º da Lei nº 10.147/2000.';

    return Ok({
      operacaoId,
      segmento,
      tipoCombustivel,
      cstIcmsUtilizado: '61',
      aliquotaAdRemPorUnidadeBrl: aliquotaAdRem,
      icmsMonofasicoTotalBrl: 0,
      pisMonofasicoTotalBrl: 0,
      cofinsMonofasicoTotalBrl: 0,
      tributacaoVarejoZero: true,
      diagnosticoFiscal: diag
    });
  }
}
