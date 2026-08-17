import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export interface DefinedBenefitActuarialInput {
  planoId: string;
  fundoPensaoNome: string; // Ex: 'Fundação de Seguridade Complementar dos Empregados'
  obrigacaoBeneficioDefinidoDboBrl: number;
  valorJustoAtivosPlanoBrl: number;
  custoServicoCorrenteExercicioBrl: number;
  taxaDescontoAtuarialAnualPercent: number; // Ex: 8.5% a.a.
  ganhoOuPerdaAtuarialPeriodoBrl: number;   // Variação atuarial por premissas demográficas/financeiras
}

export interface DefinedBenefitActuarialResult {
  planoId: string;
  fundoPensaoNome: string;
  deficitOuSuperavitLiquidoPassivoBrl: number;
  despesaTotalResultadoDREBrl: number;
  jurosLiquidosPassivoDREBrl: number;
  remensuracaoAtuarialOciAapPlBrl: number;
  partidasDobradaExercicioDRE: JournalEntryLine[];
  partidasDobradaRemensuracaoOci: JournalEntryLine[];
  diagnosticoCpc33: string;
}

export function evaluateDefinedBenefitPensionPlanCpc33(input: DefinedBenefitActuarialInput): Result<DefinedBenefitActuarialResult, Error> {
  const {
    planoId,
    fundoPensaoNome,
    obrigacaoBeneficioDefinidoDboBrl,
    valorJustoAtivosPlanoBrl,
    custoServicoCorrenteExercicioBrl,
    taxaDescontoAtuarialAnualPercent,
    ganhoOuPerdaAtuarialPeriodoBrl
  } = input;

  if (obrigacaoBeneficioDefinidoDboBrl <= 0 || valorJustoAtivosPlanoBrl < 0) {
    return Err(new Error('Obrigação atuarial (DBO) e ativos do plano devem ser superiores ou iguais a zero.'));
  }

  // Déficit ou Superávit Líquido do Plano (Passivo Líquido de Benefício Definido)
  const saldoLiquidoPassivo = Number((obrigacaoBeneficioDefinidoDboBrl - valorJustoAtivosPlanoBrl).toFixed(2));
  const passivoReconhecido = Math.max(0, saldoLiquidoPassivo);

  // Juros Líquidos sobre o Passivo = Passivo Líquido * Taxa de Desconto
  const jurosLiquidos = Number((passivoReconhecido * (taxaDescontoAtuarialAnualPercent / 100)).toFixed(2));

  // Despesa Total no Resultado = Custo do Serviço Corrente + Juros Líquidos (CPC 33 R1)
  const despesaTotalDRE = Number((custoServicoCorrenteExercicioBrl + jurosLiquidos).toFixed(2));

  const partidasDRE: JournalEntryLine[] = [];

  // D: Despesa com Previdência Complementar (Resultado - CPC 33)
  partidasDRE.push({
    accountId: '3.1.2.08',
    accountCode: '3.1.2.08',
    accountName: 'Despesa com Plano de Benefício Definido - Serviço e Juros Líquidos (Resultado - CPC 33)',
    type: 'DEBIT',
    amount: despesaTotalDRE
  });
  // C: Provisão para Benefícios Pós-Emprego (Passivo Não Circulante - CPC 33)
  partidasDRE.push({
    accountId: '2.2.3.05',
    accountCode: '2.2.3.05',
    accountName: 'Provisão para Déficit Atuarial de Benefício Definido (Passivo Não Circulante - CPC 33)',
    type: 'CREDIT',
    amount: despesaTotalDRE
  });

  const partidasOci: JournalEntryLine[] = [];
  // Ganhos e Perdas Atuariais reconhecidos compulsoriamente em OCI / AAP (DRA) sem reciclagem
  if (ganhoOuPerdaAtuarialPeriodoBrl !== 0) {
    const isPerda = ganhoOuPerdaAtuarialPeriodoBrl < 0;
    const valorAbs = Math.abs(ganhoOuPerdaAtuarialPeriodoBrl);

    if (isPerda) {
      // Perda Atuarial: D: Ajuste de Avaliação Patrimonial / OCI (PL) / C: Passivo Atuarial (PNC)
      partidasOci.push({
        accountId: '2.4.3.15',
        accountCode: '2.4.3.15',
        accountName: 'Outros Resultados Abrangentes - Perdas Atuariais CPC 33 (Patrimônio Líquido / DRA)',
        type: 'DEBIT',
        amount: valorAbs
      });
      partidasOci.push({
        accountId: '2.2.3.05',
        accountCode: '2.2.3.05',
        accountName: 'Provisão para Déficit Atuarial de Benefício Definido (Passivo Não Circulante - CPC 33)',
        type: 'CREDIT',
        amount: valorAbs
      });
    } else {
      // Ganho Atuarial: D: Passivo Atuarial (PNC) / C: Ajuste de Avaliação Patrimonial / OCI (PL)
      partidasOci.push({
        accountId: '2.2.3.05',
        accountCode: '2.2.3.05',
        accountName: 'Provisão para Déficit Atuarial de Benefício Definido (Passivo Não Circulante - CPC 33)',
        type: 'DEBIT',
        amount: valorAbs
      });
      partidasOci.push({
        accountId: '2.4.3.15',
        accountCode: '2.4.3.15',
        accountName: 'Outros Resultados Abrangentes - Ganhos Atuariais CPC 33 (Patrimônio Líquido / DRA)',
        type: 'CREDIT',
        amount: valorAbs
      });
    }
  }

  const diag = 'CPC 33 (R1) / IAS 19 (Benefício Definido): Fundo ' + fundoPensaoNome + '. DBO: R$ ' + obrigacaoBeneficioDefinidoDboBrl.toFixed(2) + ' vs Ativos do Plano: R$ ' + valorJustoAtivosPlanoBrl.toFixed(2) + ' -> Déficit Líquido Passivo: R$ ' + passivoReconhecido.toFixed(2) + '. Despesa na DRE (Serviço R$ ' + custoServicoCorrenteExercicioBrl.toFixed(2) + ' + Juros Líquidos R$ ' + jurosLiquidos.toFixed(2) + '): R$ ' + despesaTotalDRE.toFixed(2) + '. Remensuração Atuarial em OCI (AAP no PL sem reciclagem): R$ ' + ganhoOuPerdaAtuarialPeriodoBrl.toFixed(2) + '.';

  return Ok({
    planoId,
    fundoPensaoNome,
    deficitOuSuperavitLiquidoPassivoBrl: passivoReconhecido,
    despesaTotalResultadoDREBrl: despesaTotalDRE,
    jurosLiquidosPassivoDREBrl: jurosLiquidos,
    remensuracaoAtuarialOciAapPlBrl: ganhoOuPerdaAtuarialPeriodoBrl,
    partidasDobradaExercicioDRE: partidasDRE,
    partidasDobradaRemensuracaoOci: partidasOci,
    diagnosticoCpc33: diag
  });
}
