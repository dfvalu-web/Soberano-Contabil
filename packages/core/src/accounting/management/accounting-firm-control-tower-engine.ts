import { Result, Ok, Err } from '../../types/result.js';

export interface ClientObligationSummary {
  cnpj: string;
  razaoSocial: string;
  regimeTributario: 'SIMPLES_NACIONAL' | 'LUCRO_PRESUMIDO' | 'LUCRO_REAL';
  statusSpedFiscal: 'TRANSMITIDO_VERDE' | 'A_VENCER_AMARELO' | 'ATRASADO_VERMELHO';
  statusDctfWeb: 'TRANSMITIDO_VERDE' | 'A_VENCER_AMARELO' | 'ATRASADO_VERMELHO';
  statusFechamentoFolhaS1299: 'TRANSMITIDO_VERDE' | 'A_VENCER_AMARELO' | 'ATRASADO_VERMELHO';
  totalGuiasPendentesBrl: number;
}

export interface ControlTowerInput {
  escritorioId: string;
  escritorioNome: string; // Ex: 'Soberano Consultoria & Auditoria Contábil S.S.'
  competencia: string; // Ex: '2026-04'
  clientes: ClientObligationSummary[];
}

export interface ControlTowerResult {
  escritorioId: string;
  escritorioNome: string;
  competencia: string;
  totalClientesGerenciados: number;
  totalConcluidosVerde: number;
  totalAlertaAmarelo: number;
  totalCriticosVermelho: number;
  indiceConformidadeGeralPercent: number;
  volumeTotalGuiasGerenciadasBrl: number;
  diagnosticoTorreControle: string;
}

export function processAccountingFirmControlTowerEngine(input: ControlTowerInput): Result<ControlTowerResult, Error> {
  const {
    escritorioId,
    escritorioNome,
    competencia,
    clientes
  } = input;

  if (!clientes || clientes.length === 0) {
    return Err(new Error('Lista de clientes não pode ser vazia.'));
  }

  let totalVerde = 0;
  let totalAmarelo = 0;
  let totalVermelho = 0;
  let volumeGuias = 0;

  for (const c of clientes) {
    volumeGuias += c.totalGuiasPendentesBrl;
    const isVermelho = c.statusSpedFiscal === 'ATRASADO_VERMELHO' || c.statusDctfWeb === 'ATRASADO_VERMELHO' || c.statusFechamentoFolhaS1299 === 'ATRASADO_VERMELHO';
    const isAmarelo = c.statusSpedFiscal === 'A_VENCER_AMARELO' || c.statusDctfWeb === 'A_VENCER_AMARELO' || c.statusFechamentoFolhaS1299 === 'A_VENCER_AMARELO';

    if (isVermelho) {
      totalVermelho++;
    } else if (isAmarelo) {
      totalAmarelo++;
    } else {
      totalVerde++;
    }
  }

  const conformidade = Number(((totalVerde / clientes.length) * 100).toFixed(2));

  const diag = "Torre de Controle Contabil (" + escritorioNome + " - " + competencia + "): " + clientes.length + " clientes gerenciados | Verde: " + totalVerde + " (" + conformidade + "%) | Amarelo: " + totalAmarelo + " | Vermelho: " + totalVermelho + " | Volume Total de Guias Tributarias: R$ " + volumeGuias.toFixed(2) + ".";

  return Ok({
    escritorioId,
    escritorioNome,
    competencia,
    totalClientesGerenciados: clientes.length,
    totalConcluidosVerde: totalVerde,
    totalAlertaAmarelo: totalAmarelo,
    totalCriticosVermelho: totalVermelho,
    indiceConformidadeGeralPercent: conformidade,
    volumeTotalGuiasGerenciadasBrl: volumeGuias,
    diagnosticoTorreControle: diag
  });
}
