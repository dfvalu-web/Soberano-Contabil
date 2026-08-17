import { describe, it, expect } from 'vitest';
import {
  processEsgSustainabilityIfrsS1S2,
  processGlobeMinimumTaxPillarTwoMp1262,
  unwrap
} from '../src/index.js';

describe('TESTES: IFRS S1/S2 Sustentabilidade ESG & GloBE OCDE Pilar Dois', () => {
  it('1. Deve apurar emissoes GEE (Escopos 1, 2, 3), intensidade de carbono e receita verde (IFRS S1/S2 & CVM 193)', () => {
    const resEsg = processEsgSustainabilityIfrsS1S2({
      entidadeId: 'ESG-CORP-01',
      entidadeNome: 'Soberano Conglomerado Industrial e Energético S.A.',
      anoExercicio: 2026,
      emissoesEscopo1Tco2e: 15000,
      emissoesEscopo2Tco2e: 10000,
      emissoesEscopo3Tco2e: 20000,
      investimentoTransicaoEnergeticaBrl: 50000000.00,
      receitaVerdeTaxonomiaBrl: 350000000.00,
      receitaTotalBrl: 1000000000.00 // 1 Bilhão
    });

    const dataEsg = unwrap(resEsg);
    expect(dataEsg.totalEmissoesGeeTco2e).toBe(45000);
    expect(dataEsg.intensidadeCarbonoTco2ePorMilhaoReceita).toBe(45); // 45.000 / 1.000
    expect(dataEsg.percentualReceitaVerdeAlinhadaPercent).toBe(35); // 350M de 1B
    expect(dataEsg.statusConformidadeCvm193).toBe('TOTALMENTE_CONFORME_IFRS_S1_S2');
    expect(dataEsg.diagnosticoSustentabilidade).toContain('Relatorio IFRS S1/S2 100% Conforme CVM 193');
  });

  it('2. Deve apurar ETR e adicional de CSLL / Top-up Tax (15%) sob regras GloBE OCDE Pilar 2 (MP 1.262/2024)', () => {
    const resGlobe = processGlobeMinimumTaxPillarTwoMp1262({
      multinacionalId: 'GLOBE-HOLDING-01',
      multinacionalNome: 'Soberano Global Holdings S.A.',
      anoApuracao: 2026,
      receitaConsolidadaGlobalEurMilhoes: 1200, // 1.2B EUR >= 750M EUR -> Elegível
      lucroLiquidoContabilAjustadoGlobeBrl: 100000000.00, // 100M BRL Lucro GloBE
      tributosAbrangidosPagosBrl: 11500000.00, // 11.5M BRL -> ETR = 11.50%
      substanciaEconomicaAtivosFolhaDeducoesBrl: 0
    });

    const dataGlobe = unwrap(resGlobe);
    expect(dataGlobe.isElegivelRegrasGlobe).toBe(true);
    expect(dataGlobe.aliquotaEfetivaApuradaEtrPercent).toBe(11.5);
    expect(dataGlobe.aliquotaMinimaGlobalPercent).toBe(15.0);
    expect(dataGlobe.aliquotaAdicionalTopUpPercent).toBe(3.5); // 15% - 11.5% = 3.5%
    expect(dataGlobe.adicionalCsllQdmttDevidoBrl).toBe(3500000.00); // 3.5% de 100M = 3.5M
    expect(dataGlobe.diagnosticoGlobePilarDois).toContain('Adicional CSLL (QDMTT) Devido no Brasil: R$ 3500000.00');
  });
});
