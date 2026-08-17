import { Result, Ok, Err } from '../../types/result.js';

export interface WarehouseSalesOperationInput {
  operacaoId: string;
  depositanteNome: string;
  armazemGeralNome: string;
  compradorFinalNome: string;
  valorMercadoriaBrl: number;
  aliquotaIcmsPercent: number; // Ex: 18%
  aliquotaIpiPercent: number;  // Ex: 10%
}

export interface WarehouseSalesOperationResult {
  operacaoId: string;
  notasFiscaisArmazemGeral: {
    nf1VendaDepositanteParaComprador: {
      emitente: string;
      destinatario: string;
      cfop: string;
      naturezaOperacao: string;
      valorTotalBrl: number;
      icmsDestacadoBrl: number;
      ipiDestacadoBrl: number;
      observacaoLegal: string;
    };
    nf2RetornoSimbolicoArmazemParaDepositante: {
      emitente: string;
      destinatario: string;
      cfop: string;
      naturezaOperacao: string;
      valorTotalBrl: number;
      icmsDestacadoBrl: number;
      observacaoLegal: string;
    };
    nf3RemessaContaEOrdemArmazemParaComprador: {
      emitente: string;
      destinatario: string;
      cfop: string;
      naturezaOperacao: string;
      valorTotalBrl: number;
      icmsDestacadoBrl: number;
      observacaoLegal: string;
    };
  };
  diagnosticoArmazemGeral: string;
}

export function processGeneralWarehouseSalesOperation(input: WarehouseSalesOperationInput): Result<WarehouseSalesOperationResult, Error> {
  const {
    operacaoId,
    depositanteNome,
    armazemGeralNome,
    compradorFinalNome,
    valorMercadoriaBrl,
    aliquotaIcmsPercent,
    aliquotaIpiPercent
  } = input;

  if (valorMercadoriaBrl <= 0) {
    return Err(new Error('Valor da mercadoria estocada em armazém geral deve ser superior a zero.'));
  }

  // 1. NF 1: Venda do Depositante para o Comprador (CFOP 5.105 / 6.105) com destaque de ICMS/IPI
  const icmsNf1 = Number((valorMercadoriaBrl * (aliquotaIcmsPercent / 100)).toFixed(2));
  const ipiNf1 = Number((valorMercadoriaBrl * (aliquotaIpiPercent / 100)).toFixed(2));

  // 2. NF 2: Retorno Simbólico de Armazém Geral para o Depositante (CFOP 5.907 / 6.907) sem destaque
  // 3. NF 3: Remessa por Conta e Ordem de Armazém Geral para o Comprador (CFOP 5.925 / 6.925) sem destaque

  const diag = 'Armazém Geral (Art. 6º ao 33 do Convênio S/Nº de 1970 & Art. 486 do RICMS): Venda de mercadoria estocada por ' + depositanteNome + ' para ' + compradorFinalNome + ' com saída direta de ' + armazemGeralNome + '. NF 1 Venda (CFOP 5.105: ICMS R$ ' + icmsNf1.toFixed(2) + '), NF 2 Retorno Simbólico (CFOP 5.907) e NF 3 Remessa por Conta e Ordem (CFOP 5.925). Fluxo fiscal e logístico homologado.';

  return Ok({
    operacaoId,
    notasFiscaisArmazemGeral: {
      nf1VendaDepositanteParaComprador: {
        emitente: depositanteNome,
        destinatario: compradorFinalNome,
        cfop: '5.105',
        naturezaOperacao: 'Venda de Produção/Mercadoria Armazenada em Armazém Geral',
        valorTotalBrl: valorMercadoriaBrl,
        icmsDestacadoBrl: icmsNf1,
        ipiDestacadoBrl: ipiNf1,
        observacaoLegal: 'Mercadoria a ser retirada diretamente do Armazém Geral ' + armazemGeralNome + '.'
      },
      nf2RetornoSimbolicoArmazemParaDepositante: {
        emitente: armazemGeralNome,
        destinatario: depositanteNome,
        cfop: '5.907',
        naturezaOperacao: 'Retorno Simbólico de Mercadoria Depositada em Armazém Geral',
        valorTotalBrl: valorMercadoriaBrl,
        icmsDestacadoBrl: 0,
        observacaoLegal: 'Retorno simbólico referente à NF de Venda nº emitida pelo depositante.'
      },
      nf3RemessaContaEOrdemArmazemParaComprador: {
        emitente: armazemGeralNome,
        destinatario: compradorFinalNome,
        cfop: '5.925',
        naturezaOperacao: 'Remessa por Conta e Ordem de Terceiros de Armazém Geral',
        valorTotalBrl: valorMercadoriaBrl,
        icmsDestacadoBrl: 0,
        observacaoLegal: 'Mercadoria entregue por conta e ordem do depositante ' + depositanteNome + ' nos termos do Convênio S/Nº de 1970.'
      }
    },
    diagnosticoArmazemGeral: diag
  });
}
