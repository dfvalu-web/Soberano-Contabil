import { describe, it, expect } from 'vitest';
import {
  processPortWorkersOgmoPayrollS1270,
  processFapEstablishmentRatEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Portuários Avulsos OGMO (eSocial S-1270) & FAP por Estabelecimento', () => {
  it('1. Deve apurar encargos patronais (CPP 20%, RAT, Terceiros/DPC) e payload S-1270 para avulsos portuarios', () => {
    const resPort = processPortWorkersOgmoPayrollS1270({
      operadorPortuarioId: 'PORT-OP-01',
      operadorPortuarioNome: 'Soberano Terminais Portuários S.A.',
      portoNome: 'Porto de Santos',
      competencia: '2026-04',
      quantidadeTrabalhadoresAvulsosTpa: 150,
      totalRemuneracaoBrutaTpaBrl: 1500000.00, // 1.5M
      aliquotaRatPercent: 3.0,
      fapAplicavel: 1.0,
      aliquotaTerceirosDpcMarinhaPercent: 5.2
    });

    const dataPort = unwrap(resPort);
    expect(dataPort.totalRemuneracaoBrutaBrl).toBe(1500000.00);
    expect(dataPort.contribuicaoPrevidenciariaCpp20PercentBrl).toBe(300000.00); // 20% de 1.5M = 300k
    expect(dataPort.ratAjustadoValorBrl).toBe(45000.00); // 3% de 1.5M = 45k
    expect(dataPort.contribuicaoTerceirosOutrasEntidadesBrl).toBe(78000.00); // 5.2% de 1.5M = 78k
    expect(dataPort.totalFgtsDevido8PercentBrl).toBe(120000.00); // 8% de 1.5M = 120k
    expect(dataPort.totalEncargosPatronaisBrl).toBe(543000.00);
    expect(dataPort.esocialS1270Payload.remunAvulso.codPorto).toBe('Porto de Santos');
    expect(dataPort.diagnosticoFiscalTrabalhista).toContain('Evento S-1270 gerado');
  });

  it('2. Deve apurar RAT ajustado e economia em FAP bonus por filial (Decreto 10.410/20)', () => {
    // 2.1 Filial com FAP Bônus (0,6500) -> Economia
    const resBonus = processFapEstablishmentRatEngine({
      estabelecimentoId: 'ESTAB-01',
      cnpjFilial: '12.345.678/0002-00',
      estabelecimentoNome: 'Soberano Filial Fábrica Industrial',
      folhaPagamentoMensalBrl: 5000000.00, // 5M
      aliquotaRatBasePercent: 3.0, // Base 3%
      fapEstabelecimento: 0.6500 // FAP 0.6500 -> RAT Ajustado = 1.9500%
    });

    const dataBonus = unwrap(resBonus);
    expect(dataBonus.aliquotaRatAjustadaEfetivaPercent).toBe(1.95);
    expect(dataBonus.valorRatMensalDevidoBrl).toBe(97500.00); // 5M * 1.95% = 97.500
    expect(dataBonus.statusFap).toBe('BONUS_ECONOMIA');
    expect(dataBonus.diferencialFinanceiroMensalVsNeutroBrl).toBe(-52500.00); // Economia mensal de R$ 52.500
    expect(dataBonus.economiaAnualProjetadaBrl).toBe(699825.00); // 52.500 * 13.33
    expect(dataBonus.diagnosticoPrevidenciario).toContain('BONUS_ECONOMIA: Economia Mensal de R$ 52500.00');

    // 2.2 Filial com FAP Malus (1,5000) -> Sobrecusto
    const resMalus = processFapEstablishmentRatEngine({
      estabelecimentoId: 'ESTAB-02',
      cnpjFilial: '12.345.678/0003-00',
      estabelecimentoNome: 'Soberano Filial Logística',
      folhaPagamentoMensalBrl: 2000000.00,
      aliquotaRatBasePercent: 2.0,
      fapEstabelecimento: 1.5000 // RAT Ajustado = 3.0000%
    });

    const dataMalus = unwrap(resMalus);
    expect(dataMalus.aliquotaRatAjustadaEfetivaPercent).toBe(3.0);
    expect(dataMalus.statusFap).toBe('MALUS_SOBRECUSTO');
    expect(dataMalus.diferencialFinanceiroMensalVsNeutroBrl).toBe(20000.00); // Custo extra R$ 20.000/mês
  });
});
