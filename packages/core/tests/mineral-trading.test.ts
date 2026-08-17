import { describe, it, expect } from 'vitest';
import {
  evaluateMineralResourcesExplorationCpc34,
  processIndirectExportTradingEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Recursos Minerais (CPC 34) & Exportação Indireta (Convênio ICMS 84/2009)', () => {
  it('1. Deve capitalizar gastos geologicos e transferir para producao na viabilidade comercial (CPC 34)', () => {
    // 1.1 Fase Exploratória
    const resExp = evaluateMineralResourcesExplorationCpc34({
      projetoJazidaId: 'JAZIDA-LITIO-01',
      nomeJazidaOuCampo: 'Jazida de Lítio Jequitinhonha',
      gastosEstudosTopograficosGeologicosBrl: 5000000.00,
      gastosPerfuracaoExploratoriaAmostragemBrl: 8000000.00,
      gastosDireitosMinerariosExploracaoBrl: 2000000.00,
      viabilidadeComercialDemonstrada: false
    });

    const dataExp = unwrap(resExp);
    expect(dataExp.totalAtivoExploracaoAvaliacaoCapitalizadoBrl).toBe(15000000.00);
    expect(dataExp.transferidoParaAtivoEmDesenvolvimento).toBe(false);
    expect(dataExp.partidasDobradaRecursosMinerais.length).toBe(2);

    // 1.2 Viabilidade Comercial Atestada
    const resProd = evaluateMineralResourcesExplorationCpc34({
      projetoJazidaId: 'JAZIDA-LITIO-01',
      nomeJazidaOuCampo: 'Jazida de Lítio Jequitinhonha',
      gastosEstudosTopograficosGeologicosBrl: 5000000.00,
      gastosPerfuracaoExploratoriaAmostragemBrl: 8000000.00,
      gastosDireitosMinerariosExploracaoBrl: 2000000.00,
      viabilidadeComercialDemonstrada: true
    });

    const dataProd = unwrap(resProd);
    expect(dataProd.transferidoParaAtivoEmDesenvolvimento).toBe(true);
    expect(dataProd.partidasDobradaRecursosMinerais.length).toBe(2);
    expect(dataProd.diagnosticoCpc34).toContain('Viabilidade comercial atestada');
  });

  it('2. Deve apurar desoneracoes tributarias e controlar prazo de 180 dias na Exportacao Indireta (LC 87/96)', () => {
    // 2.1 Remessa regular dentro de 180 dias
    const resReg = processIndirectExportTradingEngine({
      remessaId: 'EXP-IND-SOJA-01',
      empresaProdutoraNome: 'Agropecuária Cerrado S.A.',
      tradingCompanyDestinatariaNome: 'Global Commodities Trading Ltda',
      valorMercadoriaBrl: 5000000.00,
      diasDecorridosDesdeRemessa: 45,
      despachoDuEConcluido: false,
      aliquotaIcmsInternaEstadoOrigemPercent: 18
    });

    const dataReg = unwrap(resReg);
    expect(dataReg.cfopUtilizado).toBe('5.501');
    expect(dataReg.desoneracoesAplicadas.icmsNaoIncidenteBrl).toBe(900000.00); // 18% de 5M
    expect(dataReg.desoneracoesAplicadas.ipiIsentoSuspensoBrl).toBe(500000.00); // 10% de 5M
    expect(dataReg.desoneracoesAplicadas.pisCofinsAliquotaZero9_25PercentBrl).toBe(462500.00); // 9.25% de 5M
    expect(dataReg.desoneracoesAplicadas.totalDesoneracaoExportacaoBrl).toBe(1862500.00);
    expect(dataReg.prazo180DiasVencido).toBe(false);
    expect(dataReg.icmsCobravelPorNaoExportacaoBrl).toBe(0);

    // 2.2 Remessa com prazo de 180 dias estourado sem DU-E
    const resVenc = processIndirectExportTradingEngine({
      remessaId: 'EXP-IND-CAFE-02',
      empresaProdutoraNome: 'Café do Planalto Ltda',
      tradingCompanyDestinatariaNome: 'Bravo Export Trading S.A.',
      valorMercadoriaBrl: 2000000.00,
      diasDecorridosDesdeRemessa: 195, // > 180 dias
      despachoDuEConcluido: false,
      aliquotaIcmsInternaEstadoOrigemPercent: 18
    });

    const dataVenc = unwrap(resVenc);
    expect(dataVenc.prazo180DiasVencido).toBe(true);
    expect(dataVenc.icmsCobravelPorNaoExportacaoBrl).toBe(360000.00); // 18% de 2M
    expect(dataVenc.diagnosticoExportacao).toContain('ALERTA FISCAL: Prazo de 180 dias expirado');
  });
});
