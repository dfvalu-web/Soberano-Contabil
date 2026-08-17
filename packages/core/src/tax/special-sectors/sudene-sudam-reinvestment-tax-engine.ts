import { Result, Ok, Err } from '../../types/result.js';

export interface SudeneSudamReinvestmentInput {
  empresaId: string;
  empresaNome: string; // Ex: 'Soberano Têxtil do Nordeste S.A.'
  regiaoIncentivo: 'SUDENE' | 'SUDAM';
  anoExercicio: number; // Ex: 2026
  lucroDaExploracaoBrl: number;
  irpjDevidoSemIncentivoBrl: number; // 25% IRPJ
  percentualReinvestimentoPercent?: number; // Padrão 30% do IRPJ
  percentualContrapartidaRecursosPropriosPercent?: number; // Padrão 50%
}

export interface SudeneSudamReinvestmentResult {
  empresaId: string;
  empresaNome: string;
  regiaoIncentivo: 'SUDENE' | 'SUDAM';
  irpjReinvestimento30PercentBrl: number; // 30% IRPJ depositado no BNB/BASA
  contrapartidaRecursosProprios50PercentBrl: number; // 50% depositado
  totalDepositoBancarioVinculadoBrl: number; // Valor total do projeto
  irpjEfetivoARecolherUniaoBrl: number; // 70% IRPJ restante
  reservaIncentivosFiscaisPlBrl: number; // Destinação no PL (Art. 195-A)
  diagnosticoSudeneSudam: string;
}

export function processSudeneSudamReinvestmentTaxEngine(input: SudeneSudamReinvestmentInput): Result<SudeneSudamReinvestmentResult, Error> {
  const {
    empresaId,
    empresaNome,
    regiaoIncentivo,
    anoExercicio,
    lucroDaExploracaoBrl,
    irpjDevidoSemIncentivoBrl,
    percentualReinvestimentoPercent = 30.0,
    percentualContrapartidaRecursosPropriosPercent = 50.0
  } = input;

  if (lucroDaExploracaoBrl <= 0 || irpjDevidoSemIncentivoBrl <= 0) {
    return Err(new Error('Lucro da exploração e IRPJ devido devem ser maiores que zero.'));
  }

  // MP nº 2.199-14/2001 e Lei nº 8.167/1991:
  // 1. Reinvestimento de até 30% do IRPJ devido sobre o Lucro da Exploração
  const valorReinvestimento = Number((irpjDevidoSemIncentivoBrl * (percentualReinvestimentoPercent / 100)).toFixed(2));

  // 2. Contrapartida de 50% de Recursos Próprios depositados no BNB (SUDENE) ou BASA (SUDAM)
  const contrapartida = Number((valorReinvestimento * (percentualContrapartidaRecursosPropriosPercent / 100)).toFixed(2));
  const totalDeposito = Number((valorReinvestimento + contrapartida).toFixed(2));

  // 3. IRPJ Efetivo a Recolher à União (70%)
  const irpjEfetivoUniao = Number((irpjDevidoSemIncentivoBrl - valorReinvestimento).toFixed(2));

  // 4. Reserva de Incentivos Fiscais no PL (Art. 195-A da Lei 6.404/76)
  const reservaPl = valorReinvestimento;

  const bancoAgente = regiaoIncentivo === 'SUDENE' ? 'Banco do Nordeste (BNB)' : 'Banco da Amazônia (BASA)';
  const diag = "Incentivo Fiscal de Reinvestimento (" + regiaoIncentivo + " / MP 2.199-14/01): " + empresaNome + " (Exercicio " + anoExercicio + "). IRPJ Total: R$ " + irpjDevidoSemIncentivoBrl.toFixed(2) + " -> Reinvestimento (30%): R$ " + valorReinvestimento.toFixed(2) + " + Contrapartida (50%): R$ " + contrapartida.toFixed(2) + " = Total Deposito Bloqueado no " + bancoAgente + ": R$ " + totalDeposito.toFixed(2) + " | IRPJ Recolhido Uniao (70%): R$ " + irpjEfetivoUniao.toFixed(2) + " | Reserva de Incentivos Fiscais no PL: R$ " + reservaPl.toFixed(2) + ".";

  return Ok({
    empresaId,
    empresaNome,
    regiaoIncentivo,
    irpjReinvestimento30PercentBrl: valorReinvestimento,
    contrapartidaRecursosProprios50PercentBrl: contrapartida,
    totalDepositoBancarioVinculadoBrl: totalDeposito,
    irpjEfetivoARecolherUniaoBrl: irpjEfetivoUniao,
    reservaIncentivosFiscaisPlBrl: reservaPl,
    diagnosticoSudeneSudam: diag
  });
}
