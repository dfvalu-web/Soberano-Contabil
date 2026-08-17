import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export interface LiquidationBasisInput {
  entidadeId: string;
  razaoSocial: string;
  valorContabilHistoricoAtivosBrl: number;
  valorEstimadoRealizacaoLiquidacaoAtivosBrl: number; // Valor líquido realizável na venda forçada
  custosEstimadosLiquidacaoEncerramentoBrl: number; // Honorários, rescisões, leilão e multas contratuais
  passivoExigivelHistoricoBrl: number;
}

export interface LiquidationBasisResult {
  entidadeId: string;
  razaoSocial: string;
  ajusteDesvalorizacaoAtivosLiquidacaoBrl: number;
  totalAtivosBaseLiquidacaoBrl: number;
  provisaoCustosLiquidacaoBrl: number;
  totalPassivosBaseLiquidacaoBrl: number;
  patrimonioLiquidoLiquidacaoResidualBrl: number;
  partidasDobradaTransgressaoContinuidade: JournalEntryLine[];
  diagnosticoCpc00: string;
}

export function evaluateLiquidationBasisAccountingCpc00(input: LiquidationBasisInput): Result<LiquidationBasisResult, Error> {
  const {
    entidadeId,
    razaoSocial,
    valorContabilHistoricoAtivosBrl,
    valorEstimadoRealizacaoLiquidacaoAtivosBrl,
    custosEstimadosLiquidacaoEncerramentoBrl,
    passivoExigivelHistoricoBrl
  } = input;

  if (valorContabilHistoricoAtivosBrl <= 0 || valorEstimadoRealizacaoLiquidacaoAtivosBrl <= 0) {
    return Err(new Error('Ativos e valores de liquidação devem ser superiores a zero.'));
  }

  // Ajuste a Valor Líquido Realizável de Liquidação
  const perdaDesvalorizacaoAtivos = Number((Math.max(0, valorContabilHistoricoAtivosBrl - valorEstimadoRealizacaoLiquidacaoAtivosBrl)).toFixed(2));
  const totalAtivosLiquidacao = valorEstimadoRealizacaoLiquidacaoAtivosBrl;

  // Passivos na Base de Liquidação = Passivo Exigível + Provisão para Custos de Liquidação
  const totalPassivosLiquidacao = Number((passivoExigivelHistoricoBrl + custosEstimadosLiquidacaoEncerramentoBrl).toFixed(2));

  // Patrimônio Líquido Residual de Liquidação = Ativos Líquidos Realizáveis - Passivos Totais de Liquidação
  const plResidualLiquidacao = Number((totalAtivosLiquidacao - totalPassivosLiquidacao).toFixed(2));

  const partidas: JournalEntryLine[] = [];

  if (perdaDesvalorizacaoAtivos > 0) {
    // D: Perdas por Desvalorização de Ativos em Liquidação (Resultado - CPC 00)
    partidas.push({
      accountId: '3.1.8.10',
      accountCode: '3.1.8.10',
      accountName: 'Perdas por Ajuste ao Valor Realizável de Liquidação (Resultado - CPC 00)',
      type: 'DEBIT',
      amount: perdaDesvalorizacaoAtivos
    });
    // C: Ativo em Liquidação (Ajuste de Avaliação)
    partidas.push({
      accountId: '1.2.3.90',
      accountCode: '1.2.3.90',
      accountName: 'Ativos em Liquidação - Ajuste ao Valor Realizável Líquido (Ativo)',
      type: 'CREDIT',
      amount: perdaDesvalorizacaoAtivos
    });
  }

  if (custosEstimadosLiquidacaoEncerramentoBrl > 0) {
    // D: Despesas com Provisão de Custos de Encerramento e Liquidação (Resultado - CPC 00)
    partidas.push({
      accountId: '3.1.8.11',
      accountCode: '3.1.8.11',
      accountName: 'Despesas com Custos Estimados de Liquidação e Encerramento (Resultado - CPC 00)',
      type: 'DEBIT',
      amount: custosEstimadosLiquidacaoEncerramentoBrl
    });
    // C: Provisão para Custos de Liquidação (Passivo de Liquidação)
    partidas.push({
      accountId: '2.1.4.90',
      accountCode: '2.1.4.90',
      accountName: 'Provisão para Custos e Encargos de Liquidação da Entidade (Passivo)',
      type: 'CREDIT',
      amount: custosEstimadosLiquidacaoEncerramentoBrl
    });
  }

  const diag = 'CPC 00 R2 / ASC 205-30 (Base Contábil de Liquidação): ' + razaoSocial + '. Princípio da continuidade descontinuado. Ativos ajustados para Valor Realizável Líquido de R$ ' + totalAtivosLiquidacao.toFixed(2) + ' (Perda: R$ ' + perdaDesvalorizacaoAtivos.toFixed(2) + '). Passivo Total de Liquidação: R$ ' + totalPassivosLiquidacao.toFixed(2) + ' (incluindo R$ ' + custosEstimadosLiquidacaoEncerramentoBrl.toFixed(2) + ' de provisão de encerramento). PL Residual de Liquidação: R$ ' + plResidualLiquidacao.toFixed(2) + '.';

  return Ok({
    entidadeId,
    razaoSocial,
    ajusteDesvalorizacaoAtivosLiquidacaoBrl: perdaDesvalorizacaoAtivos,
    totalAtivosBaseLiquidacaoBrl: totalAtivosLiquidacao,
    provisaoCustosLiquidacaoBrl: custosEstimadosLiquidacaoEncerramentoBrl,
    totalPassivosBaseLiquidacaoBrl: totalPassivosLiquidacao,
    patrimonioLiquidoLiquidacaoResidualBrl: plResidualLiquidacao,
    partidasDobradaTransgressaoContinuidade: partidas,
    diagnosticoCpc00: diag
  });
}
