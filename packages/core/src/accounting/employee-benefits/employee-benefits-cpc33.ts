import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export type PensionPlanType = 'CONTRIBUICAO_DEFINIDA' | 'BENEFICIO_DEFINIDO';

export interface EmployeeBenefitsInput {
  planoId: string;
  nomePlanoPrevidencia: string;
  tipoPlano: PensionPlanType;
  // Para Benefício Definido
  obrigacaoBeneficioDefinidoVpBrl?: number; // DBO
  ativosDoPlanoValorJustoBrl?: number;
  custoServicoCorrenteExercicioBrl?: number;
  taxaDescontoAtuarialPercentAno?: number;
  ganhoOuPerdaAtuarialPeriodoBrl?: number; // Remensuração atuarial (DRA)
  // Para Contribuição Definida
  contribuicoesPagasNoExercicioBrl?: number;
}

export interface EmployeeBenefitsResult {
  planoId: string;
  tipoPlano: PensionPlanType;
  passivoOuAtivoLiquidoAtuarialBrl: number;
  despesaPrevidenciariaNoResultadoBrl: number;
  remensuracaoAtuarialNoDraBrl: number;
  partidasDobradaPrevidencia: JournalEntryLine[];
  diagnosticoCpc33: string;
}

export function evaluateEmployeeBenefitsCpc33(input: EmployeeBenefitsInput): Result<EmployeeBenefitsResult, Error> {
  const {
    planoId,
    nomePlanoPrevidencia,
    tipoPlano,
    obrigacaoBeneficioDefinidoVpBrl = 0,
    ativosDoPlanoValorJustoBrl = 0,
    custoServicoCorrenteExercicioBrl = 0,
    taxaDescontoAtuarialPercentAno = 0,
    ganhoOuPerdaAtuarialPeriodoBrl = 0,
    contribuicoesPagasNoExercicioBrl = 0
  } = input;

  const partidas: JournalEntryLine[] = [];

  if (tipoPlano === 'CONTRIBUICAO_DEFINIDA') {
    if (contribuicoesPagasNoExercicioBrl <= 0) {
      return Err(new Error('Contribuições pagas no exercício devem ser superiores a zero.'));
    }

    partidas.push({
      accountId: '3.1.2.09',
      accountCode: '3.1.2.09',
      accountName: 'Despesa com Previdência Complementar - Contribuição Definida (Resultado - CPC 33)',
      type: 'DEBIT',
      amount: contribuicoesPagasNoExercicioBrl
    });
    partidas.push({
      accountId: '1.1.1.02',
      accountCode: '1.1.1.02',
      accountName: 'Banco Conta Movimento (Ativo Circulante - CPC 33)',
      type: 'CREDIT',
      amount: contribuicoesPagasNoExercicioBrl
    });

    const diag = 'CPC 33 (R1) / IAS 19: Plano de Contribuição Definida ' + nomePlanoPrevidencia + '. Reconhecida despesa de contribuição de R$ ' + contribuicoesPagasNoExercicioBrl.toFixed(2) + ' diretamente no resultado.';

    return Ok({
      planoId,
      tipoPlano,
      passivoOuAtivoLiquidoAtuarialBrl: 0,
      despesaPrevidenciariaNoResultadoBrl: contribuicoesPagasNoExercicioBrl,
      remensuracaoAtuarialNoDraBrl: 0,
      partidasDobradaPrevidencia: partidas,
      diagnosticoCpc33: diag
    });
  } else {
    // Benefício Definido
    const deficitOuSuperavit = Number((obrigacaoBeneficioDefinidoVpBrl - ativosDoPlanoValorJustoBrl).toFixed(2));
    const jurosLiquidos = Number((deficitOuSuperavit * (taxaDescontoAtuarialPercentAno / 100)).toFixed(2));
    const despesaResultado = Number((custoServicoCorrenteExercicioBrl + jurosLiquidos).toFixed(2));

    partidas.push({
      accountId: '3.1.2.10',
      accountCode: '3.1.2.10',
      accountName: 'Despesa Atuarial de Benefício Definido (Resultado - CPC 33)',
      type: 'DEBIT',
      amount: despesaResultado
    });
    partidas.push({
      accountId: '2.2.3.01',
      accountCode: '2.2.3.01',
      accountName: 'Provisão para Benefícios Pós-Emprego (Passivo Não Circulante - CPC 33)',
      type: 'CREDIT',
      amount: despesaResultado
    });

    // Remensuração no DRA (Outros Resultados Abrangentes)
    if (ganhoOuPerdaAtuarialPeriodoBrl !== 0) {
      partidas.push({
        accountId: '2.4.3.05',
        accountCode: '2.4.3.05',
        accountName: 'Outros Resultados Abrangentes - Ganhos/Perdas Atuariais (PL/DRA - CPC 33)',
        type: ganhoOuPerdaAtuarialPeriodoBrl > 0 ? 'CREDIT' : 'DEBIT',
        amount: Math.abs(ganhoOuPerdaAtuarialPeriodoBrl)
      });
    }

    const diag = 'CPC 33 (R1) / IAS 19: Plano de Benefício Definido ' + nomePlanoPrevidencia + '. Déficit Atuarial Líquido de R$ ' + deficitOuSuperavit.toFixed(2) + '. Despesa no Resultado: R$ ' + despesaResultado.toFixed(2) + ' (Custo Serviço: R$ ' + custoServicoCorrenteExercicioBrl.toFixed(2) + ' + Juros Líquidos: R$ ' + jurosLiquidos.toFixed(2) + '). Remensuração no DRA: R$ ' + ganhoOuPerdaAtuarialPeriodoBrl.toFixed(2) + '.';

    return Ok({
      planoId,
      tipoPlano,
      passivoOuAtivoLiquidoAtuarialBrl: deficitOuSuperavit,
      despesaPrevidenciariaNoResultadoBrl: despesaResultado,
      remensuracaoAtuarialNoDraBrl: ganhoOuPerdaAtuarialPeriodoBrl,
      partidasDobradaPrevidencia: partidas,
      diagnosticoCpc33: diag
    });
  }
}
