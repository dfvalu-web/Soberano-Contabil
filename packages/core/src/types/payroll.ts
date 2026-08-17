export type TerminationType = 
  | 'DEMISSAO_SEM_JUSTA_CAUSA'
  | 'PEDIDO_DEMISSAO'
  | 'DEMISSAO_COM_JUSTA_CAUSA'
  | 'ACORDO_MUTUO_ART_484_A'
  | 'TERMINO_CONTRATO_EXPERIENCIA';

export interface PayrollInput {
  salarioBase: number;
  dependentesIrrf: number;
  pensaoAlimenticia?: number;
  horasExtras50Percent?: number; // Quantidade de horas
  horasExtras100Percent?: number;
  valorHoraNormal?: number;
  adicionalNoturnoHoras?: number;
  adicionalInsalubridadeGrau?: 'MINIMO' | 'MEDIO' | 'MAXIMO' | 'NENHUM'; // 10%, 20%, 40%
  adicionalPericulosidade?: boolean; // 30%
  descontoValeTransportePercent?: number; // até 6%
  outrosProventos?: number;
  outrosDescontos?: number;
  optanteAdiantamento13?: boolean;
}

export interface PayrollResult {
  proventos: {
    salarioBase: number;
    horasExtras: number;
    dsrHorasExtras: number;
    adicionalNoturno: number;
    adicionalInsalubridade: number;
    adicionalPericulosidade: number;
    outros: number;
    totalBruto: number;
  };
  descontos: {
    inss: number;
    aliquotaEfetivaInss: number;
    irrf: number;
    aliquotaEfetivaIrrf: number;
    usaDeducaoSimplificadaIrrf: boolean;
    valeTransporte: number;
    pensaoAlimenticia: number;
    outros: number;
    totalDescontos: number;
  };
  salarioLiquido: number;
  encargosPatronais: {
    fgtsMensal8Percent: number;
    inssPatronal20Percent: number;
    ratFap: number;
    terceirosOutrasEntidades5_8Percent: number;
    provisao13Salario: number;
    provisaoFeriasUmTerco: number;
    custoTotalEmpregador: number;
  };
}

export interface TerminationInput {
  tipo: TerminationType;
  dataAdmissao: string; // YYYY-MM-DD
  dataDemissao: string; // YYYY-MM-DD
  salarioBase: number;
  motivoAvisoPrevio: 'INDENIZADO' | 'TRABALHADO' | 'DISPENSADO';
  saldoFgtsAcumulado: number;
  mesesTrabalhadosAnoCorrente: number;
  diasSaldoSalario: number;
  feriasVencidas: boolean;
  faltasInjustificadasPeriodoAquisitivo?: number;
}

export interface TerminationResult {
  tipo: TerminationType;
  diasAvisoPrevioTotal: number;
  verbasRescisorias: {
    saldoSalario: number;
    avisoPrevioIndenizado: number;
    decimoTerceiroProporcional: number;
    decimoTerceiroAvisoIndenizado: number;
    feriasProporcionais: number;
    tercoConstitucionalFeriasProporcionais: number;
    feriasVencidas: number;
    tercoConstitucionalFeriasVencidas: number;
    totalBrutoRescisao: number;
  };
  deducoes: {
    inssSobreSaldoSalario: number;
    inssSobre13Salario: number;
    irrfRescisao: number;
    totalDeducoes: number;
  };
  liquidoRescisao: number;
  fgts: {
    multaRescisoriaFgts: number; // 40% ou 20%
    percentualMulta: number;
    saldoFgtsLiberadoSaque: number;
    permiteSeguroDesemprego: boolean;
  };
}
