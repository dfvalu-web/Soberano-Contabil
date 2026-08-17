import { Result, Ok, Err } from '../../types/result.js';

export interface ForeignCapitalGainInput {
  investidorBrasilCnpj: string;
  jurisdicaoAtivoAlienado: string;
  valorAlienacaoUsd: number; // Ex: 15.000.000 USD
  custoAquisicaoHistoricoUsd: number; // Ex: 10.000.000 USD
  taxaCambioDataAlienacaoBrl: number; // Ex: 5.60
  aliquotaIrpjCsllPercent: number; // 34.0%
}

export interface ForeignCapitalGainResult {
  investidorBrasilCnpj: string;
  jurisdicaoAtivoAlienado: string;
  ganhoCapitalMoedaEstrangeiraUsd: number; // 5.000.000 USD
  ganhoCapitalTributavelBrl: number; // R$ 28.000.000,00
  impostoDevidoIrpjCsllBrl: number; // R$ 9.520.000,00
  statusGanhoCapital: 'GANHO_CAPITAL_EXTERIOR_APURADO_LEI_12973';
  diagnosticoGanho: string;
}

export function processForeignAssetCapitalGainTaxEngine(input: ForeignCapitalGainInput): Result<ForeignCapitalGainResult, Error> {
  const {
    investidorBrasilCnpj,
    jurisdicaoAtivoAlienado,
    valorAlienacaoUsd,
    custoAquisicaoHistoricoUsd,
    taxaCambioDataAlienacaoBrl,
    aliquotaIrpjCsllPercent = 34.0
  } = input;

  if (!investidorBrasilCnpj || taxaCambioDataAlienacaoBrl <= 0) {
    return Err(new Error('CNPJ e taxa de câmbio na data de alienação são obrigatórios.'));
  }

  const ganhoUsd = Math.max(0, valorAlienacaoUsd - custoAquisicaoHistoricoUsd);
  const ganhoBrl = ganhoUsd * taxaCambioDataAlienacaoBrl;
  const impostoBrl = (ganhoBrl * aliquotaIrpjCsllPercent) / 100;

  const diag = "Ganho de Capital no Exterior (Art. 21 Lei 12.973/14): Alienacao em " + jurisdicaoAtivoAlienado + " | Ganho USD: " + ganhoUsd.toLocaleString('en-US') + " | Ganho Tributavel BRL: R$ " + ganhoBrl.toLocaleString('pt-BR') + " -> IRPJ/CSLL Devido: R$ " + impostoBrl.toLocaleString('pt-BR');

  return Ok({
    investidorBrasilCnpj,
    jurisdicaoAtivoAlienado,
    ganhoCapitalMoedaEstrangeiraUsd: ganhoUsd,
    ganhoCapitalTributavelBrl: ganhoBrl,
    impostoDevidoIrpjCsllBrl: impostoBrl,
    statusGanhoCapital: 'GANHO_CAPITAL_EXTERIOR_APURADO_LEI_12973',
    diagnosticoGanho: diag
  });
}
