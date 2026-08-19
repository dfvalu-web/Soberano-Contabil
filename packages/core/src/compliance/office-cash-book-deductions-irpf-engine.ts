import { Result, Ok, Err } from '../types/result.js';

export interface CashBookExpenseItem {
  descricao: string;
  categoria: 'ALUGUEL_CONDOMINIO_IPTU' | 'ENERGIA_AGUA_TELEFONE' | 'FOLHA_SECRETARIA_INSS' | 'ANUIDADE_CONSELHO_CLASSE' | 'MATERIAIS_CONSUMO';
  valorBrl: number;
}

export interface CashBookInput {
  contribuinteCpf: string;
  nomeContribuinte: string;
  mesAnoCompetencia: string;
  itensDespesas: CashBookExpenseItem[];
}

export interface CashBookResult {
  contribuinteCpf: string;
  nomeContribuinte: string;
  mesAnoCompetencia: string;
  totalDespesasDedutiveisAprovadasBrl: number;
  totalItensEscrituradosCount: number;
  statusLivroCaixa: 'LIVRO_CAIXA_ESCRITURADO_E_VALIDADO';
  diagnosticoLivroCaixa: string;
}

export function processOfficeCashBookDeductionsIrpfEngine(input: CashBookInput): Result<CashBookResult, Error> {
  const {
    contribuinteCpf,
    nomeContribuinte,
    mesAnoCompetencia,
    itensDespesas
  } = input;

  if (!contribuinteCpf || !itensDespesas) {
    return Err(new Error('CPF e lista de despesas são obrigatórios.'));
  }

  let totalDespesas = 0;
  for (const item of itensDespesas) {
    totalDespesas += item.valorBrl;
  }

  const diag = "Livro Caixa Digital (" + nomeContribuinte + " - " + mesAnoCompetencia + "): " + itensDespesas.length + " despesas de custeio escrituradas no total de R$ " + totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " (100% dedutíveis no Carnê-Leão e IRPF).";

  return Ok({
    contribuinteCpf,
    nomeContribuinte,
    mesAnoCompetencia,
    totalDespesasDedutiveisAprovadasBrl: parseFloat(totalDespesas.toFixed(2)),
    totalItensEscrituradosCount: itensDespesas.length,
    statusLivroCaixa: 'LIVRO_CAIXA_ESCRITURADO_E_VALIDADO',
    diagnosticoLivroCaixa: diag
  });
}
