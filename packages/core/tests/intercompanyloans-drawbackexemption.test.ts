import { describe, it, expect } from 'vitest';
import {
  processIntercompanyLoansArmsLengthCpc05,
  processDrawbackExemptionRestitutionTaxEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Mútuos Intercompany (CPC 05 / IOF / IRRF) & Drawback Isenção (Secex 44/20)', () => {
  it('1. Deve apurar juros arm length, IOF Mutuo PJ e IRRF regressivo de 20% (360 dias) conforme CPC 05', () => {
    const resLoan = processIntercompanyLoansArmsLengthCpc05({
      contratoId: 'MUT-INTER-2026-01',
      mutuanteCnpj: '11.111.111/0001-11',
      mutuariaCnpj: '22.222.222/0001-22',
      valorPrincipalBrl: 5000000.00, // R$ 5M
      prazoDias: 360,
      taxaJurosAnualPercent: 11.5 // 11.5% a.a.
    });

    const dataLoan = unwrap(resLoan);
    expect(dataLoan.valorPrincipalBrl).toBe(5000000.00);
    expect(dataLoan.rendimentoJurosBrutoBrl).toBe(575000.00);
    expect(dataLoan.aliquotaIofPercent).toBe(1.856); // (360 * 0.0041) + 0.38 = 1.476 + 0.38 = 1.856%
    expect(dataLoan.valorIofRetidoBrl).toBe(92800.00); // 1.856% de R$ 5M = 92.800
    expect(dataLoan.aliquotaIrrfRegressivaPercent).toBe(20.0); // 181 a 360 dias = 20%
    expect(dataLoan.valorIrrfRetidoFonteBrl).toBe(115000.00); // 20% de R$ 575k
    expect(dataLoan.rendimentoLiquidoRecebidoBrl).toBe(460000.00); // 575k - 115k
    expect(dataLoan.statusConformidadeCpc05).toBe('TRANSACAO_ARMS_LENGTH_COMPLIANT');
    expect(dataLoan.diagnosticoCpc05).toContain("Mutuo Intercompany Arm's Length (CPC 05)");
  });

  it('2. Deve apurar desoneracao total de II, IPI, PIS/COFINS e ICMS no Drawback Isencao conforme Portaria Secex 44/20', () => {
    const resDrawback = processDrawbackExemptionRestitutionTaxEngine({
      numeroAtoConcursorio: '20260001928',
      cnpjExportador: '12.345.678/0001-90',
      valorInsumosImportacaoCifBrl: 3000000.00, // R$ 3M
      aliquotaImpostoImportacaoPercent: 14.0, // 14% II = R$ 420k
      aliquotaIpiPercent: 10.0, // 10% IPI sobre (3M + 420k) = R$ 342k
      aliquotaPisCofinsImportacaoPercent: 9.65, // 9.65% PIS/COFINS = R$ 289.5k
      aliquotaIcmsImportacaoPercent: 18.0 // 18% ICMS = R$ 540k
    });

    const dataDrawback = unwrap(resDrawback);
    expect(dataDrawback.economiaImpostoImportacaoBrl).toBe(420000.00);
    expect(dataDrawback.economiaIpiImportacaoBrl).toBe(342000.00);
    expect(dataDrawback.economiaPisCofinsImportacaoBrl).toBe(289500.00);
    expect(dataDrawback.economiaIcmsImportacaoBrl).toBe(540000.00);
    expect(dataDrawback.totalDesoneracaoTributariaDrawbackBrl).toBe(1591500.00);
    expect(dataDrawback.statusSiscomex).toBe('ATO_CONCESSORIO_DEFERIDO_REPOSICAO_ESTOQUE');
    expect(dataDrawback.diagnosticoDrawback).toContain('Desoneracao Total: R$ 1591500.00 no Siscomex');
  });
});
