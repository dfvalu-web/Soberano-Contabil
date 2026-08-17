import { describe, it, expect } from 'vitest';
import {
  evaluateHybridConcessionDualModelIcpc01,
  processUsedVehiclesConsignmentTaxEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Concessões Modelo Híbrido (ICPC 01 R1) & Veículos Usados s/ Spread (Lei 9.716/98)', () => {
  it('1. Deve desmembrar concessao em Ativo Financeiro garantido e Ativo Intangivel tarifario (ICPC 01 R1)', () => {
    const resHybrid = evaluateHybridConcessionDualModelIcpc01({
      contratoId: 'CONC-RODOVIA-MISTO-01',
      concessionariaNome: 'Auto Pistas Brasil S.A.',
      objetoConcessao: 'Rodovia Pedagiada com Aporte Garantido',
      custoTotalConstrucaoInfraestruturaBrl: 100000000.00,
      valorGarantidoPoderConcedenteBrl: 40000000.00, // 40M Financeiro
      prazoConcessaoAnos: 30 // 60M Intangível -> 2M / ano amortização
    });

    const dataHybrid = unwrap(resHybrid);
    expect(dataHybrid.valorAtivoFinanceiroConcessaoBrl).toBe(40000000.00);
    expect(dataHybrid.valorAtivoIntangivelConcessaoBrl).toBe(60000000.00);
    expect(dataHybrid.amortizacaoAnualIntangivelBrl).toBe(2000000.00);
    expect(dataHybrid.partidasDobradaBifurcacao.length).toBe(3);
    expect(dataHybrid.diagnosticoIcpc01Hibrido).toContain('Modelo Híbrido / Bifurcado');
  });

  it('2. Deve tributar veiculos usados exclusivamente sobre a margem de comercializacao/spread (Lei 9.716/98 Art. 5º)', () => {
    const resVeh = processUsedVehiclesConsignmentTaxEngine({
      operacaoId: 'VEIC-01',
      concessionariaNome: 'Soberano Motors Autos e Veículos Ltda',
      veiculoDescricao: 'Honda Civic Touring 2021',
      valorVendaNotaFiscalBrl: 140000.00,
      custoAquisicaoVeiculoBrl: 120000.00 // Spread = 20.000
    });

    const dataVeh = unwrap(resVeh);
    expect(dataVeh.margemBrutaSpreadBrl).toBe(20000.00);
    expect(dataVeh.valorIrpjDevidoBrl).toBe(960.00); // 20k * 32% (6400) * 15% = 960
    expect(dataVeh.valorCsllDevidaBrl).toBe(576.00); // 20k * 32% (6400) * 9% = 576
    expect(dataVeh.valorPisDevidoBrl).toBe(130.00); // 20k * 0.65% = 130
    expect(dataVeh.valorCofinsDevidoBrl).toBe(600.00); // 20k * 3% = 600
    expect(dataVeh.totalTributosIncidentesBrl).toBe(2266.00);
    expect(dataVeh.economiaTributariaVsFaturamentoBrutoBrl).toBeGreaterThan(5000.00);
    expect(dataVeh.diagnosticoFiscal).toContain('Veículos Usados (Art. 5º Lei nº 9.716/98)');
  });
});
