import { Result, Ok, Err } from '../types/result.js';

export interface IssqnWithholdingInput {
  clienteTomadorCnpj: string;
  tomadorMunicipioIbge: string;
  prestadorCnpj: string;
  prestadorRazaoSocial: string;
  prestadorMunicipioIbge: string;
  codigoServicoLc116: string; // Ex: '07.02' (Construção) ou '17.01' (Assessoria)
  valorBrutoServicoBrl: number;
  prestadorOptanteSimplesNacional: boolean;
  aliquotaSimplesDeclaradaPercent?: number;
  prestadorInscritoCpomTomador: boolean;
}

export interface IssqnWithholdingResult {
  clienteTomadorCnpj: string;
  prestadorRazaoSocial: string;
  localDevidoIss: 'MUNICIPIO_DO_TOMADOR_RETENCAO_OBRIGATORIA' | 'MUNICIPIO_DO_PRESTADOR_SEM_RETENCAO';
  exigeRetencaoIssTomador: boolean;
  aliquotaIssAplicadaPercent: number;
  valorIssRetidoBrl: number;
  valorLiquidoAPagarAoPrestadorBrl: number;
  statusIssqn: 'ISS_TOMADOR_AUDITADO_COM_SUCESSO';
  diagnosticoIssqn: string;
}

export function processOfficeIssqnWithholdingAuditEngine(input: IssqnWithholdingInput): Result<IssqnWithholdingResult, Error> {
  const {
    clienteTomadorCnpj,
    tomadorMunicipioIbge,
    prestadorCnpj,
    prestadorRazaoSocial,
    prestadorMunicipioIbge,
    codigoServicoLc116,
    valorBrutoServicoBrl,
    prestadorOptanteSimplesNacional,
    aliquotaSimplesDeclaradaPercent = 5.0,
    prestadorInscritoCpomTomador
  } = input;

  if (!clienteTomadorCnpj || !prestadorCnpj || valorBrutoServicoBrl <= 0 || !codigoServicoLc116) {
    return Err(new Error('CNPJs, valor do serviço e código da LC 116 são obrigatórios.'));
  }

  // Lista de exceções da LC 116/03 onde o ISS é devido no local da prestação (tomador)
  const servicosRetencaoLocal = ['07.02', '07.04', '07.05', '11.02', '17.05', '17.10'];
  const ehExcecaoLc116 = servicosRetencaoLocal.includes(codigoServicoLc116);

  // Reter se for exceção da LC 116 OU se o prestador for de outro município e não tiver CPOM (e for exigido)
  let exigeRetencao = ehExcecaoLc116;
  let localDevido: 'MUNICIPIO_DO_TOMADOR_RETENCAO_OBRIGATORIA' | 'MUNICIPIO_DO_PRESTADOR_SEM_RETENCAO' = 'MUNICIPIO_DO_PRESTADOR_SEM_RETENCAO';

  if (ehExcecaoLc116 || (prestadorMunicipioIbge !== tomadorMunicipioIbge && !prestadorInscritoCpomTomador)) {
    exigeRetencao = true;
    localDevido = 'MUNICIPIO_DO_TOMADOR_RETENCAO_OBRIGATORIA';
  }

  let aliquota = 5.0; // Padrão municipal
  if (prestadorOptanteSimplesNacional && aliquotaSimplesDeclaradaPercent > 0) {
    aliquota = aliquotaSimplesDeclaradaPercent;
  }

  const valorIss = exigeRetencao ? (valorBrutoServicoBrl * aliquota) / 100 : 0;
  const valorLiquido = valorBrutoServicoBrl - valorIss;

  const diag = "Auditoria ISSQN Tomador (" + prestadorRazaoSocial + " - LC 116 Item " + codigoServicoLc116 + "): Valor Bruto: R$ " + valorBrutoServicoBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " | Retenção: " + (exigeRetencao ? "SIM (" + aliquota + "% = R$ " + valorIss.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ")" : "NÃO (Devido no Prestador)") + " | Líquido a Pagar: R$ " + valorLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ".";

  return Ok({
    clienteTomadorCnpj,
    prestadorRazaoSocial,
    localDevidoIss: localDevido,
    exigeRetencaoIssTomador: exigeRetencao,
    aliquotaIssAplicadaPercent: aliquota,
    valorIssRetidoBrl: parseFloat(valorIss.toFixed(2)),
    valorLiquidoAPagarAoPrestadorBrl: parseFloat(valorLiquido.toFixed(2)),
    statusIssqn: 'ISS_TOMADOR_AUDITADO_COM_SUCESSO',
    diagnosticoIssqn: diag
  });
}
