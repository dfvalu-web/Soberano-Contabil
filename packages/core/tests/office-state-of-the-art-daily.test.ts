import { describe, it, expect } from 'vitest';
import {
  processOfficeAiPatternReconciliationEngine,
  processOfficeOneClickBatchTaxPayrollEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Operações de Ponta 1-Click (Contábil, Fiscal e RH)', () => {
  it('1. Deve conciliar transacoes de extrato bancario por reconhecimento de padroes de IA', () => {
    const resAi = processOfficeAiPatternReconciliationEngine({
      clienteCnpj: '11.111.111/0001-11',
      razaoSocial: 'Laboratório Farmacêutico Alpha S/A',
      mesCompetencia: '2026-08',
      bancoCodigo: '341',
      transacoesExtrato: [
        {
          transacaoId: 'TX-001',
          dataTransacao: '2026-08-05',
          descricaoExtrato: 'PIX RECEBIDO CLIENTE FARMACIA DROGAMAIS',
          tipoMovimento: 'CREDITO',
          valorBrl: 45000.00
        },
        {
          transacaoId: 'TX-002',
          dataTransacao: '2026-08-10',
          descricaoExtrato: 'PAGTO TARIFA MANUTENCAO CONTA CORRENTE',
          tipoMovimento: 'DEBITO',
          valorBrl: 89.90
        },
        {
          transacaoId: 'TX-003',
          dataTransacao: '2026-08-15',
          descricaoExtrato: 'PAGTO DAS SIMPLES NACIONAL GUIA 082026',
          tipoMovimento: 'DEBITO',
          valorBrl: 3825.00
        }
      ]
    });

    const dataAi = unwrap(resAi);
    expect(dataAi.totalTransacoesProcessadas).toBe(3);
    expect(dataAi.totalConciliadasAutomaticamente).toBe(3);
    expect(dataAi.percentualAutomacaoPercent).toBe(100.0);
    expect(dataAi.transacoesClassificadas[1].categoriaContabilSugerida).toBe('DESPESAS_BANCARIAS');
    expect(dataAi.transacoesClassificadas[2].categoriaContabilSugerida).toBe('PAGAMENTO_DE_TRIBUTOS');
    expect(dataAi.statusConciliacao).toBe('CONCILIACAO_CONTABIL_POR_IA_CONCLUIDA');
    expect(dataAi.diagnosticoIa).toContain('98%+');
  });

  it('2. Deve executar rotina em lote 1-Click de apuracao tributaria, folha e eSocial para a carteira', () => {
    const resBatch = processOfficeOneClickBatchTaxPayrollEngine({
      mesCompetencia: '2026-08',
      clientesCarteira: [
        {
          clienteCnpj: '22.222.222/0001-22',
          razaoSocial: 'Padaria e Confeitaria Pão Dourado Ltda',
          regimeTributario: 'SIMPLES_NACIONAL',
          faturamentoMesBrl: 80000.00,
          totalFuncionariosFolha: 6,
          valorBrutoFolhaBrl: 15000.00
        },
        {
          clienteCnpj: '33.333.333/0001-33',
          razaoSocial: 'Clínica Odontológica Sorriso Perfeito Ltda',
          regimeTributario: 'LUCRO_PRESUMIDO',
          faturamentoMesBrl: 120000.00,
          totalFuncionariosFolha: 4,
          valorBrutoFolhaBrl: 20000.00
        }
      ]
    });

    const dataBatch = unwrap(resBatch);
    expect(dataBatch.totalClientesProcessados).toBe(2);
    expect(dataBatch.totalTributosApuradosCarteiraBrl).toBe(24200.00); // 80k*8.5% (6800) + 120k*14.5% (17400)
    expect(dataBatch.totalFolhaLiquidaCarteiraBrl).toBe(29750.00); // 35000 * 85%
    expect(dataBatch.tempoProcessamentoSegundos).toBe(1.2);
    expect(dataBatch.clientesResumo[0].eventoEsocialS1299Transmitido).toBe(true);
    expect(dataBatch.clientesResumo[0].guiaEmitidaComPix).toBe(true);
    expect(dataBatch.statusExecucao).toBe('ROTINA_1CLICK_CONCLUIDA_COM_SUCESSO');
    expect(dataBatch.diagnosticoBatch).toContain('eSocial S-1299 fechado');
  });
});
