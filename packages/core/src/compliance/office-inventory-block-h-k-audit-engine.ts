import { Result, Ok, Err } from '../types/result.js';

export interface InventoryBlockHKInput {
  clienteCnpj: string;
  razaoSocial: string;
  anoExercicio: number;
  totalItensInventariadosH010Count: number;
  valorTotalEstoqueBlocoHBrl: number;
  valorTotalEstoqueBlocoKBrl: number;
  valorEstoqueBalancoContabilBrl: number;
}

export interface InventoryBlockHKResult {
  clienteCnpj: string;
  razaoSocial: string;
  anoExercicio: number;
  totalItensInventariadosH010Count: number;
  divergenciaBlocoHVsBlocoKBrl: number;
  divergenciaBlocoHVsContabilBrl: number;
  statusConsistenciaEstoque: 'ESTOQUE_100_PORCENTO_CONCILIADO' | 'DIVERGENCIA_SPED_FISCAL_DETECTADA';
  diagnosticoEstoque: string;
}

export function processOfficeInventoryBlockHKAuditEngine(input: InventoryBlockHKInput): Result<InventoryBlockHKResult, Error> {
  const {
    clienteCnpj,
    razaoSocial,
    anoExercicio,
    totalItensInventariadosH010Count,
    valorTotalEstoqueBlocoHBrl,
    valorTotalEstoqueBlocoKBrl,
    valorEstoqueBalancoContabilBrl
  } = input;

  if (!clienteCnpj || valorTotalEstoqueBlocoHBrl <= 0) {
    return Err(new Error('CNPJ e valor do estoque do Bloco H são obrigatórios.'));
  }

  const divHK = Math.abs(valorTotalEstoqueBlocoHBrl - valorTotalEstoqueBlocoKBrl);
  const divHCont = Math.abs(valorTotalEstoqueBlocoHBrl - valorEstoqueBalancoContabilBrl);

  const conciliado = divHK < 0.05 && divHCont < 0.05;
  const status = conciliado ? 'ESTOQUE_100_PORCENTO_CONCILIADO' : 'DIVERGENCIA_SPED_FISCAL_DETECTADA';

  const diag = "Auditoria de Estoques (" + razaoSocial + " - " + anoExercicio + "): " + totalItensInventariadosH010Count + " itens no Bloco H (R$ " + valorTotalEstoqueBlocoHBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ") vs Bloco K (R$ " + valorTotalEstoqueBlocoKBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ") vs Contábil (R$ " + valorEstoqueBalancoContabilBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ") -> Status: " + status + ".";

  return Ok({
    clienteCnpj,
    razaoSocial,
    anoExercicio,
    totalItensInventariadosH010Count,
    divergenciaBlocoHVsBlocoKBrl: parseFloat(divHK.toFixed(2)),
    divergenciaBlocoHVsContabilBrl: parseFloat(divHCont.toFixed(2)),
    statusConsistenciaEstoque: status,
    diagnosticoEstoque: diag
  });
}
