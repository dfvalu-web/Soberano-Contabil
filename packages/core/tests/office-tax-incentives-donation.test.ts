import { describe, it, expect } from 'vitest';
import {
  processOfficeTaxIncentivesDonationEngine,
  processOfficeEcfLalurDonationAccountingEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Incentivos Fiscais & Doações Dedutíveis no Lucro Real (Art. 600 RIR/18 e ECF)', () => {
  it('1. Deve apurar doacoes para FIA, Idoso e Rouanet respeitando o limite global de 4% do IRPJ devido (15%)', () => {
    const resInc = processOfficeTaxIncentivesDonationEngine({
      empresaCnpj: '11.111.111/0001-11',
      razaoSocial: 'Companhia Siderúrgica Nacional S/A',
      exercicioAno: 2026,
      valorIrpjDevidoAliquota15Brl: 1000000.00, // Teto 4% = 40.000,00
      doacoesFiaCriancaBrl: 10000.00, // 1% = 10k (OK)
      doacoesFundoIdosoBrl: 10000.00, // 1% = 10k (OK)
      patrociniosLeiEsporteBrl: 0,
      patrociniosLeiRouanetBrl: 20000.00 // 20k (OK - total soma 40k)
    });

    const dataInc = unwrap(resInc);
    expect(dataInc.limiteGlobalMaximo4PercentBrl).toBe(40000.00);
    expect(dataInc.totalDoacoesEfetuadasBrl).toBe(40000.00);
    expect(dataInc.totalDoacoesAproveitadasDedutivelBrl).toBe(40000.00);
    expect(dataInc.excessoNaoDedutivelBrl).toBe(0.00);
    expect(dataInc.saldoIrpjARecolherAposIncentivosBrl).toBe(960000.00); // 1M - 40k
    expect(dataInc.statusApuracao).toBe('INCENTIVOS_FISCAIS_APURADOS_COM_SUCESSO');
    expect(dataInc.diagnosticoIncentivos).toContain('Teto 4%');
  });

  it('2. Deve gerar registros de adicao no LALUR (M300) e abatimento direto de IRPJ na ECF (N620)', () => {
    const resEcf = processOfficeEcfLalurDonationAccountingEngine({
      empresaCnpj: '11.111.111/0001-11',
      razaoSocial: 'Companhia Siderúrgica Nacional S/A',
      valorTotalDoacoesDREBrl: 40000.00,
      valorDeducaoDiretaIrpjBrl: 40000.00
    });

    const dataEcf = unwrap(resEcf);
    expect(dataEcf.adicaoLalurRegistroM300).toContain('ECF Bloco M300');
    expect(dataEcf.deducaoEcfRegistroN620).toContain('ECF Bloco N620');
    expect(dataEcf.partidaDobradaProvisaoDespesa).toContain('3.2.03.001 Despesas com Doações e Patrocínios Incentivados');
    expect(dataEcf.partidaDobradaCompensacaoIrpj).toContain('2.1.02.001 IRPJ a Recolher');
    expect(dataEcf.statusEscrituracao).toBe('DOACOES_LALUR_ECF_ESCRITURADAS');
    expect(dataEcf.diagnosticoEcf).toContain('R$ 40.000,00');
  });
});
