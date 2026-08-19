import { Result, Ok, Err } from '../types/result.js';

export interface EquityAccountingLalurInput {
  investidoraRazaoSocial: string;
  investidaRazaoSocial: string;
  valorResultadoMepBrl: number;
  tipoResultadoMep: 'GANHO_EQUIVALENCIA_POSITIVA' | 'PERDA_EQUIVALENCIA_NEGATIVA';
  valorDividendosReceberBrl: number;
}

export interface EquityAccountingLalurResult {
  investidoraRazaoSocial: string;
  ajusteLalurBlocoM300: string;
  partidaDobradaMepResultado: string;
  partidaDobradaDividendos: string;
  statusContabilizacao: 'MEP_CONCILIADO_LALUR_ECF_E_RAZAO';
  diagnosticoLalur: string;
}

export function processOfficeEquityAccountingLalurEngine(input: EquityAccountingLalurInput): Result<EquityAccountingLalurResult, Error> {
  const {
    investidoraRazaoSocial,
    investidaRazaoSocial,
    valorResultadoMepBrl,
    tipoResultadoMep,
    valorDividendosReceberBrl
  } = input;

  if (!investidoraRazaoSocial || valorResultadoMepBrl === 0) {
    return Err(new Error('Razão social da investidora e valor do MEP são obrigatórios.'));
  }

  let lalur = '';
  let lancamentoMep = '';

  if (tipoResultadoMep === 'GANHO_EQUIVALENCIA_POSITIVA') {
    lalur = "ECF Bloco M300 - Exclusão de Ganho de Equivalência Patrimonial (Art. 386 RIR/18) no valor de R$ " + valorResultadoMepBrl.toFixed(2) + " (Zero IRPJ/CSLL)";
    lancamentoMep = "D - 1.2.02.001 Participações Societárias (" + investidaRazaoSocial + ") | C - 3.2.01.001 Receita de Equivalência Patrimonial no valor de R$ " + valorResultadoMepBrl.toFixed(2);
  } else {
    lalur = "ECF Bloco M300 - Adição de Perda de Equivalência Patrimonial (Indedutível) no valor de R$ " + Math.abs(valorResultadoMepBrl).toFixed(2);
    lancamentoMep = "D - 3.2.02.001 Despesa com Perda de Equivalência Patrimonial | C - 1.2.02.001 Participações Societárias (" + investidaRazaoSocial + ") no valor de R$ " + Math.abs(valorResultadoMepBrl).toFixed(2);
  }

  const lancamentoDividendos = "D - 1.1.03.008 Dividendos a Receber | C - 1.2.02.001 Participações Societárias (" + investidaRazaoSocial + ") no valor de R$ " + valorDividendosReceberBrl.toFixed(2);

  const diag = "LALUR & Razão (" + investidoraRazaoSocial + "): " + lalur + " | Partidas dobradas de MEP e dividendos efetuadas com sucesso.";

  return Ok({
    investidoraRazaoSocial,
    ajusteLalurBlocoM300: lalur,
    partidaDobradaMepResultado: lancamentoMep,
    partidaDobradaDividendos: lancamentoDividendos,
    statusContabilizacao: 'MEP_CONCILIADO_LALUR_ECF_E_RAZAO',
    diagnosticoLalur: diag
  });
}
