import { describe, it, expect } from 'vitest';
import {
  processLeaseRemeasurementInflationCpc06,
  processStreamingDigitalServicesTaxEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Remensuração IFRS 16 IPCA (CPC 06 R2) & Streaming Digital (LC 157/16)', () => {
  it('1. Deve remensurar passivo e direito de uso por indice de inflacao IPCA sem transito na DRE (CPC 06 R2)', () => {
    const resLease = processLeaseRemeasurementInflationCpc06({
      contratoId: 'LOC-GALPAO-01',
      arrendatarioNome: 'Soberano Centros Logísticos S.A.',
      saldoPassivoArrendamentoAnteriorBrl: 10000000.00, // 10M
      saldoDireitoUsoAnteriorBrl: 9500000.00, // 9.5M
      prazoRemanescenteMeses: 60, // 5 anos
      variacaoIndiceInflacaoAcumuladaPercent: 5.80 // IPCA 5.80% -> +580k
    });

    const dataLease = unwrap(resLease);
    expect(dataLease.ajustePassivoArrendamentoBrl).toBe(580000.00);
    expect(dataLease.novoSaldoPassivoArrendamentoBrl).toBe(10580000.00);
    expect(dataLease.novoSaldoDireitoUsoBrl).toBe(10080000.00);
    expect(dataLease.novaDespesaAmortizacaoMensalBrl).toBe(168000.00); // 10.08M / 60
    expect(dataLease.lancamentoContabil.valor).toBe(580000.00);
    expect(dataLease.diagnosticoIfrs16).toContain('Ajuste Passivo/Ativo: R$ 580000.00');
  });

  it('2. Deve apurar ISSQN domicilio tomador, PIS/COFINS e CONDECINE para streaming digital (LC 157/16)', () => {
    const resStream = processStreamingDigitalServicesTaxEngine({
      plataformaId: 'STREAM-PLAY-01',
      plataformaNome: 'Soberano Play Entretenimento Digital S.A.',
      competencia: '2026-04',
      receitaAssinaturasBrasilBrl: 20000000.00, // 20M
      totalAssinantesAtivos: 500000,
      aliquotaIssqnPercent: 2.0, // 2%
      valorRemessasLicenciamentoExteriorBrl: 5000000.00, // 5M remessa exterior
      condecineObrasEstrangeirasCatalogoBrl: 50000.00
    });

    const dataStream = unwrap(resStream);
    expect(dataStream.issqnDevidoDomicilioTomadorBrl).toBe(400000.00); // 2% de 20M = 400k
    expect(dataStream.pisCofinsFaturamento925PercentBrl).toBe(1850000.00); // 9.25% de 20M = 1.85M
    expect(dataStream.pisCofinsImportacaoRemessas965PercentBrl).toBe(482500.00); // 9.65% de 5M = 482.5k
    expect(dataStream.cideRoyaltiesRemessas10PercentBrl).toBe(500000.00); // 10% de 5M = 500k
    expect(dataStream.condecineAudiovisualDevidaBrl).toBe(50000.00);
    expect(dataStream.totalTributosPlataformaBrl).toBe(3282500.00);
    expect(dataStream.diagnosticoStreaming).toContain('ISSQN Domicilio (2%): R$ 400000.00');
  });
});
