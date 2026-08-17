import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import {
  generateSpedEcd,
  generateSpedEcf,
  generateEfdIcmsIpi,
  generateEfdContribuicoes,
  validateSpedFile
} from '../../../../core/src/index.js';

export async function spedRoutes(fastify: FastifyInstance) {
  fastify.post('/validate', async (req: FastifyRequest, reply: FastifyReply) => {
    const { tipoSped, fileContent } = req.body as { tipoSped: any; fileContent: string };
    const res = validateSpedFile(tipoSped, fileContent);
    return res.success ? reply.send(res.data) : reply.status(400).send({ error: res.error.message });
  });

  fastify.post('/ecd/generate', async (req: FastifyRequest, reply: FastifyReply) => {
    const { company, ano, accounts, entries } = req.body as any;
    const file = generateSpedEcd(company, ano, accounts || [], entries || []);
    return reply.send({ fileContent: file });
  });

  fastify.post('/ecf/generate', async (req: FastifyRequest, reply: FastifyReply) => {
    const { company, ano, accounts, entries, lucroPresumidoOuReal } = req.body as any;
    const file = generateSpedEcf(company, ano, accounts || [], entries || [], lucroPresumidoOuReal);
    return reply.send({ fileContent: file });
  });

  fastify.post('/efd-icms/generate', async (req: FastifyRequest, reply: FastifyReply) => {
    const { company, mesAno, itens } = req.body as any;
    const file = generateEfdIcmsIpi(company, mesAno, itens || []);
    return reply.send({ fileContent: file });
  });

  fastify.post('/efd-contribuicoes/generate', async (req: FastifyRequest, reply: FastifyReply) => {
    const { company, mesAno, faturamentoBruto } = req.body as any;
    const file = generateEfdContribuicoes(company, mesAno, faturamentoBruto);
    return reply.send({ fileContent: file });
  });
}
