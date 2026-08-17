import { describe, it, expect } from 'vitest';
import {
  processCryptoVaspRegulatoryComplianceEngine,
  processIn1888CryptoTaxReportingEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Marco Legal dos Criptoativos (Lei 14.478/22) & Declaração IN RFB 1.888/19', () => {
  it('1. Deve validar segregacao patrimonial VASP com cobertura de reservas on-chain de 104%', () => {
    const resVasp = processCryptoVaspRegulatoryComplianceEngine({
      vaspExchangeCnpj: '10.000.000/0001-00',
      saldoCustodiaClientesBtc: 500, // 500 BTC
      cotacaoBtcBrl: 350000.00, // R$ 350k -> R$ 175M
      reservasEmCarteirasFriasBtc: 520, // 520 BTC -> R$ 182M
      patrimonioProprioVaspBrl: 50000000.00
    });

    const dataVasp = unwrap(resVasp);
    expect(dataVasp.valorTotalCustodiaClientesBrl).toBe(175000000.00);
    expect(dataVasp.valorTotalReservasComprovadasBrl).toBe(182000000.00);
    expect(dataVasp.indiceCoberturaReservasPercent).toBe(104.0);
    expect(dataVasp.segregacaoPatrimonialAtiva).toBe(true);
    expect(dataVasp.statusConformidadeMarcoCripto).toBe('VASP_EM_CONFORMIDADE_LEI_14478_PROVA_RESERVAS');
    expect(dataVasp.diagnosticoVasp).toContain('Segregacao 100% Homologada');
  });

  it('2. Deve gerar lote da declaracao IN RFB 1.888/19 e apurar 15% de ganho de capital', () => {
    const resIn1888 = processIn1888CryptoTaxReportingEngine({
      declaranteCnpj: '20.000.000/0001-00',
      mesAnoApuracao: '2026-08',
      valorTotalOperacoesMesBrl: 500000.00, // R$ 500k
      custoAquisicaoHistoricoBrl: 380000.00, // R$ 380k -> Ganho = R$ 120k
      tipoPessoa: 'PESSOA_JURIDICA'
    });

    const dataIn1888 = unwrap(resIn1888);
    expect(dataIn1888.obrigatoriedadeEntregaIn1888).toBe(true);
    expect(dataIn1888.ganhoCapitalLiquidoBrl).toBe(120000.00);
    expect(dataIn1888.aliquotaImpostoGanhoPercent).toBe(15.0);
    expect(dataIn1888.impostoRendaDevidoBrl).toBe(18000.00);
    expect(dataIn1888.loteTransmissaoIn1888Gerado).toContain('LOTE-IN1888-202608-');
    expect(dataIn1888.statusDeclaracao).toBe('DECLARACAO_IN_1888_GERADA_E_VALIDADA_RFB');
    expect(dataIn1888.diagnosticoIn1888).toContain('IR Devido (15%): R$ 18.000');
  });
});
