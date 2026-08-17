import { describe, it, expect } from 'vitest';
import {
  processS3WormStorageAdapter,
  processOpenTelemetryPrometheusApmEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: PostgreSQL 16 (pgvector), Storage S3 WORM & OpenTelemetry APM', () => {
  it('1. Deve registrar documento fiscal com Object Lock COMPLIANCE de 5 anos conforme Art. 173 do CTN', () => {
    const resWorm = processS3WormStorageAdapter({
      tenantCnpj: '12345678000190',
      documentKey: 'xmls/2026/08/nfe-35260812345678000190550010000001231000001234.xml',
      documentSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      retentionYears: 5,
      payloadBufferBase64: 'PENFZT4uLi48L05GZT4='
    });

    const dataWorm = unwrap(resWorm);
    expect(dataWorm.bucketWormName).toBe('soberano-fiscal-worm-vault');
    expect(dataWorm.objectLockMode).toBe('COMPLIANCE_LEGAL_HOLD');
    expect(dataWorm.statusGuardaFiscal).toBe('DOCUMENTO_GUARDADO_IMUTAVEL_5_ANOS');
    expect(dataWorm.s3Uri).toContain('soberano-fiscal-worm-vault/12345678000190/xmls/2026/08/nfe-');
    expect(dataWorm.diagnosticoStorage).toContain('Guardado com Object Lock COMPLIANCE');
  });

  it('2. Deve gerar telemetria OpenTelemetry e exportar metricas no formato Prometheus text format', () => {
    const resApm = processOpenTelemetryPrometheusApmEngine(
      {
        traceId: '4bf92f3577b34da6a3ce929d0e0e4736',
        spanId: '00f067aa0ba902b7',
        operationName: 'sefaz.transmit.nfe',
        durationMs: 185,
        statusCode: 'OK',
        attributes: { uf: 'SP', tpEmis: '1' }
      },
      [
        {
          metricName: 'soberano_sefaz_requests_total',
          metricType: 'COUNTER',
          value: 1,
          labels: { uf: 'SP', status: '200' }
        },
        {
          metricName: 'soberano_db_pool_active_connections',
          metricType: 'GAUGE',
          value: 14,
          labels: { database: 'postgres_pgvector' }
        }
      ]
    );

    const dataApm = unwrap(resApm);
    expect(dataApm.traceId).toBe('4bf92f3577b34da6a3ce929d0e0e4736');
    expect(dataApm.durationMs).toBe(185);
    expect(dataApm.statusApm).toBe('TELEMETRIA_OTEL_PROMETHEUS_REGISTRADA');
    expect(dataApm.prometheusMetricsExported).toContain('soberano_sefaz_requests_total{uf="SP",status="200"} 1');
    expect(dataApm.prometheusMetricsExported).toContain('soberano_db_pool_active_connections{database="postgres_pgvector"} 14');
    expect(dataApm.diagnosticoApm).toContain('Duracao: 185ms | Status: OK');
  });
});
