import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export interface OnerousContractInput {
  contratoId: string;
  contraparteNome: string; // Ex: 'Consórcio Construtor Alpha'
  descricaoContrato: string;
  custosInevitaveisCumprimentoBrl: number;
  beneficiosEconomicosEsperadosBrl: number;
  penalidadeMultaRescisoriaBrl: number;
}

export interface OnerousContractResult {
  contratoId: string;
  contraparteNome: string;
  isContratoOneroso: boolean;
  prejuizoLiquidoCumprimentoBrl: number;
  penalidadeRescisoriaBrl: number;
  valorProvisaoOnerosaReconhecidaBrl: number;
  opcaoDeMenorCusto: 'CUMPRIMENTO_DO_CONTRATO' | 'RESCISAO_COM_MULTA' | 'CONTRATO_NAO_ONEROSO';
  partidasDobradaProvisao: JournalEntryLine[];
  diagnosticoCpc25: string;
}

export function evaluateOnerousContractCpc25(input: OnerousContractInput): Result<OnerousContractResult, Error> {
  const {
    contratoId,
    contraparteNome,
    descricaoContrato,
    custosInevitaveisCumprimentoBrl,
    beneficiosEconomicosEsperadosBrl,
    penalidadeMultaRescisoriaBrl
  } = input;

  if (custosInevitaveisCumprimentoBrl < 0 || beneficiosEconomicosEsperadosBrl < 0) {
    return Err(new Error('Custos e benefícios do contrato devem ser superiores ou iguais a zero.'));
  }

  const prejuizoCumprimento = Number(Math.max(0, custosInevitaveisCumprimentoBrl - beneficiosEconomicosEsperadosBrl).toFixed(2));
  const isOneroso = prejuizoCumprimento > 0;

  let valorProvisao = 0;
  let opcao: 'CUMPRIMENTO_DO_CONTRATO' | 'RESCISAO_COM_MULTA' | 'CONTRATO_NAO_ONEROSO' = 'CONTRATO_NAO_ONEROSO';

  if (isOneroso) {
    if (prejuizoCumprimento <= penalidadeMultaRescisoriaBrl) {
      valorProvisao = prejuizoCumprimento;
      opcao = 'CUMPRIMENTO_DO_CONTRATO';
    } else {
      valorProvisao = penalidadeMultaRescisoriaBrl;
      opcao = 'RESCISAO_COM_MULTA';
    }
  }

  const partidas: JournalEntryLine[] = [];

  if (valorProvisao > 0) {
    // D: Despesa Operacional com Contratos Onerosos (Resultado - CPC 25)
    partidas.push({
      accountId: '3.1.3.18',
      accountCode: '3.1.3.18',
      accountName: 'Despesas com Provisão para Contratos Onerosos (Resultado - CPC 25)',
      type: 'DEBIT',
      amount: valorProvisao
    });
    // C: Provisão para Contratos Onerosos (Passivo Circulante / Não Circulante - CPC 25)
    partidas.push({
      accountId: '2.1.4.12',
      accountCode: '2.1.4.12',
      accountName: 'Provisão para Perdas em Contratos Onerosos (Passivo - CPC 25)',
      type: 'CREDIT',
      amount: valorProvisao
    });
  }

  const diag = 'CPC 25 / IAS 37 (Contratos Onerosos): Contrato ' + contratoId + ' (' + contraparteNome + '). ' + (isOneroso ? 'CONTRATO ONEROSO IDENTIFICADO. Custos de cumprimento (R$ ' + custosInevitaveisCumprimentoBrl.toFixed(2) + ') superam benefícios (R$ ' + beneficiosEconomicosEsperadosBrl.toFixed(2) + ') em R$ ' + prejuizoCumprimento.toFixed(2) + '. Provisão reconhecida pelo menor custo: R$ ' + valorProvisao.toFixed(2) + ' (' + opcao + ').' : 'Contrato com margem positiva. Não oneroso.');

  return Ok({
    contratoId,
    contraparteNome,
    isContratoOneroso: isOneroso,
    prejuizoLiquidoCumprimentoBrl: prejuizoCumprimento,
    penalidadeRescisoriaBrl: penalidadeMultaRescisoriaBrl,
    valorProvisaoOnerosaReconhecidaBrl: valorProvisao,
    opcaoDeMenorCusto: opcao,
    partidasDobradaProvisao: partidas,
    diagnosticoCpc25: diag
  });
}
