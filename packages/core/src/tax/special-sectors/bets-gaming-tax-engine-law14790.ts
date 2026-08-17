import { Result, Ok, Err } from '../../types/result.js';

export interface BetsGamingInput {
  operadorBetId: string;
  operadorNome: string; // Ex: 'Soberano Apostas & Entretenimento Digital S.A.'
  totalApostasArrecadadasBrl: number; // Volume total apostado
  totalPremiosPagosApostadoresBrl: number; // Prêmios pagos
  totalPremiosIndividuaisTributaveisBrl: number; // Prêmios acima da faixa de isenção
  faixaIsencaoIrrfBrl?: number; // Padrão da Tabela Progressiva (Ex: R$ 2.259,20)
}

export interface BetsGamingResult {
  operadorBetId: string;
  operadorNome: string;
  totalApostasArrecadadasBrl: number;
  totalPremiosPagosBrl: number;
  grossGamingRevenueGgrBrl: number; // GGR = Apostas - Prêmios
  contribuicaoSocialGgr12PercentBrl: number; // 12% sobre GGR (Lei 14.790 Art. 30)
  irrfSobrePremios15PercentBrl: number; // 15% retido na fonte dos ganhadores (Art. 31)
  taxaFiscalizacaoSpaMfBrl: number; // Taxa mensal estimada da SPA/MF
  totalTributosApuradosBrl: number;
  diagnosticoFiscal: string;
}

export function processBetsGamingTaxEngineLaw14790(input: BetsGamingInput): Result<BetsGamingResult, Error> {
  const {
    operadorBetId,
    operadorNome,
    totalApostasArrecadadasBrl,
    totalPremiosPagosApostadoresBrl,
    totalPremiosIndividuaisTributaveisBrl
  } = input;

  if (totalApostasArrecadadasBrl <= 0 || totalPremiosPagosApostadoresBrl < 0) {
    return Err(new Error('Volume de apostas arrecadadas deve ser superior a zero.'));
  }

  // Lei nº 14.790/2023 (Marco Legal das Apostas de Quota Fixa e iGaming):
  // 1. Gross Gaming Revenue (GGR) = Total das Apostas - Total dos Prêmios Pagos
  const ggr = Number((Math.max(0, totalApostasArrecadadasBrl - totalPremiosPagosApostadoresBrl)).toFixed(2));

  // 2. Contribuição sobre o GGR: Alíquota de 12% destinada a esporte, turismo, segurança e educação (Art. 30)
  const tributoGgr12 = Number((ggr * 0.12).toFixed(2));

  // 3. IRRF sobre Prêmios dos Apostadores: Alíquota de 15% retida na fonte pelo operador (Art. 31)
  const irrfPremios15 = Number((totalPremiosIndividuaisTributaveisBrl * 0.15).toFixed(2));

  // 4. Taxa de Fiscalização SPA/MF (Tabela por Faixa de GGR - Estimativa Faixa Média R$ 50.000)
  const taxaFiscalizacao = 50000.00;

  const totalTributos = Number((tributoGgr12 + irrfPremios15 + taxaFiscalizacao).toFixed(2));

  const diag = "Apostas e Bets (Lei nº 14.790/2023): " + operadorNome + ". Apostas: R$ " + totalApostasArrecadadasBrl.toFixed(2) + " - Premios: R$ " + totalPremiosPagosApostadoresBrl.toFixed(2) + " = GGR R$ " + ggr.toFixed(2) + ". TRIBUTACAO: 12% GGR = R$ " + tributoGgr12.toFixed(2) + " + IRRF Premios (15%) = R$ " + irrfPremios15.toFixed(2) + " + Taxa SPA/MF = R$ " + taxaFiscalizacao.toFixed(2) + " (Total R$ " + totalTributos.toFixed(2) + ").";

  return Ok({
    operadorBetId,
    operadorNome,
    totalApostasArrecadadasBrl,
    totalPremiosPagosBrl: totalPremiosPagosApostadoresBrl,
    grossGamingRevenueGgrBrl: ggr,
    contribuicaoSocialGgr12PercentBrl: tributoGgr12,
    irrfSobrePremios15PercentBrl: irrfPremios15,
    taxaFiscalizacaoSpaMfBrl: taxaFiscalizacao,
    totalTributosApuradosBrl: totalTributos,
    diagnosticoFiscal: diag
  });
}
