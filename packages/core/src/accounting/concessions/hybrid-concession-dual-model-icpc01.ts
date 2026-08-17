import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export interface HybridConcessionInput {
  contratoId: string;
  concessionariaNome: string;
  objetoConcessao: string; // Ex: 'Rodovia Pedagiada com Aporte Público Garantido'
  custoTotalConstrucaoInfraestruturaBrl: number;
  valorGarantidoPoderConcedenteBrl: number; // Ativo Financeiro (CPC 48)
  prazoConcessaoAnos: number;
}

export interface HybridConcessionResult {
  contratoId: string;
  concessionariaNome: string;
  objetoConcessao: string;
  valorAtivoFinanceiroConcessaoBrl: number; // Parcela Garantida
  valorAtivoIntangivelConcessaoBrl: number; // Parcela Tarifária / Risco de Demanda
  amortizacaoAnualIntangivelBrl: number;
  partidasDobradaBifurcacao: JournalEntryLine[];
  diagnosticoIcpc01Hibrido: string;
}

export function evaluateHybridConcessionDualModelIcpc01(input: HybridConcessionInput): Result<HybridConcessionResult, Error> {
  const {
    contratoId,
    concessionariaNome,
    objetoConcessao,
    custoTotalConstrucaoInfraestruturaBrl,
    valorGarantidoPoderConcedenteBrl,
    prazoConcessaoAnos
  } = input;

  if (custoTotalConstrucaoInfraestruturaBrl <= 0 || prazoConcessaoAnos <= 0) {
    return Err(new Error('Custo de infraestrutura e prazo devem ser superiores a zero.'));
  }

  // Desmembramento ICPC 01 R1 Item 18 (Modelo Misto):
  // 1. Ativo Financeiro = Valor incondicionalmente garantido pelo Poder Público
  const ativoFinanceiro = Math.min(custoTotalConstrucaoInfraestruturaBrl, valorGarantidoPoderConcedenteBrl);

  // 2. Ativo Intangível = Excedente recuperável via cobrança de tarifas dos usuários
  const ativoIntangivel = Number((Math.max(0, custoTotalConstrucaoInfraestruturaBrl - ativoFinanceiro)).toFixed(2));

  // Amortização linear do Ativo Intangível ao longo do prazo da concessão
  const amortizacaoAnual = Number((ativoIntangivel / prazoConcessaoAnos).toFixed(2));

  const partidas: JournalEntryLine[] = [];

  // D: Ativo Financeiro de Concessão (CPC 48 / ICPC 01)
  if (ativoFinanceiro > 0) {
    partidas.push({
      accountId: '1.2.2.05',
      accountCode: '1.2.2.05',
      accountName: 'Ativo Financeiro de Concessão - Parcela Pública Garantida (ICPC 01)',
      type: 'DEBIT',
      amount: ativoFinanceiro
    });
  }

  // D: Ativo Intangível de Concessão (CPC 04 / ICPC 01)
  if (ativoIntangivel > 0) {
    partidas.push({
      accountId: '1.2.4.05',
      accountCode: '1.2.4.05',
      accountName: 'Ativo Intangível de Concessão - Direito de Cobrança Tarifária (ICPC 01)',
      type: 'DEBIT',
      amount: ativoIntangivel
    });
  }

  // C: Bancos / Fornecedores de Construção (Ativo Circulante)
  partidas.push({
    accountId: '1.1.1.01',
    accountCode: '1.1.1.01',
    accountName: 'Bancos Conta Movimento - Gastos de Construção (Ativo Circulante)',
    type: 'CREDIT',
    amount: custoTotalConstrucaoInfraestruturaBrl
  });

  const diag = 'ICPC 01 R1 (Modelo Híbrido / Bifurcado): ' + concessionariaNome + ' (' + objetoConcessao + '). Custo Total: R$ ' + custoTotalConstrucaoInfraestruturaBrl.toFixed(2) + '. Decomposição: Ativo Financeiro Garantido R$ ' + ativoFinanceiro.toFixed(2) + ' (CPC 48) + Ativo Intangível Tarifário R$ ' + ativoIntangivel.toFixed(2) + ' (CPC 04 - Amortização Anual R$ ' + amortizacaoAnual.toFixed(2) + ').';

  return Ok({
    contratoId,
    concessionariaNome,
    objetoConcessao,
    valorAtivoFinanceiroConcessaoBrl: ativoFinanceiro,
    valorAtivoIntangivelConcessaoBrl: ativoIntangivel,
    amortizacaoAnualIntangivelBrl: amortizacaoAnual,
    partidasDobradaBifurcacao: partidas,
    diagnosticoIcpc01Hibrido: diag
  });
}
