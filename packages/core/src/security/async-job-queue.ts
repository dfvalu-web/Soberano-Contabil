import { Result, Ok, Err } from '../types/result.js';

export type JobType = 'PROCESSAR_LOTE_DFE' | 'FECHAMENTO_FOLHA_MASSA' | 'GERAR_ARQUIVO_SPED' | 'DISPARAR_WEBHOOKS';

export interface AsyncJob<T = Record<string, unknown>> {
  jobId: string;
  tenantId: string;
  tipo: JobType;
  payload: T;
  maxRetries: number;
  currentRetries: number;
  status: 'PENDENTE' | 'PROCESSANDO' | 'CONCLUIDO' | 'FALHA_DLQ';
  criadoEm: string;
  concluidoEm?: string;
  ultimoErro?: string;
}

export class AsyncJobQueueEngine {
  private queue: AsyncJob[] = [];
  private deadLetterQueue: AsyncJob[] = [];

  public enqueueJob<T = Record<string, unknown>>(
    tenantId: string,
    tipo: JobType,
    payload: T,
    maxRetries = 3
  ): AsyncJob<T> {
    const job: AsyncJob<T> = {
      jobId: 'JOB-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      tenantId,
      tipo,
      payload,
      maxRetries,
      currentRetries: 0,
      status: 'PENDENTE',
      criadoEm: new Date().toISOString()
    };
    this.queue.push(job as unknown as AsyncJob);
    return job;
  }

  public async processNextJob(
    handler: (job: AsyncJob) => Promise<boolean>
  ): Promise<Result<AsyncJob, Error>> {
    const pendingIndex = this.queue.findIndex(j => j.status === 'PENDENTE');
    if (pendingIndex === -1) {
      return Err(new Error('Nenhum job pendente na fila.'));
    }

    const job = this.queue[pendingIndex];
    job.status = 'PROCESSANDO';

    try {
      const success = await handler(job);
      if (success) {
        job.status = 'CONCLUIDO';
        job.concluidoEm = new Date().toISOString();
        return Ok(job);
      } else {
        throw new Error('Handler retornou status de falha.');
      }
    } catch (err: unknown) {
      job.currentRetries++;
      job.ultimoErro = err instanceof Error ? err.message : String(err);

      if (job.currentRetries >= job.maxRetries) {
        job.status = 'FALHA_DLQ';
        this.deadLetterQueue.push(job);
        this.queue.splice(pendingIndex, 1);
        return Err(new Error('Job excedeu ' + job.maxRetries + ' tentativas e foi movido para a Dead Letter Queue (DLQ): ' + job.ultimoErro));
      } else {
        job.status = 'PENDENTE';
        return Err(new Error('Falha no processamento (Tentativa ' + job.currentRetries + '/' + job.maxRetries + '): ' + job.ultimoErro));
      }
    }
  }

  public getDlqJobs(): AsyncJob[] {
    return [...this.deadLetterQueue];
  }

  public getPendingCount(): number {
    return this.queue.filter(j => j.status === 'PENDENTE').length;
  }
}
