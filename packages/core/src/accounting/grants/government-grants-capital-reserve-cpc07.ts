import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export interface GovernmentGrantCpc07Input {
  subvencaoId: string;
  empresaNome: string;
  descricaoProjetoIncentivado: string;
  valorTotalSubvencaoRecebidaBrl: number;
  vidaUtilAtivoSubvencionadoAnos: number;
  anoApuracao: number;
}

export interface GovernmentGrantCpc07Result {
  subvencaoId: string;
  empresaNome: string;
  descricaoProjetoIncentivado: string;
  receitaSubvencaoReconhecidaResultadoAnoBrl: number; // CPC 07
  saldoPassivoSubvencaoDiferidaRemanescenteBrl: number;
  valorDestinacaoReservaIncentivosFiscaisPlBrl: number; // Art. 195-A Lei 6.404/76
  partidasDobrada: JournalEntryLine[];
  diagnosticoCpc07: string;
}

export function processGovernmentGrantsCapitalReserveCpc07(input: GovernmentGrantCpc07Input): Result<GovernmentGrantCpc07Result, Error> {
  const {
    subvencaoId,
    empresaNome,
    descricaoProjetoIncentivado,
    valorTotalSubvencaoRecebidaBrl,
    vidaUtilAtivoSubvencionadoAnos,
    anoApuracao
  } = input;

  if (valorTotalSubvencaoRecebidaBrl <= 0 || vidaUtilAtivoSubvencionadoAnos <= 0) {
    return Err(new Error('Valor da subvenção e vida útil do ativo devem ser superiores a zero.'));
  }

  // CPC 07 R1: A subvenção para investimento é reconhecida no resultado sistematicamente
  // à medida que o ativo imobilizado correspondente é depreciado.
  const receitaAnualResultado = Number((valorTotalSubvencaoRecebidaBrl / vidaUtilAtivoSubvencionadoAnos).toFixed(2));
  const passivoRemanescente = Number((Math.max(0, valorTotalSubvencaoRecebidaBrl - (receitaAnualResultado * anoApuracao))).toFixed(2));

  // Art. 195-A Lei 6.404/76 e Art. 30 Lei 12.973/14: O valor reconhecido no resultado pode ser
  // destinado para a Reserva de Incentivos Fiscais no Patrimônio Líquido na destinação do lucro.
  const destinacaoReservaPl = receitaAnualResultado;

  const partidas: JournalEntryLine[] = [];

  // 1. D: Passivo de Subvenção Governamental Diferida
  partidas.push({
    accountId: '2.2.3.01',
    accountCode: '2.2.3.01',
    accountName: 'Receita Diferida de Subvenção Governamental (Passivo Não Circulante - CPC 07)',
    type: 'DEBIT',
    amount: receitaAnualResultado
  });

  // 1. C: Receita de Subvenção Governamental para Investimento (Resultado)
  partidas.push({
    accountId: '3.1.5.01',
    accountCode: '3.1.5.01',
    accountName: 'Receita de Subvenções Governamentais para Investimento (Resultado - CPC 07)',
    type: 'CREDIT',
    amount: receitaAnualResultado
  });

  // 2. D: Lucros Acumulados (Destinação do Resultado para Reserva de Incentivos Fiscais)
  partidas.push({
    accountId: '2.3.4.01',
    accountCode: '2.3.4.01',
    accountName: 'Lucros ou Prejuízos Acumulados (Patrimônio Líquido)',
    type: 'DEBIT',
    amount: destinacaoReservaPl
  });

  // 2. C: Reserva de Incentivos Fiscais (Patrimônio Líquido - Art. 195-A Lei 6.404/76)
  partidas.push({
    accountId: '2.3.2.05',
    accountCode: '2.3.2.05',
    accountName: 'Reserva de Incentivos Fiscais (Patrimônio Líquido - Art. 195-A Lei 6.404/76)',
    type: 'CREDIT',
    amount: destinacaoReservaPl
  });

  const diag = 'CPC 07 R1 & Art. 195-A Lei 6.404/76: Subvenção ' + descricaoProjetoIncentivado + ' (Ano ' + anoApuracao + '/' + vidaUtilAtivoSubvencionadoAnos + '). Receita Reconhecida no Resultado: R$ ' + receitaAnualResultado.toFixed(2) + '. Passivo Remanescente: R$ ' + passivoRemanescente.toFixed(2) + '. Destinação para Reserva de Incentivos Fiscais no PL: R$ ' + destinacaoReservaPl.toFixed(2) + ' (Excluída do dividendo obrigatório).';

  return Ok({
    subvencaoId,
    empresaNome,
    descricaoProjetoIncentivado,
    receitaSubvencaoReconhecidaResultadoAnoBrl: receitaAnualResultado,
    saldoPassivoSubvencaoDiferidaRemanescenteBrl: passivoRemanescente,
    valorDestinacaoReservaIncentivosFiscaisPlBrl: destinacaoReservaPl,
    partidasDobrada: partidas,
    diagnosticoCpc07: diag
  });
}
