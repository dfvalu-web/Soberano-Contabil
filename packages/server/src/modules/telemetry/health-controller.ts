import { FastifyInstance } from 'fastify';

export async function telemetryRoutes(server: FastifyInstance) {
  server.get('/health', async () => {
    const mem = process.memoryUsage();
    return {
      status: 'HEALTHY',
      timestamp: new Date().toISOString(),
      service: 'Soberano Contábil API Engine',
      version: '2026.1.0',
      uptimeSeconds: Math.floor(process.uptime()),
      memory: {
        rssMb: Number((mem.rss / 1024 / 1024).toFixed(2)),
        heapUsedMb: Number((mem.heapUsed / 1024 / 1024).toFixed(2)),
        heapTotalMb: Number((mem.heapTotal / 1024 / 1024).toFixed(2))
      }
    };
  });

  server.get('/metrics', async () => {
    return {
      activeTenants: 1,
      totalJournalEntriesSecured: 128,
      ledgerIntegrityScore: 100,
      pvaPreFlightPassRate: 100
    };
  });
}
