import { Result, Ok, Err } from '../../types/result.js';

export type MineralType = 'MINERIO_DE_FERRO' | 'OURO' | 'BAUXITA' | 'COBRE' | 'CALCARIO';

export interface MiningCfemInput {
  empresaMineradoraId: string;
  tipoMineral: MineralType;
  municipioProdutorNome: string;
  receitaBrutaVendaMineralBrl: number;
  tributosIncidentesNaComercializacaoBrl: number; // PIS/COFINS, ICMS s/ venda
}

export interface MiningCfemResult {
  empresaId: string;
  tipoMineral: string;
  receitaLiquidaBaseCalculoCfem: number;
  aliquotaCfemPercent: number;
  totalCfemDevidaBrl: number;
  partilhaFederativa: {
    municipiosProdutores60Percent: number;
    municipiosAfetados15Percent: number;
    estadoProdutor15Percent: number;
    uniao10Percent: number;
  };
  diagnosticoCfem: string;
}

export function calculateMiningCfem(input: MiningCfemInput): Result<MiningCfemResult, Error> {
  const { empresaMineradoraId, tipoMineral, municipioProdutorNome, receitaBrutaVendaMineralBrl, tributosIncidentesNaComercializacaoBrl } = input;

  if (receitaBrutaVendaMineralBrl <= 0) {
    return Err(new Error('Receita bruta da venda mineral deve ser superior a zero.'));
  }

  // Base de Cálculo = Receita Bruta - Tributos incidentes na comercialização (Lei nº 13.540/2017)
  const baseCalculo = Number((receitaBrutaVendaMineralBrl - tributosIncidentesNaComercializacaoBrl).toFixed(2));

  // Alíquotas oficiais CFEM
  let aliquota = 2.0; // Padrão
  if (tipoMineral === 'MINERIO_DE_FERRO') aliquota = 3.5;
  else if (tipoMineral === 'OURO') aliquota = 1.5;
  else if (tipoMineral === 'BAUXITA') aliquota = 3.0;
  else if (tipoMineral === 'COBRE') aliquota = 2.0;
  else if (tipoMineral === 'CALCARIO') aliquota = 1.0;

  const totalCfem = Number((baseCalculo * (aliquota / 100)).toFixed(2));

  // Partilha Federativa (Art. 2º, § 2º da Lei nº 13.540/2017):
  // 60% Município Produtor, 15% Municípios Afetados, 15% Estado, 10% União (ANM/FNDCT)
  const munProd = Number((totalCfem * 0.60).toFixed(2));
  const munAfet = Number((totalCfem * 0.15).toFixed(2));
  const estado = Number((totalCfem * 0.15).toFixed(2));
  const uniao = Number((totalCfem * 0.10).toFixed(2));

  const diagnostico = 'CFEM (Lei nº 13.540/2017): Extração de ' + tipoMineral + ' em ' + municipioProdutorNome + '. Base de cálculo líquida de R$ ' + baseCalculo.toFixed(2) + ' à alíquota de ' + aliquota.toFixed(1) + '%, totalizando R$ ' + totalCfem.toFixed(2) + ' de CFEM devida à ANM.';

  return Ok({
    empresaId: empresaMineradoraId,
    tipoMineral,
    receitaLiquidaBaseCalculoCfem: baseCalculo,
    aliquotaCfemPercent: aliquota,
    totalCfemDevidaBrl: totalCfem,
    partilhaFederativa: {
      municipiosProdutores60Percent: munProd,
      municipiosAfetados15Percent: munAfet,
      estadoProdutor15Percent: estado,
      uniao10Percent: uniao
    },
    diagnosticoCfem: diagnostico
  });
}
