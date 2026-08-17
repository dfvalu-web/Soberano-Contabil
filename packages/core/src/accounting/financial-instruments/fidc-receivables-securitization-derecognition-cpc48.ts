import { Result, Ok, Err } from '../../types/result.js';

export type ModalidadeCessaoFidc = 'CESSAO_DEFINITIVA_SEM_REGRESSO_DERECOGNITION' | 'CESSAO_COM_RETENCAO_SUBORDINADA_PASSIVO';

export interface FidcSecuritizationInput {
  operacaoId: string;
  fidcNome: string; // Ex: 'Soberano Credit Rights FIDC Multissetorial'
  modalidade: ModalidadeCessaoFidc;
  valorNominalCarteiraCedidaBrl: number; // Ex: R$ 10.000.000,00
  taxaDesagioSecuritizacaoPercent: number; // Ex: 4.5% (Deságio de R$ 450k)
  valorCotasSubordinadasRetidasBrl?: number; // Ex: R$ 1.500.000,00 (Primeira perda)
}

export interface FidcSecuritizationResult {
  operacaoId: string;
  fidcNome: string;
  modalidade: ModalidadeCessaoFidc;
  valorNominalCarteiraBrl: number;
  valorLiquidoRecebidoCaixaBrl: number;
  despesaDesagioSecuritizacaoDreBrl: number;
  saldoPassivoFinanceiroCessaoBrl: number;
  statusDesreconhecimentoCpc48: 'BAIXA_INTEGRAL_ATIVO_DERECOGNITION' | 'ATIVO_MANTIDO_COM_PASSIVO_FINANCEIRO';
  lancamentoContabilSugerido: {
    debitoCaixaDisponivelBrl: number;
    debitoDespesaDesagioSecuritizacaoDreBrl: number;
    creditoContasReceberClientesAtivoBrl: number;
    creditoPassivoFinanceiroFidcBrl: number;
  };
  diagnosticoCpc48: string;
}

export function processFidcReceivablesSecuritizationDerecognitionCpc48(input: FidcSecuritizationInput): Result<FidcSecuritizationResult, Error> {
  const {
    operacaoId,
    fidcNome,
    modalidade,
    valorNominalCarteiraCedidaBrl,
    taxaDesagioSecuritizacaoPercent,
    valorCotasSubordinadasRetidasBrl = 0
  } = input;

  if (valorNominalCarteiraCedidaBrl <= 0 || taxaDesagioSecuritizacaoPercent < 0) {
    return Err(new Error('Valor nominal da carteira e taxa de deságio devem ser válidos e positivos.'));
  }

  const valorDesagio = Number((valorNominalCarteiraCedidaBrl * (taxaDesagioSecuritizacaoPercent / 100)).toFixed(2));
  const valorCaixaRecebido = Number((valorNominalCarteiraCedidaBrl - valorDesagio - valorCotasSubordinadasRetidasBrl).toFixed(2));

  let statusDesreconhecimento: FidcSecuritizationResult['statusDesreconhecimentoCpc48'];
  let passivoFinanceiro = 0;
  let creditoClientes = 0;

  if (modalidade === 'CESSAO_DEFINITIVA_SEM_REGRESSO_DERECOGNITION') {
    // Baixa total do contas a receber (CPC 48 item 3.2.6(a))
    statusDesreconhecimento = 'BAIXA_INTEGRAL_ATIVO_DERECOGNITION';
    creditoClientes = valorNominalCarteiraCedidaBrl;
    passivoFinanceiro = 0;
  } else {
    // Retenção substancial de riscos via cota subordinada: Ativo é mantido e surge um Passivo Financeiro (CPC 48 item 3.2.15)
    statusDesreconhecimento = 'ATIVO_MANTIDO_COM_PASSIVO_FINANCEIRO';
    creditoClientes = 0;
    passivoFinanceiro = valorCaixaRecebido;
  }

  const diag = "Securitizacao FIDC (CPC 48 / IFRS 9): Operacao " + operacaoId + " (" + fidcNome + ") | Carteira Cedida: R$ " + valorNominalCarteiraCedidaBrl.toFixed(2) + " (Desagio: R$ " + valorDesagio.toFixed(2) + ") -> Caixa Liquido: R$ " + valorCaixaRecebido.toFixed(2) + " | Status Contabil: " + statusDesreconhecimento + ".";

  return Ok({
    operacaoId,
    fidcNome,
    modalidade,
    valorNominalCarteiraBrl: valorNominalCarteiraCedidaBrl,
    valorLiquidoRecebidoCaixaBrl: valorCaixaRecebido,
    despesaDesagioSecuritizacaoDreBrl: valorDesagio,
    saldoPassivoFinanceiroCessaoBrl: passivoFinanceiro,
    statusDesreconhecimentoCpc48: statusDesreconhecimento,
    lancamentoContabilSugerido: {
      debitoCaixaDisponivelBrl: valorCaixaRecebido,
      debitoDespesaDesagioSecuritizacaoDreBrl: valorDesagio,
      creditoContasReceberClientesAtivoBrl: creditoClientes,
      creditoPassivoFinanceiroFidcBrl: passivoFinanceiro
    },
    diagnosticoCpc48: diag
  });
}
