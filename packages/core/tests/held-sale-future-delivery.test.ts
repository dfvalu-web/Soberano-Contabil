import { describe, it, expect } from 'vitest';
import {
  evaluateHeldForSaleAndDiscontinuedOperationsCpc31,
  processFutureDeliverySalesEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Ativos Mantidos para Venda (CPC 31) & Venda para Entrega Futura (SINIEF 01/03)', () => {
  it('1. Deve mensurar ativo mantido para venda pelo menor entre VCL e VJ liquido e cessar depreciacao (CPC 31)', () => {
    const res = evaluateHeldForSaleAndDiscontinuedOperationsCpc31({
      ativoId: 'IMOB-FABRIL-01',
      descricaoAtivo: 'Unidade Industrial de Embalagens',
      valorContabilOriginalBrl: 20000000.00,
      depreciacaoAcumuladaBrl: 5000000.00, // VCL = 15.000.000,00
      valorJustoAvaliadoBrl: 14800000.00,
      despesasEstimadasDeVendaBrl: 300000.00, // VJ Líquido = 14.500.000,00 (Perda = 500.000,00)
      operacaoDescontinuada: true,
      lucroLiquidoGeradoPelaUnidadeNoExercicioBrl: 1200000.00
    });

    const data = unwrap(res);
    expect(data.valorContabilLiquidoOriginalBrl).toBe(15000000.00);
    expect(data.valorJustoMenosDespesasDeVendaBrl).toBe(14500000.00);
    expect(data.valorFinalReclassificadoAtivoCirculanteBrl).toBe(14500000.00);
    expect(data.perdaPorDesvalorizacaoImpairmentBrl).toBe(500000.00);
    expect(data.cessouDepreciacao).toBe(true);
    expect(data.operacaoDescontinuadaSegregadaDRE).toBe(true);
    expect(data.partidasDobradaReclassificacao.length).toBe(4);
    expect(data.diagnosticoCpc31).toContain('CPC 31 / IFRS 5');
  });

  it('2. Deve processar Simples Faturamento e Remessa Efetiva em Venda para Entrega Futura (Ajuste SINIEF 01/2003)', () => {
    // 2.1 Simples Faturamento (CFOP 5.922 - Sem tributos estaduais)
    const resFat = processFutureDeliverySalesEngine({
      vendaId: 'VND-FUTURA-01',
      etapa: 'SIMPLES_FATURAMENTO',
      clienteNome: 'Indústrias Metalúrgicas do Sul S.A.',
      valorTotalMercadoriaBrl: 1000000.00,
      aliquotaIcmsPercent: 18,
      aliquotaIpiPercent: 10,
      aliquotaPisPercent: 1.65,
      aliquotaCofinsPercent: 7.60
    });

    const dataFat = unwrap(resFat);
    expect(dataFat.cfopUtilizado).toBe('5.922');
    expect(dataFat.tributosDestacados.icmsDestacadoBrl).toBe(0);
    expect(dataFat.tributosDestacados.ipiDestacadoBrl).toBe(0);
    expect(dataFat.partidasDobradaFaturamento.length).toBe(2);
    expect(dataFat.diagnosticoSinief).toContain('Simples Faturamento (CFOP 5.922)');

    // 2.2 Remessa Efetiva de Entrega (CFOP 5.116 - Com destaque integral de tributos e baixa de CPV)
    const resRem = processFutureDeliverySalesEngine({
      vendaId: 'VND-FUTURA-01',
      etapa: 'REMESSA_EFETIVA_ENTREGA',
      clienteNome: 'Indústrias Metalúrgicas do Sul S.A.',
      valorTotalMercadoriaBrl: 1000000.00,
      aliquotaIcmsPercent: 18, // 180k
      aliquotaIpiPercent: 10,  // 100k
      aliquotaPisPercent: 1.65, // 16.5k
      aliquotaCofinsPercent: 7.60, // 76k
      custoDasMercadoriasVendidasBrl: 600000.00 // CPV 600k
    });

    const dataRem = unwrap(resRem);
    expect(dataRem.cfopUtilizado).toBe('5.116');
    expect(dataRem.tributosDestacados.icmsDestacadoBrl).toBe(180000.00);
    expect(dataRem.tributosDestacados.ipiDestacadoBrl).toBe(100000.00);
    expect(dataRem.tributosDestacados.pisDevidoBrl).toBe(165000.00 / 10);
    expect(dataRem.tributosDestacados.cofinsDevidoBrl).toBe(76000.00);
    expect(dataRem.partidasDobradaFaturamento.length).toBe(4);
    expect(dataRem.diagnosticoSinief).toContain('Remessa Efetiva (CFOP 5.116)');
  });
});
