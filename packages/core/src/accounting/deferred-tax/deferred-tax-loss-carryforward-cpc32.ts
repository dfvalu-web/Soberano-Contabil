import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export interface TaxLossCarryforwardInput {
  empresaId: string;
  razaoSocial: string;
  prejuizoFiscalIrpjAcumuladoBrl: number;
  baseCalculoNegativaCsllAcumuladaBrl: number;
  lucroTributavelProjetado10AnosBrl: number; // Lucro futuro demonstrado em estudo técnico
}

export interface TaxLossCarryforwardResult {
  empresaId: string;
  razaoSocial: string;
  capacidadeAbsorcaoTrava30Brl: number;
  ativoFiscalDiferidoIrpj25Brl: number;
  ativoFiscalDiferidoCsll9Brl: number;
  totalAtivoFiscalDiferidoReconhecidoBrl: number;
  limitePrejuizoNaoReconhecidoBrl: number;
  partidasDobradaReconhecimentoDTA: JournalEntryLine[];
  diagnosticoCpc32: string;
}

export function evaluateDeferredTaxLossCarryforwardCpc32(input: TaxLossCarryforwardInput): Result<TaxLossCarryforwardResult, Error> {
  const {
    empresaId,
    razaoSocial,
    prejuizoFiscalIrpjAcumuladoBrl,
    baseCalculoNegativaCsllAcumuladaBrl,
    lucroTributavelProjetado10AnosBrl
  } = input;

  if (prejuizoFiscalIrpjAcumuladoBrl < 0 || baseCalculoNegativaCsllAcumuladaBrl < 0) {
    return Err(new Error('Prejuízo fiscal e base negativa não podem ser negativos.'));
  }

  // CPC 32 / IAS 12 & IN RFB 1.700/17:
  // A capacidade máxima de compensação em 10 anos é 30% dos lucros futuros projetados (Trava dos 30% da Lei 8.981/95)
  const capacidadeAbsorcao = Number((lucroTributavelProjetado10AnosBrl * 0.30).toFixed(2));

  // O montante de prejuízo reconhecível é o menor entre o acumulado e a capacidade de absorção em 10 anos
  const prejuizoIrpjReconhecido = Math.min(prejuizoFiscalIrpjAcumuladoBrl, capacidadeAbsorcao);
  const baseNegativaCsllReconhecida = Math.min(baseCalculoNegativaCsllAcumuladaBrl, capacidadeAbsorcao);

  // Ativo Fiscal Diferido (DTA): IRPJ (25% = 15% + 10% adicional) e CSLL (9%)
  const dtaIrpj = Number((prejuizoIrpjReconhecido * 0.25).toFixed(2));
  const dtaCsll = Number((baseNegativaCsllReconhecida * 0.09).toFixed(2));
  const totalDTA = Number((dtaIrpj + dtaCsll).toFixed(2));

  const prejuizoNaoReconhecido = Number((Math.max(0, prejuizoFiscalIrpjAcumuladoBrl - prejuizoIrpjReconhecido)).toFixed(2));

  const partidas: JournalEntryLine[] = [];

  if (totalDTA > 0) {
    // D: Ativo Fiscal Diferido sobre Prejuízos Fiscais (Ativo Não Circulante - CPC 32)
    partidas.push({
      accountId: '1.2.4.05',
      accountCode: '1.2.4.05',
      accountName: 'Tributos Diferidos Ativos sobre Prejuízos Fiscais de IRPJ e CSLL (Ativo - CPC 32)',
      type: 'DEBIT',
      amount: totalDTA
    });
    // C: Receita / Crédito de Tributos Diferidos (Resultado - CPC 32)
    partidas.push({
      accountId: '3.1.9.02',
      accountCode: '3.1.9.02',
      accountName: 'Receita com IRPJ e CSLL Diferidos sobre Prejuízos Fiscais (Resultado - CPC 32)',
      type: 'CREDIT',
      amount: totalDTA
    });
  }

  const diag = 'CPC 32 / IAS 12 (Tributos Diferidos sobre Prejuízos Fiscais): ' + razaoSocial + '. Prejuízo IRPJ: R$ ' + prejuizoFiscalIrpjAcumuladoBrl.toFixed(2) + ' e CSLL: R$ ' + baseCalculoNegativaCsllAcumuladaBrl.toFixed(2) + '. Lucro projetado em 10 anos: R$ ' + lucroTributavelProjetado10AnosBrl.toFixed(2) + ' (Capacidade de absorção trava 30%: R$ ' + capacidadeAbsorcao.toFixed(2) + '). ATIVO FISCAL DIFERIDO (DTA) RECONHECIDO: R$ ' + totalDTA.toFixed(2) + ' (IRPJ R$ ' + dtaIrpj.toFixed(2) + ' + CSLL R$ ' + dtaCsll.toFixed(2) + '). Prejuízo não reconhecido por falta de projeção: R$ ' + prejuizoNaoReconhecido.toFixed(2) + '.';

  return Ok({
    empresaId,
    razaoSocial,
    capacidadeAbsorcaoTrava30Brl: capacidadeAbsorcao,
    ativoFiscalDiferidoIrpj25Brl: dtaIrpj,
    ativoFiscalDiferidoCsll9Brl: dtaCsll,
    totalAtivoFiscalDiferidoReconhecidoBrl: totalDTA,
    limitePrejuizoNaoReconhecidoBrl: prejuizoNaoReconhecido,
    partidasDobradaReconhecimentoDTA: partidas,
    diagnosticoCpc32: diag
  });
}
