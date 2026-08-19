import { Result, Ok, Err } from '../types/result.js';

export interface FixedAssetItem {
  patrimonioId: string;
  descricaoBem: string;
  categoria: 'MAQUINAS_EQUIPAMENTOS' | 'VEICULOS' | 'EQUIPAMENTOS_TI' | 'IMOVEIS_EDIFICACOES' | 'MOVEIS_UTENSILIOS';
  dataAquisicao: string;
  valorAquisicaoBrl: number;
  valorResidualEstimadoBrl: number;
  vidaUtilAnos: number;
}

export interface DepreciationCalculationInput {
  clienteCnpj: string;
  razaoSocial: string;
  mesCompetencia: string; // Ex: '2026-08'
  itensAtivo: FixedAssetItem[];
}

export interface FixedAssetDepreciationResult {
  clienteCnpj: string;
  razaoSocial: string;
  mesCompetencia: string;
  totalBensCadastrados: number;
  totalCustoAquisicaoBrl: number;
  totalDepreciacaoMensalBrl: number;
  totalValorContabilLiquidoBrl: number;
  lancamentosContabeisDepreciacao: {
    contaDebito: string;
    contaCredito: string;
    historico: string;
    valorBrl: number;
  }[];
  statusCalculo: 'DEPRECIACAO_CPC27_APURADA_LANCADA';
  diagnosticoDepreciacao: string;
}

export function processOfficeFixedAssetsDepreciationCpc27Engine(input: DepreciationCalculationInput): Result<FixedAssetDepreciationResult, Error> {
  const {
    clienteCnpj,
    razaoSocial,
    mesCompetencia,
    itensAtivo
  } = input;

  if (!clienteCnpj || !itensAtivo || itensAtivo.length === 0) {
    return Err(new Error('CNPJ do cliente e relação de bens do imobilizado são obrigatórios.'));
  }

  let totalCusto = 0;
  let totalDeprecMensal = 0;

  for (const item of itensAtivo) {
    totalCusto += item.valorAquisicaoBrl;
    const baseDepreciavel = Math.max(0, item.valorAquisicaoBrl - item.valorResidualEstimadoBrl);
    const taxaAnual = 1 / item.vidaUtilAnos;
    const taxaMensal = taxaAnual / 12;
    const deprecMes = baseDepreciavel * taxaMensal;
    totalDeprecMensal += deprecMes;
  }

  const valorLiquido = totalCusto - totalDeprecMensal;

  const lancamentos = [
    {
      contaDebito: '3.1.04.001 - Despesa de Depreciação do Imobilizado',
      contaCredito: '1.2.03.009 - (-) Depreciação Acumulada',
      historico: "Cota mensal de depreciação do imobilizado ref. " + mesCompetencia,
      valorBrl: parseFloat(totalDeprecMensal.toFixed(2))
    }
  ];

  const diag = "Ativo Imobilizado CPC 27 (" + razaoSocial + " - " + mesCompetencia + "): " + itensAtivo.length + " bens | Custo: R$ " + totalCusto.toLocaleString('pt-BR') + " | Depreciação Mensal: R$ " + totalDeprecMensal.toLocaleString('pt-BR') + " -> Lançamento contábil gerado no Ativo Não Circulante redutora.";

  return Ok({
    clienteCnpj,
    razaoSocial,
    mesCompetencia,
    totalBensCadastrados: itensAtivo.length,
    totalCustoAquisicaoBrl: parseFloat(totalCusto.toFixed(2)),
    totalDepreciacaoMensalBrl: parseFloat(totalDeprecMensal.toFixed(2)),
    totalValorContabilLiquidoBrl: parseFloat(valorLiquido.toFixed(2)),
    lancamentosContabeisDepreciacao: lancamentos,
    statusCalculo: 'DEPRECIACAO_CPC27_APURADA_LANCADA',
    diagnosticoDepreciacao: diag
  });
}
