import { Result, Ok, Err } from '../../types/result.js';

export type CooperativeType = 'AGROPECUARIA' | 'CREDITO_MUTUO' | 'SAUDE_MEDICA' | 'TRANSPORTE';

export interface CooperativeTaxInput {
  cooperativaId: string;
  razaoSocial: string;
  tipoCooperativa: CooperativeType;
  receitaAtoCooperativoAssociadosBrl: number;
  receitaAtoNaoCooperativoTerceirosBrl: number;
  despesasOperacionaisTotaisBrl: number;
}

export interface CooperativeTaxResult {
  cooperativaId: string;
  razaoSocial: string;
  percentualReceitaNaoCooperativaPercent: number;
  sobrasLiquidasAtoCooperativoIsentasBrl: number;
  lucroLiquidoTributavelAtoNaoCooperativoBrl: number;
  tributacaoAtoNaoCooperativoDevida: {
    irpjBrl: number;
    csllBrl: number;
    pisBrl: number;
    cofinsBrl: number;
    totalTributosDevidosBrl: number;
  };
  diagnosticoFiscal: string;
}

export function processCooperativeTaxEngine(input: CooperativeTaxInput): Result<CooperativeTaxResult, Error> {
  const {
    cooperativaId,
    razaoSocial,
    tipoCooperativa,
    receitaAtoCooperativoAssociadosBrl,
    receitaAtoNaoCooperativoTerceirosBrl,
    despesasOperacionaisTotaisBrl
  } = input;

  const receitaTotal = receitaAtoCooperativoAssociadosBrl + receitaAtoNaoCooperativoTerceirosBrl;
  if (receitaTotal <= 0) {
    return Err(new Error('Receita total da cooperativa deve ser superior a zero.'));
  }

  // Rateio Proporcional de Despesas Comuns (Art. 87 da Lei nº 5.764/71)
  const propTerceiros = receitaAtoNaoCooperativoTerceirosBrl / receitaTotal;
  const percTerceiros = Number((propTerceiros * 100).toFixed(2));

  const despesasNaoCooperativas = Number((despesasOperacionaisTotaisBrl * propTerceiros).toFixed(2));
  const despesasCooperativas = Number((despesasOperacionaisTotaisBrl - despesasNaoCooperativas).toFixed(2));

  // Sobras Líquidas dos Cooperados (Ato Cooperativo - 100% ISENTO)
  const sobrasIsentas = Number((receitaAtoCooperativoAssociadosBrl - despesasCooperativas).toFixed(2));

  // Lucro Líquido Tributável dos Terceiros (Ato Não Cooperativo)
  const lucroTributavelTerceiros = Number((receitaAtoNaoCooperativoTerceirosBrl - despesasNaoCooperativas).toFixed(2));

  let irpj = 0;
  let csll = 0;
  let pis = 0;
  let cofins = 0;

  if (lucroTributavelTerceiros > 0) {
    // IRPJ: 15% + 10% adicional sobre excedente de 240k/ano
    const adicionalIrpj = Math.max(0, (lucroTributavelTerceiros - 240000.00) * 0.10);
    irpj = Number(((lucroTributavelTerceiros * 0.15) + adicionalIrpj).toFixed(2));
    csll = Number((lucroTributavelTerceiros * 0.09).toFixed(2));
  }

  // PIS / COFINS sobre receita de terceiros (0,65% e 3% no regime cumulativo de cooperativas)
  pis = Number((receitaAtoNaoCooperativoTerceirosBrl * 0.0065).toFixed(2));
  cofins = Number((receitaAtoNaoCooperativoTerceirosBrl * 0.0300).toFixed(2));

  const totalTrib = Number((irpj + csll + pis + cofins).toFixed(2));

  const diag = 'Regime de Cooperativas (Lei nº 5.764/71 & Tema 516 do STF): ' + razaoSocial + ' (' + tipoCooperativa + '). ATO COOPERATIVO (Associados): Receita R$ ' + receitaAtoCooperativoAssociadosBrl.toFixed(2) + ' -> Sobras Líquidas de R$ ' + sobrasIsentas.toFixed(2) + ' 100% ISENTAS de PIS/COFINS/IRPJ/CSLL. ATO NÃO COOPERATIVO (Terceiros): Receita R$ ' + receitaAtoNaoCooperativoTerceirosBrl.toFixed(2) + ' (' + percTerceiros + '% do total) -> Lucro Tributável de R$ ' + lucroTributavelTerceiros.toFixed(2) + '. Tributos federais devidos: R$ ' + totalTrib.toFixed(2) + '.';

  return Ok({
    cooperativaId,
    razaoSocial,
    percentualReceitaNaoCooperativaPercent: percTerceiros,
    sobrasLiquidasAtoCooperativoIsentasBrl: sobrasIsentas,
    lucroLiquidoTributavelAtoNaoCooperativoBrl: lucroTributavelTerceiros,
    tributacaoAtoNaoCooperativoDevida: {
      irpjBrl: irpj,
      csllBrl: csll,
      pisBrl: pis,
      cofinsBrl: cofins,
      totalTributosDevidosBrl: totalTrib
    },
    diagnosticoFiscal: diag
  });
}
