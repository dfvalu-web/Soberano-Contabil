import { Result, Ok, Err } from '../../types/result.js';

export interface Zfm40PdInput {
  fabricaZfmCnpj: string;
  faturamentoBrutoBensInformaticaBrl: number; // Ex: R$ 50.000.000,00
  tributosDutiveisReceitaBrutaBrl: number; // Ex: R$ 5.000.000,00 -> RL = R$ 45M
  percentualMinimoPdSuframaPercent: number; // 5.0% obrigatório
  investimentoEfetivoRealizadoPdBrl: number; // Ex: R$ 2.500.000,00
}

export interface Zfm40PdResult {
  fabricaZfmCnpj: string;
  receitaLiquidaInformaticaBrl: number; // R$ 45.000.000,00
  obrigatoriedadeInvestimentoPdBrl: number; // 5% de R$ 45M = R$ 2.250.000,00
  excedenteInvestimentoPdBrl: number; // R$ 250.000,00
  creditoFinanceiroGeradoBrl: number; // Ex: 100% do obrigatório compensável = R$ 2.250.000,00
  statusSuframaPd: 'OBRIGACAO_PD_SUFRAMA_CUMPRIDA_CREDITO_HOMOLOGADO';
  destinacaoReservaLucrosPl: 'RESERVA_INCENTIVOS_FISCAIS_ART_195A';
  diagnosticoZfmPd: string;
}

export function processZfm40SuframaRdFinancialCreditEngine(input: Zfm40PdInput): Result<Zfm40PdResult, Error> {
  const {
    fabricaZfmCnpj,
    faturamentoBrutoBensInformaticaBrl,
    tributosDutiveisReceitaBrutaBrl,
    percentualMinimoPdSuframaPercent = 5.0,
    investimentoEfetivoRealizadoPdBrl
  } = input;

  if (!fabricaZfmCnpj || faturamentoBrutoBensInformaticaBrl <= 0) {
    return Err(new Error('CNPJ e faturamento bruto de informática são obrigatórios.'));
  }

  const rl = Math.max(0, faturamentoBrutoBensInformaticaBrl - tributosDutiveisReceitaBrutaBrl);
  const obrigatorio = (rl * percentualMinimoPdSuframaPercent) / 100;

  if (investimentoEfetivoRealizadoPdBrl < obrigatorio) {
    return Err(new Error('Investimento realizado em P&D inferior aos 5% obrigatórios da Lei 8.387/91.'));
  }

  const excedente = investimentoEfetivoRealizadoPdBrl - obrigatorio;
  const creditoFinanceiro = obrigatorio; // Crédito financeiro de TIC utilizável para compensação

  const diag = "ZFM 4.0 P&D SUFRAMA (Lei 8.387/91): Receita Liquida Informática: R$ " + rl.toLocaleString('pt-BR') + " | P&D Obrigatorio (5%): R$ " + obrigatorio.toLocaleString('pt-BR') + " | Investido: R$ " + investimentoEfetivoRealizadoPdBrl.toLocaleString('pt-BR') + " -> Credito Financeiro Homologado: R$ " + creditoFinanceiro.toLocaleString('pt-BR');

  return Ok({
    fabricaZfmCnpj,
    receitaLiquidaInformaticaBrl: rl,
    obrigatoriedadeInvestimentoPdBrl: obrigatorio,
    excedenteInvestimentoPdBrl: excedente,
    creditoFinanceiroGeradoBrl: creditoFinanceiro,
    statusSuframaPd: 'OBRIGACAO_PD_SUFRAMA_CUMPRIDA_CREDITO_HOMOLOGADO',
    destinacaoReservaLucrosPl: 'RESERVA_INCENTIVOS_FISCAIS_ART_195A',
    diagnosticoZfmPd: diag
  });
}
