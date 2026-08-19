import { describe, it, expect } from 'vitest';
import {
  processOfficeFlexibleBenefitsTransportEngine,
  processOfficePatMealAllowanceAccountingEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Benefícios Flexíveis & PAT (Lei 7.418/85 e Lei 6.321/76)', () => {
  it('1. Deve apurar desconto de vale-transporte limitado a 6% do salario base (R$ 180,00) e custeio empresa (R$ 260,00)', () => {
    const resVt = processOfficeFlexibleBenefitsTransportEngine({
      funcionarioCpf: '123.456.789-00',
      nomeFuncionario: 'Mariana Silveira',
      salarioBaseBrl: 3000.00, // Teto 6% = 180.00
      custoTotalPassagensMensalBrl: 440.00,
      optouReceberValeTransporte: true
    });

    const dataVt = unwrap(resVt);
    expect(dataVt.custoTotalPassagensBrl).toBe(440.00);
    expect(dataVt.tetoMaximoDesconto6PercentBrl).toBe(180.00);
    expect(dataVt.valorDescontoEmpregadoFolhaBrl).toBe(180.00);
    expect(dataVt.valorCusteioPatronalEmpresaBrl).toBe(260.00); // 440 - 180
    expect(dataVt.rubricaEsocialDescontoVt).toBe('5004_DESCONTO_VALE_TRANSPORTE');
    expect(dataVt.isencaoEncargosPrevidenciariosFgts).toBe(true);
    expect(dataVt.statusApuracao).toBe('VALE_TRANSPORTE_APURADO_COM_SUCESSO');
    expect(dataVt.diagnosticoVt).toContain('Sem incidência de INSS/FGTS');
  });

  it('2. Deve apurar Vale-Alimentacao do PAT com coparticipacao de 5% (R$ 40,00) e gerar lancamentos contabeis de custeio', () => {
    const resPat = processOfficePatMealAllowanceAccountingEngine({
      empresaCnpj: '11.111.111/0001-11',
      razaoSocial: 'Tecnologia Inovadora S/A',
      funcionarioCpf: '123.456.789-00',
      nomeFuncionario: 'Mariana Silveira',
      empresaInscritaPat: true,
      valorCreditoAlimentacaoRefeicaoBrl: 800.00,
      percentualCoparticipacaoEmpregadoPercent: 5.0
    });

    const dataPat = unwrap(resPat);
    expect(dataPat.valorBeneficioVaVrBrl).toBe(800.00);
    expect(dataPat.valorCoparticipacaoDescontoBrl).toBe(40.00); // 5% de 800
    expect(dataPat.valorCusteioEmpresaBrl).toBe(760.00); // 800 - 40
    expect(dataPat.rubricaEsocialCoparticipacao).toBe('5005_DESCONTO_ALIMENTACAO_PAT');
    expect(dataPat.partidaDobradaCusteioBeneficio).toContain('4.1.01.006 Despesas com Benefícios - PAT');
    expect(dataPat.statusPat).toBe('BENEFICIO_PAT_APURADO_E_CONCILIADO');
    expect(dataPat.diagnosticoPat).toContain('Isenção total de INSS/FGTS');
  });
});
