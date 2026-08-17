import { Result, Ok, Err } from '../../types/result.js';

export type TelecomServiceType = 'SERVICO_TELECOMUNICACOES_STFC_SMP_SCM' | 'SERVICO_VALOR_ADICIONADO_SVA_INTERNET';

export interface TelecomTaxInput {
  operacaoId: string;
  operadoraNome: string;
  tipoServico: TelecomServiceType;
  receitaBrutaOperacionalBrl: number;
  deducoesInterconexaoRepassesBrl?: number; // Deduções autorizadas de interconexão
  taxaFiscalizacaoInstalacaoTfiBrl?: number; // FISTEL TFI
}

export interface TelecomTaxResult {
  operacaoId: string;
  operadoraNome: string;
  tipoServico: TelecomServiceType;
  baseCalculoContribuicoesSetoriaisBrl: number;
  aliquotaFustPercent: number;
  valorFustDevidoBrl: number;
  aliquotaFunttelPercent: number;
  valorFunttelDevidoBrl: number;
  totalContribuicoesSetoriaisBrl: number;
  valorFistelTfiBrl: number;
  diagnosticoFiscal: string;
}

export function processTelecomFustFunttelTaxEngine(input: TelecomTaxInput): Result<TelecomTaxResult, Error> {
  const {
    operacaoId,
    operadoraNome,
    tipoServico,
    receitaBrutaOperacionalBrl,
    deducoesInterconexaoRepassesBrl = 0,
    taxaFiscalizacaoInstalacaoTfiBrl = 0
  } = input;

  if (receitaBrutaOperacionalBrl <= 0) {
    return Err(new Error('Receita bruta operacional de telecomunicações deve ser superior a zero.'));
  }

  // SVA (Serviço de Valor Adicionado - Provedores de Internet / Conexão IP): Não incide FUST nem FUNTTEL (LGT Art. 61)
  if (tipoServico === 'SERVICO_VALOR_ADICIONADO_SVA_INTERNET') {
    const diag = 'Telecomunicações / SVA (Art. 61 da LGT): ' + operadoraNome + '. Serviços de Valor Adicionado (Conexão à Internet) possuem NÃO INCIDÊNCIA de FUST e FUNTTEL (R$ 0,00).';

    return Ok({
      operacaoId,
      operadoraNome,
      tipoServico,
      baseCalculoContribuicoesSetoriaisBrl: 0,
      aliquotaFustPercent: 0,
      valorFustDevidoBrl: 0,
      aliquotaFunttelPercent: 0,
      valorFunttelDevidoBrl: 0,
      totalContribuicoesSetoriaisBrl: 0,
      valorFistelTfiBrl: taxaFiscalizacaoInstalacaoTfiBrl,
      diagnosticoFiscal: diag
    });
  }

  // Serviços de Telecomunicações (STFC, SMP, SCM):
  // FUST: 1,00% (Lei nº 9.998/2000)
  // FUNTTEL: 0,50% (Lei nº 10.052/2000)
  const baseCalculo = Number((Math.max(0, receitaBrutaOperacionalBrl - deducoesInterconexaoRepassesBrl)).toFixed(2));

  const fust = Number((baseCalculo * 0.0100).toFixed(2));
  const funttel = Number((baseCalculo * 0.0050).toFixed(2));
  const totalFundos = Number((fust + funttel).toFixed(2));

  const diag = 'Telecomunicações (Leis nº 9.998/00 e 10.052/00): ' + operadoraNome + '. Receita R$ ' + receitaBrutaOperacionalBrl.toFixed(2) + ' (Dedução Interconexão R$ ' + deducoesInterconexaoRepassesBrl.toFixed(2) + '). Base: R$ ' + baseCalculo.toFixed(2) + '. FUST (1,0%): R$ ' + fust.toFixed(2) + ' | FUNTTEL (0,5%): R$ ' + funttel.toFixed(2) + ' | FISTEL: R$ ' + taxaFiscalizacaoInstalacaoTfiBrl.toFixed(2) + '.';

  return Ok({
    operacaoId,
    operadoraNome,
    tipoServico,
    baseCalculoContribuicoesSetoriaisBrl: baseCalculo,
    aliquotaFustPercent: 1.0,
    valorFustDevidoBrl: fust,
    aliquotaFunttelPercent: 0.5,
    valorFunttelDevidoBrl: funttel,
    totalContribuicoesSetoriaisBrl: totalFundos,
    valorFistelTfiBrl: taxaFiscalizacaoInstalacaoTfiBrl,
    diagnosticoFiscal: diag
  });
}
