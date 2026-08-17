import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import {
  calculateSimplesNacional,
  calculateLucroPresumido,
  calculateLucroReal,
  calculateDualEngineReforma,
  calculateJcp,
  processBlocoKProduction,
  executeSplitPaymentSettlement
} from '../../../../core/src/index.js';

export async function taxRoutes(fastify: FastifyInstance) {
  fastify.post('/simples-nacional', async (req: FastifyRequest, reply: FastifyReply) => {
    const res = calculateSimplesNacional(req.body as any);
    return res.success ? reply.send(res.data) : reply.status(400).send({ error: res.error.message });
  });

  fastify.post('/lucro-presumido', async (req: FastifyRequest, reply: FastifyReply) => {
    const res = calculateLucroPresumido(req.body as any);
    return res.success ? reply.send(res.data) : reply.status(400).send({ error: res.error.message });
  });

  fastify.post('/lucro-real', async (req: FastifyRequest, reply: FastifyReply) => {
    const res = calculateLucroReal(req.body as any);
    return res.success ? reply.send(res.data) : reply.status(400).send({ error: res.error.message });
  });

  fastify.post('/reforma-dual-engine', async (req: FastifyRequest, reply: FastifyReply) => {
    const res = calculateDualEngineReforma(req.body as any);
    return res.success ? reply.send(res.data) : reply.status(400).send({ error: res.error.message });
  });

  fastify.post('/jcp', async (req: FastifyRequest, reply: FastifyReply) => {
    const res = calculateJcp(req.body as any);
    return res.success ? reply.send(res.data) : reply.status(400).send({ error: res.error.message });
  });

  fastify.post('/bloco-k', async (req: FastifyRequest, reply: FastifyReply) => {
    const { order, bom } = req.body as any;
    const res = processBlocoKProduction(order, bom);
    return res.success ? reply.send(res.data) : reply.status(400).send({ error: res.error.message });
  });

  fastify.post('/split-payment', async (req: FastifyRequest, reply: FastifyReply) => {
    const res = executeSplitPaymentSettlement(req.body as any);
    return res.success ? reply.send(res.data) : reply.status(400).send({ error: res.error.message });
  });
}
