import { Result, Ok, Err } from '../../types/result.js';

export type TaxRegimeType = 'LUCRO_PRESUMIDO' | 'LUCRO_REAL';

export interface UsedVehicleSaleInput {
  operacaoId: string;
  concessionariaNome: string;
  veiculoDescricao: string; // Ex: 'Toyota Corolla Cross 2022'
  valorVendaNotaFiscalBrl: number;
  custoAquisicaoVeiculoBrl: number;
  regimeTributario?: TaxRegimeType;
}

export interface UsedVehicleSaleResult {
  operacaoId: string;
  concessionariaNome: string;
  veiculoDescricao: string;
  valorVendaNotaFiscalBrl: number;
  custoAquisicaoVeiculoBrl: number;
  margemBrutaSpreadBrl: number; // Base de Cálculo Real (Art. 5º Lei 9.716/98)
  valorIrpjDevidoBrl: number;
  valorCsllDevidaBrl: number;
  valorPisDevidoBrl: number;
  valorCofinsDevidoBrl: number;
  totalTributosIncidentesBrl: number;
  economiaTributariaVsFaturamentoBrutoBrl: number;
  diagnosticoFiscal: string;
}

export function processUsedVehiclesConsignmentTaxEngine(input: UsedVehicleSaleInput): Result<UsedVehicleSaleResult, Error> {
  const {
    operacaoId,
    concessionariaNome,
    veiculoDescricao,
    valorVendaNotaFiscalBrl,
    custoAquisicaoVeiculoBrl,
    regimeTributario = 'LUCRO_PRESUMIDO'
  } = input;

  if (valorVendaNotaFiscalBrl <= 0 || custoAquisicaoVeiculoBrl < 0) {
    return Err(new Error('Valor de venda e custo do veículo devem ser válidos.'));
  }

  // Art. 5º da Lei nº 9.716/1998 e IN RFB nº 1.700/2017:
  // As operações de venda de veículos usados adquiridos para revenda são equiparadas a consignação mercantil.
  // A receita bruta tributável para IRPJ, CSLL, PIS e COFINS é a DIFERENÇA entre o preço de venda e o custo de aquisição (SPREAD).
  const spreadMargemBruta = Number((Math.max(0, valorVendaNotaFiscalBrl - custoAquisicaoVeiculoBrl)).toFixed(2));

  // No Lucro Presumido (Equiparação a Serviços/Consignação):
  // IRPJ: Base = 32% do Spread | Alíquota = 15% (Efetivo 4.80% sobre o Spread)
  // CSLL: Base = 32% do Spread | Alíquota = 9% (Efetivo 2.88% sobre o Spread)
  // PIS: 0.65% sobre o Spread
  // COFINS: 3.00% sobre o Spread
  const basePresumida = spreadMargemBruta * 0.32;
  const irpj = Number((basePresumida * 0.15).toFixed(2));
  const csll = Number((basePresumida * 0.09).toFixed(2));
  const pis = Number((spreadMargemBruta * 0.0065).toFixed(2));
  const cofins = Number((spreadMargemBruta * 0.0300).toFixed(2));
  const totalImpostos = Number((irpj + csll + pis + cofins).toFixed(2));

  // Simulação se fosse tributado sobre o faturamento total da NF (Comércio Normal 8% IRPJ / 12% CSLL / PIS / COFINS sobre NF)
  const baseIrpjCheia = valorVendaNotaFiscalBrl * 0.08;
  const baseCsllCheia = valorVendaNotaFiscalBrl * 0.12;
  const irpjCheio = baseIrpjCheia * 0.15;
  const csllCheia = baseCsllCheia * 0.09;
  const pisCheio = valorVendaNotaFiscalBrl * 0.0065;
  const cofinsCheio = valorVendaNotaFiscalBrl * 0.0300;
  const totalCheio = irpjCheio + csllCheia + pisCheio + cofinsCheio;

  const economia = Number((Math.max(0, totalCheio - totalImpostos)).toFixed(2));

  const diag = 'Veículos Usados (Art. 5º Lei nº 9.716/98): ' + concessionariaNome + ' - ' + veiculoDescricao + '. Venda NF: R$ ' + valorVendaNotaFiscalBrl.toFixed(2) + ' - Custo: R$ ' + custoAquisicaoVeiculoBrl.toFixed(2) + ' = Spread Tributável: R$ ' + spreadMargemBruta.toFixed(2) + '. Tributos (IRPJ R$ ' + irpj.toFixed(2) + ' + CSLL R$ ' + csll.toFixed(2) + ' + PIS/COFINS R$ ' + (pis + cofins).toFixed(2) + '): Total R$ ' + totalImpostos.toFixed(2) + '. ECONOMIA TRIBUTÁRIA: R$ ' + economia.toFixed(2) + ' vs tributação cheia.';

  return Ok({
    operacaoId,
    concessionariaNome,
    veiculoDescricao,
    valorVendaNotaFiscalBrl,
    custoAquisicaoVeiculoBrl,
    margemBrutaSpreadBrl: spreadMargemBruta,
    valorIrpjDevidoBrl: irpj,
    valorCsllDevidaBrl: csll,
    valorPisDevidoBrl: pis,
    valorCofinsDevidoBrl: cofins,
    totalTributosIncidentesBrl: totalImpostos,
    economiaTributariaVsFaturamentoBrutoBrl: economia,
    diagnosticoFiscal: diag
  });
}
