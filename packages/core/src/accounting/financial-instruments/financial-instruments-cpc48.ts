import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export interface NdfContractInput {
  contratoId: string;
  instituicaoFinanceiraContraparte: string;
  moedaEstrangeira: 'USD' | 'EUR';
  montanteNocionalMoedaEstrangeira: number; // e.g. $ 1,000,000.00
  taxaCambialTermoPactuada: number; // e.g. R$ 5.20
  taxaCambialSpotFechamento: number; // e.g. R$ 5.45
  tipoHedge: 'HEDGE_DE_FLUXO_DE_CAIXA_DRA' | 'VALOR_JUSTO_RESULTADO';
  objetoProtegidoDescricao: string; // e.g. "Exportação futura de soja"
}

export interface NdfContractResult {
  contratoId: string;
  montanteNocionalBrlPactuado: number;
  valorJustoContratoBrlNoFechamento: number;
  ganhoOuPerdaNdfBrl: number;
  tipoResultadoNdf: 'GANHO_DERIVATIVO' | 'PERDA_DERIVATIVO' | 'SEM_VARIACAO';
  destinoContabil: 'OUTROS_RESULTADOS_ABRANGENTES_PL' | 'RESULTADO_DO_EXERCICIO';
  partidasDobradaHedge: JournalEntryLine[];
}

export function evaluateNdfHedgeAccounting(input: NdfContractInput): Result<NdfContractResult, Error> {
  const {
    contratoId,
    montanteNocionalMoedaEstrangeira,
    taxaCambialTermoPactuada,
    taxaCambialSpotFechamento,
    tipoHedge
  } = input;

  if (montanteNocionalMoedaEstrangeira <= 0 || taxaCambialTermoPactuada <= 0 || taxaCambialSpotFechamento <= 0) {
    return Err(new Error('Parâmetros de derivativo NDF devem ser superiores a zero.'));
  }

  const nocionalPactuado = Number((montanteNocionalMoedaEstrangeira * taxaCambialTermoPactuada).toFixed(2));
  const valorSpotFechamento = Number((montanteNocionalMoedaEstrangeira * taxaCambialSpotFechamento).toFixed(2));
  const diffDerivativo = Number((valorSpotFechamento - nocionalPactuado).toFixed(2));

  let tipoRes: NdfContractResult['tipoResultadoNdf'] = 'SEM_VARIACAO';
  if (diffDerivativo > 0) tipoRes = 'GANHO_DERIVATIVO';
  else if (diffDerivativo < 0) tipoRes = 'PERDA_DERIVATIVO';

  const isCashFlowHedge = tipoHedge === 'HEDGE_DE_FLUXO_DE_CAIXA_DRA';
  const partidas: JournalEntryLine[] = [];

  if (diffDerivativo > 0) {
    // Ganho no NDF
    partidas.push({
      accountId: '1.1.2.08',
      accountCode: '1.1.2.08',
      accountName: 'Instrumentos Financeiros Derivativos Ativos - NDF (Ativo Circulante - CPC 48)',
      type: 'DEBIT',
      amount: diffDerivativo
    });

    const contaCredito = isCashFlowHedge ? '2.3.4.01' : '3.1.3.08';
    const nomeCredito = isCashFlowHedge
      ? 'Outros Resultados Abrangentes - Hedge de Fluxo de Caixa (Patrimônio Líquido - DRA)'
      : 'Ganhos com Instrumentos Financeiros Derivativos (Resultado)';

    partidas.push({
      accountId: contaCredito,
      accountCode: contaCredito,
      accountName: nomeCredito,
      type: 'CREDIT',
      amount: diffDerivativo
    });
  }

  return Ok({
    contratoId,
    montanteNocionalBrlPactuado: nocionalPactuado,
    valorJustoContratoBrlNoFechamento: valorSpotFechamento,
    ganhoOuPerdaNdfBrl: diffDerivativo,
    tipoResultadoNdf: tipoRes,
    destinoContabil: isCashFlowHedge ? 'OUTROS_RESULTADOS_ABRANGENTES_PL' : 'RESULTADO_DO_EXERCICIO',
    partidasDobradaHedge: partidas
  });
}
