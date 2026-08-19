import { Result, Ok, Err } from '../types/result.js';

export interface RawUploadedFile {
  nomeArquivo: string;
  extensao: string; // Ex: '.xml', '.ofx', '.pdf', '.csv'
  tamanhoBytes: number;
  tipoDetectadoConteudo?: string;
}

export interface SmartTriageInput {
  clienteCnpj: string;
  razaoSocial: string;
  mesCompetencia: string;
  arquivosRecebidos: RawUploadedFile[];
}

export interface TriagedFileItem {
  nomeArquivo: string;
  departamentoDestino: 'DEPARTAMENTO_FISCAL' | 'DEPARTAMENTO_CONTABIL' | 'DEPARTAMENTO_PESSOAL_RH' | 'OUTROS_DOCUMENTOS';
  moduloDestino: 'ESCRITURACAO_DFE_FISCAL' | 'CONCILIACAO_CONTABIL_IA' | 'PONTO_E_ATESTADOS_DP' | 'ARQUIVO_GERAL';
  statusProcessamento: 'ENVIADO_PARA_FILA_DE_PROCESSAMENTO';
}

export interface SmartTriageResult {
  clienteCnpj: string;
  razaoSocial: string;
  mesCompetencia: string;
  totalArquivosRecebidos: number;
  totalArquivosFiscalXml: number;
  totalArquivosContabilOfx: number;
  totalArquivosPessoalRh: number;
  triagemConcluidaComSucesso: boolean;
  arquivosTriados: TriagedFileItem[];
  statusTriagem: 'TRIAGEM_MASSIVA_CONCLUIDA_ROTAS_DEFINIDAS';
  diagnosticoTriagem: string;
}

export function processOfficeSmartDropzoneTriageEngine(input: SmartTriageInput): Result<SmartTriageResult, Error> {
  const {
    clienteCnpj,
    razaoSocial,
    mesCompetencia,
    arquivosRecebidos
  } = input;

  if (!clienteCnpj || !arquivosRecebidos || arquivosRecebidos.length === 0) {
    return Err(new Error('CNPJ do cliente e arquivos para triagem são obrigatórios.'));
  }

  let countFiscal = 0;
  let countContabil = 0;
  let countRh = 0;

  const triados: TriagedFileItem[] = [];

  for (const f of arquivosRecebidos) {
    const ext = f.extensao.toLowerCase();
    const nome = f.nomeArquivo.toUpperCase();

    let depto: 'DEPARTAMENTO_FISCAL' | 'DEPARTAMENTO_CONTABIL' | 'DEPARTAMENTO_PESSOAL_RH' | 'OUTROS_DOCUMENTOS' = 'OUTROS_DOCUMENTOS';
    let modulo: 'ESCRITURACAO_DFE_FISCAL' | 'CONCILIACAO_CONTABIL_IA' | 'PONTO_E_ATESTADOS_DP' | 'ARQUIVO_GERAL' = 'ARQUIVO_GERAL';

    if (ext === '.xml' || nome.includes('NFE') || nome.includes('NFSE') || nome.includes('CTE')) {
      depto = 'DEPARTAMENTO_FISCAL';
      modulo = 'ESCRITURACAO_DFE_FISCAL';
      countFiscal++;
    } else if (ext === '.ofx' || ext === '.ret' || nome.includes('EXTRATO') || nome.includes('BANCO')) {
      depto = 'DEPARTAMENTO_CONTABIL';
      modulo = 'CONCILIACAO_CONTABIL_IA';
      countContabil++;
    } else if (nome.includes('ATESTADO') || nome.includes('PONTO') || nome.includes('FOLHA') || nome.includes('ASO') || ext === '.csv') {
      depto = 'DEPARTAMENTO_PESSOAL_RH';
      modulo = 'PONTO_E_ATESTADOS_DP';
      countRh++;
    }

    triados.push({
      nomeArquivo: f.nomeArquivo,
      departamentoDestino: depto,
      moduloDestino: modulo,
      statusProcessamento: 'ENVIADO_PARA_FILA_DE_PROCESSAMENTO'
    });
  }

  const diag = "Triagem Massiva Dropzone (" + razaoSocial + " - " + mesCompetencia + "): " + arquivosRecebidos.length + " arquivos triados simultaneamente -> Fiscal: " + countFiscal + " XMLs | Contábil: " + countContabil + " OFXs | RH/DP: " + countRh + " documentos -> 100% roteados para as esteiras de ponta.";

  return Ok({
    clienteCnpj,
    razaoSocial,
    mesCompetencia,
    totalArquivosRecebidos: arquivosRecebidos.length,
    totalArquivosFiscalXml: countFiscal,
    totalArquivosContabilOfx: countContabil,
    totalArquivosPessoalRh: countRh,
    triagemConcluidaComSucesso: true,
    arquivosTriados: triados,
    statusTriagem: 'TRIAGEM_MASSIVA_CONCLUIDA_ROTAS_DEFINIDAS',
    diagnosticoTriagem: diag
  });
}
