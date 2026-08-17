import Fastify from 'fastify';
import cors from '@fastify/cors';
import { taxRoutes } from './modules/tax/tax.controller.js';
import { accountingRoutes } from './modules/accounting/accounting.controller.js';
import { spedRoutes } from './modules/sped/sped.controller.js';
import { payrollRoutes } from './modules/payroll/payroll.controller.js';
import { dfeRoutes } from './modules/dfe/dfe.controller.js';
import { auditRoutes } from './modules/audit/audit.controller.js';

const app = Fastify({
  logger: true
});

await app.register(cors, {
  origin: '*'
});

// Health check
app.get('/health', async () => ({ status: 'healthy', system: 'Soberano Contabil Core Engine', timestamp: new Date() }));

// Register module routes
await app.register(taxRoutes, { prefix: '/api/tax' });
await app.register(accountingRoutes, { prefix: '/api/accounting' });
await app.register(spedRoutes, { prefix: '/api/sped' });
await app.register(payrollRoutes, { prefix: '/api/payroll' });
await app.register(dfeRoutes, { prefix: '/api/dfe' });
await app.register(auditRoutes, { prefix: '/api/audit' });

const port = Number(process.env.PORT || 4000);
const host = '0.0.0.0';

try {
  await app.listen({ port, host });
  console.log(`[Soberano Contabil] Server running at http://localhost:${port}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
