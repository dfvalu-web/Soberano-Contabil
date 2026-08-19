import { Result, Ok, Err } from '../types/result.js';

export interface BpoDreInput {
  clienteCnpj: string;
  receitaBrutaVendasBrl: number;
  deducoesTributosVendasBrl: number;
  custosProdutosServicosBrl: number;
  despesasOperacionaisAdmBrl: number;
  despesasFinanceirasLiquidasBrl: number;
}

export interface BpoDreResult {
  clienteCnpj: string;
  receitaLiquidaBrl: number;
  lucroBrutoBrl: number;
  margemBrutaPercent: number;
  lucroOperacionalEbitdaBrl: number;
  margemEbitdaPercent: number;
  lucroLiquidoGerencialBrl: number;
  statusDre: 'DRE_GERENCIAL_BPO_PROCESSADA_COM_SUCESSO';
  diagnosticoDre: string;
}

export function processFinancialBpoCashflowDreEngine(input: BpoDreInput): Result<BpoDreResult, Error> {
  const {
    clienteCnpj,
    receitaBrutaVendasBrl,
    deducoesTributosVendasBrl,
    custosProdutosServicosBrl,
    despesasOperacionaisAdmBrl,
    despesasFinanceirasLiquidasBrl
  } = input;

  if (!clienteCnpj || receitaBrutaVendasBrl <= 0) {
    return Err(new Error('CNPJ do cliente e receita bruta são obrigatórios.'));
  }

  const receitaLiquida = receitaBrutaVendasBrl - deducoesTributosVendasBrl;
  const lucroBruto = receitaLiquida - custosProdutosServicosBrl;
  const margemBruta = (lucroBruto / receitaLiquida) * 100;

  const ebitda = lucroBruto - despesasOperacionaisAdmBrl;
  const margemEbitda = (ebitda / receitaLiquida) * 100;

  const lucroLiquido = ebitda - despesasFinanceirasLiquidasBrl;

  const diag = "DRE Gerencial BPO (" + clienteCnpj + "): Receita Liquida: R$ " + receitaLiquida.toLocaleString('pt-BR') + " | Lucro Bruto: R$ " + lucroBruto.toLocaleString('pt-BR') + " (" + margemBruta.toFixed(1) + "%) | EBITDA: R$ " + ebitda.toLocaleString('pt-BR') + " (" + margemEbitda.toFixed(1) + "%) | Lucro Liquido: R$ " + lucroLiquido.toLocaleString('pt-BR') + " -> Relatorio pronto para o cliente.";

  return Ok({
    clienteCnpj,
    receitaLiquidaBrl: parseFloat(receitaLiquida.toFixed(2)),
    lucroBrutoBrl: parseFloat(lucroBruto.toFixed(2)),
    margemBrutaPercent: parseFloat(margemBruta.toFixed(1)),
    lucroOperacionalEbitdaBrl: parseFloat(ebitda.toFixed(2)),
    margemEbitdaPercent: parseFloat(margemEbitda.toFixed(1)),
    lucroLiquidoGerencialBrl: parseFloat(lucroLiquido.toFixed(2)),
    statusDre: 'DRE_GERENCIAL_BPO_PROCESSADA_COM_SUCESSO',
    diagnosticoDre: diag
  });
}
