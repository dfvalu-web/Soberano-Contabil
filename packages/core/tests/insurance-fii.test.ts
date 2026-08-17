import { describe, it, expect } from 'vitest';
import {
  evaluateInsuranceContractGroupCpc50,
  calculateFiiFiagroTaxation,
  unwrap
} from '../src/index.js';

describe('TESTES: Contratos de Seguro (CPC 50 / IFRS 17) & Tributação de FIIs / Fiagro (Lei 14.754/2023)', () => {
  it('1. Deve apurar CSM e amortizacao de receita de servicos de seguro pelo modelo BBA (CPC 50)', () => {
    const res = evaluateInsuranceContractGroupCpc50({
      grupoContratosId: 'GRP-SEGURO-PATRIMONIAL-01',
      ramoSeguroNome: 'Seguro de Grandes Riscos Industriais',
      totalPremiosReceberEsperadosVpBrl: 10000000.00, // 10M Prêmios VP
      totalSinistrosDespesasEsperadosVpBrl: 6000000.00, // 6M Sinistros VP
      ajusteDeRiscoNaoFinanceiroVpBrl: 1000000.00, // 1M Ajuste Risco (Fluxos Cumprimento = 7M)
      mesesVigenciaCoberturaTotal: 24, // 24 meses
      mesesDecorridosNoPeriodo: 6 // 6 meses (25% do tempo)
    });

    const data = unwrap(res);
    expect(data.fluxosCaixaCumprimentoTotalBrl).toBe(7000000.00);
    expect(data.margemServicoContratualCsmInicialBrl).toBe(3000000.00); // 10M - 7M = 3M CSM
    // Amortização 6/24 = 25% de 3M = 750.000,00
    expect(data.csmAmortizadaResultadoPeriodoBrl).toBe(750000.00);
    expect(data.saldoCsmRemanescentePassivoBrl).toBe(2250000.00);
    expect(data.partidasDobradaSeguros.length).toBe(2);
    expect(data.diagnosticoCpc50).toContain('CPC 50 / IFRS 17 (Modelo BBA)');
  });

  it('2. Deve apurar distribuicao de 95% e aplicar a regra dos 100 cotistas para isencao de IRPF em FIIs (Lei 14.754/2023)', () => {
    // 2.1 Fundo com mais de 100 cotistas (Isenção válida)
    const resIsento = calculateFiiFiagroTaxation({
      fundoId: 'FII-LOGISTICA-01',
      nomeFundo: 'Soberano Real Estate FII',
      tipoFundo: 'FII_IMOBILIARIO',
      lucroCaixaSemestralApuradoBrl: 10000000.00,
      totalCotistasCadastrados: 500, // > 100 cotistas
      cotasNegociadasEmBolsa: true,
      alienacaoCotasGanhoCapitalBrl: 200000.00
    });

    const dataIsento = unwrap(resIsento);
    expect(dataIsento.distribuicaoObrigatoria95PercentBrl).toBe(9500000.00); // 95%
    expect(dataIsento.cotistasElegiveisIsencaoIrpf).toBe(true);
    expect(dataIsento.aliquotaIrpfRendimentosPercent).toBe(0); // 0% Isento
    expect(dataIsento.impostoRendaGanhoCapitalAlienacao20Percent).toBe(40000.00); // 20% de 200k
    expect(dataIsento.diagnosticoFii).toContain('ISENTOS DE IRPF');

    // 2.2 Fundo fechado / exclusivo (< 100 cotistas)
    const resTributado = calculateFiiFiagroTaxation({
      fundoId: 'FII-EXCLUSIVO-02',
      nomeFundo: 'Alpha Family Office FII',
      tipoFundo: 'FII_IMOBILIARIO',
      lucroCaixaSemestralApuradoBrl: 5000000.00,
      totalCotistasCadastrados: 40, // < 100 cotistas => Tributado
      cotasNegociadasEmBolsa: false
    });

    const dataTributado = unwrap(resTributado);
    expect(dataTributado.cotistasElegiveisIsencaoIrpf).toBe(false);
    expect(dataTributado.aliquotaIrpfRendimentosPercent).toBe(20); // 20% Tributável
    expect(dataTributado.diagnosticoFii).toContain('TRIBUTADOS a 20%');
  });
});
