import { Result, Ok, Err } from '../../types/result.js';

export interface PortWorkersOgmoInput {
  operadorPortuarioId: string;
  operadorPortuarioNome: string; // Ex: 'Soberano Terminais Portuários S.A.'
  portoNome: string; // Ex: 'Porto de Santos / Paranaguá'
  competencia: string; // Ex: '2026-04'
  quantidadeTrabalhadoresAvulsosTpa: number;
  totalRemuneracaoBrutaTpaBrl: number;
  aliquotaRatPercent?: number; // 3%
  fapAplicavel?: number; // Ex: 1.0000
  aliquotaTerceirosDpcMarinhaPercent?: number; // 2,5% DPC Marinha + Salário Educação/INCRA = 5,2%
}

export interface PortWorkersOgmoResult {
  operadorPortuarioId: string;
  operadorPortuarioNome: string;
  competencia: string;
  totalRemuneracaoBrutaBrl: number;
  contribuicaoPrevidenciariaCpp20PercentBrl: number; // 20%
  ratAjustadoValorBrl: number; // RAT * FAP
  contribuicaoTerceirosOutrasEntidadesBrl: number;
  totalFgtsDevido8PercentBrl: number; // 8%
  totalEncargosPatronaisBrl: number;
  esocialS1270Payload: {
    ideEmpregador: { tpInsc: number; nrInsc: string };
    ideEvento: { indApuracao: number; perApur: string };
    remunAvulso: {
      codPorto: string;
      vlrRemunBruta: number;
      vlrCpp: number;
      vlrRat: number;
      vlrFgts: number;
    };
  };
  diagnosticoFiscalTrabalhista: string;
}

export function processPortWorkersOgmoPayrollS1270(input: PortWorkersOgmoInput): Result<PortWorkersOgmoResult, Error> {
  const {
    operadorPortuarioId,
    operadorPortuarioNome,
    portoNome,
    competencia,
    quantidadeTrabalhadoresAvulsosTpa,
    totalRemuneracaoBrutaTpaBrl,
    aliquotaRatPercent = 3.0,
    fapAplicavel = 1.0,
    aliquotaTerceirosDpcMarinhaPercent = 5.2
  } = input;

  if (totalRemuneracaoBrutaTpaBrl <= 0 || quantidadeTrabalhadoresAvulsosTpa <= 0) {
    return Err(new Error('Remuneração bruta e quantidade de TPAs devem ser superiores a zero.'));
  }

  // Lei nº 12.815/2013 e eSocial Evento S-1270:
  // 1. CPP Patronal = 20% sobre o total da remuneração bruta paga aos avulsos portuários
  const cpp = Number((totalRemuneracaoBrutaTpaBrl * 0.20).toFixed(2));

  // 2. RAT Ajustado = RAT * FAP
  const aliquotaRatAjustada = (aliquotaRatPercent / 100) * fapAplicavel;
  const rat = Number((totalRemuneracaoBrutaTpaBrl * aliquotaRatAjustada).toFixed(2));

  // 3. Terceiros / Outras Entidades (DPC Marinha, Salário-Educação, INCRA, SEST/SENAT)
  const terceiros = Number((totalRemuneracaoBrutaTpaBrl * (aliquotaTerceirosDpcMarinhaPercent / 100)).toFixed(2));

  // 4. FGTS = 8% sobre a remuneração bruta
  const fgts = Number((totalRemuneracaoBrutaTpaBrl * 0.08).toFixed(2));

  const totalEncargos = Number((cpp + rat + terceiros + fgts).toFixed(2));

  const esocialPayload = {
    ideEmpregador: { tpInsc: 1, nrInsc: '00000000000191' },
    ideEvento: { indApuracao: 1, perApur: competencia },
    remunAvulso: {
      codPorto: portoNome,
      vlrRemunBruta: totalRemuneracaoBrutaTpaBrl,
      vlrCpp: cpp,
      vlrRat: rat,
      vlrFgts: fgts
    }
  };

  const diag = "Trabalho Portuario Avulso OGMO (Lei 12.815/13 & eSocial S-1270): " + operadorPortuarioNome + " (" + portoNome + "). " + quantidadeTrabalhadoresAvulsosTpa + " TPAs | Remuneracao Bruta: R$ " + totalRemuneracaoBrutaTpaBrl.toFixed(2) + ". ENCARGOS: CPP (20%) R$ " + cpp.toFixed(2) + " + RAT Ajustado R$ " + rat.toFixed(2) + " + Terceiros R$ " + terceiros.toFixed(2) + " + FGTS (8%) R$ " + fgts.toFixed(2) + " = Total R$ " + totalEncargos.toFixed(2) + ". Evento S-1270 gerado.";

  return Ok({
    operadorPortuarioId,
    operadorPortuarioNome,
    competencia,
    totalRemuneracaoBrutaBrl: totalRemuneracaoBrutaTpaBrl,
    contribuicaoPrevidenciariaCpp20PercentBrl: cpp,
    ratAjustadoValorBrl: rat,
    contribuicaoTerceirosOutrasEntidadesBrl: terceiros,
    totalFgtsDevido8PercentBrl: fgts,
    totalEncargosPatronaisBrl: totalEncargos,
    esocialS1270Payload: esocialPayload,
    diagnosticoFiscalTrabalhista: diag
  });
}
