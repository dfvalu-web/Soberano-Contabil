import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export interface HyperinflationInput {
  subsidiariaId: string;
  paisSede: string; // Ex: 'Argentina'
  taxaInflacaoAcumulada3AnosPercent: number; // Ex: 120% (>= 100% ativa CPC 42)
  saldoAtivoNaoMonetarioHistoricoBrl: number; // Ex: Imobilizado R$ 1.000.000,00
  indicePrecosDataAquisicao: number; // Ex: 100
  indicePrecosDataFechamento: number; // Ex: 220
  posicaoMonetariaLiquidaMediaBrl: number; // Ex: Ativos Monetários - Passivos Monetários (e.g. -R$ 200.000,00)
}

export interface HyperinflationResult {
  subsidiariaId: string;
  enquadraHiperinflacaoCpc42: boolean;
  fatorReexpressaoMonetaria: number;
  valorReexpressoAtivoNaoMonetario: number;
  ajusteReexpressaoResultado: number;
  ganhoOuPerdaPosicaoMonetariaLiquida: number;
  partidasDobradaHiperinflacao: JournalEntryLine[];
  diagnosticoCpc42: string;
}

export function evaluateHyperinflationCpc42(input: HyperinflationInput): Result<HyperinflationResult, Error> {
  const {
    subsidiariaId,
    paisSede,
    taxaInflacaoAcumulada3AnosPercent,
    saldoAtivoNaoMonetarioHistoricoBrl,
    indicePrecosDataAquisicao,
    indicePrecosDataFechamento,
    posicaoMonetariaLiquidaMediaBrl
  } = input;

  if (indicePrecosDataAquisicao <= 0 || indicePrecosDataFechamento <= 0) {
    return Err(new Error('Índices de preços devem ser superiores a zero.'));
  }

  const enquadra = taxaInflacaoAcumulada3AnosPercent >= 100;
  if (!enquadra) {
    return Ok({
      subsidiariaId,
      enquadraHiperinflacaoCpc42: false,
      fatorReexpressaoMonetaria: 1.0,
      valorReexpressoAtivoNaoMonetario: saldoAtivoNaoMonetarioHistoricoBrl,
      ajusteReexpressaoResultado: 0,
      ganhoOuPerdaPosicaoMonetariaLiquida: 0,
      partidasDobradaHiperinflacao: [],
      diagnosticoCpc42: 'Economia em ' + paisSede + ' não atinge o critério de hiperinflação (Inflação 3 anos < 100%). Demonstrações mantidas a custo histórico.'
    });
  }

  // 1. Fator de Reexpressão = Índice Fechamento / Índice Aquisição
  const fator = Number((indicePrecosDataFechamento / indicePrecosDataAquisicao).toFixed(4));
  const valorReexpresso = Number((saldoAtivoNaoMonetarioHistoricoBrl * fator).toFixed(2));
  const ganhoReexpressao = Number((valorReexpresso - saldoAtivoNaoMonetarioHistoricoBrl).toFixed(2));

  // 2. Ganho/Perda na Posição Monetária Líquida
  const variacaoInflacao = (indicePrecosDataFechamento - indicePrecosDataAquisicao) / indicePrecosDataAquisicao;
  // Se posição monetária for passiva líquida (Passivos > Ativos monetários) => Ganho monetário na inflação
  const resultadoMonetario = Number((-posicaoMonetariaLiquidaMediaBrl * variacaoInflacao).toFixed(2));

  const partidas: JournalEntryLine[] = [
    {
      accountId: '1.2.3.99',
      accountCode: '1.2.3.99',
      accountName: 'Ajuste de Reexpressão Monetária de Ativos (Ativo Não Circulante - CPC 42)',
      type: 'DEBIT',
      amount: ganhoReexpressao
    },
    {
      accountId: '3.1.9.01',
      accountCode: '3.1.9.01',
      accountName: 'Ganho com Reexpressão Monetária em Hiperinflação (Resultado - CPC 42)',
      type: 'CREDIT',
      amount: ganhoReexpressao
    }
  ];

  const diagnostico = 'CPC 42 / IAS 29 Ativo: Subsidiária em ' + paisSede + ' (Inflação 3 anos: ' + taxaInflacaoAcumulada3AnosPercent + '%). Fator de reexpressão de ' + fator.toFixed(4) + '. Ativo reexpresso de R$ ' + saldoAtivoNaoMonetarioHistoricoBrl.toFixed(2) + ' para R$ ' + valorReexpresso.toFixed(2) + '. Resultado monetário líquido: R$ ' + resultadoMonetario.toFixed(2) + '.';

  return Ok({
    subsidiariaId,
    enquadraHiperinflacaoCpc42: true,
    fatorReexpressaoMonetaria: fator,
    valorReexpressoAtivoNaoMonetario: valorReexpresso,
    ajusteReexpressaoResultado: ganhoReexpressao,
    ganhoOuPerdaPosicaoMonetariaLiquida: resultadoMonetario,
    partidasDobradaHiperinflacao: partidas,
    diagnosticoCpc42: diagnostico
  });
}
