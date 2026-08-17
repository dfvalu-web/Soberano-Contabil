import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import {
  parseNfeXml,
  parseCteXml,
  parseNfseXml,
  convertDfeToJournalLines
} from '../../../../core/src/index.js';

export async function dfeRoutes(fastify: FastifyInstance) {
  fastify.post('/nfe/parse', async (req: FastifyRequest, reply: FastifyReply) => {
    const { xmlContent } = req.body as { xmlContent: string };
    const res = parseNfeXml(xmlContent);
    return res.success ? reply.send(res.data) : reply.status(400).send({ error: res.error.message });
  });

  fastify.post('/cte/parse', async (req: FastifyRequest, reply: FastifyReply) => {
    const { xmlContent } = req.body as { xmlContent: string };
    const res = parseCteXml(xmlContent);
    return res.success ? reply.send(res.data) : reply.status(400).send({ error: res.error.message });
  });

  fastify.post('/nfse/parse', async (req: FastifyRequest, reply: FastifyReply) => {
    const { xmlContent } = req.body as { xmlContent: string };
    const res = parseNfseXml(xmlContent);
    return res.success ? reply.send(res.data) : reply.status(400).send({ error: res.error.message });
  });
}
