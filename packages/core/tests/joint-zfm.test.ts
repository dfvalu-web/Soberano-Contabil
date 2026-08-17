import { describe, it, expect } from 'vitest';
import {
  evaluateJointArrangementCpc19,
  calculateZfmSuframaTaxBenefits,
  unwrap
} from '../src/index.js';

describe('TESTES: Negócios em Conjunto (CPC 19 / IFRS 11) & Zona Franca de Manaus (SUFRAMA)', () => {
  it('1. Deve contabilizar Operacao em Conjunto proporcionalmente e Joint Venture por MEP (CPC 19)', () => {
    // 1.1 Operação em Conjunto (Consórcio 40%)
    const resOperacao = evaluateJointArrangementCpc19({
      acordoId: 'CONSORCIO-OBRA-01',
      nomeAcordoConsorcio: 'Consórcio Construtor Hidrelétrica',
      tipoAcordo: 'OPERACAO_EM_CONJUNTO',
      percentualParticipacaoEntidade: 40,
      dadosOperacaoConjunta: {
        ativosTotaisDoConsorcio: 100000000.00, // 40% = 40M
        passivosTotaisDoConsorcio: 30000000.00, // 40% = 12M
        receitasTotaisDoConsorcio: 50000000.00, // 40% = 20M
        despesasTotaisDoConsorcio: 35000000.00  // 40% = 14M
      }
    });

    const dataOp = unwrap(resOperacao);
    expect(dataOp.tipoAcordo).toBe('OPERACAO_EM_CONJUNTO');
    expect(dataOp.impactoPatrimonialLiquidoBrl).toBe(28000000.00); // 40M - 12M
    expect(dataOp.impactoResultadoExercicioBrl).toBe(6000000.00); // 20M - 14M
    expect(dataOp.partidasContabeisApuradas.length).toBe(3);

    // 1.2 Joint Venture (MEP - 50%)
    const resJv = evaluateJointArrangementCpc19({
      acordoId: 'JV-LOGISTICA-02',
      nomeAcordoConsorcio: 'Intermodal Logistics JV',
      tipoAcordo: 'EMPREENDIMENTO_CONTROLADO_CONJUNTO',
      percentualParticipacaoEntidade: 50,
      dadosJointVentureMep: {
        patrimonioLiquidoInicialJointVenture: 20000000.00,
        lucroLiquidoGeradoJointVenture: 4000000.00 // 50% = 2M MEP
      }
    });

    const dataJv = unwrap(resJv);
    expect(dataJv.tipoAcordo).toBe('EMPREENDIMENTO_CONTROLADO_CONJUNTO');
    expect(dataJv.impactoResultadoExercicioBrl).toBe(2000000.00);
    expect(dataJv.partidasContabeisApuradas.length).toBe(2);
    expect(dataJv.diagnosticoCpc19).toContain('Método da Equivalência Patrimonial');
  });

  it('2. Deve apurar desoneracoes tributarias e credito estimulo de ICMS na ZFM / SUFRAMA (Dec-Lei 288/67)', () => {
    const res = calculateZfmSuframaTaxBenefits({
      operacaoTipo: 'VENDA_NACIONAL_DESTINO_ZFM',
      inscricaoSuframaDestinatario: 'SUFRAMA-MANAUS-998877',
      valorBrutoMercadoriasBrl: 1000000.00, // R$ 1.000.000,00
      aliquotaIpiPadraoPercent: 15, // IPI Isento = 150.000,00
      aliquotaIcmsOrigemPercent: 7, // ICMS Desonerado = 70.000,00
      percentualCreditoEstimuloIcmsAm: 75 // Crédito Estímulo 75% = 52.500,00
    });

    const data = unwrap(res);
    expect(data.desoneracaoPisCofinsAliquotaZero9_25Percent).toBe(92500.00); // 9.25%
    expect(data.desoneracaoIsencaoIpiBrl).toBe(150000.00); // 15%
    expect(data.desoneracaoIcmsDescontoPrecoBrl).toBe(70000.00); // 7%
    expect(data.creditoEstimuloIcmsAmazonasBrl).toBe(52500.00); // 75% de 70k
    expect(data.totalDesoneracaoEconomicoFiscalBrl).toBe(365000.00);
    expect(data.diagnosticoSuframaZfm).toContain('SUFRAMA nº SUFRAMA-MANAUS-998877');
  });
});
