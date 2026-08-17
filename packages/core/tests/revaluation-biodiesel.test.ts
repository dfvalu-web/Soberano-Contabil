import { describe, it, expect } from 'vitest';
import {
  evaluateDeemedCostRevaluationCpc27,
  processBiodieselEthanolMonophasicTaxEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Custo Atribuído / Reavaliação (CPC 27) & Biodiesel com Selo Social (Lei 11.116/05)', () => {
  it('1. Deve apurar laudo de reavaliacao, tributos diferidos a 34% e realizacao anual no PL (CPC 27 / ICPC 10 / CPC 32)', () => {
    const resReval = evaluateDeemedCostRevaluationCpc27({
      ativoImobilizadoId: 'IMOB-REVAL-01',
      descricaoAtivo: 'Parque Fabril e Instalações Industriais',
      valorContabilHistoricoLiquidoBrl: 10000000.00,
      valorJustoLaudoAvaliacaoBrl: 30000000.00, // Mais-Valia Bruta = 20M
      vidaUtilRemanescenteAnos: 10,
      aliquotaTributosDiferidosPercent: 34.0
    });

    const dataRev = unwrap(resReval);
    expect(dataRev.valorAjusteReavaliacaoBrutoBrl).toBe(20000000.00);
    expect(dataRev.tributosDiferidosPassivoBrl).toBe(6800000.00); // 34% de 20M
    expect(dataRev.reservaReavaliacaoLiquidaPlBrl).toBe(13200000.00); // AAP no PL
    expect(dataRev.depreciacaoAnualNovoCustoBrl).toBe(3000000.00);
    expect(dataRev.realizacaoAnualReservaPlBrl).toBe(1320000.00); // 13.2M / 10 anos
    expect(dataRev.partidasDobradaLaudoInicial.length).toBe(3);
    expect(dataRev.partidasDobradaRealizacaoAno1.length).toBe(4);
    expect(dataRev.diagnosticoCpc27).toContain('Custo Atribuído & Reavaliação');
  });

  it('2. Deve apurar aliquota ad rem de biodiesel com e sem Selo Combustivel Social e CST 04 no varejo (Lei 11.116/05)', () => {
    // 2.1 Produtor COM Selo Combustível Social (PIS R$ 8,16/m³ e COFINS R$ 37,60/m³ = R$ 45,76/m³)
    const resProdSelo = processBiodieselEthanolMonophasicTaxEngine({
      operacaoId: 'BIO-01',
      segmento: 'PRODUTOR_FABRICANTE_BIODIESEL',
      categoriaSeloSocial: 'COM_SELO_COMBUSTIVEL_SOCIAL',
      volumeMetrosCubicosM3: 500.0, // 500 m³ (500.000 litros)
      precoTotalVendaBrl: 2500000.00
    });

    const dataSelo = unwrap(resProdSelo);
    expect(dataSelo.aliquotaPisAdRemPorM3Brl).toBe(8.16);
    expect(dataSelo.aliquotaCofinsAdRemPorM3Brl).toBe(37.60);
    expect(dataSelo.pisMonofasicoDevidoBrl).toBe(4080.00);
    expect(dataSelo.cofinsMonofasicoDevidoBrl).toBe(18800.00);
    expect(dataSelo.totalTributosDevidosBrl).toBe(22880.00);
    expect(dataSelo.tributacaoVarejoZero).toBe(false);

    // 2.2 Posto de Combustíveis / Distribuidora (Revenda CST 04 - Alíquota Zero)
    const resPosto = processBiodieselEthanolMonophasicTaxEngine({
      operacaoId: 'BIO-02',
      segmento: 'DISTRIBUIDORA_POSTO_COMBUSTIVEL',
      categoriaSeloSocial: 'COM_SELO_COMBUSTIVEL_SOCIAL',
      volumeMetrosCubicosM3: 50.0,
      precoTotalVendaBrl: 300000.00
    });

    const dataPosto = unwrap(resPosto);
    expect(dataPosto.aliquotaPisAdRemPorM3Brl).toBe(0);
    expect(dataPosto.aliquotaCofinsAdRemPorM3Brl).toBe(0);
    expect(dataPosto.totalTributosDevidosBrl).toBe(0);
    expect(dataPosto.tributacaoVarejoZero).toBe(true);
    expect(dataPosto.diagnosticoFiscal).toContain('CST 04 (Operação Tributável Monofásica - Revenda a Alíquota Zero');
  });
});
