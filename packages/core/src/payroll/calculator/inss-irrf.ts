export const SALARIO_MINIMO_2026 = 1518.00;
export const TETO_INSS_2026 = 8157.41;
export const DEDUCAO_POR_DEPENDENTE_IRRF = 189.59;
export const DEDUCAO_SIMPLIFICADA_IRRF = 564.80; // 25% da faixa de isenção

// Tabela Progressiva INSS 2026
export const FAIXAS_INSS_2026 = [
  { limite: 1518.00, aliquota: 0.075 },
  { limite: 2793.88, aliquota: 0.090 },
  { limite: 4190.83, aliquota: 0.120 },
  { limite: 8157.41, aliquota: 0.140 }
];

export function calculateInss(salarioBruto: number): { inssTotal: number; aliquotaEfetiva: number } {
  if (salarioBruto <= 0) return { inssTotal: 0, aliquotaEfetiva: 0 };

  const salarioApurado = Math.min(salarioBruto, TETO_INSS_2026);
  let inssAcumulado = 0;
  let limiteAnterior = 0;

  for (const faixa of FAIXAS_INSS_2026) {
    if (salarioApurado > limiteAnterior) {
      const baseFaixa = Math.min(salarioApurado, faixa.limite) - limiteAnterior;
      inssAcumulado += baseFaixa * faixa.aliquota;
      limiteAnterior = faixa.limite;
    }
  }

  const inssTotal = Number(inssAcumulado.toFixed(2));
  const aliquotaEfetiva = Number(((inssTotal / salarioBruto) * 100).toFixed(2));
  return { inssTotal, aliquotaEfetiva };
}

// Tabela Progressiva IRRF 2026
export const FAIXAS_IRRF_2026 = [
  { limite: 2259.20, aliquota: 0.000, deducao: 0.00 },
  { limite: 2826.65, aliquota: 0.075, deducao: 169.44 },
  { limite: 3751.05, aliquota: 0.150, deducao: 381.44 },
  { limite: 4664.68, aliquota: 0.225, deducao: 662.77 },
  { limite: Infinity, aliquota: 0.275, deducao: 896.00 }
];

export function calculateIrrf(
  salarioBruto: number,
  inssDescontado: number,
  dependentes: number = 0,
  pensaoAlimenticia: number = 0
): { irrfTotal: number; aliquotaEfetiva: number; usaDeducaoSimplificada: boolean } {
  
  // Opção 1: Deduções Legais (INSS + Dependentes + Pensão)
  const deducaoDependentes = dependentes * DEDUCAO_POR_DEPENDENTE_IRRF;
  const baseCalculoLegal = Math.max(0, salarioBruto - inssDescontado - deducaoDependentes - pensaoAlimenticia);

  // Opção 2: Desconto Simplificado (substitui todas as deduções)
  const baseCalculoSimplificada = Math.max(0, salarioBruto - DEDUCAO_SIMPLIFICADA_IRRF);

  // Aplica tabela nas duas opções e escolhe a mais vantajosa para o trabalhador
  const calcFaixa = (base: number) => {
    for (const f of FAIXAS_IRRF_2026) {
      if (base <= f.limite) {
        return Math.max(0, Number((base * f.aliquota - f.deducao).toFixed(2)));
      }
    }
    return 0;
  };

  const impostoLegal = calcFaixa(baseCalculoLegal);
  const impostoSimplificado = calcFaixa(baseCalculoSimplificada);

  const usaDeducaoSimplificada = impostoSimplificado < impostoLegal;
  const irrfTotal = usaDeducaoSimplificada ? impostoSimplificado : impostoLegal;
  const aliquotaEfetiva = salarioBruto > 0 ? Number(((irrfTotal / salarioBruto) * 100).toFixed(2)) : 0;

  return { irrfTotal, aliquotaEfetiva, usaDeducaoSimplificada };
}
