import { Result, Ok, Err } from '../../types/result.js';

export interface BenfordDigitStat {
  digito: number;
  frequenciaObservadaCount: number;
  frequenciaObservadaPercent: number;
  frequenciaEsperadaBenfordPercent: number;
  desvioPercent: number;
}

export interface ForensicAuditReport {
  totalAmostrasAnalisadas: number;
  desvioMedioAbsolutoMad: number;
  grauConformidadeEstatistica: 'ALTA_CONFORMIDADE' | 'CONFORMIDADE_ACEITAVEL' | 'DESVIO_MODERADO' | 'ALTO_RISCO_ANOMALIA';
  distribuicaoPorDigito: BenfordDigitStat[];
  alertasForenses: string[];
}

export function runBenfordForensicAudit(valoresMonetarios: number[]): Result<ForensicAuditReport, Error> {
  const valoresValidos = valoresMonetarios.filter(v => Math.abs(v) >= 1.00);

  if (valoresValidos.length < 10) {
    return Err(new Error('Amostra insuficiente para teste forense de Benford (mínimo 10 valores).'));
  }

  const contagemDigitos: number[] = Array(10).fill(0);

  for (const v of valoresValidos) {
    const strValor = Math.abs(v).toString().replace(/^0+/, '').replace('.', '');
    const primeiroDigito = parseInt(strValor[0] || '1', 10);
    if (primeiroDigito >= 1 && primeiroDigito <= 9) {
      contagemDigitos[primeiroDigito]++;
    }
  }

  const distribuicao: BenfordDigitStat[] = [];
  let somaDesvios = 0;
  const alertas: string[] = [];

  for (let d = 1; d <= 9; d++) {
    const contagem = contagemDigitos[d] || 0;
    const freqObservada = Number(((contagem / valoresValidos.length) * 100).toFixed(2));
    const freqEsperada = Number((Math.log10(1 + 1 / d) * 100).toFixed(2));
    const desvio = Number((freqObservada - freqEsperada).toFixed(2));
    somaDesvios += Math.abs(desvio);

    if (Math.abs(desvio) > 15.0) {
      alertas.push(`Anomalia estatística severa no dígito ${d}: frequência observada (${freqObservada}%) desvia significativamente do padrão natural de Benford (${freqEsperada}%).`);
    }

    distribuicao.push({
      digito: d,
      frequenciaObservadaCount: contagem,
      frequenciaObservadaPercent: freqObservada,
      frequenciaEsperadaBenfordPercent: freqEsperada,
      desvioPercent: desvio
    });
  }

  const mad = Number((somaDesvios / 9).toFixed(2));
  let grau: ForensicAuditReport['grauConformidadeEstatistica'] = 'ALTA_CONFORMIDADE';

  if (mad > 12.0) grau = 'ALTO_RISCO_ANOMALIA';
  else if (mad > 8.0) grau = 'DESVIO_MODERADO';
  else if (mad > 4.0) grau = 'CONFORMIDADE_ACEITAVEL';

  return Ok({
    totalAmostrasAnalisadas: valoresValidos.length,
    desvioMedioAbsolutoMad: mad,
    grauConformidadeEstatistica: grau,
    distribuicaoPorDigito: distribuicao,
    alertasForenses: alertas
  });
}
