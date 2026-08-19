import { Result, Ok, Err } from '../types/result.js';

export interface PenaltySelicCalculationInput {
  valorPrincipalBrl: number;
  dataVencimentoOriginal: string; // Ex: '2026-06-20'
  dataPagamentoAtualizada: string; // Ex: '2026-08-18'
  taxaSelicAcumuladaPeriodoPercent: number; // Ex: 1.85%
}

export interface PenaltySelicCalculationResult {
  valorPrincipalBrl: number;
  diasAtrasoCorridos: number;
  percentualMultaPercent: number; // 0.33%/dia limitado a 20%
  valorMultaMoraBrl: number;
  percentualJurosSelicTotalPercent: number; // Selic acumulada + 1%
  valorJurosMoraBrl: number;
  valorTotalAtualizadoBrl: number;
  statusCalculo: 'ENCARGOS_MORATORIOS_OFICIAIS_CALCULADOS';
  diagnosticoEncargos: string;
}

export function processOfficeSelicInterestPenaltyCalculatorEngine(input: PenaltySelicCalculationInput): Result<PenaltySelicCalculationResult, Error> {
  const {
    valorPrincipalBrl,
    dataVencimentoOriginal,
    dataPagamentoAtualizada,
    taxaSelicAcumuladaPeriodoPercent
  } = input;

  if (valorPrincipalBrl <= 0 || !dataVencimentoOriginal || !dataPagamentoAtualizada) {
    return Err(new Error('Valor principal positivo e datas válidas são obrigatórios.'));
  }

  const dVenc = new Date(dataVencimentoOriginal);
  const dPag = new Date(dataPagamentoAtualizada);
  const diffTime = dPag.getTime() - dVenc.getTime();
  const diasAtraso = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));

  // Multa de mora: 0.33% ao dia limitado a 20% (Art. 35 da LC 123/06)
  const percMulta = Math.min(20.0, diasAtraso * 0.33);
  const valorMulta = valorPrincipalBrl * (percMulta / 100);

  // Juros de mora: Taxa Selic acumulada + 1% no mês de pagamento (Art. 35 § 1º)
  const percJuros = taxaSelicAcumuladaPeriodoPercent + (diasAtraso > 0 ? 1.0 : 0.0);
  const valorJuros = valorPrincipalBrl * (percJuros / 100);

  const totalAtualizado = valorPrincipalBrl + valorMulta + valorJuros;

  const diag = "Cálculo de Encargos (" + dataVencimentoOriginal + " -> " + dataPagamentoAtualizada + "): " + diasAtraso + " dias de atraso | Multa: " + percMulta.toFixed(2) + "% (R$ " + valorMulta.toFixed(2) + ") | Juros Selic+1%: " + percJuros.toFixed(2) + "% (R$ " + valorJuros.toFixed(2) + ") -> Total Atualizado: R$ " + totalAtualizado.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ".";

  return Ok({
    valorPrincipalBrl: parseFloat(valorPrincipalBrl.toFixed(2)),
    diasAtrasoCorridos: diasAtraso,
    percentualMultaPercent: parseFloat(percMulta.toFixed(2)),
    valorMultaMoraBrl: parseFloat(valorMulta.toFixed(2)),
    percentualJurosSelicTotalPercent: parseFloat(percJuros.toFixed(2)),
    valorJurosMoraBrl: parseFloat(valorJuros.toFixed(2)),
    valorTotalAtualizadoBrl: parseFloat(totalAtualizado.toFixed(2)),
    statusCalculo: 'ENCARGOS_MORATORIOS_OFICIAIS_CALCULADOS',
    diagnosticoEncargos: diag
  });
}
