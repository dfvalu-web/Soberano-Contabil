import { Result, Ok, Err } from '../types/result.js';

export interface ClientFeeContract {
  clienteCnpj: string;
  razaoSocialCliente: string;
  honorarioBaseMensalBrl: number; // Ex: R$ 1.500,00
  quantidadeVidasFolha: number; // Ex: 12 vidas
  valorAdicionalPorVidaBrl: number; // Ex: R$ 35,00 por vida
  volumeNotasFiscaisMes: number; // Ex: 450 notas
  taxaExcedenteNotasBrl: number; // Ex: R$ 0,00 se dentro do limite
  adicionalDecimoTerceiroHonorario: boolean; // Se mês 12 ou adiantamento
}

export interface OfficeFeesBillingInput {
  escritorioCnpj: string;
  mesCompetencia: string;
  contratosClientes: ClientFeeContract[];
}

export interface OfficeFeesBillingResult {
  escritorioCnpj: string;
  mesCompetencia: string;
  totalClientesFaturados: number;
  faturamentoTotalHonorariosBrl: number;
  totalAdicionaisDpBrl: number;
  statusFaturamento: 'FATURAMENTO_HONORARIOS_PROCESSADO_SUCESSO';
  diagnosticoFaturamento: string;
}

export function processOfficeFeesBillingEngine(input: OfficeFeesBillingInput): Result<OfficeFeesBillingResult, Error> {
  const {
    escritorioCnpj,
    mesCompetencia,
    contratosClientes
  } = input;

  if (!escritorioCnpj || !contratosClientes || contratosClientes.length === 0) {
    return Err(new Error('CNPJ do escritório e contratos da carteira são obrigatórios.'));
  }

  let totalGeral = 0;
  let totalAdicionaisDp = 0;

  for (const c of contratosClientes) {
    const adicionalDp = c.quantidadeVidasFolha * c.valorAdicionalPorVidaBrl;
    totalAdicionaisDp += adicionalDp;
    let totalCliente = c.honorarioBaseMensalBrl + adicionalDp + c.taxaExcedenteNotasBrl;
    if (c.adicionalDecimoTerceiroHonorario) {
      totalCliente += c.honorarioBaseMensalBrl; // 13º de honorários
    }
    totalGeral += totalCliente;
  }

  const diag = "Faturamento de Honorarios (" + mesCompetencia + "): " + contratosClientes.length + " clientes faturados | Total Faturado: R$ " + totalGeral.toLocaleString('pt-BR') + " (Adicionais DP/Vidas: R$ " + totalAdicionaisDp.toLocaleString('pt-BR') + ") | Lote pronto para geracao de NFS-e e Cobrancas PIX.";

  return Ok({
    escritorioCnpj,
    mesCompetencia,
    totalClientesFaturados: contratosClientes.length,
    faturamentoTotalHonorariosBrl: parseFloat(totalGeral.toFixed(2)),
    totalAdicionaisDpBrl: parseFloat(totalAdicionaisDp.toFixed(2)),
    statusFaturamento: 'FATURAMENTO_HONORARIOS_PROCESSADO_SUCESSO',
    diagnosticoFaturamento: diag
  });
}
