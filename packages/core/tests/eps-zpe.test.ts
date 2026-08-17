import { describe, it, expect } from 'vitest';
import {
  calculateEarningsPerShare,
  calculateZpeTaxSuspension,
  unwrap
} from '../src/index.js';

describe('TESTES: Lucro por Ação LPA (CPC 41 / IAS 33) & Zonas de Exportação (ZPE)', () => {
  it('1. Deve calcular LPA Basico e Diluido (CPC 41) considerando opcoes outorgadas', () => {
    const res = calculateEarningsPerShare({
      periodoAno: 2026,
      lucroLiquidoDoExercicio: 5000000.00,
      dividendosAcoesPreferenciaisNaoParticipantes: 500000.00, // Lucro Ordinário = 4.500.000,00
      mediaPonderadaAcoesOrdinarias: 1000000, // 1 milhão de ações => LPA Básico = 4.5000
      opcoesDeAcoesOutorgadas: {
        quantidadeOpcoes: 200000,
        precoExercicioUnitario: 10.00,
        precoMedioMercadoAcao: 20.00 // Fator diluição = 1 - 10/20 = 50% => 100k ações potenciais
      }
    });

    const data = unwrap(res);
    expect(data.lucroAtribuivelAosAcionistasOrdinarios).toBe(4500000.00);
    expect(data.lpaBasicoBrlPorAcao).toBe(4.5000);
    expect(data.houveEfeitoDilutivo).toBe(true);
    expect(data.acoesIncrementaisPotenciais).toBe(100000);
    // LPA Diluído = 4.500.000 / 1.100.000 = 4.0909
    expect(data.lpaDiluidoBrlPorAcao).toBe(4.0909);
    expect(data.diagnosticoCpc41).toContain('LPA Básico: R$ 4.5000');
  });

  it('2. Deve calcular suspensao total de tributos federais e aduaneiros em ZPE (Lei 11.508/2007)', () => {
    const res = calculateZpeTaxSuspension({
      empresaHabilitadaId: 'IND-ZPE-PECEM-01',
      zpeLocalizacaoNome: 'ZPE do Pecém (Ceará)',
      numeroAtoDeclaratorioExecutivo: 'ADE-SRRF03-2026-001',
      aquisicoesMercadoInternoBensServicos: 10000000.00, // PIS/COFINS 9.25% (925k) + IPI 10% (1M)
      importacoesDiretasInsumosMaquinasUsd: 2000000.00, // USD 2M
      taxaCambialPtaxAduaneira: 5.00 // CIF BRL 10M => II 14% (1.4M) + PIS/COFINS-Imp 11.75% (1.175M)
    });

    const data = unwrap(res);
    expect(data.totalAquisicoesInternasBrl).toBe(10000000.00);
    expect(data.totalImportacoesCifBrl).toBe(10000000.00);
    expect(data.tributosSuspensosApurados.pisCofinsInternoSuspenso9_25Percent).toBe(925000.00);
    expect(data.tributosSuspensosApurados.ipiInternoSuspensoEstimado10Percent).toBe(1000000.00);
    expect(data.tributosSuspensosApurados.impostoImportacaoSuspenso14Percent).toBe(1400000.00);
    expect(data.tributosSuspensosApurados.pisCofinsImportacaoSuspenso11_75Percent).toBe(1175000.00);
    expect(data.tributosSuspensosApurados.totalSuspensaoTributariaZpeBrl).toBe(4500000.00);
    expect(data.diagnosticoZpe).toContain('ZPE do Pecém');
  });
});
