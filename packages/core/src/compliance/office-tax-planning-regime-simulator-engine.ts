import { Result, Ok, Err } from '../types/result.js';

export interface TaxPlanningInput {
  clienteCnpj: string;
  razaoSocial: string;
  faturamentoAnualBrl: number;
  comprasInsumosAnualBrl: number;
  folhaPagamentoAnualBrl: number;
  margemLucroEstimadaPercent: number;
}

export interface TaxPlanningResult {
  clienteCnpj: string;
  razaoSocial: string;
  cargaEstimadaSimplesBrl: number;
  cargaEstimadaPresumidoBrl: number;
  cargaEstimadaRealBrl: number;
  regimeMaisEconomico: 'SIMPLES_NACIONAL' | 'LUCRO_PRESUMIDO' | 'LUCRO_REAL';
  economiaAnualEstimadaBrl: number;
  statusPlanejamento: 'PLANEJAMENTO_TRIBUTARIO_CONCLUIDO_COM_RECOMENDACAO';
  diagnosticoPlanejamento: string;
}

export function processOfficeTaxPlanningRegimeSimulatorEngine(input: TaxPlanningInput): Result<TaxPlanningResult, Error> {
  const {
    clienteCnpj,
    razaoSocial,
    faturamentoAnualBrl,
    comprasInsumosAnualBrl,
    folhaPagamentoAnualBrl,
    margemLucroEstimadaPercent
  } = input;

  if (!clienteCnpj || faturamentoAnualBrl <= 0) {
    return Err(new Error('CNPJ e faturamento anual positivo são obrigatórios.'));
  }

  // Estimativas de Carga Tributária Anual Total
  // 1. Simples Nacional (média Anexo III/IV/I ~ 11%)
  const cargaSimples = faturamentoAnualBrl <= 4800000 ? faturamentoAnualBrl * 0.11 : 999999999;

  // 2. Lucro Presumido (IRPJ/CSLL presunção 32% serviço + PIS/COFINS cumulativo 3.65% + ISS 5% ~ 16.33%)
  const cargaPresumido = faturamentoAnualBrl * 0.1633;

  // 3. Lucro Real (IRPJ/CSLL 34% sobre lucro efetivo + PIS/COFINS não-cumulativo 9.25% - créditos)
  const lucroEfetivo = (faturamentoAnualBrl * margemLucroEstimadaPercent) / 100;
  const irpjCsllReal = lucroEfetivo * 0.34;
  const pisCofinsRealLiquido = Math.max(0, (faturamentoAnualBrl - comprasInsumosAnualBrl) * 0.0925);
  const issIcmsReal = faturamentoAnualBrl * 0.05;
  const cargaReal = irpjCsllReal + pisCofinsRealLiquido + issIcmsReal;

  let menorCarga = cargaPresumido;
  let regimeRecomendado: 'SIMPLES_NACIONAL' | 'LUCRO_PRESUMIDO' | 'LUCRO_REAL' = 'LUCRO_PRESUMIDO';

  if (cargaSimples < menorCarga) {
    menorCarga = cargaSimples;
    regimeRecomendado = 'SIMPLES_NACIONAL';
  }
  if (cargaReal < menorCarga) {
    menorCarga = cargaReal;
    regimeRecomendado = 'LUCRO_REAL';
  }

  const segundaMenorCarga = Math.min(
    cargaSimples !== menorCarga ? cargaSimples : Infinity,
    cargaPresumido !== menorCarga ? cargaPresumido : Infinity,
    cargaReal !== menorCarga ? cargaReal : Infinity
  );

  const economia = segundaMenorCarga - menorCarga;

  const diag = "Planejamento Tributario (" + razaoSocial + "): Regime mais economico -> " + regimeRecomendado + " (Carga estimada: R$ " + menorCarga.toLocaleString('pt-BR') + " / ano). Economia projetada: R$ " + economia.toLocaleString('pt-BR') + " / ano frente a alternativa mais proxima.";

  return Ok({
    clienteCnpj,
    razaoSocial,
    cargaEstimadaSimplesBrl: parseFloat(cargaSimples.toFixed(2)),
    cargaEstimadaPresumidoBrl: parseFloat(cargaPresumido.toFixed(2)),
    cargaEstimadaRealBrl: parseFloat(cargaReal.toFixed(2)),
    regimeMaisEconomico: regimeRecomendado,
    economiaAnualEstimadaBrl: parseFloat(economia.toFixed(2)),
    statusPlanejamento: 'PLANEJAMENTO_TRIBUTARIO_CONCLUIDO_COM_RECOMENDACAO',
    diagnosticoPlanejamento: diag
  });
}
