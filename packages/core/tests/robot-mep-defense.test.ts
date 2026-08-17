import { describe, it, expect } from 'vitest';
import {
  AutonomousAccountingRobot,
  calculateEquityMethod,
  generateFiscalDefenseDossier,
  Company,
  unwrap
} from '../src/index.js';

describe('TESTES: Robô Contábil Autônomo, MEP (CPC 18) & Dossiê de Defesa Fiscal', () => {
  const mockCompany: Company = {
    id: 'comp-01',
    tenantId: 'tenant-01',
    cnpj: '12345678000195',
    razaoSocial: 'SOBERANO INDUSTRIA E TECNOLOGIA S/A',
    nomeFantasia: 'Soberano Indústria',
    cnaePrincipal: '2621300',
    cnaesSecundarios: [],
    regimeTributario: 'LUCRO_REAL_TRIMESTRAL',
    uf: 'SP',
    codigoMunicipioIbge: '3550308',
    aliquotaIssMunicipal: 0.05,
    fatorRElegivel: false,
    optanteSimples: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  it('1. Deve registrar e executar job no Robo Contabil Autonomo com hash de auditoria', () => {
    const robot = new AutonomousAccountingRobot();
    robot.registerJob({
      jobId: 'JOB-RECONCIL-01',
      tenantId: 'tenant-01',
      tipo: 'CONCILIACAO_BANCARIA_DIARIA',
      cronExpression: '0 6 * * *',
      ativo: true,
      proximaExecucaoEm: '2026-01-21T06:00:00Z'
    });

    const res = robot.executeJob('JOB-RECONCIL-01');
    const data = unwrap(res);

    expect(data.status).toBe('SUCESSO');
    expect(data.totalItensProcessados).toBe(45);
    expect(data.hashAuditoriaExecucao).toBeDefined();
    expect(data.detalhesExecucao).toContain('Open Finance');
  });

  it('2. Deve calcular Equivalencia Patrimonial (MEP - CPC 18) e gerar partidas dobradas', () => {
    const res = calculateEquityMethod({
      investimentoId: 'INV-COLIG-01',
      nomeInvestida: 'Soberano Logística S/A',
      cnpjInvestida: '98765432000188',
      percentualParticipacao: 40, // 40%
      patrimonioLiquidoAtualInvestida: 2000000.00, // 40% de 2M = 800k
      saldoContabilAnteriorInvestimento: 750000.00, // Ganho de 50k
      lucrosNaoRealizadosIntercompany: 0,
      periodoApuracao: '2026-01'
    });

    const data = unwrap(res);
    expect(data.valorParticipacaoCalculado).toBe(800000.00);
    expect(data.variacaoEquivalenciaPatrimonial).toBe(50000.00);
    expect(data.tipoResultado).toBe('GANHO_MEP');
    expect(data.partidasDobradaSugeridas.length).toBe(2);
    expect(data.partidasDobradaSugeridas[0]!.type).toBe('DEBIT');
    expect(data.partidasDobradaSugeridas[1]!.type).toBe('CREDIT');
  });

  it('3. Deve gerar Dossie de Defesa Fiscal com lastro probatorio STJ', () => {
    const res = generateFiscalDefenseDossier(mockCompany, '2026-01', [
      {
        id: 'CRED-001',
        tipoTributo: 'PIS_COFINS',
        chaveAcessoNfe: '35260199888777000111550010000004561000004567',
        fornecedorCnpj: '99888777000111',
        fornecedorNome: 'DISTRIBUIDORA HARDWARE S/A',
        descricaoInsumo: 'Servidores e Componentes de Rede',
        valorItem: 30000.00,
        valorCreditoApropriado: 2775.00, // PIS 1.65% + COFINS 7.6% = 9.25%
        cstApropriado: '50',
        justificativaEssencialidadeStj: 'Insumo essencial e relevante para a atividade de TI (REsp 1.221.170/PR)',
        comprovanteLiquidacaoBancariaPixTed: 'PIX-E2E-20260120143500'
      }
    ]);

    const data = unwrap(res);
    expect(data.totalCreditosAuditados).toBe(2775.00);
    expect(data.indiceBlindagemFiscalPercent).toBe(100.00);
    expect(data.scoreRiscoGlosa).toBe('MUITO_BAIXO');
    expect(data.conclusaoDossie).toContain('REsp 1.221.170/PR');
  });
});
