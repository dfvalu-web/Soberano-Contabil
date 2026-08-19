import { describe, it, expect } from 'vitest';
import {
  processOfficeFamilyHoldingSuccessionEngine,
  processOfficeAssetProtectionItcmdEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Planejamento Sucessório, Holding Familiar & Blindagem', () => {
  it('1. Deve simular economia tributaria e sucessoria comparando Inventario vs Holding Familiar', () => {
    const resHold = processOfficeFamilyHoldingSuccessionEngine({
      familiaNome: 'Família Silveira Prado',
      valorImoveisCustoHistoricoIrpfBrl: 3000000.00,
      valorImoveisMercadoBrl: 10000000.00, // 10M
      rendaAluguelMensalBrl: 50000.00,
      aliquotaItcmdEstadoPercent: 8.0, // 8% SP/RJ
      percentualHonorariosInventarioPercent: 10.0, // 10%
      percentualCustasJudiciaisCartorioPercent: 3.0 // 3% -> Total Inventário = 21% de 10M = 2.1M
    });

    const dataHold = unwrap(resHold);
    expect(dataHold.custoTotalInventarioTradicionalBrl).toBe(2100000.00);
    expect(dataHold.custoTotalConstituicaoHoldingBrl).toBeLessThan(250000.00);
    expect(dataHold.economiaTributariaSucessoriaBrl).toBeGreaterThan(1800000.00);
    expect(dataHold.economiaMensalAluguelPjVsPfBrl).toBeGreaterThan(8000.00);
    expect(dataHold.statusPlanejamento).toBe('PLANEJAMENTO_SUCESSORIO_ESTRUTURADO_COM_SUCESSO');
    expect(dataHold.diagnosticoPlanejamento).toContain('Economia na Sucessão');
  });

  it('2. Deve estruturar clausulas restritivas societarias garantindo blindagem patrimonial maxima', () => {
    const resProt = processOfficeAssetProtectionItcmdEngine({
      familiaNome: 'Família Silveira Prado',
      totalPatriarcasDoadores: 2,
      totalHerdeirosDonatarios: 3,
      possuiReservaUsufrutoVitalicio: true,
      possuiClausulaIncomunicabilidade: true,
      possuiClausulaImpenhorabilidade: true,
      possuiClausulaInalienabilidade: true,
      possuiClausulaReversao: true
    });

    const dataProt = unwrap(resProt);
    expect(dataProt.scoreBlindagemPatrimonialPercent).toBe(100);
    expect(dataProt.clausulasAtivas.length).toBe(5);
    expect(dataProt.nivelProtecaoPatrimonial).toBe('BLINDAGEM_MAXIMA_ESTRUTURADA');
    expect(dataProt.statusProtecao).toBe('CONTRATO_SOCIAL_HOLDING_BLINDADO');
    expect(dataProt.diagnosticoProtecao).toContain('BLINDAGEM_MAXIMA_ESTRUTURADA');
  });
});
