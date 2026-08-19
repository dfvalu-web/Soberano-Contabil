import { Result, Ok, Err } from '../../types/result.js';

export interface MultipropriedadeRetInput {
  incorporadoraCnpj: string;
  empreendimentoNome: string;
  numeroTotalFracoesTempo: number; // Ex: 520 frações (26 frações por unidade x 20 aptos)
  receitaMensalRecebiveisFracoesBrl: number; // Ex: R$ 3.000.000,00
  patrimonioAfetacaoAverbado: boolean; // Obrigatório para RET 4%
  aliquotaRetUnificadaPercent: number; // 4.0%
}

export interface MultipropriedadeRetResult {
  incorporadoraCnpj: string;
  empreendimentoNome: string;
  receitaMensalRecebiveisFracoesBrl: number;
  impostoRetUnificadoDevidoBrl: number; // 4% de R$ 3.000.000,00 = R$ 120.000,00
  discriminacaoTributosRet: {
    irpjBrl: number; // 1.71% -> R$ 51.300,00
    csllBrl: number; // 0.86% -> R$ 25.800,00
    pisBrl: number;  // 0.37% -> R$ 11.100,00
    cofinsBrl: number; // 1.06% -> R$ 31.800,00
  };
  statusEnquadramentoRet: 'ENQUADRADO_RET_4_PERCENT_PATRIMONIO_AFETACAO';
  diagnosticoMultipropriedade: string;
}

export function processFractionalOwnershipMultipropriedadeRetEngine(input: MultipropriedadeRetInput): Result<MultipropriedadeRetResult, Error> {
  const {
    incorporadoraCnpj,
    empreendimentoNome,
    numeroTotalFracoesTempo,
    receitaMensalRecebiveisFracoesBrl,
    patrimonioAfetacaoAverbado,
    aliquotaRetUnificadaPercent = 4.0
  } = input;

  if (!incorporadoraCnpj || receitaMensalRecebiveisFracoesBrl <= 0 || numeroTotalFracoesTempo <= 0) {
    return Err(new Error('CNPJ, receita de frações e total de frações de tempo são obrigatórios.'));
  }

  if (!patrimonioAfetacaoAverbado) {
    return Err(new Error('Para fruição do RET de 4%, o Patrimônio de Afetação deve estar formalmente averbado na matrícula imobiliária.'));
  }

  const retTotal = (receitaMensalRecebiveisFracoesBrl * aliquotaRetUnificadaPercent) / 100;
  const irpj = (receitaMensalRecebiveisFracoesBrl * 1.71) / 100;
  const csll = (receitaMensalRecebiveisFracoesBrl * 0.86) / 100;
  const pis = (receitaMensalRecebiveisFracoesBrl * 0.37) / 100;
  const cofins = (receitaMensalRecebiveisFracoesBrl * 1.06) / 100;

  const diag = "Multipropriedade Imobiliaria (Lei 13.777/18): Empreendimento " + empreendimentoNome + " (" + numeroTotalFracoesTempo + " fracoes) | Receita: R$ " + receitaMensalRecebiveisFracoesBrl.toLocaleString('pt-BR') + " | RET Unificado (4%): R$ " + retTotal.toLocaleString('pt-BR') + " (IRPJ: R$ " + irpj.toLocaleString('pt-BR') + ", CSLL: R$ " + csll.toLocaleString('pt-BR') + ", PIS: R$ " + pis.toLocaleString('pt-BR') + ", COFINS: R$ " + cofins.toLocaleString('pt-BR') + ") -> Afetação 100% Homologada.";

  return Ok({
    incorporadoraCnpj,
    empreendimentoNome,
    receitaMensalRecebiveisFracoesBrl,
    impostoRetUnificadoDevidoBrl: parseFloat(retTotal.toFixed(2)),
    discriminacaoTributosRet: {
      irpjBrl: parseFloat(irpj.toFixed(2)),
      csllBrl: parseFloat(csll.toFixed(2)),
      pisBrl: parseFloat(pis.toFixed(2)),
      cofinsBrl: parseFloat(cofins.toFixed(2))
    },
    statusEnquadramentoRet: 'ENQUADRADO_RET_4_PERCENT_PATRIMONIO_AFETACAO',
    diagnosticoMultipropriedade: diag
  });
}
