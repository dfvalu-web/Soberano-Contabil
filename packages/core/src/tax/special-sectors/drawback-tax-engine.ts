import { Result, Ok, Err } from '../../types/result.js';

export type DrawbackModalityType = 'DRAWBACK_SUSPENSAO' | 'DRAWBACK_ISENCAO';

export interface DrawbackProjectInput {
  atoConcessorioNumero: string;
  modalidade: DrawbackModalityType;
  valorInsumosImportadosCifUsd: number;
  valorInsumosNacionaisBrl: number;
  taxaCambialPtax: number;
  valorCompromissoExportacaoFobUsd: number;
}

export interface DrawbackProjectResult {
  atoConcessorio: string;
  modalidade: DrawbackModalityType;
  valorTotalInsumosCifBrl: number;
  valorCompromissoExportacaoFobBrl: number;
  tributosSuspensosIsentos: {
    impostoImportacaoSuspenso14PercentBrl: number;
    ipiSuspenso10PercentBrl: number;
    pisCofinsImportacaoSuspenso11_75PercentBrl: number;
    afrmmSuspenso8PercentBrl: number;
    icmsDiferido18PercentBrl: number;
    totalDesoneracaoDrawbackBrl: number;
  };
  indiceAgregacaoValorPercent: number;
  diagnosticoDrawback: string;
}

export function calculateDrawbackIntegratedTaxExemptions(input: DrawbackProjectInput): Result<DrawbackProjectResult, Error> {
  const {
    atoConcessorioNumero,
    modalidade,
    valorInsumosImportadosCifUsd,
    valorInsumosNacionaisBrl,
    taxaCambialPtax,
    valorCompromissoExportacaoFobUsd
  } = input;

  if (valorInsumosImportadosCifUsd <= 0 || valorCompromissoExportacaoFobUsd <= 0) {
    return Err(new Error('Valor dos insumos e compromisso de exportação devem ser superiores a zero.'));
  }

  const insumosImportadosBrl = Number((valorInsumosImportadosCifUsd * taxaCambialPtax).toFixed(2));
  const exportacaoFobBrl = Number((valorCompromissoExportacaoFobUsd * taxaCambialPtax).toFixed(2));
  const totalInsumosBrl = Number((insumosImportadosBrl + valorInsumosNacionaisBrl).toFixed(2));

  // Desonerações Aduaneiras e Tributárias (Portaria SECEX nº 44/2020)
  const iiSuspenso = Number((insumosImportadosBrl * 0.14).toFixed(2));
  const ipiSuspenso = Number((totalInsumosBrl * 0.10).toFixed(2));
  const pisCofinsSuspenso = Number((totalInsumosBrl * 0.1175).toFixed(2));
  const afrmmSuspenso = Number((insumosImportadosBrl * 0.08).toFixed(2));
  const icmsDiferido = Number((totalInsumosBrl * 0.18).toFixed(2));

  const totalDesonerado = Number((iiSuspenso + ipiSuspenso + pisCofinsSuspenso + afrmmSuspenso + icmsDiferido).toFixed(2));
  const indiceAgregacao = Number((((exportacaoFobBrl - totalInsumosBrl) / totalInsumosBrl) * 100).toFixed(2));

  const diag = 'Drawback Integrado (Ato Concessório SECEX nº ' + atoConcessorioNumero + '): Modalidade ' + modalidade + '. Insumos totais de R$ ' + totalInsumosBrl.toFixed(2) + ' vinculados à exportação FOB de R$ ' + exportacaoFobBrl.toFixed(2) + ' (Agregação de Valor: ' + indiceAgregacao + '%). Desoneração tributária total de R$ ' + totalDesonerado.toFixed(2) + ' (II: R$ ' + iiSuspenso.toFixed(2) + ', IPI: R$ ' + ipiSuspenso.toFixed(2) + ', PIS/COFINS: R$ ' + pisCofinsSuspenso.toFixed(2) + ', AFRMM: R$ ' + afrmmSuspenso.toFixed(2) + ', ICMS: R$ ' + icmsDiferido.toFixed(2) + ').';

  return Ok({
    atoConcessorio: atoConcessorioNumero,
    modalidade,
    valorTotalInsumosCifBrl: totalInsumosBrl,
    valorCompromissoExportacaoFobBrl: exportacaoFobBrl,
    tributosSuspensosIsentos: {
      impostoImportacaoSuspenso14PercentBrl: iiSuspenso,
      ipiSuspenso10PercentBrl: ipiSuspenso,
      pisCofinsImportacaoSuspenso11_75PercentBrl: pisCofinsSuspenso,
      afrmmSuspenso8PercentBrl: afrmmSuspenso,
      icmsDiferido18PercentBrl: icmsDiferido,
      totalDesoneracaoDrawbackBrl: totalDesonerado
    },
    indiceAgregacaoValorPercent: indiceAgregacao,
    diagnosticoDrawback: diag
  });
}
