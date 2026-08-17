import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import {
  runCrossCheckAudit,
  detectFiscalAnomalies
} from '../../../../core/src/index.js';

export async function auditRoutes(fastify: FastifyInstance) {
  fastify.post('/cross-check', async (req: FastifyRequest, reply: FastifyReply) => {
    const { company, periodoApuracao, inputs } = req.body as any;
    const res = runCrossCheckAudit(company, periodoApuracao, inputs);
    return res.success ? reply.send(res.data) : reply.status(400).send({ error: res.error.message });
  });

  fastify.post('/anomalies', async (req: FastifyRequest, reply: FastifyReply) => {
    const { items } = req.body as any;
    const res = detectFiscalAnomalies(items || []);
    return res.success ? reply.send(res.data) : reply.status(400).send({ error: res.error.message });
  });
}
