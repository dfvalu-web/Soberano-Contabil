import { describe, it, expect } from 'vitest';
import {
  processOfficeInventoryBlockHKAuditEngine,
  processOfficeInventorySpoilageTaxAdjustmentEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Estoques & Inventário SPED (Bloco H / Bloco K & CPC 16)', () => {
  it('1. Deve auditar consistencia entre Bloco H010, Bloco K200 e Balanco Patrimonial', () => {
    const resInv = processOfficeInventoryBlockHKAuditEngine({
      clienteCnpj: '11.111.111/0001-11',
      razaoSocial: 'Distribuidora Paulista de Autopeças S/A',
      anoExercicio: 2025,
      totalItensInventariadosH010Count: 1500,
      valorTotalEstoqueBlocoHBrl: 1200000.00,
      valorTotalEstoqueBlocoKBrl: 1200000.00,
      valorEstoqueBalancoContabilBrl: 1200000.00
    });

    const dataInv = unwrap(resInv);
    expect(dataInv.totalItensInventariadosH010Count).toBe(1500);
    expect(dataInv.divergenciaBlocoHVsBlocoKBrl).toBe(0.00);
    expect(dataInv.divergenciaBlocoHVsContabilBrl).toBe(0.00);
    expect(dataInv.statusConsistenciaEstoque).toBe('ESTOQUE_100_PORCENTO_CONCILIADO');
    expect(dataInv.diagnosticoEstoque).toContain('ESTOQUE_100_PORCENTO_CONCILIADO');
  });

  it('2. Deve calcular estorno tributario (ICMS e PIS/COFINS) e gerar lancamento contabil de perdas CFOP 5.927', () => {
    const resSpoil = processOfficeInventorySpoilageTaxAdjustmentEngine({
      clienteCnpj: '22.222.222/0001-22',
      razaoSocial: 'Indústria Química Horizonte Ltda',
      valorCustoPerdasDeterioracaoBrl: 50000.00,
      aliquotaIcmsEstornoPercent: 18.0,
      aliquotaPisCofinsEstornoPercent: 9.25,
      emiteNfeAjusteCfop5927: true
    });

    const dataSpoil = unwrap(resSpoil);
    expect(dataSpoil.valorCustoPerdasDeterioracaoBrl).toBe(50000.00);
    expect(dataSpoil.valorIcmsEstornadoBrl).toBe(9000.00); // 18% de 50k
    expect(dataSpoil.valorPisCofinsEstornadoBrl).toBe(4625.00); // 9.25% de 50k
    expect(dataSpoil.totalTributosEstornadosBrl).toBe(13625.00);
    expect(dataSpoil.lancamentoContabilPerdaGerado).toContain('3.1.04.001 Perdas por Perecimento');
    expect(dataSpoil.statusAjuste).toBe('AJUSTE_QUEBRAS_ESTORNO_TRIBUTARIO_CONCLUIDO');
    expect(dataSpoil.diagnosticoAjuste).toContain('CFOP 5.927 emitida: SIM');
  });
});
