import { describe, it, expect } from 'vitest';
import {
  processBepsGlobeQdmttEngine,
  processTaxTreatyPermanentEstablishmentEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: BEPS GloBE Pilar 2 (QDMTT 15%) & Acordos de Bitributação (ADT / ECF X340)', () => {
  it('1. Deve apurar o QDMTT Top-up Tax de 5% sobre lucro GloBE de R$ 50M com ETR de 10% (IN RFB 2.228/24)', () => {
    const resGlobe = processBepsGlobeQdmttEngine({
      holdingMultinacionalCnpj: '10.000.000/0001-00',
      jurisdicaoOperacao: 'BRASIL',
      anoCalendario: 2026,
      receitaGlobalGrupoEurMilhoes: 950, // >= 750M EUR
      lucroLiquidoAjustadoGlobeBrl: 50000000.00,
      tributosCobertosAjustadosPagosBrl: 5000000.00, // ETR = 10%
      aliquotaMinimaGlobalPercent: 15.0
    });

    const dataGlobe = unwrap(resGlobe);
    expect(dataGlobe.taxaEfetivaTributacaoEtrPercent).toBe(10.0);
    expect(dataGlobe.aliquotaTopUpTaxPercent).toBe(5.0);
    expect(dataGlobe.impostoAdicionalQdmttDevidoBrl).toBe(2500000.00); // 5% de R$ 50M
    expect(dataGlobe.statusConformidadeOcde).toBe('TOP_UP_TAX_QDMTT_APURADO_15_PERCENT');
    expect(dataGlobe.escrituracaoSpedEcfBlocoX).toBe('REGISTRO_X340_X350_ECF_APROVADO');
    expect(dataGlobe.diagnosticoGlobe).toContain('QDMTT Adicional: R$ 2.500.000');
  });

  it('2. Deve compensar imposto pago na Espanha limitando ao teto do IRPJ/CSLL no Brasil (Art. 26 Lei 12.973)', () => {
    const resTratado = processTaxTreatyPermanentEstablishmentEngine({
      empresaBrasilCnpj: '10.000.000/0001-00',
      paisTratadoAdt: 'ESPANHA',
      lucroFilialExteriorBrl: 10000000.00,
      impostoRendaPagoExteriorBrl: 2500000.00, // 25% na Espanha
      aliquotaIrpjCsllBrasilPercent: 34.0 // 34% no Brasil = R$ 3.4M
    });

    const dataTratado = unwrap(resTratado);
    expect(dataTratado.irpjCsllDevidoBrasilAntesCreditoBrl).toBe(3400000.00);
    expect(dataTratado.creditoImpostoExteriorAproveitavelBrl).toBe(2500000.00);
    expect(dataTratado.irpjCsllComplementarBrasilBrl).toBe(900000.00); // R$ 3.4M - R$ 2.5M
    expect(dataTratado.statusTratado).toBe('CREDITO_TRIBUTARIO_EXTERIOR_HOMOLOGADO_ECF');
    expect(dataTratado.diagnosticoTratado).toContain('Imposto Complementar a Recolher: R$ 900.000');
  });
});
