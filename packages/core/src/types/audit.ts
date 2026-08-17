export type RiskSeverity = 'BAIXO' | 'MEDIO' | 'ALTO' | 'CRITICO';

export interface AuditAnomaly {
  id: string;
  categoria: 'CRUZAMENTO_OBRIGACOES' | 'CLASSIFICACAO_FISCAL' | 'RETENCOES' | 'ALIQUOTAS' | 'FOLHA_DCTFWEB';
  titulo: string;
  descricao: string;
  severidade: RiskSeverity;
  fundamentacaoLegal: string;
  documentosAfetados: string[];
  impactoFinanceiroEstimado?: number;
  sugestaoCorrecao: string;
}

export interface CrossAuditReport {
  dataAuditoria: string;
  tenantId: string;
  periodoApurado: string;
  scoreConformidadeFiscal: number; // 0 a 100
  totalAnomalias: number;
  anomaliasCriticas: number;
  anomaliasAltas: number;
  anomaliasMedias: number;
  anomaliasBaixas: number;
  anomalias: AuditAnomaly[];
}
