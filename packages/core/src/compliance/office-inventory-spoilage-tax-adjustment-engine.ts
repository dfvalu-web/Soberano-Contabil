import { Result, Ok, Err } from '../types/result.js';

export interface InventorySpoilageInput {
  clienteCnpj: string;
  razaoSocial: string;
  valorCustoPerdasDeterioracaoBrl: number;
  aliquotaIcmsEstornoPercent: number; // Ex: 18%
  aliquotaPisCofinsEstornoPercent: number; // Ex: 9.25% (Lucro Real)
  emiteNfeAjusteCfop5927: boolean;
}

export interface InventorySpoilageResult {
  clienteCnpj: string;
  razaoSocial: string;
  valorCustoPerdasDeterioracaoBrl: number;
  valorIcmsEstornadoBrl: number;
  valorPisCofinsEstornadoBrl: number;
  totalTributosEstornadosBrl: number;
  lancamentoContabilPerdaGerado: string;
  statusAjuste: 'AJUSTE_QUEBRAS_ESTORNO_TRIBUTARIO_CONCLUIDO';
  diagnosticoAjuste: string;
}

export function processOfficeInventorySpoilageTaxAdjustmentEngine(input: InventorySpoilageInput): Result<InventorySpoilageResult, Error> {
  const {
    clienteCnpj,
    razaoSocial,
    valorCustoPerdasDeterioracaoBrl,
    aliquotaIcmsEstornoPercent,
    aliquotaPisCofinsEstornoPercent,
    emiteNfeAjusteCfop5927
  } = input;

  if (!clienteCnpj || valorCustoPerdasDeterioracaoBrl <= 0) {
    return Err(new Error('CNPJ e valor do custo das perdas/quebras são obrigatórios.'));
  }

  const icmsEstorno = (valorCustoPerdasDeterioracaoBrl * aliquotaIcmsEstornoPercent) / 100;
  const pisCofinsEstorno = (valorCustoPerdasDeterioracaoBrl * aliquotaPisCofinsEstornoPercent) / 100;
  const totalEstornos = icmsEstorno + pisCofinsEstorno;

  const lancamento = "D - 3.1.04.001 Perdas por Perecimento/Quebras de Estoque (DRE) | C - 1.1.04.001 Estoques de Mercadorias (Ativo) no valor de R$ " + valorCustoPerdasDeterioracaoBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const diag = "Ajuste de Quebras (" + razaoSocial + "): Baixa de estoque de R$ " + valorCustoPerdasDeterioracaoBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " | Estorno de ICMS (" + aliquotaIcmsEstornoPercent + "%): R$ " + icmsEstorno.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " | Estorno PIS/COFINS (" + aliquotaPisCofinsEstornoPercent + "%): R$ " + pisCofinsEstorno.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " | NF-e de Ajuste CFOP 5.927 emitida: " + (emiteNfeAjusteCfop5927 ? "SIM" : "NÃO") + ".";

  return Ok({
    clienteCnpj,
    razaoSocial,
    valorCustoPerdasDeterioracaoBrl: parseFloat(valorCustoPerdasDeterioracaoBrl.toFixed(2)),
    valorIcmsEstornadoBrl: parseFloat(icmsEstorno.toFixed(2)),
    valorPisCofinsEstornadoBrl: parseFloat(pisCofinsEstorno.toFixed(2)),
    totalTributosEstornadosBrl: parseFloat(totalEstornos.toFixed(2)),
    lancamentoContabilPerdaGerado: lancamento,
    statusAjuste: 'AJUSTE_QUEBRAS_ESTORNO_TRIBUTARIO_CONCLUIDO',
    diagnosticoAjuste: diag
  });
}
