import { describe, it, expect } from 'vitest';
import {
  processFidcReceivablesSecuritizationDerecognitionCpc48,
  processCprRuralProductNoteTaxEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Securitização em FIDCs (CPC 48) & CPR Agro e Verde (Lei 13.986/20)', () => {
  it('1. Deve desreconhecer carteira cedida a FIDC sem regresso com desagio na DRE conforme CPC 48', () => {
    const resFidc = processFidcReceivablesSecuritizationDerecognitionCpc48({
      operacaoId: 'FIDC-SEC-2026-001',
      fidcNome: 'Soberano Credit Rights FIDC Multissetorial',
      modalidade: 'CESSAO_DEFINITIVA_SEM_REGRESSO_DERECOGNITION',
      valorNominalCarteiraCedidaBrl: 10000000.00, // R$ 10M
      taxaDesagioSecuritizacaoPercent: 4.5 // 4.5% = R$ 450k
    });

    const dataFidc = unwrap(resFidc);
    expect(dataFidc.valorNominalCarteiraBrl).toBe(10000000.00);
    expect(dataFidc.despesaDesagioSecuritizacaoDreBrl).toBe(450000.00);
    expect(dataFidc.valorLiquidoRecebidoCaixaBrl).toBe(9550000.00); // 10M - 450k
    expect(dataFidc.statusDesreconhecimentoCpc48).toBe('BAIXA_INTEGRAL_ATIVO_DERECOGNITION');
    expect(dataFidc.lancamentoContabilSugerido.creditoContasReceberClientesAtivoBrl).toBe(10000000.00);
    expect(dataFidc.diagnosticoCpc48).toContain('Status Contabil: BAIXA_INTEGRAL_ATIVO_DERECOGNITION');
  });

  it('2. Deve apurar isencao de IOF e tributacao regressiva de PJ vs isencao de PF em CPR conforme Lei 13.986/20', () => {
    const resCpr = processCprRuralProductNoteTaxEngine({
      numeroCpr: 'CPR-VERDE-2026-MT-881',
      tipoCpr: 'CPR_VERDE_SERVICOS_AMBIENTAIS',
      emitenteCpfCnpj: '12.345.678/0001-90',
      valorNominalEmissaoBrl: 5000000.00, // R$ 5M
      prazoVencimentoDias: 360,
      taxaJurosOuRendimentoAnualPercent: 12.0, // R$ 600k rendimento bruto
      tipoInvestidor: 'PESSOA_JURIDICA' // 20% IRRF para 360 dias
    });

    const dataCpr = unwrap(resCpr);
    expect(dataCpr.rendimentoBrutoResgateBrl).toBe(600000.00);
    expect(dataCpr.aliquotaIofPercent).toBe(0.0); // Isenção de IOF
    expect(dataCpr.aliquotaIrrfPercent).toBe(20.0); // 20% IRRF para PJ em 360 dias
    expect(dataCpr.valorIrrfRetidoFonteBrl).toBe(120000.00); // 20% de R$ 600k
    expect(dataCpr.valorLiquidoResgatadoBrl).toBe(5480000.00); // 5M + 600k - 120k
    expect(dataCpr.statusTributario).toBe('CPR_ISENCAO_IOF_E_TRIBUTACAO_REGRESSIVA_CONFORME');
    expect(dataCpr.diagnosticoCpr).toContain('IOF: 0% (Isencao) | IRRF (PESSOA_JURIDICA - 20%): R$ 120000.00');
  });
});
