import { Result, Ok, Err } from '../../types/result.js';

export interface IpiExportPresumedCreditInput {
  empresaId: string;
  empresaExportadoraNome: string; // Ex: 'Soberano Açúcar, Etanol & Bioenergia S.A.'
  produtoExportadoDescricao: string; // Ex: 'Açúcar VHP Granel / Etanol Anidro'
  receitaExportacaoBrl: number;
  receitaOperacionalBrutaTotalBrl: number;
  custoTotalAquisicaoInsumosNacionaisBrl: number; // Matérias-primas e energia
  aliquotaPresumidaPadraoPercent?: number; // 5,37% (Art. 2º Lei 9.363/96)
}

export interface IpiExportPresumedCreditResult {
  empresaId: string;
  empresaExportadoraNome: string;
  produtoExportadoDescricao: string;
  coeficienteExportacaoPercent: number; // Receita Exportação / Receita Total
  baseCalculoInsumosExportacaoBrl: number;
  aliquotaPresumidaPercent: number;
  valorCreditoPresumidoIpiRessarcimentoBrl: number; // Compensável via PER/DCOMP
  diagnosticoFiscal: string;
}

export function processIpiExportPresumedCreditLaw9363(input: IpiExportPresumedCreditInput): Result<IpiExportPresumedCreditResult, Error> {
  const {
    empresaId,
    empresaExportadoraNome,
    produtoExportadoDescricao,
    receitaExportacaoBrl,
    receitaOperacionalBrutaTotalBrl,
    custoTotalAquisicaoInsumosNacionaisBrl,
    aliquotaPresumidaPadraoPercent = 5.37
  } = input;

  if (receitaExportacaoBrl <= 0 || receitaOperacionalBrutaTotalBrl <= 0 || custoTotalAquisicaoInsumosNacionaisBrl <= 0) {
    return Err(new Error('Receitas e custos de insumos devem ser superiores a zero.'));
  }

  // Lei nº 9.363/1996 (Ressarcimento de PIS/COFINS através de Crédito Presumido de IPI):
  // 1. Coeficiente de Exportação (CE) = Receita de Exportação / Receita Operacional Bruta Total
  const ce = Math.min(1.0, receitaExportacaoBrl / receitaOperacionalBrutaTotalBrl);
  const cePercent = Number((ce * 100).toFixed(2));

  // 2. Base de Cálculo = Custo de Insumos Nacionais * Coeficiente de Exportação
  const baseInsumos = Number((custoTotalAquisicaoInsumosNacionaisBrl * ce).toFixed(2));

  // 3. Crédito Presumido de IPI = Base de Insumos * 5,37%
  const valorCredito = Number((baseInsumos * (aliquotaPresumidaPadraoPercent / 100)).toFixed(2));

  const diag = 'Crédito Presumido de IPI na Exportação (Lei nº 9.363/1996): ' + empresaExportadoraNome + ' - ' + produtoExportadoDescricao + '. Exportação: R$ ' + receitaExportacaoBrl.toFixed(2) + ' (CE ' + cePercent + '%). Base Insumos Nacionais: R$ ' + baseInsumos.toFixed(2) + '. CRÉDITO PRESUMIDO DE IPI (' + aliquotaPresumidaPadraoPercent + '%): R$ ' + valorCredito.toFixed(2) + ' (Ressarcimento PIS/COFINS via PER/DCOMP).';

  return Ok({
    empresaId,
    empresaExportadoraNome,
    produtoExportadoDescricao,
    coeficienteExportacaoPercent: cePercent,
    baseCalculoInsumosExportacaoBrl: baseInsumos,
    aliquotaPresumidaPercent: aliquotaPresumidaPadraoPercent,
    valorCreditoPresumidoIpiRessarcimentoBrl: valorCredito,
    diagnosticoFiscal: diag
  });
}
