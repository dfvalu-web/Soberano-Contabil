import { Result, Ok, Err } from '../../types/result.js';

export interface PortTupInput {
  operadorPortuarioCnpj: string;
  terminalNome: string;
  tipoOutorga: 'TERMINAL_USO_PRIVADO_TUP' | 'ARRENDAMENTO_PORTUARIO_PUBLICO_ANTAQ';
  valorArrendamentoMensalBrl: number; // Ex: R$ 500.000,00
  prazoContratoMeses: number; // Ex: 240 meses (20 anos)
  taxaDescontoAnualPercent: number; // Ex: 9.0% a.a.
}

export interface PortTupResult {
  operadorPortuarioCnpj: string;
  terminalNome: string;
  valorAtivoDireitoUsoPortuarioBrl: number; // VP dos fluxos IFRS 16
  passivoArrendamentoInicialBrl: number;
  despesaMensalAmortizacaoBrl: number; // Ex: VP / 240
  statusOutorgaAntaq: 'OUTORGA_PORTUARIA_HOMOLOGADA_ANTAQ_LEI_12815';
  diagnosticoPortuario: string;
}

export function processPortTupCustomsTaxEngine(input: PortTupInput): Result<PortTupResult, Error> {
  const {
    operadorPortuarioCnpj,
    terminalNome,
    tipoOutorga,
    valorArrendamentoMensalBrl,
    prazoContratoMeses,
    taxaDescontoAnualPercent
  } = input;

  if (!operadorPortuarioCnpj || valorArrendamentoMensalBrl <= 0 || prazoContratoMeses <= 0) {
    return Err(new Error('CNPJ, valor do arrendamento mensal e prazo do contrato são obrigatórios.'));
  }

  // Cálculo simplificado de Valor Presente IFRS 16 para o Direito de Uso Portuário
  const taxaMensal = (taxaDescontoAnualPercent / 100) / 12;
  const vp = valorArrendamentoMensalBrl * ((1 - Math.pow(1 + taxaMensal, -prazoContratoMeses)) / taxaMensal);
  const amortizacaoMensal = vp / prazoContratoMeses;

  const diag = "Operacao Portuaria (Lei 12.815/13): Terminal " + terminalNome + " (" + tipoOutorga + ") | Arrendamento Mensal: R$ " + valorArrendamentoMensalBrl.toLocaleString('pt-BR') + " | Ativo Direito de Uso (IFRS 16): R$ " + vp.toLocaleString('pt-BR') + " | Amortizacao Mensal: R$ " + amortizacaoMensal.toLocaleString('pt-BR') + " -> Homologado ANTAQ.";

  return Ok({
    operadorPortuarioCnpj,
    terminalNome,
    valorAtivoDireitoUsoPortuarioBrl: parseFloat(vp.toFixed(2)),
    passivoArrendamentoInicialBrl: parseFloat(vp.toFixed(2)),
    despesaMensalAmortizacaoBrl: parseFloat(amortizacaoMensal.toFixed(2)),
    statusOutorgaAntaq: 'OUTORGA_PORTUARIA_HOMOLOGADA_ANTAQ_LEI_12815',
    diagnosticoPortuario: diag
  });
}
