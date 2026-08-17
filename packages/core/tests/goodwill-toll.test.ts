import { describe, it, expect } from 'vitest';
import {
  evaluateBusinessCombinationAndGoodwillCpc15,
  processTollManufacturingOperation,
  unwrap
} from '../src/index.js';

describe('TESTES: Goodwill & Combinação de Negócios (CPC 15) & Industrialização por Encomenda (RICMS)', () => {
  it('1. Deve alocar o preco de compra (PPA), apurar tributos diferidos e mensurar Goodwill (CPC 15 R1 / IFRS 3)', () => {
    const res = evaluateBusinessCombinationAndGoodwillCpc15({
      transacaoId: 'MA-AQUISICAO-01',
      adquirenteNome: 'Grupo Soberano S.A.',
      adquiridaNome: 'Tech Inovação Ltda',
      contraprestacaoCaixaBrl: 30000000.00,
      contraprestacaoAcoesEmitidasValorJustoBrl: 15000000.00,
      contraprestacaoContingenteEarnOutValorJustoBrl: 5000000.00, // Custo Total = 50M
      patrimonioLiquidoContabilAdquiridaBrl: 20000000.00,
      maisValiaImobilizadoValorJustoBrl: 10000000.00,
      ativosIntangiveisIdentificadosValorJustoBrl: 5000000.00, // Mais-valia total = 15M -> PFD 34% = 5.1M
      passivosContingentesAssumidosValorJustoBrl: 2000000.00,
      aliquotaTributosDiferidosPercent: 34
    });

    const data = unwrap(res);
    expect(data.custoTotalAquisicaoBrl).toBe(50000000.00);
    expect(data.tributosDiferidosPassivosMaisValiaBrl).toBe(5100000.00); // 34% de 15M
    // Ativos Líquidos a Valor Justo = 20M + 10M + 5M - 2M - 5.1M = 27.9M
    expect(data.ativosLiquidosIdentificaveisValorJustoBrl).toBe(27900000.00);
    // Goodwill = 50M - 27.9M = 22.1M
    expect(data.goodwillPorExpectativaRentabilidadeFuturaBrl).toBe(22100000.00);
    expect(data.ganhoPorCompraVantajosaBargainPurchaseBrl).toBe(0);
    expect(data.partidasDobradaCombinacaoNegocios.length).toBe(7);
    expect(data.diagnosticoCpc15).toContain('Goodwill reconhecido no Ativo Intangível');
  });

  it('2. Deve processar remessa, retorno e faturamento de servicos em Industrializacao por Encomenda (RICMS 402)', () => {
    // 2.1 Remessa de Insumos (CFOP 5.901 com suspensão)
    const resRem = processTollManufacturingOperation({
      ordemId: 'IND-ORDEM-01',
      etapa: 'REMESSA_PARA_INDUSTRIALIZACAO',
      encomendanteNome: 'Automotiva Paulista S.A.',
      industrializadorNome: 'Metalúrgica Usinagem Ltda',
      valorInsumosEncomendanteBrl: 2000000.00,
      valorMaoDeObraAplicadaBrl: 0,
      valorInsumosPropriosIndustrializadorBrl: 0,
      aliquotaIcmsInsumosPropriosPercent: 18,
      aliquotaIpiInsumosPropriosPercent: 10,
      aliquotaPisPercent: 1.65,
      aliquotaCofinsPercent: 7.60
    });

    const dataRem = unwrap(resRem);
    expect(dataRem.notasFiscaisEmitidas.nfRetornoInsumos.cfop).toBe('5.901');
    expect(dataRem.notasFiscaisEmitidas.nfRetornoInsumos.icmsSuspensoBrl).toBe(360000.00);
    expect(dataRem.partidasDobradaIndustrializacao.length).toBe(2);

    // 2.2 Retorno e Cobrança de Valor Agregado (CFOP 5.902 e 5.124)
    const resRet = processTollManufacturingOperation({
      ordemId: 'IND-ORDEM-01',
      etapa: 'RETORNO_E_COBRANCA_INDUSTRIALIZACAO',
      encomendanteNome: 'Automotiva Paulista S.A.',
      industrializadorNome: 'Metalúrgica Usinagem Ltda',
      valorInsumosEncomendanteBrl: 2000000.00,
      valorMaoDeObraAplicadaBrl: 300000.00,
      valorInsumosPropriosIndustrializadorBrl: 200000.00, // Total faturado = 500k
      aliquotaIcmsInsumosPropriosPercent: 18, // 36k
      aliquotaIpiInsumosPropriosPercent: 10,  // 20k
      aliquotaPisPercent: 1.65,  // 8.250,00
      aliquotaCofinsPercent: 7.60 // 38.000,00
    });

    const dataRet = unwrap(resRet);
    expect(dataRet.notasFiscaisEmitidas.nfRetornoInsumos.cfop).toBe('5.902');
    expect(dataRet.notasFiscaisEmitidas.nfCobrancaValorAgregado.cfop).toBe('5.124');
    expect(dataRet.notasFiscaisEmitidas.nfCobrancaValorAgregado.valorTotalFaturadoBrl).toBe(500000.00);
    expect(dataRet.notasFiscaisEmitidas.nfCobrancaValorAgregado.icmsDestacadoBrl).toBe(360000.00 / 10);
    expect(dataRet.notasFiscaisEmitidas.nfCobrancaValorAgregado.ipiDestacadoBrl).toBe(200000.00 / 10);
    expect(dataRet.notasFiscaisEmitidas.nfCobrancaValorAgregado.pisDevidoBrl).toBe(8250.00);
    expect(dataRet.notasFiscaisEmitidas.nfCobrancaValorAgregado.cofinsDevidoBrl).toBe(38000.00);
    expect(dataRet.partidasDobradaIndustrializacao.length).toBe(3);
  });
});
