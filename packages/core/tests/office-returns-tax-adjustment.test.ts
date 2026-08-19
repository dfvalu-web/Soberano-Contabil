import { describe, it, expect } from 'vitest';
import {
  processOfficeSalesReturnsTaxCreditEngine,
  processOfficeReturnsAccountingReversalEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Devoluções de Mercadorias & Estornos Tributários (CFOP 1.202 / 5.202 e CPC 47)', () => {
  it('1. Deve auditar NF-e de devolucao de vendas (CFOP 1.202), validar chave referenciada e calcular creditos de ICMS e PIS/COFINS', () => {
    const resRet = processOfficeSalesReturnsTaxCreditEngine({
      empresaCnpj: '11.111.111/0001-11',
      razaoSocial: 'Distribuidora de Alimentos União S/A',
      tipoDevolucao: 'DEVOLUCAO_DE_VENDA',
      cfop: '1.202',
      chaveNfeDevolucao: '35260811111111000111550010000012341234567890',
      chaveNfeReferenciadaOrigem: '35260711111111000111550010000009991234567890', // 44 digitos
      valorMercadoriasDevolvidasBrl: 50000.00,
      aliquotaIcmsPercent: 18.0,
      aliquotaPisCofinsPercent: 9.25
    });

    const dataRet = unwrap(resRet);
    expect(dataRet.chaveReferenciadaValida).toBe(true);
    expect(dataRet.valorCreditoIcmsRecuperavelBrl).toBe(9000.00); // 18% de 50k
    expect(dataRet.valorCreditoPisCofinsRecuperavelBrl).toBe(4625.00); // 9.25% de 50k
    expect(dataRet.totalCreditosTributariosDevolucaoBrl).toBe(13625.00); // 9000 + 4625
    expect(dataRet.registroSpedFiscal).toBe('REGISTRO_C113_REFERENCIADO');
    expect(dataRet.statusDevolucao).toBe('DEVOLUCAO_FISCAL_AUDITADA_COM_SUCESSO');
    expect(dataRet.diagnosticoDevolucao).toContain('CFOP 1.202');
  });

  it('2. Deve gerar partidas dobradas de deducao de receita na DRE e reincorporacao de custo ao estoque / CMV (CPC 47)', () => {
    const resAcc = processOfficeReturnsAccountingReversalEngine({
      empresaCnpj: '11.111.111/0001-11',
      razaoSocial: 'Distribuidora de Alimentos União S/A',
      valorBrutoDevolucaoBrl: 50000.00,
      valorCreditoIcmsBrl: 9000.00,
      valorCreditoPisCofinsBrl: 4625.00,
      custoEstoqueReincorporadoCmvBrl: 30000.00
    });

    const dataAcc = unwrap(resAcc);
    expect(dataAcc.partidaDobradaDevolucaoReceita).toContain('3.1.01.002 Devolução de Vendas');
    expect(dataAcc.partidaDobradaDevolucaoReceita).toContain('1.1.03.002 ICMS a Recuperar');
    expect(dataAcc.partidaDobradaDevolucaoReceita).toContain('1.1.03.003 PIS/COFINS a Recuperar');
    expect(dataAcc.partidaDobradaReincorporacaoEstoqueCmv).toContain('1.1.04.001 Estoques de Mercadorias');
    expect(dataAcc.partidaDobradaReincorporacaoEstoqueCmv).toContain('4.1.01.001 Custo das Mercadorias Vendidas (CMV)');
    expect(dataAcc.statusContabilizacao).toBe('LANCAMENTOS_DEVOLUCAO_CONCLUIDOS');
    expect(dataAcc.diagnosticoContabil).toContain('reincorporação ao estoque');
  });
});
