import { describe, it, expect } from 'vitest';
import {
  processDrexCbdcTokenizedTpftSettlementEngine,
  processSmartContractsAtomicDvpAccountingEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: DREX Real Digital (BACEN), TPFTs Tokenizados & Smart Contracts DvP', () => {
  it('1. Deve custodiar TPFT Tesouro Selic e apropriar rendimentos diarios por taxa efetiva (CPC 48)', () => {
    const resTpft = processDrexCbdcTokenizedTpftSettlementEngine({
      instituicaoParticipanteCnpj: '10.000.000/0001-00',
      tipoTituloTokenizado: 'TPFT_TESOURO_SELIC',
      volumeTitulosTokenizados: 5000, // 5k tokens
      precoUnitarioEmissaoBrl: 1000.00, // R$ 5.000.000,00
      taxaJurosAnualEfetivaPercent: 10.50, // 10.5% a.a.
      prazoDiasDecorrido: 90, // 90 dias
      classificacaoCpc48: 'CUSTO_AMORTIZADO'
    });

    const dataTpft = unwrap(resTpft);
    expect(dataTpft.valorAplicacaoInicialBrl).toBe(5000000.00);
    expect(dataTpft.jurosApropriadosPeriodoBrl).toBe(131250.00); // 5M * (10.5% * 90/360)
    expect(dataTpft.valorContabilAtualizadoBrl).toBe(5131250.00);
    expect(dataTpft.statusDrexCustodia).toBe('TPFT_CUSTODIADO_REDE_DREX_BACEN');
    expect(dataTpft.diagnosticoDrex).toContain('R$ 5.131.250');
  });

  it('2. Deve executar liquidacao atomica DvP com retencao de IRRF regressivo de 22.5% em 120 dias', () => {
    const resDvp = processSmartContractsAtomicDvpAccountingEngine({
      smartContractAddressDrex: '0x71C...DrexTpftSettlementContract',
      compradorCarteiraDrex: '0xCompradorBankWallet123',
      vendedorCarteiraDrex: '0xVendedorHoldingWallet456',
      valorLiquidacaoDrexBrl: 2000000.00, // R$ 2.000.000,00
      rendimentoTributavelResgateBrl: 80000.00, // R$ 80k
      prazoDiasAplicacao: 120 // <= 180 dias -> IRRF 22.5% = R$ 18.000,00
    });

    const dataDvp = unwrap(resDvp);
    expect(dataDvp.statusLiquidacaoAtomica).toBe('LIQUIDACAO_DVP_EXECUTADA_BLOCO_DREX');
    expect(dataDvp.aliquotaIrrfRegressivaPercent).toBe(22.5);
    expect(dataDvp.impostoIrrfRetidoFonteBrl).toBe(18000.00);
    expect(dataDvp.valorLiquidoRecebidoVendedorBrl).toBe(1982000.00);
    expect(dataDvp.hashTransacaoDrexSha256).toContain('DREX-TX-DVP-');
    expect(dataDvp.diagnosticoDvp).toContain('IRRF (22.5%): R$ 18.000');
  });
});
