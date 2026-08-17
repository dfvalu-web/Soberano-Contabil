import { SpedType, SpedValidationReport, SpedValidationIssue } from '../../types/sped.js';
import { Result, Ok } from '../../types/result.js';

export function validateSpedFile(tipoSped: SpedType, content: string): Result<SpedValidationReport, Error> {
  const lineSplitRegex = new RegExp('\r?\n');
  const lines = content.split(lineSplitRegex).filter(l => l.trim().length > 0);
  const inconsistencias: SpedValidationIssue[] = [];

  const totalLinhas = lines.length;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    if (!line.startsWith('|') || !line.endsWith('|')) {
      inconsistencias.push({
        tipo: 'ERRO',
        linha: i + 1,
        mensagem: 'Linha não delimitada corretamente por barras verticais (|).'
      });
    }
  }

  const primeiraLinha = lines[0] || '';
  const ultimaLinha = lines[lines.length - 1] || '';

  if (!primeiraLinha.startsWith('|0000|')) {
    inconsistencias.push({
      tipo: 'ERRO',
      linha: 1,
      registro: '0000',
      mensagem: 'O arquivo SPED deve iniciar obrigatoriamente com o registro |0000|.'
    });
  }

  if (!ultimaLinha.startsWith('|9999|')) {
    inconsistencias.push({
      tipo: 'ERRO',
      linha: lines.length,
      registro: '9999',
      mensagem: 'O arquivo SPED deve encerrar obrigatoriamente com o registro |9999|.'
    });
  }

  if (tipoSped === 'ECD') {
    const contasCadastradas = new Set<string>();
    for (let i = 0; i < lines.length; i++) {
      const parts = lines[i]!.split('|');
      const reg = parts[1];
      if (reg === 'I050') {
        const codigoConta = parts[6];
        if (codigoConta) contasCadastradas.add(codigoConta);
      }
    }

    for (let i = 0; i < lines.length; i++) {
      const parts = lines[i]!.split('|');
      const reg = parts[1];
      if (reg === 'I250') {
        const contaLancada = parts[2];
        if (contaLancada && !contasCadastradas.has(contaLancada)) {
          inconsistencias.push({
            tipo: 'ERRO',
            linha: i + 1,
            registro: 'I250',
            campo: 'COD_CTA',
            mensagem: 'A conta contabil "' + contaLancada + '" utilizada no lancamento nao foi cadastrada no registro I050.',
            sugestaoCorrecao: 'Cadastre a conta no Plano de Contas (I050) antes de efetuar o lancamento.'
          });
        }
      }
    }
  }

  const totalErros = inconsistencias.filter(i => i.tipo === 'ERRO').length;
  const totalAvisos = inconsistencias.filter(i => i.tipo === 'AVISO').length;
  const isAprovadoPreFlight = totalErros === 0;

  return Ok({
    tipoSped,
    totalLinhas,
    totalErros,
    totalAvisos,
    isAprovadoPreFlight,
    inconsistencias,
    conteudoSpedPreview: lines.slice(0, 30).join(String.fromCharCode(10))
  });
}
