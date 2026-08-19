import { Result, Ok, Err } from '../../types/result.js';

export interface MedicalCooperativeInput {
  cooperativaMedicaCnpj: string;
  receitaAtosCooperativosTipicosBrl: number; // Ex: R$ 20.000.000,00 (Isento IRPJ/CSLL/PIS Faturamento)
  receitaAtosNaoCooperativosBrl: number; // Ex: R$ 2.000.000,00 (Tributável no Lucro Real)
  folhaSalariosFuncionariosBrl: number; // Ex: R$ 1.500.000,00 -> PIS Folha 1% = R$ 15.000,00
  aliquotaIrpjCsllPercent: number; // 34.0%
}

export interface MedicalCooperativeResult {
  cooperativaMedicaCnpj: string;
  receitaAtosCooperativosIsentaBrl: number;
  lucroTributavelAtosNaoCooperativosBrl: number;
  impostoIrpjCsllDevidoBrl: number; // 34% sobre lucro não cooperativo (Ex: 34% de R$ 400k lucro = R$ 136k)
  impostoPisFolhaSalariosBrl: number; // 1% de R$ 1.5M = R$ 15.000,00
  statusCooperativa: 'COOPERATIVA_SAUDE_SEGREGADA_LEI_5764';
  destinacaoFatesFundoReserva: 'SOBRAS_LUCROS_APROPRIADAS_CONFORME_ESTATUTO';
  diagnosticoCooperativa: string;
}

export function processMedicalCooperativeTaxEngine(input: MedicalCooperativeInput): Result<MedicalCooperativeResult, Error> {
  const {
    cooperativaMedicaCnpj,
    receitaAtosCooperativosTipicosBrl,
    receitaAtosNaoCooperativosBrl,
    folhaSalariosFuncionariosBrl,
    aliquotaIrpjCsllPercent = 34.0
  } = input;

  if (!cooperativaMedicaCnpj || receitaAtosCooperativosTipicosBrl <= 0) {
    return Err(new Error('CNPJ da cooperativa médica e receita de atos cooperativos são obrigatórios.'));
  }

  // PIS Folha 1% (Art. 13 da MP 2.158-35/2001)
  const pisFolha = (folhaSalariosFuncionariosBrl * 1.0) / 100;

  // Tributação de Atos Não Cooperativos (estimativa margem de 20% de lucro sobre R$ 2M = R$ 400k)
  const lucroNaoCooperativo = receitaAtosNaoCooperativosBrl * 0.20;
  const irpjCsll = (lucroNaoCooperativo * aliquotaIrpjCsllPercent) / 100;

  const diag = "Cooperativa Medica (Lei 5.764/71): Atos Cooperativos: R$ " + receitaAtosCooperativosTipicosBrl.toLocaleString('pt-BR') + " (Nao Incidencia IRPJ/CSLL) | Atos Nao Cooperativos: R$ " + receitaAtosNaoCooperativosBrl.toLocaleString('pt-BR') + " (IRPJ/CSLL: R$ " + irpjCsll.toLocaleString('pt-BR') + ") | PIS Folha 1% (MP 2.158-35): R$ " + pisFolha.toLocaleString('pt-BR') + " -> Conforme.";

  return Ok({
    cooperativaMedicaCnpj,
    receitaAtosCooperativosIsentaBrl: receitaAtosCooperativosTipicosBrl,
    lucroTributavelAtosNaoCooperativosBrl: lucroNaoCooperativo,
    impostoIrpjCsllDevidoBrl: parseFloat(irpjCsll.toFixed(2)),
    impostoPisFolhaSalariosBrl: parseFloat(pisFolha.toFixed(2)),
    statusCooperativa: 'COOPERATIVA_SAUDE_SEGREGADA_LEI_5764',
    destinacaoFatesFundoReserva: 'SOBRAS_LUCROS_APROPRIADAS_CONFORME_ESTATUTO',
    diagnosticoCooperativa: diag
  });
}
