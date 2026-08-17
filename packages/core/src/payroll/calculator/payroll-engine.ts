import { PayrollInput, PayrollResult } from '../../types/payroll.js';
import { calculateInss, calculateIrrf, SALARIO_MINIMO_2026 } from './inss-irrf.js';
import { Result, Ok } from '../../types/result.js';

export function calculateMonthlyPayroll(input: PayrollInput): Result<PayrollResult, Error> {
  const {
    salarioBase,
    dependentesIrrf,
    pensaoAlimenticia = 0,
    horasExtras50Percent = 0,
    horasExtras100Percent = 0,
    valorHoraNormal = (salarioBase / 220),
    adicionalNoturnoHoras = 0,
    adicionalInsalubridadeGrau = 'NENHUM',
    adicionalPericulosidade = false,
    descontoValeTransportePercent = 0.06,
    outrosProventos = 0,
    outrosDescontos = 0
  } = input;

  // 1. Proventos
  const valorHe50 = Number((horasExtras50Percent * valorHoraNormal * 1.5).toFixed(2));
  const valorHe100 = Number((horasExtras100Percent * valorHoraNormal * 2.0).toFixed(2));
  const totalHorasExtras = Number((valorHe50 + valorHe100).toFixed(2));
  
  // DSR sobre Horas Extras (estimativa média: HE / 25 dias úteis * 5 domingos/feriados)
  const dsrHorasExtras = Number((totalHorasExtras > 0 ? (totalHorasExtras / 25 * 5) : 0).toFixed(2));

  // Adicional Noturno (20% sobre hora normal)
  const adicionalNoturno = Number((adicionalNoturnoHoras * valorHoraNormal * 0.20).toFixed(2));

  // Insalubridade (10%, 20%, 40% do salário mínimo)
  let taxaInsalubridade = 0;
  if (adicionalInsalubridadeGrau === 'MINIMO') taxaInsalubridade = 0.10;
  if (adicionalInsalubridadeGrau === 'MEDIO') taxaInsalubridade = 0.20;
  if (adicionalInsalubridadeGrau === 'MAXIMO') taxaInsalubridade = 0.40;
  const adicionalInsalubridade = Number((SALARIO_MINIMO_2026 * taxaInsalubridade).toFixed(2));

  // Periculosidade (30% sobre salário base)
  const adicionalPericulosidadeValor = adicionalPericulosidade ? Number((salarioBase * 0.30).toFixed(2)) : 0;

  const totalBruto = Number((
    salarioBase +
    totalHorasExtras +
    dsrHorasExtras +
    adicionalNoturno +
    adicionalInsalubridade +
    adicionalPericulosidadeValor +
    outrosProventos
  ).toFixed(2));

  // 2. Descontos
  const { inssTotal, aliquotaEfetiva: aliqInss } = calculateInss(totalBruto);
  const { irrfTotal, aliquotaEfetiva: aliqIrrf, usaDeducaoSimplificada } = calculateIrrf(totalBruto, inssTotal, dependentesIrrf, pensaoAlimenticia);

  // Vale Transporte (até 6% do salário base)
  const valeTransporte = Number((salarioBase * Math.min(0.06, descontoValeTransportePercent)).toFixed(2));
  const totalDescontos = Number((inssTotal + irrfTotal + valeTransporte + pensaoAlimenticia + outrosDescontos).toFixed(2));

  // 3. Salário Líquido
  const salarioLiquido = Number((totalBruto - totalDescontos).toFixed(2));

  // 4. Encargos Patronais
  const fgtsMensal8Percent = Number((totalBruto * 0.08).toFixed(2));
  const inssPatronal20Percent = Number((totalBruto * 0.20).toFixed(2));
  const ratFap = Number((totalBruto * 0.02).toFixed(2)); // RAT médio 2%
  const terceirosOutrasEntidades5_8Percent = Number((totalBruto * 0.058).toFixed(2)); // Sistema S / Salário Educação
  const provisao13Salario = Number((totalBruto / 12).toFixed(2));
  const provisaoFeriasUmTerco = Number(((totalBruto / 12) * 1.3333).toFixed(2));
  
  const custoTotalEmpregador = Number((
    totalBruto +
    fgtsMensal8Percent +
    inssPatronal20Percent +
    ratFap +
    terceirosOutrasEntidades5_8Percent +
    provisao13Salario +
    provisaoFeriasUmTerco
  ).toFixed(2));

  return Ok({
    proventos: {
      salarioBase,
      horasExtras: totalHorasExtras,
      dsrHorasExtras,
      adicionalNoturno,
      adicionalInsalubridade,
      adicionalPericulosidade: adicionalPericulosidadeValor,
      outros: outrosProventos,
      totalBruto
    },
    descontos: {
      inss: inssTotal,
      aliquotaEfetivaInss: aliqInss,
      irrf: irrfTotal,
      aliquotaEfetivaIrrf: aliqIrrf,
      usaDeducaoSimplificadaIrrf: usaDeducaoSimplificada,
      valeTransporte,
      pensaoAlimenticia,
      outros: outrosDescontos,
      totalDescontos
    },
    salarioLiquido,
    encargosPatronais: {
      fgtsMensal8Percent,
      inssPatronal20Percent,
      ratFap,
      terceirosOutrasEntidades5_8Percent,
      provisao13Salario,
      provisaoFeriasUmTerco,
      custoTotalEmpregador
    }
  });
}
