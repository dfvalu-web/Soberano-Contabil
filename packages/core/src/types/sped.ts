export type SpedType = 'ECD' | 'ECF' | 'EFD_ICMS_IPI' | 'EFD_CONTRIBUICOES' | 'EFD_REINF';

export interface SpedRecord {
  registro: string;
  campos: (string | number | undefined | null)[];
}

export interface SpedValidationIssue {
  tipo: 'ERRO' | 'AVISO';
  registro?: string;
  linha?: number;
  campo?: string;
  mensagem: string;
  valorEncontrado?: string;
  valorEsperado?: string;
  sugestaoCorrecao?: string;
}

export interface SpedValidationReport {
  tipoSped: SpedType;
  totalLinhas: number;
  totalErros: number;
  totalAvisos: number;
  isAprovadoPreFlight: boolean;
  inconsistencias: SpedValidationIssue[];
  conteudoSpedPreview?: string;
}
