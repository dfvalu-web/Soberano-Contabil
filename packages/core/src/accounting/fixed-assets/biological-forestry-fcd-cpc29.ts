import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export interface ForestryBiologicalAssetInput {
  florestaId: string;
  empresaNome: string; // Ex: 'Soberano Papel, Celulose & Silvicultura S.A.'
  especieFlorestal: string; // Ex: 'Eucalyptus Urophylla / Pinus Taeda'
  areaPlantioHectares: number;
  idadeFlorestaAnos: number; // Ex: 4 anos (Ciclo de corte de 7 anos)
  volumeProjetadoMadeiraM3PorHectare: number; // Ex: 300 m³/ha no corte
  precoLiquidoEsperadoMadeiraEmPeBrlPorM3: number; // Ex: R$ 120 / m³
  taxaDescontoWaccAnualPercent: number; // Ex: 11,5% a.a.
  saldoAnteriorValorJustoBrl?: number;
}

export interface ForestryBiologicalAssetResult {
  florestaId: string;
  empresaNome: string;
  especieFlorestal: string;
  volumeTotalProjetadoM3: number;
  receitaBrutaProjetadaCorteBrl: number;
  anosAteCorteFinal: number;
  valorJustoFcdAtualizadoBrl: number; // CPC 29
  variacaoValorJustoPeriodoDrebBrl: number;
  partidasDobrada: JournalEntryLine[];
  diagnosticoCpc29: string;
}

export function evaluateForestryBiologicalAssetFcdCpc29(input: ForestryBiologicalAssetInput): Result<ForestryBiologicalAssetResult, Error> {
  const {
    florestaId,
    empresaNome,
    especieFlorestal,
    areaPlantioHectares,
    idadeFlorestaAnos,
    volumeProjetadoMadeiraM3PorHectare,
    precoLiquidoEsperadoMadeiraEmPeBrlPorM3,
    taxaDescontoWaccAnualPercent,
    saldoAnteriorValorJustoBrl = 0
  } = input;

  if (areaPlantioHectares <= 0 || volumeProjetadoMadeiraM3PorHectare <= 0 || precoLiquidoEsperadoMadeiraEmPeBrlPorM3 <= 0) {
    return Err(new Error('Área, volume e preço da madeira devem ser superiores a zero.'));
  }

  // Ciclo florestal padrão de eucalipto no Brasil: 7 anos
  const cicloTotalAnos = 7;
  const anosAteCorte = Math.max(0, cicloTotalAnos - idadeFlorestaAnos);

  // 1. Volume Total e Receita Projetada no Ponto de Colheita
  const volumeTotalM3 = areaPlantioHectares * volumeProjetadoMadeiraM3PorHectare;
  const receitaColheitaProjetada = volumeTotalM3 * precoLiquidoEsperadoMadeiraEmPeBrlPorM3;

  // 2. Crescimento proporcional até a idade atual e Desconto a Valor Presente (FCD)
  // Curva de crescimento sigmoidal simplificada pela idade proporcional
  const fatorIdade = Math.min(1.0, idadeFlorestaAnos / cicloTotalAnos);
  const valorNominalAcumulado = receitaColheitaProjetada * fatorIdade;

  // Desconto pelo prazo restante até o corte
  const fatorDesconto = Math.pow(1 + (taxaDescontoWaccAnualPercent / 100), anosAteCorte);
  const valorJustoFcd = Number((valorNominalAcumulado / fatorDesconto).toFixed(2));

  // 3. Variação do Valor Justo no Período (DRE)
  const variacaoValorJusto = Number((valorJustoFcd - saldoAnteriorValorJustoBrl).toFixed(2));

  const partidas: JournalEntryLine[] = [];

  if (variacaoValorJusto > 0) {
    // D: Ativo Biológico Florestal (Ativo Não Circulante - CPC 29)
    partidas.push({
      accountId: '1.2.3.01',
      accountCode: '1.2.3.01',
      accountName: 'Florestas Plantadas em Formação - Eucalipto (Ativo Biológico - CPC 29)',
      type: 'DEBIT',
      amount: variacaoValorJusto
    });

    // C: Variação Positiva do Valor Justo de Ativos Biológicos (Resultado - CPC 29)
    partidas.push({
      accountId: '3.1.3.05',
      accountCode: '3.1.3.05',
      accountName: 'Ganho por Variação a Valor Justo de Ativos Biológicos (Resultado - CPC 29)',
      type: 'CREDIT',
      amount: variacaoValorJusto
    });
  }

  const diag = 'Ativos Biológicos Florestais (CPC 29 / IAS 41 FCD): ' + empresaNome + ' (' + especieFlorestal + '). Área: ' + areaPlantioHectares.toLocaleString('pt-BR') + ' ha (Idade ' + idadeFlorestaAnos + ' anos). Volume Projetado: ' + volumeTotalM3.toLocaleString('pt-BR') + ' m³. Valor Justo FCD: R$ ' + valorJustoFcd.toFixed(2) + ' (Variação DRE: R$ ' + variacaoValorJusto.toFixed(2) + ' a ' + taxaDescontoWaccAnualPercent + '% WACC). Terra Nua segregada no Imobilizado (CPC 27).';

  return Ok({
    florestaId,
    empresaNome,
    especieFlorestal,
    volumeTotalProjetadoM3: volumeTotalM3,
    receitaBrutaProjetadaCorteBrl: receitaColheitaProjetada,
    anosAteCorteFinal: anosAteCorte,
    valorJustoFcdAtualizadoBrl: valorJustoFcd,
    variacaoValorJustoPeriodoDrebBrl: variacaoValorJusto,
    partidasDobrada: partidas,
    diagnosticoCpc29: diag
  });
}
