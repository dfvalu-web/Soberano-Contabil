import { describe, it, expect } from 'vitest';
import {
  TelemetryMetricsExporter,
  evaluateHyperinflationCpc42,
  calculateRepetroTaxExemptions,
  unwrap
} from '../src/index.js';

describe('TESTES: Telemetria OpenTelemetry, Hiperinflação (CPC 42) & REPETRO-SPED Óleo e Gás', () => {
  it('1. Deve exportar metricas no formato Prometheus v0.0.4', () => {
    const exporter = new TelemetryMetricsExporter();
    const res = exporter.generatePrometheusMetrics({
      ledgerTotalBlocks: 15420,
      taxRecalculationLatencySeconds: 0.0450,
      anomaliesDetectedTotal: 12,
      dfeThroughputPerSecond: 150.50,
      lastSuccessfulBackupTimestamp: 1771234567,
      dvaBalanceRatio: 1.00
    });

    const metricsText = unwrap(res);
    expect(metricsText).toContain('soberano_ledger_blocks_total 15420');
    expect(metricsText).toContain('soberano_tax_recalculation_latency_seconds 0.0450');
    expect(metricsText).toContain('soberano_anomalies_detected_total 12');
    expect(metricsText).toContain('soberano_dfe_throughput_per_second 150.50');
    expect(metricsText).toContain('soberano_dva_balance_ratio 1.00');
  });

  it('2. Deve reexpressar ativos nao monetarios e apurar ganho monetario em hiperinflacao (CPC 42 / IAS 29)', () => {
    const res = evaluateHyperinflationCpc42({
      subsidiariaId: 'SUB-BUENOS-AIRES-01',
      paisSede: 'Argentina',
      taxaInflacaoAcumulada3AnosPercent: 120, // >= 100% ativa CPC 42
      saldoAtivoNaoMonetarioHistoricoBrl: 1000000.00,
      indicePrecosDataAquisicao: 100,
      indicePrecosDataFechamento: 220, // Fator 2.2000 => Ativo = 2.200.000,00 (Ganho = 1.200.000,00)
      posicaoMonetariaLiquidaMediaBrl: -200000.00 // Passivo monetário líquido de 200k => Ganho monetário na inflação
    });

    const data = unwrap(res);
    expect(data.enquadraHiperinflacaoCpc42).toBe(true);
    expect(data.fatorReexpressaoMonetaria).toBe(2.2000);
    expect(data.valorReexpressoAtivoNaoMonetario).toBe(2200000.00);
    expect(data.ajusteReexpressaoResultado).toBe(1200000.00);
    // Ganho posição monetária líquida = -(-200k) * (220-100)/100 = 200k * 1.2 = +240.000,00
    expect(data.ganhoOuPerdaPosicaoMonetariaLiquida).toBe(240000.00);
    expect(data.partidasDobradaHiperinflacao.length).toBe(2);
    expect(data.diagnosticoCpc42).toContain('CPC 42 / IAS 29 Ativo');
  });

  it('3. Deve apurar desoneracoes tributarias aduaneiras e estaduais no REPETRO-SPED (Lei 13.586/2017)', () => {
    const res = calculateRepetroTaxExemptions({
      empresaHabilitadaId: 'PETRO-OFFSHORE-01',
      blocoPetroleoCampoNome: 'Campo de Búzios (Pré-Sal Santos)',
      numeroHabilitacaoRepetroAde: 'ADE-ALF-STS-2026-045',
      modalidade: 'REPETRO_SPED_IMPORTACAO_DEFINITIVA',
      valorCifEquipamentosNavaisUsd: 10000000.00, // USD 10M
      taxaCambialPtax: 5.00 // CIF BRL 50.000.000,00
    });

    const data = unwrap(res);
    expect(data.valorTotalCifBrl).toBe(50000000.00);
    expect(data.tributosSuspensosDesonerados.impostoImportacaoSuspenso14Percent).toBe(7000000.00);
    expect(data.tributosSuspensosDesonerados.ipiSuspenso10Percent).toBe(5000000.00);
    expect(data.tributosSuspensosDesonerados.pisCofinsImportacaoSuspenso11_75Percent).toBe(5875000.00);
    expect(data.tributosSuspensosDesonerados.icmsDiferidoIsento15Percent).toBe(7500000.00);
    expect(data.tributosSuspensosDesonerados.totalDesoneracaoRepetroBrl).toBe(25375000.00);
    expect(data.diagnosticoRepetro).toContain('Campo de Búzios');
  });
});
