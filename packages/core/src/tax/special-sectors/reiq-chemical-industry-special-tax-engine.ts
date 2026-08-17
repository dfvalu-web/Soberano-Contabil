import { Result, Ok, Err } from '../../types/result.js';

export interface ReiqTaxInput {
  empresaCnpj: string;
  anoCalendario: number;
  valorAquisicaoNaftaPetroquimicaBrl: number; // Ex: R$ 20.000.000,00
  aliquotaPadraoPisPercent: number; // 1.65%
  aliquotaPadraoCofinsPercent: number; // 7.60% (Total 9.25%)
  aliquotaReiqPisPercent: number; // 1.52% ou conforme Lei 14.374/22
  aliquotaReiqCofinsPercent: number; // 6.98% (Total 8.50% ou com incentivo de contrapartida)
  cumpriuContrapartidaInvestimentoSustentavel: boolean;
}

export interface ReiqTaxResult {
  empresaCnpj: string;
  anoCalendario: number;
  valorAquisicaoNaftaBrl: number;
  pisPadraoSemReiqBrl: number;
  cofinsPadraoSemReiqBrl: number;
  pisDevidoComReiqBrl: number;
  cofinsDevidoComReiqBrl: number;
  economiaTributariaReiqBrl: number;
  statusHabilitacaoReiq: 'HABILITADO_REIQ_LEI14374_CONFORME';
  fundamentoLegal: string;
  diagnosticoReiq: string;
}

export function processReiqChemicalIndustrySpecialTaxEngine(input: ReiqTaxInput): Result<ReiqTaxResult, Error> {
  const {
    empresaCnpj,
    anoCalendario,
    valorAquisicaoNaftaPetroquimicaBrl,
    aliquotaPadraoPisPercent,
    aliquotaPadraoCofinsPercent,
    aliquotaReiqPisPercent,
    aliquotaReiqCofinsPercent,
    cumpriuContrapartidaInvestimentoSustentavel
  } = input;

  if (valorAquisicaoNaftaPetroquimicaBrl <= 0) {
    return Err(new Error('Valor de aquisição de matérias-primas petroquímicas deve ser positivo.'));
  }

  // 1. Tributação Padrão sem REIQ (9.25%)
  const pisPadrao = Number((valorAquisicaoNaftaPetroquimicaBrl * (aliquotaPadraoPisPercent / 100)).toFixed(2));
  const cofinsPadrao = Number((valorAquisicaoNaftaPetroquimicaBrl * (aliquotaPadraoCofinsPercent / 100)).toFixed(2));
  const totalSemReiq = pisPadrao + cofinsPadrao;

  // 2. Tributação com Alíquotas Reduzidas do REIQ
  const pisReiq = Number((valorAquisicaoNaftaPetroquimicaBrl * (aliquotaReiqPisPercent / 100)).toFixed(2));
  const cofinsReiq = Number((valorAquisicaoNaftaPetroquimicaBrl * (aliquotaReiqCofinsPercent / 100)).toFixed(2));
  const totalComReiq = pisReiq + cofinsReiq;

  const economiaReiq = Number((totalSemReiq - totalComReiq).toFixed(2));
  const fundLegal = 'Artigos 56 e 57 da Lei nº 11.196/2005 e Lei nº 14.374/2022 (REIQ)';

  const diag = "Regime Especial REIQ (Lei 11.196/05 & Lei 14.374/22): CNPJ " + empresaCnpj + " (" + anoCalendario + ") | Nafta/Insumos: R$ " + valorAquisicaoNaftaPetroquimicaBrl.toFixed(2) + " -> Tributacao Padrao: R$ " + totalSemReiq.toFixed(2) + " vs REIQ: R$ " + totalComReiq.toFixed(2) + " -> Economia Tributaria Direta: R$ " + economiaReiq.toFixed(2) + " (Contrapartida de Investimento: " + (cumpriuContrapartidaInvestimentoSustentavel ? 'CUMPRIDA' : 'PENDENTE') + ").";

  return Ok({
    empresaCnpj,
    anoCalendario,
    valorAquisicaoNaftaBrl: valorAquisicaoNaftaPetroquimicaBrl,
    pisPadraoSemReiqBrl: pisPadrao,
    cofinsPadraoSemReiqBrl: cofinsPadrao,
    pisDevidoComReiqBrl: pisReiq,
    cofinsDevidoComReiqBrl: cofinsReiq,
    economiaTributariaReiqBrl: economiaReiq,
    statusHabilitacaoReiq: 'HABILITADO_REIQ_LEI14374_CONFORME',
    fundamentoLegal: fundLegal,
    diagnosticoReiq: diag
  });
}
