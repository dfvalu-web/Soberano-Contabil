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

export async function accountingRoutes(fastify: FastifyInstance) {
  fastify.get('/standard-chart', async (req: FastifyRequest, reply: FastifyReply) => {
    const accounts = createStandardChartOfAccounts('tenant-default');
    return reply.send(accounts);
  });

  fastify.post('/dfc', async (req: FastifyRequest, reply: FastifyReply) => {
    const { accounts, saldoInicialCaixa, periodoInicio, periodoFim, metodo } = req.body as any;
    const res = generateDfcStatement(accounts, saldoInicialCaixa, periodoInicio, periodoFim, metodo);
    return res.success ? reply.send(res.data) : reply.status(400).send({ error: res.error.message });
  });

  fastify.post('/dmpl', async (req: FastifyRequest, reply: FastifyReply) => {
    const { saldoInicialCapital, saldoInicialReservas, saldoInicialLucrosAcumulados, lucroLiquidoExercicio, distribuicaoDividendos, periodoInicio, periodoFim } = req.body as any;
    const res = generateDmplStatement(saldoInicialCapital, saldoInicialReservas, saldoInicialLucrosAcumulados, lucroLiquidoExercicio, distribuicaoDividendos, periodoInicio, periodoFim);
    return res.success ? reply.send(res.data) : reply.status(400).send({ error: res.error.message });
  });

  fastify.post('/ofx/parse', async (req: FastifyRequest, reply: FastifyReply) => {
    const { ofxContent } = req.body as { ofxContent: string };
    const res = parseOfx(ofxContent);
    return res.success ? reply.send(res.data) : reply.status(400).send({ error: res.error.message });
  });
}
