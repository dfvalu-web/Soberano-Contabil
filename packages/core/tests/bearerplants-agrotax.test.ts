import { describe, it, expect } from 'vitest';
import {
  evaluateBearerPlantsCpc27vs29,
  processAgribusinessPisCofinsSuspensionLaw12865,
  unwrap
} from '../src/index.js';

describe('TESTES: Plantas Portadoras (CPC 27 vs 29) & Agroindústria Suspensão PIS/COFINS (Lei 12.865/13)', () => {
  it('1. Deve contabilizar plantas portadoras como imobilizado (CPC 27) e frutos nos ramos a valor justo (CPC 29)', () => {
    // 1.1 Planta Portadora em Produção (Pomar de Laranjas)
    const resProd = evaluateBearerPlantsCpc27vs29({
      ativoId: 'PLANT-CITROS-01',
      culturaNome: 'Pomar de Laranjas Pera Rio',
      estagio: 'PRODUCAO_MATURIDADE',
      custosAcumuladosFormacaoBrl: 5000000.00,
      vidaUtilProdutivaAnos: 20, // Depreciação = 250k / ano
      valorResidualImobilizadoBrl: 0,
      valorJustoFrutosEmDesenvolvimentoBrl: 900000.00,
      despesasEstimadasVendaFrutosBrl: 100000.00 // Valor Justo Líquido = 800k
    });

    const dataProd = unwrap(resProd);
    expect(dataProd.valorContabilImobilizadoBrl).toBe(5000000.00);
    expect(dataProd.depreciacaoAnualImobilizadoBrl).toBe(250000.00);
    expect(dataProd.valorJustoLiquidoFrutosCpc29Brl).toBe(800000.00);
    expect(dataProd.partidasDobrada.length).toBe(4);
    expect(dataProd.diagnosticoCpc27vs29).toContain('Plantas Portadoras');

    // 1.2 Planta Portadora em Formação
    const resForm = evaluateBearerPlantsCpc27vs29({
      ativoId: 'PLANT-CAFE-02',
      culturaNome: 'Cafezal Catuaí Vermelho',
      estagio: 'EM_FORMACAO_DESENVOLVIMENTO',
      custosAcumuladosFormacaoBrl: 1200000.00,
      vidaUtilProdutivaAnos: 15
    });

    const dataForm = unwrap(resForm);
    expect(dataForm.depreciacaoAnualImobilizadoBrl).toBe(0);
    expect(dataForm.valorContabilImobilizadoBrl).toBe(1200000.00);
    expect(dataForm.partidasDobrada.length).toBe(2);
  });

  it('2. Deve aplicar suspensao de PIS/COFINS de produtor rural e apurar credito presumido agroindustrial (Lei 12.865/13)', () => {
    // 2.1 Aquisição de Produtor Rural PF (Suspensão e Crédito Presumido 50%)
    const resAgro = processAgribusinessPisCofinsSuspensionLaw12865({
      operacaoId: 'SOJA-01',
      agroindustriaNome: 'Soberano Agroindustrial S.A.',
      tipoFornecedor: 'PRODUTOR_RURAL_PESSOA_FISICA',
      valorAquisicaoGraosInNaturaBrl: 10000000.00,
      percentualAliquotaCreditoPresumidoPercent: 50.0 // 0.825% PIS e 3.80% COFINS
    });

    const dataAgro = unwrap(resAgro);
    expect(dataAgro.aquisicaoComSuspensaoPisCofins).toBe(true);
    expect(dataAgro.aliquotaPisPresumidoPercent).toBe(0.825);
    expect(dataAgro.valorCreditoPresumidoPisBrl).toBe(82500.00);
    expect(dataAgro.aliquotaCofinsPresumidoPercent).toBe(3.8);
    expect(dataAgro.valorCreditoPresumidoCofinsBrl).toBe(380000.00);
    expect(dataAgro.totalCreditoPresumidoApuradoBrl).toBe(462500.00);
    expect(dataAgro.diagnosticoFiscal).toContain('SUSPENSÃO DE PIS/COFINS');
  });
});
