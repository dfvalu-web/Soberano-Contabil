import { describe, it, expect } from 'vitest';
import {
  evaluateHyperinflationNetMonetaryCpc42,
  processIofFinancialOperationsTaxEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Hiperinflação & Posição Monetária (CPC 42) & IOF em Operações Financeiras (Dec. 6.306/07)', () => {
  it('1. Deve apurar ganho/perda de poder de compra na posicao monetaria liquida e reexpressar imobilizado (CPC 42 / IAS 29)', () => {
    // 1.1 Posição Monetária Passiva (Passivos > Ativos -> Gera GANHO monetário na inflação)
    const resPassiva = evaluateHyperinflationNetMonetaryCpc42({
      entidadeId: 'ARG-SUB-01',
      exercicioAno: 2026,
      indicePrecosInicioPeriodo: 100,
      indicePrecosFimPeriodo: 125, // 25% de inflação
      ativosMonetariosMediosBrl: 10000000.00,
      passivosMonetariosMediosBrl: 15000000.00, // Posição Monetária = -5M
      ativosNaoMonetariosCustoHistoricoBrl: 10000000.00 // Imobilizado atualizado para 12.5M
    });

    const dataPassiva = unwrap(resPassiva);
    expect(dataPassiva.fatorInflacaoGeral).toBe(1.25);
    expect(dataPassiva.posicaoMonetariaLiquidaMediaBrl).toBe(-5000000.00);
    expect(dataPassiva.isPosicaoMonetariaAtiva).toBe(false);
    expect(dataPassiva.resultadoPerdaGanhoPosicaoMonetariaDrebBrl).toBe(1250000.00); // + 1.25M Ganho
    expect(dataPassiva.valorAtualizadoAtivosNaoMonetariosBrl).toBe(12500000.00);
    expect(dataPassiva.partidasDobrada.length).toBe(3);
    expect(dataPassiva.diagnosticoCpc42).toContain('Ganho de Poder de Compra');
  });

  it('2. Deve apurar IOF/Credito (diario + adicional), IOF/Cambio e IOF/Titulos regressivo (Dec. 6.306/07)', () => {
    // 2.1 IOF/Crédito PJ (Mútuo 30 dias: 0.0041%/dia + 0.38%)
    const resCred = processIofFinancialOperationsTaxEngine({
      operacaoId: 'MUTUO-01',
      tomadorNome: 'Soberano Holding S.A.',
      tipoOperacao: 'IOF_CREDITO_MUTUO_EMPRESTIMO',
      tipoTomador: 'PESSOA_JURIDICA',
      valorOperacaoBrl: 1000000.00,
      prazoDias: 30
    });

    const dataCred = unwrap(resCred);
    expect(dataCred.valorBaseCalculoBrl).toBe(1000000.00);
    expect(dataCred.valorIofDevidoBrl).toBe(5030.00); // 1M * (0.0041% * 30 = 1230) + (1M * 0.38% = 3800) = 5030
    expect(dataCred.diagnosticoFiscal).toContain('IOF/Crédito');

    // 2.2 IOF/Câmbio Remessa (0.38%)
    const resCambio = processIofFinancialOperationsTaxEngine({
      operacaoId: 'CAMBIO-02',
      tomadorNome: 'Investimentos Exterior Inc',
      tipoOperacao: 'IOF_CAMBIO_REMESSA_EXTERIOR',
      valorOperacaoBrl: 500000.00
    });

    const dataCambio = unwrap(resCambio);
    expect(dataCambio.valorIofDevidoBrl).toBe(1900.00); // 0.38% de 500k
    expect(dataCambio.diagnosticoFiscal).toContain('IOF/Câmbio');

    // 2.3 IOF/Títulos Resgate dia 10 (Alíquota Regressiva 66%)
    const resTit = processIofFinancialOperationsTaxEngine({
      operacaoId: 'CDB-03',
      tomadorNome: 'Tesouraria Soberano',
      tipoOperacao: 'IOF_TITULOS_RESGATE_CURTO_PRAZO',
      valorOperacaoBrl: 1000000.00,
      prazoDias: 10,
      rendimentoBrutoResgateBrl: 10000.00
    });

    const dataTit = unwrap(resTit);
    expect(dataTit.aliquotaEfetivaIofPercent).toBe(66);
    expect(dataTit.valorIofDevidoBrl).toBe(6600.00); // 66% de 10.000
    expect(dataTit.diagnosticoFiscal).toContain('IOF/Títulos');
  });
});
