import { Result, Ok, Err } from '../types/result.js';

export interface TaxReformTransitionInput {
  clienteCnpj: string;
  anoSimulacao: number; // 2026 até 2033
  faturamentoMensalBrl: number;
  totalComprasInsumosBrl: number;
  setorAtividade: 'INDUSTRIA' | 'COMERCIO' | 'SERVICOS';
}

export interface TaxReformTransitionResult {
  clienteCnpj: string;
  anoSimulacao: number;
  faseTransicao: string;
  aliquotaCbsPercent: number;
  aliquotaIbsPercent: number;
  tributosLegadoAtivos: string[];
  valorEstimadoCbsBrl: number;
  valorEstimadoIbsBrl: number;
  statusTransicao: 'TRANSICAO_REFORMA_TRIBUTARIA_SIMULADA_COM_SUCESSO';
  diagnosticoTransicao: string;
}

export function processOfficeTaxReformTransitionEngine(input: TaxReformTransitionInput): Result<TaxReformTransitionResult, Error> {
  const {
    clienteCnpj,
    anoSimulacao,
    faturamentoMensalBrl,
    totalComprasInsumosBrl,
    setorAtividade
  } = input;

  if (!clienteCnpj || faturamentoMensalBrl <= 0 || anoSimulacao < 2026 || anoSimulacao > 2033) {
    return Err(new Error('CNPJ, faturamento positivo e ano de simulação entre 2026 e 2033 são obrigatórios.'));
  }

  let fase = '';
  let aliqCbs = 0;
  let aliqIbs = 0;
  let legado: string[] = [];

  const baseCalculo = Math.max(0, faturamentoMensalBrl - totalComprasInsumosBrl);

  if (anoSimulacao === 2026) {
    fase = 'Fase de Teste Operacional (CBS 0,9% e IBS 0,1% compensáveis com PIS/COFINS)';
    aliqCbs = 0.9;
    aliqIbs = 0.1;
    legado = ['PIS', 'COFINS', 'IPI', 'ICMS', 'ISS'];
  } else if (anoSimulacao >= 2027 && anoSimulacao <= 2028) {
    fase = 'Extinção de PIS/COFINS e Implementação Plena da CBS (8,8%) com Imposto Seletivo';
    aliqCbs = 8.8;
    aliqIbs = 0.1;
    legado = ['ICMS', 'ISS', 'IPI_ZFM'];
  } else {
    fase = 'Transição Gradual ICMS/ISS para IBS e Unificação Plena IVA Dual';
    const fatorTrans = (anoSimulacao - 2028) / 5; // 2029 a 2033
    aliqCbs = 8.8;
    aliqIbs = parseFloat((17.7 * fatorTrans).toFixed(2));
    legado = anoSimulacao === 2033 ? [] : ['ICMS_RESIDUAL', 'ISS_RESIDUAL'];
  }

  const valCbs = (baseCalculo * aliqCbs) / 100;
  const valIbs = (baseCalculo * aliqIbs) / 100;

  const diag = "Reforma Tributaria (" + clienteCnpj + " - Ano " + anoSimulacao + "): " + fase + " | CBS: " + aliqCbs + "% (R$ " + valCbs.toLocaleString('pt-BR') + ") | IBS: " + aliqIbs + "% (R$ " + valIbs.toLocaleString('pt-BR') + ").";

  return Ok({
    clienteCnpj,
    anoSimulacao,
    faseTransicao: fase,
    aliquotaCbsPercent: aliqCbs,
    aliquotaIbsPercent: aliqIbs,
    tributosLegadoAtivos: legado,
    valorEstimadoCbsBrl: parseFloat(valCbs.toFixed(2)),
    valorEstimadoIbsBrl: parseFloat(valIbs.toFixed(2)),
    statusTransicao: 'TRANSICAO_REFORMA_TRIBUTARIA_SIMULADA_COM_SUCESSO',
    diagnosticoTransicao: diag
  });
}
