import { Result, Ok, Err } from '../../types/result.js';

export interface MedicalServiceBreakdown {
  receitaServicosHospitalaresCirurgicosDiagnosticosBrl: number; // STJ Tema 217 -> 8% IRPJ / 12% CSLL
  receitaConsultasMedicasSimplesBrl: number; // Regra Geral -> 32% IRPJ / 32% CSLL
}

export interface HospitalEquiparationInput {
  clinicaId: string;
  clinicaNome: string;
  atendeNormasAnvisa: boolean;
  isSociedadeEmpresaria: boolean;
  servicos: MedicalServiceBreakdown;
  aliquotaAdicionalIrpjPercent?: number; // 10% sobre excedente de R$ 60k/trimestre
}

export interface HospitalEquiparationResult {
  clinicaId: string;
  clinicaNome: string;
  isEquiparacaoAprovadaSTJ: boolean;
  baseCalculoIrpjComEquiparacaoBrl: number;
  baseCalculoIrpjSemEquiparacaoPadraoBrl: number;
  valorIrpjDevidoBrl: number;
  baseCalculoCsllComEquiparacaoBrl: number;
  baseCalculoCsllSemEquiparacaoPadraoBrl: number;
  valorCsllDevidaBrl: number;
  totalTributosFederaisIrpjCsllBrl: number;
  economiaTributariaEquiparacaoBrl: number;
  diagnosticoFiscal: string;
}

export function processHospitalEquiparationMedicalTaxEngine(input: HospitalEquiparationInput): Result<HospitalEquiparationResult, Error> {
  const {
    clinicaId,
    clinicaNome,
    atendeNormasAnvisa,
    isSociedadeEmpresaria,
    servicos,
    aliquotaAdicionalIrpjPercent = 10.0
  } = input;

  const receitaTotal = servicos.receitaServicosHospitalaresCirurgicosDiagnosticosBrl + servicos.receitaConsultasMedicasSimplesBrl;
  if (receitaTotal <= 0) {
    return Err(new Error('Receita médica total deve ser superior a zero.'));
  }

  // Requisitos cumulativos do STJ (Tema 217):
  // 1. Ser sociedade empresária (LTDA ou S.A.);
  // 2. Cumprir normas da ANVISA;
  // 3. Prestar serviços de natureza hospitalar (cirurgias, exames, procedimentos invasivos).
  const isElegivel = atendeNormasAnvisa && isSociedadeEmpresaria;

  // 1. Cálculo COM Equiparação (8% IRPJ / 12% CSLL nos serviços hospitalares e 32% nas consultas)
  let baseIrpjCom = 0;
  let baseCsllCom = 0;

  if (isElegivel) {
    baseIrpjCom = Number((
      (servicos.receitaServicosHospitalaresCirurgicosDiagnosticosBrl * 0.08) +
      (servicos.receitaConsultasMedicasSimplesBrl * 0.32)
    ).toFixed(2));

    baseCsllCom = Number((
      (servicos.receitaServicosHospitalaresCirurgicosDiagnosticosBrl * 0.12) +
      (servicos.receitaConsultasMedicasSimplesBrl * 0.32)
    ).toFixed(2));
  } else {
    // Sem equiparação: 32% sobre tudo
    baseIrpjCom = Number((receitaTotal * 0.32).toFixed(2));
    baseCsllCom = Number((receitaTotal * 0.32).toFixed(2));
  }

  // Base SEM Equiparação (Padrão 32%)
  const baseIrpjSem = Number((receitaTotal * 0.32).toFixed(2));
  const baseCsllSem = Number((receitaTotal * 0.32).toFixed(2));

  // IRPJ: 15% básico + 10% adicional sobre base > R$ 60k
  const irpjBasico = baseIrpjCom * 0.15;
  const irpjAdicional = Math.max(0, baseIrpjCom - 60000) * (aliquotaAdicionalIrpjPercent / 100);
  const irpjDevido = Number((irpjBasico + irpjAdicional).toFixed(2));

  // CSLL: 9%
  const csllDevida = Number((baseCsllCom * 0.09).toFixed(2));
  const totalImpostos = Number((irpjDevido + csllDevida).toFixed(2));

  // Cálculo do IRPJ + CSLL sem equiparação para apurar a economia
  const irpjSemBasico = baseIrpjSem * 0.15;
  const irpjSemAdicional = Math.max(0, baseIrpjSem - 60000) * (aliquotaAdicionalIrpjPercent / 100);
  const irpjSemTotal = irpjSemBasico + irpjSemAdicional;
  const csllSemTotal = baseCsllSem * 0.09;
  const totalSemEquiparacao = irpjSemTotal + csllSemTotal;

  const economia = Number((Math.max(0, totalSemEquiparacao - totalImpostos)).toFixed(2));

  const diag = 'Equiparação Hospitalar (STJ Tema 217 & Lei 9.249/95): ' + clinicaNome + '. ' + (isElegivel ? 'ELEGÍVEL (Sociedade Empresária + ANVISA). Base IRPJ: R$ ' + baseIrpjCom.toFixed(2) + ' (8%/32%) | Base CSLL: R$ ' + baseCsllCom.toFixed(2) + ' (12%/32%). IRPJ: R$ ' + irpjDevido.toFixed(2) + ' | CSLL: R$ ' + csllDevida.toFixed(2) + '. ECONOMIA TRIBUTÁRIA: R$ ' + economia.toFixed(2) + ' (~' + ((economia / totalSemEquiparacao) * 100).toFixed(1) + '% de redução).' : 'NÃO ELEGÍVEL. Tributação com base cheia de 32%.');

  return Ok({
    clinicaId,
    clinicaNome,
    isEquiparacaoAprovadaSTJ: isElegivel,
    baseCalculoIrpjComEquiparacaoBrl: baseIrpjCom,
    baseCalculoIrpjSemEquiparacaoPadraoBrl: baseIrpjSem,
    valorIrpjDevidoBrl: irpjDevido,
    baseCalculoCsllComEquiparacaoBrl: baseCsllCom,
    baseCalculoCsllSemEquiparacaoPadraoBrl: baseCsllSem,
    valorCsllDevidaBrl: csllDevida,
    totalTributosFederaisIrpjCsllBrl: totalImpostos,
    economiaTributariaEquiparacaoBrl: economia,
    diagnosticoFiscal: diag
  });
}
