import { describe, it, expect } from 'vitest';
import {
  processDistributedBullMqHeavyJobQueue,
  processMultichannelTaxAlertsWhatsappDispatcher,
  unwrap
} from '../src/index.js';

describe('TESTES: Filas Distribuídas (BullMQ/Redis) & Notificações WhatsApp (Pilar 4 - Produção)', () => {
  it('1. Deve enfileirar job pesado no Redis com particionamento em 8 workers paralelos e DLQ ativa', () => {
    const resQueue = processDistributedBullMqHeavyJobQueue({
      tenantId: '00000000-0000-0000-0000-000000000001',
      tipoJob: 'IMPORTACAO_MASSIVA_XMLS',
      prioridade: 'URGENTE_1',
      totalItensParaProcessar: 50000, // 50k XMLs
      parametrosPayload: { mes: '2026-04' },
      concorrenciaWorkers: 8
    });

    const dataQueue = unwrap(resQueue);
    expect(dataQueue.statusFila).toBe('ENFILEIRADO_COM_SUCESSO_REDIS');
    expect(dataQueue.configuracaoFila.concorrenciaWorkers).toBe(8);
    expect(dataQueue.configuracaoFila.deadLetterQueueAtiva).toBe(true);
    expect(dataQueue.tempoEstimadoProcessamentoSegundos).toBe(50); // 50k / 1000/s = 50s
    expect(dataQueue.diagnosticoBullMq).toContain('Volume: 50.000 itens -> Distribuido em 8 workers paralelos');
  });

  it('2. Deve formatar e despachar alerta fiscal no WhatsApp Business Cloud API com assinatura HMAC SHA-256', () => {
    const resAlert = processMultichannelTaxAlertsWhatsappDispatcher({
      tenantId: '00000000-0000-0000-0000-000000000001',
      canal: 'WHATSAPP_BUSINESS_API',
      telefoneOuDestino: '+5511999998888',
      tipoAlerta: 'GUIA_IMPOSTO_A_VENCER',
      tituloAlerta: 'DARF IRPJ/CSLL - 1º Trimestre/2026',
      valorGuiaBrl: 45000.00,
      dataVencimentoIso: '2026-04-30'
    });

    const dataAlert = unwrap(resAlert);
    expect(dataAlert.statusEntrega).toBe('NOTIFICACAO_DESPACHADA_COM_SUCESSO');
    expect(dataAlert.codigoStatusHttp).toBe(200);
    expect(dataAlert.hashAssinaturaHmacSha256).toBeDefined();
    expect(dataAlert.mensagemFormatada).toContain('DARF IRPJ/CSLL - 1º Trimestre/2026');
    expect(dataAlert.mensagemFormatada).toContain('R$ 45000.00');
    expect(dataAlert.diagnosticoAlerta).toContain('Template Oficial Validado pelo Meta WhatsApp Cloud API');
  });
});
