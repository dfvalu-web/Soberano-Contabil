import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export interface NavalConstructionInput {
  projetoId: string;
  estaleiroNome: string;
  embarcacaoNome: string; // Ex: 'FPSO Soberano Guanabara / Navio Petroleiro Suezmax'
  precoTotalContratoBrl: number;
  custoTotalOrcadoBrl: number;
  custoIncorridoAcumuladoBrl: number;
  percentualRetencaoGarantiaClientePercent: number; // Ex: 10% retido pelo cliente até a entrega final
  taxaDescontoAvpAnualPercent?: number; // Ex: 10% a.a. para AVP da retenção
  prazoLiberacaoRetencaoAnos?: number; // Ex: 2 anos
}

export interface NavalConstructionResult {
  projetoId: string;
  estaleiroNome: string;
  embarcacaoNome: string;
  percentualEvolucaoObraPocPercent: number; // Input Method
  receitaAcumuladaReconhecidaBrl: number; // CPC 47
  faturamentoMilestoneEmitidoBrl: number;
  valorRetencaoGarantiaNominalBrl: number;
  ajusteValorPresenteAvpRetencaoBrl: number; // CPC 12
  valorPresenteRetencaoAtivoNaoCirculanteBrl: number;
  partidasDobrada: JournalEntryLine[];
  diagnosticoCpc47e12: string;
}

export function evaluateNavalConstructionRetainageCpc47(input: NavalConstructionInput): Result<NavalConstructionResult, Error> {
  const {
    projetoId,
    estaleiroNome,
    embarcacaoNome,
    precoTotalContratoBrl,
    custoTotalOrcadoBrl,
    custoIncorridoAcumuladoBrl,
    percentualRetencaoGarantiaClientePercent,
    taxaDescontoAvpAnualPercent = 10.0,
    prazoLiberacaoRetencaoAnos = 2
  } = input;

  if (precoTotalContratoBrl <= 0 || custoTotalOrcadoBrl <= 0 || custoIncorridoAcumuladoBrl <= 0) {
    return Err(new Error('Preço do contrato e custos orçados/incorridos devem ser superiores a zero.'));
  }

  // 1. Percentual de Evolução Física/Financeira (POC Input Method)
  const poc = Math.min(1.0, custoIncorridoAcumuladoBrl / custoTotalOrcadoBrl);
  const pocPercent = Number((poc * 100).toFixed(2));

  // 2. Receita de Construção Naval Reconhecida no Período (CPC 47)
  const receitaReconhecida = Number((precoTotalContratoBrl * poc).toFixed(2));

  // 3. Faturamento Milestone e Retenção Contratual de Garantia (Retainage)
  const valorRetencaoNominal = Number((receitaReconhecida * (percentualRetencaoGarantiaClientePercent / 100)).toFixed(2));
  const faturamentoLiquidoCaixa = Number((receitaReconhecida - valorRetencaoNominal).toFixed(2));

  // 4. Ajuste a Valor Presente (AVP) da Retenção de Longo Prazo (CPC 12)
  // VP = Nominal / (1 + taxa)^anos
  const fatorAvp = Math.pow(1 + (taxaDescontoAvpAnualPercent / 100), prazoLiberacaoRetencaoAnos);
  const vpRetencao = Number((valorRetencaoNominal / fatorAvp).toFixed(2));
  const avpDesconto = Number((valorRetencaoNominal - vpRetencao).toFixed(2));

  const partidas: JournalEntryLine[] = [];

  // D: Clientes Faturamento Curto Prazo (Ativo Circulante)
  partidas.push({
    accountId: '1.1.2.01',
    accountCode: '1.1.2.01',
    accountName: 'Clientes - Faturamento de Medições Navais (Ativo Circulante)',
    type: 'DEBIT',
    amount: faturamentoLiquidoCaixa
  });

  // D: Retenções Contratuais de Garantia a Receber (Ativo Não Circulante - CPC 47)
  partidas.push({
    accountId: '1.2.1.15',
    accountCode: '1.2.1.15',
    accountName: 'Retenções Contratuais de Garantia Naval - Valor Nominal (Ativo Não Circulante)',
    type: 'DEBIT',
    amount: valorRetencaoNominal
  });

  // C: AVP - Ajuste a Valor Presente de Retenções (Conta Redutora do Ativo - CPC 12)
  if (avpDesconto > 0) {
    partidas.push({
      accountId: '1.2.1.16',
      accountCode: '1.2.1.16',
      accountName: '(-) AVP de Retenções Contratuais Navais (Ativo Não Circulante - CPC 12)',
      type: 'CREDIT',
      amount: avpDesconto
    });
  }

  // C: Receita de Construção Naval (Resultado - CPC 47)
  partidas.push({
    accountId: '3.1.1.01',
    accountCode: '3.1.1.01',
    accountName: 'Receita de Construção e Montagem Naval (Resultado - CPC 47)',
    type: 'CREDIT',
    amount: Number((receitaReconhecida - avpDesconto).toFixed(2))
  });

  const diag = 'Construção Naval (CPC 47 / CPC 12): ' + estaleiroNome + ' - ' + embarcacaoNome + '. POC: ' + pocPercent + '%. Receita Reconhecida: R$ ' + receitaReconhecida.toFixed(2) + '. Faturamento Líquido: R$ ' + faturamentoLiquidoCaixa.toFixed(2) + '. Retenção de Garantia: R$ ' + valorRetencaoNominal.toFixed(2) + ' (AVP Redutor: R$ ' + avpDesconto.toFixed(2) + ' -> Valor Presente Líquido R$ ' + vpRetencao.toFixed(2) + ').';

  return Ok({
    projetoId,
    estaleiroNome,
    embarcacaoNome,
    percentualEvolucaoObraPocPercent: pocPercent,
    receitaAcumuladaReconhecidaBrl: receitaReconhecida,
    faturamentoMilestoneEmitidoBrl: faturamentoLiquidoCaixa,
    valorRetencaoGarantiaNominalBrl: valorRetencaoNominal,
    ajusteValorPresenteAvpRetencaoBrl: avpDesconto,
    valorPresenteRetencaoAtivoNaoCirculanteBrl: vpRetencao,
    partidasDobrada: partidas,
    diagnosticoCpc47e12: diag
  });
}
