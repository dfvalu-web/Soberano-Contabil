import { Result, Ok } from '../../types/result.js';

export interface CopilotQueryInput {
  pergunta: string;
  contextoEmpresa?: {
    regimeTributario: string;
    uf: string;
    cnaePrincipal: string;
    faturamentoUltimos12Meses: number;
    folhaUltimos12Meses: number;
  };
}

export interface CopilotResponse {
  intencaoDetectada: 'ENQUADRAMENTO_TRIBUTARIO' | 'FATOR_R_SIMPLES' | 'REFORMA_TRIBUTARIA_SPLIT_PAYMENT' | 'CLASSIFICACAO_CONTABIL' | 'CONSULTA_GERAL';
  respostaFundamentada: string;
  fundamentacaoLegal: string[];
  acoesSugeridas: string[];
  lancamentoContabilSugerido?: {
    debito: string;
    credito: string;
    historico: string;
  };
}

export function askTaxAccountingCopilot(input: CopilotQueryInput): Result<CopilotResponse, Error> {
  const q = input.pergunta.toLowerCase();

  if (q.includes('fator r') || q.includes('anexo v') || q.includes('anexo iii')) {
    const folha = input.contextoEmpresa?.folhaUltimos12Meses || 0;
    const rbt12 = input.contextoEmpresa?.faturamentoUltimos12Meses || 1;
    const fatorR = rbt12 > 0 ? (folha / rbt12) * 100 : 0;
    const migraAnexoIII = fatorR >= 28.0;

    return Ok({
      intencaoDetectada: 'FATOR_R_SIMPLES',
      respostaFundamentada: `O Fator R apurado para a sociedade é de ${fatorR.toFixed(2)}%. Como o índice ${migraAnexoIII ? 'é superior ou igual a 28%' : 'é inferior a 28%'}, a empresa é tributada pelo ${migraAnexoIII ? 'Anexo III (alíquota inicial a partir de 6%)' : 'Anexo V (alíquota inicial a partir de 15,5%)'}, nos termos do Art. 18, § 5º-J da LC 123/2006.`,
      fundamentacaoLegal: [
        'Lei Complementar nº 123/2006 (Art. 18, §§ 5º-J, 5º-M e 5º-N)',
        'Resolução CGSN nº 140/2018 (Art. 26)',
        'Solução de Consulta COSIT nº 312/2019'
      ],
      acoesSugeridas: [
        migraAnexoIII ? 'Manter pró-labore e folha para preservar o enquadramento no Anexo III.' : 'Avaliar o incremento de pró-labore aos sócios para atingir a marca de 28% e reduzir a tributação de 15,5% para 6%.'
      ]
    });
  }

  if (q.includes('split payment') || q.includes('reforma') || q.includes('cbs') || q.includes('ibs')) {
    return Ok({
      intencaoDetectada: 'REFORMA_TRIBUTARIA_SPLIT_PAYMENT',
      respostaFundamentada: 'Com a promulgação da Emenda Constitucional nº 132/2023, o novo sistema tributário adotará o Split Payment inteligente. No momento da liquidação financeira da transação pela instituição bancária ou arranjo de pagamento, o valor dos tributos (CBS e IBS) é retido na fonte e creditado diretamente na conta do Comitê Gestor do IBS e da Receita Federal, repassando ao fornecedor apenas o valor líquido da operação.',
      fundamentacaoLegal: [
        'Emenda Constitucional nº 132/2023 (Art. 156-A e Art. 195, V)',
        'Lei Complementar da Reforma Tributária (Regulamentação Nacional)',
        'Princípio da Não-Cumulatividade Plena do IVA Dual'
      ],
      acoesSugeridas: [
        'Configurar o ERP Soberano com a flag Dual-Engine 2026.',
        'Mapear o fluxo de caixa para absorver a retenção automática sem comprometer o capital de giro.'
      ]
    });
  }

  // Default: Classificação Contábil IFRS
  return Ok({
    intencaoDetectada: 'CLASSIFICACAO_CONTABIL',
    respostaFundamentada: 'Para as operações societárias sob regência dos CPCs (alinhados às IFRS), a escrituração contábil deve refletir a primazia da essência sobre a forma jurídica, reconhecendo receitas na transferência do controle (CPC 47) e custos pelo regime de competência.',
    fundamentacaoLegal: [
      'Pronunciamento Técnico CPC 00 (R2) — Estrutura Conceitual',
      'Lei nº 6.404/1976 e Lei nº 11.638/2007',
      'Norma Brasileira de Contabilidade NBC TG Geral'
    ],
    acoesSugeridas: [
      'Verificar o plano de contas e amarração referencial da RFB na ECD.',
      'Auditar o Merkle Root no Append-Only Ledger.'
    ],
    lancamentoContabilSugerido: {
      debito: '1.1.2.01 - Clientes a Receber (Ativo Circulante)',
      credito: '3.1.1.01 - Receita Bruta de Vendas (Resultado)',
      historico: 'Faturamento de vendas da competência'
    }
  });
}
