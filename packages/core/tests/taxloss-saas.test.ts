import { describe, it, expect } from 'vitest';
import {
  evaluateDeferredTaxLossCarryforwardCpc32,
  processSoftwareSaasTaxEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Ativos Fiscais Diferidos (CPC 32) & Tributação de Software / SaaS (STF)', () => {
  it('1. Deve reconhecer DTA de 34% condicionado a capacidade de absorcao de 30% dos lucros em 10 anos (CPC 32 / IAS 12)', () => {
    const resDTA = evaluateDeferredTaxLossCarryforwardCpc32({
      empresaId: 'HOLDING-01',
      razaoSocial: 'Holding de Tecnologia Brasil S.A.',
      prejuizoFiscalIrpjAcumuladoBrl: 10000000.00,
      baseCalculoNegativaCsllAcumuladaBrl: 10000000.00,
      lucroTributavelProjetado10AnosBrl: 40000000.00 // Absorção máx 30% = 12M -> absorve 100% dos 10M
    });

    const dataDTA = unwrap(resDTA);
    expect(dataDTA.capacidadeAbsorcaoTrava30Brl).toBe(12000000.00);
    expect(dataDTA.ativoFiscalDiferidoIrpj25Brl).toBe(2500000.00); // 25% de 10M
    expect(dataDTA.ativoFiscalDiferidoCsll9Brl).toBe(900000.00);   // 9% de 10M
    expect(dataDTA.totalAtivoFiscalDiferidoReconhecidoBrl).toBe(3400000.00); // 3.4M DTA
    expect(dataDTA.limitePrejuizoNaoReconhecidoBrl).toBe(0);
    expect(dataDTA.partidasDobradaReconhecimentoDTA.length).toBe(2);
    expect(dataDTA.diagnosticoCpc32).toContain('ATIVO FISCAL DIFERIDO (DTA) RECONHECIDO');
  });

  it('2. Deve confirmar imunidade de ICMS pelo STF, apurar ISSQN exclusivo e PIS/COFINS cumulativo de TI (STF & Lei 10.833/03)', () => {
    // 2.1 SaaS no Lucro Real (Regime Cumulativo Especial de TI: PIS 0,65% e COFINS 3,00%)
    const resSaas = processSoftwareSaasTaxEngine({
      operacaoId: 'SAAS-01',
      empresaNome: 'Cloud Platform Solutions Ltda',
      tipoNegocioSoftware: 'SOFTWARE_AS_A_SERVICE_SAAS',
      regimeTributario: 'LUCRO_REAL',
      faturamentoMensalSoftwareBrl: 1000000.00,
      aliquotaIssqnMunicipalPercent: 3.0
    });

    const dataSaas = unwrap(resSaas);
    expect(dataSaas.imunidadeIcmsConfirmadaSTF).toBe(true);
    expect(dataSaas.valorIssqnDevidoBrl).toBe(30000.00);
    expect(dataSaas.regimePisCofinsAplicado).toBe('CUMULATIVO_ESPECIAL_TI');
    expect(dataSaas.valorPisDevidoBrl).toBe(6500.00);
    expect(dataSaas.valorCofinsDevidoBrl).toBe(30000.00);
    expect(dataSaas.totalTributosDevidosBrl).toBe(66500.00);
    expect(dataSaas.diagnosticoFiscal).toContain('NÃO INCIDE ICMS. Incidência exclusiva de ISSQN');
  });
});
