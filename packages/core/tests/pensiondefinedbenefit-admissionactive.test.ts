import { describe, it, expect } from 'vitest';
import {
  processDefinedBenefitPensionPlansCpc33,
  processTemporaryAdmissionActiveInwardProcessingTaxEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Planos de Pensão (CPC 33) & Admissão Temporária Ativa (IN 1.600/15)', () => {
  it('1. Deve apurar obrigacao DBO, deficit atuarial no balanco e perda em ORA conforme CPC 33', () => {
    const resPension = processDefinedBenefitPensionPlansCpc33({
      planoPrevidenciaId: 'PLANO-PENSION-2026-BD',
      nomeEntidadeFechada: 'Fundação Soberano de Seguridade Social',
      obrigacaoBeneficioDefinidoInicioDboBrl: 50000000.00, // R$ 50M
      ativosDoPlanoInicioValorJustoBrl: 42000000.00, // R$ 42M -> Déficit inicial = R$ 8M
      custoServicoCorrenteAnoBrl: 2500000.00, // R$ 2.5M
      taxaDescontoAtuarialAnualPercent: 10.5, // 10.5% (Juros líquidos DRE = R$ 840k -> Despesa DRE = R$ 3.34M)
      beneficiosPagosNoAnoBrl: 3000000.00,
      contribuicoesPatrocinadoraPagasBrl: 2800000.00,
      ganhoOuPerdaAtuarialRemensuracaoPlBrl: -600000.00 // Perda de R$ 600k em ORA
    });

    const dataPension = unwrap(resPension);
    expect(dataPension.obrigacaoBeneficioDefinidoFinalDboBrl).toBe(55350000.00);
    expect(dataPension.ativosDoPlanoFinalValorJustoBrl).toBe(46210000.00);
    expect(dataPension.deficitAtuarialLiquidoPassivoBalancoBrl).toBe(9140000.00);
    expect(dataPension.despesaTotalPrevidenciaReconhecidaDreBrl).toBe(3340000.00);
    expect(dataPension.remensuracaoAtuarialOutrosResultadosPlBrl).toBe(-600000.00);
    expect(dataPension.statusConformidadeCpc33).toBe('AVALIACAO_ATUARIAL_CPC33_CONFORME');
    expect(dataPension.diagnosticoCpc33).toContain('Deficit Passivo no Balanco: R$ 9140000.00');
  });

  it('2. Deve apurar suspensao de tributos federais e ICMS em admissao temporaria de bens para aperfeicoamento ativo conforme IN RFB 1.600/15', () => {
    const resAdmission = processTemporaryAdmissionActiveInwardProcessingTaxEngine({
      numeroTermoResponsabilidade: 'TR-ADMISSAO-2026-0041',
      empresaCnpj: '12.345.678/0001-90',
      descricaoBemEstrangeiro: 'Turbina Aeronáutica para Manutenção e Reparo',
      valorAduaneiroBemCifBrl: 15000000.00, // R$ 15M
      valorServicoAgregadoNacionalBrl: 2000000.00, // R$ 2M
      aliquotaImpostoImportacaoPercent: 16.0, // R$ 2.400.000,00
      aliquotaIpiPercent: 12.0, // 12% sobre (15M + 2.4M) = R$ 2.088.000,00
      aliquotaPisCofinsImportacaoPercent: 9.25, // R$ 1.387.500,00 -> Federais = R$ 5.875.500,00
      aliquotaIcmsImportacaoPercent: 18.0 // R$ 2.700.000,00 -> Total = R$ 8.575.500,00
    });

    const dataAdmission = unwrap(resAdmission);
    expect(dataAdmission.valorAduaneiroBemBrl).toBe(15000000.00);
    expect(dataAdmission.totalTributosFederaisSuspensosBrl).toBe(5875500.00);
    expect(dataAdmission.icmsImportacaoSuspensoBrl).toBe(2700000.00);
    expect(dataAdmission.economiaTributariaAdmissaoBrl).toBe(8575500.00);
    expect(dataAdmission.statusAduaneiro).toBe('SUSPENSAO_TOTAL_APERFEICOAMENTO_ATIVO_CONFORME');
    expect(dataAdmission.diagnosticoAdmissaoTemporaria).toContain('Tributos Federais Suspensos: R$ 5875500.00');
  });
});
