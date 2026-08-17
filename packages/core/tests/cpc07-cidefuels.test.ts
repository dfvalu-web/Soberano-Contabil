import { describe, it, expect } from 'vitest';
import {
  processGovernmentGrantsCapitalReserveCpc07,
  processCideFuelsPetroleumTaxEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Subvenções Governamentais e Reserva de Incentivos no PL (CPC 07 R1) & CIDE-Combustíveis (Lei 10.336/01)', () => {
  it('1. Deve reconhecer subvenção no resultado proporcionalmente e destinar para Reserva de Incentivos no PL (CPC 07 R1 & Art. 195-A Lei 6.404/76)', () => {
    const resGrant = processGovernmentGrantsCapitalReserveCpc07({
      subvencaoId: 'SUBV-SUDENE-2026',
      empresaNome: 'Indústria Nordeste Solar S.A.',
      descricaoProjetoIncentivado: 'Implantação de Planta Fabril de Painéis Fotovoltaicos',
      valorTotalSubvencaoRecebidaBrl: 10000000.00,
      vidaUtilAtivoSubvencionadoAnos: 10,
      anoApuracao: 1
    });

    const dataGrant = unwrap(resGrant);
    expect(dataGrant.receitaSubvencaoReconhecidaResultadoAnoBrl).toBe(1000000.00); // 10M / 10 anos
    expect(dataGrant.saldoPassivoSubvencaoDiferidaRemanescenteBrl).toBe(9000000.00);
    expect(dataGrant.valorDestinacaoReservaIncentivosFiscaisPlBrl).toBe(1000000.00);
    expect(dataGrant.partidasDobrada.length).toBe(4);
    expect(dataGrant.diagnosticoCpc07).toContain('CPC 07 R1 & Art. 195-A');
  });

  it('2. Deve apurar CIDE-Combustiveis ad rem e aplicar imunidade na exportacao (Lei 10.336/01 & Art. 149 CF/88)', () => {
    // 2.1 Gasolina Automotiva Mercado Interno (R$ 100/m³)
    const resInt = processCideFuelsPetroleumTaxEngine({
      operacaoId: 'CIDE-GAS-01',
      refinariaNome: 'Refinaria Soberano de Petróleo S.A.',
      tipoCombustivel: 'GASOLINA_AUTOMOTIVA',
      destinacao: 'MERCADO_INTERNO',
      volumeComercializadoM3: 50000, // 50.000 m³
      aliquotaEspecificaAdRemBrlPorM3: 100.00
    });

    const dataInt = unwrap(resInt);
    expect(dataInt.isImunidadeExportacaoConstitucional).toBe(false);
    expect(dataInt.aliquotaAdRemEfetivaBrlPorUnidade).toBe(100.00);
    expect(dataInt.valorCideDevidaBrl).toBe(5000000.00); // 50.000 * 100
    expect(dataInt.diagnosticoFiscal).toContain('CIDE-Combustíveis');

    // 2.2 Exportação de Combustível ao Exterior (Imunidade Constitucional Art. 149 CF/88)
    const resExp = processCideFuelsPetroleumTaxEngine({
      operacaoId: 'CIDE-EXP-02',
      refinariaNome: 'Refinaria Soberano de Petróleo S.A.',
      tipoCombustivel: 'GASOLINA_AUTOMOTIVA',
      destinacao: 'EXPORTACAO_EXTERIOR',
      volumeComercializadoM3: 100000
    });

    const dataExp = unwrap(resExp);
    expect(dataExp.isImunidadeExportacaoConstitucional).toBe(true);
    expect(dataExp.valorCideDevidaBrl).toBe(0);
    expect(dataExp.diagnosticoFiscal).toContain('Imunidade Constitucional');
  });
});
