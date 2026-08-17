import { describe, it, expect } from 'vitest';
import {
  evaluateFirstTimeAdoptionCpc37Ifrs1,
  evaluateInsurancePaaModelCpc50,
  unwrap
} from '../src/index.js';

describe('TESTES: Adoção Inicial IFRS (CPC 37) & Seguros Modelo PAA (CPC 50 / IFRS 17)', () => {
  it('1. Deve apurar ajustes cumulativos de primeira adocao diretamente no PL de abertura (CPC 37 / IFRS 1)', () => {
    const resCpc37 = evaluateFirstTimeAdoptionCpc37Ifrs1({
      transicaoId: 'TRANS-IFRS-01',
      empresaNome: 'Soberano Corporação Global S.A.',
      dataTransicao: '2026-01-01',
      patrimonioLiquidoAnteriorBrGaapBrl: 500000000.00, // 500M
      ajusteCustoAtribuidoImobilizadoBrl: 80000000.00, // +80M
      ajusteReconhecimentoArrendamentoIfrs16Brl: 0,
      ajusteAjusteValorPresenteAvpBrl: 0,
      ajusteTributosDiferidosSobreAjustesBrl: 27200000.00 // -27,2M (34%)
    });

    const dataCpc37 = unwrap(resCpc37);
    expect(dataCpc37.ajusteLiquidoTransicaoPlBrl).toBe(52800000.00); // 80M - 27.2M = 52.8M
    expect(dataCpc37.patrimonioLiquidoAberturaIfrsBrl).toBe(552800000.00); // 500M + 52.8M
    expect(dataCpc37.partidasDobradaAbertura.length).toBe(3);
    expect(dataCpc37.diagnosticoCpc37).toContain('PL DE ABERTURA IFRS: R$ 552800000.00');
  });

  it('2. Deve mensurar contratos de seguros gerais pelo modelo simplificado PAA (CPC 50 / IFRS 17)', () => {
    const resPaa = evaluateInsurancePaaModelCpc50({
      apoliceGrupoId: 'APOL-AUTO-01',
      seguradoraNome: 'Soberana Companhia de Seguros Gerais S.A.',
      ramoSeguro: 'Seguro de Automóveis e Frotas Corporativas',
      premioTotalRecebidoBrl: 12000000.00, // 12M
      custosAquisicaoApoliceBrl: 1200000.00, // 1.2M Comissões
      mesesDecorridosCobertura: 4, // 4 de 12 meses
      prazoTotalCoberturaMeses: 12,
      sinistrosIncorridosAvisadosBrl: 1500000.00, // 1.5M
      ajusteRiscoNaoFinanceiroBrl: 150000.00 // 150k Risk Adjustment
    });

    const dataPaa = unwrap(resPaa);
    expect(dataPaa.receitaSeguroReconhecidaDrebBrl).toBe(4000000.00); // 12M * (4/12) = 4M
    expect(dataPaa.passivoCoberturaRemanescenteLrcBrl).toBe(6800000.00); // 12M - 1.2M - 4M = 6.8M
    expect(dataPaa.passivoSinistrosIncorridosLicBrl).toBe(1650000.00); // 1.5M + 150k = 1.65M
    expect(dataPaa.resultadoTecnicoSeguroDrebBrl).toBe(2500000.00); // 4M - 1.5M = 2.5M
    expect(dataPaa.partidasDobrada.length).toBe(3);
    expect(dataPaa.diagnosticoCpc50Paa).toContain('CPC 50 / IFRS 17');
  });
});
