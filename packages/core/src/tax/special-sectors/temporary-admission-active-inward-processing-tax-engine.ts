import { Result, Ok, Err } from '../../types/result.js';

export interface TemporaryAdmissionInput {
  numeroTermoResponsabilidade: string; // Ex: 'TR-ADMISSAO-2026-0041'
  empresaCnpj: string;
  descricaoBemEstrangeiro: string; // Ex: 'Turbina Aeronáutica para Manutenção e Reparo'
  valorAduaneiroBemCifBrl: number; // Ex: R$ 15.000.000,00
  valorServicoAgregadoNacionalBrl: number; // Ex: R$ 2.000.000,00 (Mão de obra e peças nacionais)
  aliquotaImpostoImportacaoPercent: number; // 16%
  aliquotaIpiPercent: number; // 12%
  aliquotaPisCofinsImportacaoPercent: number; // 9.25%
  aliquotaIcmsImportacaoPercent: number; // 18%
}

export interface TemporaryAdmissionResult {
  numeroTermoResponsabilidade: string;
  empresaCnpj: string;
  descricaoBemEstrangeiro: string;
  valorAduaneiroBemBrl: number;
  totalTributosFederaisSuspensosBrl: number;
  icmsImportacaoSuspensoBrl: number;
  garantiaAduaneiraExigidaBrl: number;
  economiaTributariaAdmissaoBrl: number;
  statusAduaneiro: 'SUSPENSAO_TOTAL_APERFEICOAMENTO_ATIVO_CONFORME';
  condicaoExtincaoRegime: string;
  diagnosticoAdmissaoTemporaria: string;
}

export function processTemporaryAdmissionActiveInwardProcessingTaxEngine(input: TemporaryAdmissionInput): Result<TemporaryAdmissionResult, Error> {
  const {
    numeroTermoResponsabilidade,
    empresaCnpj,
    descricaoBemEstrangeiro,
    valorAduaneiroBemCifBrl,
    valorServicoAgregadoNacionalBrl,
    aliquotaImpostoImportacaoPercent,
    aliquotaIpiPercent,
    aliquotaPisCofinsImportacaoPercent,
    aliquotaIcmsImportacaoPercent
  } = input;

  if (valorAduaneiroBemCifBrl <= 0) {
    return Err(new Error('Valor aduaneiro CIF do bem deve ser positivo.'));
  }

  // 1. Suspensão de Tributos Federais (Decreto 6.759/09 Art. 380 e IN RFB 1.600/15)
  const susIi = valorAduaneiroBemCifBrl * (aliquotaImpostoImportacaoPercent / 100);
  const baseIpi = valorAduaneiroBemCifBrl + susIi;
  const susIpi = baseIpi * (aliquotaIpiPercent / 100);
  const susPisCofins = valorAduaneiroBemCifBrl * (aliquotaPisCofinsImportacaoPercent / 100);

  const totalFederais = Number((susIi + susIpi + susPisCofins).toFixed(2));
  const icmsSuspenso = Number((valorAduaneiroBemCifBrl * (aliquotaIcmsImportacaoPercent / 100)).toFixed(2));
  const totalSuspenso = Number((totalFederais + icmsSuspenso).toFixed(2));

  const diag = "Admissao Temporaria Aperfeicoamento Ativo (IN RFB 1.600/15): TR " + numeroTermoResponsabilidade + " (" + descricaoBemEstrangeiro + ") | CIF: R$ " + valorAduaneiroBemCifBrl.toFixed(2) + " -> Tributos Federais Suspensos: R$ " + totalFederais.toFixed(2) + " | ICMS Suspenso: R$ " + icmsSuspenso.toFixed(2) + " -> Economia Tributaria: R$ " + totalSuspenso.toFixed(2) + " (Valor Agregado Nacional: R$ " + valorServicoAgregadoNacionalBrl.toFixed(2) + ").";

  return Ok({
    numeroTermoResponsabilidade,
    empresaCnpj,
    descricaoBemEstrangeiro,
    valorAduaneiroBemBrl: valorAduaneiroBemCifBrl,
    totalTributosFederaisSuspensosBrl: totalFederais,
    icmsImportacaoSuspensoBrl: icmsSuspenso,
    garantiaAduaneiraExigidaBrl: totalFederais,
    economiaTributariaAdmissaoBrl: totalSuspenso,
    statusAduaneiro: 'SUSPENSAO_TOTAL_APERFEICOAMENTO_ATIVO_CONFORME',
    condicaoExtincaoRegime: 'Reexportação do bem aperfeiçoado ou nacionalização com pagamento de tributos suspensos.',
    diagnosticoAdmissaoTemporaria: diag
  });
}
