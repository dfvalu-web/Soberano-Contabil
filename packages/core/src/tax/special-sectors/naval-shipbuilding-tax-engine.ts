import { Result, Ok, Err } from '../../types/result.js';

export type NavalOperationType = 'CONSTRUCAO_NOVA_EMBARCACAO_REB' | 'REPARO_MANUTENCAO_NAVAL' | 'VENDA_PECAS_REPOSICAO';

export interface NavalTaxInput {
  operacaoId: string;
  estaleiroNome: string;
  tipoOperacao: NavalOperationType;
  embarcacaoRegistradaNoReb: boolean; // Registro Especial Brasileiro (REB)
  valorOperacaoBrl: number;
  valorInsumosNacionaisBrl?: number;
  valorInsumosImportadosBrl?: number;
}

export interface NavalTaxResult {
  operacaoId: string;
  estaleiroNome: string;
  tipoOperacao: NavalOperationType;
  isDesoneracaoRebAplicavel: boolean;
  aliquotaPisEfetivaPercent: number; // 0% sob REB
  valorPisDevidoBrl: number;
  aliquotaCofinsEfetivaPercent: number; // 0% sob REB
  valorCofinsDevidoBrl: number;
  aliquotaIpiEfetivaPercent: number; // 0% ou Isenção
  valorIpiDevidoBrl: number;
  aliquotaIcmsEfetivaPercent: number; // Isenção Convênio ICMS 33/77
  valorIcmsDevidoBrl: number;
  totalTributosIncidentesBrl: number;
  diagnosticoFiscal: string;
}

export function processNavalShipbuildingTaxEngine(input: NavalTaxInput): Result<NavalTaxResult, Error> {
  const {
    operacaoId,
    estaleiroNome,
    tipoOperacao,
    embarcacaoRegistradaNoReb,
    valorOperacaoBrl
  } = input;

  if (valorOperacaoBrl <= 0) {
    return Err(new Error('Valor da operação naval deve ser superior a zero.'));
  }

  // Lei nº 11.774/2008 Art. 1º e Lei nº 9.432/1997:
  // As receitas decorrentes da construção, conservação, modernização e reparo de embarcações
  // pré-registradas ou registradas no REB possuem ALÍQUOTA ZERO de PIS e COFINS e desoneração de IPI.
  // Convênio ICMS 33/1977 e 102/1996: ISENÇÃO de ICMS para construção naval e embarcações.
  if (embarcacaoRegistradaNoReb) {
    const diag = 'Indústria Naval & Estaleiros (Lei nº 11.774/08, REB & Conv. ICMS 33/77): ' + estaleiroNome + ' (' + tipoOperacao + '). Embarcação vinculada ao REB. BENEFÍCIO FISCAL INTEGRAL: PIS 0% (R$ 0,00) + COFINS 0% (R$ 0,00) + IPI 0% (R$ 0,00) + ICMS Isento (R$ 0,00).';

    return Ok({
      operacaoId,
      estaleiroNome,
      tipoOperacao,
      isDesoneracaoRebAplicavel: true,
      aliquotaPisEfetivaPercent: 0,
      valorPisDevidoBrl: 0,
      aliquotaCofinsEfetivaPercent: 0,
      valorCofinsDevidoBrl: 0,
      aliquotaIpiEfetivaPercent: 0,
      valorIpiDevidoBrl: 0,
      aliquotaIcmsEfetivaPercent: 0,
      valorIcmsDevidoBrl: 0,
      totalTributosIncidentesBrl: 0,
      diagnosticoFiscal: diag
    });
  }

  // Sem REB (Tributação Padrão de Indústria Metalmecânica)
  const pis = Number((valorOperacaoBrl * 0.0165).toFixed(2));
  const cofins = Number((valorOperacaoBrl * 0.0760).toFixed(2));
  const ipi = Number((valorOperacaoBrl * 0.0500).toFixed(2)); // 5% IPI médio
  const icms = Number((valorOperacaoBrl * 0.1800).toFixed(2)); // 18% ICMS
  const total = Number((pis + cofins + ipi + icms).toFixed(2));

  const diag = 'Indústria Naval SEM REB: ' + estaleiroNome + '. Operação sujeita à tributação ordinária (PIS 1,65% + COFINS 7,60% + IPI 5% + ICMS 18% = R$ ' + total.toFixed(2) + ').';

  return Ok({
    operacaoId,
    estaleiroNome,
    tipoOperacao,
    isDesoneracaoRebAplicavel: false,
    aliquotaPisEfetivaPercent: 1.65,
    valorPisDevidoBrl: pis,
    aliquotaCofinsEfetivaPercent: 7.60,
    valorCofinsDevidoBrl: cofins,
    aliquotaIpiEfetivaPercent: 5.0,
    valorIpiDevidoBrl: ipi,
    aliquotaIcmsEfetivaPercent: 18.0,
    valorIcmsDevidoBrl: icms,
    totalTributosIncidentesBrl: total,
    diagnosticoFiscal: diag
  });
}
