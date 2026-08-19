import { Result, Ok, Err } from '../types/result.js';

export interface ClientComplexityInput {
  clienteCnpj: string;
  razaoSocial: string;
  regimeTributario: 'SIMPLES_NACIONAL' | 'LUCRO_PRESUMIDO' | 'LUCRO_REAL';
  volumeNotasFiscaisMes: number;
  quantidadeFuncionariosFolha: number;
  possuiSubstituicaoTributariaOuMonofasicos: boolean;
  possuiIntegracaoBancariaAutomatica: boolean;
  honorarioAtualCobradoBrl: number;
  margemDesejadaPercent: number; // Ex: 40%
}

export interface ClientComplexityResult {
  clienteCnpj: string;
  razaoSocial: string;
  scoreComplexidadePontos: number; // Ex: 1 a 100
  honorarioSugeridoIdealBrl: number;
  diferencaHonorarioBrl: number; // honorario sugerido - atual
  acaoRecomendada: 'MANTER_HONORARIO_COMPATIVEL' | 'REPACTUAR_REAJUSTAR_HONORARIOS';
  statusPrecificacao: 'SCORE_COMPLEXIDADE_PRECIFICADO_COM_SUCESSO';
  diagnosticoPrecificacao: string;
}

export function processOfficeComplexityFeePricingEngine(input: ClientComplexityInput): Result<ClientComplexityResult, Error> {
  const {
    clienteCnpj,
    razaoSocial,
    regimeTributario,
    volumeNotasFiscaisMes,
    quantidadeFuncionariosFolha,
    possuiSubstituicaoTributariaOuMonofasicos,
    possuiIntegracaoBancariaAutomatica,
    honorarioAtualCobradoBrl,
    margemDesejadaPercent
  } = input;

  if (!clienteCnpj || volumeNotasFiscaisMes < 0) {
    return Err(new Error('CNPJ do cliente e dados volumétricos são obrigatórios.'));
  }

  // Cálculo de Score de Complexidade
  let score = 10; // Base inicial
  if (regimeTributario === 'LUCRO_PRESUMIDO') score += 20;
  if (regimeTributario === 'LUCRO_REAL') score += 40;

  score += Math.min(30, Math.floor(volumeNotasFiscaisMes / 50) * 5);
  score += Math.min(20, quantidadeFuncionariosFolha * 2);

  if (possuiSubstituicaoTributariaOuMonofasicos) score += 15;
  if (!possuiIntegracaoBancariaAutomatica) score += 10; // Digitação manual encarece

  // Honorário Base por Ponto de Score: R$ 35,00
  const custoEstimado = score * 35;
  const honorarioIdeal = custoEstimado / (1 - margemDesejadaPercent / 100);
  const diferenca = honorarioIdeal - honorarioAtualCobradoBrl;

  const acao = diferenca > 200 ? 'REPACTUAR_REAJUSTAR_HONORARIOS' : 'MANTER_HONORARIO_COMPATIVEL';

  const diag = "Precificação por Complexidade (" + razaoSocial + " - " + regimeTributario + "): Score: " + score + "/100 pts | Honorário Atual: R$ " + honorarioAtualCobradoBrl.toLocaleString('pt-BR') + " | Honorário Ideal: R$ " + honorarioIdeal.toFixed(2) + " (Diferença: R$ " + diferenca.toFixed(2) + ") -> Ação: " + acao + ".";

  return Ok({
    clienteCnpj,
    razaoSocial,
    scoreComplexidadePontos: score,
    honorarioSugeridoIdealBrl: parseFloat(honorarioIdeal.toFixed(2)),
    diferencaHonorarioBrl: parseFloat(diferenca.toFixed(2)),
    acaoRecomendada: acao,
    statusPrecificacao: 'SCORE_COMPLEXIDADE_PRECIFICADO_COM_SUCESSO',
    diagnosticoPrecificacao: diag
  });
}
