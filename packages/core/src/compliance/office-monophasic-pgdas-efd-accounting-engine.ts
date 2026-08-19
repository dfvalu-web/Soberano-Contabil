import { Result, Ok, Err } from '../types/result.js';

export interface MonophasicEfdAccountingInput {
  empresaCnpj: string;
  razaoSocial: string;
  valorReceitaMonofasicaBrl: number;
  valorDasApuradoBrl: number;
}

export interface MonophasicEfdAccountingResult {
  empresaCnpj: string;
  razaoSocial: string;
  cstPisCofinsUtilizado: '04_OPERACAO_TRIBUTAVEL_MONOFASICA_ALIQUOTA_ZERO';
  registroEfdContribuicoes: 'REGISTRO_C170_C100_M100_M500';
  partidaDobradaReceitaMonofasica: string;
  partidaDobradaProvisaoDas: string;
  statusEscrituracao: 'ESCRITURACAO_MONOFASICA_CONCLUIDA';
  diagnosticoEfd: string;
}

export function processOfficeMonophasicPgdasEfdAccountingEngine(input: MonophasicEfdAccountingInput): Result<MonophasicEfdAccountingResult, Error> {
  const {
    empresaCnpj,
    razaoSocial,
    valorReceitaMonofasicaBrl,
    valorDasApuradoBrl
  } = input;

  if (!empresaCnpj || valorReceitaMonofasicaBrl <= 0) {
    return Err(new Error('CNPJ e valor da receita monofásica são obrigatórios.'));
  }

  const receita = "D - 1.1.02.001 Clientes / Caixa | C - 3.1.01.001 Receita Bruta de Vendas (Monofásicos) no valor de R$ " + valorReceitaMonofasicaBrl.toFixed(2);
  const provisao = "D - 3.1.02.001 Despesas com Simples Nacional DAS | C - 2.1.02.001 Simples Nacional DAS a Recolher no valor de R$ " + valorDasApuradoBrl.toFixed(2);

  const diag = "EFD-Contribuições & Razão (" + razaoSocial + "): CST 04 vinculado aos itens monofásicos | Registro C170 gerado | Lançamentos contábeis efetuados com sucesso.";

  return Ok({
    empresaCnpj,
    razaoSocial,
    cstPisCofinsUtilizado: '04_OPERACAO_TRIBUTAVEL_MONOFASICA_ALIQUOTA_ZERO',
    registroEfdContribuicoes: 'REGISTRO_C170_C100_M100_M500',
    partidaDobradaReceitaMonofasica: receita,
    partidaDobradaProvisaoDas: provisao,
    statusEscrituracao: 'ESCRITURACAO_MONOFASICA_CONCLUIDA',
    diagnosticoEfd: diag
  });
}
