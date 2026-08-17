import { Result, Ok, Err } from '../../types/result.js';

export interface SbceCarbonInput {
  empresaReguladaCnpj: string;
  setorAtividade: 'SIDERURGIA' | 'CIMENTO' | 'QUIMICA' | 'PETROLEO_GAS' | 'ENERGIA';
  emissoesAnuaisGheeTco2e: number; // Ex: 45.000 tCO2e (Limiar SBCE > 25.000 tCO2e)
  limiteEmissaoGratuitoCbeTco2e: number; // Ex: 35.000 tCO2e
  cotasAdquiridasMercadoCbe: number; // Ex: 10.000 CBEs
  precoMedioPorCbeBrl: number; // Ex: R$ 120,00 / tCO2e
}

export interface SbceCarbonResult {
  empresaReguladaCnpj: string;
  enquadramentoReguladosbce: boolean;
  deficitEmissoesTco2e: number; // 45.000 - 35.000 = 10.000 tCO2e
  custoTotalCumprimentoSbceBrl: number; // 10.000 * 120 = R$ 1.200.000,00
  classificacaoContabilCbe: 'ATIVO_INTANGIVEL_CUMPRIMENTO_META_CPC04';
  statusConformidadeSbce: 'OBRIGACAO_SBCE_100_PERCENT_COMPENSADA';
  diagnosticoSbce: string;
}

export function processSbceRegulatedCarbonMarketTaxEngine(input: SbceCarbonInput): Result<SbceCarbonResult, Error> {
  const {
    empresaReguladaCnpj,
    setorAtividade,
    emissoesAnuaisGheeTco2e,
    limiteEmissaoGratuitoCbeTco2e,
    cotasAdquiridasMercadoCbe,
    precoMedioPorCbeBrl
  } = input;

  if (!empresaReguladaCnpj || emissoesAnuaisGheeTco2e <= 0) {
    return Err(new Error('CNPJ e volume de emissões anuais são obrigatórios.'));
  }

  const regulado = emissoesAnuaisGheeTco2e > 25000;
  const deficit = Math.max(0, emissoesAnuaisGheeTco2e - limiteEmissaoGratuitoCbeTco2e);
  const custo = cotasAdquiridasMercadoCbe * precoMedioPorCbeBrl;

  if (cotasAdquiridasMercadoCbe < deficit) {
    return Err(new Error('Volume de cotas adquiridas insuficiente para cobrir o déficit de emissões no SBCE.'));
  }

  const diag = "SBCE Mercado Regulado de Carbono: CNPJ " + empresaReguladaCnpj + " (" + setorAtividade + ") | Emissoes: " + emissoesAnuaisGheeTco2e.toLocaleString('pt-BR') + " tCO2e | Deficit: " + deficit.toLocaleString('pt-BR') + " tCO2e | Compensado com " + cotasAdquiridasMercadoCbe.toLocaleString('pt-BR') + " CBEs (Custo: R$ " + custo.toLocaleString('pt-BR') + ") -> 100% Conforme.";

  return Ok({
    empresaReguladaCnpj,
    enquadramentoReguladosbce: regulado,
    deficitEmissoesTco2e: deficit,
    custoTotalCumprimentoSbceBrl: custo,
    classificacaoContabilCbe: 'ATIVO_INTANGIVEL_CUMPRIMENTO_META_CPC04',
    statusConformidadeSbce: 'OBRIGACAO_SBCE_100_PERCENT_COMPENSADA',
    diagnosticoSbce: diag
  });
}
