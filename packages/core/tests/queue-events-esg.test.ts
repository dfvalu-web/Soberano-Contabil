import { describe, it, expect } from 'vitest';
import {
  AsyncJobQueueEngine,
  processSubsequentEventCpc24,
  calculateReverseLogisticsTaxBenefits,
  unwrap
} from '../src/index.js';

describe('TESTES: Async Job Queue & DLQ, Eventos Subsequentes (CPC 24) & Logística Reversa PNRS', () => {
  it('1. Deve gerenciar fila assincrona com retentativas e desvio para Dead Letter Queue (DLQ)', async () => {
    const queue = new AsyncJobQueueEngine();

    queue.enqueueJob('tenant-01', 'PROCESSAR_LOTE_DFE', { totalNfes: 100 }, 2);

    expect(queue.getPendingCount()).toBe(1);

    // Tentativa 1: Falha
    const res1 = await queue.processNextJob(async () => false);
    expect(res1.success).toBe(false);
    expect(queue.getPendingCount()).toBe(1);

    // Tentativa 2: Falha definitiva => move para DLQ
    const res2 = await queue.processNextJob(async () => false);
    expect(res2.success).toBe(false);
    expect(queue.getPendingCount()).toBe(0);
    expect(queue.getDlqJobs().length).toBe(1);
    expect(queue.getDlqJobs()[0].status).toBe('FALHA_DLQ');
  });

  it('2. Deve segregar eventos subsequentes ajustaveis e nao ajustaveis divulgaveis (CPC 24 / IAS 10)', () => {
    // 2.1 Evento Ajustável
    const resAjuste = processSubsequentEventCpc24({
      eventoId: 'EVT-SENTENCA-01',
      dataOcorrencia: '2026-02-10',
      dataEncerramentoExercicio: '2025-12-31',
      descricaoFato: 'Sentença judicial transitada em julgado de litígio iniciado em 2024',
      tipoEvento: 'EVENTO_AJUSTAVEL',
      valorImpactoFinanceiroEstimado: 350000.00,
      motivoEnquadramento: 'Fato originado antes do fechamento do balanço'
    });

    const dataAjuste = unwrap(resAjuste);
    expect(dataAjuste.exigeAjustePatrimonial).toBe(true);
    expect(dataAjuste.partidasDobradaAjuste?.length).toBe(2);

    // 2.2 Evento Não Ajustável mas Divulgável
    const resDivulgavel = processSubsequentEventCpc24({
      eventoId: 'EVT-SINISTRO-02',
      dataOcorrencia: '2026-01-20',
      dataEncerramentoExercicio: '2025-12-31',
      descricaoFato: 'Incêndio em galpão de armazenagem de estoques',
      tipoEvento: 'EVENTO_NAO_AJUSTAVEL_DIVULGAVEL',
      valorImpactoFinanceiroEstimado: 1200000.00,
      motivoEnquadramento: 'Sinistro ocorrido após 31/12 sem condição preexistente'
    });

    const dataDivulgavel = unwrap(resDivulgavel);
    expect(dataDivulgavel.exigeAjustePatrimonial).toBe(false);
    expect(dataDivulgavel.exigeDivulgacaoNotaExplicativa).toBe(true);
    expect(dataDivulgavel.minutaNotaExplicativaDivulgacao).toContain('NOTA EXPLICATIVA');
  });

  it('3. Deve calcular desoneracao de ICMS e creditos PIS/COFINS em Logistica Reversa (Lei 12.305/2010)', () => {
    const res = calculateReverseLogisticsTaxBenefits({
      loteId: 'LOTE-SUCATA-ALUMINIO-01',
      tipoMaterial: 'SUCATA_METALICA',
      pesoToneladas: 50,
      valorTotalMaterialRetornadoBrl: 500000.00, // R$ 500k
      estadoOrigemUf: 'SP',
      estadoDestinoUf: 'MG',
      aliquotaIcmsInternaOuInterestadualPercent: 12 // 12% ICMS = 60k
    });

    const data = unwrap(res);
    expect(data.icmsIsencaoDiferimentoBrl).toBe(60000.00);
    expect(data.creditoPisCofinsReciclagem9_25Percent).toBe(46250.00); // 9.25% de 500k
    expect(data.totalBeneficioEconomicoFiscalBrl).toBe(106250.00);
    expect(data.diagnosticoPnrsEsg).toContain('Política Nacional de Resíduos Sólidos');
  });
});
