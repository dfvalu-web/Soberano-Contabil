import { describe, it, expect } from 'vitest';
import {
  processNdfForexHedgeAccountingCpc48,
  processIbsCbsSplitPaymentBankingEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: NDF Hedge Cambial (CPC 48) & Split Payment IBS/CBS (Reforma EC 132/23)', () => {
  it('1. Deve contabilizar NDF com Hedge Accounting no PL/DRA (98% de eficacia) e ineficacia na DRE conforme CPC 48', () => {
    const resNdf = processNdfForexHedgeAccountingCpc48({
      contratoId: 'NDF-USD-2026-001',
      nocionalUsd: 1000000, // US$ 1M
      taxaTermoContratadaBrl: 5.20,
      taxaSpotFechamentoBrl: 5.45,
      taxaTermoAtualBrl: 5.50,
      objetoProtegido: 'IMPORTACAO_MAQUINAS_PREVISTA',
      efetividadeHedgePercent: 98
    });

    const dataNdf = unwrap(resNdf);
    expect(dataNdf.valorJustoTotalNdfBrl).toBe(300000.00); // (5.50 - 5.20) * 1M = R$ 300k
    expect(dataNdf.parcelaEfetivaPlDraBrl).toBe(294000.00); // 98% * 300k
    expect(dataNdf.parcelaInefetivaDreBrl).toBe(6000.00); // 2% * 300k
    expect(dataNdf.statusEficaciaHedge).toBe('HEDGE_ALTAMENTE_EFICAZ_CPC48');
    expect(dataNdf.diagnosticoCpc48).toContain('Ganho Justo: R$ 300000.00 (PL/DRA: R$ 294000.00 | Ineficacia DRE: R$ 6000.00)');
  });

  it('2. Deve apurar Split Payment instantaneo no BACEN Pix segregando liquido ao fornecedor e retencao IBS/CBS', () => {
    const resSplit = processIbsCbsSplitPaymentBankingEngine({
      chaveAcessoNfe: '35260400000000000191550010000000011000000018',
      valorTotalFaturaBrl: 100000.00,
      aliquotaIbsPercent: 17.5, // 17.5%
      aliquotaCbsPercent: 8.8, // 8.8%
      chavePixDestinatario: 'financeiro@fornecedor.com.br'
    });

    const dataSplit = unwrap(resSplit);
    expect(dataSplit.valorTotalFaturaBrl).toBe(100000.00);
    expect(dataSplit.retencaoIbsComiteGestorBrl).toBe(17500.00);
    expect(dataSplit.retencaoCbsReceitaFederalBrl).toBe(8800.00);
    expect(dataSplit.totalTributosRetidosSplitBrl).toBe(26300.00);
    expect(dataSplit.valorLiquidoFornecedorBrl).toBe(73700.00);
    expect(dataSplit.creditoFinanceiroImediatoAdquirenteBrl).toBe(26300.00);
    expect(dataSplit.statusSplitPayment).toBe('SPLIT_LIQUIDADO_INSTANTANEAMENTE_BACEN');
    expect(dataSplit.diagnosticoSplitPayment).toContain('Credito Financeiro Adquirente: R$ 26300.00 liberado instantaneamente');
  });
});
