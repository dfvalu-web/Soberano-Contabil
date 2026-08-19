import { describe, it, expect } from 'vitest';
import {
  processOfficeTaxCreditRecoveryEngine,
  processOfficePerdcompCompensationBatchEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Recuperação de Créditos Tributários & PER/DCOMP Web', () => {
  it('1. Deve diagnosticar creditos monofasicos PIS/COFINS e Exclusao ICMS Tema 69 STF', () => {
    const resDiag = processOfficeTaxCreditRecoveryEngine({
      clienteCnpj: '11.111.111/0001-11',
      razaoSocial: 'Drogaria & Perfumaria Santa Luzia Ltda',
      regimeTributario: 'SIMPLES_NACIONAL',
      historicoMeses60: [
        {
          mesCompetencia: '2024-01',
          faturamentoBrutoTotalBrl: 100000.00,
          faturamentoItensMonofasicosBrl: 60000.00,
          aliquotaSimplesOuPisCofinsPercent: 3.5, // 60k * 3.5% = 2.100
          icmsDestacadoExcluirBaseBrl: 0,
          aliquotaPisCofinsRealPresumidoPercent: 0
        },
        {
          mesCompetencia: '2024-02',
          faturamentoBrutoTotalBrl: 120000.00,
          faturamentoItensMonofasicosBrl: 70000.00,
          aliquotaSimplesOuPisCofinsPercent: 3.5, // 70k * 3.5% = 2.450
          icmsDestacadoExcluirBaseBrl: 0,
          aliquotaPisCofinsRealPresumidoPercent: 0
        }
      ]
    });

    const dataDiag = unwrap(resDiag);
    expect(dataDiag.totalMesesAuditados).toBe(2);
    expect(dataDiag.totalCreditoMonofasicoPrincipalBrl).toBe(4550.00); // 2100 + 2450
    expect(dataDiag.totalCreditoPrincipalRecuperavelBrl).toBe(4550.00);
    expect(dataDiag.statusDiagnostico).toBe('DIAGNOSTICO_FISCAL_CREDITOS_APURADO_COM_SUCESSO');
    expect(dataDiag.diagnosticoFiscal).toContain('Total Principal: R$ 4.550');
  });

  it('2. Deve gerar lote PER/DCOMP Web com correcao SELIC e honorarios de exito do escritorio', () => {
    const resPerd = processOfficePerdcompCompensationBatchEngine({
      clienteCnpj: '22.222.222/0001-22',
      razaoSocial: 'Auto Peças & Distribuição Nacional S/A',
      valorCreditoPrincipalBrl: 100000.00,
      taxaSelicAcumuladaMediaPercent: 20.0, // 20k SELIC -> Total 120k
      percentualHonorariosEscritorioPercent: 20.0 // 20% de 120k = 24k
    });

    const dataPerd = unwrap(resPerd);
    expect(dataPerd.valorCreditoPrincipalBrl).toBe(100000.00);
    expect(dataPerd.valorCorrecaoSelicBrl).toBe(20000.00);
    expect(dataPerd.valorTotalLiquidoRestituivelBrl).toBe(120000.00);
    expect(dataPerd.honorariosExitoEscritorioBrl).toBe(24000.00);
    expect(dataPerd.statusPerdcomp).toBe('LOTE_PERDCOMP_WEB_PRONTO_PARA_TRANSMISSAO');
    expect(dataPerd.diagnosticoPerdcomp).toContain('Honorários de Êxito do Escritório: R$ 24.000');
  });
});
