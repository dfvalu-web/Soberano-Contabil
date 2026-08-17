import { Result, Ok, Err } from '../../types/result.js';

export type CprTipo = 'CPR_FISICA_MERCADORIA' | 'CPR_FINANCEIRA_LIQUIDACAO' | 'CPR_VERDE_SERVICOS_AMBIENTAIS';

export interface CprTaxInput {
  numeroCpr: string;
  tipoCpr: CprTipo;
  emitenteCpfCnpj: string;
  valorNominalEmissaoBrl: number; // Ex: R$ 5.000.000,00
  prazoVencimentoDias: number; // Ex: 360 dias
  taxaJurosOuRendimentoAnualPercent: number; // Ex: 12.0% a.a.
  tipoInvestidor: 'PESSOA_FISICA' | 'PESSOA_JURIDICA';
}

export interface CprTaxResult {
  numeroCpr: string;
  tipoCpr: CprTipo;
  valorNominalEmissaoBrl: number;
  rendimentoBrutoResgateBrl: number;
  aliquotaIofPercent: number; // 0% (Isenção total)
  aliquotaIrrfPercent: number; // 0% para PF / 20% para PJ (360 dias)
  valorIrrfRetidoFonteBrl: number;
  valorLiquidoResgatadoBrl: number;
  isencaoIofFundamentoLegal: string;
  statusTributario: 'CPR_ISENCAO_IOF_E_TRIBUTACAO_REGRESSIVA_CONFORME';
  diagnosticoCpr: string;
}

export function processCprRuralProductNoteTaxEngine(input: CprTaxInput): Result<CprTaxResult, Error> {
  const {
    numeroCpr,
    tipoCpr,
    emitenteCpfCnpj,
    valorNominalEmissaoBrl,
    prazoVencimentoDias,
    taxaJurosOuRendimentoAnualPercent,
    tipoInvestidor
  } = input;

  if (valorNominalEmissaoBrl <= 0 || prazoVencimentoDias <= 0) {
    return Err(new Error('Valor nominal e prazo de vencimento da CPR devem ser positivos.'));
  }

  // 1. Rendimento Bruto
  const rendimentoBruto = Number((valorNominalEmissaoBrl * (taxaJurosOuRendimentoAnualPercent / 100) * (prazoVencimentoDias / 360)).toFixed(2));

  // 2. IOF: Isenção Integral para CPR (Lei 8.929/94 Art. 19 e Decreto 6.306/07)
  const aliqIof = 0.0;

  // 3. IRRF:
  // Pessoa Física: 0% de IR (Art. 3º da Lei nº 11.033/2004)
  // Pessoa Jurídica: Tabela Regressiva de Renda Fixa (20% para 360 dias)
  let aliqIrrf = 0.0;
  if (tipoInvestidor === 'PESSOA_JURIDICA') {
    if (prazoVencimentoDias <= 180) {
      aliqIrrf = 22.5;
    } else if (prazoVencimentoDias <= 360) {
      aliqIrrf = 20.0;
    } else if (prazoVencimentoDias <= 720) {
      aliqIrrf = 17.5;
    } else {
      aliqIrrf = 15.0;
    }
  }

  const valorIrrf = Number((rendimentoBruto * (aliqIrrf / 100)).toFixed(2));
  const valorLiquidoResgate = Number((valorNominalEmissaoBrl + rendimentoBruto - valorIrrf).toFixed(2));

  const fundLegal = 'Artigo 19 da Lei nº 8.929/1994, Lei nº 13.986/2020 e Artigo 3º da Lei nº 11.033/2004';

  const diag = "Cedula de Produto Rural (" + tipoCpr + "): CPR " + numeroCpr + " (Emitente " + emitenteCpfCnpj + ") | Emissao: R$ " + valorNominalEmissaoBrl.toFixed(2) + " (" + prazoVencimentoDias + " dias a " + taxaJurosOuRendimentoAnualPercent + "% a.a.) -> Rendimento: R$ " + rendimentoBruto.toFixed(2) + " | IOF: 0% (Isencao) | IRRF (" + tipoInvestidor + " - " + aliqIrrf + "%): R$ " + valorIrrf.toFixed(2) + " -> Resgate Liquido: R$ " + valorLiquidoResgate.toFixed(2) + ".";

  return Ok({
    numeroCpr,
    tipoCpr,
    valorNominalEmissaoBrl,
    rendimentoBrutoResgateBrl: rendimentoBruto,
    aliquotaIofPercent: aliqIof,
    aliquotaIrrfPercent: aliqIrrf,
    valorIrrfRetidoFonteBrl: valorIrrf,
    valorLiquidoResgatadoBrl: valorLiquidoResgate,
    isencaoIofFundamentoLegal: fundLegal,
    statusTributario: 'CPR_ISENCAO_IOF_E_TRIBUTACAO_REGRESSIVA_CONFORME',
    diagnosticoCpr: diag
  });
}
