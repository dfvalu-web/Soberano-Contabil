const fs = require('fs');

const vacationCode = `import { Result, Ok, Err } from '../../types/result.js';
import { calculateInss, calculateIrrf } from '../calculator/inss-irrf.js';

export interface VacationInput {
  salarioBase: number;
  diasGozoFerias: number;
  diasAbonoPecuniario: number;
  adiantarPrimeiraParcelaDecimoTerceiro?: boolean;
  dependentesIrrf?: number;
  pensaoAlimenticia?: number;
}

export interface VacationCalculationResult {
  valorDiasFerias: number;
  tercoConstitucional: number;
  valorAbonoPecuniario: number;
  tercoAbonoPecuniario: number;
  adiantamentoDecimoTerceiro: number;
  totalBrutoFerias: number;
  descontoInss: number;
  descontoIrrf: number;
  liquidoFeriasAReceber: number;
}

export function calculateVacations(input: VacationInput): Result<VacationCalculationResult, Error> {
  const {
    salarioBase,
    diasGozoFerias,
    diasAbonoPecuniario = 0,
    adiantarPrimeiraParcelaDecimoTerceiro = false,
    dependentesIrrf = 0,
    pensaoAlimenticia = 0
  } = input;

  if (diasGozoFerias + diasAbonoPecuniario > 30) {
    return Err(new Error('A soma dos dias de gozo de ferias e abono pecuniario nao pode exceder 30 dias.'));
  }

  const valorDia = salarioBase / 30;
  const valorDiasFerias = Number((valorDia * diasGozoFerias).toFixed(2));
  const tercoConstitucional = Number((valorDiasFerias / 3).toFixed(2));

  const valorAbonoPecuniario = Number((valorDia * diasAbonoPecuniario).toFixed(2));
  const tercoAbonoPecuniario = Number((valorAbonoPecuniario / 3).toFixed(2));

  const adiantamentoDecimoTerceiro = adiantarPrimeiraParcelaDecimoTerceiro
    ? Number((salarioBase / 2).toFixed(2))
    : 0;

  const baseTributavelInss = Number((valorDiasFerias + tercoConstitucional).toFixed(2));
  const inssRes = calculateInss(baseTributavelInss);
  const descontoInss = inssRes.inssTotal;

  const irrfRes = calculateIrrf(baseTributavelInss, descontoInss, dependentesIrrf, pensaoAlimenticia);
  const descontoIrrf = irrfRes.irrfTotal;

  const totalBrutoFerias = Number((valorDiasFerias + tercoConstitucional + valorAbonoPecuniario + tercoAbonoPecuniario + adiantamentoDecimoTerceiro).toFixed(2));
  const liquidoFeriasAReceber = Number((totalBrutoFerias - descontoInss - descontoIrrf).toFixed(2));

  return Ok({
    valorDiasFerias,
    tercoConstitucional,
    valorAbonoPecuniario,
    tercoAbonoPecuniario,
    adiantamentoDecimoTerceiro,
    totalBrutoFerias,
    descontoInss,
    descontoIrrf,
    liquidoFeriasAReceber
  });
}

export interface ThirteenthSalaryInput {
  salarioBase: number;
  mesesTrabalhadosNoAno: number;
  parcela: 'PRIMEIRA' | 'SEGUNDA';
  valorPagoPrimeiraParcela?: number;
  dependentesIrrf?: number;
}

export interface ThirteenthSalaryResult {
  parcela: 'PRIMEIRA' | 'SEGUNDA';
  valorIntegralDecimoTerceiro: number;
  valorBrutoParcela: number;
  descontoAdiantamentoPrimeiraParcela: number;
  descontoInss: number;
  descontoIrrf: number;
  liquidoAReceber: number;
}

export function calculateThirteenthSalary(input: ThirteenthSalaryInput): Result<ThirteenthSalaryResult, Error> {
  const { salarioBase, mesesTrabalhadosNoAno, parcela, valorPagoPrimeiraParcela = 0, dependentesIrrf = 0 } = input;

  const valorIntegral = Number(((salarioBase / 12) * mesesTrabalhadosNoAno).toFixed(2));

  if (parcela === 'PRIMEIRA') {
    const valorBruto = Number((valorIntegral / 2).toFixed(2));
    return Ok({
      parcela: 'PRIMEIRA',
      valorIntegralDecimoTerceiro: valorIntegral,
      valorBrutoParcela: valorBruto,
      descontoAdiantamentoPrimeiraParcela: 0,
      descontoInss: 0,
      descontoIrrf: 0,
      liquidoAReceber: valorBruto
    });
  } else {
    const inssRes = calculateInss(valorIntegral);
    const descontoInss = inssRes.inssTotal;

    const irrfRes = calculateIrrf(valorIntegral, descontoInss, dependentesIrrf);
    const descontoIrrf = irrfRes.irrfTotal;

    const adiantamento = valorPagoPrimeiraParcela > 0 ? valorPagoPrimeiraParcela : Number((valorIntegral / 2).toFixed(2));
    const liquido = Number((valorIntegral - adiantamento - descontoInss - descontoIrrf).toFixed(2));

    return Ok({
      parcela: 'SEGUNDA',
      valorIntegralDecimoTerceiro: valorIntegral,
      valorBrutoParcela: valorIntegral,
      descontoAdiantamentoPrimeiraParcela: adiantamento,
      descontoInss,
      descontoIrrf,
      liquidoAReceber: liquido
    });
  }
}

export interface MonthlyPayrollProvisionInput {
  folhaBrutaMensal: number;
  aliquotaInssPatronal?: number;
  aliquotaRatFap?: number;
  aliquotaTerceiros?: number;
  aliquotaFgts?: number;
}

export interface MonthlyPayrollProvisionResult {
  provisaoFeriasPrincipal: number;
  provisaoFeriasEncargosPatronais: number;
  totalProvisaoFerias: number;
  provisaoDecimoTerceiroPrincipal: number;
  provisaoDecimoTerceiroEncargosPatronais: number;
  totalProvisaoDecimoTerceiro: number;
  totalProvisoesDoMes: number;
}

export function calculateMonthlyProvisions(input: MonthlyPayrollProvisionInput): Result<MonthlyPayrollProvisionResult, Error> {
  const {
    folhaBrutaMensal,
    aliquotaInssPatronal = 0.20,
    aliquotaRatFap = 0.02,
    aliquotaTerceiros = 0.058,
    aliquotaFgts = 0.08
  } = input;

  const encargoTotalPercent = aliquotaInssPatronal + aliquotaRatFap + aliquotaTerceiros + aliquotaFgts;

  const feriasBase = (folhaBrutaMensal / 12);
  const tercoFerias = (feriasBase / 3);
  const provisaoFeriasPrincipal = Number((feriasBase + tercoFerias).toFixed(2));
  const provisaoFeriasEncargos = Number((provisaoFeriasPrincipal * encargoTotalPercent).toFixed(2));
  const totalProvisaoFerias = Number((provisaoFeriasPrincipal + provisaoFeriasEncargos).toFixed(2));

  const provisaoDecimoTerceiroPrincipal = Number((folhaBrutaMensal / 12).toFixed(2));
  const provisaoDecimoEncargos = Number((provisaoDecimoTerceiroPrincipal * encargoTotalPercent).toFixed(2));
  const totalProvisaoDecimo = Number((provisaoDecimoTerceiroPrincipal + provisaoDecimoEncargos).toFixed(2));

  const totalProvisoesDoMes = Number((totalProvisaoFerias + totalProvisaoDecimo).toFixed(2));

  return Ok({
    provisaoFeriasPrincipal,
    provisaoFeriasEncargosPatronais: provisaoFeriasEncargos,
    totalProvisaoFerias,
    provisaoDecimoTerceiroPrincipal,
    provisaoDecimoTerceiroEncargosPatronais: provisaoDecimoEncargos,
    totalProvisaoDecimoTerceiro: totalProvisaoDecimo,
    totalProvisoesDoMes
  });
}
`;

fs.writeFileSync('packages/core/src/payroll/benefits/vacation-thirteenth.ts', vacationCode, 'utf8');
console.log('Written complete vacation-thirteenth.ts');
