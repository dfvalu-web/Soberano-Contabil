import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export interface LongTermConstructionPocInput {
  obraId: string;
  descricaoObra: string; // Ex: 'Construção do Complexo Hospitalar Metropolitano'
  valorTotalContratoBrl: number;
  custoTotalEstimadoObraBrl: number;
  custosIncorridosAteDataBrl: number;
  faturamentoEmitidoAteDataBrl: number;
}

export interface LongTermConstructionPocResult {
  obraId: string;
  descricaoObra: string;
  percentualEvolucaoPocPercent: number;
  receitaAcumuladaReconhecidaBrl: number;
  saldoAtivoOuPassivoDeContrato: {
    tipo: 'ATIVO_DE_CONTRATO_RECEITA_A_FATURAR' | 'PASSIVO_DE_CONTRATO_FATURAMENTO_ANTECIPADO' | 'CONCILIADO';
    valorBrl: number;
  };
  contratoOnerosoComPerdaEsperada: boolean;
  perdaEsperadaImediataBrl: number;
  partidasDobradaPoc: JournalEntryLine[];
  diagnosticoCpc47: string;
}

export function evaluateLongTermConstructionPocCpc47(input: LongTermConstructionPocInput): Result<LongTermConstructionPocResult, Error> {
  const {
    obraId,
    descricaoObra,
    valorTotalContratoBrl,
    custoTotalEstimadoObraBrl,
    custosIncorridosAteDataBrl,
    faturamentoEmitidoAteDataBrl
  } = input;

  if (valorTotalContratoBrl <= 0 || custoTotalEstimadoObraBrl <= 0) {
    return Err(new Error('Valor do contrato e custo total estimado devem ser superiores a zero.'));
  }

  // Percentual de Conclusão (Cost-to-Cost Method)
  const pocRatio = Math.min(1, custosIncorridosAteDataBrl / custoTotalEstimadoObraBrl);
  const percentualEvolucao = Number((pocRatio * 100).toFixed(2));
  const receitaAcumulada = Number((valorTotalContratoBrl * pocRatio).toFixed(2));

  // Checagem de Contrato Oneroso (CPC 25 / CPC 47)
  const isOneroso = custoTotalEstimadoObraBrl > valorTotalContratoBrl;
  const perdaEsperada = isOneroso ? Number((custoTotalEstimadoObraBrl - valorTotalContratoBrl).toFixed(2)) : 0;

  // Comparação entre Receita Reconhecida e Faturamento Emitido
  const diferencaContratual = Number((receitaAcumulada - faturamentoEmitidoAteDataBrl).toFixed(2));
  let tipoSaldo: 'ATIVO_DE_CONTRATO_RECEITA_A_FATURAR' | 'PASSIVO_DE_CONTRATO_FATURAMENTO_ANTECIPADO' | 'CONCILIADO' = 'CONCILIADO';

  const partidas: JournalEntryLine[] = [];

  // Lançamento da Receita Acumulada POC
  if (diferencaContratual > 0) {
    // Receita Reconhecida > Faturado -> Ativo de Contrato (Ativo Circulante)
    tipoSaldo = 'ATIVO_DE_CONTRATO_RECEITA_A_FATURAR';
    partidas.push({
      accountId: '1.1.3.05',
      accountCode: '1.1.3.05',
      accountName: 'Ativos de Contrato - Receitas Medidas a Faturar (Ativo Circulante - CPC 47)',
      type: 'DEBIT',
      amount: diferencaContratual
    });
    partidas.push({
      accountId: '3.1.1.05',
      accountCode: '3.1.1.05',
      accountName: 'Receita de Contratos de Construção por POC (Resultado - CPC 47)',
      type: 'CREDIT',
      amount: diferencaContratual
    });
  } else if (diferencaContratual < 0) {
    // Faturado > Receita Reconhecida -> Passivo de Contrato (Passivo Circulante)
    tipoSaldo = 'PASSIVO_DE_CONTRATO_FATURAMENTO_ANTECIPADO';
    partidas.push({
      accountId: '3.1.1.05',
      accountCode: '3.1.1.05',
      accountName: 'Ajuste de Receita por Excesso de Faturamento POC (Resultado - CPC 47)',
      type: 'DEBIT',
      amount: Math.abs(diferencaContratual)
    });
    partidas.push({
      accountId: '2.1.4.05',
      accountCode: '2.1.4.05',
      accountName: 'Passivos de Contrato - Faturamento Antecipado de Obras (Passivo Circulante - CPC 47)',
      type: 'CREDIT',
      amount: Math.abs(diferencaContratual)
    });
  }

  // Se contrato oneroso -> Provisão para perda imediata
  if (isOneroso) {
    partidas.push({
      accountId: '3.1.2.99',
      accountCode: '3.1.2.99',
      accountName: 'Perdas Esperadas em Contratos Onerosos de Construção (Resultado - CPC 25 / CPC 47)',
      type: 'DEBIT',
      amount: perdaEsperada
    });
    partidas.push({
      accountId: '2.1.5.10',
      accountCode: '2.1.5.10',
      accountName: 'Provisão para Contratos Onerosos (Passivo Circulante - CPC 25)',
      type: 'CREDIT',
      amount: perdaEsperada
    });
  }

  const diag = 'CPC 47 / IFRS 15 (Contratos de Construção - Método POC): Obra ' + descricaoObra + '. Evolução: ' + percentualEvolucao + '% (Custos Incorridos: R$ ' + custosIncorridosAteDataBrl.toFixed(2) + ' / Custo Total: R$ ' + custoTotalEstimadoObraBrl.toFixed(2) + '). Receita Reconhecida: R$ ' + receitaAcumulada.toFixed(2) + ' vs Faturado: R$ ' + faturamentoEmitidoAteDataBrl.toFixed(2) + '. Classificação: ' + tipoSaldo + ' no valor de R$ ' + Math.abs(diferencaContratual).toFixed(2) + '.' + (isOneroso ? ' ALERTA: Contrato Oneroso. Perda total de R$ ' + perdaEsperada.toFixed(2) + ' provisionada no Resultado.' : '');

  return Ok({
    obraId,
    descricaoObra,
    percentualEvolucaoPocPercent: percentualEvolucao,
    receitaAcumuladaReconhecidaBrl: receitaAcumulada,
    saldoAtivoOuPassivoDeContrato: {
      tipo: tipoSaldo,
      valorBrl: Math.abs(diferencaContratual)
    },
    contratoOnerosoComPerdaEsperada: isOneroso,
    perdaEsperadaImediataBrl: perdaEsperada,
    partidasDobradaPoc: partidas,
    diagnosticoCpc47: diag
  });
}
