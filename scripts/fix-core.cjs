const fs = require('fs');
const path = require('path');

function write(p, c) {
  const full = path.join(process.cwd(), p);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, c.trim() + '\n', 'utf8');
  console.log('Created: ' + p);
}

write('packages/core/src/tax/simples-nacional/calculator.ts', `
import { SimplesCalculationInput, SimplesCalculationResult, SimplesAnexo } from '../../types/tax.js';
import { getSimplesTable } from './tables.js';
import { Result, Ok, Err } from '../../types/result.js';

export const SUBLIMITE_ESTADUAL_SIMPLES = 3600000.00;
export const LIMITE_MAXIMO_SIMPLES = 4800000.00;

export function calculateFatorR(folha12Meses: number, rbt12: number): number {
  if (rbt12 <= 0) return 0;
  return Number((folha12Meses / rbt12).toFixed(4));
}

export function calculateSimplesNacional(input: SimplesCalculationInput): Result<SimplesCalculationResult, Error> {
  const { rbt12, receitaMes } = input;

  if (rbt12 < 0 || receitaMes < 0) {
    return Err(new Error('Receita Bruta não pode ser negativa.'));
  }

  if (rbt12 > LIMITE_MAXIMO_SIMPLES) {
    return Err(new Error(\`RBT12 de R$ \${rbt12.toLocaleString('pt-BR')} ultrapassa o teto do Simples Nacional de R$ 4.800.000,00.\`));
  }

  let anexoEfetivo: SimplesAnexo = input.anexo;
  let fatorR: number | undefined = undefined;

  if (input.folha12Meses !== undefined && (input.anexo === 'ANEXO_III' || input.anexo === 'ANEXO_V')) {
    fatorR = calculateFatorR(input.folha12Meses, rbt12);
    anexoEfetivo = fatorR >= 0.28 ? 'ANEXO_III' : 'ANEXO_V';
  }

  const tabela = getSimplesTable(anexoEfetivo);
  const rbt12ParaCalculo = Math.max(rbt12, 1.00);
  
  let bracket = tabela.find(b => rbt12ParaCalculo <= b.limiteSuperior);
  if (!bracket) {
    bracket = tabela[tabela.length - 1]!;
  }

  const aliquotaEfetiva = rbt12 <= 180000.00
    ? bracket.aliquotaNominal
    : Number(((rbt12 * bracket.aliquotaNominal - bracket.parcelaADeduzir) / rbt12).toFixed(6));

  const valorDevidoBruto = Number((receitaMes * aliquotaEfetiva).toFixed(2));
  const { irpj, csll, cofins, pis, cpp, icms, iss } = bracket.percentuais;

  const ultrapassouSublimite = rbt12 > SUBLIMITE_ESTADUAL_SIMPLES || !!input.isSublimiteEstadualUltrapassado;

  let valorIcms = Number((valorDevidoBruto * icms).toFixed(2));
  let valorIss = Number((valorDevidoBruto * iss).toFixed(2));
  let icmsSegregadoForaDas: number | undefined = undefined;
  let issSegregadoForaDas: number | undefined = undefined;

  if (ultrapassouSublimite) {
    // Alíquota de ICMS estadual padrão (ex: 3.35% na faixa 5 do Simples ou apuração em conta gráfica)
    const aliqIcmsEstimada = (anexoEfetivo === 'ANEXO_I' || anexoEfetivo === 'ANEXO_II') ? 0.0335 : 0;
    const aliqIssEstimada = (anexoEfetivo === 'ANEXO_III' || anexoEfetivo === 'ANEXO_IV' || anexoEfetivo === 'ANEXO_V') ? 0.05 : 0;
    
    icmsSegregadoForaDas = aliqIcmsEstimada > 0 ? Number((receitaMes * aliqIcmsEstimada).toFixed(2)) : undefined;
    issSegregadoForaDas = aliqIssEstimada > 0 ? Number((receitaMes * aliqIssEstimada).toFixed(2)) : undefined;
    valorIcms = 0;
    valorIss = 0;
  }

  let valorPis = Number((valorDevidoBruto * pis).toFixed(2));
  let valorCofins = Number((valorDevidoBruto * cofins).toFixed(2));

  if (input.receitaMonofasica && input.receitaMonofasica > 0) {
    const proporcaoMonofasica = Math.min(input.receitaMonofasica / (receitaMes || 1), 1);
    valorPis = Number((valorPis * (1 - proporcaoMonofasica)).toFixed(2));
    valorCofins = Number((valorCofins * (1 - proporcaoMonofasica)).toFixed(2));
  }

  if (input.receitaStIcms && input.receitaStIcms > 0 && !ultrapassouSublimite) {
    const proporcaoSt = Math.min(input.receitaStIcms / (receitaMes || 1), 1);
    valorIcms = Number((valorIcms * (1 - proporcaoSt)).toFixed(2));
  }

  const valorIrpj = Number((valorDevidoBruto * irpj).toFixed(2));
  const valorCsll = Number((valorDevidoBruto * csll).toFixed(2));
  const valorCpp = Number((valorDevidoBruto * cpp).toFixed(2));

  const valorDevidoTotal = Number((valorIrpj + valorCsll + valorCofins + valorPis + valorCpp + valorIcms + valorIss).toFixed(2));

  return Ok({
    rbt12,
    faixa: bracket.faixa,
    aliquotaNominal: bracket.aliquotaNominal,
    parcelaADeduzir: bracket.parcelaADeduzir,
    aliquotaEfetiva,
    fatorR,
    anexoAplicado: anexoEfetivo,
    valorDevidoTotal,
    segregacao: {
      irpj: valorIrpj,
      csll: valorCsll,
      cofins: valorCofins,
      pis: valorPis,
      cpp: valorCpp,
      icms: valorIcms,
      iss: valorIss
    },
    icmsSegregadoForaDas,
    issSegregadoForaDas
  });
}
`);

write('packages/core/src/accounting/statements/financial-statements.ts', `
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
`);
