import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export type WeatherIndexType = 'INDICE_PRECIPITACAO_CHUVA_MM' | 'INDICE_TEMPERATURA_HDD_CDD';

export interface WeatherDerivativeInput {
  contratoId: string;
  contraparteNome: string;
  tipoIndiceClimatico: WeatherIndexType;
  indiceStrikeContratado: number; // Ex: 400 mm de chuva mínima
  indiceEfetivoApurado: number; // Ex: 250 mm (Déficit hídrico)
  multiplicadorFinanceiroPorPontoBrl: number; // Ex: R$ 5.000 por mm abaixo do strike
  premioPagoAntecipadoBrl: number; // Prêmio pago na contratação
}

export interface WeatherDerivativeResult {
  contratoId: string;
  contraparteNome: string;
  tipoIndiceClimatico: WeatherIndexType;
  payoffLiquidacaoFinanceiraBrl: number; // Recebimento da indenização
  resultadoLiquidoDrebBrl: number; // Payoff - Prêmio Pago
  partidasDobrada: JournalEntryLine[];
  diagnosticoCpc48: string;
}

export function evaluateWeatherDerivativesClimateSwapsCpc48(input: WeatherDerivativeInput): Result<WeatherDerivativeResult, Error> {
  const {
    contratoId,
    contraparteNome,
    tipoIndiceClimatico,
    indiceStrikeContratado,
    indiceEfetivoApurado,
    multiplicadorFinanceiroPorPontoBrl,
    premioPagoAntecipadoBrl
  } = input;

  if (indiceStrikeContratado <= 0 || multiplicadorFinanceiroPorPontoBrl <= 0 || premioPagoAntecipadoBrl < 0) {
    return Err(new Error('Strike e multiplicador financeiro do contrato climático devem ser superiores a zero.'));
  }

  // CPC 48 / IFRS 9 (Derivativos Climáticos FVTPL):
  // Payoff = Max(0, Strike - Índice Efetivo) * Multiplicador
  const desvioIndice = Math.max(0, indiceStrikeContratado - indiceEfetivoApurado);
  const payoff = Number((desvioIndice * multiplicadorFinanceiroPorPontoBrl).toFixed(2));
  const resultadoLiquido = Number((payoff - premioPagoAntecipadoBrl).toFixed(2));

  const partidas: JournalEntryLine[] = [];

  // 1. D: Bancos Conta Movimento - Recebimento do Payoff do Derivativo (Ativo Circulante)
  if (payoff > 0) {
    partidas.push({
      accountId: '1.1.1.01',
      accountCode: '1.1.1.01',
      accountName: 'Bancos Conta Movimento - Liquidação de Derivativo Climático (Ativo Circulante)',
      type: 'DEBIT',
      amount: payoff
    });

    // 2. C: Ganho com Instrumentos Financeiros Derivativos Climáticos (Resultado - CPC 48)
    partidas.push({
      accountId: '3.1.2.15',
      accountCode: '3.1.2.15',
      accountName: 'Ganho com Liquidação de Derivativos Climáticos (Resultado - CPC 48)',
      type: 'CREDIT',
      amount: payoff
    });
  }

  const diag = 'Derivativo Climático (CPC 48 / FVTPL): ' + contraparteNome + ' (' + tipoIndiceClimatico + '). Strike: ' + indiceStrikeContratado + ' | Índice Efetivo: ' + indiceEfetivoApurado + ' (Déficit de ' + desvioIndice + ' pontos). Payoff Recebido: R$ ' + payoff.toFixed(2) + ' (Prêmio Pago: R$ ' + premioPagoAntecipadoBrl.toFixed(2) + ' -> Resultado Líquido DRE: R$ ' + resultadoLiquido.toFixed(2) + ').';

  return Ok({
    contratoId,
    contraparteNome,
    tipoIndiceClimatico,
    payoffLiquidacaoFinanceiraBrl: payoff,
    resultadoLiquidoDrebBrl: resultadoLiquido,
    partidasDobrada: partidas,
    diagnosticoCpc48: diag
  });
}
