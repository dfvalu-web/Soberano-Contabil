import { Result, Ok, Err } from '../types/result.js';

export interface HazardousWorkInput {
  funcionarioCpf: string;
  nomeFuncionario: string;
  salarioBaseBrl: number;
  salarioMinimoNacionalBrl: number; // Ex: R$ 1.518,00
  tipoAdicional: 'INSALUBRIDADE_GRAU_MINIMO_10' | 'INSALUBRIDADE_GRAU_MEDIO_20' | 'INSALUBRIDADE_GRAU_MAXIMO_40' | 'PERICULOSIDADE_30';
}

export interface HazardousWorkResult {
  funcionarioCpf: string;
  nomeFuncionario: string;
  tipoAdicional: string;
  baseCalculoUtilizadaBrl: number;
  aliquotaAdicionalPercent: number;
  valorAdicionalMensalBrl: number;
  reflexoFgts8PercentBrl: number;
  reflexoInssPatronal20PercentBrl: number;
  remuneracaoTotalComAdicionalBrl: number;
  rubricaEsocialUtilizada: '1020_ADICIONAL_INSALUBRIDADE' | '1030_ADICIONAL_PERICULOSIDADE';
  statusApuracao: 'ADICIONAL_TRABALHISTA_APURADO_COM_SUCESSO';
  diagnosticoAdicional: string;
}

export function processOfficeHazardousWorkPayrollEngine(input: HazardousWorkInput): Result<HazardousWorkResult, Error> {
  const {
    funcionarioCpf,
    nomeFuncionario,
    salarioBaseBrl,
    salarioMinimoNacionalBrl,
    tipoAdicional
  } = input;

  if (!funcionarioCpf || salarioBaseBrl <= 0 || salarioMinimoNacionalBrl <= 0) {
    return Err(new Error('CPF, salário base e salário mínimo são obrigatórios.'));
  }

  let baseCalculo = 0;
  let aliquota = 0;
  let rubrica: '1020_ADICIONAL_INSALUBRIDADE' | '1030_ADICIONAL_PERICULOSIDADE' = '1020_ADICIONAL_INSALUBRIDADE';

  if (tipoAdicional === 'INSALUBRIDADE_GRAU_MINIMO_10') {
    baseCalculo = salarioMinimoNacionalBrl;
    aliquota = 10.0;
    rubrica = '1020_ADICIONAL_INSALUBRIDADE';
  } else if (tipoAdicional === 'INSALUBRIDADE_GRAU_MEDIO_20') {
    baseCalculo = salarioMinimoNacionalBrl;
    aliquota = 20.0;
    rubrica = '1020_ADICIONAL_INSALUBRIDADE';
  } else if (tipoAdicional === 'INSALUBRIDADE_GRAU_MAXIMO_40') {
    baseCalculo = salarioMinimoNacionalBrl;
    aliquota = 40.0;
    rubrica = '1020_ADICIONAL_INSALUBRIDADE';
  } else {
    // PERICULOSIDADE_30: Base é o Salário Base do empregado (Art. 193 CLT)
    baseCalculo = salarioBaseBrl;
    aliquota = 30.0;
    rubrica = '1030_ADICIONAL_PERICULOSIDADE';
  }

  const valorAdicional = (baseCalculo * aliquota) / 100;
  const reflexoFgts = (valorAdicional * 8.0) / 100;
  const reflexoInss = (valorAdicional * 20.0) / 100;
  const totalRemuneracao = salarioBaseBrl + valorAdicional;

  const diag = "Adicional Trabalhista (" + nomeFuncionario + " - " + tipoAdicional + "): Base: R$ " + baseCalculo.toFixed(2) + " (" + aliquota + "%) | Adicional: R$ " + valorAdicional.toFixed(2) + " | FGTS 8%: R$ " + reflexoFgts.toFixed(2) + " | INSS Patronal 20%: R$ " + reflexoInss.toFixed(2) + " | Remuneração Total: R$ " + totalRemuneracao.toFixed(2) + " | Rubrica eSocial " + rubrica + ".";

  return Ok({
    funcionarioCpf,
    nomeFuncionario,
    tipoAdicional,
    baseCalculoUtilizadaBrl: parseFloat(baseCalculo.toFixed(2)),
    aliquotaAdicionalPercent: aliquota,
    valorAdicionalMensalBrl: parseFloat(valorAdicional.toFixed(2)),
    reflexoFgts8PercentBrl: parseFloat(reflexoFgts.toFixed(2)),
    reflexoInssPatronal20PercentBrl: parseFloat(reflexoInss.toFixed(2)),
    remuneracaoTotalComAdicionalBrl: parseFloat(totalRemuneracao.toFixed(2)),
    rubricaEsocialUtilizada: rubrica,
    statusApuracao: 'ADICIONAL_TRABALHISTA_APURADO_COM_SUCESSO',
    diagnosticoAdicional: diag
  });
}
