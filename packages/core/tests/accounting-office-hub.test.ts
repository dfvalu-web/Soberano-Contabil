import { describe, it, expect } from 'vitest';
import {
  processAccountingOfficeFirmWorkflowEngine,
  processOfficeObligationsAuditCalendarEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Central do Escritório de Contabilidade (Contábil, Fiscal, RH & Auditoria)', () => {
  it('1. Deve processar fechamento contábil e fiscal em lote da carteira de clientes do escritório', () => {
    const resWorkflow = processAccountingOfficeFirmWorkflowEngine({
      escritorioContabilCnpj: '10.000.000/0001-00',
      mesCompetencia: '2026-08',
      clientesCarteira: [
        {
          clienteCnpj: '11.111.111/0001-11',
          razaoSocial: 'Comércio Varejista Alfa Ltda',
          regimeTributario: 'SIMPLES_NACIONAL',
          faturamentoMensalBrl: 150000.00,
          totalLancamentosContabeis: 320,
          conciliacaoBancariaPendente: false
        },
        {
          clienteCnpj: '22.222.222/0001-22',
          razaoSocial: 'Serviços de Tecnologia Beta S/A',
          regimeTributario: 'LUCRO_PRESUMIDO',
          faturamentoMensalBrl: 450000.00,
          totalLancamentosContabeis: 580,
          conciliacaoBancariaPendente: false
        },
        {
          clienteCnpj: '33.333.333/0001-33',
          razaoSocial: 'Indústria Metalúrgica Gama S/A',
          regimeTributario: 'LUCRO_REAL',
          faturamentoMensalBrl: 2500000.00,
          totalLancamentosContabeis: 1420,
          conciliacaoBancariaPendente: false
        }
      ]
    });

    const dataWorkflow = unwrap(resWorkflow);
    expect(dataWorkflow.totalClientesCarteira).toBe(3);
    expect(dataWorkflow.clientesSimplesNacional).toBe(1);
    expect(dataWorkflow.clientesLucroPresumido).toBe(1);
    expect(dataWorkflow.clientesLucroReal).toBe(1);
    expect(dataWorkflow.totalFaturamentoCarteiraBrl).toBe(3100000.00);
    expect(dataWorkflow.fechamentosContabeisConcluidos).toBe(3);
    expect(dataWorkflow.statusFechamentoEscritorio).toBe('CARTEIRA_ESCRITORIO_PROCESSADA_100_PERCENT');
    expect(dataWorkflow.diagnosticoEscritorio).toContain('Carteira de 3 clientes');
  });

  it('2. Deve auditar preventivamente o calendário de obrigações acessórias do escritório e evitar multas', () => {
    const resCalendar = processOfficeObligationsAuditCalendarEngine({
      escritorioNome: 'Soberano Contabilidade & Consultoria Tributária',
      mesReferencia: '2026-08',
      verificacoesObrigacoes: [
        {
          codigoObrigacao: 'PGDAS_D',
          descricao: 'Apuração e Transmissão do Simples Nacional',
          dataLimiteVencimento: '2026-08-20',
          empresasConcluidas: 45,
          empresasPendentes: 0,
          inconsistenciasDetectadas: 3
        },
        {
          codigoObrigacao: 'DCTFWEB',
          descricao: 'Declaração de Débitos e Créditos Tributários Previdenciários',
          dataLimiteVencimento: '2026-08-15',
          empresasConcluidas: 60,
          empresasPendentes: 0,
          inconsistenciasDetectadas: 8
        },
        {
          codigoObrigacao: 'ESOCIAL_S1200',
          descricao: 'Folha de Pagamento e Remunerações',
          dataLimiteVencimento: '2026-08-15',
          empresasConcluidas: 60,
          empresasPendentes: 0,
          inconsistenciasDetectadas: 12
        }
      ]
    });

    const dataCalendar = unwrap(resCalendar);
    expect(dataCalendar.totalObrigacoesMonitoradas).toBe(3);
    expect(dataCalendar.indiceConformidadeCarteiraPercent).toBe(100.0);
    expect(dataCalendar.totalAlertasMalhaFinaEvitados).toBe(23); // 3 + 8 + 12
    expect(dataCalendar.statusAuditoriaEscritorio).toBe('BLINDAGEM_FISCAL_TRABALHISTA_OPERACIONAL');
    expect(dataCalendar.diagnosticoAuditoria).toContain('23 Inconsistencias Previamente Sanadas');
  });
});
