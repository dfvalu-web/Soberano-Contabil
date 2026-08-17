import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export interface IndemnificationAssetInput {
  aquisicaoId: string;
  adquirenteNome: string;
  vendedorGarantidorNome: string;
  contingenciaDescricao: string; // Ex: 'Autuação Fiscal Pré-Aquisição de ICMS/IRPJ'
  valorPassivoContingenteReconhecidoBrl: number; // CPC 25
  limiteMaximoIndenizacaoContratualBrl?: number;
}

export interface IndemnificationAssetResult {
  aquisicaoId: string;
  adquirenteNome: string;
  vendedorGarantidorNome: string;
  valorPassivoContingenteBrl: number;
  valorAtivoIndenizacaoReconhecidoBrl: number; // CPC 15 R1
  impactoLiquidoPatrimonioLiquidoBrl: number; // 0,00 (Efeito Neutro)
  partidasDobradaAquisicao: JournalEntryLine[];
  diagnosticoCpc15: string;
}

export function evaluateIndemnificationAssetCpc15(input: IndemnificationAssetInput): Result<IndemnificationAssetResult, Error> {
  const {
    aquisicaoId,
    adquirenteNome,
    vendedorGarantidorNome,
    contingenciaDescricao,
    valorPassivoContingenteReconhecidoBrl,
    limiteMaximoIndenizacaoContratualBrl
  } = input;

  if (valorPassivoContingenteReconhecidoBrl <= 0) {
    return Err(new Error('Valor da contingência indenizável deve ser superior a zero.'));
  }

  // CPC 15 R1 Itens 27-28:
  // O adquirente deve reconhecer um Ativo de Indenização ao mesmo tempo e com a mesma base de mensuração
  // do item indenizado (passivo contingente), limitado aos termos contratuais acordados com o vendedor.
  const teto = limiteMaximoIndenizacaoContratualBrl || valorPassivoContingenteReconhecidoBrl;
  const valorAtivoIndenizacao = Math.min(valorPassivoContingenteReconhecidoBrl, teto);

  const partidas: JournalEntryLine[] = [];

  // 1. D: Ativo de Indenização a Receber do Vendedor (Ativo Não Circulante - CPC 15)
  partidas.push({
    accountId: '1.2.1.20',
    accountCode: '1.2.1.20',
    accountName: 'Ativo de Indenização em M&A - Garantia do Vendedor (Ativo Não Circulante - CPC 15)',
    type: 'DEBIT',
    amount: valorAtivoIndenizacao
  });

  // 2. C: Provisão para Contingências Fiscais/Cíveis Pré-Aquisição (Passivo Não Circulante - CPC 25)
  partidas.push({
    accountId: '2.2.2.05',
    accountCode: '2.2.2.05',
    accountName: 'Provisão para Contingências Pré-Aquisição Indenizáveis (Passivo Não Circulante - CPC 25)',
    type: 'CREDIT',
    amount: valorPassivoContingenteReconhecidoBrl
  });

  // Se houver excesso do passivo sobre o teto do ativo de indenização, a diferença afeta o Goodwill inicial
  const diferencaNaoGarantida = Number((valorPassivoContingenteReconhecidoBrl - valorAtivoIndenizacao).toFixed(2));
  if (diferencaNaoGarantida > 0) {
    partidas.push({
      accountId: '1.2.4.01',
      accountCode: '1.2.4.01',
      accountName: 'Goodwill por Rentabilidade Futura na Aquisição (Ativo Intangível - CPC 15)',
      type: 'DEBIT',
      amount: diferencaNaoGarantida
    });
  }

  const diag = 'Ativo de Indenização em M&A (CPC 15 R1 Itens 27-28): ' + adquirenteNome + ' (Garantidor: ' + vendedorGarantidorNome + '). Contingência: ' + contingenciaDescricao + '. Passivo Contingente CPC 25: R$ ' + valorPassivoContingenteReconhecidoBrl.toFixed(2) + ' <-> Ativo de Indenização CPC 15: R$ ' + valorAtivoIndenizacao.toFixed(2) + ' (Efeito Neutro no PL).';

  return Ok({
    aquisicaoId,
    adquirenteNome,
    vendedorGarantidorNome,
    valorPassivoContingenteBrl: valorPassivoContingenteReconhecidoBrl,
    valorAtivoIndenizacaoReconhecidoBrl: valorAtivoIndenizacao,
    impactoLiquidoPatrimonioLiquidoBrl: 0,
    partidasDobradaAquisicao: partidas,
    diagnosticoCpc15: diag
  });
}
