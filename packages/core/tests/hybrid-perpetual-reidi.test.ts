import { describe, it, expect } from 'vitest';
import {
  processHybridPerpetualNotesCpc39,
  processReidiInfrastructureTaxEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Títulos Híbridos Perpétuos (CPC 39) & Benefício Fiscal REIDI (Lei 11.488)', () => {
  it('1. Deve classificar debentures perpetuas com cupons discricionarios como Patrimonio Liquido (CPC 39)', () => {
    const resHybrid = processHybridPerpetualNotesCpc39({
      instrumentoId: 'DEB-PERPETUA-01',
      emissorNome: 'Soberano Energia Renovável S.A.',
      valorEmissaoPrincipalBrl: 50000000.00, // 50M
      taxaCupomAnualPercent: 8.50, // 8.5% a.a. = 4.25M
      possuiObrigacaoContratualResgate: false, // Perpétuo
      possuiDiscricionariedadeDiferirCupons: true // Discricionário
    });

    const dataHybrid = unwrap(resHybrid);
    expect(dataHybrid.classificacaoContabil).toBe('PATRIMONIO_LIQUIDO_EQUITY');
    expect(dataHybrid.tratamentoContabilCupom).toBe('DISTRIBUICAO_LUCROS_EQUITY');
    expect(dataHybrid.valorCupomAnualBrl).toBe(4250000.00);
    expect(dataHybrid.lancamentoEmissao.credito).toContain('2.4.1.08 - Outros Instrumentos Patrimoniais');
    expect(dataHybrid.diagnosticoCpc39).toContain('CLASSIFICACAO: PATRIMONIO_LIQUIDO_EQUITY');
  });

  it('2. Deve apurar desoneracao de 9,25% de PIS/COFINS em Capex de infraestrutura habilitado no REIDI (Lei 11.488/07)', () => {
    const resReidi = processReidiInfrastructureTaxEngine({
      projetoId: 'EOLICA-REIDI-01',
      projetoNome: 'Complexo Eólico Soberano V',
      setorInfraestrutura: 'ENERGIA',
      anoExercicio: 2026,
      aquisicaoMaquinasEquipamentosBrl: 50000000.00, // 50M
      aquisicaoServicosObrasConstrucaoBrl: 30000000.00, // 30M
      importacaoBensCapitalBrl: 20000000.00 // 20M -> Total 100M Capex
    });

    const dataReidi = unwrap(resReidi);
    expect(dataReidi.valorTotalCapexHabilitadoBrl).toBe(100000000.00);
    expect(dataReidi.suspensaoPis165PercentBrl).toBe(1650000.00); // 1.65% de 100M
    expect(dataReidi.suspensaoCofins760PercentBrl).toBe(7600000.00); // 7.60% de 100M
    expect(dataReidi.totalDesoneracaoReidi925PercentBrl).toBe(9250000.00); // 9.25%
    expect(dataReidi.diagnosticoReidi).toContain('Total Desoneracao REIDI (9,25%): R$ 9250000.00');
  });
});
