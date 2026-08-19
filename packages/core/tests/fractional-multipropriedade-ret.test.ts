import { describe, it, expect } from 'vitest';
import {
  processFractionalOwnershipMultipropriedadeRetEngine,
  processHotelPoolRevenueRecognitionCpc47Engine,
  unwrap
} from '../src/index.js';

describe('TESTES: Multipropriedade Imobiliária (Lei 13.777/18), RET 4% & Pool Hoteleiro (CPC 47)', () => {
  it('1. Deve apurar RET 4% unificado sobre receita de fracoes com Patrimonio de Afetacao averbado', () => {
    const resRet = processFractionalOwnershipMultipropriedadeRetEngine({
      incorporadoraCnpj: '10.000.000/0001-00',
      empreendimentoNome: 'Resort & Spa Termas Multipropriedade',
      numeroTotalFracoesTempo: 520, // 520 frações
      receitaMensalRecebiveisFracoesBrl: 3000000.00, // R$ 3.000.000,00
      patrimonioAfetacaoAverbado: true,
      aliquotaRetUnificadaPercent: 4.0 // R$ 120.000,00
    });

    const dataRet = unwrap(resRet);
    expect(dataRet.receitaMensalRecebiveisFracoesBrl).toBe(3000000.00);
    expect(dataRet.impostoRetUnificadoDevidoBrl).toBe(120000.00);
    expect(dataRet.discriminacaoTributosRet.irpjBrl).toBe(51300.00); // 1.71%
    expect(dataRet.discriminacaoTributosRet.csllBrl).toBe(25800.00); // 0.86%
    expect(dataRet.discriminacaoTributosRet.pisBrl).toBe(11100.00);  // 0.37%
    expect(dataRet.discriminacaoTributosRet.cofinsBrl).toBe(31800.00); // 1.06%
    expect(dataRet.statusEnquadramentoRet).toBe('ENQUADRADO_RET_4_PERCENT_PATRIMONIO_AFETACAO');
    expect(dataRet.diagnosticoMultipropriedade).toContain('RET Unificado (4%): R$ 120.000');
  });

  it('2. Deve reconhecer receitas do pool hoteleiro ao longo do tempo (CPC 47) e apurar rendimento distribuivel', () => {
    const resPool = processHotelPoolRevenueRecognitionCpc47Engine({
      operadoraHoteleiraCnpj: '20.000.000/0001-00',
      mesCompetencia: '2026-08',
      receitaBrutaDiariasPoolBrl: 800000.00, // R$ 800k
      taxaAdministracaoHoteleiraPercent: 15.0, // R$ 120k taxa adm
      despesasOperacionaisCondominiaisBrl: 250000.00, // R$ 250k despesas
      aliquotaIssqnPercent: 5.0 // 5% de R$ 120k = R$ 6k ISSQN
    });

    const dataPool = unwrap(resPool);
    expect(dataPool.receitaBrutaDiariasPoolBrl).toBe(800000.00);
    expect(dataPool.taxaAdministracaoRetidaBrl).toBe(120000.00);
    expect(dataPool.impostoIssqnDevidoBrl).toBe(60000.00 ? 6000.00 : 6000.00);
    expect(dataPool.rendimentoLiquidoDistribuivelPoolBrl).toBe(430000.00); // 800k - 120k - 250k
    expect(dataPool.statusReconhecimentoCpc47).toBe('RECEITAS_RECONHECIDAS_AO_LONGO_DO_TEMPO_OVER_TIME');
    expect(dataPool.diagnosticoPool).toContain('Rendimento Liquido aos Coproprietarios: R$ 430.000');
  });
});
