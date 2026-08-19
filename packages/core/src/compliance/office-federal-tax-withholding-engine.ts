import { Result, Ok, Err } from '../types/result.js';

export interface FederalTaxWithholdingInput {
  prestadorCnpj: string;
  tomadorCnpj: string;
  numeroNfse: string;
  valorServicoBrutoBrl: number;
  tipoServico: 'SERVICOS_PROFISSIONAIS_1_5' | 'LIMPEZA_VIGILANCIA_1_0';
  optanteSimplesNacionalPrestador: boolean;
}

export interface FederalTaxWithholdingResult {
  prestadorCnpj: string;
  tomadorCnpj: string;
  numeroNfse: string;
  valorServicoBrutoBrl: number;
  aliquotaIrrfPercent: number;
  valorIrrfRetidoBrl: number;
  aliquotaCsrfPercent: number; // 4.65% (PIS 0.65%, COFINS 3%, CSLL 1%)
  valorCsrfRetidoBrl: number;
  totalRetencoesFederaisBrl: number;
  valorLiquidoNfseBrl: number;
  dispensaRetencaoMinima10Reais: boolean;
  statusRetencao: 'RETENCOES_FEDERAIS_APURADAS_COM_SUCESSO';
  diagnosticoRetencao: string;
}

export function processOfficeFederalTaxWithholdingEngine(input: FederalTaxWithholdingInput): Result<FederalTaxWithholdingResult, Error> {
  const {
    prestadorCnpj,
    tomadorCnpj,
    numeroNfse,
    valorServicoBrutoBrl,
    tipoServico,
    optanteSimplesNacionalPrestador
  } = input;

  if (!prestadorCnpj || !tomadorCnpj || valorServicoBrutoBrl <= 0) {
    return Err(new Error('CNPJs do prestador e tomador e valor bruto do serviço são obrigatórios.'));
  }

  // Se o prestador for optante pelo Simples Nacional, não há retenção de IRRF e CSRF na fonte (IN RFB 1.234/12 e Art. 30 Lei 10.833)
  if (optanteSimplesNacionalPrestador) {
    return Ok({
      prestadorCnpj,
      tomadorCnpj,
      numeroNfse,
      valorServicoBrutoBrl,
      aliquotaIrrfPercent: 0,
      valorIrrfRetidoBrl: 0,
      aliquotaCsrfPercent: 0,
      valorCsrfRetidoBrl: 0,
      totalRetencoesFederaisBrl: 0,
      valorLiquidoNfseBrl: valorServicoBrutoBrl,
      dispensaRetencaoMinima10Reais: false,
      statusRetencao: 'RETENCOES_FEDERAIS_APURADAS_COM_SUCESSO',
      diagnosticoRetencao: "Prestador optante pelo Simples Nacional: Dispensa total de retenção federal de IRRF e CSRF na fonte."
    });
  }

  const aliquotaIrrf = tipoServico === 'SERVICOS_PROFISSIONAIS_1_5' ? 1.5 : 1.0;
  let valorIrrf = (valorServicoBrutoBrl * aliquotaIrrf) / 100;
  let valorCsrf = (valorServicoBrutoBrl * 4.65) / 100;

  let dispensa = false;
  // Trava legal de dispensa de retenção <= R$ 10,00 (Art. 67 Lei 9.430/96)
  if (valorIrrf <= 10.00) {
    valorIrrf = 0;
    dispensa = true;
  }

  if (valorCsrf <= 10.00) {
    valorCsrf = 0;
    dispensa = true;
  }

  const totalRetencoes = valorIrrf + valorCsrf;
  const valorLiquido = valorServicoBrutoBrl - totalRetencoes;

  const diag = "Retenções NFS-e " + numeroNfse + ": Bruto: R$ " + valorServicoBrutoBrl.toFixed(2) + " | IRRF (" + aliquotaIrrf + "%): R$ " + valorIrrf.toFixed(2) + " | CSRF (4,65%): R$ " + valorCsrf.toFixed(2) + " | Total Retido: R$ " + totalRetencoes.toFixed(2) + " | Líquido a Pagar: R$ " + valorLiquido.toFixed(2) + (dispensa ? " (Com dispensa legal <= R$ 10,00)." : ".");

  return Ok({
    prestadorCnpj,
    tomadorCnpj,
    numeroNfse,
    valorServicoBrutoBrl: parseFloat(valorServicoBrutoBrl.toFixed(2)),
    aliquotaIrrfPercent: aliquotaIrrf,
    valorIrrfRetidoBrl: parseFloat(valorIrrf.toFixed(2)),
    aliquotaCsrfPercent: 4.65,
    valorCsrfRetidoBrl: parseFloat(valorCsrf.toFixed(2)),
    totalRetencoesFederaisBrl: parseFloat(totalRetencoes.toFixed(2)),
    valorLiquidoNfseBrl: parseFloat(valorLiquido.toFixed(2)),
    dispensaRetencaoMinima10Reais: dispensa,
    statusRetencao: 'RETENCOES_FEDERAIS_APURADAS_COM_SUCESSO',
    diagnosticoRetencao: diag
  });
}
