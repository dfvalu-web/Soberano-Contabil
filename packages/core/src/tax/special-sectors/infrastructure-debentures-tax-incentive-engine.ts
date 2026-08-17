import { Result, Ok, Err } from '../../types/result.js';

export interface DebentureInfraInput {
  emissoraConcessionariaCnpj: string;
  setorProjetoPrioritario: 'SANEAMENTO' | 'ENERGIA' | 'RODOVIAS' | 'FERROVIAS' | 'PORTOS';
  valorEmissaoDebenturesBrl: number; // Ex: R$ 100.000.000,00
  taxaJurosAnualEfetivaPercent: number; // Ex: 8.50% a.a.
  despesaJurosPeriodoBrl: number; // Ex: R$ 8.500.000,00
  aliquotaIrpjCsllPercent: number; // 34.0%
}

export interface DebentureInfraResult {
  emissoraConcessionariaCnpj: string;
  setorProjetoPrioritario: string;
  despesaJurosContabilDedutivelBrl: number; // R$ 8.500.000,00 (100%)
  exclusaoAdicionalLalurLei14801Brl: number; // 30% de R$ 8.5M = R$ 2.550.000,00
  totalDeducaoBaseIrpjCsllBrl: number; // R$ 11.050.000,00 (130%)
  economiaTributariaAdicionalBrl: number; // 34% de R$ 2.55M = R$ 867.000,00
  registroSpedEcfBlocoM300: string;
  statusDebentures: 'DEBENTURES_LEI_14801_HOMOLOGADAS_SUPER_DEDUCAO';
  diagnosticoDebentures: string;
}

export function processInfrastructureDebenturesTaxIncentiveEngine(input: DebentureInfraInput): Result<DebentureInfraResult, Error> {
  const {
    emissoraConcessionariaCnpj,
    setorProjetoPrioritario,
    valorEmissaoDebenturesBrl,
    despesaJurosPeriodoBrl,
    aliquotaIrpjCsllPercent = 34.0
  } = input;

  if (!emissoraConcessionariaCnpj || valorEmissaoDebenturesBrl <= 0 || despesaJurosPeriodoBrl <= 0) {
    return Err(new Error('CNPJ, valor de emissão e despesa de juros são obrigatórios.'));
  }

  // Lei 14.801/2024: Exclusão adicional de 30% dos juros na apuração do Lucro Real e Base da CSLL
  const exclusao30 = despesaJurosPeriodoBrl * 0.30;
  const totalDeducao = despesaJurosPeriodoBrl + exclusao30;
  const economiaAdicional = (exclusao30 * aliquotaIrpjCsllPercent) / 100;

  const diag = "Debentures Infraestrutura (Lei 14.801/24): Emissao R$ " + valorEmissaoDebenturesBrl.toLocaleString('pt-BR') + " (" + setorProjetoPrioritario + ") | Juros Contabeis: R$ " + despesaJurosPeriodoBrl.toLocaleString('pt-BR') + " | Exclusao Adicional 30% e-LALUR: R$ " + exclusao30.toLocaleString('pt-BR') + " -> Economia IRPJ/CSLL Extra: R$ " + economiaAdicional.toLocaleString('pt-BR');

  return Ok({
    emissoraConcessionariaCnpj,
    setorProjetoPrioritario,
    despesaJurosContabilDedutivelBrl: despesaJurosPeriodoBrl,
    exclusaoAdicionalLalurLei14801Brl: exclusao30,
    totalDeducaoBaseIrpjCsllBrl: totalDeducao,
    economiaTributariaAdicionalBrl: economiaAdicional,
    registroSpedEcfBlocoM300: 'REGISTRO_M300_CODIGO_EXCLUSAO_LEI_14801_APROVADO',
    statusDebentures: 'DEBENTURES_LEI_14801_HOMOLOGADAS_SUPER_DEDUCAO',
    diagnosticoDebentures: diag
  });
}
