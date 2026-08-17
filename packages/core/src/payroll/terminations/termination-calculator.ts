import { TerminationInput, TerminationResult } from '../../types/payroll.js';
import { calculateInss, calculateIrrf } from '../calculator/inss-irrf.js';
import { Result, Ok } from '../../types/result.js';

export function calculateTermination(input: TerminationInput): Result<TerminationResult, Error> {
  const {
    tipo,
    dataAdmissao,
    dataDemissao,
    salarioBase,
    motivoAvisoPrevio,
    saldoFgtsAcumulado,
    mesesTrabalhadosAnoCorrente,
    diasSaldoSalario,
    feriasVencidas
  } = input;

  // Cálculo de anos trabalhados para Lei do Aviso Prévio Proporcional (Lei 12.506/2011)
  const dtAdm = new Date(dataAdmissao);
  const dtDem = new Date(dataDemissao);
  const anosCompletos = Math.max(0, Math.floor((dtDem.getTime() - dtAdm.getTime()) / (365.25 * 24 * 60 * 60 * 1000)));
  const diasAvisoPrevioTotal = Math.min(90, 30 + (anosCompletos * 3));

  // 1. Saldo de Salário
  const saldoSalario = Number(((salarioBase / 30) * diasSaldoSalario).toFixed(2));

  // 2. Aviso Prévio Indenizado
  let avisoPrevioIndenizado = 0;
  if (tipo === 'DEMISSAO_SEM_JUSTA_CAUSA' && motivoAvisoPrevio === 'INDENIZADO') {
    avisoPrevioIndenizado = Number(((salarioBase / 30) * diasAvisoPrevioTotal).toFixed(2));
  } else if (tipo === 'ACORDO_MUTUO_ART_484_A' && motivoAvisoPrevio === 'INDENIZADO') {
    avisoPrevioIndenizado = Number((((salarioBase / 30) * diasAvisoPrevioTotal) * 0.50).toFixed(2)); // 50%
  }

  // 3. 13º Salário Proporcional
  let decimoTerceiroProporcional = 0;
  let decimoTerceiroAvisoIndenizado = 0;

  if (tipo !== 'DEMISSAO_COM_JUSTA_CAUSA') {
    decimoTerceiroProporcional = Number(((salarioBase / 12) * mesesTrabalhadosAnoCorrente).toFixed(2));
    if (avisoPrevioIndenizado > 0) {
      decimoTerceiroAvisoIndenizado = Number((salarioBase / 12).toFixed(2));
    }
  }

  // 4. Férias Proporcionais e Vencidas + 1/3
  let feriasProporcionais = 0;
  let tercoConstitucionalFeriasProporcionais = 0;
  let feriasVencidasValor = 0;
  let tercoConstitucionalFeriasVencidas = 0;

  if (feriasVencidas) {
    feriasVencidasValor = salarioBase;
    tercoConstitucionalFeriasVencidas = Number((feriasVencidasValor / 3).toFixed(2));
  }

  if (tipo !== 'DEMISSAO_COM_JUSTA_CAUSA') {
    feriasProporcionais = Number(((salarioBase / 12) * mesesTrabalhadosAnoCorrente).toFixed(2));
    tercoConstitucionalFeriasProporcionais = Number((feriasProporcionais / 3).toFixed(2));
  }

  const totalBrutoRescisao = Number((
    saldoSalario +
    avisoPrevioIndenizado +
    decimoTerceiroProporcional +
    decimoTerceiroAvisoIndenizado +
    feriasProporcionais +
    tercoConstitucionalFeriasProporcionais +
    feriasVencidasValor +
    tercoConstitucionalFeriasVencidas
  ).toFixed(2));

  // 5. Deduções (INSS e IRRF rescisórios)
  const { inssTotal: inssSobreSaldoSalario } = calculateInss(saldoSalario);
  const { inssTotal: inssSobre13Salario } = calculateInss(decimoTerceiroProporcional + decimoTerceiroAvisoIndenizado);
  
  const baseIrrfRescisao = Math.max(0, saldoSalario + decimoTerceiroProporcional - inssSobreSaldoSalario - inssSobre13Salario);
  const { irrfTotal: irrfRescisao } = calculateIrrf(baseIrrfRescisao, 0, 0, 0);

  const totalDeducoes = Number((inssSobreSaldoSalario + inssSobre13Salario + irrfRescisao).toFixed(2));
  const liquidoRescisao = Number((totalBrutoRescisao - totalDeducoes).toFixed(2));

  // 6. Multa FGTS e Saque
  let percentualMulta = 0;
  let saldoFgtsLiberadoSaque = 0;
  let permiteSeguroDesemprego = false;

  if (tipo === 'DEMISSAO_SEM_JUSTA_CAUSA') {
    percentualMulta = 0.40; // 40%
    saldoFgtsLiberadoSaque = saldoFgtsAcumulado;
    permiteSeguroDesemprego = true;
  } else if (tipo === 'ACORDO_MUTUO_ART_484_A') {
    percentualMulta = 0.20; // 20%
    saldoFgtsLiberadoSaque = Number((saldoFgtsAcumulado * 0.80).toFixed(2)); // Saque de 80%
    permiteSeguroDesemprego = false;
  }

  const multaRescisoriaFgts = Number((saldoFgtsAcumulado * percentualMulta).toFixed(2));

  return Ok({
    tipo,
    diasAvisoPrevioTotal,
    verbasRescisorias: {
      saldoSalario,
      avisoPrevioIndenizado,
      decimoTerceiroProporcional,
      decimoTerceiroAvisoIndenizado,
      feriasProporcionais,
      tercoConstitucionalFeriasProporcionais,
      feriasVencidas: feriasVencidasValor,
      tercoConstitucionalFeriasVencidas,
      totalBrutoRescisao
    },
    deducoes: {
      inssSobreSaldoSalario,
      inssSobre13Salario,
      irrfRescisao,
      totalDeducoes
    },
    liquidoRescisao,
    fgts: {
      multaRescisoriaFgts,
      percentualMulta: percentualMulta * 100,
      saldoFgtsLiberadoSaque,
      permiteSeguroDesemprego
    }
  });
}
