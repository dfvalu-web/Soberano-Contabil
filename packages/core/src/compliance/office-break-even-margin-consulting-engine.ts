import { Result, Ok, Err } from '../types/result.js';

export interface BreakEvenConsultingInput {
  clienteCnpj: string;
  razaoSocial: string;
  faturamentoAtualBrl: number;
  custosVariaveisTotaisBrl: number; // CMV + Impostos Variáveis + Comissões
  custosDespesasFixasMensaisBrl: number; // Aluguel + Folha Administrativa + Pró-Labore + Tarifas
}

export interface BreakEvenConsultingResult {
  clienteCnpj: string;
  razaoSocial: string;
  margemContribuicaoTotalBrl: number;
  indiceMargemContribuicaoPercent: number; // Margem Contribuição / Faturamento
  pontoEquilibrioContabilBrl: number; // Custos Fixos / Índice MC
  margemSegurancaOperacionalPercent: number; // (Faturamento - Ponto Equilíbrio) / Faturamento
  situacaoOperacional: 'EMPRESA_SUPERAVITARIA_LUCRO' | 'PONTO_DE_EQUILIBRIO_ZERO_A_ZERO' | 'OPERACAO_DEFICITARIA_PREJUIZO';
  statusConsultoria: 'CONSULTORIA_PONTO_EQUILIBRIO_CONCLUIDA';
  diagnosticoConsultoria: string;
}

export function processOfficeBreakEvenMarginConsultingEngine(input: BreakEvenConsultingInput): Result<BreakEvenConsultingResult, Error> {
  const {
    clienteCnpj,
    razaoSocial,
    faturamentoAtualBrl,
    custosVariaveisTotaisBrl,
    custosDespesasFixasMensaisBrl
  } = input;

  if (!clienteCnpj || faturamentoAtualBrl <= 0 || custosDespesasFixasMensaisBrl < 0) {
    return Err(new Error('CNPJ, faturamento e custos fixos válidos são obrigatórios.'));
  }

  const margemContr = faturamentoAtualBrl - custosVariaveisTotaisBrl;
  const indiceMc = (margemContr / faturamentoAtualBrl);
  const indiceMcPerc = indiceMc * 100;

  const pontoEquilibrio = indiceMc > 0 ? custosDespesasFixasMensaisBrl / indiceMc : 0;
  const margemSeguranca = ((faturamentoAtualBrl - pontoEquilibrio) / faturamentoAtualBrl) * 100;

  let situacao: 'EMPRESA_SUPERAVITARIA_LUCRO' | 'PONTO_DE_EQUILIBRIO_ZERO_A_ZERO' | 'OPERACAO_DEFICITARIA_PREJUIZO' = 'EMPRESA_SUPERAVITARIA_LUCRO';
  if (faturamentoAtualBrl < pontoEquilibrio) situacao = 'OPERACAO_DEFICITARIA_PREJUIZO';
  else if (Math.abs(faturamentoAtualBrl - pontoEquilibrio) < 100) situacao = 'PONTO_DE_EQUILIBRIO_ZERO_A_ZERO';

  const diag = "Consultoria de Ponto de Equilíbrio (" + razaoSocial + "): Índice de Margem de Contribuição: " + indiceMcPerc.toFixed(1) + "% | Faturamento Mínimo para não ter Prejuízo (Break-Even): R$ " + pontoEquilibrio.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " | Margem de Segurança: " + margemSeguranca.toFixed(1) + "% -> Situação: " + situacao + ".";

  return Ok({
    clienteCnpj,
    razaoSocial,
    margemContribuicaoTotalBrl: parseFloat(margemContr.toFixed(2)),
    indiceMargemContribuicaoPercent: parseFloat(indiceMcPerc.toFixed(1)),
    pontoEquilibrioContabilBrl: parseFloat(pontoEquilibrio.toFixed(2)),
    margemSegurancaOperacionalPercent: parseFloat(margemSeguranca.toFixed(1)),
    situacaoOperacional: situacao,
    statusConsultoria: 'CONSULTORIA_PONTO_EQUILIBRIO_CONCLUIDA',
    diagnosticoConsultoria: diag
  });
}
