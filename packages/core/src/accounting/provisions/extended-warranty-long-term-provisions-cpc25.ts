import { Result, Ok, Err } from '../../types/result.js';

export interface WarrantyValuationInput {
  contratoId: string;
  tipoGarantia: 'GARANTIA_LEGAL_FABRICA_CPC25' | 'GARANTIA_ESTENDIDA_CONTRATUAL_CPC47';
  volumeVendasBrl: number;
  prazoMeses: number; // Ex: 24 meses
  taxaSinistralidadeEsperadaPercent: number; // Ex: 3.5%
  taxaDescontoAvpAnualPercent: number; // Ex: 10.5% a.a.
}

export interface WarrantyValuationResult {
  contratoId: string;
  tipoGarantia: string;
  volumeVendasBrl: number;
  montanteTotalNominalBrl: number;
  ajusteValorPresenteAvpBrl: number;
  passivoProvisaoPresenteBrl: number;
  receitaDiferidaPassivoBrl: number;
  apropriacaoMensalDreBrl: number;
  diagnosticoGarantia: string;
}

export function processExtendedWarrantyLongTermProvisionsCpc25(input: WarrantyValuationInput): Result<WarrantyValuationResult, Error> {
  const {
    contratoId,
    tipoGarantia,
    volumeVendasBrl,
    prazoMeses,
    taxaSinistralidadeEsperadaPercent,
    taxaDescontoAvpAnualPercent
  } = input;

  if (volumeVendasBrl <= 0 || prazoMeses <= 0 || taxaSinistralidadeEsperadaPercent < 0) {
    return Err(new Error('Volume de vendas, prazo e taxa de sinistralidade devem ser positivos.'));
  }

  const anos = prazoMeses / 12;
  const taxaDescontoEfetiva = Math.pow(1 + taxaDescontoAvpAnualPercent / 100, anos) - 1;

  if (tipoGarantia === 'GARANTIA_LEGAL_FABRICA_CPC25') {
    // Provisão de fábrica: custo estimado a valor presente na data da venda (CPC 25)
    const nominal = Number((volumeVendasBrl * (taxaSinistralidadeEsperadaPercent / 100)).toFixed(2));
    const passivoPresente = Number((nominal / (1 + taxaDescontoEfetiva)).toFixed(2));
    const avp = Number((nominal - passivoPresente).toFixed(2));

    const diag = "Provisao de Garantia Legal (CPC 25): Contrato " + contratoId + " | Vendas: R$ " + volumeVendasBrl.toFixed(2) + " | Sinistralidade: " + taxaSinistralidadeEsperadaPercent + "% -> Provisao Nominal: R$ " + nominal.toFixed(2) + " (AVP Desconto: R$ " + avp.toFixed(2) + " -> Passivo Presente Reconhecido: R$ " + passivoPresente.toFixed(2) + ").";

    return Ok({
      contratoId,
      tipoGarantia,
      volumeVendasBrl,
      montanteTotalNominalBrl: nominal,
      ajusteValorPresenteAvpBrl: avp,
      passivoProvisaoPresenteBrl: passivoPresente,
      receitaDiferidaPassivoBrl: 0,
      apropriacaoMensalDreBrl: 0,
      diagnosticoGarantia: diag
    });
  } else {
    // Garantia estendida comercializada: receita diferida no passivo reconhecida linearmente (CPC 47)
    const receitaTotal = Number(volumeVendasBrl.toFixed(2));
    const mensal = Number((receitaTotal / prazoMeses).toFixed(2));

    const diag = "Garantia Estendida Contratual (CPC 47): Contrato " + contratoId + " | Receita Total Diferida no Passivo: R$ " + receitaTotal.toFixed(2) + " | Vigencia: " + prazoMeses + " meses -> Apropriacao Linear para DRE: R$ " + mensal.toFixed(2) + "/mes.";

    return Ok({
      contratoId,
      tipoGarantia,
      volumeVendasBrl,
      montanteTotalNominalBrl: receitaTotal,
      ajusteValorPresenteAvpBrl: 0,
      passivoProvisaoPresenteBrl: 0,
      receitaDiferidaPassivoBrl: receitaTotal,
      apropriacaoMensalDreBrl: mensal,
      diagnosticoGarantia: diag
    });
  }
}
