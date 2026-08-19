import { Result, Ok, Err } from '../types/result.js';

export interface TaxAssessmentInput {
  clienteCnpj: string;
  razaoSocial: string;
  mesCompetencia: string;
  regimeTributario: 'SIMPLES_NACIONAL' | 'LUCRO_PRESUMIDO' | 'LUCRO_REAL';
  faturamentoServicosBrl: number;
  faturamentoComercioBrl: number;
  aliquotaEfetivaPercent: number; // Ex: 6.0% no Simples ou 11.33% Presumido
}

export interface TaxPaymentSlipEntry {
  codigoTributo: string; // Ex: 'DAS', 'DARF_IRPJ', 'DARF_CSLL', 'DARF_PIS_COFINS', 'ISSQN'
  descricaoGuia: string;
  dataVencimento: string;
  valorGuiaBrl: number;
  codigoBarras: string;
  pixCopiaECola: string;
}

export interface DailyTaxResult {
  clienteCnpj: string;
  razaoSocial: string;
  mesCompetencia: string;
  totalFaturamentoBrl: number;
  totalTributosApuradosBrl: number;
  guiasRecolhimento: TaxPaymentSlipEntry[];
  statusApuracao: 'APURACAO_FISCAL_CONCLUIDA_GUIAS_GERADAS';
  diagnosticoFiscal: string;
}

export function processOfficeDailyTaxOperationsEngine(input: TaxAssessmentInput): Result<DailyTaxResult, Error> {
  const {
    clienteCnpj,
    razaoSocial,
    mesCompetencia,
    regimeTributario,
    faturamentoServicosBrl,
    faturamentoComercioBrl,
    aliquotaEfetivaPercent
  } = input;

  if (!clienteCnpj || aliquotaEfetivaPercent <= 0) {
    return Err(new Error('CNPJ do cliente e alíquota efetiva positiva são obrigatórios.'));
  }

  const totalFaturamento = faturamentoServicosBrl + faturamentoComercioBrl;
  const totalImposto = (totalFaturamento * aliquotaEfetivaPercent) / 100;

  const guias: TaxPaymentSlipEntry[] = [];
  if (regimeTributario === 'SIMPLES_NACIONAL') {
    guias.push({
      codigoTributo: 'DAS',
      descricaoGuia: 'Documento de Arrecadação do Simples Nacional (PGDAS-D)',
      dataVencimento: '2026-09-20',
      valorGuiaBrl: parseFloat(totalImposto.toFixed(2)),
      codigoBarras: '858300000018' + Math.floor(Math.random() * 1000000000),
      pixCopiaECola: '00020126580014br.gov.bcb.pix0136DAS_' + clienteCnpj.replace(/\D/g, '') + '_PGDAS'
    });
  } else {
    // Lucro Presumido / Real segregado em DARFs
    const pisCofins = totalImposto * 0.35;
    const irpjCsll = totalImposto * 0.65;
    guias.push({
      codigoTributo: 'DARF_PIS_COFINS',
      descricaoGuia: 'DARF PIS/COFINS Cumulativo/Não-Cumulativo',
      dataVencimento: '2026-09-25',
      valorGuiaBrl: parseFloat(pisCofins.toFixed(2)),
      codigoBarras: '858300000028' + Math.floor(Math.random() * 1000000000),
      pixCopiaECola: '00020126580014br.gov.bcb.pix0136DARF_PIS_COFINS'
    });
    guias.push({
      codigoTributo: 'DARF_IRPJ_CSLL',
      descricaoGuia: 'DARF IRPJ e CSLL Trimestral/Mensal',
      dataVencimento: '2026-09-30',
      valorGuiaBrl: parseFloat(irpjCsll.toFixed(2)),
      codigoBarras: '858300000038' + Math.floor(Math.random() * 1000000000),
      pixCopiaECola: '00020126580014br.gov.bcb.pix0136DARF_IRPJ_CSLL'
    });
  }

  const diag = "Operação Fiscal Diária (" + razaoSocial + " - " + regimeTributario + " - " + mesCompetencia + "): Faturamento: R$ " + totalFaturamento.toLocaleString('pt-BR') + " | Tributos: R$ " + totalImposto.toLocaleString('pt-BR') + " | " + guias.length + " guias emitidas com código de barras e Pix Copia e Cola.";

  return Ok({
    clienteCnpj,
    razaoSocial,
    mesCompetencia,
    totalFaturamentoBrl: parseFloat(totalFaturamento.toFixed(2)),
    totalTributosApuradosBrl: parseFloat(totalImposto.toFixed(2)),
    guiasRecolhimento: guias,
    statusApuracao: 'APURACAO_FISCAL_CONCLUIDA_GUIAS_GERADAS',
    diagnosticoFiscal: diag
  });
}
