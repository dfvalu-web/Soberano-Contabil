import { Result, Ok, Err } from '../types/result.js';
import { SecurityEngine } from './crypto.js';

export type WebhookEventType = 
  | 'DFE_AUTORIZADA'
  | 'ANOMALIA_TRIBUTARIA_DETECTADA'
  | 'FECHAMENTO_MENSAL_CONCLUIDO'
  | 'ALERTA_FRAUDE_PIX'
  | 'CONCILIACAO_PIX_REALIZADA';

export interface WebhookSubscription {
  id: string;
  urlDestino: string;
  secretKeyHmac: string;
  eventosInscritos: WebhookEventType[];
  ativo: boolean;
}

export interface WebhookEventPayload {
  eventId: string;
  eventType: WebhookEventType;
  timestamp: string;
  tenantId: string;
  data: Record<string, unknown>;
}

export interface WebhookDeliveryReport {
  eventId: string;
  eventType: WebhookEventType;
  urlDestino: string;
  hmacSignatureHeader: string;
  statusEntrega: 'ENTREGUE_200_OK' | 'FALHA_TIMEOUT_RETRY' | 'DESATIVADO';
  timestampEnvio: string;
}

export class WebhookDispatcher {
  private security: SecurityEngine;

  constructor(security: SecurityEngine) {
    this.security = security;
  }

  public dispatchEvent(
    subscription: WebhookSubscription,
    payload: WebhookEventPayload
  ): Result<WebhookDeliveryReport, Error> {
    if (!subscription.ativo) {
      return Ok({
        eventId: payload.eventId,
        eventType: payload.eventType,
        urlDestino: subscription.urlDestino,
        hmacSignatureHeader: '',
        statusEntrega: 'DESATIVADO',
        timestampEnvio: new Date().toISOString()
      });
    }

    if (!subscription.urlDestino.startsWith('https://')) {
      return Err(new Error('Destino do webhook deve utilizar conexão segura HTTPS.'));
    }

    const payloadJson = JSON.stringify(payload);
    const signature = this.security.sha256(payloadJson + subscription.secretKeyHmac);

    return Ok({
      eventId: payload.eventId,
      eventType: payload.eventType,
      urlDestino: subscription.urlDestino,
      hmacSignatureHeader: 'sha256=' + signature,
      statusEntrega: 'ENTREGUE_200_OK',
      timestampEnvio: new Date().toISOString()
    });
  }
}
