import { describe, it, expect } from 'vitest';
import {
  processQualifyingAssetsBorrowingCostsCpc20,
  processLeiDoBemInnovationRdTaxEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Capitalização de Juros em Capex (CPC 20) & Lei do Bem P&D (Lei 11.196/05)', () => {
  it('1. Deve calcular juros especificos e gerais ativados no imobilizado em construcao conforme CPC 20 / IAS 23', () => {
    const resBorrowing = processQualifyingAssetsBorrowingCostsCpc20({
      projetoId: 'PRJ-EXPANSAO-01',
      descricaoAtivoQualificavel: 'Construção de Nova Fábrica de Biocombustíveis',
      desembolsoMedioPeriodoBrl: 10000000.00,
      financiamentoEspecificoBrl: 6000000.00,
      taxaJurosEspecificoPercent: 12.0, // R$ 720k bruto
      financiamentoGeralBrl: 4000000.00,
      taxaMediaPonderadaGeralPercent: 14.5, // R$ 580k
      receitaFinanceiraAplicacaoTemporariaBrl: 50000.00 // R$ 720k - 50k = R$ 670k
    });

    const dataBorrowing = unwrap(resBorrowing);
    expect(dataBorrowing.jurosEspecificosCapitalizadosBrl).toBe(670000.00);
    expect(dataBorrowing.jurosGeraisCapitalizadosBrl).toBe(580000.00);
    expect(dataBorrowing.totalJurosCapitalizadosImobilizadoBrl).toBe(1250000.00); // 670k + 580k
    expect(dataBorrowing.statusElegibilidadeCpc20).toBe('ATIVO_QUALIFICAVEL_CAPITALIZACAO_ATIVA');
    expect(dataBorrowing.lancamentoContabilSugerido.debitoImobilizadoEmAndamentoBrl).toBe(1250000.00);
    expect(dataBorrowing.diagnosticoCpc20).toContain('Total Ativado no Capex: R$ 1250000.00');
  });

  it('2. Deve apurar exclusao da Lei do Bem (80% com patente) no Lucro Real com economia de 34% IRPJ/CSLL', () => {
    const resLeiDoBem = processLeiDoBemInnovationRdTaxEngine({
      empresaCnpj: '12.345.678/0001-90',
      anoCalendario: 2026,
      totalDispendiosPdOperacionaisBrl: 2000000.00, // R$ 2M
      houveIncrementoPesquisadoresAcima5Percent: true,
      obtevePatenteRegistradaNoAno: true, // Garante 80% de exclusão
      lucroRealAntesDoIncentivoBrl: 5000000.00 // R$ 5M
    });

    const dataLeiDoBem = unwrap(resLeiDoBem);
    expect(dataLeiDoBem.percentualExclusaoLalurPercent).toBe(80);
    expect(dataLeiDoBem.valorExclusaoLalurBrl).toBe(1600000.00); // 80% de R$ 2M
    expect(dataLeiDoBem.economiaTributariaIrpjCsllBrl).toBe(544000.00); // 34% de R$ 1.6M
    expect(dataLeiDoBem.lucroRealAjustadoAposIncentivoBrl).toBe(3400000.00); // 5M - 1.6M
    expect(dataLeiDoBem.escrituracaoEcfBlocoM300.codigoLancamentoLalur).toBe('M300_EXCLUSAO_LEI_DO_BEM_ART19');
    expect(dataLeiDoBem.diagnosticoLeiDoBem).toContain('Economia Tributaria Real (34% IRPJ/CSLL): R$ 544000.00');
  });
});
