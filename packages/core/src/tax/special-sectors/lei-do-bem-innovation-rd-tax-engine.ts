import { Result, Ok, Err } from '../../types/result.js';

export interface LeiDoBemInput {
  empresaCnpj: string;
  anoCalendario: number;
  totalDispendiosPdOperacionaisBrl: number; // Ex: R$ 2.000.000,00
  houveIncrementoPesquisadoresAcima5Percent: boolean; // Eleva exclusão para 70% ou 80%
  obtevePatenteRegistradaNoAno: boolean; // Eleva exclusão para 80%
  lucroRealAntesDoIncentivoBrl: number; // Ex: R$ 5.000.000,00
}

export interface LeiDoBemResult {
  empresaCnpj: string;
  anoCalendario: number;
  totalDispendiosPdOperacionaisBrl: number;
  percentualExclusaoLalurPercent: number; // 60%, 70% ou 80%
  valorExclusaoLalurBrl: number;
  economiaTributariaIrpjCsllBrl: number; // 34% (25% IRPJ + 9% CSLL)
  lucroRealAjustadoAposIncentivoBrl: number;
  escrituracaoEcfBlocoM300: {
    codigoLancamentoLalur: string;
    historico: string;
    valorExclusao: number;
  };
  diagnosticoLeiDoBem: string;
}

export function processLeiDoBemInnovationRdTaxEngine(input: LeiDoBemInput): Result<LeiDoBemResult, Error> {
  const {
    empresaCnpj,
    anoCalendario,
    totalDispendiosPdOperacionaisBrl,
    houveIncrementoPesquisadoresAcima5Percent,
    obtevePatenteRegistradaNoAno,
    lucroRealAntesDoIncentivoBrl
  } = input;

  if (totalDispendiosPdOperacionaisBrl <= 0 || lucroRealAntesDoIncentivoBrl <= 0) {
    return Err(new Error('Dispêndios de P&D e Lucro Real devem ser positivos.'));
  }

  // Definição do percentual de exclusão conforme Art. 19 da Lei 11.196/2005:
  // Base: 60% | Incremento > 5% pesquisadores: 70% ou 80% se > 10% | Patente: +20% (até 80%)
  let percentualExclusao = 60;
  if (obtevePatenteRegistradaNoAno || (houveIncrementoPesquisadoresAcima5Percent && obtevePatenteRegistradaNoAno)) {
    percentualExclusao = 80;
  } else if (houveIncrementoPesquisadoresAcima5Percent) {
    percentualExclusao = 70;
  }

  const valorExclusao = Number((totalDispendiosPdOperacionaisBrl * (percentualExclusao / 100)).toFixed(2));
  const economiaFiscal = Number((valorExclusao * 0.34).toFixed(2)); // 34% de IRPJ + CSLL
  const lucroAjustado = Number((lucroRealAntesDoIncentivoBrl - valorExclusao).toFixed(2));

  const diag = "Incentivo Fiscal Lei do Bem (Lei 11.196/05): CNPJ " + empresaCnpj + " (" + anoCalendario + ") | Dispendios P&D: R$ " + totalDispendiosPdOperacionaisBrl.toFixed(2) + " -> Exclusao Lalur (" + percentualExclusao + "%): R$ " + valorExclusao.toFixed(2) + " | Economia Tributaria Real (34% IRPJ/CSLL): R$ " + economiaFiscal.toFixed(2) + " | Lucro Real Ajustado: R$ " + lucroAjustado.toFixed(2) + ".";

  return Ok({
    empresaCnpj,
    anoCalendario,
    totalDispendiosPdOperacionaisBrl,
    percentualExclusaoLalurPercent: percentualExclusao,
    valorExclusaoLalurBrl: valorExclusao,
    economiaTributariaIrpjCsllBrl: economiaFiscal,
    lucroRealAjustadoAposIncentivoBrl: lucroAjustado,
    escrituracaoEcfBlocoM300: {
      codigoLancamentoLalur: 'M300_EXCLUSAO_LEI_DO_BEM_ART19',
      historico: 'Exclusão de dispêndios de inovação tecnológica e P&D Lei 11.196/05 (' + percentualExclusao + '%)',
      valorExclusao: valorExclusao
    },
    diagnosticoLeiDoBem: diag
  });
}
