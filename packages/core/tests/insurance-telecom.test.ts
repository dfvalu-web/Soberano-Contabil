import { describe, it, expect } from 'vitest';
import {
  evaluateInsuranceBbaGmmCpc50,
  processTelecomFustFunttelTaxEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Seguros IFRS 17 / CPC 50 BBA & Telecomunicações FUST/FUNTTEL (Leis 9.998/00 e 10.052/00)', () => {
  it('1. Deve decompor passivo de seguros em PVFCF, RA e CSM e identificar grupos onerosos (CPC 50 / IFRS 17)', () => {
    // 1.1 Grupo Lucrativo com CSM
    const resLucr = evaluateInsuranceBbaGmmCpc50({
      grupoContratosId: 'SEG-VIDA-2026',
      seguradoraNome: 'Soberano Seguros S.A.',
      carteiraRamo: 'Seguro de Vida e Riscos Pessoais',
      premioRecebidoVistaBrl: 10000000.00,
      valorPresenteFluxosCaixaFuturosSinistrosBrl: 7000000.00, // PVFCF = 7M
      ajusteRiscoNaoFinanceiroBrl: 1000000.00, // RA = 1M -> FCF = 8M
      prazoCoberturaAnos: 5
    });

    const dataLucr = unwrap(resLucr);
    expect(dataLucr.fluxosCaixaCumprimentoBrl).toBe(8000000.00);
    expect(dataLucr.margemServicoContratualInicialCsmBrl).toBe(2000000.00); // CSM = 10M - 8M = 2M
    expect(dataLucr.isGrupoContratoOneroso).toBe(false);
    expect(dataLucr.liberacaoCsmAno1ResultadoBrl).toBe(400000.00); // 2M / 5 anos
    expect(dataLucr.partidasDobradaReconhecimentoInicial.length).toBe(3);
    expect(dataLucr.diagnosticoCpc50).toContain('CSM Constituída');

    // 1.2 Grupo Oneroso com Perda Imediata
    const resOner = evaluateInsuranceBbaGmmCpc50({
      grupoContratosId: 'SEG-AUTO-ONEROSO',
      seguradoraNome: 'Soberano Auto Seguros S.A.',
      carteiraRamo: 'Seguro Automotivo Frotas',
      premioRecebidoVistaBrl: 5000000.00,
      valorPresenteFluxosCaixaFuturosSinistrosBrl: 5500000.00,
      ajusteRiscoNaoFinanceiroBrl: 500000.00, // FCF = 6M -> Oneroso em 1M
      prazoCoberturaAnos: 1
    });

    const dataOner = unwrap(resOner);
    expect(dataOner.isGrupoContratoOneroso).toBe(true);
    expect(dataOner.margemServicoContratualInicialCsmBrl).toBe(0);
    expect(dataOner.perdaImediataOnerosidadeResultadoBrl).toBe(1000000.00);
    expect(dataOner.partidasDobradaReconhecimentoInicial.length).toBe(3);
    expect(dataOner.diagnosticoCpc50).toContain('GRUPO ONEROSO');
  });

  it('2. Deve apurar FUST (1,0%) e FUNTTEL (0,5%) em telecomunicacoes e nao incidencia em SVA internet (Leis 9.998/00 e 10.052/00)', () => {
    // 2.1 Telecomunicações STFC/SMP com Dedução de Interconexão e FISTEL
    const resTel = processTelecomFustFunttelTaxEngine({
      operacaoId: 'TEL-01',
      operadoraNome: 'Fibra & Telecomunicações S.A.',
      tipoServico: 'SERVICO_TELECOMUNICACOES_STFC_SMP_SCM',
      receitaBrutaOperacionalBrl: 10000000.00,
      deducoesInterconexaoRepassesBrl: 2000000.00, // Base = 8M
      taxaFiscalizacaoInstalacaoTfiBrl: 50000.00
    });

    const dataTel = unwrap(resTel);
    expect(dataTel.baseCalculoContribuicoesSetoriaisBrl).toBe(8000000.00);
    expect(dataTel.aliquotaFustPercent).toBe(1.0);
    expect(dataTel.valorFustDevidoBrl).toBe(80000.00); // 1% de 8M
    expect(dataTel.aliquotaFunttelPercent).toBe(0.5);
    expect(dataTel.valorFunttelDevidoBrl).toBe(40000.00); // 0.5% de 8M
    expect(dataTel.totalContribuicoesSetoriaisBrl).toBe(120000.00);
    expect(dataTel.valorFistelTfiBrl).toBe(50000.00);
    expect(dataTel.diagnosticoFiscal).toContain('FUST (1,0%)');

    // 2.2 SVA / Provedor de Internet (Não Incidência de Fundos Setoriais)
    const resSva = processTelecomFustFunttelTaxEngine({
      operacaoId: 'SVA-02',
      operadoraNome: 'Provedor Internet Banda Larga Ltda',
      tipoServico: 'SERVICO_VALOR_ADICIONADO_SVA_INTERNET',
      receitaBrutaOperacionalBrl: 500000.00
    });

    const dataSva = unwrap(resSva);
    expect(dataSva.totalContribuicoesSetoriaisBrl).toBe(0);
    expect(dataSva.diagnosticoFiscal).toContain('NÃO INCIDÊNCIA de FUST e FUNTTEL');
  });
});
