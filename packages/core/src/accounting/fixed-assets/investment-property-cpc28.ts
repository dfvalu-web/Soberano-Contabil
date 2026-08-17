import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export type InvestmentPropertyModelType = 'VALOR_JUSTO' | 'CUSTO';

export interface InvestmentPropertyInput {
  propriedadeId: string;
  descricaoImovel: string; // Ex: 'Edifício Comercial Faria Lima Tower'
  modeloMensuracao: InvestmentPropertyModelType;
  valorContabilAnteriorBrl: number;
  valorJustoAvaliadoBrl: number;
  receitaAluguelExercicioBrl: number;
  aliquotaTributosDiferidosPercent: number; // 34%
}

export interface InvestmentPropertyResult {
  propriedadeId: string;
  descricaoImovel: string;
  modeloMensuracao: InvestmentPropertyModelType;
  valorContabilFinalBrl: number;
  ganhoOuPerdaValorJustoResultadoBrl: number;
  tributosDiferidosSobreGanho34PercentBrl: number;
  depreciacaoCessada: boolean;
  partidasDobradaPropriedadeInvestimento: JournalEntryLine[];
  diagnosticoCpc28: string;
}

export function evaluateInvestmentPropertyCpc28(input: InvestmentPropertyInput): Result<InvestmentPropertyResult, Error> {
  const {
    propriedadeId,
    descricaoImovel,
    modeloMensuracao,
    valorContabilAnteriorBrl,
    valorJustoAvaliadoBrl,
    receitaAluguelExercicioBrl,
    aliquotaTributosDiferidosPercent
  } = input;

  if (valorContabilAnteriorBrl <= 0 || valorJustoAvaliadoBrl <= 0) {
    return Err(new Error('Valores contábil e de valor justo do imóvel devem ser superiores a zero.'));
  }

  const partidas: JournalEntryLine[] = [];

  if (modeloMensuracao === 'VALOR_JUSTO') {
    // Modelo do Valor Justo: Variação reconhecida diretamente no Resultado (DRE) sem sofrer depreciação
    const variacaoValorJusto = Number((valorJustoAvaliadoBrl - valorContabilAnteriorBrl).toFixed(2));
    const tributosDiferidos = variacaoValorJusto > 0 ? Number((variacaoValorJusto * (aliquotaTributosDiferidosPercent / 100)).toFixed(2)) : 0;

    if (variacaoValorJusto !== 0) {
      partidas.push({
        accountId: '1.2.3.05',
        accountCode: '1.2.3.05',
        accountName: 'Propriedades para Investimento a Valor Justo (Ativo Não Circulante - CPC 28)',
        type: variacaoValorJusto > 0 ? 'DEBIT' : 'CREDIT',
        amount: Math.abs(variacaoValorJusto)
      });
      partidas.push({
        accountId: '3.1.4.10',
        accountCode: '3.1.4.10',
        accountName: 'Ganho/Perda por Variação do Valor Justo de Propriedades para Investimento (Resultado - CPC 28)',
        type: variacaoValorJusto > 0 ? 'CREDIT' : 'DEBIT',
        amount: Math.abs(variacaoValorJusto)
      });
    }

    if (tributosDiferidos > 0) {
      partidas.push({
        accountId: '3.2.1.99',
        accountCode: '3.2.1.99',
        accountName: 'Despesa com Tributos Diferidos IRPJ/CSLL s/ Ganho Valor Justo (Resultado - CPC 32)',
        type: 'DEBIT',
        amount: tributosDiferidos
      });
      partidas.push({
        accountId: '2.2.2.05',
        accountCode: '2.2.2.05',
        accountName: 'Passivo Fiscal Diferido s/ Ganho Valor Justo (Passivo Não Circulante - CPC 32)',
        type: 'CREDIT',
        amount: tributosDiferidos
      });
    }

    const diag = 'CPC 28 / IAS 40 (Modelo do Valor Justo): Imóvel ' + descricaoImovel + ' reavaliado de R$ ' + valorContabilAnteriorBrl.toFixed(2) + ' para R$ ' + valorJustoAvaliadoBrl.toFixed(2) + '. Ganho a valor justo de R$ ' + variacaoValorJusto.toFixed(2) + ' reconhecido no Resultado (DRE) sem depreciação contábil. Passivo fiscal diferido (34%): R$ ' + tributosDiferidos.toFixed(2) + '. Receita de aluguel: R$ ' + receitaAluguelExercicioBrl.toFixed(2) + '.';

    return Ok({
      propriedadeId,
      descricaoImovel,
      modeloMensuracao,
      valorContabilFinalBrl: valorJustoAvaliadoBrl,
      ganhoOuPerdaValorJustoResultadoBrl: variacaoValorJusto,
      tributosDiferidosSobreGanho34PercentBrl: tributosDiferidos,
      depreciacaoCessada: true,
      partidasDobradaPropriedadeInvestimento: partidas,
      diagnosticoCpc28: diag
    });
  } else {
    // Modelo do Custo
    const diag = 'CPC 28 / IAS 40 (Modelo do Custo): Imóvel ' + descricaoImovel + ' mantido pelo custo histórico líquido de R$ ' + valorContabilAnteriorBrl.toFixed(2) + ' sujeito à depreciação periódica.';

    return Ok({
      propriedadeId,
      descricaoImovel,
      modeloMensuracao,
      valorContabilFinalBrl: valorContabilAnteriorBrl,
      ganhoOuPerdaValorJustoResultadoBrl: 0,
      tributosDiferidosSobreGanho34PercentBrl: 0,
      depreciacaoCessada: false,
      partidasDobradaPropriedadeInvestimento: partidas,
      diagnosticoCpc28: diag
    });
  }
}
