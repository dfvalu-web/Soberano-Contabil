import { Result, Ok, Err } from '../types/result.js';

export interface AuditOpinionSocialBalanceInput {
  clienteCnpj: string;
  razaoSocial: string;
  anoExercicio: number;
  totalReceitaBrutaBrl: number;
  totalTributosRecolhidosBrl: number;
  totalFolhaSalariosEncargosBrl: number;
  investimentosSociaisTreinamentoBrl: number;
  tipoOpiniaoAuditoria: 'SEM_RESSALVAS_OPINIAO_LIMPA' | 'COM_RESSALVAS' | 'ADVERSA' | 'ABSTENCAO_DE_OPINIAO';
  auditorResponsavelNome: string;
  auditorResponsavelCna: string; // Cadastro Nacional de Auditores
}

export interface AuditOpinionSocialBalanceResult {
  clienteCnpj: string;
  razaoSocial: string;
  anoExercicio: number;
  tipoOpiniaoAuditoria: string;
  relatorioAuditoriaTextoFormatado: string;
  balancoSocialDvaPercentualTributos: number;
  balancoSocialDvaPercentualFolha: number;
  statusParecer: 'PARECER_AUDITORIA_E_BALANCO_SOCIAL_EMITIDOS';
  diagnosticoParecer: string;
}

export function processOfficeAuditOpinionSocialBalanceEngine(input: AuditOpinionSocialBalanceInput): Result<AuditOpinionSocialBalanceResult, Error> {
  const {
    clienteCnpj,
    razaoSocial,
    anoExercicio,
    totalReceitaBrutaBrl,
    totalTributosRecolhidosBrl,
    totalFolhaSalariosEncargosBrl,
    investimentosSociaisTreinamentoBrl,
    tipoOpiniaoAuditoria,
    auditorResponsavelNome,
    auditorResponsavelCna
  } = input;

  if (!clienteCnpj || totalReceitaBrutaBrl <= 0 || !auditorResponsavelCna) {
    return Err(new Error('CNPJ, receita bruta e CNA do auditor responsável são obrigatórios.'));
  }

  const percTrib = (totalTributosRecolhidosBrl / totalReceitaBrutaBrl) * 100;
  const percFolha = (totalFolhaSalariosEncargosBrl / totalReceitaBrutaBrl) * 100;

  const relatorio = "RELATÓRIO DOS AUDITORES INDEPENDENTES SOBRE AS DEMONSTRAÇÕES CONTÁBEIS (NBC TA 700)\n\n" +
    "Aos Acionistas e Administradores de " + razaoSocial + "\n\n" +
    "Opinião: Examinamos as demonstrações contábeis da " + razaoSocial + ", que compreendem o Balanço Patrimonial em 31 de dezembro de " + anoExercicio + ", a DRE, DMPL e DFC.\n" +
    "Em nossa opinião (" + tipoOpiniaoAuditoria + "), as demonstrações contábeis apresentam adequadamente, em todos os aspectos relevantes, a posição patrimonial e financeira da entidade de acordo com as normas contábeis brasileiras (CPCs/IFRS).\n\n" +
    "Auditor Responsável: " + auditorResponsavelNome + " - CNA " + auditorResponsavelCna;

  const diag = "Parecer de Auditoria (" + razaoSocial + " - " + anoExercicio + "): Parecer emitido (" + tipoOpiniaoAuditoria + ") por " + auditorResponsavelNome + " (CNA: " + auditorResponsavelCna + ") | Balanço Social: R$ " + totalTributosRecolhidosBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " em tributos (" + percTrib.toFixed(1) + "% da receita) e R$ " + totalFolhaSalariosEncargosBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " em remuneração/trabalho (" + percFolha.toFixed(1) + "%).";

  return Ok({
    clienteCnpj,
    razaoSocial,
    anoExercicio,
    tipoOpiniaoAuditoria,
    relatorioAuditoriaTextoFormatado: relatorio,
    balancoSocialDvaPercentualTributos: parseFloat(percTrib.toFixed(1)),
    balancoSocialDvaPercentualFolha: parseFloat(percFolha.toFixed(1)),
    statusParecer: 'PARECER_AUDITORIA_E_BALANCO_SOCIAL_EMITIDOS',
    diagnosticoParecer: diag
  });
}
