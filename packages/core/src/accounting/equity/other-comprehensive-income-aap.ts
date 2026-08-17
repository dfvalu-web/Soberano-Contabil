import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export interface ComprehensiveIncomeInput {
  empresaId: string;
  anoExercicio: number;
  variacaoCambialInvestimentoExteriorBrl: number; // CPC 02
  variacaoValorJustoHedgeFluxoCaixaBrl: number; // CPC 48
  ganhoOuPerdaAtuarialPrevidenciaBrl: number; // CPC 33
  aliquotaTributosDiferidosPercent: number; // 34% (IRPJ 25% + CSLL 9%)
  reciclagemParaResultadoRealizadaBrl?: number; // Reclassificação para DRE
}

export interface ComprehensiveIncomeResult {
  empresaId: string;
  anoExercicio: number;
  totalAapBrutoNoPlBrl: number;
  tributosDiferidosSobreAap34PercentBrl: number;
  totalAapLiquidoTributosNoPlBrl: number;
  valorRecicladoParaResultadoDREBrl: number;
  partidasDobradaAap: JournalEntryLine[];
  diagnosticoCpc26: string;
}

export function calculateOtherComprehensiveIncomeAapCpc26(input: ComprehensiveIncomeInput): Result<ComprehensiveIncomeResult, Error> {
  const {
    empresaId,
    anoExercicio,
    variacaoCambialInvestimentoExteriorBrl,
    variacaoValorJustoHedgeFluxoCaixaBrl,
    ganhoOuPerdaAtuarialPrevidenciaBrl,
    aliquotaTributosDiferidosPercent,
    reciclagemParaResultadoRealizadaBrl = 0
  } = input;

  const totalBruto = Number((variacaoCambialInvestimentoExteriorBrl + variacaoValorJustoHedgeFluxoCaixaBrl + ganhoOuPerdaAtuarialPrevidenciaBrl).toFixed(2));
  const tributosDiferidos = Number((totalBruto * (aliquotaTributosDiferidosPercent / 100)).toFixed(2));
  const totalLiquido = Number((totalBruto - tributosDiferidos).toFixed(2));

  const partidas: JournalEntryLine[] = [];

  // Lançamento do AAP Bruto no PL (Outros Resultados Abrangentes)
  partidas.push({
    accountId: '2.4.3.01',
    accountCode: '2.4.3.01',
    accountName: 'Ajustes de Avaliação Patrimonial - AAP Bruto (PL - CPC 26 / CPC 48)',
    type: totalBruto >= 0 ? 'CREDIT' : 'DEBIT',
    amount: Math.abs(totalBruto)
  });

  // Provisão de Tributos Diferidos sobre o AAP (CPC 32)
  if (tributosDiferidos !== 0) {
    partidas.push({
      accountId: '2.4.3.99',
      accountCode: '2.4.3.99',
      accountName: 'Tributos Diferidos sobre AAP (PL - CPC 26 / CPC 32)',
      type: tributosDiferidos > 0 ? 'DEBIT' : 'CREDIT',
      amount: Math.abs(tributosDiferidos)
    });
    partidas.push({
      accountId: '2.2.2.05',
      accountCode: '2.2.2.05',
      accountName: 'Passivo Fiscal Diferido s/ AAP (Passivo Não Circulante - CPC 32)',
      type: tributosDiferidos > 0 ? 'CREDIT' : 'DEBIT',
      amount: Math.abs(tributosDiferidos)
    });
  }

  // Reciclagem para o DRE (se houver)
  if (reciclagemParaResultadoRealizadaBrl !== 0) {
    partidas.push({
      accountId: '2.4.3.01',
      accountCode: '2.4.3.01',
      accountName: 'Ajustes de Avaliação Patrimonial - Reciclagem (PL - CPC 26)',
      type: 'DEBIT',
      amount: Math.abs(reciclagemParaResultadoRealizadaBrl)
    });
    partidas.push({
      accountId: '3.1.4.05',
      accountCode: '3.1.4.05',
      accountName: 'Ganho/Perda Realizado de AAP Reciclado (Resultado/DRE - CPC 26)',
      type: 'CREDIT',
      amount: Math.abs(reciclagemParaResultadoRealizadaBrl)
    });
  }

  const diag = 'CPC 26 (R1) / IAS 1: Demonstração do Resultado Abrangente (DRA). AAP Bruto de R$ ' + totalBruto.toFixed(2) + ' (Forex: R$ ' + variacaoCambialInvestimentoExteriorBrl.toFixed(2) + ', Hedge: R$ ' + variacaoValorJustoHedgeFluxoCaixaBrl.toFixed(2) + ', Atuarial: R$ ' + ganhoOuPerdaAtuarialPrevidenciaBrl.toFixed(2) + '). Tributos diferidos (' + aliquotaTributosDiferidosPercent + '%): R$ ' + tributosDiferidos.toFixed(2) + '. AAP Líquido no PL: R$ ' + totalLiquido.toFixed(2) + '.' + (reciclagemParaResultadoRealizadaBrl > 0 ? ' Reciclado para o DRE: R$ ' + reciclagemParaResultadoRealizadaBrl.toFixed(2) + '.' : '');

  return Ok({
    empresaId,
    anoExercicio,
    totalAapBrutoNoPlBrl: totalBruto,
    tributosDiferidosSobreAap34PercentBrl: tributosDiferidos,
    totalAapLiquidoTributosNoPlBrl: totalLiquido,
    valorRecicladoParaResultadoDREBrl: reciclagemParaResultadoRealizadaBrl,
    partidasDobradaAap: partidas,
    diagnosticoCpc26: diag
  });
}
