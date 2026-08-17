import { Result, Ok, Err } from '../../types/result.js';

export interface DrexTpftInput {
  instituicaoParticipanteCnpj: string;
  tipoTituloTokenizado: 'TPFT_TESOURO_SELIC' | 'TPFT_TESOURO_IPCA_MAIS' | 'TPFT_TESOURO_PREFIXADO';
  volumeTitulosTokenizados: number; // Ex: 5.000 tokens TPFT
  precoUnitarioEmissaoBrl: number; // Ex: R$ 1.000,00 -> R$ 5.000.000,00
  taxaJurosAnualEfetivaPercent: number; // Ex: 10.50% a.a.
  prazoDiasDecorrido: number; // Ex: 90 dias
  classificacaoCpc48: 'CUSTO_AMORTIZADO' | 'VALOR_JUSTO_RESULTADO';
}

export interface DrexTpftResult {
  instituicaoParticipanteCnpj: string;
  tipoTituloTokenizado: string;
  valorAplicacaoInicialBrl: number;
  jurosApropriadosPeriodoBrl: number; // R$ 5.000.000 * (10.5% * 90/360) = R$ 131.250,00
  valorContabilAtualizadoBrl: number; // R$ 5.131.250,00
  statusDrexCustodia: 'TPFT_CUSTODIADO_REDE_DREX_BACEN';
  diagnosticoDrex: string;
}

export function processDrexCbdcTokenizedTpftSettlementEngine(input: DrexTpftInput): Result<DrexTpftResult, Error> {
  const {
    instituicaoParticipanteCnpj,
    tipoTituloTokenizado,
    volumeTitulosTokenizados,
    precoUnitarioEmissaoBrl,
    taxaJurosAnualEfetivaPercent,
    prazoDiasDecorrido,
    classificacaoCpc48
  } = input;

  if (!instituicaoParticipanteCnpj || volumeTitulosTokenizados <= 0 || precoUnitarioEmissaoBrl <= 0) {
    return Err(new Error('CNPJ, volume de tokens e preço unitário são obrigatórios para custódia DREX.'));
  }

  const valorInicial = volumeTitulosTokenizados * precoUnitarioEmissaoBrl;
  const juros = valorInicial * ((taxaJurosAnualEfetivaPercent / 100) * (prazoDiasDecorrido / 360));
  const valorContabil = valorInicial + juros;

  const diag = "DREX Real Digital (BACEN / CPC 48): Custodia de " + volumeTitulosTokenizados.toLocaleString('pt-BR') + " tokens " + tipoTituloTokenizado + " | Aplicacao: R$ " + valorInicial.toLocaleString('pt-BR') + " | Rendimento Acumulado (" + prazoDiasDecorrido + " dias): R$ " + juros.toLocaleString('pt-BR') + " -> Valor Contabil: R$ " + valorContabil.toLocaleString('pt-BR');

  return Ok({
    instituicaoParticipanteCnpj,
    tipoTituloTokenizado,
    valorAplicacaoInicialBrl: valorInicial,
    jurosApropriadosPeriodoBrl: parseFloat(juros.toFixed(2)),
    valorContabilAtualizadoBrl: parseFloat(valorContabil.toFixed(2)),
    statusDrexCustodia: 'TPFT_CUSTODIADO_REDE_DREX_BACEN',
    diagnosticoDrex: diag
  });
}
