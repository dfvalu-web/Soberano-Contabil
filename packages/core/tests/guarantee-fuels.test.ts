import { describe, it, expect } from 'vitest';
import {
  evaluateFinancialGuaranteeContractCpc48,
  processFuelsAndLubricantsMonophasicTaxEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Garantias Financeiras (CPC 48) & ICMS Monofásico de Combustíveis (LC 192/2022)', () => {
  it('1. Deve mensurar garantia financeira pelo MAIOR entre saldo de receita diferida e provisao ECL (CPC 48 / IFRS 9)', () => {
    // 1.1 Caso onde Saldo de Prêmio > ECL (Mensuração pela Receita Diferida)
    const resPremioMaior = evaluateFinancialGuaranteeContractCpc48({
      garantiaId: 'GAR-01',
      afiancadoNome: 'Delta Logística S.A.',
      valorGarantidoTotalBrl: 50000000.00,
      premioGarantiaRecebidoBrl: 1200000.00,
      mesesVigenciaTotal: 24,
      mesesDecorridos: 12, // Receita Amortizada = 600k, Saldo = 600k
      probabilidadeInadimplenciaPercent: 2.0, // 2%
      perdaDadaInadimplenciaPercent: 40.0     // ECL = 50M * 2% * 40% = 400.000,00
    });

    const data1 = unwrap(resPremioMaior);
    expect(data1.saldoPremioNaoAmortizadoBrl).toBe(600000.00);
    expect(data1.perdaEsperadaEclBrl).toBe(400000.00);
    expect(data1.passivoMensuracaoSubsequenteBrl).toBe(600000.00);
    expect(data1.criterioMensuracaoAdotado).toBe('MAIOR_VALOR_SALDO_PREMIO_RECEITA');
    expect(data1.partidasDobradaGarantia.length).toBe(2);

    // 1.2 Caso onde ECL > Saldo de Prêmio (Mensuração pela Provisão ECL)
    const resEclMaior = evaluateFinancialGuaranteeContractCpc48({
      garantiaId: 'GAR-02',
      afiancadoNome: 'Ômega Infraestrutura S.A.',
      valorGarantidoTotalBrl: 80000000.00,
      premioGarantiaRecebidoBrl: 1000000.00,
      mesesVigenciaTotal: 24,
      mesesDecorridos: 18, // Saldo = 250k
      probabilidadeInadimplenciaPercent: 5.0, // 5%
      perdaDadaInadimplenciaPercent: 50.0     // ECL = 80M * 5% * 50% = 2.000.000,00
    });

    const data2 = unwrap(resEclMaior);
    expect(data2.saldoPremioNaoAmortizadoBrl).toBe(250000.00);
    expect(data2.perdaEsperadaEclBrl).toBe(2000000.00);
    expect(data2.passivoMensuracaoSubsequenteBrl).toBe(2000000.00);
    expect(data2.criterioMensuracaoAdotado).toBe('MAIOR_VALOR_PROVISAO_ECL');
    expect(data2.partidasDobradaGarantia.length).toBe(4); // 2 da amortização + 2 do complemento ECL
  });

  it('2. Deve apurar ICMS monofasico ad rem na refinaria e CST 61 / PIS-COFINS zero no posto varejista (LC 192/2022)', () => {
    // 2.1 Refinaria de Petróleo (Origem - Ad Rem)
    const resRef = processFuelsAndLubricantsMonophasicTaxEngine({
      operacaoId: 'FUEL-01',
      segmento: 'REFINARIA_IMPORTADOR_PRODUTOR',
      tipoCombustivel: 'DIESEL_S10',
      quantidadeLitrosOuKg: 100000, // 100 mil litros
      valorTotalOperacaoBrl: 400000.00
    });

    const dataRef = unwrap(resRef);
    expect(dataRef.cstIcmsUtilizado).toBe('02');
    expect(dataRef.aliquotaAdRemPorUnidadeBrl).toBe(1.0635);
    expect(dataRef.icmsMonofasicoTotalBrl).toBe(106350.00);
    expect(dataRef.tributacaoVarejoZero).toBe(false);
    expect(dataRef.diagnosticoFiscal).toContain('ICMS Monofásico Ad Rem');

    // 2.2 Posto de Combustíveis (Varejo - CST 61)
    const resPosto = processFuelsAndLubricantsMonophasicTaxEngine({
      operacaoId: 'FUEL-02',
      segmento: 'DISTRIBUIDORA_TRR_POSTO_VAREJO',
      tipoCombustivel: 'GASOLINA_COMUM',
      quantidadeLitrosOuKg: 5000,
      valorTotalOperacaoBrl: 30000.00
    });

    const dataPosto = unwrap(resPosto);
    expect(dataPosto.cstIcmsUtilizado).toBe('61');
    expect(dataPosto.icmsMonofasicoTotalBrl).toBe(0);
    expect(dataPosto.pisMonofasicoTotalBrl).toBe(0);
    expect(dataPosto.cofinsMonofasicoTotalBrl).toBe(0);
    expect(dataPosto.tributacaoVarejoZero).toBe(true);
    expect(dataPosto.diagnosticoFiscal).toContain('CST 61 (ICMS Monofásico Cobrado Anteriormente');
  });
});
