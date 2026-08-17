const fs = require('fs');

const testCode = `import { describe, it, expect } from 'vitest';
import {
  evaluateCompoundShareBasedSettlementCpc10,
  processRecyclingPackagingTaxEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Remuneração Composta (CPC 10) & Reciclagem de Embalagens (Lei 11.196/05)', () => {
  it('1. Deve segregar instrumento composto entre passivo e patrimonio liquido com apropriacao de vesting (CPC 10 R1 / IFRS 2)', () => {
    const resCompound = evaluateCompoundShareBasedSettlementCpc10({
      planoId: 'PLAN-COMP-01',
      beneficiarioNome: 'Diretoria Executiva',
      quemEscolheLiquidacao: 'OPCAO_ESCOLHA_EMPREGADO',
      quantidadeOpcoesOuDireitos: 100000,
      valorJustoAlternativaCaixaBrl: 40.00,  // Passivo = 4.000.000,00
      valorJustoAlternativaAcoesBrl: 50.00, // Total = 5.000.000,00 -> PL = 1.000.000,00
      prazoAquisicaoVestAnos: 3
    });

    const dataComp = unwrap(resCompound);
    expect(dataComp.valorPassivoReconhecidoBrl).toBe(4000000.00);
    expect(dataComp.valorPatrimonioLiquidoReconhecidoBrl).toBe(1000000.00);
    expect(dataComp.despesaAnualResultadoDREBrl).toBe(1666666.66);
    expect(dataComp.partidasDobradaReconhecimentoAno1.length).toBe(3);
    expect(dataComp.diagnosticoCpc10).toContain('Instrumento Composto com Escolha de Liquidação');
  });

  it('2. Deve aplicar suspensao de PIS/COFINS na venda de sucatas e credito presumido para industria transformadora (Lei 11.196/05)', () => {
    // 2.1 Indústria Adquirente de Cooperativa de Catadores (Crédito Presumido 0,825% PIS e 3,80% COFINS)
    const resIndustria = processRecyclingPackagingTaxEngine({
      operacaoId: 'REC-01',
      tipoMaterial: 'SUCATA_PLASTICO',
      tipoAdquirente: 'INDUSTRIA_RECICLADORA_TRANSFORMADORA',
      tipoVendedor: 'COOPERATIVA_CATADORES_PESSOA_FISICA',
      valorTotalOperacaoBrl: 200000.00
    });

    const dataInd = unwrap(resIndustria);
    expect(dataInd.suspensaoPisCofinsVenda).toBe(true);
    expect(dataInd.aliquotaPisCreditoPresumidoPercent).toBe(0.825);
    expect(dataInd.aliquotaCofinsCreditoPresumidoPercent).toBe(3.80);
    expect(dataInd.valorCreditoPresumidoPisBrl).toBe(1650.00);
    expect(dataInd.valorCreditoPresumidoCofinsBrl).toBe(7600.00);
    expect(dataInd.totalCreditoPresumidoApropriadoBrl).toBe(9250.00);
    expect(dataInd.diagnosticoFiscal).toContain('CRÉDITO PRESUMIDO');

    // 2.2 Venda entre Atacadistas de Sucata (Suspensão pura, sem crédito presumido na cadeia intermediária)
    const resAtacado = processRecyclingPackagingTaxEngine({
      operacaoId: 'REC-02',
      tipoMaterial: 'SUCATA_FERRO_ACO_ALUMINIO',
      tipoAdquirente: 'COMERCIO_ATACADISTA_SUCATA',
      tipoVendedor: 'COMERCIO_ATACADISTA_SUCATA',
      valorTotalOperacaoBrl: 100000.00
    });

    const dataAtac = unwrap(resAtacado);
    expect(dataAtac.suspensaoPisCofinsVenda).toBe(true);
    expect(dataAtac.totalCreditoPresumidoApropriadoBrl).toBe(0);
  });
});
`;

fs.writeFileSync('packages/core/tests/compound-recycling.test.ts', testCode, 'utf8');
console.log('Fixed compound test expectation.');
