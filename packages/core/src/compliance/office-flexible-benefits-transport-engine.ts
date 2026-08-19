import { Result, Ok, Err } from '../types/result.js';

export interface TransportBenefitInput {
  funcionarioCpf: string;
  nomeFuncionario: string;
  salarioBaseBrl: number;
  custoTotalPassagensMensalBrl: number; // Ex: 22 dias x R$ 20,00 = R$ 440,00
  optouReceberValeTransporte: boolean;
}

export interface TransportBenefitResult {
  funcionarioCpf: string;
  nomeFuncionario: string;
  custoTotalPassagensBrl: number;
  tetoMaximoDesconto6PercentBrl: number;
  valorDescontoEmpregadoFolhaBrl: number;
  valorCusteioPatronalEmpresaBrl: number;
  rubricaEsocialDescontoVt: '5004_DESCONTO_VALE_TRANSPORTE';
  isencaoEncargosPrevidenciariosFgts: boolean;
  statusApuracao: 'VALE_TRANSPORTE_APURADO_COM_SUCESSO';
  diagnosticoVt: string;
}

export function processOfficeFlexibleBenefitsTransportEngine(input: TransportBenefitInput): Result<TransportBenefitResult, Error> {
  const {
    funcionarioCpf,
    nomeFuncionario,
    salarioBaseBrl,
    custoTotalPassagensMensalBrl,
    optouReceberValeTransporte
  } = input;

  if (!funcionarioCpf || salarioBaseBrl <= 0) {
    return Err(new Error('CPF e salário base do funcionário são obrigatórios.'));
  }

  if (!optouReceberValeTransporte || custoTotalPassagensMensalBrl <= 0) {
    return Ok({
      funcionarioCpf,
      nomeFuncionario,
      custoTotalPassagensBrl: 0,
      tetoMaximoDesconto6PercentBrl: 0,
      valorDescontoEmpregadoFolhaBrl: 0,
      valorCusteioPatronalEmpresaBrl: 0,
      rubricaEsocialDescontoVt: '5004_DESCONTO_VALE_TRANSPORTE',
      isencaoEncargosPrevidenciariosFgts: true,
      statusApuracao: 'VALE_TRANSPORTE_APURADO_COM_SUCESSO',
      diagnosticoVt: "Funcionário " + nomeFuncionario + " não optou pelo Vale-Transporte (Declaração de Renúncia arquivada)."
    });
  }

  const teto6Percent = (salarioBaseBrl * 6.0) / 100;
  // Desconto é o menor entre 6% do salário base e o custo real das passagens
  const descontoEmpregado = Math.min(teto6Percent, custoTotalPassagensMensalBrl);
  const custeioEmpresa = Math.max(0, custoTotalPassagensMensalBrl - descontoEmpregado);

  const diag = "Vale-Transporte (" + nomeFuncionario + "): Salário Base: R$ " + salarioBaseBrl.toFixed(2) + " | Custo Total VT: R$ " + custoTotalPassagensMensalBrl.toFixed(2) + " | Teto 6%: R$ " + teto6Percent.toFixed(2) + " | Desconto Empregado: R$ " + descontoEmpregado.toFixed(2) + " | Custeio Empresa: R$ " + custeioEmpresa.toFixed(2) + " | Sem incidência de INSS/FGTS (Lei 7.418/85).";

  return Ok({
    funcionarioCpf,
    nomeFuncionario,
    custoTotalPassagensBrl: parseFloat(custoTotalPassagensMensalBrl.toFixed(2)),
    tetoMaximoDesconto6PercentBrl: parseFloat(teto6Percent.toFixed(2)),
    valorDescontoEmpregadoFolhaBrl: parseFloat(descontoEmpregado.toFixed(2)),
    valorCusteioPatronalEmpresaBrl: parseFloat(custeioEmpresa.toFixed(2)),
    rubricaEsocialDescontoVt: '5004_DESCONTO_VALE_TRANSPORTE',
    isencaoEncargosPrevidenciariosFgts: true,
    statusApuracao: 'VALE_TRANSPORTE_APURADO_COM_SUCESSO',
    diagnosticoVt: diag
  });
}
