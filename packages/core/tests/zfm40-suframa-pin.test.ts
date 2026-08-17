import { describe, it, expect } from 'vitest';
import {
  processZfm40SuframaRdFinancialCreditEngine,
  processPinZfmCustomsAutomationEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: ZFM 4.0, P&D Tecnológico SUFRAMA (Lei 8.387/91) & Guias PIN-ZFM', () => {
  it('1. Deve apurar obrigacao de 5% de P&D sobre receita liquida de TIC e gerar credito financeiro compensavel', () => {
    const resPd = processZfm40SuframaRdFinancialCreditEngine({
      fabricaZfmCnpj: '10.000.000/0001-00',
      faturamentoBrutoBensInformaticaBrl: 50000000.00, // R$ 50M
      tributosDutiveisReceitaBrutaBrl: 5000000.00, // R$ 5M -> RL = R$ 45M
      percentualMinimoPdSuframaPercent: 5.0, // 5% = R$ 2.250.000,00
      investimentoEfetivoRealizadoPdBrl: 2500000.00 // R$ 2.5M
    });

    const dataPd = unwrap(resPd);
    expect(dataPd.receitaLiquidaInformaticaBrl).toBe(45000000.00);
    expect(dataPd.obrigatoriedadeInvestimentoPdBrl).toBe(2250000.00);
    expect(dataPd.excedenteInvestimentoPdBrl).toBe(250000.00);
    expect(dataPd.creditoFinanceiroGeradoBrl).toBe(2250000.00);
    expect(dataPd.statusSuframaPd).toBe('OBRIGACAO_PD_SUFRAMA_CUMPRIDA_CREDITO_HOMOLOGADO');
    expect(dataPd.diagnosticoZfmPd).toContain('Credito Financeiro Homologado: R$ 2.250.000');
  });

  it('2. Deve gerar protocolo PIN-ZFM com desoneracao automatica de IPI e PIS/COFINS', () => {
    const resPin = processPinZfmCustomsAutomationEngine({
      remetenteNacionalCnpj: '20.000.000/0001-00',
      destinatarioZfmCnpj: '10.000.000/0001-00',
      numeroNotaFiscal: '000.123.456',
      valorTotalMercadoriaBrl: 1000000.00, // R$ 1.000.000,00
      aliquotaIpiOriginalPercent: 15.0, // R$ 150k
      aliquotaPisCofinsOriginalPercent: 9.25 // R$ 92.5k
    });

    const dataPin = unwrap(resPin);
    expect(dataPin.economiaIpiDesoneradoBrl).toBe(150000.00);
    expect(dataPin.economiaPisCofinsDesoneradoBrl).toBe(92500.00);
    expect(dataPin.economiaTributariaTotalBrl).toBe(242500.00);
    expect(dataPin.protocoloIngressoPinZfm).toContain('PIN-ZFM-2026-');
    expect(dataPin.statusInternamentoSuframa).toBe('MERCADORIA_INTERNADA_PIN_VALIDADO_SEFAZ_AM');
    expect(dataPin.diagnosticoPin).toContain('Economia Total: R$ 242.500');
  });
});
