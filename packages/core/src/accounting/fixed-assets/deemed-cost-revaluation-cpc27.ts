import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export interface DeemedCostRevaluationInput {
  ativoImobilizadoId: string;
  descricaoAtivo: string; // Ex: 'Parque Fabril e Edificações Industriais'
  valorContabilHistoricoLiquidoBrl: number;
  valorJustoLaudoAvaliacaoBrl: number;
  vidaUtilRemanescenteAnos: number;
  aliquotaTributosDiferidosPercent?: number; // Padrão 34% (25% IRPJ + 9% CSLL)
}

export interface DeemedCostRevaluationResult {
  ativoImobilizadoId: string;
  descricaoAtivo: string;
  valorAjusteReavaliacaoBrutoBrl: number;
  tributosDiferidosPassivoBrl: number;
  reservaReavaliacaoLiquidaPlBrl: number;
  depreciacaoAnualNovoCustoBrl: number;
  realizacaoAnualReservaPlBrl: number;
  partidasDobradaLaudoInicial: JournalEntryLine[];
  partidasDobradaRealizacaoAno1: JournalEntryLine[];
  diagnosticoCpc27: string;
}

export function evaluateDeemedCostRevaluationCpc27(input: DeemedCostRevaluationInput): Result<DeemedCostRevaluationResult, Error> {
  const {
    ativoImobilizadoId,
    descricaoAtivo,
    valorContabilHistoricoLiquidoBrl,
    valorJustoLaudoAvaliacaoBrl,
    vidaUtilRemanescenteAnos,
    aliquotaTributosDiferidosPercent = 34.0
  } = input;

  if (valorJustoLaudoAvaliacaoBrl <= valorContabilHistoricoLiquidoBrl || vidaUtilRemanescenteAnos <= 0) {
    return Err(new Error('Valor justo do laudo deve ser superior ao valor contábil líquido e vida útil positiva.'));
  }

  // Ajuste Bruto de Avaliação Patrimonial
  const ajusteBruto = Number((valorJustoLaudoAvaliacaoBrl - valorContabilHistoricoLiquidoBrl).toFixed(2));

  // Tributo Diferido Passivo (CPC 32): 34% sobre a mais-valia
  const tributosDiferidos = Number((ajusteBruto * (aliquotaTributosDiferidosPercent / 100)).toFixed(2));

  // Reserva de Reavaliação Líquida no PL (Ajuste de Avaliação Patrimonial - AAP)
  const reservaLiquidaPL = Number((ajusteBruto - tributosDiferidos).toFixed(2));

  // Depreciação Anual do Novo Custo
  const depreciacaoAnualTotal = Number((valorJustoLaudoAvaliacaoBrl / vidaUtilRemanescenteAnos).toFixed(2));

  // Realização Anual da Reserva no PL para Lucros Acumulados (Líquida de Impostos)
  const realizacaoAnualPL = Number((reservaLiquidaPL / vidaUtilRemanescenteAnos).toFixed(2));
  const realizacaoAnualTributoDiferido = Number((tributosDiferidos / vidaUtilRemanescenteAnos).toFixed(2));

  const partidasInicial: JournalEntryLine[] = [];

  // D: Imobilizado em Operação (Mais-Valia do Ativo - CPC 27)
  partidasInicial.push({
    accountId: '1.2.3.01',
    accountCode: '1.2.3.01',
    accountName: 'Imobilizado - Custo Atribuído / Reavaliação (Ativo Não Circulante - CPC 27)',
    type: 'DEBIT',
    amount: ajusteBruto
  });
  // C: Passivo Fiscal Diferido (Passivo Não Circulante - CPC 32)
  partidasInicial.push({
    accountId: '2.2.3.10',
    accountCode: '2.2.3.10',
    accountName: 'Tributos Diferidos Passivos sobre Mais-Valia de Imobilizado (Passivo - CPC 32)',
    type: 'CREDIT',
    amount: tributosDiferidos
  });
  // C: Ajuste de Avaliação Patrimonial - Reserva de Reavaliação (Patrimônio Líquido - CPC 27)
  partidasInicial.push({
    accountId: '2.4.3.05',
    accountCode: '2.4.3.05',
    accountName: 'Ajuste de Avaliação Patrimonial - Reserva de Reavaliação (Patrimônio Líquido - CPC 27)',
    type: 'CREDIT',
    amount: reservaLiquidaPL
  });

  const partidasRealizacao: JournalEntryLine[] = [];

  // D: Ajuste de Avaliação Patrimonial (Redução da Reserva no PL)
  partidasRealizacao.push({
    accountId: '2.4.3.05',
    accountCode: '2.4.3.05',
    accountName: 'Ajuste de Avaliação Patrimonial - Reserva de Reavaliação (Patrimônio Líquido - CPC 27)',
    type: 'DEBIT',
    amount: realizacaoAnualPL
  });
  // C: Lucros ou Prejuízos Acumulados (Transferência Direta no PL)
  partidasRealizacao.push({
    accountId: '2.4.3.01',
    accountCode: '2.4.3.01',
    accountName: 'Lucros ou Prejuízos Acumulados - Realização de Reserva de Reavaliação (PL - CPC 27)',
    type: 'CREDIT',
    amount: realizacaoAnualPL
  });

  // Reversão do Tributo Diferido no Passivo contra IRPJ/CSLL no Resultado
  partidasRealizacao.push({
    accountId: '2.2.3.10',
    accountCode: '2.2.3.10',
    accountName: 'Tributos Diferidos Passivos (Passivo Não Circulante - CPC 32)',
    type: 'DEBIT',
    amount: realizacaoAnualTributoDiferido
  });
  partidasRealizacao.push({
    accountId: '3.1.9.01',
    accountCode: '3.1.9.01',
    accountName: 'Receita / Reversão de Tributos Diferidos sobre Reavaliação (Resultado - CPC 32)',
    type: 'CREDIT',
    amount: realizacaoAnualTributoDiferido
  });

  const diag = 'CPC 27 / ICPC 10 & CPC 32 (Custo Atribuído & Reavaliação): Ativo ' + descricaoAtivo + '. Valor Contábil R$ ' + valorContabilHistoricoLiquidoBrl.toFixed(2) + ' reavaliado para R$ ' + valorJustoLaudoAvaliacaoBrl.toFixed(2) + ' (Ajuste Bruto R$ ' + ajusteBruto.toFixed(2) + '). Tributo Diferido Passivo (34%): R$ ' + tributosDiferidos.toFixed(2) + '. Reserva Líquida no PL: R$ ' + reservaLiquidaPL.toFixed(2) + '. Realização anual no PL: R$ ' + realizacaoAnualPL.toFixed(2) + ' em ' + vidaUtilRemanescenteAnos + ' anos.';

  return Ok({
    ativoImobilizadoId,
    descricaoAtivo,
    valorAjusteReavaliacaoBrutoBrl: ajusteBruto,
    tributosDiferidosPassivoBrl: tributosDiferidos,
    reservaReavaliacaoLiquidaPlBrl: reservaLiquidaPL,
    depreciacaoAnualNovoCustoBrl: depreciacaoAnualTotal,
    realizacaoAnualReservaPlBrl: realizacaoAnualPL,
    partidasDobradaLaudoInicial: partidasInicial,
    partidasDobradaRealizacaoAno1: partidasRealizacao,
    diagnosticoCpc27: diag
  });
}
