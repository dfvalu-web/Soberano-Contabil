import { Account, BalanceSheet, IncomeStatement, FinancialStatementLine } from '../../types/accounting.js';
import { Result, Ok } from '../../types/result.js';

export function generateFinancialStatements(
  accounts: Account[],
  periodoInicio: string,
  periodoFim: string
): Result<{ balanceSheet: BalanceSheet; incomeStatement: IncomeStatement }, Error> {
  
  // 1. DRE (Income Statement)
  const contasReceita = accounts.filter(a => a.tipo === 'RECEITA');
  const contasCusto = accounts.filter(a => a.tipo === 'CUSTO');
  const contasDespesa = accounts.filter(a => a.tipo === 'DESPESA');

  const receitaBruta = contasReceita
    .filter(a => a.codigo.startsWith('3.1.1'))
    .reduce((sum, a) => sum + Math.abs(a.saldoAtual), 0);

  const deducoesReceita = contasReceita
    .filter(a => a.codigo.startsWith('3.1.2'))
    .reduce((sum, a) => sum + Math.abs(a.saldoAtual), 0);

  const receitaLiquida = Number((receitaBruta - deducoesReceita).toFixed(2));
  const custosOperacionais = Number(contasCusto.reduce((sum, a) => sum + Math.abs(a.saldoAtual), 0).toFixed(2));
  const lucroBruto = Number((receitaLiquida - custosOperacionais).toFixed(2));

  const despesasOperacionais = Number(contasDespesa.reduce((sum, a) => sum + Math.abs(a.saldoAtual), 0).toFixed(2));
  const resultadoOperacional = Number((lucroBruto - despesasOperacionais).toFixed(2));
  
  // Lucro Líquido do Período
  const lucroLiquidoExercicio = resultadoOperacional;

  const linhasDre: FinancialStatementLine[] = [
    { codigo: '1', descricao: 'RECEITA BRUTA DE VENDAS E SERVIÇOS', nivel: 1, valorPeriodoAtual: receitaBruta, isDestaque: true },
    { codigo: '1.1', descricao: '(-) Deduções e Tributos sobre Vendas', nivel: 2, valorPeriodoAtual: deducoesReceita },
    { codigo: '2', descricao: '(=) RECEITA LÍQUIDA OPERACIONAL', nivel: 1, valorPeriodoAtual: receitaLiquida, isDestaque: true },
    { codigo: '3', descricao: '(-) Custos dos Produtos/Serviços Vendidos (CMV/CPV)', nivel: 2, valorPeriodoAtual: custosOperacionais },
    { codigo: '4', descricao: '(=) LUCRO BRUTO', nivel: 1, valorPeriodoAtual: lucroBruto, isDestaque: true },
    { codigo: '5', descricao: '(-) Despesas Operacionais (Administrativas, Pessoal, Tributárias)', nivel: 2, valorPeriodoAtual: despesasOperacionais },
    { codigo: '6', descricao: '(=) RESULTADO OPERACIONAL ANTES DOS TRIBUTOS', nivel: 1, valorPeriodoAtual: resultadoOperacional, isDestaque: true },
    { codigo: '7', descricao: '(-) Provisão para IRPJ e CSLL', nivel: 2, valorPeriodoAtual: 0 },
    { codigo: '8', descricao: '(=) LUCRO / PREJUÍZO LÍQUIDO DO EXERCÍCIO', nivel: 1, valorPeriodoAtual: lucroLiquidoExercicio, isDestaque: true }
  ];

  const incomeStatement: IncomeStatement = {
    periodoInicio,
    periodoFim,
    linhas: linhasDre,
    receitaBruta,
    deducoesReceita,
    receitaLiquida,
    custosOperacionais,
    lucroBruto,
    despesasOperacionais,
    resultadoOperacional,
    provisaoIrpjCsll: 0,
    lucroLiquidoExercicio
  };

  // 2. Balanço Patrimonial (Balance Sheet)
  const ativoCirculanteContas = accounts.filter(a => a.tipo === 'ATIVO' && a.codigo.startsWith('1.1') && a.isAnalitica);
  const ativoNaoCirculanteContas = accounts.filter(a => a.tipo === 'ATIVO' && a.codigo.startsWith('1.2') && a.isAnalitica);
  const passivoCirculanteContas = accounts.filter(a => a.tipo === 'PASSIVO' && a.codigo.startsWith('2.1') && a.isAnalitica);
  const passivoNaoCirculanteContas = accounts.filter(a => a.tipo === 'PASSIVO' && a.codigo.startsWith('2.2') && a.isAnalitica);
  const plContas = accounts.filter(a => a.tipo === 'PATRIMONIO_LIQUIDO' && a.isAnalitica);

  const formatLines = (list: Account[]): FinancialStatementLine[] =>
    list.map(a => ({
      codigo: a.codigo,
      descricao: a.nome,
      nivel: a.nivel,
      valorPeriodoAtual: Math.abs(a.saldoAtual)
    }));

  const linhasAtivoCirculante = formatLines(ativoCirculanteContas);
  const linhasAtivoNaoCirculante = formatLines(ativoNaoCirculanteContas);
  const totalAtivoCirculante = ativoCirculanteContas.reduce((s, a) => s + Math.abs(a.saldoAtual), 0);
  const totalAtivoNaoCirculante = ativoNaoCirculanteContas.reduce((s, a) => s + Math.abs(a.saldoAtual), 0);
  const totalAtivo = Number((totalAtivoCirculante + totalAtivoNaoCirculante).toFixed(2));

  const linhasPassivoCirculante = formatLines(passivoCirculanteContas);
  const linhasPassivoNaoCirculante = formatLines(passivoNaoCirculanteContas);
  const totalPassivoCirculante = passivoCirculanteContas.reduce((s, a) => s + Math.abs(a.saldoAtual), 0);
  const totalPassivoNaoCirculante = passivoNaoCirculanteContas.reduce((s, a) => s + Math.abs(a.saldoAtual), 0);
  
  const totalPlBase = plContas.reduce((s, a) => s + Math.abs(a.saldoAtual), 0);
  const totalPlAjustado = Number((totalPlBase + lucroLiquidoExercicio).toFixed(2));
  
  const linhasPl = [
    ...formatLines(plContas),
    { codigo: '2.3.3.02', descricao: 'Resultado do Exercício em Curso (ARE)', nivel: 4, valorPeriodoAtual: lucroLiquidoExercicio }
  ];

  const totalPassivoEPatrimonioLiquido = Number((totalPassivoCirculante + totalPassivoNaoCirculante + totalPlAjustado).toFixed(2));
  const diferenca = Number(Math.abs(totalAtivo - totalPassivoEPatrimonioLiquido).toFixed(2));
  const isEquilibrado = diferenca < 0.01;

  const balanceSheet: BalanceSheet = {
    dataFechamento: periodoFim,
    ativoCirculante: linhasAtivoCirculante,
    ativoNaoCirculante: linhasAtivoNaoCirculante,
    totalAtivo,
    passivoCirculante: linhasPassivoCirculante,
    passivoNaoCirculante: linhasPassivoNaoCirculante,
    patrimonioLiquido: linhasPl,
    totalPassivoEPatrimonioLiquido,
    isEquilibrado,
    diferenca
  };

  return Ok({ balanceSheet, incomeStatement });
}
