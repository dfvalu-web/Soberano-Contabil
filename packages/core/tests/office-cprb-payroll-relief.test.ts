import { describe, it, expect } from 'vitest';
import {
  processOfficeCprbPayrollReliefEngine,
  processOfficeCprbEsocialReinfAccountingEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Desoneração da Folha (CPRB Lei 12.546/11 e EFD-Reinf R-2060)', () => {
  it('1. Deve apurar desoneracao total da CPRB (2,5% TI) substituindo o INSS Patronal de 20% com economia tributaria', () => {
    const resCprb = processOfficeCprbPayrollReliefEngine({
      empresaCnpj: '11.111.111/0001-11',
      razaoSocial: 'SaaS Software Cloud S/A',
      competenciaMesAno: '2026-08',
      valorFolhaPagamentoBrutaBrl: 200000.00, // INSS 20% normal = 40.000,00
      valorReceitaBrutaDesoneradaBrl: 600000.00,
      valorReceitaBrutaTotalEmpresaBrl: 600000.00,
      aliquotaCprbSetorialPercent: 2.5, // 2.5% de 600k = 15.000,00
      tipoEnquadramento: 'TOTALMENTE_DESONERADA'
    });

    const dataCprb = unwrap(resCprb);
    expect(dataCprb.valorInssPatronalNormal20PercentBrl).toBe(40000.00);
    expect(dataCprb.valorCprbDevidaReceitaBrl).toBe(15000.00);
    expect(dataCprb.valorInssPatronalDevidoAposDesoneracaoBrl).toBe(0.00);
    expect(dataCprb.custoPrevidenciarioTotalFinalBrl).toBe(15000.00);
    expect(dataCprb.economiaTributariaObtidaBrl).toBe(25000.00); // 40k - 15k = 25k economia
    expect(dataCprb.indicativoDesoneracaoEsocial).toBe('1_TOTALMENTE_DESONERADA');
    expect(dataCprb.statusApuracao).toBe('DESONERACAO_CPRB_APURADA_COM_SUCESSO');
    expect(dataCprb.diagnosticoCprb).toContain('Economia Líquida');
  });

  it('2. Deve gerar eventos eSocial S-1280 e EFD-Reinf R-2060 e partidas dobradas de provisao da CPRB', () => {
    const resReinf = processOfficeCprbEsocialReinfAccountingEngine({
      empresaCnpj: '11.111.111/0001-11',
      razaoSocial: 'SaaS Software Cloud S/A',
      codigoAtividadeCprb: '00000010',
      valorReceitaBrutaBrl: 600000.00,
      valorCprbDevidaBrl: 15000.00
    });

    const dataReinf = unwrap(resReinf);
    expect(dataReinf.eventoEsocial).toBe('S-1280_INFORMACOES_COMPLEMENTARES_DESONERACAO');
    expect(dataReinf.eventoEfdReinf).toBe('R-2060_CPRB_CONTRIBUICAO_PREVIDENCIARIA_RECEITA');
    expect(dataReinf.partidaDobradaCprb).toContain('3.1.02.008 Despesas Tributárias - CPRB Desoneração');
    expect(dataReinf.partidaDobradaCprb).toContain('2.1.02.008 CPRB a Recolher');
    expect(dataReinf.statusIntegracao).toBe('CPRB_INTEGRADA_ESOCIAL_REINF_DCTFWEB');
    expect(dataReinf.diagnosticoIntegracao).toContain('DCTFWeb');
  });
});
