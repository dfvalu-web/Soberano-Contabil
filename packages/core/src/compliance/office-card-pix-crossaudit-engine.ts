import { Result, Ok, Err } from '../types/result.js';

export interface AcquirerTransactionEntry {
  operadoraNome: string; // Ex: 'Cielo', 'Stone', 'Mercado Pago', 'Pix Banco Inter'
  tipoOperacao: 'CARTAO_CREDITO' | 'CARTAO_DEBITO' | 'PIX_ESTABELECIMENTO' | 'MARKETPLACE';
  valorProcessadoDimpBrl: number;
}

export interface CardPixCrossAuditInput {
  clienteCnpj: string;
  razaoSocial: string;
  mesCompetencia: string;
  totalNotasFiscaisEmitidasBrl: number; // NF-e + NFC-e + NFS-e
  relatoriosAdquirentesDimp: AcquirerTransactionEntry[];
}

export interface CardPixCrossAuditResult {
  clienteCnpj: string;
  razaoSocial: string;
  mesCompetencia: string;
  totalNotasFiscaisBrl: number;
  totalMeiosPagamentoDimpBrl: number;
  diferencaReceitaBrl: number; // se DIMP > Notas -> Omissão potencial
  statusConformidade: 'CONCILIACAO_CARTAO_PIX_100_CONFORME' | 'DIVERGENCIA_DIMP_DETECTADA_OMISSAO_POTENCIAL';
  diagnosticoAuditoria: string;
}

export function processOfficeCardPixCrossAuditEngine(input: CardPixCrossAuditInput): Result<CardPixCrossAuditResult, Error> {
  const {
    clienteCnpj,
    razaoSocial,
    mesCompetencia,
    totalNotasFiscaisEmitidasBrl,
    relatoriosAdquirentesDimp
  } = input;

  if (!clienteCnpj || !relatoriosAdquirentesDimp || relatoriosAdquirentesDimp.length === 0) {
    return Err(new Error('CNPJ do cliente e relatórios de adquirentes são obrigatórios.'));
  }

  let totalDimp = 0;
  for (const op of relatoriosAdquirentesDimp) {
    totalDimp += op.valorProcessadoDimpBrl;
  }

  const diferenca = parseFloat((totalDimp - totalNotasFiscaisEmitidasBrl).toFixed(2));
  const isConforme = diferenca <= 0; // Notas emitidas cobrem ou superam DIMP

  const status = isConforme ? 'CONCILIACAO_CARTAO_PIX_100_CONFORME' : 'DIVERGENCIA_DIMP_DETECTADA_OMISSAO_POTENCIAL';

  const diag = "Auditoria Cruzada Cartões/PIX (" + razaoSocial + " - " + mesCompetencia + "): Notas Fiscais: R$ " + totalNotasFiscaisEmitidasBrl.toLocaleString('pt-BR') + " | Meios Pagamento DIMP: R$ " + totalDimp.toLocaleString('pt-BR') + " | Divergência: R$ " + Math.abs(diferenca).toLocaleString('pt-BR') + " -> " + (isConforme ? "100% coberto por documentos fiscais." : "ALERTA: DIMP superior às notas fiscais emitidas (Risco de Malha Fina SEFAZ).");

  return Ok({
    clienteCnpj,
    razaoSocial,
    mesCompetencia,
    totalNotasFiscaisBrl: totalNotasFiscaisEmitidasBrl,
    totalMeiosPagamentoDimpBrl: parseFloat(totalDimp.toFixed(2)),
    diferencaReceitaBrl: diferenca,
    statusConformidade: status,
    diagnosticoAuditoria: diag
  });
}
