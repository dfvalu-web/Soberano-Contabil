import { describe, it, expect } from 'vitest';
import {
  processMethaneEnvironmentalCreditsCpc04,
  processPilotagePortServicesTaxEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Créditos de Metano (CPC 04/16) & Praticagem Portuária (STJ 1014)', () => {
  it('1. Deve contabilizar creditos de metano como estoque a valor justo para trading com ganho na DRE (CPC 16)', () => {
    const resMethane = processMethaneEnvironmentalCreditsCpc04({
      projetoId: 'METANO-BIO-01',
      projetoNome: 'Projeto Biometano & Captura de Metano Soberano',
      finalidadeContabil: 'NEGOCIACAO_TRADING_MERCADO',
      quantidadeCreditosMetanoTco2e: 100000,
      custoUnitarioGeracaoCapturaBrl: 20.00, // 2M Custo
      cotacaoMercadoUnitarioBrl: 50.00 // 5M Valor Justo (+3M ganho)
    });

    const dataMethane = unwrap(resMethane);
    expect(dataMethane.classificacaoContabil).toBe('CPC16_ESTOQUE_VALOR_JUSTO');
    expect(dataMethane.custoTotalGeracaoBrl).toBe(2000000.00);
    expect(dataMethane.valorTotalBalançoBrl).toBe(5000000.00);
    expect(dataMethane.ganhoAjusteValorJustoBrl).toBe(3000000.00);
    expect(dataMethane.lancamentosContabeis.length).toBe(2);
    expect(dataMethane.diagnosticoMetano).toContain('Ganho FVTPL na DRE: R$ 3000000.00');
  });

  it('2. Deve apurar ISSQN porto (5%), PIS/COFINS e exclusao da capatazia portuaria (STJ Tema 1014)', () => {
    const resPort = processPilotagePortServicesTaxEngine({
      servicoId: 'PRAT-SANTOS-01',
      empresaPraticagemNome: 'Soberano Praticagem da Barra & Rebocadores S.A.',
      portoNome: 'Porto de Santos',
      competencia: '2026-04',
      receitaServicosPraticagemBrl: 5000000.00, // 5M praticagem
      receitaServicosRebocadoresBrl: 3000000.00, // 3M rebocadores -> 8M total
      valorCapataziaPortuariaImportacaoBrl: 2000000.00, // 2M capatazia
      aliquotaIssqnPraticagemPercent: 5.0
    });

    const dataPort = unwrap(resPort);
    expect(dataPort.receitaTotalServicosPortuariosBrl).toBe(8000000.00);
    expect(dataPort.issqnDevidoMunicipioPorto5PercentBrl).toBe(400000.00); // 5% de 8M = 400k
    expect(dataPort.pisCofinsFaturamento925PercentBrl).toBe(740000.00); // 9.25% de 8M = 740k
    expect(dataPort.totalTributosDevidosBrl).toBe(1140000.00);
    expect(dataPort.economiaExclusaoCapataziaStj1014Brl).toBe(553000.00); // 27.65% de 2M
    expect(dataPort.diagnosticoPraticagem).toContain('Economia Exclusao Capatazia STJ 1014: R$ 553000.00');
  });
});
