import { describe, it, expect } from 'vitest';
import {
  evaluateDefinedBenefitPensionPlanCpc33,
  processPharmaceuticalMonophasicTaxEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Benefício Definido (CPC 33) & Monofásico Farmacêutico (Lei 10.147/00)', () => {
  it('1. Deve apurar deficit liquido, despesa na DRE e perdas atuariais em OCI / AAP (CPC 33 R1 / IAS 19)', () => {
    const resAct = evaluateDefinedBenefitPensionPlanCpc33({
      planoId: 'PENSION-01',
      fundoPensaoNome: 'Fundação de Seguridade Privada dos Empregados',
      obrigacaoBeneficioDefinidoDboBrl: 100000000.00,
      valorJustoAtivosPlanoBrl: 85000000.00, // Déficit = 15.000.000,00
      custoServicoCorrenteExercicioBrl: 4000000.00,
      taxaDescontoAtuarialAnualPercent: 8.5, // Juros Líquidos = 15M * 8.5% = 1.275.000,00
      ganhoOuPerdaAtuarialPeriodoBrl: -2000000.00 // Perda atuarial reconhecida em OCI
    });

    const dataAct = unwrap(resAct);
    expect(dataAct.deficitOuSuperavitLiquidoPassivoBrl).toBe(15000000.00);
    expect(dataAct.jurosLiquidosPassivoDREBrl).toBe(1275000.00);
    expect(dataAct.despesaTotalResultadoDREBrl).toBe(5275000.00);
    expect(dataAct.remensuracaoAtuarialOciAapPlBrl).toBe(-2000000.00);
    expect(dataAct.partidasDobradaExercicioDRE.length).toBe(2);
    expect(dataAct.partidasDobradaRemensuracaoOci.length).toBe(2);
    expect(dataAct.diagnosticoCpc33).toContain('CPC 33 (R1) / IAS 19 (Benefício Definido)');
  });

  it('2. Deve aplicar aliquota concentrada na industria e aliquota zero na drogaria (Lei 10.147/00)', () => {
    // 2.1 Indústria - Lista Negativa (2,10% PIS e 9,90% COFINS)
    const resIndNeg = processPharmaceuticalMonophasicTaxEngine({
      operacaoId: 'MED-01',
      segmento: 'FABRICANTE_LABORATORIO_INDUSTRIA',
      listaMedicamento: 'LISTA_NEGATIVA',
      medicamentoNome: 'Antibiótico Hospitalar Injetável 500mg',
      valorTotalMedicamentosBrl: 1000000.00
    });

    const dataNeg = unwrap(resIndNeg);
    expect(dataNeg.cstPisCofinsUtilizado).toBe('02');
    expect(dataNeg.pisMonofasicoDevidoBrl).toBe(21000.00);
    expect(dataNeg.cofinsMonofasicoDevidoBrl).toBe(99000.00);
    expect(dataNeg.tributacaoVarejoZero).toBe(false);

    // 2.2 Drogaria / Farmácia (Revenda CST 04 - Alíquota Zero)
    const resDrogaria = processPharmaceuticalMonophasicTaxEngine({
      operacaoId: 'MED-02',
      segmento: 'DISTRIBUIDORA_FARMACIA_DROGARIA',
      listaMedicamento: 'LISTA_POSITIVA',
      medicamentoNome: 'Anti-hipertensivo Comprimidos 20mg',
      valorTotalMedicamentosBrl: 50000.00
    });

    const dataDrog = unwrap(resDrogaria);
    expect(dataDrog.cstPisCofinsUtilizado).toBe('04');
    expect(dataDrog.pisMonofasicoDevidoBrl).toBe(0);
    expect(dataDrog.cofinsMonofasicoDevidoBrl).toBe(0);
    expect(dataDrog.tributacaoVarejoZero).toBe(true);
    expect(dataDrog.diagnosticoFiscal).toContain('CST 04 (Operação Tributável Monofásica - Revenda a Alíquota Zero)');
  });
});
