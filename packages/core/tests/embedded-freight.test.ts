import { describe, it, expect } from 'vitest';
import {
  evaluateEmbeddedDerivativeBifurcationCpc48,
  processFreightTransportationTaxEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Derivativos Embutidos (CPC 48) & Setor de Transportes e Fretes (Lei 10.833/03)', () => {
  it('1. Deve bifurcar derivativo embutido nao estritamente relacionado mensurando a valor justo FVTPL (CPC 48 / IFRS 9)', () => {
    // 1.1 Exige Bifurcação (Cláusula de Indexação Exógena ao Ouro em contrato local BRL)
    const resBifurc = evaluateEmbeddedDerivativeBifurcationCpc48({
      contratoHospedeiroId: 'CONT-HOSP-01',
      contraparteNome: 'Fornecedor Internacional de Turbinas',
      descricaoContrato: 'Fornecimento de Turbinas Hidráulicas com Indexação Cambial/Ouro',
      valorNominalContratoBrl: 10000000.00,
      clausulaIndexacaoExogena: 'Indexação à Cotação Internacional do Ouro (FVTPL)',
      isEstritamenteRelacionado: false, // Exige desmembramento
      valorJustoDerivadoEmbutidoBrl: 1500000.00
    });

    const dataBif = unwrap(resBifurc);
    expect(dataBif.exigeBifurcacaoDesmembramento).toBe(true);
    expect(dataBif.valorJustoDerivadoEmbutidoBrl).toBe(1500000.00);
    expect(dataBif.valorContratoHospedeiroCustoAmortizadoBrl).toBe(8500000.00);
    expect(dataBif.partidasDobradaDesmembramento.length).toBe(3);
    expect(dataBif.diagnosticoCpc48).toContain('BIFURCAÇÃO MANDATÓRIA EXIGIDA');

    // 1.2 Não Exige Bifurcação (Derivativo estritamente relacionado à moeda funcional da contraparte)
    const resSemBif = evaluateEmbeddedDerivativeBifurcationCpc48({
      contratoHospedeiroId: 'CONT-HOSP-02',
      contraparteNome: 'Fornecedor Nacional',
      descricaoContrato: 'Fornecimento de Aço Indexado ao IPCA',
      valorNominalContratoBrl: 5000000.00,
      clausulaIndexacaoExogena: 'Indexação ao IPCA (Inflação Doméstica)',
      isEstritamenteRelacionado: true,
      valorJustoDerivadoEmbutidoBrl: 0
    });

    const dataSem = unwrap(resSemBif);
    expect(dataSem.exigeBifurcacaoDesmembramento).toBe(false);
    expect(dataSem.valorContratoHospedeiroCustoAmortizadoBrl).toBe(5000000.00);
  });

  it('2. Deve apurar creditos de PIS/COFINS (9,25%) sobre fretes e credito outorgado de ICMS de 20% (Lei 10.833/03 & Conv. 106/96)', () => {
    // 2.1 Frete de Vendas no Lucro Real com Crédito Outorgado de ICMS 20%
    const resFrete = processFreightTransportationTaxEngine({
      cteNumero: 'CTE-12345',
      tipoOperacaoFrete: 'FRETE_SOBRE_VENDAS_ONUS_VENDEDOR',
      regimeTomadorFrete: 'LUCRO_REAL_NAO_CUMULATIVO',
      valorTotalFreteCteBrl: 100000.00,
      aliquotaIcmsFretePercent: 12.0, // ICMS Débito 12k
      optanteCreditoOutorgadoIcms: true // Crédito Outorgado 20% = 2.4k -> Líquido 9.6k
    });

    const dataFrete = unwrap(resFrete);
    expect(dataFrete.creditoPisFreteBrl).toBe(1650.00);
    expect(dataFrete.creditoCofinsFreteBrl).toBe(7600.00);
    expect(dataFrete.totalCreditoPisCofinsBrl).toBe(9250.00);
    expect(dataFrete.debitoIcmsFreteBrl).toBe(12000.00);
    expect(dataFrete.creditoOutorgadoIcmsBrl).toBe(2400.00);
    expect(dataFrete.icmsLiquidoDevidoBrl).toBe(9600.00);
    expect(dataFrete.diagnosticoFiscal).toContain('Créditos Não Cumulativos de PIS');

    // 2.2 Subcontratação de Fretes (Isenção na subcontratada e centralização na contratante)
    const resSub = processFreightTransportationTaxEngine({
      cteNumero: 'CTE-99999',
      tipoOperacaoFrete: 'SUBCONTRATACAO_DE_TRANSPORTE',
      regimeTomadorFrete: 'LUCRO_REAL_NAO_CUMULATIVO',
      valorTotalFreteCteBrl: 50000.00
    });

    const dataSub = unwrap(resSub);
    expect(dataSub.totalCreditoPisCofinsBrl).toBe(0);
    expect(dataSub.icmsLiquidoDevidoBrl).toBe(0);
    expect(dataSub.diagnosticoFiscal).toContain('Subcontratação com ICMS e PIS/COFINS recolhidos na transportadora principal');
  });
});
