import { describe, it, expect } from 'vitest';
import {
  processOfficeAnnualTaxPlanningComparativeEngine,
  processOfficeTaxRegimeEnquadramentoReportEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Planejamento Tributário Comparativo Anual 360º', () => {
  it('1. Deve simular simultaneamente os 4 regimes tributarios e identificar o regime mais economico', () => {
    const resPlan = processOfficeAnnualTaxPlanningComparativeEngine({
      clienteCnpj: '11.111.111/0001-11',
      razaoSocial: 'Clínica Médica e Diagnósticos São Paulo Ltda',
      anoExercicio: 2026,
      faturamentoBrutoAnualBrl: 2400000.00,
      folhaPagamentoAnualComEncargosBrl: 800000.00, // Fator R = 33.3% (Anexo III Simples)
      comprasMercadoriasInsumosAnualBrl: 300000.00,
      despesasOperacionaisAnualBrl: 400000.00,
      tipoAtividade: 'SERVICOS_PROFISSIONAIS'
    });

    const dataPlan = unwrap(resPlan);
    expect(dataPlan.anoExercicio).toBe(2026);
    expect(dataPlan.cenarioSimplesNacional.totalTributosAnuaisBrl).toBe(288000.00); // 12%
    expect(dataPlan.cenarioLucroPresumido.totalTributosAnuaisBrl).toBe(572000.00); // (14.5% de 2.4M) + 28% de 800k
    expect(dataPlan.regimeMaisEconomico).toBe('SIMPLES_NACIONAL');
    expect(dataPlan.economiaAnualProjetadaBrl).toBeGreaterThan(100000.00);
    expect(dataPlan.statusPlanejamento).toBe('PLANEJAMENTO_TRIBUTARIO_360_CONCLUIDO');
    expect(dataPlan.diagnosticoPlanejamento).toContain('Melhor Regime');
  });

  it('2. Deve emitir parecer formal de enquadramento tributario assinado com CRC do contador', () => {
    const resRep = processOfficeTaxRegimeEnquadramentoReportEngine({
      clienteCnpj: '22.222.222/0001-22',
      razaoSocial: 'Distribuidora de Alimentos União Ltda',
      nomeContadorResponsavel: 'Dr. Roberto Auditor Contábil',
      crcContador: '1SP123456/O-0',
      regimeRecomendado: 'LUCRO_REAL',
      economiaAnualProjetadaBrl: 185400.00
    });

    const dataRep = unwrap(resRep);
    expect(dataRep.dossieParecerPdfPronto).toBe(true);
    expect(dataRep.parecerTextoFormatado).toContain('PARECER TÉCNICO DE ENQUADRAMENTO TRIBUTÁRIO');
    expect(dataRep.parecerTextoFormatado).toContain('Dr. Roberto Auditor Contábil');
    expect(dataRep.statusParecer).toBe('PARECER_DE_ENQUADRAMENTO_EMITIDO_COM_SUCESSO');
    expect(dataRep.diagnosticoParecer).toContain('LUCRO_REAL');
  });
});
