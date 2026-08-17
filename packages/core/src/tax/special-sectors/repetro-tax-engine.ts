import { Result, Ok, Err } from '../../types/result.js';

export type RepetroModalityType = 'REPETRO_SPED_IMPORTACAO_DEFINITIVA' | 'REPETRO_TEMPORARIO_ADMISSAO' | 'REPETRO_INDUSTRIALIZACAO';

export interface RepetroProjectInput {
  empresaHabilitadaId: string;
  blocoPetroleoCampoNome: string; // Ex: 'Campo de Búzios - Pré-Sal'
  numeroHabilitacaoRepetroAde: string;
  modalidade: RepetroModalityType;
  valorCifEquipamentosNavaisUsd: number;
  taxaCambialPtax: number;
}

export interface RepetroProjectResult {
  empresaId: string;
  blocoCampoNome: string;
  adeNumero: string;
  valorTotalCifBrl: number;
  tributosSuspensosDesonerados: {
    impostoImportacaoSuspenso14Percent: number;
    ipiSuspenso10Percent: number;
    pisCofinsImportacaoSuspenso11_75Percent: number;
    icmsDiferidoIsento15Percent: number;
    totalDesoneracaoRepetroBrl: number;
  };
  diagnosticoRepetro: string;
}

export function calculateRepetroTaxExemptions(input: RepetroProjectInput): Result<RepetroProjectResult, Error> {
  const { empresaHabilitadaId, blocoPetroleoCampoNome, numeroHabilitacaoRepetroAde, modalidade, valorCifEquipamentosNavaisUsd, taxaCambialPtax } = input;

  if (valorCifEquipamentosNavaisUsd <= 0) {
    return Err(new Error('Valor CIF dos equipamentos do REPETRO deve ser superior a zero.'));
  }

  const valorCifBrl = Number((valorCifEquipamentosNavaisUsd * taxaCambialPtax).toFixed(2));

  // Desonerações REPETRO-SPED (Lei nº 13.586/2017 & Convênio ICMS 3/2018)
  const iiSuspenso = Number((valorCifBrl * 0.14).toFixed(2));
  const ipiSuspenso = Number((valorCifBrl * 0.10).toFixed(2));
  const pisCofinsSuspenso = Number((valorCifBrl * 0.1175).toFixed(2));
  const icmsDiferido = Number((valorCifBrl * 0.15).toFixed(2)); // Diferimento/redução para 3% ou 0%

  const totalDesonerado = Number((iiSuspenso + ipiSuspenso + pisCofinsSuspenso + icmsDiferido).toFixed(2));

  const diagnostico = 'REPETRO-SPED (Lei nº 13.586/2017 - ADE nº ' + numeroHabilitacaoRepetroAde + '): ' + blocoPetroleoCampoNome + ' na modalidade ' + modalidade + '. Desoneração total de R$ ' + totalDesonerado.toFixed(2) + ' em tributos federais e aduaneiros sobre o CAPEX de R$ ' + valorCifBrl.toFixed(2) + '.';

  return Ok({
    empresaId: empresaHabilitadaId,
    blocoCampoNome: blocoPetroleoCampoNome,
    adeNumero: numeroHabilitacaoRepetroAde,
    valorTotalCifBrl: valorCifBrl,
    tributosSuspensosDesonerados: {
      impostoImportacaoSuspenso14Percent: iiSuspenso,
      ipiSuspenso10Percent: ipiSuspenso,
      pisCofinsImportacaoSuspenso11_75Percent: pisCofinsSuspenso,
      icmsDiferidoIsento15Percent: icmsDiferido,
      totalDesoneracaoRepetroBrl: totalDesonerado
    },
    diagnosticoRepetro: diagnostico
  });
}
