import { Result, Ok, Err } from '../types/result.js';

export interface OtelMetricSample {
  metricName: string; // Ex: 'soberano_sefaz_latency_seconds'
  metricType: 'COUNTER' | 'HISTOGRAM' | 'GAUGE';
  value: number;
  labels: Record<string, string>; // { uf: 'SP', status: '200', tenant: '12345678000190' }
}

export interface OtelTraceSpanInput {
  traceId: string;
  spanId: string;
  operationName: string; // Ex: 'sefaz.transmit.nfe' | 'lalur.calculate.m300'
  durationMs: number;
  statusCode: 'OK' | 'ERROR';
  attributes: Record<string, string>;
}

export interface OtelApmResult {
  traceId: string;
  spanId: string;
  operationName: string;
  durationMs: number;
  prometheusMetricsExported: string; // Formato de exportação Prometheus text format
  statusApm: 'TELEMETRIA_OTEL_PROMETHEUS_REGISTRADA';
  diagnosticoApm: string;
}

export function processOpenTelemetryPrometheusApmEngine(span: OtelTraceSpanInput, metrics: OtelMetricSample[]): Result<OtelApmResult, Error> {
  if (!span.traceId || !span.spanId || span.durationMs < 0) {
    return Err(new Error('TraceId, SpanId e duração do span devem ser válidos.'));
  }

  // Gera formato oficial Prometheus
  let prometheusOutput = '# HELP soberano_operations_duration_ms Duracao de operacoes contabeis e fiscais\n';
  prometheusOutput += '# TYPE soberano_operations_duration_ms histogram\n';
  prometheusOutput += 'soberano_operations_duration_ms{operation="' + span.operationName + '",status="' + span.statusCode + '"} ' + span.durationMs + '\n';

  for (const m of metrics) {
    const labelStr = Object.entries(m.labels).map(([k, v]) => k + '="' + v + '"').join(',');
    prometheusOutput += m.metricName + '{' + labelStr + '} ' + m.value + '\n';
  }

  const diag = "OpenTelemetry & Prometheus APM: Span " + span.operationName + " (Trace: " + span.traceId + ") -> Duracao: " + span.durationMs + "ms | Status: " + span.statusCode + " | " + metrics.length + " metricas exportadas.";

  return Ok({
    traceId: span.traceId,
    spanId: span.spanId,
    operationName: span.operationName,
    durationMs: span.durationMs,
    prometheusMetricsExported: prometheusOutput,
    statusApm: 'TELEMETRIA_OTEL_PROMETHEUS_REGISTRADA',
    diagnosticoApm: diag
  });
}
