import { Result, Ok, Err } from '../../types/result.js';

export type SoftwareBusinessType = 'SOFTWARE_AS_A_SERVICE_SAAS' | 'LICENCIAMENTO_CESSAO_USO_PADRAO' | 'DESENVOLVIMENTO_SOFTWARE_ENCOMENDA';
export type TechCompanyRegimeType = 'LUCRO_REAL' | 'LUCRO_PRESUMIDO' | 'SIMPLES_NACIONAL';

export interface SoftwareSaasTaxInput {
  operacaoId: string;
  empresaNome: string;
  tipoNegocioSoftware: SoftwareBusinessType;
  regimeTributario: TechCompanyRegimeType;
  faturamentoMensalSoftwareBrl: number;
  aliquotaIssqnMunicipalPercent?: number; // Ex: 2% a 5% (Item 1.05 LC 116/03)
}

export interface SoftwareSaasTaxResult {
  operacaoId: string;
  empresaNome: string;
  tipoNegocioSoftware: SoftwareBusinessType;
  imunidadeIcmsConfirmadaSTF: boolean;
  aliquotaIssqnPercent: number;
  valorIssqnDevidoBrl: number;
  regimePisCofinsAplicado: 'CUMULATIVO_ESPECIAL_TI' | 'CUMULATIVO_PRESUMIDO' | 'SIMPLES_UNIFICADO';
  aliquotaPisPercent: number;
  aliquotaCofinsPercent: number;
  valorPisDevidoBrl: number;
  valorCofinsDevidoBrl: number;
  totalTributosDevidosBrl: number;
  diagnosticoFiscal: string;
}

export function processSoftwareSaasTaxEngine(input: SoftwareSaasTaxInput): Result<SoftwareSaasTaxResult, Error> {
  const {
    operacaoId,
    empresaNome,
    tipoNegocioSoftware,
    regimeTributario,
    faturamentoMensalSoftwareBrl,
    aliquotaIssqnMunicipalPercent = 3.0
  } = input;

  if (faturamentoMensalSoftwareBrl <= 0) {
    return Err(new Error('Faturamento mensal de software deve ser superior a zero.'));
  }

  // Jurisprudência Vinculante do STF (ADIs 5.659 e 1.945): NÃO INCIDE ICMS. Incide exclusivamente ISSQN.
  const imunidadeIcms = true;
  const valorIss = Number((faturamentoMensalSoftwareBrl * (aliquotaIssqnMunicipalPercent / 100)).toFixed(2));

  let aliqPis = 0.65;
  let aliqCofins = 3.00;
  let regimePisCofins: 'CUMULATIVO_ESPECIAL_TI' | 'CUMULATIVO_PRESUMIDO' | 'SIMPLES_UNIFICADO' = 'CUMULATIVO_ESPECIAL_TI';

  if (regimeTributario === 'LUCRO_REAL') {
    // Lei nº 10.833/2003, Art. 10, XXV: Empresas de desenvolvimento de software e serviços de TI no Lucro Real permanecem no REGIME CUMULATIVO (0,65% PIS e 3,00% COFINS)
    aliqPis = 0.65;
    aliqCofins = 3.00;
    regimePisCofins = 'CUMULATIVO_ESPECIAL_TI';
  } else if (regimeTributario === 'LUCRO_PRESUMIDO') {
    aliqPis = 0.65;
    aliqCofins = 3.00;
    regimePisCofins = 'CUMULATIVO_PRESUMIDO';
  } else {
    aliqPis = 0;
    aliqCofins = 0;
    regimePisCofins = 'SIMPLES_UNIFICADO';
  }

  const valorPis = Number((faturamentoMensalSoftwareBrl * (aliqPis / 100)).toFixed(2));
  const valorCofins = Number((faturamentoMensalSoftwareBrl * (aliqCofins / 100)).toFixed(2));
  const totalTrib = Number((valorIss + valorPis + valorCofins).toFixed(2));

  const diag = 'Tributação de Software & SaaS (STF ADIs 5.659/1.945 & Lei 10.833/03): ' + empresaNome + ' (' + tipoNegocioSoftware + '). NÃO INCIDE ICMS. Incidência exclusiva de ISSQN (' + aliquotaIssqnMunicipalPercent + '%: R$ ' + valorIss.toFixed(2) + '). PIS/COFINS no Regime Cumulativo Especial de TI (' + aliqPis + '% / ' + aliqCofins + '% = R$ ' + (valorPis + valorCofins).toFixed(2) + '). Total de tributos indiretos/municipais: R$ ' + totalTrib.toFixed(2) + '.';

  return Ok({
    operacaoId,
    empresaNome,
    tipoNegocioSoftware,
    imunidadeIcmsConfirmadaSTF: imunidadeIcms,
    aliquotaIssqnPercent: aliquotaIssqnMunicipalPercent,
    valorIssqnDevidoBrl: valorIss,
    regimePisCofinsAplicado: regimePisCofins,
    aliquotaPisPercent: aliqPis,
    aliquotaCofinsPercent: aliqCofins,
    valorPisDevidoBrl: valorPis,
    valorCofinsDevidoBrl: valorCofins,
    totalTributosDevidosBrl: totalTrib,
    diagnosticoFiscal: diag
  });
}
