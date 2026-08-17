import { Result, Ok, Err } from '../../types/result.js';

export type AgroPresumedCreditCadeia = 'GRAOS_SOJA_MILHO_LEI10925' | 'BOVINOS_CARNES_LEI12058' | 'CAFE_CACAU_LEI10925' | 'LATICINIOS_LEITE_LEI10925';

export interface AgroPresumedCreditInput {
  empresaCnpj: string;
  cadeiaProdutiva: AgroPresumedCreditCadeia;
  valorAquisicaoInsumosProdutorPfBrl: number; // Ex: R$ 5.000.000,00
  aliquotaPercentualPresumidoSobrePadraoPercent: number; // Ex: 60% da alíquota padrão de 9.25% (ou 35%)
}

export interface AgroPresumedCreditResult {
  empresaCnpj: string;
  cadeiaProdutiva: AgroPresumedCreditCadeia;
  valorAquisicaoInsumosProdutorPfBrl: number;
  aliquotaEfetivaPisPercent: number;
  aliquotaEfetivaCofinsPercent: number;
  creditoPresumidoPisBrl: number;
  creditoPresumidoCofinsBrl: number;
  totalCreditoPresumidoApropriadoBrl: number;
  fundamentoLegal: string;
  escrituracaoEfdContribuicoes: {
    registroM100Pis: string;
    registroM500Cofins: string;
    valorCreditoTotal: number;
  };
  diagnosticoAgroPisCofins: string;
}

export function processAgroindustryPisCofinsPresumedCreditEngine(input: AgroPresumedCreditInput): Result<AgroPresumedCreditResult, Error> {
  const {
    empresaCnpj,
    cadeiaProdutiva,
    valorAquisicaoInsumosProdutorPfBrl,
    aliquotaPercentualPresumidoSobrePadraoPercent
  } = input;

  if (valorAquisicaoInsumosProdutorPfBrl <= 0 || aliquotaPercentualPresumidoSobrePadraoPercent <= 0) {
    return Err(new Error('Valor de aquisição de insumos e percentual presumido devem ser positivos.'));
  }

  // Alíquota padrão: 1.65% PIS e 7.60% COFINS (Total 9.25%)
  const fatorPresumido = aliquotaPercentualPresumidoSobrePadraoPercent / 100;
  const aliqPisEfetiva = Number((1.65 * fatorPresumido).toFixed(4));
  const aliqCofinsEfetiva = Number((7.60 * fatorPresumido).toFixed(4));

  const creditoPis = Number((valorAquisicaoInsumosProdutorPfBrl * (aliqPisEfetiva / 100)).toFixed(2));
  const creditoCofins = Number((valorAquisicaoInsumosProdutorPfBrl * (aliqCofinsEfetiva / 100)).toFixed(2));
  const totalCredito = Number((creditoPis + creditoCofins).toFixed(2));

  const fundLegal = cadeiaProdutiva === 'BOVINOS_CARNES_LEI12058'
    ? 'Artigo 33 da Lei nº 12.058/2009 (Crédito Presumido Carnes Bovinas)'
    : 'Artigo 8º da Lei nº 10.925/2004 (Crédito Presumido Grãos e Produtos Agropecuários)';

  const diag = "Credito Presumido Agro PIS/COFINS (" + cadeiaProdutiva + "): CNPJ " + empresaCnpj + " | Compras Produtor PF: R$ " + valorAquisicaoInsumosProdutorPfBrl.toFixed(2) + " (Fator " + aliquotaPercentualPresumidoSobrePadraoPercent + "%) -> PIS (" + aliqPisEfetiva + "%): R$ " + creditoPis.toFixed(2) + " | COFINS (" + aliqCofinsEfetiva + "%): R$ " + creditoCofins.toFixed(2) + " -> Credito Total Apropriado: R$ " + totalCredito.toFixed(2) + " (Ressarcivel via PER/DCOMP).";

  return Ok({
    empresaCnpj,
    cadeiaProdutiva,
    valorAquisicaoInsumosProdutorPfBrl,
    aliquotaEfetivaPisPercent: aliqPisEfetiva,
    aliquotaEfetivaCofinsPercent: aliqCofinsEfetiva,
    creditoPresumidoPisBrl: creditoPis,
    creditoPresumidoCofinsBrl: creditoCofins,
    totalCreditoPresumidoApropriadoBrl: totalCredito,
    fundamentoLegal: fundLegal,
    escrituracaoEfdContribuicoes: {
      registroM100Pis: 'M100_CREDITO_PRESUMIDO_AGRO_PIS',
      registroM500Cofins: 'M500_CREDITO_PRESUMIDO_AGRO_COFINS',
      valorCreditoTotal: totalCredito
    },
    diagnosticoAgroPisCofins: diag
  });
}
