import { Result, Ok, Err } from '../types/result.js';

export interface AccountBalanceMigrationEntry {
  codigoContaAnterior: string;
  descricaoConta: string;
  codigoContaPlanoSoberano: string;
  classificacaoNatureza: 'ATIVO' | 'PASSIVO' | 'PATRIMONIO_LIQUIDO';
  saldoInicialBrl: number;
  tipoSaldo: 'DEBITO' | 'CREDITO';
}

export interface AccountingDataMigrationInput {
  clienteCnpj: string;
  razaoSocial: string;
  dataSaldosAbertura: string; // Ex: '2026-01-01'
  planoContasMigrado: AccountBalanceMigrationEntry[];
}

export interface AccountingDataMigrationResult {
  clienteCnpj: string;
  razaoSocial: string;
  dataSaldosAbertura: string;
  totalContasMapeadas: number;
  totalAtivoInicialBrl: number;
  totalPassivoPatrimonioLiquidoInicialBrl: number;
  diferencaEquacaoPatrimonialBrl: number;
  statusMigracao: 'SALDOS_INICIAIS_MIGRADOS_E_EQUILIBRADOS';
  diagnosticoMigracao: string;
}

export function processOfficeAccountingDataMigrationEngine(input: AccountingDataMigrationInput): Result<AccountingDataMigrationResult, Error> {
  const {
    clienteCnpj,
    razaoSocial,
    dataSaldosAbertura,
    planoContasMigrado
  } = input;

  if (!clienteCnpj || !planoContasMigrado || planoContasMigrado.length === 0) {
    return Err(new Error('CNPJ e plano de contas com saldos de abertura são obrigatórios.'));
  }

  let totalAtivo = 0;
  let totalPassivoPL = 0;

  for (const c of planoContasMigrado) {
    if (c.classificacaoNatureza === 'ATIVO') {
      totalAtivo += c.saldoInicialBrl;
    } else {
      totalPassivoPL += c.saldoInicialBrl;
    }
  }

  const dif = Math.abs(totalAtivo - totalPassivoPL);
  if (dif > 0.01) {
    return Err(new Error("Balanço de abertura desbalanceado: Ativo (R$ " + totalAtivo.toFixed(2) + ") difere de Passivo+PL (R$ " + totalPassivoPL.toFixed(2) + ")."));
  }

  const diag = "Migração de Dados Contábeis (" + razaoSocial + " - " + dataSaldosAbertura + "): " + planoContasMigrado.length + " contas mapeadas com sucesso | Ativo Inicial: R$ " + totalAtivo.toLocaleString('pt-BR') + " == Passivo+PL: R$ " + totalPassivoPL.toLocaleString('pt-BR') + " -> Saldos de abertura importados sem quebra de partidas dobradas.";

  return Ok({
    clienteCnpj,
    razaoSocial,
    dataSaldosAbertura,
    totalContasMapeadas: planoContasMigrado.length,
    totalAtivoInicialBrl: parseFloat(totalAtivo.toFixed(2)),
    totalPassivoPatrimonioLiquidoInicialBrl: parseFloat(totalPassivoPL.toFixed(2)),
    diferencaEquacaoPatrimonialBrl: 0,
    statusMigracao: 'SALDOS_INICIAIS_MIGRADOS_E_EQUILIBRADOS',
    diagnosticoMigracao: diag
  });
}
