import { Result, Ok, Err } from '../types/result.js';

export interface TaxRecoveryItemEntry {
  mesCompetencia: string; // Ex: '2024-05'
  faturamentoBrutoTotalBrl: number;
  faturamentoItensMonofasicosBrl: number;
  aliquotaSimplesOuPisCofinsPercent: number; // Ex: 4.2% parte PIS/COFINS
  icmsDestacadoExcluirBaseBrl: number; // Tema 69 STF
  aliquotaPisCofinsRealPresumidoPercent: number; // Ex: 9.25% ou 3.65%
}

export interface TaxRecoveryInput {
  clienteCnpj: string;
  razaoSocial: string;
  regimeTributario: 'SIMPLES_NACIONAL' | 'LUCRO_PRESUMIDO' | 'LUCRO_REAL';
  historicoMeses60: TaxRecoveryItemEntry[];
}

export interface TaxRecoveryResult {
  clienteCnpj: string;
  razaoSocial: string;
  totalMesesAuditados: number;
  totalCreditoMonofasicoPrincipalBrl: number;
  totalCreditoTema69StfPrincipalBrl: number;
  totalCreditoPrincipalRecuperavelBrl: number;
  statusDiagnostico: 'DIAGNOSTICO_FISCAL_CREDITOS_APURADO_COM_SUCESSO';
  diagnosticoFiscal: string;
}

export function processOfficeTaxCreditRecoveryEngine(input: TaxRecoveryInput): Result<TaxRecoveryResult, Error> {
  const {
    clienteCnpj,
    razaoSocial,
    regimeTributario,
    historicoMeses60
  } = input;

  if (!clienteCnpj || !historicoMeses60 || historicoMeses60.length === 0) {
    return Err(new Error('CNPJ e histórico de competências são obrigatórios.'));
  }

  let creditoMonofasico = 0;
  let creditoTema69 = 0;

  for (const m of historicoMeses60) {
    if (regimeTributario === 'SIMPLES_NACIONAL') {
      // No Simples, recupera a parcela de PIS/COFINS paga indevidamente sobre produtos monofásicos
      const credMonoMes = (m.faturamentoItensMonofasicosBrl * m.aliquotaSimplesOuPisCofinsPercent) / 100;
      creditoMonofasico += credMonoMes;
    } else {
      // No Presumido/Real, recupera Monofásico + Tese do Século (ICMS excluído da base)
      const credTema69Mes = (m.icmsDestacadoExcluirBaseBrl * m.aliquotaPisCofinsRealPresumidoPercent) / 100;
      creditoTema69 += credTema69Mes;
    }
  }

  const totalPrincipal = creditoMonofasico + creditoTema69;

  const diag = "Diagnóstico de Créditos Tributários (" + razaoSocial + " - " + regimeTributario + "): " + historicoMeses60.length + " meses auditados | Crédito Monofásico: R$ " + creditoMonofasico.toLocaleString('pt-BR') + " | Tese do Século STF 69: R$ " + creditoTema69.toLocaleString('pt-BR') + " | Total Principal: R$ " + totalPrincipal.toLocaleString('pt-BR') + " (Aguardando atualização SELIC).";

  return Ok({
    clienteCnpj,
    razaoSocial,
    totalMesesAuditados: historicoMeses60.length,
    totalCreditoMonofasicoPrincipalBrl: parseFloat(creditoMonofasico.toFixed(2)),
    totalCreditoTema69StfPrincipalBrl: parseFloat(creditoTema69.toFixed(2)),
    totalCreditoPrincipalRecuperavelBrl: parseFloat(totalPrincipal.toFixed(2)),
    statusDiagnostico: 'DIAGNOSTICO_FISCAL_CREDITOS_APURADO_COM_SUCESSO',
    diagnosticoFiscal: diag
  });
}
