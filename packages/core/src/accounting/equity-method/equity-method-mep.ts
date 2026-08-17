import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export interface EquityMethodInput {
  investimentoId: string;
  nomeInvestida: string;
  cnpjInvestida: string;
  percentualParticipacao: number; // e.g. 40 para 40%
  patrimonioLiquidoAtualInvestida: number;
  saldoContabilAnteriorInvestimento: number;
  lucrosNaoRealizadosIntercompany: number;
  periodoApuracao: string;
}

export interface EquityMethodResult {
  investimentoId: string;
  nomeInvestida: string;
  valorParticipacaoCalculado: number;
  saldoAnterior: number;
  variacaoEquivalenciaPatrimonial: number;
  tipoResultado: 'GANHO_MEP' | 'PERDA_MEP' | 'SEM_VARIACAO';
  novoSaldoInvestimento: number;
  partidasDobradaSugeridas: JournalEntryLine[];
}

export function calculateEquityMethod(input: EquityMethodInput): Result<EquityMethodResult, Error> {
  const {
    investimentoId,
    nomeInvestida,
    percentualParticipacao,
    patrimonioLiquidoAtualInvestida,
    saldoContabilAnteriorInvestimento,
    lucrosNaoRealizadosIntercompany
  } = input;

  if (percentualParticipacao <= 0 || percentualParticipacao > 100) {
    return Err(new Error('Percentual de participação deve estar entre 0.01% e 100%.'));
  }

  const plAjustado = Math.max(0, patrimonioLiquidoAtualInvestida - lucrosNaoRealizadosIntercompany);
  const valorParticipacaoCalculado = Number((plAjustado * (percentualParticipacao / 100)).toFixed(2));
  const variacaoMep = Number((valorParticipacaoCalculado - saldoContabilAnteriorInvestimento).toFixed(2));
  const novoSaldoInvestimento = valorParticipacaoCalculado;

  let tipoResultado: 'GANHO_MEP' | 'PERDA_MEP' | 'SEM_VARIACAO' = 'SEM_VARIACAO';
  const partidas: JournalEntryLine[] = [];

  if (variacaoMep > 0) {
    tipoResultado = 'GANHO_MEP';
    // D: Investimentos em Coligadas (Ativo Não Circulante)
    partidas.push({
      accountId: '1.2.2.01',
      accountCode: '1.2.2.01',
      accountName: `Investimentos em Coligadas/Controladas - ${nomeInvestida}`,
      type: 'DEBIT',
      amount: Math.abs(variacaoMep)
    });
    // C: Resultado Positivo da Equivalência Patrimonial (Resultado)
    partidas.push({
      accountId: '3.1.4.01',
      accountCode: '3.1.4.01',
      accountName: 'Ganho por Equivalência Patrimonial (Resultado - CPC 18)',
      type: 'CREDIT',
      amount: Math.abs(variacaoMep)
    });
  } else if (variacaoMep < 0) {
    tipoResultado = 'PERDA_MEP';
    // D: Resultado Negativo da Equivalência Patrimonial (Resultado)
    partidas.push({
      accountId: '4.1.4.01',
      accountCode: '4.1.4.01',
      accountName: 'Perda por Equivalência Patrimonial (Resultado - CPC 18)',
      type: 'DEBIT',
      amount: Math.abs(variacaoMep)
    });
    // C: Investimentos em Coligadas (Ativo Não Circulante)
    partidas.push({
      accountId: '1.2.2.01',
      accountCode: '1.2.2.01',
      accountName: `Investimentos em Coligadas/Controladas - ${nomeInvestida}`,
      type: 'CREDIT',
      amount: Math.abs(variacaoMep)
    });
  }

  return Ok({
    investimentoId,
    nomeInvestida,
    valorParticipacaoCalculado,
    saldoAnterior: saldoContabilAnteriorInvestimento,
    variacaoEquivalenciaPatrimonial: variacaoMep,
    tipoResultado,
    novoSaldoInvestimento,
    partidasDobradaSugeridas: partidas
  });
}
