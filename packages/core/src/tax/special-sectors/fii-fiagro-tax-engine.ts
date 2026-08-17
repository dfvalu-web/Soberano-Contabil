import { Result, Ok, Err } from '../../types/result.js';

export interface FiiTaxCalculationInput {
  fundoId: string;
  nomeFundo: string;
  tipoFundo: 'FII_IMOBILIARIO' | 'FIAGRO_AGRONEGOCIO';
  lucroCaixaSemestralApuradoBrl: number;
  totalCotistasCadastrados: number;
  cotasNegociadasEmBolsa: boolean;
  alienacaoCotasGanhoCapitalBrl?: number;
}

export interface FiiTaxCalculationResult {
  fundoId: string;
  tipoFundo: string;
  distribuicaoObrigatoria95PercentBrl: number;
  cotistasElegiveisIsencaoIrpf: boolean;
  aliquotaIrpfRendimentosPercent: number; // 0% se isento / 20% se tributável
  impostoRendaGanhoCapitalAlienacao20Percent: number;
  diagnosticoFii: string;
}

export function calculateFiiFiagroTaxation(input: FiiTaxCalculationInput): Result<FiiTaxCalculationResult, Error> {
  const { fundoId, nomeFundo, tipoFundo, lucroCaixaSemestralApuradoBrl, totalCotistasCadastrados, cotasNegociadasEmBolsa, alienacaoCotasGanhoCapitalBrl = 0 } = input;

  if (lucroCaixaSemestralApuradoBrl < 0) {
    return Err(new Error('Lucro caixa semestral do fundo não pode ser negativo.'));
  }

  // 1. Distribuição obrigatória de 95% do lucro caixa semestral (Lei nº 8.668/1993)
  const dist95 = Number((lucroCaixaSemestralApuradoBrl * 0.95).toFixed(2));

  // 2. Regra de Isenção de IRPF para cotistas (Lei nº 14.754/2023):
  // - No mínimo 100 cotistas (alterou de 50 para 100)
  // - Cotas admitidas à negociação exclusivamente em bolsa ou mercado de balcão organizado
  const isencaoOk = totalCotistasCadastrados >= 100 && cotasNegociadasEmBolsa;
  const aliquotaRendimentos = isencaoOk ? 0 : 20;

  // 3. Ganho de Capital na alienação de cotas (20%)
  const irGanho = Number((Math.max(0, alienacaoCotasGanhoCapitalBrl) * 0.20).toFixed(2));

  const diag = 'Novo Marco dos Fundos (Lei nº 14.754/2023 & Lei nº 8.668/1993): Fundo ' + nomeFundo + ' (' + totalCotistasCadastrados + ' cotistas). Distribuição semestral obrigatória de R$ ' + dist95.toFixed(2) + ' (95%). Rendimentos aos cotistas PF: ' + (isencaoOk ? 'ISENTOS DE IRPF (Atende ao critério de >= 100 cotistas e listagem em bolsa).' : 'TRIBUTADOS a 20% (Não atingiu o requisito de 100 cotistas ou listagem).') + (alienacaoCotasGanhoCapitalBrl > 0 ? ' IR s/ Ganho de Capital de R$ ' + irGanho.toFixed(2) + '.' : '');

  return Ok({
    fundoId,
    tipoFundo,
    distribuicaoObrigatoria95PercentBrl: dist95,
    cotistasElegiveisIsencaoIrpf: isencaoOk,
    aliquotaIrpfRendimentosPercent: aliquotaRendimentos,
    impostoRendaGanhoCapitalAlienacao20Percent: irGanho,
    diagnosticoFii: diag
  });
}
