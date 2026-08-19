import { Result, Ok, Err } from '../types/result.js';

export interface BoardManagementReportInput {
  clienteCnpj: string;
  razaoSocial: string;
  mesCompetencia: string; // Ex: '2026-08'
  receitaBrutaBrl: number;
  deducoesTributosSobreVendasBrl: number;
  custoProdutosMercadoriasServicosBrl: number;
  despesasOperacionaisFixasBrl: number;
  despesasDepreciacaoAmortizacaoBrl: number;
  resultadoFinanceiroLiquidoBrl: number;
}

export interface BoardManagementReportResult {
  clienteCnpj: string;
  razaoSocial: string;
  mesCompetencia: string;
  receitaLiquidaBrl: number;
  lucroBrutoBrl: number;
  margemBrutaPercent: number;
  ebitdaOperacionalBrl: number;
  margemEbitdaPercent: number;
  lucroLiquidoMesBrl: number;
  margemLiquidaPercent: number;
  cargaTributariaEfetivaPercent: number;
  statusRelatorio: 'RELATORIO_DIRETORIA_GERADO_COM_SUCESSO';
  diagnosticoDiretoria: string;
}

export function processOfficeExecutiveBoardManagementReportsEngine(input: BoardManagementReportInput): Result<BoardManagementReportResult, Error> {
  const {
    clienteCnpj,
    razaoSocial,
    mesCompetencia,
    receitaBrutaBrl,
    deducoesTributosSobreVendasBrl,
    custoProdutosMercadoriasServicosBrl,
    despesasOperacionaisFixasBrl,
    despesasDepreciacaoAmortizacaoBrl,
    resultadoFinanceiroLiquidoBrl
  } = input;

  if (!clienteCnpj || receitaBrutaBrl <= 0) {
    return Err(new Error('CNPJ do cliente e receita bruta válida são obrigatórios.'));
  }

  const recLiq = receitaBrutaBrl - deducoesTributosSobreVendasBrl;
  const lucroBruto = recLiq - custoProdutosMercadoriasServicosBrl;
  const margemBruta = (lucroBruto / recLiq) * 100;

  // EBITDA = Lucro Operacional antes de Juros, Impostos, Depreciação e Amortização
  const ebitda = lucroBruto - despesasOperacionaisFixasBrl;
  const margemEbitda = (ebitda / recLiq) * 100;

  const lucroLiq = ebitda - despesasDepreciacaoAmortizacaoBrl + resultadoFinanceiroLiquidoBrl;
  const margemLiquida = (lucroLiq / recLiq) * 100;
  const cargaTrib = (deducoesTributosSobreVendasBrl / receitaBrutaBrl) * 100;

  const diag = "Relatório Executivo (" + razaoSocial + " - " + mesCompetencia + "): Receita Líquida: R$ " + recLiq.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " | EBITDA: R$ " + ebitda.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " (" + margemEbitda.toFixed(1) + "%) | Lucro Líquido: R$ " + lucroLiq.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " (" + margemLiquida.toFixed(1) + "%) | Carga Tributária Efetiva: " + cargaTrib.toFixed(1) + "%.";

  return Ok({
    clienteCnpj,
    razaoSocial,
    mesCompetencia,
    receitaLiquidaBrl: parseFloat(recLiq.toFixed(2)),
    lucroBrutoBrl: parseFloat(lucroBruto.toFixed(2)),
    margemBrutaPercent: parseFloat(margemBruta.toFixed(1)),
    ebitdaOperacionalBrl: parseFloat(ebitda.toFixed(2)),
    margemEbitdaPercent: parseFloat(margemEbitda.toFixed(1)),
    lucroLiquidoMesBrl: parseFloat(lucroLiq.toFixed(2)),
    margemLiquidaPercent: parseFloat(margemLiquida.toFixed(1)),
    cargaTributariaEfetivaPercent: parseFloat(cargaTrib.toFixed(1)),
    statusRelatorio: 'RELATORIO_DIRETORIA_GERADO_COM_SUCESSO',
    diagnosticoDiretoria: diag
  });
}
