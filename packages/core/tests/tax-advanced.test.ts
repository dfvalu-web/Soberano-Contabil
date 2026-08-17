import { describe, it, expect } from 'vitest';
import { calculateJcp, calculateDeferredTaxes } from '../src/tax/lucro-real/jcp-differed.js';
import { processBlocoKProduction, BillOfMaterialsItem, ProductionOrder } from '../src/tax/special-sectors/bloco-k.js';
import { executeSplitPaymentSettlement } from '../src/tax/reforma-tributaria/split-payment.js';
import { unwrap } from '../src/types/result.js';

describe('Etapa 2: Motor Tributario Avancado (JCP, Bloco K e Split Payment)', () => {
  it('deve calcular o limite de JCP com TJLP e a economia fiscal liquida de IRPJ/CSLL', () => {
    // PL = R$ 10.000.000,00 | TJLP = 7.0% a.a. -> Limite TJLP = R$ 700.000,00
    // Lucro do Exercício = R$ 2.000.000,00 -> 50% = R$ 1.000.000,00
    // JCP Dedutível = R$ 700.000,00
    // IRRF 15% na fonte = R$ 105.000,00 | JCP Líquido aos Sócios = R$ 595.000,00
    // Economia Tributária PJ 34% = R$ 238.000,00 | Vantagem Líquida = 238k - 105k = R$ 133.000,00
    const res = calculateJcp({
      patrimonioLiquidoAjustado: 10000000.00,
      taxaTjlpAnualPercent: 0.07,
      mesesProporcional: 12,
      lucroExercicioAntesJcp: 2000000.00,
      lucrosAcumuladosEReservasDeLucros: 500000.00
    });

    const data = unwrap(res);
    expect(data.limiteTjlpSobrePl).toBe(700000.00);
    expect(data.valorMaximoJcpDedutivel).toBe(700000.00);
    expect(data.irrfRetidoNaFonte15Percent).toBe(105000.00);
    expect(data.jcpLiquidoAosSocios).toBe(595000.00);
    expect(data.economiaTributariaIrpjCsll34Percent).toBe(238000.00);
    expect(data.vantagemFinanceiraLiquida).toBe(133000.00);
  });

  it('deve processar ordem de producao industrial com Bloco K e rastreamento de desvios de consumo', () => {
    const bom: BillOfMaterialsItem[] = [
      {
        codigoInsumo: 'AÇO-01',
        descricao: 'Chapa de Aço Inox 2mm',
        quantidadeNecessariaPorUnidade: 2.5,
        unidadeMedida: 'KG',
        percentualPerdaPadrao: 0.04, // 4% de perda padrão
        custoUnitarioInsumo: 50.00
      }
    ];

    const order: ProductionOrder = {
      numeroOrdem: 'OP-2026-001',
      codigoProdutoFinal: 'GAB-01',
      descricaoProdutoFinal: 'Gabinete Industrial Inox',
      quantidadePlanejada: 100,
      quantidadeProduzidaReal: 100,
      dataInicio: '2026-01-10',
      dataConclusao: '2026-01-15',
      itensConsumidos: [
        { codigoInsumo: 'AÇO-01', quantidadeConsumidaReal: 260 } // 100 * 2.5 * 1.04 = 260 kg
      ]
    };

    const res = processBlocoKProduction(order, bom);
    const data = unwrap(res);

    expect(data.quantidadeProduzida).toBe(100);
    expect(data.custoTotalInsumos).toBe(13000.00); // 260 kg * R$ 50 = R$ 13.000,00
    expect(data.custoUnitarioProducao).toBe(130.00);
    expect(data.desviosDeConsumoEPerdas[0]?.statusConformidade).toBe('DENTRO_DO_PADRAO');
    expect(data.registrosBlocoK.some(r => r.registro === 'K230')).toBe(true);
    expect(data.registrosBlocoK.some(r => r.registro === 'K235')).toBe(true);
  });

  it('deve executar a liquidacao automatica via Split Payment da Reforma Tributaria com retencao e credito imediato', () => {
    const res = executeSplitPaymentSettlement({
      idTransacao: 'TX-9988',
      chaveDfe: '35260112345678000195550010000001231000001234',
      valorTotalFatura: 100000.00,
      valorCbsDevido: 8800.00, // 8.8%
      valorIbsDevido: 17700.00, // 17.7%
      dadosBancariosFornecedor: {
        banco: '001',
        agencia: '1234',
        conta: '56789-0'
      }
    });

    const data = unwrap(res);
    expect(data.totalTributosRetidosImediatamente).toBe(26500.00); // 8800 + 17700
    expect(data.valorLiquidoCreditadoFornecedor).toBe(73500.00); // 100.000 - 26.500
    expect(data.comprovanteLiquidacaoSefaz.status).toBe('LIQUIDADO_COM_SUCESSO');
    expect(data.comprovanteLiquidacaoSefaz.protocoloSplitPayment).toBeDefined();
  });
});
