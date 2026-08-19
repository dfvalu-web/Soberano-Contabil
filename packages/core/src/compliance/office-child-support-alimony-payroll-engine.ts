import { Result, Ok, Err } from '../types/result.js';

export interface ChildSupportAlimonyInput {
  funcionarioCpf: string;
  nomeFuncionario: string;
  processoJudicialNumero: string;
  varaFamiliaComarca: string;
  remuneracaoBrutaBrl: number;
  descontoInssOficialBrl: number;
  tipoCalculoPensao: 'PERCENTUAL_SOBRE_LIQUIDO' | 'PERCENTUAL_SOBRE_BRUTO' | 'VALOR_FIXO_REAIS';
  percentualPensaoPercent?: number; // Ex: 30%
  valorFixoPensaoBrl?: number;
}

export interface ChildSupportAlimonyResult {
  funcionarioCpf: string;
  nomeFuncionario: string;
  processoJudicialNumero: string;
  baseCalculoPensaoBrl: number;
  valorPensaoAlimenticiaDescontadaBrl: number;
  valorPensaoDedutivelBaseIrrfBrl: number;
  salarioLiquidoFinalTrabalhadorBrl: number;
  rubricaEsocialDesconto: '5001_PENSAO_ALIMENTICIA_JUDICIAL';
  statusPensao: 'PENSAO_ALIMENTICIA_APURADA_COM_SUCESSO';
  diagnosticoPensao: string;
}

export function processOfficeChildSupportAlimonyPayrollEngine(input: ChildSupportAlimonyInput): Result<ChildSupportAlimonyResult, Error> {
  const {
    funcionarioCpf,
    nomeFuncionario,
    processoJudicialNumero,
    varaFamiliaComarca,
    remuneracaoBrutaBrl,
    descontoInssOficialBrl,
    tipoCalculoPensao,
    percentualPensaoPercent = 30.0,
    valorFixoPensaoBrl = 0
  } = input;

  if (!funcionarioCpf || !processoJudicialNumero || remuneracaoBrutaBrl <= 0) {
    return Err(new Error('CPF, número do processo judicial e remuneração bruta são obrigatórios.'));
  }

  let valorPensao = 0;
  let basePensao = remuneracaoBrutaBrl;

  if (tipoCalculoPensao === 'PERCENTUAL_SOBRE_LIQUIDO') {
    basePensao = remuneracaoBrutaBrl - descontoInssOficialBrl;
    valorPensao = (basePensao * percentualPensaoPercent) / 100;
  } else if (tipoCalculoPensao === 'PERCENTUAL_SOBRE_BRUTO') {
    basePensao = remuneracaoBrutaBrl;
    valorPensao = (basePensao * percentualPensaoPercent) / 100;
  } else {
    basePensao = remuneracaoBrutaBrl;
    valorPensao = valorFixoPensaoBrl;
  }

  const salarioLiquido = remuneracaoBrutaBrl - descontoInssOficialBrl - valorPensao;

  const diag = "Pensão Alimentícia (" + nomeFuncionario + " - Proc. " + processoJudicialNumero + " / " + varaFamiliaComarca + "): Base: R$ " + basePensao.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " | Pensão Descontada: R$ " + valorPensao.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " (" + percentualPensaoPercent + "%) | Dedução IRRF Lei 9.250/95: R$ " + valorPensao.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " | Líquido Final: R$ " + salarioLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ".";

  return Ok({
    funcionarioCpf,
    nomeFuncionario,
    processoJudicialNumero,
    baseCalculoPensaoBrl: parseFloat(basePensao.toFixed(2)),
    valorPensaoAlimenticiaDescontadaBrl: parseFloat(valorPensao.toFixed(2)),
    valorPensaoDedutivelBaseIrrfBrl: parseFloat(valorPensao.toFixed(2)),
    salarioLiquidoFinalTrabalhadorBrl: parseFloat(salarioLiquido.toFixed(2)),
    rubricaEsocialDesconto: '5001_PENSAO_ALIMENTICIA_JUDICIAL',
    statusPensao: 'PENSAO_ALIMENTICIA_APURADA_COM_SUCESSO',
    diagnosticoPensao: diag
  });
}
