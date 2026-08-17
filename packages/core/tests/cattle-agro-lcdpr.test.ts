import { describe, it, expect } from 'vitest';
import {
  processCattleLivestockValuationCpc29,
  processLcdprRuralIncomeTaxEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Pecuária de Corte (CPC 29) & LCDPR / IRPF Rural (Lei 8.023)', () => {
  it('1. Deve mensurar rebanho bovino a valor justo liquido e reconhecer ganho de transformacao biologica (CPC 29)', () => {
    const resCattle = processCattleLivestockValuationCpc29({
      fazendaId: 'AGRO-PECUARIA-01',
      fazendaNome: 'Fazenda Soberana Agropecuária & Confinamento',
      quantidadeCabecas: 5000,
      faseRebanho: 'ENGORDA_CONFINAMENTO',
      pesoMedioArrobasPorCabeca: 18.0, // 90.000 arrobas
      cotacaoArrobaMercadoBrl: 240.00, // 21.6M bruto
      despesasEstimadasVendaFretePercent: 3.0, // 3% frete/comissão = 648k -> Líquido 20.952M
      custoCriacaoAcumuladoHistoricoBrl: 15000000.00 // 15M custo histórico
    });

    const dataCattle = unwrap(resCattle);
    expect(dataCattle.pesoTotalRebanhoArrobas).toBe(90000.00);
    expect(dataCattle.valorJustoBrutoRebanhoBrl).toBe(21600000.00);
    expect(dataCattle.despesasEstimadasVendaBrl).toBe(648000.00);
    expect(dataCattle.valorJustoLiquidoRebanhoBrl).toBe(20952000.00);
    expect(dataCattle.ganhoTransformacaoBiologicaDreBrl).toBe(5952000.00); // 20.952M - 15M
    expect(dataCattle.lancamentosContabeis.length).toBe(2);
    expect(dataCattle.diagnosticoCpc29).toContain('Valor Justo Liquido Balanco: R$ 20952000.00');
  });

  it('2. Deve comparar resultado real vs arbitramento 20% e gerar arquivo LCDPR para atividade rural (Lei 8.023/90)', () => {
    const resLcdpr = processLcdprRuralIncomeTaxEngine({
      produtorId: 'PROD-RURAL-01',
      produtorNome: 'Produtor Rural David & Condomínio Fazendas Soberanas',
      cpf: '123.456.789-00',
      anoCalendario: 2026,
      receitaBrutaAtividadeRuralBrl: 15000000.00, // 15M receita
      despesasCusteioInvestimentosBrl: 13500000.00, // 13.5M despesas/investimentos -> Resultado Real = 1.5M
      prejuizosFiscaisAnosAnterioresBrl: 500000.00 // 500k prejuízo compensado -> Base Real = 1M (vs 3M Arbitrado)
    });

    const dataLcdpr = unwrap(resLcdpr);
    expect(dataLcdpr.resultadoRealApuradoBrl).toBe(1500000.00);
    expect(dataLcdpr.baseTributavelArbitramento20PercentBrl).toBe(3000000.00); // 20% de 15M = 3M
    expect(dataLcdpr.regimeMaisVantajoso).toBe('RESULTADO_REAL_LIVRO_CAIXA');
    expect(dataLcdpr.baseCalculoEfetivaIrpfBrl).toBe(1000000.00); // 1.5M - 500k = 1M
    expect(dataLcdpr.saldoPrejuizoFiscalParaCompensarAnoSeguinteBrl).toBe(0);
    expect(dataLcdpr.arquivoLcdprGerado).toBe(true);
    expect(dataLcdpr.diagnosticoLcdpr).toContain('REGIME ESCOLHIDO: RESULTADO_REAL_LIVRO_CAIXA');
  });
});
