import { describe, it, expect } from 'vitest';
import {
  evaluateNavalConstructionRetainageCpc47,
  processNavalShipbuildingTaxEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Construção Naval & Retenções com AVP (CPC 47/12) & Desoneração REB (Lei 11.774/08)', () => {
  it('1. Deve reconhecer receita por POC e descontar a valor presente retencoes de garantia (CPC 47 e CPC 12)', () => {
    const resNaval = evaluateNavalConstructionRetainageCpc47({
      projetoId: 'FPSO-01',
      estaleiroNome: 'Estaleiro Soberano Atlântico Sul S.A.',
      embarcacaoNome: 'FPSO Soberano Guanabara',
      precoTotalContratoBrl: 500000000.00, // 500M
      custoTotalOrcadoBrl: 400000000.00, // 400M
      custoIncorridoAcumuladoBrl: 240000000.00, // POC = 60% -> Receita = 300M
      percentualRetencaoGarantiaClientePercent: 10.0, // Retenção = 30M
      taxaDescontoAvpAnualPercent: 10.0,
      prazoLiberacaoRetencaoAnos: 2 // Fator = 1.21 -> VP = 24.793.388,43 -> AVP = 5.206.611,57
    });

    const dataNaval = unwrap(resNaval);
    expect(dataNaval.percentualEvolucaoObraPocPercent).toBe(60.00);
    expect(dataNaval.receitaAcumuladaReconhecidaBrl).toBe(300000000.00);
    expect(dataNaval.faturamentoMilestoneEmitidoBrl).toBe(270000000.00);
    expect(dataNaval.valorRetencaoGarantiaNominalBrl).toBe(30000000.00);
    expect(dataNaval.ajusteValorPresenteAvpRetencaoBrl).toBe(5206611.57);
    expect(dataNaval.valorPresenteRetencaoAtivoNaoCirculanteBrl).toBe(24793388.43);
    expect(dataNaval.partidasDobrada.length).toBe(4);
    expect(dataNaval.diagnosticoCpc47e12).toContain('Construção Naval (CPC 47 / CPC 12)');
  });

  it('2. Deve aplicar aliquota zero de PIS/COFINS e isencao de IPI/ICMS para estaleiro com embarcacao REB (Lei 11.774/08)', () => {
    // 2.1 Com REB
    const resReb = processNavalShipbuildingTaxEngine({
      operacaoId: 'OP-NAVAL-01',
      estaleiroNome: 'Estaleiro Soberano Atlântico Sul S.A.',
      tipoOperacao: 'CONSTRUCAO_NOVA_EMBARCACAO_REB',
      embarcacaoRegistradaNoReb: true,
      valorOperacaoBrl: 100000000.00
    });

    const dataReb = unwrap(resReb);
    expect(dataReb.isDesoneracaoRebAplicavel).toBe(true);
    expect(dataReb.valorPisDevidoBrl).toBe(0);
    expect(dataReb.valorCofinsDevidoBrl).toBe(0);
    expect(dataReb.valorIpiDevidoBrl).toBe(0);
    expect(dataReb.valorIcmsDevidoBrl).toBe(0);
    expect(dataReb.totalTributosIncidentesBrl).toBe(0);
    expect(dataReb.diagnosticoFiscal).toContain('BENEFÍCIO FISCAL INTEGRAL');

    // 2.2 Sem REB (Tributação Integral)
    const resSemReb = processNavalShipbuildingTaxEngine({
      operacaoId: 'OP-NAVAL-02',
      estaleiroNome: 'Oficina Naval Geral Ltda',
      tipoOperacao: 'REPARO_MANUTENCAO_NAVAL',
      embarcacaoRegistradaNoReb: false,
      valorOperacaoBrl: 1000000.00
    });

    const dataSemReb = unwrap(resSemReb);
    expect(dataSemReb.isDesoneracaoRebAplicavel).toBe(false);
    expect(dataSemReb.totalTributosIncidentesBrl).toBeGreaterThan(200000.00);
  });
});
