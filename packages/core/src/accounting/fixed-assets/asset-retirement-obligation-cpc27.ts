import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export interface AssetRetirementInput {
  ativoId: string;
  descricaoAtivo: string; // Ex: 'Plataforma de Produção Petrolífera Offshore P-78'
  custoAquisicaoConstrucaoDiretoBrl: number;
  custoFuturoEstimadoDesmantelamentoBrl: number;
  vidaUtilAnos: number;
  taxaDescontoAnualPercent: number; // Ex: 8% a.a.
}

export interface AssetRetirementResult {
  ativoId: string;
  descricaoAtivo: string;
  valorPresenteDesmantelamentoCapitalizadoBrl: number;
  custoTotalInicialImobilizadoBrl: number;
  saldoInicialPassivoDesativacaoBrl: number;
  depreciacaoAnualTotalBrl: number;
  despesaFinanceiraAno1UnwindingBrl: number;
  partidasDobradaReconhecimentoInicial: JournalEntryLine[];
  partidasDobradaExercicioAno1: JournalEntryLine[];
  diagnosticoCpc27: string;
}

export function evaluateAssetRetirementObligationCpc27(input: AssetRetirementInput): Result<AssetRetirementResult, Error> {
  const {
    ativoId,
    descricaoAtivo,
    custoAquisicaoConstrucaoDiretoBrl,
    custoFuturoEstimadoDesmantelamentoBrl,
    vidaUtilAnos,
    taxaDescontoAnualPercent
  } = input;

  if (custoAquisicaoConstrucaoDiretoBrl <= 0 || custoFuturoEstimadoDesmantelamentoBrl <= 0 || vidaUtilAnos <= 0) {
    return Err(new Error('Custos e vida útil do ativo devem ser superiores a zero.'));
  }

  const taxaProp = taxaDescontoAnualPercent / 100;
  // VP = Custo Futuro / ((1 + r)^n)
  const fatorDesconto = Math.pow(1 + taxaProp, vidaUtilAnos);
  const valorPresenteDesmantelamento = Number((custoFuturoEstimadoDesmantelamentoBrl / fatorDesconto).toFixed(2));
  const custoTotalImobilizado = Number((custoAquisicaoConstrucaoDiretoBrl + valorPresenteDesmantelamento).toFixed(2));

  // Depreciação anual linear
  const depreciacaoAnual = Number((custoTotalImobilizado / vidaUtilAnos).toFixed(2));

  // Despesa Financeira Ano 1 (Unwinding of Discount) = VP * taxa
  const despesaFinanceiraAno1 = Number((valorPresenteDesmantelamento * taxaProp).toFixed(2));

  const partidasInicial: JournalEntryLine[] = [];

  // Lançamento Inicial: D: Imobilizado (Direto + ARO) / C: Caixa / C: Provisão para Desativação (PNC)
  partidasInicial.push({
    accountId: '1.2.3.01',
    accountCode: '1.2.3.01',
    accountName: 'Imobilizado em Operação - Ativo Principal (Ativo Não Circulante - CPC 27)',
    type: 'DEBIT',
    amount: custoAquisicaoConstrucaoDiretoBrl
  });
  partidasInicial.push({
    accountId: '1.2.3.18',
    accountCode: '1.2.3.18',
    accountName: 'Custo de Desmantelamento e Restauração Ambiental Capitalizado (Ativo Não Circulante - CPC 27 / ICPC 12)',
    type: 'DEBIT',
    amount: valorPresenteDesmantelamento
  });
  partidasInicial.push({
    accountId: '1.1.1.02',
    accountCode: '1.1.1.02',
    accountName: 'Banco Conta Movimento / Fornecedores (Ativo/Passivo)',
    type: 'CREDIT',
    amount: custoAquisicaoConstrucaoDiretoBrl
  });
  partidasInicial.push({
    accountId: '2.2.3.10',
    accountCode: '2.2.3.10',
    accountName: 'Provisão para Desativação de Ativos e Restauração Ambiental - ARO (Passivo Não Circulante - CPC 25 / ICPC 12)',
    type: 'CREDIT',
    amount: valorPresenteDesmantelamento
  });

  const partidasAno1: JournalEntryLine[] = [];
  // Depreciação: D: Depreciação (Resultado) / C: Depreciação Acumulada
  partidasAno1.push({
    accountId: '3.1.2.05',
    accountCode: '3.1.2.05',
    accountName: 'Despesa de Depreciação (Resultado - CPC 27)',
    type: 'DEBIT',
    amount: depreciacaoAnual
  });
  partidasAno1.push({
    accountId: '1.2.3.90',
    accountCode: '1.2.3.90',
    accountName: 'Depreciação Acumulada (Ativo Não Circulante - CPC 27)',
    type: 'CREDIT',
    amount: depreciacaoAnual
  });

  // Juros ARO: D: Despesa Financeira / C: Provisão Desativação (PNC)
  partidasAno1.push({
    accountId: '3.1.5.08',
    accountCode: '3.1.5.08',
    accountName: 'Despesa Financeira - Atualização a Valor Presente ARO (Resultado - ICPC 12)',
    type: 'DEBIT',
    amount: despesaFinanceiraAno1
  });
  partidasAno1.push({
    accountId: '2.2.3.10',
    accountCode: '2.2.3.10',
    accountName: 'Provisão para Desativação de Ativos e Restauração Ambiental - ARO (Passivo Não Circulante - ICPC 12)',
    type: 'CREDIT',
    amount: despesaFinanceiraAno1
  });

  const diag = 'CPC 27 (Item 16c) & ICPC 12 / IFRIC 1 (Asset Retirement Obligations): Ativo ' + descricaoAtivo + '. Custo Futuro de Desativação em ' + vidaUtilAnos + ' anos: R$ ' + custoFuturoEstimadoDesmantelamentoBrl.toFixed(2) + '. Valor Presente Capitalizado no Imobilizado: R$ ' + valorPresenteDesmantelamento.toFixed(2) + ' (Custo Total: R$ ' + custoTotalImobilizado.toFixed(2) + '). Depreciação anual: R$ ' + depreciacaoAnual.toFixed(2) + '. Despesa financeira de juros no Ano 1: R$ ' + despesaFinanceiraAno1.toFixed(2) + '.';

  return Ok({
    ativoId,
    descricaoAtivo,
    valorPresenteDesmantelamentoCapitalizadoBrl: valorPresenteDesmantelamento,
    custoTotalInicialImobilizadoBrl: custoTotalImobilizado,
    saldoInicialPassivoDesativacaoBrl: valorPresenteDesmantelamento,
    depreciacaoAnualTotalBrl: depreciacaoAnual,
    despesaFinanceiraAno1UnwindingBrl: despesaFinanceiraAno1,
    partidasDobradaReconhecimentoInicial: partidasInicial,
    partidasDobradaExercicioAno1: partidasAno1,
    diagnosticoCpc27: diag
  });
}
