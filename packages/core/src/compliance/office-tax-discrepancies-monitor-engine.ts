import { Result, Ok, Err } from '../types/result.js';

export interface TaxDiscrepancyCheckInput {
  clienteCnpj: string;
  razaoSocial: string;
  mesCompetencia: string; // Ex: '2026-08'
  faturamentoDeclaradoPgdasBrl: number;
  totalVendasCartaoPixDimpBrl: number;
  totalEntradasContasBancariasBrl: number;
}

export interface TaxDiscrepancyCheckResult {
  clienteCnpj: string;
  razaoSocial: string;
  mesCompetencia: string;
  divergenciaDimpBrl: number;
  divergenciaBancariaBrl: number;
  riscoMalhaFiscal: 'BAIXO_SEM_DIVERGENCIAS' | 'MEDIO_DIVERGENCIA_LEVE' | 'ALTO_RISCO_AUTUACAO_RECEITA_SEFAZ';
  multaEstimadaAutoInfracaoBrl: number; // 75% sobre imposto omitido estimado
  statusAuditoria: 'AUDITORIA_PREVENTIVA_MALHA_CONCLUIDA';
  diagnosticoMalha: string;
}

export function processOfficeTaxDiscrepanciesMonitorEngine(input: TaxDiscrepancyCheckInput): Result<TaxDiscrepancyCheckResult, Error> {
  const {
    clienteCnpj,
    razaoSocial,
    mesCompetencia,
    faturamentoDeclaradoPgdasBrl,
    totalVendasCartaoPixDimpBrl,
    totalEntradasContasBancariasBrl
  } = input;

  if (!clienteCnpj || faturamentoDeclaradoPgdasBrl < 0) {
    return Err(new Error('CNPJ do cliente e faturamento declarado válido são obrigatórios.'));
  }

  const difDimp = Math.max(0, totalVendasCartaoPixDimpBrl - faturamentoDeclaradoPgdasBrl);
  const difBanco = Math.max(0, totalEntradasContasBancariasBrl - faturamentoDeclaradoPgdasBrl);

  let risco: 'BAIXO_SEM_DIVERGENCIAS' | 'MEDIO_DIVERGENCIA_LEVE' | 'ALTO_RISCO_AUTUACAO_RECEITA_SEFAZ' = 'BAIXO_SEM_DIVERGENCIAS';
  let multa = 0;

  if (difDimp > 1000 || difBanco > 5000) {
    risco = difDimp > 10000 ? 'ALTO_RISCO_AUTUACAO_RECEITA_SEFAZ' : 'MEDIO_DIVERGENCIA_LEVE';
    const impostoOmitidoEstimado = (difDimp || difBanco) * 0.10; // ~10%
    multa = impostoOmitidoEstimado * 0.75; // Multa 75%
  }

  const diag = "Auditoria de Malhas Fiscais (" + razaoSocial + " - " + mesCompetencia + "): Declarado PGDAS: R$ " + faturamentoDeclaradoPgdasBrl.toLocaleString('pt-BR') + " | DIMP Cartões/Pix: R$ " + totalVendasCartaoPixDimpBrl.toLocaleString('pt-BR') + " | Divergência DIMP: R$ " + difDimp.toLocaleString('pt-BR') + " -> Risco: " + risco + " (Prevenção de multas da Receita/SEFAZ).";

  return Ok({
    clienteCnpj,
    razaoSocial,
    mesCompetencia,
    divergenciaDimpBrl: parseFloat(difDimp.toFixed(2)),
    divergenciaBancariaBrl: parseFloat(difBanco.toFixed(2)),
    riscoMalhaFiscal: risco,
    multaEstimadaAutoInfracaoBrl: parseFloat(multa.toFixed(2)),
    statusAuditoria: 'AUDITORIA_PREVENTIVA_MALHA_CONCLUIDA',
    diagnosticoMalha: diag
  });
}
