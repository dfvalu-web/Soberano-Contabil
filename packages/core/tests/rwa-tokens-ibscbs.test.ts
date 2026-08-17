import { describe, it, expect } from 'vitest';
import {
  evaluateRwaTokenizationOcpc08,
  evaluateIbsCbsFullNonCumulativityCredit,
  unwrap
} from '../src/index.js';

describe('TESTES: Tokens RWA (OCPC 08 / CPC 48) & Reforma Tributária IBS/CBS Crédito Amplo', () => {
  it('1. Deve contabilizar tokens RWA com ajuste a valor justo no resultado (FVTPL) e yield mensal', () => {
    const resRwa = evaluateRwaTokenizationOcpc08({
      tokenId: 'RWA-AGRO-01',
      smartContractAddress: '0x71C80917265563138504479B5ec869F9B5b89155',
      emissorNome: 'Soberano Securitizadora & Agro Tokenizadora S.A.',
      tipoToken: 'RECEBIVEL_AGRO_CPR_DIGITAL',
      quantidadeTokens: 10000,
      custoAquisicaoUnitarioBrl: 1000.00, // 10M Custo
      valorJustoMercadoUnitarioBrl: 1050.00, // 10.5M Valor Justo (+500k ganho)
      taxaYieldAnualPactuadaPercent: 12.0
    });

    const dataRwa = unwrap(resRwa);
    expect(dataRwa.classificacaoContabil).toBe('CPC48_INSTRUMENTO_FINANCEIRO_FVTPL');
    expect(dataRwa.custoTotalAquisicaoBrl).toBe(10000000.00);
    expect(dataRwa.valorJustoTotalBrl).toBe(10500000.00);
    expect(dataRwa.ajusteValorJustoResultadoBrl).toBe(500000.00); // Ganho FVTPL
    expect(dataRwa.rendimentoYieldProjetadoMensalBrl).toBe(105000.00); // 10.5M * 1% ao mês
    expect(dataRwa.lancamentosContabeis.length).toBe(2);
    expect(dataRwa.diagnosticoRwa).toContain('Ajuste FVTPL: R$ 500000.00');
  });

  it('2. Deve apurar credito financeiro amplo e imediato de IBS e CBS no imobilizado e uso/consumo sem CIAP (PLP 68/24)', () => {
    const resCredit = evaluateIbsCbsFullNonCumulativityCredit({
      operacaoId: 'OP-CAPEX-01',
      adquirenteNome: 'Soberano Indústria Metalúrgica S.A.',
      valorAquisicaoBensCapitalImobilizadoBrl: 5000000.00, // 5M Maquinário
      valorAquisicaoInsumosServicosUsoConsumoBrl: 1000000.00, // 1M Insumos e Serviços
      aliquotaIbsPercent: 17.7,
      aliquotaCbsPercent: 8.8
    });

    const dataCredit = unwrap(resCredit);
    expect(dataCredit.creditoImediatoIbsImobilizadoBrl).toBe(885000.00); // 17.7% de 5M
    expect(dataCredit.creditoImediatoCbsImobilizadoBrl).toBe(440000.00); // 8.8% de 5M
    expect(dataCredit.creditoIbsUsoConsumoInsumosBrl).toBe(177000.00); // 17.7% de 1M
    expect(dataCredit.creditoCbsUsoConsumoInsumosBrl).toBe(88000.00); // 8.8% de 1M
    expect(dataCredit.totalCreditoIbsCbsRecuperavelBrl).toBe(1590000.00); // 885k + 440k + 177k + 88k
    expect(dataCredit.vantagemFluxoCaixaVsCiapAntigoBrl).toBe(866562.50); // 885k - (885k/48)
    expect(dataCredit.diagnosticoReformaTributaria).toContain('SEM FRACIONAMENTO EM 48 MESES');
  });
});
