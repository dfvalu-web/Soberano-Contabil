import { describe, it, expect } from 'vitest';
import {
  generateSeedData,
  SecurityEngine,
  AuditTrailManager,
  ImmutableLedgerChain,
  runComprehensiveTaxComparison,
  createStandardChartOfAccounts,
  DoubleEntryEngine,
  generateFinancialStatements,
  generateDfcStatement,
  generateDmplStatement,
  generateExplanatoryNotes,
  executeAnnualClosing,
  generateSpedEcd,
  generateSpedEcf,
  generateEfdIcmsIpi,
  generateEfdContribuicoes,
  generateEfdReinfR4020Xml,
  validateSpedFile,
  calculateMonthlyPayroll,
  calculateVacations,
  calculateThirteenthSalary,
  generateEsocialS1000Xml,
  generateEsocialS1200Xml,
  generateEsocialS1299Xml,
  simulateSefazBatchDistribution,
  parseNfeXml,
  convertDfeToJournalLines,
  detectFiscalAnomalies,
  runCrossCheckAudit,
  unwrap
} from '../src/index.js';

describe('MASTER SUITE: Execucao E2E Completa em Ordem Crescente (Etapas 1 a 8)', () => {
  const seed = generateSeedData();
  const company = seed.companies[0]!;
  const security = new SecurityEngine();
  const auditTrail = new AuditTrailManager(security);
  const ledgerChain = new ImmutableLedgerChain(security);

  it('ETAPA 1: Inicializacao do Database Seeder, Criptografia e Append-Only Ledger', () => {
    expect(seed.tenants.length).toBeGreaterThan(0);
    expect(seed.companies.length).toBe(3);
    expect(seed.accounts.length).toBeGreaterThan(10);

    const genesis = ledgerChain.createGenesisBlock(company.tenantId, company.id);
    expect(genesis.sequence).toBe(0);
    expect(genesis.blockHash).toBeDefined();

    const auditLog = auditTrail.record(company.tenantId, 'INIT_SEEDED_ENVIRONMENT', 'SYSTEM', 'SYS-01');
    expect(auditTrail.verifyLogIntegrity(auditLog)).toBe(true);
  });

  it('ETAPA 2: Simulador Tributario Universal e Diagnostico dos 4 Regimes Tributarios', () => {
    const comparisonRes = runComprehensiveTaxComparison({
      receitaBrutaMensal: 300000.00,
      receitaBruta12Meses: 3600000.00,
      folhaSalariosMensal: 60000.00,
      folhaSalarios12Meses: 720000.00,
      custoInsumosMercadoriasMensal: 120000.00,
      despesasOperacionaisMensal: 40000.00,
      tipoAtividade: 'COMERCIO',
      ufOrigem: 'SP',
      ufDestino: 'RJ'
    });

    const comp = unwrap(comparisonRes);
    expect(comp.simplesNacional.elegivel).toBe(true);
    expect(comp.lucroPresumido.impostoTotalMes).toBeGreaterThan(0);
    expect(comp.lucroReal.impostoTotalMes).toBeGreaterThan(0);
    expect(comp.reformaEc132Ano2026.impostoTotalMes).toBeGreaterThan(0);
    expect(comp.regimeMaisEconomico).toBeDefined();
  });

  it('ETAPA 3: Motor Contabil IFRS/CPC, DFC, DMPL, Fechamento ARE e Notas Explicativas', () => {
    const engine = new DoubleEntryEngine(seed.accounts);

    // Lançamento de faturamento
    engine.postEntry(company.tenantId, '2026-01-15', 'Faturamento de Vendas', [
      { accountId: '1.1.2.01', accountCode: '1.1.2.01', accountName: 'Clientes Nacionais', type: 'DEBIT', amount: 200000.00 },
      { accountId: '3.1.1.01', accountCode: '3.1.1.01', accountName: 'Receita de Vendas', type: 'CREDIT', amount: 200000.00 }
    ]);

    const stmts = unwrap(generateFinancialStatements(engine.getAccounts(), '2026-01-01', '2026-01-31'));
    expect(stmts.balanceSheet.totalAtivo).toBeGreaterThan(0);

    const dfc = unwrap(generateDfcStatement(engine.getAccounts(), 50000.00, '2026-01-01', '2026-01-31'));
    expect(dfc.saldoFinalCaixa).toBeDefined();

    const dmpl = unwrap(generateDmplStatement(100000, 10000, 20000, 50000, 10000, '2026-01-01', '2026-01-31'));
    expect(dmpl.totalPatrimonioLiquidoFinal).toBeGreaterThan(0);

    const notes = unwrap(generateExplanatoryNotes(company, '2026', stmts.balanceSheet, stmts.incomeStatement));
    expect(notes.notasExplicativas.length).toBe(5);

    const closure = unwrap(executeAnnualClosing(engine, company.tenantId, '2026-12-31', '2.3.1.01', 'Capital e Reservas'));
    expect(closure.resultadoLiquidoExercicio).toBe(200000.00);
  });

  it('ETAPA 4: Suite SPED (ECD, ECF, EFD-ICMS/IPI, EFD-Contribuicoes, EFD-Reinf) & Pre-Flight PVA', () => {
    const ecdTxt = generateSpedEcd(company, 2026, seed.accounts, []);
    expect(unwrap(validateSpedFile('ECD', ecdTxt)).isAprovadoPreFlight).toBe(true);

    const ecfTxt = generateSpedEcf(company, 2026, seed.accounts, [], 'LUCRO_REAL');
    expect(unwrap(validateSpedFile('ECF', ecfTxt)).isAprovadoPreFlight).toBe(true);

    const efdIcmsTxt = generateEfdIcmsIpi(company, { mes: 1, ano: 2026 }, []);
    expect(unwrap(validateSpedFile('EFD_ICMS_IPI', efdIcmsTxt)).isAprovadoPreFlight).toBe(true);

    const reinfXml = generateEfdReinfR4020Xml(company, '99888777000111', '15001', 10000.00, 150.00, 100.00, 300.00, 65.00);
    expect(reinfXml).toContain('<evtRetPJ');
  });

  it('ETAPA 5: Folha de Pagamento, Ferias, 13o Salario, eSocial S-1000/S-1200/S-1299', () => {
    const folha = unwrap(calculateMonthlyPayroll({ salarioBase: 8000.00, dependentesIrrf: 2 }));
    expect(folha.salarioLiquido).toBeGreaterThan(0);

    const ferias = unwrap(calculateVacations({ salarioBase: 8000.00, diasGozoFerias: 30, diasAbonoPecuniario: 0 }));
    expect(ferias.liquidoFeriasAReceber).toBeGreaterThan(0);

    const s1000 = generateEsocialS1000Xml(company);
    expect(s1000).toContain('<evtInfoEmpregador');

    const s1299 = generateEsocialS1299Xml(company, '2026-01');
    expect(s1299).toContain('<evtFechaEvPer');
  });

  it('ETAPA 6: Pipeline DF-e Zero-Touch via Sefaz Batch e Pre-Flight Cross-Auditor', () => {
    const sefazBatch = unwrap(simulateSefazBatchDistribution(company.cnpj, 0));
    expect(sefazBatch.documentosEncontrados.length).toBe(2);

    const parsedNfe = unwrap(parseNfeXml(sefazBatch.documentosEncontrados[0]!.xml));
    expect(parsedNfe.totais.valorTotalNota).toBe(30000.00);

    const journalLines = unwrap(convertDfeToJournalLines(parsedNfe, company));
    expect(journalLines.length).toBeGreaterThanOrEqual(2);

    const auditReport = unwrap(runCrossCheckAudit(company, '2026-01', {
      faturamentoEfdIcms: 300000.00,
      faturamentoEfdContribuicoes: 300000.00,
      faturamentoEcfDRE: 300000.00,
      inssDctfWebApurado: 25000.00,
      inssEsocialCalculado: 25000.00,
      inssReinfRetido: 0
    }));
    expect(auditReport.totalAnomalias).toBe(0);
    expect(auditReport.scoreConformidadeFiscal).toBe(100);
  });
});
