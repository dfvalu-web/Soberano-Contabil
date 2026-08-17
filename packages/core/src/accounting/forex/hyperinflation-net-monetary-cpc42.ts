import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export interface HyperinflationCpc42Input {
  entidadeId: string;
  exercicioAno: number;
  indicePrecosInicioPeriodo: number;
  indicePrecosFimPeriodo: number;
  ativosMonetariosMediosBrl: number; // Ex: Caixa, Contas a Receber
  passivosMonetariosMediosBrl: number; // Ex: Fornecedores, Empréstimos
  ativosNaoMonetariosCustoHistoricoBrl: number; // Ex: Imobilizado
}

export interface HyperinflationCpc42Result {
  entidadeId: string;
  exercicioAno: number;
  fatorInflacaoGeral: number;
  posicaoMonetariaLiquidaMediaBrl: number; // Ativos Monetários - Passivos Monetários
  isPosicaoMonetariaAtiva: boolean; // Ativa = Perda de poder de compra | Passiva = Ganho
  resultadoPerdaGanhoPosicaoMonetariaDrebBrl: number; // Positivo = Ganho DRE | Negativo = Perda DRE
  valorAtualizadoAtivosNaoMonetariosBrl: number;
  partidasDobrada: JournalEntryLine[];
  diagnosticoCpc42: string;
}

export function evaluateHyperinflationNetMonetaryCpc42(input: HyperinflationCpc42Input): Result<HyperinflationCpc42Result, Error> {
  const {
    entidadeId,
    exercicioAno,
    indicePrecosInicioPeriodo,
    indicePrecosFimPeriodo,
    ativosMonetariosMediosBrl,
    passivosMonetariosMediosBrl,
    ativosNaoMonetariosCustoHistoricoBrl
  } = input;

  if (indicePrecosInicioPeriodo <= 0 || indicePrecosFimPeriodo <= 0) {
    return Err(new Error('Índices de preços devem ser superiores a zero.'));
  }

  // Fator de inflação no período: (Fim / Inicio) - 1
  const taxaInflacao = (indicePrecosFimPeriodo / indicePrecosInicioPeriodo) - 1;
  const fatorMultiplicador = indicePrecosFimPeriodo / indicePrecosInicioPeriodo;

  // 1. Posição Monetária Líquida = Ativos Monetários - Passivos Monetários
  const posicaoMonetaria = Number((ativosMonetariosMediosBrl - passivosMonetariosMediosBrl).toFixed(2));
  const isAtiva = posicaoMonetaria > 0;

  // Ganho ou Perda sobre a Posição Monetária Líquida:
  // Se Posição Monetária Ativa (Ativos > Passivos): A inflação gera PERDA de poder de compra
  // Se Posição Monetária Passiva (Passivos > Ativos): A inflação gera GANHO de poder de compra
  const resultadoMonetario = Number((-posicaoMonetaria * taxaInflacao).toFixed(2));

  // 2. Reexpressão de Ativos Não Monetários (Imobilizado)
  const valorAtualizadoNaoMonetarios = Number((ativosNaoMonetariosCustoHistoricoBrl * fatorMultiplicador).toFixed(2));
  const ajusteReexpressaoImobilizado = Number((valorAtualizadoNaoMonetarios - ativosNaoMonetariosCustoHistoricoBrl).toFixed(2));

  const partidas: JournalEntryLine[] = [];

  // D: Imobilizado (Reexpressão Monetária)
  if (ajusteReexpressaoImobilizado > 0) {
    partidas.push({
      accountId: '1.2.3.01',
      accountCode: '1.2.3.01',
      accountName: 'Imobilizado - Ajuste por Hiperinflação (Ativo Não Circulante - CPC 42)',
      type: 'DEBIT',
      amount: ajusteReexpressaoImobilizado
    });
    // C: Patrimônio Líquido - Reserva de Reavaliação / Ajuste Monetário
    partidas.push({
      accountId: '2.3.2.10',
      accountCode: '2.3.2.10',
      accountName: 'Ajuste de Capital por Hiperinflação (Patrimônio Líquido - CPC 42)',
      type: 'CREDIT',
      amount: ajusteReexpressaoImobilizado
    });
  }

  // Partida do Ganho / Perda Monetária Líquida
  if (resultadoMonetario < 0) {
    // Perda Monetária
    partidas.push({
      accountId: '3.1.8.30',
      accountCode: '3.1.8.30',
      accountName: 'Perda do Poder de Compra sobre Posição Monetária Líquida (DRE - CPC 42)',
      type: 'DEBIT',
      amount: Math.abs(resultadoMonetario)
    });
  } else if (resultadoMonetario > 0) {
    // Ganho Monetário
    partidas.push({
      accountId: '3.1.5.30',
      accountCode: '3.1.5.30',
      accountName: 'Ganho do Poder de Compra sobre Posição Monetária Líquida (DRE - CPC 42)',
      type: 'CREDIT',
      amount: resultadoMonetario
    });
  }

  const diag = 'CPC 42 / IAS 29 (Hiperinflação): Inflação de ' + (taxaInflacao * 100).toFixed(2) + '%. Posição Monetária Líquida: R$ ' + posicaoMonetaria.toFixed(2) + ' (' + (isAtiva ? 'ATIVA - Perda de Poder de Compra' : 'PASSIVA - Ganho de Poder de Compra') + '). Impacto na DRE: R$ ' + resultadoMonetario.toFixed(2) + '. Imobilizado Reexpressado: R$ ' + valorAtualizadoNaoMonetarios.toFixed(2) + ' (+ R$ ' + ajusteReexpressaoImobilizado.toFixed(2) + ').';

  return Ok({
    entidadeId,
    exercicioAno,
    fatorInflacaoGeral: Number(fatorMultiplicador.toFixed(4)),
    posicaoMonetariaLiquidaMediaBrl: posicaoMonetaria,
    isPosicaoMonetariaAtiva: isAtiva,
    resultadoPerdaGanhoPosicaoMonetariaDrebBrl: resultadoMonetario,
    valorAtualizadoAtivosNaoMonetariosBrl: valorAtualizadoNaoMonetarios,
    partidasDobrada: partidas,
    diagnosticoCpc42: diag
  });
}
