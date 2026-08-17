import { Result, Ok, Err } from '../../types/result.js';

export interface NonResidentInvestorInput {
  investidorEstrangeiroNome: string;
  paisDomicilioFiscal: string;
  jurisdicaoParaisoFiscal: boolean; // Se residente em país com tributação favorecida (Lei 9.430/96)
  rendimentoJurosRecebidosBrl: number; // Ex: R$ 1.000.000,00
}

export interface NonResidentInvestorResult {
  investidorEstrangeiroNome: string;
  paisDomicilioFiscal: string;
  aliquotaIrrfAplicavelPercent: number; // 0% (Isento) ou 15% (se paraíso fiscal)
  impostoIrrfRetidoBrl: number;
  rendimentoLiquidoRemetidoBrl: number;
  statusIsencao: 'ISENCAO_IRRF_NAO_RESIDENTE_LEI_12431' | 'TRIBUTADO_PARAISO_FISCAL_15_PERCENT';
  diagnosticoInvestidor: string;
}

export function processNonResidentInvestorWithholdingTaxEngine(input: NonResidentInvestorInput): Result<NonResidentInvestorResult, Error> {
  const {
    investidorEstrangeiroNome,
    paisDomicilioFiscal,
    jurisdicaoParaisoFiscal,
    rendimentoJurosRecebidosBrl
  } = input;

  if (!investidorEstrangeiroNome || rendimentoJurosRecebidosBrl <= 0) {
    return Err(new Error('Nome do investidor e rendimento de juros são obrigatórios.'));
  }

  // Lei 12.431/2011: Alíquota 0% para não residentes, exceto residentes em países com tributação favorecida (15%)
  const aliquota = jurisdicaoParaisoFiscal ? 15.0 : 0.0;
  const imposto = (rendimentoJurosRecebidosBrl * aliquota) / 100;
  const liquido = rendimentoJurosRecebidosBrl - imposto;

  const diag = "Investidor Nao Residente (Lei 12.431/11): " + investidorEstrangeiroNome + " (" + paisDomicilioFiscal + ") | Rendimento: R$ " + rendimentoJurosRecebidosBrl.toLocaleString('pt-BR') + " | IRRF (" + aliquota + "%): R$ " + imposto.toLocaleString('pt-BR') + " -> Liquido Remetido: R$ " + liquido.toLocaleString('pt-BR');

  return Ok({
    investidorEstrangeiroNome,
    paisDomicilioFiscal,
    aliquotaIrrfAplicavelPercent: aliquota,
    impostoIrrfRetidoBrl: imposto,
    rendimentoLiquidoRemetidoBrl: liquido,
    statusIsencao: jurisdicaoParaisoFiscal ? 'TRIBUTADO_PARAISO_FISCAL_15_PERCENT' : 'ISENCAO_IRRF_NAO_RESIDENTE_LEI_12431',
    diagnosticoInvestidor: diag
  });
}
