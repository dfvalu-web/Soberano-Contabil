import { Result, Ok, Err } from '../types/result.js';

export interface CrossAuditNfeItem {
  chaveAcessoNfe: string;
  numeroNota: number;
  valorTotalNfeBrl: number;
  valorIcmsNfeBrl: number;
  cfopNfe: string;
}

export interface CrossAuditEfdRegistroC100 {
  chaveAcessoSped: string;
  numeroDocumento: number;
  valorDocumentoBrl: number;
  valorIcmsSpedBrl: number;
  cfopSped: string;
}

export interface CrossAuditInput {
  empresaNome: string;
  cnpj: string;
  competencia: string; // Ex: '2026-04'
  notasFiscaisSefazXml: CrossAuditNfeItem[];
  registrosEfdSpedBlocoC: CrossAuditEfdRegistroC100[];
}

export interface CrossAuditDivergence {
  chaveAcesso: string;
  tipoDivergencia: 'NOTA_OMITIDA_NO_SPED' | 'DIVERGENCIA_VALOR_ICMS' | 'DIVERGENCIA_CFOP';
  detalhe: string;
  impactoFinanceiroEstimadoBrl: number;
}

export interface CrossAuditResult {
  empresaNome: string;
  competencia: string;
  totalNotasSefazAnalisadas: number;
  totalRegistrosSpedAnalisados: number;
  totalDivergenciasEncontradas: number;
  divergencias: CrossAuditDivergence[];
  statusAuditoria: 'CONFORME_SEM_DIVERGENCIAS' | 'DIVERGENCIAS_DETECTADAS_RISCO_FISCAL';
  diagnosticoAuditoriaCruzada: string;
}

export function processCrossAuditEfdDfeEngine(input: CrossAuditInput): Result<CrossAuditResult, Error> {
  const {
    empresaNome,
    competencia,
    notasFiscaisSefazXml,
    registrosEfdSpedBlocoC
  } = input;

  if (!notasFiscaisSefazXml || notasFiscaisSefazXml.length === 0) {
    return Err(new Error('Lista de notas fiscais SEFAZ não pode estar vazia.'));
  }

  const spedMap = new Map<string, CrossAuditEfdRegistroC100>();
  for (const reg of registrosEfdSpedBlocoC) {
    spedMap.set(reg.chaveAcessoSped, reg);
  }

  const divergencias: CrossAuditDivergence[] = [];

  for (const nfe of notasFiscaisSefazXml) {
    const regSped = spedMap.get(nfe.chaveAcessoNfe);
    if (!regSped) {
      // Nota emitida na SEFAZ mas omitida na escrituração do SPED
      divergencias.push({
        chaveAcesso: nfe.chaveAcessoNfe,
        tipoDivergencia: 'NOTA_OMITIDA_NO_SPED',
        detalhe: 'Nota Fiscal nº ' + nfe.numeroNota + ' (R$ ' + nfe.valorTotalNfeBrl.toFixed(2) + ') autorizada na SEFAZ não foi escriturada no Bloco C da EFD.',
        impactoFinanceiroEstimadoBrl: nfe.valorIcmsNfeBrl
      });
    } else {
      // Checar divergência de ICMS
      const difIcms = Math.abs(nfe.valorIcmsNfeBrl - regSped.valorIcmsSpedBrl);
      if (difIcms > 0.05) {
        divergencias.push({
          chaveAcesso: nfe.chaveAcessoNfe,
          tipoDivergencia: 'DIVERGENCIA_VALOR_ICMS',
          detalhe: 'Divergência de ICMS na NF nº ' + nfe.numeroNota + ': XML SEFAZ R$ ' + nfe.valorIcmsNfeBrl.toFixed(2) + ' vs SPED Bloco C R$ ' + regSped.valorIcmsSpedBrl.toFixed(2) + '.',
          impactoFinanceiroEstimadoBrl: difIcms
        });
      }
    }
  }

  const status = divergencias.length === 0 ? 'CONFORME_SEM_DIVERGENCIAS' : 'DIVERGENCIAS_DETECTADAS_RISCO_FISCAL';
  const diag = 'Auditoria Cruzada DF-e vs SPED: ' + empresaNome + ' (' + competencia + '). ' + notasFiscaisSefazXml.length + ' NF-e analisadas vs ' + registrosEfdSpedBlocoC.length + ' registros SPED. Divergências: ' + divergencias.length + ' (' + status + ').';

  return Ok({
    empresaNome,
    competencia,
    totalNotasSefazAnalisadas: notasFiscaisSefazXml.length,
    totalRegistrosSpedAnalisados: registrosEfdSpedBlocoC.length,
    totalDivergenciasEncontradas: divergencias.length,
    divergencias,
    statusAuditoria: status,
    diagnosticoAuditoriaCruzada: diag
  });
}
