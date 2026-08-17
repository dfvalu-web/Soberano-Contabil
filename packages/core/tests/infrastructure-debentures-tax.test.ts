import { describe, it, expect } from 'vitest';
import {
  processInfrastructureDebenturesTaxIncentiveEngine,
  processNonResidentInvestorWithholdingTaxEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Debêntures de Infraestrutura (Lei 14.801/24 & 12.431/11)', () => {
  it('1. Deve apurar exclusao fiscal adicional de 30% dos juros no e-LALUR (Lei 14.801/2024)', () => {
    const resDeb = processInfrastructureDebenturesTaxIncentiveEngine({
      emissoraConcessionariaCnpj: '10.000.000/0001-00',
      setorProjetoPrioritario: 'SANEAMENTO',
      valorEmissaoDebenturesBrl: 100000000.00, // R$ 100M
      taxaJurosAnualEfetivaPercent: 8.50, // 8.5%
      despesaJurosPeriodoBrl: 8500000.00, // R$ 8.5M
      aliquotaIrpjCsllPercent: 34.0
    });

    const dataDeb = unwrap(resDeb);
    expect(dataDeb.despesaJurosContabilDedutivelBrl).toBe(8500000.00);
    expect(dataDeb.exclusaoAdicionalLalurLei14801Brl).toBe(2550000.00); // 30% de R$ 8.5M
    expect(dataDeb.totalDeducaoBaseIrpjCsllBrl).toBe(11050000.00); // 130%
    expect(dataDeb.economiaTributariaAdicionalBrl).toBe(867000.00); // 34% de R$ 2.55M
    expect(dataDeb.statusDebentures).toBe('DEBENTURES_LEI_14801_HOMOLOGADAS_SUPER_DEDUCAO');
    expect(dataDeb.diagnosticoDebentures).toContain('Economia IRPJ/CSLL Extra: R$ 867.000');
  });

  it('2. Deve validar isencao de IRRF (aliquota 0%) para investidor nao residente (Lei 12.431/11)', () => {
    const resInv = processNonResidentInvestorWithholdingTaxEngine({
      investidorEstrangeiroNome: 'Global Infrastructure Pension Fund',
      paisDomicilioFiscal: 'CANADA',
      jurisdicaoParaisoFiscal: false,
      rendimentoJurosRecebidosBrl: 1000000.00 // R$ 1.000.000,00
    });

    const dataInv = unwrap(resInv);
    expect(dataInv.aliquotaIrrfAplicavelPercent).toBe(0.0);
    expect(dataInv.impostoIrrfRetidoBrl).toBe(0.00);
    expect(dataInv.rendimentoLiquidoRemetidoBrl).toBe(1000000.00);
    expect(dataInv.statusIsencao).toBe('ISENCAO_IRRF_NAO_RESIDENTE_LEI_12431');
    expect(dataInv.diagnosticoInvestidor).toContain('IRRF (0%): R$ 0');
  });
});
