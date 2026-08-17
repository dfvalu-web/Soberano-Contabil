import { Result, Ok, Err } from '../../types/result.js';

export type IofOperationType = 'IOF_CREDITO_MUTUO_EMPRESTIMO' | 'IOF_CAMBIO_REMESSA_EXTERIOR' | 'IOF_TITULOS_RESGATE_CURTO_PRAZO';
export type BorrowerType = 'PESSOA_JURIDICA' | 'PESSOA_FISICA';

export interface IofTaxInput {
  operacaoId: string;
  tomadorNome: string;
  tipoOperacao: IofOperationType;
  tipoTomador?: BorrowerType;
  valorOperacaoBrl: number;
  prazoDias?: number; // Para IOF Crédito ou Títulos
  rendimentoBrutoResgateBrl?: number; // Para IOF Títulos
}

export interface IofTaxResult {
  operacaoId: string;
  tomadorNome: string;
  tipoOperacao: IofOperationType;
  valorBaseCalculoBrl: number;
  aliquotaEfetivaIofPercent: number;
  valorIofDevidoBrl: number;
  diagnosticoFiscal: string;
}

export function processIofFinancialOperationsTaxEngine(input: IofTaxInput): Result<IofTaxResult, Error> {
  const {
    operacaoId,
    tomadorNome,
    tipoOperacao,
    tipoTomador = 'PESSOA_JURIDICA',
    valorOperacaoBrl,
    prazoDias = 30,
    rendimentoBrutoResgateBrl = 0
  } = input;

  if (valorOperacaoBrl <= 0) {
    return Err(new Error('Valor da operação financeira deve ser superior a zero.'));
  }

  // 1. IOF / Crédito (Mútuo, Financiamento, Conta Garantida) - Dec. 6.306/2007 Art. 7º
  if (tipoOperacao === 'IOF_CREDITO_MUTUO_EMPRESTIMO') {
    const diasTributaveis = Math.min(365, prazoDias);
    // Alíquota diária: PJ = 0.0041% ao dia (1.50% ao ano) | PF = 0.0082% ao dia (3.00% ao ano)
    const aliqDiaria = tipoTomador === 'PESSOA_JURIDICA' ? 0.0041 : 0.0082;
    const iofDiario = Number((valorOperacaoBrl * (aliqDiaria / 100) * diasTributaveis).toFixed(2));
    const iofAdicional = Number((valorOperacaoBrl * 0.0038).toFixed(2)); // 0.38% adicional fixo
    const totalIofCredito = Number((iofDiario + iofAdicional).toFixed(2));

    const diag = 'IOF/Crédito (Dec. 6.306/07 Art. 7º): ' + tomadorNome + ' (' + tipoTomador + '). Principal R$ ' + valorOperacaoBrl.toFixed(2) + ' por ' + diasTributaveis + ' dias. IOF Diário (' + (aliqDiaria * diasTributaveis).toFixed(4) + '%): R$ ' + iofDiario.toFixed(2) + ' + IOF Adicional (0,38%): R$ ' + iofAdicional.toFixed(2) + ' = Total IOF R$ ' + totalIofCredito.toFixed(2) + '.';

    return Ok({
      operacaoId,
      tomadorNome,
      tipoOperacao,
      valorBaseCalculoBrl: valorOperacaoBrl,
      aliquotaEfetivaIofPercent: Number(((totalIofCredito / valorOperacaoBrl) * 100).toFixed(4)),
      valorIofDevidoBrl: totalIofCredito,
      diagnosticoFiscal: diag
    });
  }

  // 2. IOF / Câmbio (Remessas ao Exterior) - Dec. 6.306/2007 Art. 15-B
  if (tipoOperacao === 'IOF_CAMBIO_REMESSA_EXTERIOR') {
    const aliqCambio = 0.38; // 0.38% para remessa de mesma titularidade / pagamentos
    const iofCambio = Number((valorOperacaoBrl * (aliqCambio / 100)).toFixed(2));

    const diag = 'IOF/Câmbio (Dec. 6.306/07 Art. 15-B): ' + tomadorNome + '. Remessa ao Exterior R$ ' + valorOperacaoBrl.toFixed(2) + ' à alíquota de ' + aliqCambio + '% = IOF Devido R$ ' + iofCambio.toFixed(2) + '.';

    return Ok({
      operacaoId,
      tomadorNome,
      tipoOperacao,
      valorBaseCalculoBrl: valorOperacaoBrl,
      aliquotaEfetivaIofPercent: aliqCambio,
      valorIofDevidoBrl: iofCambio,
      diagnosticoFiscal: diag
    });
  }

  // 3. IOF / Títulos e Valores Mobiliários (Resgate Curto Prazo < 30 dias) - Dec. 6.306/2007 Art. 32
  // Tabela regressiva de 96% no dia 1 a 0% a partir do dia 30 sobre o rendimento
  const tabelaRegressivaIofTitulos: Record<number, number> = {
    1: 96, 2: 93, 3: 90, 4: 86, 5: 83, 6: 80, 7: 76, 8: 73, 9: 70, 10: 66,
    11: 63, 12: 60, 13: 56, 14: 53, 15: 50, 16: 46, 17: 43, 18: 40, 19: 36, 20: 33,
    21: 30, 22: 26, 23: 23, 24: 20, 25: 16, 26: 13, 27: 10, 28: 6, 29: 3
  };

  const percIof = prazoDias >= 30 ? 0 : (tabelaRegressivaIofTitulos[prazoDias] || 0);
  const baseRendimento = Math.max(0, rendimentoBrutoResgateBrl);
  const iofTitulos = Number((baseRendimento * (percIof / 100)).toFixed(2));

  const diag = 'IOF/Títulos (Dec. 6.306/07 Art. 32): Resgate no dia ' + prazoDias + ' com rendimento de R$ ' + baseRendimento.toFixed(2) + '. Alíquota Regressiva: ' + percIof + '% = IOF Retido R$ ' + iofTitulos.toFixed(2) + '.';

  return Ok({
    operacaoId,
    tomadorNome,
    tipoOperacao,
    valorBaseCalculoBrl: baseRendimento,
    aliquotaEfetivaIofPercent: percIof,
    valorIofDevidoBrl: iofTitulos,
    diagnosticoFiscal: diag
  });
}
