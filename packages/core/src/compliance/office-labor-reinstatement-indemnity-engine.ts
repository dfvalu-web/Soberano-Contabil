import { Result, Ok, Err } from '../types/result.js';

export interface LaborIndemnityInput {
  empregadoCpf: string;
  empregadoNome: string;
  salarioBaseMensalBrl: number;
  mesesRestantesEstabilidade: number;
  decisaoEmpresa: 'REINTEGRACAO_AO_EMPREGO' | 'PAGAMENTO_INDENIZACAO_SUBSTITUTIVA';
}

export interface LaborIndemnityResult {
  empregadoCpf: string;
  empregadoNome: string;
  mesesRestantesEstabilidade: number;
  totalSalariosIndenizadosBrl: number;
  reflexo13SalarioBrl: number;
  reflexoFeriasComTercoBrl: number;
  reflexoFgtsComMulta40Brl: number;
  totalPassivoIndenizatorioBrl: number;
  statusProcessamento: 'INDENIZACAO_ESTABILITARIA_APURADA';
  diagnosticoIndenizacao: string;
}

export function processOfficeLaborReinstatementIndemnityEngine(input: LaborIndemnityInput): Result<LaborIndemnityResult, Error> {
  const {
    empregadoCpf,
    empregadoNome,
    salarioBaseMensalBrl,
    mesesRestantesEstabilidade,
    decisaoEmpresa
  } = input;

  if (!empregadoCpf || salarioBaseMensalBrl <= 0 || mesesRestantesEstabilidade <= 0) {
    return Err(new Error('CPF, salário base e meses restantes de estabilidade são obrigatórios.'));
  }

  const salarios = salarioBaseMensalBrl * mesesRestantesEstabilidade;
  const decimoTerceiro = (salarioBaseMensalBrl * mesesRestantesEstabilidade) / 12;
  const feriasTerco = ((salarioBaseMensalBrl * mesesRestantesEstabilidade) / 12) * 1.3333;
  const fgts = salarios * 0.08;
  const multa40 = fgts * 0.40;
  const totalFgts = fgts + multa40;

  const totalPassivo = salarios + decimoTerceiro + feriasTerco + totalFgts;

  const diag = "Indenização Estabilitária (" + empregadoNome + "): " + mesesRestantesEstabilidade + " meses de estabilidade | Salários: R$ " + salarios.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " | Total com Reflexos (13º, Férias + 1/3 e FGTS 40%): R$ " + totalPassivo.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " | Opção: " + decisaoEmpresa + ".";

  return Ok({
    empregadoCpf,
    empregadoNome,
    mesesRestantesEstabilidade,
    totalSalariosIndenizadosBrl: parseFloat(salarios.toFixed(2)),
    reflexo13SalarioBrl: parseFloat(decimoTerceiro.toFixed(2)),
    reflexoFeriasComTercoBrl: parseFloat(feriasTerco.toFixed(2)),
    reflexoFgtsComMulta40Brl: parseFloat(totalFgts.toFixed(2)),
    totalPassivoIndenizatorioBrl: parseFloat(totalPassivo.toFixed(2)),
    statusProcessamento: 'INDENIZACAO_ESTABILITARIA_APURADA',
    diagnosticoIndenizacao: diag
  });
}
