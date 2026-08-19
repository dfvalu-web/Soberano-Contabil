import { describe, it, expect } from 'vitest';
import {
  processOfficeSelicInterestPenaltyCalculatorEngine,
  processOfficeTaxArrearsRecalculatorEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Recálculo de Guias em Atraso & Selic + Multa', () => {
  it('1. Deve calcular multa de 0.33%/dia e Selic acumulada + 1% com precisao conforme LC 123/06', () => {
    const resSelic = processOfficeSelicInterestPenaltyCalculatorEngine({
      valorPrincipalBrl: 5000.00,
      dataVencimentoOriginal: '2026-07-20',
      dataPagamentoAtualizada: '2026-08-19', // ~30 dias de atraso
      taxaSelicAcumuladaPeriodoPercent: 1.05
    });

    const dataSelic = unwrap(resSelic);
    expect(dataSelic.diasAtrasoCorridos).toBe(30);
    expect(dataSelic.percentualMultaPercent).toBeCloseTo(9.90, 2); // 30 * 0.33
    expect(dataSelic.valorMultaMoraBrl).toBeCloseTo(495.00, 2); // 5000 * 9.9%
    expect(dataSelic.percentualJurosSelicTotalPercent).toBeCloseTo(2.05, 2); // 1.05 + 1.0
    expect(dataSelic.valorJurosMoraBrl).toBeCloseTo(102.50, 2); // 5000 * 2.05%
    expect(dataSelic.valorTotalAtualizadoBrl).toBeCloseTo(5597.50, 2);
    expect(dataSelic.statusCalculo).toBe('ENCARGOS_MORATORIOS_OFICIAIS_CALCULADOS');
    expect(dataSelic.diagnosticoEncargos).toContain('Total Atualizado:');
  });

  it('2. Deve reemitir guia DAS/DARF com nova data de vencimento, codigo de barras e chave Pix Copia e Cola', () => {
    const resReissue = processOfficeTaxArrearsRecalculatorEngine({
      clienteCnpj: '11.111.111/0001-11',
      razaoSocial: 'Auto Posto Imperial de Combustíveis Ltda',
      tipoGuia: 'DAS_SIMPLES',
      valorOriginalBrl: 8000.00,
      dataVencimentoOriginal: '2026-06-20',
      dataNovaVencimento: '2026-08-31',
      taxaSelicAcumuladaPercent: 2.10
    });

    const dataReissue = unwrap(resReissue);
    expect(dataReissue.guiaReemitidaPdfPronta).toBe(true);
    expect(dataReissue.novaDataVencimento).toBe('2026-08-31');
    expect(dataReissue.valorTotalComEncargosBrl).toBeGreaterThan(8000.00);
    expect(dataReissue.linhaDigitavelRecalculada).toContain('85800000001');
    expect(dataReissue.chavePixCopiaEColaAtualizada).toContain('br.gov.bcb.pix');
    expect(dataReissue.statusReemissao).toBe('GUIA_EM_ATRASO_REEMITIDA_COM_SUCESSO');
    expect(dataReissue.diagnosticoReemissao).toContain('Recalculada para 2026-08-31');
  });
});
