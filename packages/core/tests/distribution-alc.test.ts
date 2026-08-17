import { describe, it, expect } from 'vitest';
import {
  evaluateAssetsHeldForDistributionCpc31,
  processAlcAndWesternAmazonTaxEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Distribuição aos Sócios (CPC 31) & Áreas de Livre Comércio (ALCs - Conv. 65/88)', () => {
  it('1. Deve mensurar ativo mantido para distribuicao pelo menor entre custo e VJL e apurar ganho na entrega (CPC 31 / ICPC 08)', () => {
    const resDist = evaluateAssetsHeldForDistributionCpc31({
      ativoId: 'IMOVEL-SUCURSAL-01',
      descricaoAtivo: 'Edifício Corporativo da Sucursal Sul',
      valorContabilLiquidoOriginalBrl: 20000000.00,
      valorJustoEstimadoBrl: 25000000.00,
      custosEstimadosDistribuicaoBrl: 500000.00, // VJL = 24.500.000,00
      distribuicaoEfetivada: true
    });

    const dataDist = unwrap(resDist);
    expect(dataDist.valorJustoMenosCustosDistribuicaoBrl).toBe(24500000.00);
    expect(dataDist.valorContabilAtivoReclassificadoBrl).toBe(20000000.00); // Menor valor
    expect(dataDist.passivoDividendosInNaturaBrl).toBe(24500000.00);
    expect(dataDist.ganhoOuPerdaLiquidacaoResultadoBrl).toBe(4500000.00);
    expect(dataDist.partidasDobradaReclassificacaoEProvisao.length).toBe(4);
    expect(dataDist.partidasDobradaLiquidacaoEntrega.length).toBe(3);
    expect(dataDist.diagnosticoCpc31).toContain('CPC 31 / IFRS 5 & ICPC 08');
  });

  it('2. Deve aplicar desoneracao de ICMS (Conv. 65/88), isencao de IPI e PIS/COFINS zero em remessas para ALCs', () => {
    const resAlc = processAlcAndWesternAmazonTaxEngine({
      operacaoId: 'ALC-01',
      localidadeAlc: 'MACAPA_SANTANA_AP',
      clienteDestinatarioNome: 'Comércio Importador e Distribuidor Amapaense Ltda',
      valorBrutoMercadoriasBrl: 1000000.00,
      aliquotaIcmsInterestadualPercent: 7.0 // 7% interestadual = 70k desconto
    });

    const dataAlc = unwrap(resAlc);
    expect(dataAlc.cfopUtilizado).toBe('6.109');
    expect(dataAlc.desoneracaoIcmsValorBrl).toBe(70000.00);
    expect(dataAlc.valorLiquidoComDescontoIcmsBrl).toBe(930000.00);
    expect(dataAlc.isencaoIpiValorBrl).toBe(100000.00);
    expect(dataAlc.pisAliquotaZeroBrl).toBe(16500.00);
    expect(dataAlc.cofinsAliquotaZeroBrl).toBe(76000.00);
    expect(dataAlc.diagnosticoFiscal).toContain('CONVÊNIO ICMS 65/88: Desoneração de ICMS');
  });
});
