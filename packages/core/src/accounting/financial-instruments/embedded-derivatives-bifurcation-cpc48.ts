import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export interface EmbeddedDerivativeInput {
  contratoHospedeiroId: string;
  contraparteNome: string; // Ex: 'Fornecedor Internacional de Turbinas'
  descricaoContrato: string;
  valorNominalContratoBrl: number;
  clausulaIndexacaoExogena: string; // Ex: 'Preço indexado à cotação do Ouro / Câmbio Euro em contrato local BRL'
  isEstritamenteRelacionado: boolean; // Se false -> exige bifurcação mandatória
  valorJustoDerivadoEmbutidoBrl: number; // Valor justo apurado por modelo Black-Scholes ou fluxo descontado
}

export interface EmbeddedDerivativeResult {
  contratoHospedeiroId: string;
  contraparteNome: string;
  exigeBifurcacaoDesmembramento: boolean;
  valorContratoHospedeiroCustoAmortizadoBrl: number;
  valorJustoDerivadoEmbutidoBrl: number;
  partidasDobradaDesmembramento: JournalEntryLine[];
  diagnosticoCpc48: string;
}

export function evaluateEmbeddedDerivativeBifurcationCpc48(input: EmbeddedDerivativeInput): Result<EmbeddedDerivativeResult, Error> {
  const {
    contratoHospedeiroId,
    contraparteNome,
    descricaoContrato,
    valorNominalContratoBrl,
    clausulaIndexacaoExogena,
    isEstritamenteRelacionado,
    valorJustoDerivadoEmbutidoBrl
  } = input;

  if (valorNominalContratoBrl <= 0) {
    return Err(new Error('Valor nominal do contrato hospedeiro deve ser superior a zero.'));
  }

  // CPC 48 (Item 4.3.3): Se o derivativo embutido NÃO é estritamente relacionado ao contrato hospedeiro, deve ser bifurcado
  const exigeBifurcacao = !isEstritamenteRelacionado;
  const partidas: JournalEntryLine[] = [];

  let valorHospedeiro = valorNominalContratoBrl;
  let valorDerivativo = 0;

  if (exigeBifurcacao) {
    valorDerivativo = Number(valorJustoDerivadoEmbutidoBrl.toFixed(2));
    valorHospedeiro = Number((valorNominalContratoBrl - valorDerivativo).toFixed(2));

    // Lançamento de Segregação:
    // D: Ativo Imobilizado / Estoque (Contrato Hospedeiro a Custo)
    partidas.push({
      accountId: '1.2.3.01',
      accountCode: '1.2.3.01',
      accountName: 'Contrato Comercial Hospedeiro - Custo Principal (Ativo / Estoque - CPC 48)',
      type: 'DEBIT',
      amount: valorHospedeiro
    });

    // D ou C: Instrumentos Financeiros Derivativos Embutidos (Ativo/Passivo a Valor Justo FVTPL)
    if (valorDerivativo > 0) {
      partidas.push({
        accountId: '1.1.4.05',
        accountCode: '1.1.4.05',
        accountName: 'Derivativo Embutido Ativo a Valor Justo por Meio do Resultado (Ativo Circulante - CPC 48)',
        type: 'DEBIT',
        amount: valorDerivativo
      });
    }

    // C: Fornecedores / Contas a Pagar
    partidas.push({
      accountId: '2.1.2.01',
      accountCode: '2.1.2.01',
      accountName: 'Fornecedores a Pagar (Passivo Circulante)',
      type: 'CREDIT',
      amount: valorNominalContratoBrl
    });
  }

  const diag = 'CPC 48 / IFRS 9 (Derivativos Embutidos): Contrato ' + contratoHospedeiroId + ' (' + contraparteNome + '). ' + (exigeBifurcacao ? 'BIFURCAÇÃO MANDATÓRIA EXIGIDA. A cláusula (' + clausulaIndexacaoExogena + ') não é estritamente relacionada ao contrato hospedeiro. Derivativo Embutido segregado a Valor Justo: R$ ' + valorDerivativo.toFixed(2) + ' e Contrato Hospedeiro: R$ ' + valorHospedeiro.toFixed(2) + '.' : 'Derivativo estritamente relacionado. Contrato mantido integralmente sem desmembramento.');

  return Ok({
    contratoHospedeiroId,
    contraparteNome,
    exigeBifurcacaoDesmembramento: exigeBifurcacao,
    valorContratoHospedeiroCustoAmortizadoBrl: valorHospedeiro,
    valorJustoDerivadoEmbutidoBrl: valorDerivativo,
    partidasDobradaDesmembramento: partidas,
    diagnosticoCpc48: diag
  });
}
