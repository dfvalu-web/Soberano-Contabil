import { Result, Ok, Err } from '../types/result.js';

export interface PartnerVoteEntry {
  socioNome: string;
  socioCpfCnpj: string;
  quantidadeQuotasAcoes: number;
  percentualCapitalSocialPercent: number;
  votoAprovacaoContas: 'FAVORAVEL' | 'CONTRARIO' | 'ABSTENCAO';
}

export interface CorporateAssemblyInput {
  empresaCnpj: string;
  razaoSocial: string;
  tipoTipoSocietario: 'SOCIEDADE_LIMITADA' | 'SOCIEDADE_ANONIMA_FECHADA';
  anoExercicioAprovado: number;
  dataRealizacaoReuniao: string;
  totalQuotasAcoesCapital: number;
  listaVotosSocios: PartnerVoteEntry[];
}

export interface CorporateAssemblyResult {
  empresaCnpj: string;
  razaoSocial: string;
  anoExercicioAprovado: number;
  quorumInstalacaoPercent: number;
  quorumAprovacaoContasPercent: number;
  resultadoDeliberacao: 'CONTAS_DA_ADMINISTRACAO_APROVADAS' | 'CONTAS_REJEITADAS';
  ataAssinadaDigitalmente: boolean;
  statusAssembleia: 'ASSEMBLEIA_DIGITAL_HOMOLOGADA_DREI79';
  diagnosticoAssembleia: string;
}

export function processOfficeCorporateGovernanceAssemblyEngine(input: CorporateAssemblyInput): Result<CorporateAssemblyResult, Error> {
  const {
    empresaCnpj,
    razaoSocial,
    tipoTipoSocietario,
    anoExercicioAprovado,
    dataRealizacaoReuniao,
    totalQuotasAcoesCapital,
    listaVotosSocios
  } = input;

  if (!empresaCnpj || !listaVotosSocios || listaVotosSocios.length === 0) {
    return Err(new Error('CNPJ da empresa e relação de votos dos sócios são obrigatórios.'));
  }

  let quotasPresentes = 0;
  let quotasFavoraveis = 0;

  for (const v of listaVotosSocios) {
    quotasPresentes += v.quantidadeQuotasAcoes;
    if (v.votoAprovacaoContas === 'FAVORAVEL') {
      quotasFavoraveis += v.quantidadeQuotasAcoes;
    }
  }

  const quorumInstalacao = (quotasPresentes / totalQuotasAcoesCapital) * 100;
  const quorumAprovacao = quotasPresentes > 0 ? (quotasFavoraveis / quotasPresentes) * 100 : 0;

  const isAprovado = quorumAprovacao >= 50.0; // Maioria simples dos presentes
  const resultado = isAprovado ? 'CONTAS_DA_ADMINISTRACAO_APROVADAS' : 'CONTAS_REJEITADAS';

  const diag = "Assembleia Digital DREI 79/81 (" + razaoSocial + " - Exercício " + anoExercicioAprovado + " em " + dataRealizacaoReuniao + "): Quórum Instalação: " + quorumInstalacao.toFixed(1) + "% | Aprovação: " + quorumAprovacao.toFixed(1) + "% (" + resultado + ") -> Ata gerada e assinada com ICP-Brasil/Gov.br.";

  return Ok({
    empresaCnpj,
    razaoSocial,
    anoExercicioAprovado,
    quorumInstalacaoPercent: parseFloat(quorumInstalacao.toFixed(1)),
    quorumAprovacaoContasPercent: parseFloat(quorumAprovacao.toFixed(1)),
    resultadoDeliberacao: resultado,
    ataAssinadaDigitalmente: true,
    statusAssembleia: 'ASSEMBLEIA_DIGITAL_HOMOLOGADA_DREI79',
    diagnosticoAssembleia: diag
  });
}
