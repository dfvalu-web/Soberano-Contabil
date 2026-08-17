import { describe, it, expect } from 'vitest';
import {
  evaluateUncertaintyIncomeTaxTreatmentsIcpc22,
  processColdBeveragesTaxEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Incertezas Fiscais IRPJ/CSLL (ICPC 22) & Regime de Bebidas Frias (Lei 13.097/15)', () => {
  it('1. Deve reconhecer passivo fiscal adicional para posicao improvavel de aceitacao pelo fisco (ICPC 22 / IFRIC 23)', () => {
    // 1.1 Posição Tributária Improvável (< 50% de probabilidade) - Método do Valor Mais Provável
    const resUncertain = evaluateUncertaintyIncomeTaxTreatmentsIcpc22({
      posicaoFiscalId: 'UNCERT-01',
      descricaoTratamentoIncertos: 'Amortização Fiscal de Ágio por Empresa Veículo',
      probabilidadeAceitacaoPeloFiscoPercent: 35.0, // Improvável (< 50%)
      metodoMensuracao: 'VALOR_MAIS_PROVAVEL_SINGLE_MOST_LIKELY',
      cenariosFiscais: [
        { cenarioDescricao: 'Autuação integral de IRPJ/CSLL', valorPassivoExigivelBrl: 10000000.00, probabilidadeOcorrenciaPercent: 70.0 },
        { cenarioDescricao: 'Acordo parcial no CARF', valorPassivoExigivelBrl: 4000000.00, probabilidadeOcorrenciaPercent: 30.0 }
      ]
    });

    const dataUnc = unwrap(resUncertain);
    expect(dataUnc.provavelAceitacaoPeloFisco).toBe(false);
    expect(dataUnc.passivoFiscalAdicionalReconhecidoBrl).toBe(10000000.00);
    expect(dataUnc.partidasDobradaProvisaoFiscal.length).toBe(2);
    expect(dataUnc.diagnosticoIcpc22).toContain('IMPROVÁVEL ACEITAÇÃO');

    // 1.2 Posição Provável (>= 50% de probabilidade) - Passivo Adicional R$ 0,00
    const resProbavel = evaluateUncertaintyIncomeTaxTreatmentsIcpc22({
      posicaoFiscalId: 'UNCERT-02',
      descricaoTratamentoIncertos: 'Dedução de JCP com base em parecer vinculante',
      probabilidadeAceitacaoPeloFiscoPercent: 85.0,
      metodoMensuracao: 'VALOR_MAIS_PROVAVEL_SINGLE_MOST_LIKELY',
      cenariosFiscais: [
        { cenarioDescricao: 'Aceitação total', valorPassivoExigivelBrl: 0, probabilidadeOcorrenciaPercent: 100.0 }
      ]
    });

    const dataProb = unwrap(resProbavel);
    expect(dataProb.provavelAceitacaoPeloFisco).toBe(true);
    expect(dataProb.passivoFiscalAdicionalReconhecidoBrl).toBe(0);
    expect(dataProb.partidasDobradaProvisaoFiscal.length).toBe(0);
  });

  it('2. Deve aplicar aliquota concentrada na fabrica de bebidas e CST 04 com PIS/COFINS zero em bares/varejo (Lei 13.097/15)', () => {
    // 2.1 Indústria de Cervejas (PIS 2,32% e COFINS 10,68%)
    const resIndCerveja = processColdBeveragesTaxEngine({
      operacaoId: 'BEV-01',
      segmento: 'FABRICANTE_IMPORTADOR_BEBIDAS_FRIAS',
      tipoBebida: 'CERVEJA_CHOPE',
      marcaDescricao: 'Cerveja Puro Malte Pilsen 600ml',
      valorTotalOperacaoBrl: 500000.00
    });

    const dataCerv = unwrap(resIndCerveja);
    expect(dataCerv.cstPisCofinsUtilizado).toBe('02');
    expect(dataCerv.aliquotaPisPercent).toBe(2.32);
    expect(dataCerv.aliquotaCofinsPercent).toBe(10.68);
    expect(dataCerv.pisMonofasicoDevidoBrl).toBe(11600.00);
    expect(dataCerv.cofinsMonofasicoDevidoBrl).toBe(53400.00);
    expect(dataCerv.tributacaoVarejoZero).toBe(false);

    // 2.2 Bar / Restaurante / Supermercado (Revenda CST 04)
    const resBar = processColdBeveragesTaxEngine({
      operacaoId: 'BEV-02',
      segmento: 'DISTRIBUIDORA_ATACADO_VAREJO_BAR_RESTAURANTE',
      tipoBebida: 'CERVEJA_CHOPE',
      marcaDescricao: 'Cerveja Puro Malte Pilsen 600ml',
      valorTotalOperacaoBrl: 45000.00
    });

    const dataBar = unwrap(resBar);
    expect(dataBar.cstPisCofinsUtilizado).toBe('04');
    expect(dataBar.pisMonofasicoDevidoBrl).toBe(0);
    expect(dataBar.cofinsMonofasicoDevidoBrl).toBe(0);
    expect(dataBar.tributacaoVarejoZero).toBe(true);
    expect(dataBar.diagnosticoFiscal).toContain('CST 04 (Operação Tributável Monofásica - Revenda a Alíquota Zero');
  });
});
