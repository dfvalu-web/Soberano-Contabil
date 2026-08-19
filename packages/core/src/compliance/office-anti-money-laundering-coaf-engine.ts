import { Result, Ok, Err } from '../types/result.js';

export interface AmlOperationEntry {
  operacaoId: string;
  clienteCnpj: string;
  razaoSocialCliente: string;
  valorOperacaoBrl: number;
  tipoOperacao: 'ESPECIE_ACIMA_50K' | 'INCOMPATIBILIDADE_FATURAMENTO' | 'REMESSA_PARAISOS_FISCAIS' | 'FRACIONAMENTO_DEPOSITOS' | 'OPERACAO_NORMAL';
  envolvePessoaExpostaPoliticamentePep: boolean;
}

export interface AntiMoneyLaunderingInput {
  escritorioNome: string;
  mesReferencia: string;
  operacoesAvaliadas: AmlOperationEntry[];
}

export interface AntiMoneyLaunderingResult {
  escritorioNome: string;
  mesReferencia: string;
  totalOperacoesAvaliadas: number;
  operacoesSuspeitasIdentificadas: number;
  operacoesNormais: number;
  requerComunicacaoCoaf: boolean;
  statusPld: 'AUDITORIA_PLD_CFT_CONCLUIDA_COM_SUCESSO';
  diagnosticoPld: string;
}

export function processOfficeAntiMoneyLaunderingCoafEngine(input: AntiMoneyLaunderingInput): Result<AntiMoneyLaunderingResult, Error> {
  const {
    escritorioNome,
    mesReferencia,
    operacoesAvaliadas
  } = input;

  if (!escritorioNome || !operacoesAvaliadas || operacoesAvaliadas.length === 0) {
    return Err(new Error('Nome do escritório e lista de operações para auditoria PLD são obrigatórios.'));
  }

  let suspeitas = 0;
  let normais = 0;

  for (const op of operacoesAvaliadas) {
    if (op.tipoOperacao !== 'OPERACAO_NORMAL' || op.envolvePessoaExpostaPoliticamentePep) {
      suspeitas++;
    } else {
      normais++;
    }
  }

  const requerComunicacao = suspeitas > 0;

  const diag = "Auditoria PLD/CFT (" + escritorioNome + " - " + mesReferencia + "): " + operacoesAvaliadas.length + " operacoes triadas | Suspeitas/PEP: " + suspeitas + " | Normais: " + normais + " -> " + (requerComunicacao ? "Requer comunicacao formal ao COAF (Art. 11 Lei 9.613/98)" : "Nenhuma anomalia detectada no periodo.");

  return Ok({
    escritorioNome,
    mesReferencia,
    totalOperacoesAvaliadas: operacoesAvaliadas.length,
    operacoesSuspeitasIdentificadas: suspeitas,
    operacoesNormais: normais,
    requerComunicacaoCoaf: requerComunicacao,
    statusPld: 'AUDITORIA_PLD_CFT_CONCLUIDA_COM_SUCESSO',
    diagnosticoPld: diag
  });
}
