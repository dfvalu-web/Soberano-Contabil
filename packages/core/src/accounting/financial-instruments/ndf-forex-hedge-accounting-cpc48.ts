import { Result, Ok, Err } from '../../types/result.js';

export interface NdfHedgeInput {
  contratoId: string;
  nocionalUsd: number; // Ex: US$ 1.000.000,00
  taxaTermoContratadaBrl: number; // Ex: R$ 5,20
  taxaSpotFechamentoBrl: number; // Ex: R$ 5,45
  taxaTermoAtualBrl: number; // Ex: R$ 5,50
  objetoProtegido: 'IMPORTACAO_MAQUINAS_PREVISTA' | 'EXPORTACAO_SOJA_RECEBIVEL';
  efetividadeHedgePercent: number; // Ex: 98% (intervalo 80%-125%)
}

export interface NdfHedgeResult {
  contratoId: string;
  nocionalUsd: number;
  valorJustoTotalNdfBrl: number; // Variação total
  parcelaEfetivaPlDraBrl: number; // Outros Resultados Abrangentes (PL)
  parcelaInefetivaDreBrl: number; // Resultado Financeiro (DRE)
  statusEficaciaHedge: 'HEDGE_ALTAMENTE_EFICAZ_CPC48';
  lancamentoContabilSugerido: {
    ativoDerivativoBrl: number;
    reservaHedgePlBrl: number;
    resultadoIneficaciaDreBrl: number;
  };
  diagnosticoCpc48: string;
}

export function processNdfForexHedgeAccountingCpc48(input: NdfHedgeInput): Result<NdfHedgeResult, Error> {
  const {
    contratoId,
    nocionalUsd,
    taxaTermoContratadaBrl,
    taxaTermoAtualBrl,
    objetoProtegido,
    efetividadeHedgePercent
  } = input;

  if (nocionalUsd <= 0 || taxaTermoContratadaBrl <= 0 || taxaTermoAtualBrl <= 0) {
    return Err(new Error('Nocional e taxas cambiais devem ser estritamente positivos.'));
  }

  if (efetividadeHedgePercent < 80 || efetividadeHedgePercent > 125) {
    return Err(new Error('Hedge ineficaz conforme CPC 48: efetividade fora do intervalo de 80% a 125%.'));
  }

  // Valor justo total do derivativo NDF
  const valorJustoTotal = Number(((taxaTermoAtualBrl - taxaTermoContratadaBrl) * nocionalUsd).toFixed(2));
  
  // Parcela efetiva diferida no PL (DRA) e inefetiva na DRE
  const fatorEfetivo = Math.min(1.0, efetividadeHedgePercent / 100);
  const parcelaEfetivaPl = Number((valorJustoTotal * fatorEfetivo).toFixed(2));
  const parcelaInefetivaDre = Number((valorJustoTotal - parcelaEfetivaPl).toFixed(2));

  const diag = "Hedge Accounting NDF (CPC 48 / IFRS 9): Contrato " + contratoId + " | Nocional: US$ " + nocionalUsd.toLocaleString('pt-BR') + " (Taxa: R$ " + taxaTermoContratadaBrl.toFixed(4) + " -> Atual: R$ " + taxaTermoAtualBrl.toFixed(4) + ") | Objeto: " + objetoProtegido + " | Eficacia: " + efetividadeHedgePercent + "% -> Ganho Justo: R$ " + valorJustoTotal.toFixed(2) + " (PL/DRA: R$ " + parcelaEfetivaPl.toFixed(2) + " | Ineficacia DRE: R$ " + parcelaInefetivaDre.toFixed(2) + ").";

  return Ok({
    contratoId,
    nocionalUsd,
    valorJustoTotalNdfBrl: valorJustoTotal,
    parcelaEfetivaPlDraBrl: parcelaEfetivaPl,
    parcelaInefetivaDreBrl: parcelaInefetivaDre,
    statusEficaciaHedge: 'HEDGE_ALTAMENTE_EFICAZ_CPC48',
    lancamentoContabilSugerido: {
      ativoDerivativoBrl: valorJustoTotal,
      reservaHedgePlBrl: parcelaEfetivaPl,
      resultadoIneficaciaDreBrl: parcelaInefetivaDre
    },
    diagnosticoCpc48: diag
  });
}
