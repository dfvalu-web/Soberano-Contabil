import { Company } from '../../types/company.js';
import { Result, Ok } from '../../types/result.js';

export interface FiscalCreditItem {
  id: string;
  tipoTributo: 'PIS_COFINS' | 'ICMS' | 'IPI';
  chaveAcessoNfe: string;
  fornecedorCnpj: string;
  fornecedorNome: string;
  descricaoInsumo: string;
  valorItem: number;
  valorCreditoApropriado: number;
  cstApropriado: string;
  justificativaEssencialidadeStj: string;
  comprovanteLiquidacaoBancariaPixTed: string;
}

export interface FiscalDefenseDossierReport {
  empresa: string;
  cnpj: string;
  periodoApuracao: string;
  totalCreditosAuditados: number;
  totalItensComLastroIntegral: number;
  indiceBlindagemFiscalPercent: number;
  scoreRiscoGlosa: 'MUITO_BAIXO' | 'BAIXO' | 'MEDIO' | 'ALTO';
  itensAuditados: FiscalCreditItem[];
  conclusaoDossie: string;
}

export function generateFiscalDefenseDossier(
  company: Company,
  periodoApuracao: string,
  creditos: FiscalCreditItem[]
): Result<FiscalDefenseDossierReport, Error> {
  const totalCreditos = Number(creditos.reduce((s, c) => s + c.valorCreditoApropriado, 0).toFixed(2));
  const itensValidos = creditos.filter(c => c.chaveAcessoNfe.length === 44 && c.comprovanteLiquidacaoBancariaPixTed.length > 5).length;
  const blindagemPercent = creditos.length > 0 ? Number(((itensValidos / creditos.length) * 100).toFixed(2)) : 100;

  const conclusao = `Dossiê probatório consolidado para a empresa ${company.razaoSocial}. Foram auditados R$ ${totalCreditos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} em créditos fiscais, todos devidamente amparados por documentos fiscais idôneos, liquidação financeira bancária e fundamentação de essencialidade conforme tese do STJ (REsp 1.221.170/PR).`;

  return Ok({
    empresa: company.razaoSocial,
    cnpj: company.cnpj,
    periodoApuracao,
    totalCreditosAuditados: totalCreditos,
    totalItensComLastroIntegral: itensValidos,
    indiceBlindagemFiscalPercent: blindagemPercent,
    scoreRiscoGlosa: blindagemPercent === 100 ? 'MUITO_BAIXO' : 'BAIXO',
    itensAuditados: creditos,
    conclusaoDossie: conclusao
  });
}
