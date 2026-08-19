import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import {
  createStandardChartOfAccounts,
  DoubleEntryEngine,
  generateFinancialStatements,
  generateDfcStatement,
  generateDmplStatement,
  executeAnnualClosing,
  parseOfx
} from '../../../../core/src/index.js';
import { generalJournalEngine } from '../../../../core/src/accounting/ledger/general-journal-engine.js';
import { smartOfxReconciler } from '../../../../core/src/accounting/reconciliation/smart-ofx-reconciler.js';
import { trialBalanceEngine } from '../../../../core/src/accounting/reports/trial-balance-engine.js';
import { accountingIntegrationEngine } from '../../../../core/src/accounting/integration/accounting-integration-engine.js';
import { areClosingEngine } from '../../../../core/src/accounting/closing/are-closing-engine.js';
import { spedEcdGenerator } from '../../../../core/src/accounting/reports/sped-ecd-generator.js';

export async function accountingRoutes(fastify: FastifyInstance) {
  // 1. Plano de Contas
  fastify.get('/standard-chart', async (req: FastifyRequest, reply: FastifyReply) => {
    const accounts = createStandardChartOfAccounts('tenant-default');
    return reply.send(accounts);
  });

  // 2. Lançamentos do Diário Geral
  fastify.get('/entries/:tenantId', async (req: FastifyRequest, reply: FastifyReply) => {
    const { tenantId } = req.params as { tenantId: string };
    const entries = generalJournalEngine.getEntries(tenantId);
    const totals = generalJournalEngine.getLedgerTotals(tenantId);
    return reply.send({ entries, totals });
  });

  fastify.post('/entries', async (req: FastifyRequest, reply: FastifyReply) => {
    const body = req.body as any;
    const res = generalJournalEngine.postEntry(body);
    return res.success ? reply.send(res) : reply.status(400).send(res);
  });

  // 3. Sincronização Fiscal e Folha
  fastify.post('/sync/fiscal', async (req: FastifyRequest, reply: FastifyReply) => {
    const { tenantId, competencia } = req.body as { tenantId: string; competencia: string };
    const res = accountingIntegrationEngine.syncFiscalToAccounting(tenantId || 't1', competencia || '2026-08');
    return reply.send(res);
  });

  fastify.post('/sync/payroll', async (req: FastifyRequest, reply: FastifyReply) => {
    const { tenantId, competencia } = req.body as { tenantId: string; competencia: string };
    const res = accountingIntegrationEngine.syncPayrollToAccounting(tenantId || 't1', competencia || '2026-08');
    return reply.send(res);
  });

  // 4. Balancete de 8 Colunas
  fastify.get('/trial-balance/:tenantId', async (req: FastifyRequest, reply: FastifyReply) => {
    const { tenantId } = req.params as { tenantId: string };
    const tb = trialBalanceEngine.generateTrialBalance(tenantId);
    return reply.send(tb);
  });

  // 5. Conciliação OFX e Upload
  fastify.post('/ofx/parse', async (req: FastifyRequest, reply: FastifyReply) => {
    const { ofxContent, bankName } = req.body as { ofxContent: string; bankName?: string };
    const res = smartOfxReconciler.parseOfxContent(ofxContent, bankName || 'Banco');
    return reply.send(res);
  });

  fastify.post('/ofx/batch-reconcile', async (req: FastifyRequest, reply: FastifyReply) => {
    const { tenantId } = req.body as { tenantId: string };
    const res = smartOfxReconciler.batchReconcileAll(tenantId || 't1');
    return reply.send(res);
  });

  // 6. Fechamento ARE
  fastify.post('/closing/are', async (req: FastifyRequest, reply: FastifyReply) => {
    const { tenantId, competencia } = req.body as { tenantId: string; competencia: string };
    const res = areClosingEngine.executeAreClosing({ tenantId: tenantId || 't1', competencia: competencia || '2026-08' });
    return reply.send(res);
  });
}