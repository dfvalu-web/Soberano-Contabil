import { describe, it, expect } from 'vitest';
import {
  evaluatePerpetualBondClassificationCpc39,
  processAutoPartsMonophasicTaxEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Títulos Perpétuos (CPC 39) & Monofásico de Autopeças (Lei 10.485/02)', () => {
  it('1. Deve classificar título perpétuo discricionário no PL com cupom sem DRE vs passivo (CPC 39 / IAS 32)', () => {
    // 1.1 Título Perpétuo no Patrimônio Líquido
    const resEquity = evaluatePerpetualBondClassificationCpc39({
      instrumentoId: 'TIER1-BOND-01',
      emissoraNome: 'Banco Múltiplo Alpha S.A.',
      valorNominalCaptadoBrl: 50000000.00,
      cupomJurosAnualPercent: 9.0, // 4.5M/ano
      discricionariedadePagamentoJuros: true,
      semObrigacaoResgatePrincipal: true
    });

    const dataEq = unwrap(resEquity);
    expect(dataEq.tipoClassificacaoContabil).toBe('TITULO_PERPETUO_PATRIMONIO_LIQUIDO');
    expect(dataEq.classificacaoDescricao).toBe('PATRIMONIO_LIQUIDO_OUTROS_INSTRUMENTOS');
    expect(dataEq.cupomAnualBrl).toBe(4500000.00);
    expect(dataEq.impactoNaDRE).toBe(false);
    expect(dataEq.partidasDobradaEmissao.length).toBe(2);
    expect(dataEq.partidasDobradaPagamentoCupom.length).toBe(2);
    expect(dataEq.diagnosticoCpc39).toContain('classificado no PATRIMÔNIO LÍQUIDO');

    // 1.2 Debênture Subordinada no Passivo
    const resPassivo = evaluatePerpetualBondClassificationCpc39({
      instrumentoId: 'DEB-SUB-02',
      emissoraNome: 'Energética Nacional S.A.',
      valorNominalCaptadoBrl: 30000000.00,
      cupomJurosAnualPercent: 10.0,
      discricionariedadePagamentoJuros: false, // Juros obrigatórios
      semObrigacaoResgatePrincipal: false      // Tem vencimento
    });

    const dataPas = unwrap(resPassivo);
    expect(dataPas.tipoClassificacaoContabil).toBe('DEBENTURE_SUBORDINADA_PASSIVO');
    expect(dataPas.impactoNaDRE).toBe(true);
    expect(dataPas.cupomAnualBrl).toBe(3000000.00);
  });

  it('2. Deve aplicar aliquota concentrada na industria de autopeças/pneus e CST 04 com PIS/COFINS zero no varejo (Lei 10.485/02)', () => {
    // 2.1 Indústria de Autopeças (2,30% PIS e 10,80% COFINS)
    const resIndPeças = processAutoPartsMonophasicTaxEngine({
      operacaoId: 'PECA-01',
      segmento: 'FABRICANTE_IMPORTADOR_AUTOPECAS',
      tipoProduto: 'AUTOPECAS_GERAL',
      descricaoItem: 'Amortecedor Dianteiro Pressurizado',
      valorTotalOperacaoBrl: 100000.00
    });

    const dataPeças = unwrap(resIndPeças);
    expect(dataPeças.cstPisCofinsUtilizado).toBe('02');
    expect(dataPeças.aliquotaPisPercent).toBe(2.30);
    expect(dataPeças.aliquotaCofinsPercent).toBe(10.80);
    expect(dataPeças.pisMonofasicoDevidoBrl).toBe(2300.00);
    expect(dataPeças.cofinsMonofasicoDevidoBrl).toBe(10800.00);
    expect(dataPeças.tributacaoVarejoZero).toBe(false);

    // 2.2 Loja de Autopeças / Oficina Mecânica (Revenda CST 04)
    const resOficina = processAutoPartsMonophasicTaxEngine({
      operacaoId: 'PECA-02',
      segmento: 'DISTRIBUIDORA_AUTOPECAS_VAREJO_OFICINA',
      tipoProduto: 'AUTOPECAS_GERAL',
      descricaoItem: 'Pastilha de Freio Cerâmica',
      valorTotalOperacaoBrl: 15000.00
    });

    const dataOficina = unwrap(resOficina);
    expect(dataOficina.cstPisCofinsUtilizado).toBe('04');
    expect(dataOficina.pisMonofasicoDevidoBrl).toBe(0);
    expect(dataOficina.cofinsMonofasicoDevidoBrl).toBe(0);
    expect(dataOficina.tributacaoVarejoZero).toBe(true);
    expect(dataOficina.diagnosticoFiscal).toContain('CST 04 (Operação Tributável Monofásica - Revenda a Alíquota Zero)');
  });
});
