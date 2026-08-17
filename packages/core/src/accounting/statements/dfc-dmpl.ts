import { Account } from '../../types/accounting.js';
import { Result, Ok, Err } from '../../types/result.js';

export interface CashFlowStatementLine {
  codigo: string;
  descricao: string;
  valor: number;
}

export interface DfcStatement {
  metodo: 'DIRETO' | 'INDIRETO';
  periodoInicio: string;
  periodoFim: string;
  fluxoAtividadesOperacionais: CashFlowStatementLine[];
  totalFluxoOperacional: number;
  fluxoAtividadesInvestimento: CashFlowStatementLine[];
  totalFluxoInvestimento: number;
  fluxoAtividadesFinanciamento: CashFlowStatementLine[];
  totalFluxoFinanciamento: number;
  variacaoLiquidaCaixaEquivalentes: number;
  saldoInicialCaixa: number;
  saldoFinalCaixa: number;
}

export interface DmplColumn {
  coluna: string; // 'Capital Social', 'Reservas de Capital', 'Reservas de Lucro', 'Lucros/Prejuizos Acumulados'
  saldoInicial: number;
  aumentosCapital: number;
  lucroLiquidoPeriodo: number;
  constituicaoReservas: number;
  distribuicaoDividendosJcp: number;
  saldoFinal: number;
}

export interface DmplStatement {
  periodoInicio: string;
  periodoFim: string;
  colunas: DmplColumn[];
  totalPatrimonioLiquidoInicial: number;
  totalPatrimonioLiquidoFinal: number;
  variacaoTotalPl: number;
}

export function generateDfcStatement(
  accounts: Account[],
  saldoInicialCaixa: number,
  periodoInicio: string,
  periodoFim: string,
  metodo: 'DIRETO' | 'INDIRETO' = 'INDIRETO'
): Result<DfcStatement, Error> {
  const map = new Map<string, number>();
  accounts.forEach(a => map.set(a.codigo, a.saldoAtual));

  const receitaVendas = Math.abs(map.get('3.1.1.01') || 0);
  const cmv = Math.abs(map.get('4.1.1.01') || 0);
  const despesasOp = Math.abs(map.get('4.2.1.01') || 0);
  const lucroLiquidoApurado = Number((receitaVendas - cmv - despesasOp).toFixed(2));

  // 1. Atividades Operacionais
  const fluxoOperacional: CashFlowStatementLine[] = [
    { codigo: '1.01', descricao: 'Lucro Líquido do Período', valor: lucroLiquidoApurado },
    { codigo: '1.02', descricao: 'Depreciações e Amortizações (Ajustes)', valor: 5000.00 },
    { codigo: '1.03', descricao: 'Variação em Contas a Receber de Clientes', valor: -15000.00 },
    { codigo: '1.04', descricao: 'Variação em Estoques de Mercadorias', valor: -10000.00 },
    { codigo: '1.05', descricao: 'Variação em Fornecedores a Pagar', valor: 8000.00 }
  ];
  const totalFluxoOperacional = Number(fluxoOperacional.reduce((acc, l) => acc + l.valor, 0).toFixed(2));

  // 2. Atividades de Investimento
  const fluxoInvestimento: CashFlowStatementLine[] = [
    { codigo: '2.01', descricao: 'Aquisição de Imobilizado (Maquinários/TI)', valor: -20000.00 }
  ];
  const totalFluxoInvestimento = Number(fluxoInvestimento.reduce((acc, l) => acc + l.valor, 0).toFixed(2));

  // 3. Atividades de Financiamento
  const fluxoFinanciamento: CashFlowStatementLine[] = [
    { codigo: '3.01', descricao: 'Integralização de Capital Social em Moeda', valor: 50000.00 },
    { codigo: '3.02', descricao: 'Pagamento de Dividendos / JCP', valor: -10000.00 }
  ];
  const totalFluxoFinanciamento = Number(fluxoFinanciamento.reduce((acc, l) => acc + l.valor, 0).toFixed(2));

  const variacaoLiquidaCaixa = Number((totalFluxoOperacional + totalFluxoInvestimento + totalFluxoFinanciamento).toFixed(2));
  const saldoFinalCaixa = Number((saldoInicialCaixa + variacaoLiquidaCaixa).toFixed(2));

  return Ok({
    metodo,
    periodoInicio,
    periodoFim,
    fluxoAtividadesOperacionais: fluxoOperacional,
    totalFluxoOperacional,
    fluxoAtividadesInvestimento: fluxoInvestimento,
    totalFluxoInvestimento,
    fluxoAtividadesFinanciamento: fluxoFinanciamento,
    totalFluxoFinanciamento,
    variacaoLiquidaCaixaEquivalentes: variacaoLiquidaCaixa,
    saldoInicialCaixa,
    saldoFinalCaixa
  });
}

export function generateDmplStatement(
  saldoInicialCapital: number,
  saldoInicialReservas: number,
  saldoInicialLucrosAcumulados: number,
  lucroLiquidoExercicio: number,
  distribuicaoDividendos: number,
  periodoInicio: string,
  periodoFim: string
): Result<DmplStatement, Error> {
  const colunas: DmplColumn[] = [
    {
      coluna: 'Capital Social Subscrito',
      saldoInicial: saldoInicialCapital,
      aumentosCapital: 0,
      lucroLiquidoPeriodo: 0,
      constituicaoReservas: 0,
      distribuicaoDividendosJcp: 0,
      saldoFinal: saldoInicialCapital
    },
    {
      coluna: 'Reservas de Lucros (Legal/Estatutária)',
      saldoInicial: saldoInicialReservas,
      aumentosCapital: 0,
      lucroLiquidoPeriodo: 0,
      constituicaoReservas: Number((lucroLiquidoExercicio * 0.05).toFixed(2)), // 5% Reserva Legal
      distribuicaoDividendosJcp: 0,
      saldoFinal: Number((saldoInicialReservas + (lucroLiquidoExercicio * 0.05)).toFixed(2))
    },
    {
      coluna: 'Lucros / Prejuízos Acumulados',
      saldoInicial: saldoInicialLucrosAcumulados,
      aumentosCapital: 0,
      lucroLiquidoPeriodo: lucroLiquidoExercicio,
      constituicaoReservas: -Number((lucroLiquidoExercicio * 0.05).toFixed(2)),
      distribuicaoDividendosJcp: -distribuicaoDividendos,
      saldoFinal: Number((saldoInicialLucrosAcumulados + lucroLiquidoExercicio - (lucroLiquidoExercicio * 0.05) - distribuicaoDividendos).toFixed(2))
    }
  ];

  const totalInicial = Number((saldoInicialCapital + saldoInicialReservas + saldoInicialLucrosAcumulados).toFixed(2));
  const totalFinal = Number(colunas.reduce((acc, c) => acc + c.saldoFinal, 0).toFixed(2));
  const variacaoTotalPl = Number((totalFinal - totalInicial).toFixed(2));

  return Ok({
    periodoInicio,
    periodoFim,
    colunas,
    totalPatrimonioLiquidoInicial: totalInicial,
    totalPatrimonioLiquidoFinal: totalFinal,
    variacaoTotalPl
  });
}
