import { SimplesCalculationInput, SimplesCalculationResult, SimplesAnexo } from '../../types/tax.js';
import { getSimplesTable } from './tables.js';
import { Result, Ok, Err } from '../../types/result.js';

export const SUBLIMITE_ESTADUAL_SIMPLES = 3600000.00;
export const LIMITE_MAXIMO_SIMPLES = 4800000.00;

export function calculateFatorR(folha12Meses: number, rbt12: number): number {
  if (rbt12 <= 0) return 0;
  return Number((folha12Meses / rbt12).toFixed(4));
}

export function calculateSimplesNacional(input: SimplesCalculationInput): Result<SimplesCalculationResult, Error> {
  const { rbt12, receitaMes } = input;

  if (rbt12 < 0 || receitaMes < 0) {
    return Err(new Error('Receita Bruta não pode ser negativa.'));
  }

  if (rbt12 > LIMITE_MAXIMO_SIMPLES) {
    return Err(new Error(`RBT12 de R$ ${rbt12.toLocaleString('pt-BR')} ultrapassa o teto do Simples Nacional de R$ 4.800.000,00.`));
  }

  let anexoEfetivo: SimplesAnexo = input.anexo;
  let fatorR: number | undefined = undefined;

  if (input.folha12Meses !== undefined && (input.anexo === 'ANEXO_III' || input.anexo === 'ANEXO_V')) {
    fatorR = calculateFatorR(input.folha12Meses, rbt12);
    anexoEfetivo = fatorR >= 0.28 ? 'ANEXO_III' : 'ANEXO_V';
  }

  const tabela = getSimplesTable(anexoEfetivo);
  const rbt12ParaCalculo = Math.max(rbt12, 1.00);
  
  let bracket = tabela.find(b => rbt12ParaCalculo <= b.limiteSuperior);
  if (!bracket) {
    bracket = tabela[tabela.length - 1]!;
  }

  const aliquotaEfetiva = rbt12 <= 180000.00
    ? bracket.aliquotaNominal
    : Number(((rbt12 * bracket.aliquotaNominal - bracket.parcelaADeduzir) / rbt12).toFixed(6));

  const valorDevidoBruto = Number((receitaMes * aliquotaEfetiva).toFixed(2));
  const { irpj, csll, cofins, pis, cpp, icms, iss } = bracket.percentuais;

  const ultrapassouSublimite = rbt12 > SUBLIMITE_ESTADUAL_SIMPLES || !!input.isSublimiteEstadualUltrapassado;

  let valorIcms = Number((valorDevidoBruto * icms).toFixed(2));
  let valorIss = Number((valorDevidoBruto * iss).toFixed(2));
  let icmsSegregadoForaDas: number | undefined = undefined;
  let issSegregadoForaDas: number | undefined = undefined;

  if (ultrapassouSublimite) {
    // Alíquota de ICMS estadual padrão (ex: 3.35% na faixa 5 do Simples ou apuração em conta gráfica)
    const aliqIcmsEstimada = (anexoEfetivo === 'ANEXO_I' || anexoEfetivo === 'ANEXO_II') ? 0.0335 : 0;
    const aliqIssEstimada = (anexoEfetivo === 'ANEXO_III' || anexoEfetivo === 'ANEXO_IV' || anexoEfetivo === 'ANEXO_V') ? 0.05 : 0;
    
    icmsSegregadoForaDas = aliqIcmsEstimada > 0 ? Number((receitaMes * aliqIcmsEstimada).toFixed(2)) : undefined;
    issSegregadoForaDas = aliqIssEstimada > 0 ? Number((receitaMes * aliqIssEstimada).toFixed(2)) : undefined;
    valorIcms = 0;
    valorIss = 0;
  }

  let valorPis = Number((valorDevidoBruto * pis).toFixed(2));
  let valorCofins = Number((valorDevidoBruto * cofins).toFixed(2));

  if (input.receitaMonofasica && input.receitaMonofasica > 0) {
    const proporcaoMonofasica = Math.min(input.receitaMonofasica / (receitaMes || 1), 1);
    valorPis = Number((valorPis * (1 - proporcaoMonofasica)).toFixed(2));
    valorCofins = Number((valorCofins * (1 - proporcaoMonofasica)).toFixed(2));
  }

  if (input.receitaStIcms && input.receitaStIcms > 0 && !ultrapassouSublimite) {
    const proporcaoSt = Math.min(input.receitaStIcms / (receitaMes || 1), 1);
    valorIcms = Number((valorIcms * (1 - proporcaoSt)).toFixed(2));
  }

  const valorIrpj = Number((valorDevidoBruto * irpj).toFixed(2));
  const valorCsll = Number((valorDevidoBruto * csll).toFixed(2));
  const valorCpp = Number((valorDevidoBruto * cpp).toFixed(2));

  const valorDevidoTotal = Number((valorIrpj + valorCsll + valorCofins + valorPis + valorCpp + valorIcms + valorIss).toFixed(2));

  return Ok({
    rbt12,
    faixa: bracket.faixa,
    aliquotaNominal: bracket.aliquotaNominal,
    parcelaADeduzir: bracket.parcelaADeduzir,
    aliquotaEfetiva,
    fatorR,
    anexoAplicado: anexoEfetivo,
    valorDevidoTotal,
    segregacao: {
      irpj: valorIrpj,
      csll: valorCsll,
      cofins: valorCofins,
      pis: valorPis,
      cpp: valorCpp,
      icms: valorIcms,
      iss: valorIss
    },
    icmsSegregadoForaDas,
    issSegregadoForaDas
  });
}
