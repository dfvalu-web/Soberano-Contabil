import { describe, it, expect } from 'vitest';
import {
  evaluateOnerousContractCpc25,
  processCosmeticsMonophasicTaxEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Contratos Onerosos (CPC 25) & Monofásico de Cosméticos (Lei 10.147/00)', () => {
  it('1. Deve reconhecer provisao de contrato oneroso pela opcao de menor custo entre prejuizo e rescisao (CPC 25 / IAS 37)', () => {
    // 1.1 Menor Custo: Rescisão com Multa (R$ 2.000.000 vs Prejuízo R$ 3.000.000)
    const resOnerosoRescisao = evaluateOnerousContractCpc25({
      contratoId: 'CONT-ONER-01',
      contraparteNome: 'Consórcio Construtor Alpha',
      descricaoContrato: 'Fornecimento de Turbinas e Estruturas Metálicas',
      custosInevitaveisCumprimentoBrl: 8000000.00,
      beneficiosEconomicosEsperadosBrl: 5000000.00, // Prejuízo de 3M
      penalidadeMultaRescisoriaBrl: 2000000.00      // Multa menor (2M)
    });

    const dataRes = unwrap(resOnerosoRescisao);
    expect(dataRes.isContratoOneroso).toBe(true);
    expect(dataRes.prejuizoLiquidoCumprimentoBrl).toBe(3000000.00);
    expect(dataRes.valorProvisaoOnerosaReconhecidaBrl).toBe(2000000.00);
    expect(dataRes.opcaoDeMenorCusto).toBe('RESCISAO_COM_MULTA');
    expect(dataRes.partidasDobradaProvisao.length).toBe(2);
    expect(dataRes.diagnosticoCpc25).toContain('CONTRATO ONEROSO IDENTIFICADO');

    // 1.2 Menor Custo: Cumprimento do Contrato (Prejuízo de 500k vs Multa de 1,5M)
    const resOnerosoCumprimento = evaluateOnerousContractCpc25({
      contratoId: 'CONT-ONER-02',
      contraparteNome: 'Montadora Beta',
      descricaoContrato: 'Fornecimento de Peças Usinadas',
      custosInevitaveisCumprimentoBrl: 2500000.00,
      beneficiosEconomicosEsperadosBrl: 2000000.00, // Prejuízo de 500k
      penalidadeMultaRescisoriaBrl: 1500000.00      // Multa maior (1.5M)
    });

    const dataCump = unwrap(resOnerosoCumprimento);
    expect(dataCump.isContratoOneroso).toBe(true);
    expect(dataCump.valorProvisaoOnerosaReconhecidaBrl).toBe(500000.00);
    expect(dataCump.opcaoDeMenorCusto).toBe('CUMPRIMENTO_DO_CONTRATO');
  });

  it('2. Deve aplicar aliquota concentrada na industria de cosmeticos/equiparados e CST 04 com PIS/COFINS zero em perfumarias (Lei 10.147/00 & Dec. 8.393/15)', () => {
    // 2.1 Indústria / Importador de Cosméticos (PIS 2,20% e COFINS 10,30%)
    const resIndCosm = processCosmeticsMonophasicTaxEngine({
      operacaoId: 'COSM-01',
      segmento: 'FABRICANTE_IMPORTADOR_COSMETICOS',
      categoriaProduto: 'PERFUMARIA_E_FRAGRANCIAS',
      produtoDescricao: 'Perfume Eau de Parfum Floral 100ml',
      valorTotalOperacaoBrl: 300000.00
    });

    const dataInd = unwrap(resIndCosm);
    expect(dataInd.cstPisCofinsUtilizado).toBe('02');
    expect(dataInd.aliquotaPisPercent).toBe(2.20);
    expect(dataInd.aliquotaCofinsPercent).toBe(10.30);
    expect(dataInd.pisMonofasicoDevidoBrl).toBe(6600.00);
    expect(dataInd.cofinsMonofasicoDevidoBrl).toBe(30900.00);
    expect(dataInd.tributacaoVarejoZero).toBe(false);

    // 2.2 Loja de Cosméticos / Perfumaria / Salão de Beleza (Revenda CST 04)
    const resPerfumaria = processCosmeticsMonophasicTaxEngine({
      operacaoId: 'COSM-02',
      segmento: 'VAREJO_PERFUMARIA_DROGARIA_SALAO',
      categoriaProduto: 'MAQUIAGEM_E_COSMETICOS',
      produtoDescricao: 'Batom Líquido Matte Longa Duração',
      valorTotalOperacaoBrl: 25000.00
    });

    const dataPerf = unwrap(resPerfumaria);
    expect(dataPerf.cstPisCofinsUtilizado).toBe('04');
    expect(dataPerf.pisMonofasicoDevidoBrl).toBe(0);
    expect(dataPerf.cofinsMonofasicoDevidoBrl).toBe(0);
    expect(dataPerf.tributacaoVarejoZero).toBe(true);
    expect(dataPerf.diagnosticoFiscal).toContain('CST 04 (Operação Tributável Monofásica - Revenda a Alíquota Zero');
  });
});
