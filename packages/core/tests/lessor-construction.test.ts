import { describe, it, expect } from 'vitest';
import {
  evaluateLessorFinanceLeaseCpc06,
  processCivilConstructionTaxEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Arrendador CPC 06 R2 & Construção Civil / Retenções (IN RFB 2.110/22)', () => {
  it('1. Deve reconhecer investimento liquido do arrendador, juros a apropriar e receita mes 1 (CPC 06 R2 / IFRS 16)', () => {
    const resLease = evaluateLessorFinanceLeaseCpc06({
      contratoArrendamentoId: 'ARREND-01',
      arrendatarioNome: 'Companhia Logística Integrada S.A.',
      descricaoAtivoSubjacente: 'Frota de Locomotivas Elétricas',
      custoOriginalAtivoBrl: 10000000.00, // Investimento Líquido Inicial = 10M
      prazoMeses: 60,
      taxaJurosImplicitaMensalPercent: 1.0, // 1% a.m.
      valorParcelaMensalBrl: 250000.00 // Total bruto = 15M (Juros = 5M)
    });

    const dataL = unwrap(resLease);
    expect(dataL.investimentoBrutoArrendamentoBrl).toBe(15000000.00);
    expect(dataL.investimentoLiquidoArrendamentoBrl).toBe(10000000.00);
    expect(dataL.receitaFinanceiraNaoApropriadaBrl).toBe(5000000.00);
    expect(dataL.receitaJurosMes1Brl).toBe(100000.00); // 1% sobre 10M
    expect(dataL.partidasDobradaReconhecimentoInicial.length).toBe(3);
    expect(dataL.partidasDobradaApropriacaoMes1.length).toBe(4);
    expect(dataL.diagnosticoCpc06).toContain('Contabilidade do Arrendador');
  });

  it('2. Deve apurar retencao de INSS (3,5% CPRB vs 11%), retencoes federais e deducao de materiais no ISS (IN RFB 2.110/22 & Tema 247)', () => {
    // 2.1 Construtora Optante pela CPRB / Desoneração (INSS Retido a 3,5%) com Dedução de Materiais
    const resCprb = processCivilConstructionTaxEngine({
      notaFiscalServicoId: 'NF-OBRA-01',
      construtoraNome: 'Edificações & Engenharia Pesada S.A.',
      tipoContrato: 'EMPREITADA_TOTAL_COM_FORNECIMENTO_MATERIAIS',
      optanteCprbDesoneracaoFolha: true, // 3,5% INSS
      valorBrutoNotaFiscalBrl: 1000000.00,
      valorMateriaisEquipamentosDeducoesBrl: 400000.00, // Base Mão de Obra e ISS = 600k
      aliquotaIssqnMunicipalPercent: 5.0 // ISS = 30k
    });

    const dataCprb = unwrap(resCprb);
    expect(dataCprb.baseCalculoMaoDeObraBrl).toBe(600000.00);
    expect(dataCprb.aliquotaInssRetencaoPercent).toBe(3.5);
    expect(dataCprb.valorInssRetidoFonteBrl).toBe(21000.00); // 3,5% de 600k
    expect(dataCprb.baseCalculoIssqnDeducoesBrl).toBe(600000.00);
    expect(dataCprb.valorIssqnDevidoBrl).toBe(30000.00); // 5% de 600k
    expect(dataCprb.retencaoPisCofinsCsll465Brl).toBe(46500.00); // 4,65% de 1M
    expect(dataCprb.retencaoIrpj15Brl).toBe(15000.00); // 1,5% de 1M
    expect(dataCprb.valorLiquidoReceberBrl).toBe(917500.00); // 1M - (21k + 46.5k + 15k)
    expect(dataCprb.diagnosticoFiscal).toContain('CPRB Desoneração');

    // 2.2 Construtora Não Optante (INSS Retido a 11%)
    const resRegGeral = processCivilConstructionTaxEngine({
      notaFiscalServicoId: 'NF-OBRA-02',
      construtoraNome: 'Mão de Obra Estrutural Ltda',
      tipoContrato: 'EMPREITADA_PARCIAL_MAO_DE_OBRA',
      optanteCprbDesoneracaoFolha: false, // 11,0% INSS
      valorBrutoNotaFiscalBrl: 100000.00
    });

    const dataGeral = unwrap(resRegGeral);
    expect(dataGeral.aliquotaInssRetencaoPercent).toBe(11.0);
    expect(dataGeral.valorInssRetidoFonteBrl).toBe(11000.00);
  });
});
