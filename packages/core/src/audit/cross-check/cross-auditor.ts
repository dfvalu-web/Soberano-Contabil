import { CrossAuditReport, AuditAnomaly } from '../../types/audit.js';
import { Company } from '../../types/company.js';
import { Result, Ok } from '../../types/result.js';

export function runCrossCheckAudit(
  company: Company,
  periodoApurado: string,
  dados: {
    faturamentoEfdIcms: number;
    faturamentoEfdContribuicoes: number;
    faturamentoEcfDRE: number;
    inssDctfWebApurado: number;
    inssEsocialCalculado: number;
    inssReinfRetido: number;
  }
): Result<CrossAuditReport, Error> {
  const anomalias: AuditAnomaly[] = [];

  // 1. Cruzamento EFD-ICMS vs EFD-Contribuições vs ECF
  const diffIcmsPis = Math.abs(dados.faturamentoEfdIcms - dados.faturamentoEfdContribuicoes);
  if (diffIcmsPis > 1.00) {
    anomalias.push({
      id: 'ANOM-001',
      categoria: 'CRUZAMENTO_OBRIGACOES',
      titulo: 'Divergência de Receita Bruta entre EFD-ICMS/IPI e EFD-Contribuições',
      descricao: `A receita declarada no Bloco C da EFD-ICMS (R$ ${dados.faturamentoEfdIcms.toFixed(2)}) diverge da apurada na EFD-Contribuições (R$ ${dados.faturamentoEfdContribuicoes.toFixed(2)}). Diferença: R$ ${diffIcmsPis.toFixed(2)}.`,
      severidade: 'ALTO',
      fundamentacaoLegal: 'Instrução Normativa RFB nº 1.252/2012 e Guia Prático EFD Contribuições',
      documentosAfetados: ['EFD-ICMS/IPI', 'EFD-Contribuições'],
      impactoFinanceiroEstimado: Number((diffIcmsPis * 0.0925).toFixed(2)),
      sugestaoCorrecao: 'Reconcilie os CFOPs de faturamento e devoluções entre os módulos fiscal e de contribuições federais.'
    });
  }

  const diffIcmsEcf = Math.abs(dados.faturamentoEfdIcms - dados.faturamentoEcfDRE);
  if (diffIcmsEcf > 1.00) {
    anomalias.push({
      id: 'ANOM-002',
      categoria: 'CRUZAMENTO_OBRIGACOES',
      titulo: 'Divergência entre Faturamento Fiscal (EFD) e DRE Contábil (ECF)',
      descricao: `A DRE da ECF apresenta faturamento de R$ ${dados.faturamentoEcfDRE.toFixed(2)}, enquanto as notas fiscais escrituradas somam R$ ${dados.faturamentoEfdIcms.toFixed(2)}.`,
      severidade: 'CRITICO',
      fundamentacaoLegal: 'Lei nº 12.973/2014 e Manual de Orientação do Leiaute da ECF',
      documentosAfetados: ['ECF Bloco L/P', 'EFD-ICMS/IPI', 'ECD Bloco J'],
      impactoFinanceiroEstimado: Number((diffIcmsEcf * 0.34).toFixed(2)),
      sugestaoCorrecao: 'Verifique se há lançamentos de ajustes contábeis sem a respectiva nota fiscal ou omissão de receitas tributáveis.'
    });
  }

  // 2. Cruzamento DCTFWeb vs eSocial vs EFD-Reinf
  const inssEsperadoDctf = Number((dados.inssEsocialCalculado + dados.inssReinfRetido).toFixed(2));
  const diffDctf = Math.abs(dados.inssDctfWebApurado - inssEsperadoDctf);
  if (diffDctf > 0.50) {
    anomalias.push({
      id: 'ANOM-003',
      categoria: 'FOLHA_DCTFWEB',
      titulo: 'Inconsistência de Débito Previdenciário na DCTFWeb',
      descricao: `O total gerado na DCTFWeb (R$ ${dados.inssDctfWebApurado.toFixed(2)}) não confere com a soma do eSocial S-1299 (R$ ${dados.inssEsocialCalculado.toFixed(2)}) e EFD-Reinf R-2099 (R$ ${dados.inssReinfRetido.toFixed(2)}).`,
      severidade: 'ALTO',
      fundamentacaoLegal: 'IN RFB nº 2005/2021 (Normas sobre DCTFWeb)',
      documentosAfetados: ['DCTFWeb', 'eSocial S-1200/S-1299', 'EFD-Reinf R-2010/R-2020'],
      impactoFinanceiroEstimado: diffDctf,
      sugestaoCorrecao: 'Reabra e transmita novamente o fechamento do eSocial (S-1299) e Reinf (R-2099) para forçar a re-sincronização na DCTFWeb.'
    });
  }

  const anomaliasCriticas = anomalias.filter(a => a.severidade === 'CRITICO').length;
  const anomaliasAltas = anomalias.filter(a => a.severidade === 'ALTO').length;
  const anomaliasMedias = anomalias.filter(a => a.severidade === 'MEDIO').length;
  const anomaliasBaixas = anomalias.filter(a => a.severidade === 'BAIXO').length;

  const penaltyScore = (anomaliasCriticas * 30) + (anomaliasAltas * 15) + (anomaliasMedias * 5) + (anomaliasBaixas * 2);
  const scoreConformidadeFiscal = Math.max(0, 100 - penaltyScore);

  return Ok({
    dataAuditoria: new Date().toISOString(),
    tenantId: company.tenantId,
    periodoApurado,
    scoreConformidadeFiscal,
    totalAnomalias: anomalias.length,
    anomaliasCriticas,
    anomaliasAltas,
    anomaliasMedias,
    anomaliasBaixas,
    anomalias
  });
}
