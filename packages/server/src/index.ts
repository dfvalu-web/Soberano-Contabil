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

// Root endpoint: API Dashboard & Welcome Status
app.get('/', async (req, reply) => {
  const accepts = req.headers['accept'] || '';
  if (accepts.includes('text/html')) {
    reply.type('text/html').send(`
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Soberano Contábil — Core API Engine</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: #0f172a;
            color: #f8fafc;
            margin: 0;
            padding: 40px 20px;
            display: flex;
            justify-content: center;
          }
          .card {
            background: #1e293b;
            border: 1px solid #334155;
            border-radius: 16px;
            max-width: 640px;
            width: 100%;
            padding: 32px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
          }
          h1 { margin-top: 0; font-size: 1.6rem; color: #38bdf8; display: flex; align-items: center; gap: 10px; }
          p { color: #94a3b8; font-size: 0.95rem; line-height: 1.5; }
          .badge {
            background: #10b98120;
            color: #10b981;
            padding: 4px 10px;
            border-radius: 9999px;
            font-size: 0.8rem;
            font-weight: 700;
            display: inline-block;
            margin-bottom: 20px;
          }
          .routes {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin: 20px 0;
          }
          .route-item {
            background: #0f172a;
            padding: 12px 16px;
            border-radius: 8px;
            border: 1px solid #334155;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-family: monospace;
            font-size: 0.9rem;
          }
          .route-item a { color: #38bdf8; text-decoration: none; font-weight: 600; }
          .route-item a:hover { text-decoration: underline; }
          .btn-cockpit {
            display: block;
            text-align: center;
            background: #2563eb;
            color: #fff;
            padding: 12px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: bold;
            margin-top: 24px;
            transition: background 0.2s;
          }
          .btn-cockpit:hover { background: #1d4ed8; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1><span>⚡</span> Soberano Contábil — Core API Engine</h1>
          <span class="badge">● SERVIÇO ATIVO & OPERACIONAL (PORTA 4000)</span>
          <p>O servidor backend do <strong>Soberano Contábil</strong> está em execução fornecendo APIs REST para os módulos de Contabilidade, Tributação, Folha e Auditoria.</p>
          
          <div class="routes">
            <div class="route-item">
              <span>GET <a href="/health">/health</a></span>
              <span style="color: #10b981;">Health Check</span>
            </div>
            <div class="route-item">
              <span>POST /api/tax/simulate</span>
              <span style="color: #94a3b8;">Simulador Tributário</span>
            </div>
            <div class="route-item">
              <span>POST /api/accounting/entry</span>
              <span style="color: #94a3b8;">Lançamentos Contábeis</span>
            </div>
            <div class="route-item">
              <span>POST /api/payroll/calculate</span>
              <span style="color: #94a3b8;">Folha de Pagamento</span>
            </div>
            <div class="route-item">
              <span>POST /api/sped/validate</span>
              <span style="color: #94a3b8;">Validador SPED</span>
            </div>
            <div class="route-item">
              <span>POST /api/dfe/validate</span>
              <span style="color: #94a3b8;">Validador DF-e</span>
            </div>
            <div class="route-item">
              <span>GET /api/audit/trail</span>
              <span style="color: #94a3b8;">Audit Trail</span>
            </div>
          </div>

          <a href="http://localhost:5173" class="btn-cockpit">Abrir Cockpit Web Interativo (Frontend :5173) ➔</a>
        </div>
      </body>
      </html>
    `);
    return;
  }

  return {
    system: 'Soberano Contábil — Core API Engine',
    status: 'online',
    version: '1.0.0',
    port: port,
    endpoints: [
      '/health',
      '/api/tax',
      '/api/accounting',
      '/api/sped',
      '/api/payroll',
      '/api/dfe',
      '/api/audit'
    ],
    frontendUrl: 'http://localhost:5173',
    timestamp: new Date()
  };
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
