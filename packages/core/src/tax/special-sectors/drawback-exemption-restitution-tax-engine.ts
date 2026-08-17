import { Result, Ok, Err } from '../../types/result.js';

export interface DrawbackExemptionInput {
  numeroAtoConcursorio: string; // Ex: '20260001928'
  cnpjExportador: string;
  valorInsumosImportacaoCifBrl: number; // Ex: R$ 3.000.000,00
  aliquotaImpostoImportacaoPercent: number; // Ex: 14%
  aliquotaIpiPercent: number; // Ex: 10%
  aliquotaPisCofinsImportacaoPercent: number; // Ex: 9.65% (2.1% PIS + 7.55% COFINS)
  aliquotaIcmsImportacaoPercent: number; // Ex: 18%
}

export interface DrawbackExemptionResult {
  numeroAtoConcursorio: string;
  cnpjExportador: string;
  valorInsumosImportacaoCifBrl: number;
  economiaImpostoImportacaoBrl: number;
  economiaIpiImportacaoBrl: number;
  economiaPisCofinsImportacaoBrl: number;
  economiaIcmsImportacaoBrl: number;
  totalDesoneracaoTributariaDrawbackBrl: number;
  statusSiscomex: 'ATO_CONCESSORIO_DEFERIDO_REPOSICAO_ESTOQUE';
  diagnosticoDrawback: string;
}

export function processDrawbackExemptionRestitutionTaxEngine(input: DrawbackExemptionInput): Result<DrawbackExemptionResult, Error> {
  const {
    numeroAtoConcursorio,
    cnpjExportador,
    valorInsumosImportacaoCifBrl,
    aliquotaImpostoImportacaoPercent,
    aliquotaIpiPercent,
    aliquotaPisCofinsImportacaoPercent,
    aliquotaIcmsImportacaoPercent
  } = input;

  if (valorInsumosImportacaoCifBrl <= 0) {
    return Err(new Error('Valor CIF dos insumos importados deve ser positivo.'));
  }

  // Desoneração integral na modalidade Isenção / Reposição de Estoque
  const ecoIi = Number((valorInsumosImportacaoCifBrl * (aliquotaImpostoImportacaoPercent / 100)).toFixed(2));
  const baseIpi = valorInsumosImportacaoCifBrl + ecoIi;
  const ecoIpi = Number((baseIpi * (aliquotaIpiPercent / 100)).toFixed(2));
  const ecoPisCofins = Number((valorInsumosImportacaoCifBrl * (aliquotaPisCofinsImportacaoPercent / 100)).toFixed(2));
  
  // ICMS Importação desonerado por diferimento/isenção vinculada
  const ecoIcms = Number((valorInsumosImportacaoCifBrl * (aliquotaIcmsImportacaoPercent / 100)).toFixed(2));

  const totalEconomia = Number((ecoIi + ecoIpi + ecoPisCofins + ecoIcms).toFixed(2));

  const diag = "Drawback Isencao / Reposicao (Secex 44/20): Ato " + numeroAtoConcursorio + " (CNPJ " + cnpjExportador + ") | CIF Insumos: R$ " + valorInsumosImportacaoCifBrl.toFixed(2) + " -> Economia II (" + aliquotaImpostoImportacaoPercent + "%): R$ " + ecoIi.toFixed(2) + " | IPI: R$ " + ecoIpi.toFixed(2) + " | PIS/COFINS: R$ " + ecoPisCofins.toFixed(2) + " | ICMS: R$ " + ecoIcms.toFixed(2) + " -> Desoneracao Total: R$ " + totalEconomia.toFixed(2) + " no Siscomex.";

  return Ok({
    numeroAtoConcursorio,
    cnpjExportador,
    valorInsumosImportacaoCifBrl,
    economiaImpostoImportacaoBrl: ecoIi,
    economiaIpiImportacaoBrl: ecoIpi,
    economiaPisCofinsImportacaoBrl: ecoPisCofins,
    economiaIcmsImportacaoBrl: ecoIcms,
    totalDesoneracaoTributariaDrawbackBrl: totalEconomia,
    statusSiscomex: 'ATO_CONCESSORIO_DEFERIDO_REPOSICAO_ESTOQUE',
    diagnosticoDrawback: diag
  });
}
