import { describe, it, expect } from 'vitest';
import {
  evaluateSegmentReportingCpc22,
  calculateRenewableEnergyTaxBenefits,
  unwrap
} from '../src/index.js';

describe('TESTES: Informações por Segmento Operacional (CPC 22 / IFRS 8) & Energia Renovável GD', () => {
  it('1. Deve identificar segmentos reportaveis pelo teste dos 10% e verificar regra dos 75% (CPC 22)', () => {
    const res = evaluateSegmentReportingCpc22(2026, [
      {
        segmentoId: 'SEG-AGRO',
        nomeSegmento: 'Divisão Agropecuária',
        receitaExterna: 5000000.00,
        receitaIntersegmento: 500000.00,
        resultadoOperacional: 1200000.00,
        ativosTotais: 15000000.00,
        passivosTotais: 5000000.00
      },
      {
        segmentoId: 'SEG-IND',
        nomeSegmento: 'Divisão Industrial',
        receitaExterna: 4000000.00,
        receitaIntersegmento: 200000.00,
        resultadoOperacional: 800000.00,
        ativosTotais: 10000000.00,
        passivosTotais: 3000000.00
      },
      {
        segmentoId: 'SEG-LOG',
        nomeSegmento: 'Divisão Logística Externa',
        receitaExterna: 200000.00,
        receitaIntersegmento: 50000.00,
        resultadoOperacional: 30000.00,
        ativosTotais: 500000.00,
        passivosTotais: 100000.00
      }
    ]);

    const data = unwrap(res);
    expect(data.segmentosReportaveis.length).toBe(2); // SEG-AGRO e SEG-IND
    expect(data.segmentosReportaveis.map(s => s.segmentoId)).toContain('SEG-AGRO');
    expect(data.segmentosReportaveis.map(s => s.segmentoId)).toContain('SEG-IND');
    expect(data.segmentosNaoReportaveisAgregados.quantidadeSegmentos).toBe(1);
    expect(data.regra75PorcentoAtendida).toBe(true);
    expect(data.percentualReceitaExternaReportavel).toBeGreaterThan(90);
  });

  it('2. Deve apurar isencao de ICMS e creditos PIS/COFINS em energia solar GD (Lei 14.300/2022)', () => {
    const res = calculateRenewableEnergyTaxBenefits({
      unidadeConsumidoraId: 'UC-USINA-SOLAR-01',
      modalidadeGd: 'AUTOCONSUMO_REMOTO',
      energiaInjetadaKwhMes: 100000, // 100.000 kWh/mês
      tarifaEnergiaTeReaisPorKwh: 0.50, // TE = R$ 0,50/kWh => R$ 50.000,00 base/mês
      tarifaUsoSistemaTusdReaisPorKwh: 0.30,
      aliquotaIcmsEstadoPercent: 18, // 18% ICMS => R$ 9.000,00/mês => R$ 108.000,00/ano
      capexUsinaSolarEquipamentosBrl: 2000000.00 // CAPEX R$ 2M => PIS/COFINS 9.25% = R$ 185.000,00
    });

    const data = unwrap(res);
    expect(data.economiaMensalIsencaoIcmsBrl).toBe(9000.00);
    expect(data.economiaAnualEstimadaBrl).toBe(108000.00);
    expect(data.creditoPisCofinsCapexUsina9_25Percent).toBe(185000.00);
    expect(data.diagnosticoEnergiaGd).toContain('Marco Legal da GD');
  });
});
