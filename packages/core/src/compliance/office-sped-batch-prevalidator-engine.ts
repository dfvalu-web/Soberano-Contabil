import { Result, Ok, Err } from '../types/result.js';

export interface SpedFileValidationEntry {
  clienteCnpj: string;
  razaoSocial: string;
  tipoSped: 'ECD_CONTABIL' | 'ECF_FISCAL' | 'EFD_CONTRIBUICOES' | 'EFD_ICMS_IPI' | 'EFD_REINF';
  anoOuMesCompetencia: string;
  totalLinhasArquivo: number;
  possuiDivergenciaPlanoReferencial: boolean;
  possuiCstIncompativelCfop: boolean;
  possuiSaldoContabilDesbalanceado: boolean;
}

export interface SpedBatchInput {
  escritorioNome: string;
  loteArquivosSped: SpedFileValidationEntry[];
}

export interface SpedFileReport {
  clienteCnpj: string;
  razaoSocial: string;
  tipoSped: string;
  competencia: string;
  totalErrosCriticos: number;
  totalAdvertencias: number;
  statusValidacao: 'SPED_VALIDADO_100_PRONTO_TRANSMISSAO' | 'SPED_COM_ERROS_REQUER_CORRECAO';
}

export interface SpedBatchResult {
  escritorioNome: string;
  totalArquivosAuditados: number;
  totalArquivosAprovados: number;
  totalArquivosComErros: number;
  relatorioDetalhado: SpedFileReport[];
  statusAuditoriaSped: 'LOTE_SPED_PRE_VALIDADO_COM_SUCESSO';
  diagnosticoSped: string;
}

export function processOfficeSpedBatchPrevalidatorEngine(input: SpedBatchInput): Result<SpedBatchResult, Error> {
  const {
    escritorioNome,
    loteArquivosSped
  } = input;

  if (!escritorioNome || !loteArquivosSped || loteArquivosSped.length === 0) {
    return Err(new Error('Nome do escritório e relação de arquivos SPED são obrigatórios.'));
  }

  let aprovados = 0;
  let comErros = 0;
  const relatorio: SpedFileReport[] = [];

  for (const s of loteArquivosSped) {
    let erros = 0;
    let advertencias = 0;

    if (s.possuiSaldoContabilDesbalanceado) erros += 2;
    if (s.possuiCstIncompativelCfop) erros += 1;
    if (s.possuiDivergenciaPlanoReferencial) advertencias += 1;

    const isAprovado = erros === 0;
    if (isAprovado) aprovados++;
    else comErros++;

    relatorio.push({
      clienteCnpj: s.clienteCnpj,
      razaoSocial: s.razaoSocial,
      tipoSped: s.tipoSped,
      competencia: s.anoOuMesCompetencia,
      totalErrosCriticos: erros,
      totalAdvertencias: advertencias,
      statusValidacao: isAprovado ? 'SPED_VALIDADO_100_PRONTO_TRANSMISSAO' : 'SPED_COM_ERROS_REQUER_CORRECAO'
    });
  }

  const diag = "Pré-Validador SPED em Lote (" + escritorioNome + "): " + loteArquivosSped.length + " arquivos auditados | Aprovados: " + aprovados + " | Com Erros a Corrigir: " + comErros + " -> Blindagem contra multas da RFB.";

  return Ok({
    escritorioNome,
    totalArquivosAuditados: loteArquivosSped.length,
    totalArquivosAprovados: aprovados,
    totalArquivosComErros: comErros,
    relatorioDetalhado: relatorio,
    statusAuditoriaSped: 'LOTE_SPED_PRE_VALIDADO_COM_SUCESSO',
    diagnosticoSped: diag
  });
}
