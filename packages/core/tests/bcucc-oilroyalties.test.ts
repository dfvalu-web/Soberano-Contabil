import { describe, it, expect } from 'vitest';
import {
  processCommonControlBcucc,
  processOilRoyaltiesSpecialParticipationTaxEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Reestruturações sob Controle Comum (CPC 15 BCUCC) & Royalties do Petróleo (Lei 9.478/97)', () => {
  it('1. Deve aplicar metodo predecessor em combinacao sob controle comum com ajuste no PL e sem goodwill (CPC 15 / IFRS 3)', () => {
    const resBcucc = processCommonControlBcucc({
      operacaoId: 'BCUCC-2026-01',
      holdingControladoraNome: 'Soberano Global Holdings S.A.',
      empresaAdquirenteNome: 'Soberano Tech Operações S.A.',
      empresaTransferidaNome: 'Soberano Logística e Armazéns Ltda',
      valorContraprestacaoPagaBrl: 18000000.00,
      valorContabilAtivosTransferidosBrl: 20000000.00, // Predecessor Book Value
      valorContabilPassivosTransferidosBrl: 5000000.00 // PL Contábil = 15M
    });

    const dataBcucc = unwrap(resBcucc);
    expect(dataBcucc.patrimonioLiquidoContabilTransferidoBrl).toBe(15000000.00);
    expect(dataBcucc.isCriacaoGoodwillVedada).toBe(true);
    expect(dataBcucc.ajusteControleComumPatrimonioLiquidoBrl).toBe(3000000.00); // 18M - 15M = 3M no PL
    expect(dataBcucc.partidasDobrada.length).toBe(4);
    expect(dataBcucc.diagnosticoBcucc).toContain('GOODWILL VEDADO');
  });

  it('2. Deve apurar Royalties ANP e Participacao Especial sobre petroleo e gas (Lei 9.478/97 & Dec. 2.705/98)', () => {
    const resOil = processOilRoyaltiesSpecialParticipationTaxEngine({
      campoProducaoId: 'CAMPO-BUZIOS-01',
      concessionariaNome: 'Petróleo & Gás Soberano S.A.',
      campoNome: 'Campo de Búzios Pré-Sal',
      volumeProducaoBarrisBoe: 1000000, // 1 milhão de barris BOE
      precoReferenciaAnpBrlPorBoe: 400.00, // VBP = 400M
      aliquotaRoyaltiesPercent: 10.0, // Royalties = 40M
      custosOperacionaisOpexBrl: 100000000.00, // 100M Opex
      depreciacaoTrimestralCapexBrl: 60000000.00, // 60M Capex -> Deduções = 200M -> Base PE = 200M
      aliquotaParticipacaoEspecialPercent: 20.0 // PE = 40M
    });

    const dataOil = unwrap(resOil);
    expect(dataOil.valorBrutoProducaoAnpBrl).toBe(400000000.00);
    expect(dataOil.valorRoyaltiesDevidosAnpBrl).toBe(40000000.00);
    expect(dataOil.baseCalculoParticipacaoEspecialBrl).toBe(200000000.00);
    expect(dataOil.valorParticipacaoEspecialDevidaBrl).toBe(40000000.00);
    expect(dataOil.totalParticipacoesGovernamentaisBrl).toBe(80000000.00);
    expect(dataOil.diagnosticoFiscal).toContain('Petróleo e Gás');
  });
});
