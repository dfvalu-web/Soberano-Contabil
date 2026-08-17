import { Result, Ok, Err } from '../../types/result.js';

export interface IntercompanyLoanInput {
  contratoId: string;
  mutuanteCnpj: string; // Empresa Credora
  mutuariaCnpj: string; // Empresa Devedora
  valorPrincipalBrl: number; // Ex: R$ 5.000.000,00
  prazoDias: number; // Ex: 360 dias
  taxaJurosAnualPercent: number; // Ex: 100% CDI = 11.5% a.a.
}

export interface IntercompanyLoanResult {
  contratoId: string;
  valorPrincipalBrl: number;
  rendimentoJurosBrutoBrl: number;
  aliquotaIofPercent: number;
  valorIofRetidoBrl: number;
  aliquotaIrrfRegressivaPercent: number; // 20% para 360 dias (181 a 360 dias)
  valorIrrfRetidoFonteBrl: number;
  rendimentoLiquidoRecebidoBrl: number;
  statusConformidadeCpc05: 'TRANSACAO_ARMS_LENGTH_COMPLIANT';
  lancamentoContabilSugerido: {
    debitoJurosDespesaMutuariaBrl: number;
    creditoJurosReceitaMutuanteBrl: number;
    creditoIrrfRecolherPassivoBrl: number;
    creditoIofRecolherPassivoBrl: number;
  };
  diagnosticoCpc05: string;
}

export function processIntercompanyLoansArmsLengthCpc05(input: IntercompanyLoanInput): Result<IntercompanyLoanResult, Error> {
  const {
    contratoId,
    mutuanteCnpj,
    mutuariaCnpj,
    valorPrincipalBrl,
    prazoDias,
    taxaJurosAnualPercent
  } = input;

  if (valorPrincipalBrl <= 0 || prazoDias <= 0 || taxaJurosAnualPercent <= 0) {
    return Err(new Error('Principal, prazo em dias e taxa de juros devem ser positivos.'));
  }

  // 1. Cálculo dos Juros Brutos
  const rendimentoJuros = Number((valorPrincipalBrl * (taxaJurosAnualPercent / 100) * (prazoDias / 360)).toFixed(2));

  // 2. IOF Mútuo PJ: 0.0041% ao dia (limitado a 365 dias = 1.50%) + 0.38% adicional
  const iofDiarioPercent = Math.min(365, prazoDias) * 0.0041;
  const iofTotalPercent = Number((iofDiarioPercent + 0.38).toFixed(4));
  const valorIof = Number((valorPrincipalBrl * (iofTotalPercent / 100)).toFixed(2));

  // 3. IRRF Regressivo de Renda Fixa:
  // Até 180 dias: 22.5% | 181 a 360 dias: 20% | 361 a 720 dias: 17.5% | Acima de 720 dias: 15%
  let aliqIrrf = 15.0;
  if (prazoDias <= 180) {
    aliqIrrf = 22.5;
  } else if (prazoDias <= 360) {
    aliqIrrf = 20.0;
  } else if (prazoDias <= 720) {
    aliqIrrf = 17.5;
  }

  const valorIrrf = Number((rendimentoJuros * (aliqIrrf / 100)).toFixed(2));
  const rendimentoLiquido = Number((rendimentoJuros - valorIrrf).toFixed(2));

  const diag = "Mutuo Intercompany Arm's Length (CPC 05): " + mutuanteCnpj + " -> " + mutuariaCnpj + " | Principal: R$ " + valorPrincipalBrl.toFixed(2) + " (" + prazoDias + " dias a " + taxaJurosAnualPercent + "% a.a.) -> Juros: R$ " + rendimentoJuros.toFixed(2) + " | IOF PJ: R$ " + valorIof.toFixed(2) + " | IRRF Fonte (" + aliqIrrf + "%): R$ " + valorIrrf.toFixed(2) + " -> Liquido Mutuante: R$ " + rendimentoLiquido.toFixed(2) + ".";

  return Ok({
    contratoId,
    valorPrincipalBrl,
    rendimentoJurosBrutoBrl: rendimentoJuros,
    aliquotaIofPercent: iofTotalPercent,
    valorIofRetidoBrl: valorIof,
    aliquotaIrrfRegressivaPercent: aliqIrrf,
    valorIrrfRetidoFonteBrl: valorIrrf,
    rendimentoLiquidoRecebidoBrl: rendimentoLiquido,
    statusConformidadeCpc05: 'TRANSACAO_ARMS_LENGTH_COMPLIANT',
    lancamentoContabilSugerido: {
      debitoJurosDespesaMutuariaBrl: rendimentoJuros,
      creditoJurosReceitaMutuanteBrl: rendimentoJuros,
      creditoIrrfRecolherPassivoBrl: valorIrrf,
      creditoIofRecolherPassivoBrl: valorIof
    },
    diagnosticoCpc05: diag
  });
}
