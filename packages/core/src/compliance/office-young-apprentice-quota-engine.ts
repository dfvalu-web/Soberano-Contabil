import { Result, Ok, Err } from '../types/result.js';

export interface ApprenticeQuotaInput {
  clienteCnpj: string;
  razaoSocial: string;
  totalEmpregadosFuncoesFormacaoProfissional: number;
  aprendizesContratadosCount: number;
  folhaPagamentoAprendizesBrl: number;
}

export interface ApprenticeQuotaResult {
  clienteCnpj: string;
  razaoSocial: string;
  cotaMinimaObrigatoria5PercentCount: number;
  cotaMaximaPermitida15PercentCount: number;
  aprendizesAtuaisCount: number;
  aliquotaFgtsAprendizPercent: number; // 2% (Art. 15, § 2º Lei 8.036/90)
  valorFgtsRecolhidoBrl: number;
  statusCotaAprendizagem: 'COTA_LEGAL_CUMPRIDA' | 'DEFICIT_COTA_APRENDIZ_RISCO_AUTUACAO_MTE';
  diagnosticoCota: string;
}

export function processOfficeYoungApprenticeQuotaEngine(input: ApprenticeQuotaInput): Result<ApprenticeQuotaResult, Error> {
  const {
    clienteCnpj,
    razaoSocial,
    totalEmpregadosFuncoesFormacaoProfissional,
    aprendizesContratadosCount,
    folhaPagamentoAprendizesBrl
  } = input;

  if (!clienteCnpj || totalEmpregadosFuncoesFormacaoProfissional <= 0) {
    return Err(new Error('CNPJ do cliente e número de empregados nas funções elegíveis são obrigatórios.'));
  }

  const cotaMin = Math.ceil(totalEmpregadosFuncoesFormacaoProfissional * 0.05);
  const cotaMax = Math.floor(totalEmpregadosFuncoesFormacaoProfissional * 0.15);

  const cumpreCota = aprendizesContratadosCount >= cotaMin;
  const status = cumpreCota ? 'COTA_LEGAL_CUMPRIDA' : 'DEFICIT_COTA_APRENDIZ_RISCO_AUTUACAO_MTE';

  const fgts = (folhaPagamentoAprendizesBrl * 2.0) / 100; // FGTS 2%

  const diag = "Cota de Aprendizagem (" + razaoSocial + "): Base elegível: " + totalEmpregadosFuncoesFormacaoProfissional + " | Cota Mínima (5%): " + cotaMin + " aprendizes | Contratados: " + aprendizesContratadosCount + " | FGTS (2%): R$ " + fgts.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " -> Status: " + status + ".";

  return Ok({
    clienteCnpj,
    razaoSocial,
    cotaMinimaObrigatoria5PercentCount: cotaMin,
    cotaMaximaPermitida15PercentCount: cotaMax,
    aprendizesAtuaisCount: aprendizesContratadosCount,
    aliquotaFgtsAprendizPercent: 2.0,
    valorFgtsRecolhidoBrl: parseFloat(fgts.toFixed(2)),
    statusCotaAprendizagem: status,
    diagnosticoCota: diag
  });
}
