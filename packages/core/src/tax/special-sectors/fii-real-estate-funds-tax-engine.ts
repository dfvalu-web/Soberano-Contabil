import { Result, Ok, Err } from '../../types/result.js';

export interface FiiTaxInput {
  fundoId: string;
  fundoNome: string; // Ex: 'Soberano Logística & Renda Fundo de Investimento Imobiliário - FII'
  semestreCompetencia: string; // Ex: '2026-1S'
  lucroSemestralRegimeCaixaBrl: number;
  totalCotistas: number; // Lei 14.754/23 exige no mínimo 100 cotistas para isenção
  cotasNegociadasEmBolsaB3: boolean; // Requisito cumulativo
  ganhoCapitalAlienacaoCotasBrl?: number; // 20% IRRF
}

export interface FiiTaxResult {
  fundoId: string;
  fundoNome: string;
  semestreCompetencia: string;
  distribuicaoObrigatoria95PercentBrl: number; // 95% do lucro caixa distribuído
  isencaoRendimentosPessoaFisicaAprovada: boolean;
  aliquotaIrrfRendimentosPfPercent: number; // 0% se aprovado, 20% se não cumprir
  irrfGanhoCapitalAlienacaoCotas20PercentBrl: number; // 20% sobre ganho de capital
  diagnosticoFii: string;
}

export function processFiiRealEstateFundsTaxEngine(input: FiiTaxInput): Result<FiiTaxResult, Error> {
  const {
    fundoId,
    fundoNome,
    semestreCompetencia,
    lucroSemestralRegimeCaixaBrl,
    totalCotistas,
    cotasNegociadasEmBolsaB3,
    ganhoCapitalAlienacaoCotasBrl = 0
  } = input;

  if (lucroSemestralRegimeCaixaBrl <= 0) {
    return Err(new Error('Lucro semestral do FII deve ser maior que zero.'));
  }

  // Lei nº 8.668/1993 e Lei nº 14.754/2023:
  // 1. Distribuição obrigatória de no mínimo 95% dos lucros auferidos apurados em regime de caixa
  const distribuicaoObrigatoria = Number((lucroSemestralRegimeCaixaBrl * 0.95).toFixed(2));

  // 2. Critérios de Isenção de IRRF para Cotistas PF (Art. 3º da Lei 11.033/04 alterado pela Lei 14.754/23):
  // - No mínimo 100 cotistas (antigo 50 cotistas)
  // - Cotas admitidas à negociação exclusivamente em bolsa de valores ou balcão organizado
  // - O cotista não pode deter 10% ou mais das cotas do fundo
  const isentoPf = totalCotistas >= 100 && cotasNegociadasEmBolsaB3;
  const aliquotaPf = isentoPf ? 0 : 20.0;

  // 3. Tributação sobre Ganho de Capital na venda de cotas = 20%
  const irrfGanhoCapital = Number((Math.max(0, ganhoCapitalAlienacaoCotasBrl) * 0.20).toFixed(2));

  const diag = "Tributacao de FII (Lei 8.668/93 & Lei 14.754/23): " + fundoNome + " (" + semestreCompetencia + "). Lucro Caixa: R$ " + lucroSemestralRegimeCaixaBrl.toFixed(2) + " -> Distribuicao Minima Obrigatoria (95%): R$ " + distribuicaoObrigatoria.toFixed(2) + " | Total Cotistas: " + totalCotistas + " | Negociacao B3: " + cotasNegociadasEmBolsaB3 + " => ISENCAO IRRF PF: " + (isentoPf ? "APROVADA (Aliquota 0%)" : "NEGADA (Aliquota 20%)") + " | IRRF Ganho de Capital (20%): R$ " + irrfGanhoCapital.toFixed(2) + ".";

  return Ok({
    fundoId,
    fundoNome,
    semestreCompetencia,
    distribuicaoObrigatoria95PercentBrl: distribuicaoObrigatoria,
    isencaoRendimentosPessoaFisicaAprovada: isentoPf,
    aliquotaIrrfRendimentosPfPercent: aliquotaPf,
    irrfGanhoCapitalAlienacaoCotas20PercentBrl: irrfGanhoCapital,
    diagnosticoFii: diag
  });
}
