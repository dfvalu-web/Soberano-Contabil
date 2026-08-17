import { describe, it, expect } from 'vitest';
import {
  executeAdvancedConsolidationCpc36,
  processConsignmentOperation,
  unwrap
} from '../src/index.js';

describe('TESTES: Consolidação Avançada CPC 36 & Consignação Mercantil/Industrial (RICMS)', () => {
  it('1. Deve eliminar mútuos, vendas internas, lucros não realizados e calcular NCI (CPC 36 R3 / IFRS 10)', () => {
    const res = executeAdvancedConsolidationCpc36({
      grupoEconomicoId: 'GRUPO-INDUSTRIAL-01',
      nomeGrupo: 'Holding Industrial Alpha S.A.',
      percentualParticipacaoControladora: 80, // NCI = 20%
      mutuoAtivoControladoraBrl: 4000000.00,
      mutuoPassivoControladaBrl: 4000000.00,
      vendasIntercompanyAnoBrl: 10000000.00,
      lucroNaoRealizadoEstoquesFinaisBrl: 500000.00,
      patrimonioLiquidoControladaBrl: 20000000.00, // 20% NCI = 4.000.000,00
      lucroLiquidoControladaExercicioBrl: 3000000.00 // 20% NCI = 600.000,00
    });

    const data = unwrap(res);
    expect(data.percentualControladora).toBe(80);
    expect(data.percentualNciNaoControladores).toBe(20);
    expect(data.totalEliminacoesMutuosBrl).toBe(4000000.00);
    expect(data.totalEliminacoesVendasInternasBrl).toBe(10000000.00);
    expect(data.lucroNaoRealizadoEliminadoEstoqueBrl).toBe(500000.00);
    expect(data.saldoNciNoPatrimonioLiquidoConsolidadoBrl).toBe(4000000.00);
    expect(data.parcelaNciNoResultadoConsolidadoBrl).toBe(600000.00);
    expect(data.partidasDobradaConsolidacao.length).toBe(6);
    expect(data.diagnosticoCpc36).toContain('Consolidação de Holding Industrial Alpha S.A.');
  });

  it('2. Deve processar remessa, venda efetiva e devolução em Consignação Mercantil (RICMS / RIPI)', () => {
    // 2.1 Remessa em Consignação (CFOP 5.917 com ICMS/IPI)
    const resRem = processConsignmentOperation({
      operacaoId: 'CONSIGN-01',
      etapa: 'REMESSA_EM_CONSIGNACAO',
      clienteConsignatarioNome: 'Rede Varejista Magazine Delta S.A.',
      valorMercadoriasBrl: 1500000.00,
      aliquotaIcmsPercent: 18, // 270k
      aliquotaIpiPercent: 10,  // 150k
      aliquotaPisPercent: 1.65,
      aliquotaCofinsPercent: 7.60,
      custoEstoqueBrl: 900000.00
    });

    const dataRem = unwrap(resRem);
    expect(dataRem.cfopUtilizado).toBe('5.917');
    expect(dataRem.tributosDestacados.icmsDestacadoBrl).toBe(270000.00);
    expect(dataRem.tributosDestacados.ipiDestacadoBrl).toBe(150000.00);
    expect(dataRem.tributosDestacados.pisDevidoBrl).toBe(0); // Sem PIS/COFINS na remessa
    expect(dataRem.partidasDobradaConsignacao.length).toBe(2);

    // 2.2 Venda Efetiva de Mercadoria Consignada (CFOP 5.115 com PIS/COFINS)
    const resVnd = processConsignmentOperation({
      operacaoId: 'CONSIGN-01',
      etapa: 'VENDA_EFETIVA_MERCADORIA_CONSIGNADA',
      clienteConsignatarioNome: 'Rede Varejista Magazine Delta S.A.',
      valorMercadoriasBrl: 800000.00,
      aliquotaIcmsPercent: 18,
      aliquotaIpiPercent: 10,
      aliquotaPisPercent: 1.65,  // 13.200,00
      aliquotaCofinsPercent: 7.60, // 60.800,00
      custoEstoqueBrl: 480000.00
    });

    const dataVnd = unwrap(resVnd);
    expect(dataVnd.cfopUtilizado).toBe('5.115');
    expect(dataVnd.tributosDestacados.icmsDestacadoBrl).toBe(0);
    expect(dataVnd.tributosDestacados.pisDevidoBrl).toBe(13200.00);
    expect(dataVnd.tributosDestacados.cofinsDevidoBrl).toBe(60800.00);
    expect(dataVnd.partidasDobradaConsignacao.length).toBe(4);
    expect(dataVnd.diagnosticoConsignacao).toContain('Venda Definitiva (CFOP 5.115)');
  });
});
