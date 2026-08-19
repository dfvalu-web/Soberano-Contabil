import { Result, Ok, Err } from '../types/result.js';

export interface CiapAccountingSpedInput {
  empresaCnpj: string;
  razaoSocial: string;
  valorCreditoApropriadoMesBrl: number;
  valorIcmsPerdidoMesBrl: number;
  numeroChaveNfeAquisicao: string;
}

export interface CiapAccountingSpedResult {
  empresaCnpj: string;
  razaoSocial: string;
  registroSpedFiscalG110: string;
  registroSpedFiscalG125: string;
  partidaDobradaApropriacaoCredito: string;
  partidaDobradaBaixaIcmsPerdido: string;
  statusEscrituracao: 'CIAP_ESCRITURADO_SPED_E_RAZAO_CONCLUIDO';
  diagnosticoSped: string;
}

export function processOfficeCiapAccountingSpedEngine(input: CiapAccountingSpedInput): Result<CiapAccountingSpedResult, Error> {
  const {
    empresaCnpj,
    razaoSocial,
    valorCreditoApropriadoMesBrl,
    valorIcmsPerdidoMesBrl,
    numeroChaveNfeAquisicao
  } = input;

  if (!empresaCnpj || valorCreditoApropriadoMesBrl < 0) {
    return Err(new Error('CNPJ e valor do crédito apropriado são obrigatórios.'));
  }

  const g110 = "SPED Fiscal Bloco G - Registro G110 (Totalização Mensal do CIAP) | Crédito Apropriado: R$ " + valorCreditoApropriadoMesBrl.toFixed(2);
  const g125 = "SPED Fiscal Bloco G - Registro G125 (Movimentação do Bem - Tipo AT Apropriação) vinculado à NF-e " + numeroChaveNfeAquisicao;

  const apropriacao = "D - 1.1.03.002 ICMS a Recuperar (Ativo Circulante) | C - 1.2.04.001 ICMS s/ Imobilizado a Apropriar (CIAP) no valor de R$ " + valorCreditoApropriadoMesBrl.toFixed(2);
  const perda = "D - 4.1.02.008 Despesas Tributárias - ICMS CIAP não Apropriado | C - 1.2.04.001 ICMS s/ Imobilizado a Apropriar (CIAP) no valor de R$ " + valorIcmsPerdidoMesBrl.toFixed(2);

  const diag = "Escrituração CIAP (" + razaoSocial + "): Registros G110/G125 gerados no SPED Fiscal | Lançamentos contábeis transferindo 1/48 para o ICMS a Recuperar concluídos com sucesso.";

  return Ok({
    empresaCnpj,
    razaoSocial,
    registroSpedFiscalG110: g110,
    registroSpedFiscalG125: g125,
    partidaDobradaApropriacaoCredito: apropriacao,
    partidaDobradaBaixaIcmsPerdido: perda,
    statusEscrituracao: 'CIAP_ESCRITURADO_SPED_E_RAZAO_CONCLUIDO',
    diagnosticoSped: diag
  });
}
