import { describe, it, expect } from 'vitest';
import {
  processMedicalCooperativeTaxEngine,
  processMedicalCooperativePayrollInssEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Cooperativas Médicas (Lei 5.764/71), PIS Folha 1% & eSocial S-1200', () => {
  it('1. Deve segregar atos cooperativos e apurar PIS Folha 1% (MP 2.158-35) e IRPJ/CSLL em atos nao cooperativos', () => {
    const resMed = processMedicalCooperativeTaxEngine({
      cooperativaMedicaCnpj: '10.000.000/0001-00',
      receitaAtosCooperativosTipicosBrl: 20000000.00, // R$ 20M isento
      receitaAtosNaoCooperativosBrl: 2000000.00, // R$ 2M tributável (lucro 20% = R$ 400k)
      folhaSalariosFuncionariosBrl: 1500000.00, // R$ 1.5M -> PIS 1% = R$ 15.000,00
      aliquotaIrpjCsllPercent: 34.0 // 34% de R$ 400k = R$ 136.000,00
    });

    const dataMed = unwrap(resMed);
    expect(dataMed.receitaAtosCooperativosIsentaBrl).toBe(20000000.00);
    expect(dataMed.lucroTributavelAtosNaoCooperativosBrl).toBe(400000.00);
    expect(dataMed.impostoIrpjCsllDevidoBrl).toBe(136000.00);
    expect(dataMed.impostoPisFolhaSalariosBrl).toBe(150000.00 ? 15000.00 : 15000.00);
    expect(dataMed.statusCooperativa).toBe('COOPERATIVA_SAUDE_SEGREGADA_LEI_5764');
    expect(dataMed.diagnosticoCooperativa).toContain('PIS Folha 1% (MP 2.158-35): R$ 15.000');
  });

  it('2. Deve apurar retencao de INSS de 11% sobre producao medica com teto previdenciario para o eSocial', () => {
    const resPay = processMedicalCooperativePayrollInssEngine({
      cooperadoCpf: '123.456.789-00',
      cooperadoNome: 'Dra. Roberta Andrade',
      valorProducaoMedicaBrutaBrl: 25000.00, // R$ 25k (acima do teto)
      tetoInssPrevidenciarioBrl: 8157.41,
      aliquotaRetencaoCooperadoPercent: 11.0 // 11% de R$ 8.157,41 = R$ 897,32
    });

    const dataPay = unwrap(resPay);
    expect(dataPay.baseCalculoInssBrl).toBe(8157.41);
    expect(dataPay.inssRetidoCooperadoBrl).toBe(897.32);
    expect(dataPay.valorLiquidoRepasseMedicoBrl).toBe(24102.68); // 25000 - 897.32
    expect(dataPay.eventoEsocialGerado).toBe('S-1200_REMUNERACAO_TRABALHADOR_AVULSO_COOPERADO');
    expect(dataPay.statusRetencao).toBe('RETENCAO_INSS_COOPERADO_HOMOLOGADA_ESOCIAL');
    expect(dataPay.diagnosticoMedico).toContain('INSS 11%: R$ 897.32');
  });
});
