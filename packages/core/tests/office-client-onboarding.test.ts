import { describe, it, expect } from 'vitest';
import {
  processOfficeClientOnboardingWorkflowEngine,
  processOfficeAccountingDataMigrationEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Onboarding Digital de Clientes & Migração Contábil', () => {
  it('1. Deve validar prontidao de onboarding, diagnosticando procuracoes e CNDs', () => {
    const resOnb = processOfficeClientOnboardingWorkflowEngine({
      clienteCnpj: '11.111.111/0001-11',
      razaoSocial: 'Inovação & Tecnologia Softwares S/A',
      emailContatoPrincipal: 'financeiro@inovatech.com.br',
      regimeTributario: 'LUCRO_PRESUMIDO',
      procuracaoEcacAtiva: true,
      procuracaoSefazAtiva: true,
      cndFederalValida: true,
      cndFgtsValida: true,
      cndTrabalhistaValida: true
    });

    const dataOnb = unwrap(resOnb);
    expect(dataOnb.scoreProntidaoOnboardingPercent).toBe(100);
    expect(dataOnb.pendenciasCadastrais.length).toBe(0);
    expect(dataOnb.kitBoasVindasLiberado).toBe(true);
    expect(dataOnb.statusOnboarding).toBe('ONBOARDING_CONCLUIDO_100_CONFORME');
    expect(dataOnb.diagnosticoOnboarding).toContain('Kit de Boas-Vindas: Liberado');
  });

  it('2. Deve migrar saldos contabeis e de-para de plano de contas com balanco equilibrado', () => {
    const resMig = processOfficeAccountingDataMigrationEngine({
      clienteCnpj: '22.222.222/0001-22',
      razaoSocial: 'Comércio e Representações Vanguarda Ltda',
      dataSaldosAbertura: '2026-01-01',
      planoContasMigrado: [
        {
          codigoContaAnterior: '1.01.01.001',
          descricaoConta: 'Banco Conta Movimento',
          codigoContaPlanoSoberano: '1.1.01.002',
          classificacaoNatureza: 'ATIVO',
          saldoInicialBrl: 500000.00,
          tipoSaldo: 'DEBITO'
        },
        {
          codigoContaAnterior: '2.01.01.001',
          descricaoConta: 'Fornecedores Nacionais',
          codigoContaPlanoSoberano: '2.1.01.001',
          classificacaoNatureza: 'PASSIVO',
          saldoInicialBrl: 200000.00,
          tipoSaldo: 'CREDITO'
        },
        {
          codigoContaAnterior: '2.04.01.001',
          descricaoConta: 'Capital Social Integralizado',
          codigoContaPlanoSoberano: '2.3.01.001',
          classificacaoNatureza: 'PATRIMONIO_LIQUIDO',
          saldoInicialBrl: 300000.00,
          tipoSaldo: 'CREDITO'
        }
      ]
    });

    const dataMig = unwrap(resMig);
    expect(dataMig.totalContasMapeadas).toBe(3);
    expect(dataMig.totalAtivoInicialBrl).toBe(500000.00);
    expect(dataMig.totalPassivoPatrimonioLiquidoInicialBrl).toBe(500000.00); // 200k + 300k
    expect(dataMig.diferencaEquacaoPatrimonialBrl).toBe(0);
    expect(dataMig.statusMigracao).toBe('SALDOS_INICIAIS_MIGRADOS_E_EQUILIBRADOS');
    expect(dataMig.diagnosticoMigracao).toContain('sem quebra de partidas dobradas');
  });
});
