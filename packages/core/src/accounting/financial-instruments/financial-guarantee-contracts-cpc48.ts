import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export interface FinancialGuaranteeInput {
  garantiaId: string;
  afiancadoNome: string; // Ex: 'Subsidiária Integral Delta Logística S.A.'
  valorGarantidoTotalBrl: number;
  premioGarantiaRecebidoBrl: number;
  mesesVigenciaTotal: number;
  mesesDecorridos: number;
  probabilidadeInadimplenciaPercent: number; // PD: Ex 2.5%
  perdaDadaInadimplenciaPercent: number;     // LGD: Ex 40.0%
}

export interface FinancialGuaranteeResult {
  garantiaId: string;
  afiancadoNome: string;
  saldoPremioNaoAmortizadoBrl: number;
  receitaAmortizadaAcumuladaBrl: number;
  perdaEsperadaEclBrl: number;
  passivoMensuracaoSubsequenteBrl: number;
  criterioMensuracaoAdotado: 'MAIOR_VALOR_SALDO_PREMIO_RECEITA' | 'MAIOR_VALOR_PROVISAO_ECL';
  partidasDobradaGarantia: JournalEntryLine[];
  diagnosticoCpc48: string;
}

export function evaluateFinancialGuaranteeContractCpc48(input: FinancialGuaranteeInput): Result<FinancialGuaranteeResult, Error> {
  const {
    garantiaId,
    afiancadoNome,
    valorGarantidoTotalBrl,
    premioGarantiaRecebidoBrl,
    mesesVigenciaTotal,
    mesesDecorridos,
    probabilidadeInadimplenciaPercent,
    perdaDadaInadimplenciaPercent
  } = input;

  if (valorGarantidoTotalBrl <= 0 || premioGarantiaRecebidoBrl <= 0 || mesesVigenciaTotal <= 0) {
    return Err(new Error('Valores da garantia, prêmio e vigência devem ser superiores a zero.'));
  }

  const amortRatio = Math.min(1, mesesDecorridos / mesesVigenciaTotal);
  const receitaAmortizada = Number((premioGarantiaRecebidoBrl * amortRatio).toFixed(2));
  const saldoNaoAmortizado = Number((premioGarantiaRecebidoBrl - receitaAmortizada).toFixed(2));

  // Cálculo da Perda de Crédito Esperada (ECL = EAD * PD * LGD)
  const pd = probabilidadeInadimplenciaPercent / 100;
  const lgd = perdaDadaInadimplenciaPercent / 100;
  const ecl = Number((valorGarantidoTotalBrl * pd * lgd).toFixed(2));

  // Mensuração Subsequente pelo MAIOR valor (CPC 48 Item 4.2.1 c)
  const isEclMaior = ecl > saldoNaoAmortizado;
  const passivoFinal = isEclMaior ? ecl : saldoNaoAmortizado;
  const criterio = isEclMaior ? 'MAIOR_VALOR_PROVISAO_ECL' : 'MAIOR_VALOR_SALDO_PREMIO_RECEITA';

  const partidas: JournalEntryLine[] = [];

  // Amortização da Receita de Garantia
  if (receitaAmortizada > 0) {
    partidas.push({
      accountId: '2.1.4.08',
      accountCode: '2.1.4.08',
      accountName: 'Passivo de Garantias Financeiras Emitidas - Receita Diferida (CPC 48 / CPC 47)',
      type: 'DEBIT',
      amount: receitaAmortizada
    });
    partidas.push({
      accountId: '3.1.1.12',
      accountCode: '3.1.1.12',
      accountName: 'Receita de Honorários de Garantias e Avais Prestados (Resultado - CPC 48)',
      type: 'CREDIT',
      amount: receitaAmortizada
    });
  }

  // Se ECL for maior, provisiona o complemento de perda no resultado
  if (isEclMaior) {
    const complementoEcl = Number((ecl - saldoNaoAmortizado).toFixed(2));
    partidas.push({
      accountId: '3.1.2.98',
      accountCode: '3.1.2.98',
      accountName: 'Despesa com Perda Esperada em Garantias Financeiras - ECL (Resultado - CPC 48)',
      type: 'DEBIT',
      amount: complementoEcl
    });
    partidas.push({
      accountId: '2.1.5.20',
      accountCode: '2.1.5.20',
      accountName: 'Provisão para Perdas em Contratos de Garantia Financeira (Passivo Circulante - CPC 48)',
      type: 'CREDIT',
      amount: complementoEcl
    });
  }

  const diag = 'CPC 48 / IFRS 9 (Garantias Financeiras Emitidas): Afiançado ' + afiancadoNome + '. Valor Garantido: R$ ' + valorGarantidoTotalBrl.toFixed(2) + '. Saldo Prêmio Não Amortizado: R$ ' + saldoNaoAmortizado.toFixed(2) + ' vs ECL: R$ ' + ecl.toFixed(2) + '. Passivo Mensurado pelo ' + criterio + ' no valor de R$ ' + passivoFinal.toFixed(2) + '.';

  return Ok({
    garantiaId,
    afiancadoNome,
    saldoPremioNaoAmortizadoBrl: saldoNaoAmortizado,
    receitaAmortizadaAcumuladaBrl: receitaAmortizada,
    perdaEsperadaEclBrl: ecl,
    passivoMensuracaoSubsequenteBrl: passivoFinal,
    criterioMensuracaoAdotado: criterio,
    partidasDobradaGarantia: partidas,
    diagnosticoCpc48: diag
  });
}
