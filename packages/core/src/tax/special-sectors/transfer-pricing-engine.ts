import { Result, Ok, Err } from '../../types/result.js';

export type TransferPricingMethod = 
  | 'PIC_PRECOS_INDEPENDENTES_COMPARAVEIS'
  | 'PRL_PRECO_REVENDA_MENOS_LUCRO'
  | 'MCL_CUSTO_MAIS_LUCRO'
  | 'MLT_MARGEM_LIQUIDA_TRANSACAO';

export interface TransferPricingInput {
  transacaoId: string;
  tipoOperacao: 'IMPORTACAO' | 'EXPORTACAO';
  parteRelacionadaNome: string;
  paisParteRelacionada: string;
  metodoAplicado: TransferPricingMethod;
  precoPraticadoTotal: number;
  precoParametroArmLengthTotal: number;
}

export interface TransferPricingResult {
  transacaoId: string;
  metodo: TransferPricingMethod;
  precoPraticado: number;
  precoParametroArmLength: number;
  necessitaAjuste: boolean;
  valorAjusteFiscalLalurParteA: number;
  impactoTributarioIrpjCsll34Percent: number;
  diagnosticoTransferPricing: string;
}

export function calculateTransferPricingAdjustment(input: TransferPricingInput): Result<TransferPricingResult, Error> {
  const { transacaoId, tipoOperacao, parteRelacionadaNome, metodoAplicado, precoPraticadoTotal, precoParametroArmLengthTotal } = input;

  if (precoPraticadoTotal <= 0 || precoParametroArmLengthTotal <= 0) {
    return Err(new Error('Preço praticado e preço parâmetro devem ser superiores a zero.'));
  }

  let necessitaAjuste = false;
  let valorAjuste = 0;

  if (tipoOperacao === 'IMPORTACAO') {
    // Na importação: Se preço praticado (custo pago) > Preço parâmetro Arm's Length => Custo excessivo => Ajuste de adição
    if (precoPraticadoTotal > precoParametroArmLengthTotal) {
      necessitaAjuste = true;
      valorAjuste = Number((precoPraticadoTotal - precoParametroArmLengthTotal).toFixed(2));
    }
  } else {
    // Na exportação: Se preço praticado (receita) < Preço parâmetro Arm's Length => Receita subfaturada => Ajuste de adição
    if (precoPraticadoTotal < precoParametroArmLengthTotal) {
      necessitaAjuste = true;
      valorAjuste = Number((precoParametroArmLengthTotal - precoPraticadoTotal).toFixed(2));
    }
  }

  const impactoIrpjCsll = Number((valorAjuste * 0.34).toFixed(2));

  const diagnostico = necessitaAjuste
    ? `Foi apurada divergência em relação ao Princípio Arm's Length (Lei nº 14.596/2023 - OCDE). Deverá ser efetuado um ajuste de adição na Parte A do LALUR/LACS no valor de R$ ${valorAjuste.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}, gerando recolhimento complementar de R$ ${impactoIrpjCsll.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.`
    : 'A operação está em plena conformidade com o Princípio Arm\'s Length. Nenhum ajuste de preços de transferência é exigido.';

  return Ok({
    transacaoId,
    metodo: metodoAplicado,
    precoPraticado: precoPraticadoTotal,
    precoParametroArmLength: precoParametroArmLengthTotal,
    necessitaAjuste,
    valorAjusteFiscalLalurParteA: valorAjuste,
    impactoTributarioIrpjCsll34Percent: impactoIrpjCsll,
    diagnosticoTransferPricing: diagnostico
  });
}
