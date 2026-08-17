import { Result, Ok, Err } from '../../types/result.js';

export interface IfrsTransitionInput {
  empresaCnpj: string;
  dataTransicao: string; // Ex: '2025-01-01'
  patrimonioLiquidoAnteriorBrgaapBrl: number; // Ex: R$ 50.000.000,00
  ajusteCustoAtribuidoImobilizadoBrl: number; // Ex: + R$ 8.000.000,00 (Deemed cost)
  eliminacaoDespesasDiferidasPreOperacionaisBrl: number; // Ex: - R$ 1.500.000,00
  ajusteArrendamentosIfrs16DireitoUsoBrl: number; // Ex: + R$ 4.000.000,00 (Ativo) vs Passivo R$ 4.200.000,00 -> Efeito Líquido - R$ 200k
  passivoArrendamentoInicialBrl: number; // Ex: R$ 4.200.000,00
  aliquotaTributosDiferidosPercent: number; // 34% (25% IRPJ + 9% CSLL)
}

export interface IfrsTransitionResult {
  empresaCnpj: string;
  dataTransicao: string;
  patrimonioLiquidoAnteriorBrl: number;
  totalAjustesBrutosLucrosAcumuladosBrl: number;
  efeitoTributosDiferidosPassivoAtivoBrl: number; // 34% sobre os ajustes de valor justo
  patrimonioLiquidoAberturaIfrsBrl: number;
  variacaoLiquidaPlTransicaoBrl: number;
  statusAprovacaoCpc37: 'BALANCO_ABERTURA_IFRS_HOMOLOGADO';
  mapaReconciliacaoContabil: {
    deemedCostImobilizado: number;
    baixaDiferidoAtivo: number;
    efeitoLiquidoLeasingIfrs16: number;
    tributosDiferidosNoPl: number;
  };
  diagnosticoCpc37: string;
}

export function processFirstTimeIfrsTransitionReconciliationCpc37(input: IfrsTransitionInput): Result<IfrsTransitionResult, Error> {
  const {
    empresaCnpj,
    dataTransicao,
    patrimonioLiquidoAnteriorBrgaapBrl,
    ajusteCustoAtribuidoImobilizadoBrl,
    eliminacaoDespesasDiferidasPreOperacionaisBrl,
    ajusteArrendamentosIfrs16DireitoUsoBrl,
    passivoArrendamentoInicialBrl,
    aliquotaTributosDiferidosPercent
  } = input;

  if (patrimonioLiquidoAnteriorBrgaapBrl <= 0) {
    return Err(new Error('Patrimônio líquido anterior deve ser positivo.'));
  }

  // 1. Efeito Líquido IFRS 16
  const efeitoLeasing = ajusteArrendamentosIfrs16DireitoUsoBrl - passivoArrendamentoInicialBrl;

  // 2. Ajustes Brutos em Lucros Acumulados no PL de Abertura (CPC 37 item 11)
  const ajustesBrutosAntesImpostos = ajusteCustoAtribuidoImobilizadoBrl - eliminacaoDespesasDiferidasPreOperacionaisBrl + efeitoLeasing;

  // 3. Tributos Diferidos no PL sobre Custo Atribuído (34% de passivo fiscal diferido)
  const tributosDiferidosSobreDeemedCost = Number((ajusteCustoAtribuidoImobilizadoBrl * (aliquotaTributosDiferidosPercent / 100)).toFixed(2));
  
  // Ajuste Líquido Final no PL
  const variacaoLiquidaPl = Number((ajustesBrutosAntesImpostos - tributosDiferidosSobreDeemedCost).toFixed(2));
  const plAberturaIfrs = Number((patrimonioLiquidoAnteriorBrgaapBrl + variacaoLiquidaPl).toFixed(2));

  const diag = "Primeira Adocao IFRS (CPC 37 / IFRS 1): CNPJ " + empresaCnpj + " (Transicao em " + dataTransicao + ") | PL Anterior BR GAAP: R$ " + patrimonioLiquidoAnteriorBrgaapBrl.toFixed(2) + " -> Ajustes Brutos: + R$ " + ajustesBrutosAntesImpostos.toFixed(2) + " (Deemed Cost: R$ " + ajusteCustoAtribuidoImobilizadoBrl.toFixed(2) + ") | Tributos Diferidos (34%): - R$ " + tributosDiferidosSobreDeemedCost.toFixed(2) + " -> PL de Abertura IFRS: R$ " + plAberturaIfrs.toFixed(2) + ".";

  return Ok({
    empresaCnpj,
    dataTransicao,
    patrimonioLiquidoAnteriorBrl: patrimonioLiquidoAnteriorBrgaapBrl,
    totalAjustesBrutosLucrosAcumuladosBrl: Number(ajustesBrutosAntesImpostos.toFixed(2)),
    efeitoTributosDiferidosPassivoAtivoBrl: tributosDiferidosSobreDeemedCost,
    patrimonioLiquidoAberturaIfrsBrl: plAberturaIfrs,
    variacaoLiquidaPlTransicaoBrl: variacaoLiquidaPl,
    statusAprovacaoCpc37: 'BALANCO_ABERTURA_IFRS_HOMOLOGADO',
    mapaReconciliacaoContabil: {
      deemedCostImobilizado: ajusteCustoAtribuidoImobilizadoBrl,
      baixaDiferidoAtivo: -eliminacaoDespesasDiferidasPreOperacionaisBrl,
      efeitoLiquidoLeasingIfrs16: Number(efeitoLeasing.toFixed(2)),
      tributosDiferidosNoPl: -tributosDiferidosSobreDeemedCost
    },
    diagnosticoCpc37: diag
  });
}
