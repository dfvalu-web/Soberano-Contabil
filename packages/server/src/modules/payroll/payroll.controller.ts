import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import {
  calculateMonthlyPayroll,
  calculateTermination,
  calculateVacations,
  calculateThirteenthSalary,
  calculateMonthlyProvisions,
  generateEsocialS1000Xml,
  generateEsocialS1200Xml
} from '../../../../core/src/index.js';

export async function payrollRoutes(fastify: FastifyInstance) {
  fastify.post('/monthly', async (req: FastifyRequest, reply: FastifyReply) => {
    const res = calculateMonthlyPayroll(req.body as any);
    return res.success ? reply.send(res.data) : reply.status(400).send({ error: res.error.message });
  });

  fastify.post('/termination', async (req: FastifyRequest, reply: FastifyReply) => {
    const res = calculateTermination(req.body as any);
    return res.success ? reply.send(res.data) : reply.status(400).send({ error: res.error.message });
  });

  fastify.post('/vacations', async (req: FastifyRequest, reply: FastifyReply) => {
    const res = calculateVacations(req.body as any);
    return res.success ? reply.send(res.data) : reply.status(400).send({ error: res.error.message });
  });

  fastify.post('/thirteenth', async (req: FastifyRequest, reply: FastifyReply) => {
    const res = calculateThirteenthSalary(req.body as any);
    return res.success ? reply.send(res.data) : reply.status(400).send({ error: res.error.message });
  });

  fastify.post('/provisions', async (req: FastifyRequest, reply: FastifyReply) => {
    const res = calculateMonthlyProvisions(req.body as any);
    return res.success ? reply.send(res.data) : reply.status(400).send({ error: res.error.message });
  });
}
