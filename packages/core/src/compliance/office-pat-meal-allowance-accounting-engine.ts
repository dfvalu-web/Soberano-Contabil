import { Result, Ok, Err } from '../types/result.js';

export interface PatMealAllowanceInput {
  empresaCnpj: string;
  razaoSocial: string;
  funcionarioCpf: string;
  nomeFuncionario: string;
  empresaInscritaPat: boolean;
  valorCreditoAlimentacaoRefeicaoBrl: number; // Ex: R$ 800,00
  percentualCoparticipacaoEmpregadoPercent: number; // Até 20% legal (ex: 5% ou 10%)
}

export interface PatMealAllowanceResult {
  funcionarioCpf: string;
  nomeFuncionario: string;
  valorBeneficioVaVrBrl: number;
  valorCoparticipacaoDescontoBrl: number;
  valorCusteioEmpresaBrl: number;
  rubricaEsocialCoparticipacao: '5005_DESCONTO_ALIMENTACAO_PAT';
  partidaDobradaCusteioBeneficio: string;
  statusPat: 'BENEFICIO_PAT_APURADO_E_CONCILIADO';
  diagnosticoPat: string;
}

export function processOfficePatMealAllowanceAccountingEngine(input: PatMealAllowanceInput): Result<PatMealAllowanceResult, Error> {
  const {
    empresaCnpj,
    razaoSocial,
    funcionarioCpf,
    nomeFuncionario,
    empresaInscritaPat,
    valorCreditoAlimentacaoRefeicaoBrl,
    percentualCoparticipacaoEmpregadoPercent
  } = input;

  if (!funcionarioCpf || valorCreditoAlimentacaoRefeicaoBrl <= 0) {
    return Err(new Error('CPF do funcionário e valor do crédito de alimentação/refeição são obrigatórios.'));
  }

  // Coparticipação legal limitada a 20%
  const aliquotaCopart = Math.min(percentualCoparticipacaoEmpregadoPercent, 20.0);
  const valorDesconto = (valorCreditoAlimentacaoRefeicaoBrl * aliquotaCopart) / 100;
  const valorEmpresa = valorCreditoAlimentacaoRefeicaoBrl - valorDesconto;

  const lancamento = "D - 4.1.01.006 Despesas com Benefícios - PAT (R$ " + valorEmpresa.toFixed(2) + ") | D - 2.1.03.001 Salários a Pagar (R$ " + valorDesconto.toFixed(2) + ") | C - 1.1.04.008 Adiantamento de Benefícios a Funcionários (R$ " + valorCreditoAlimentacaoRefeicaoBrl.toFixed(2) + ")";

  const diag = "PAT / Vale-Alimentação (" + nomeFuncionario + "): Benefício Total: R$ " + valorCreditoAlimentacaoRefeicaoBrl.toFixed(2) + " | Coparticipação (" + aliquotaCopart + "%): R$ " + valorDesconto.toFixed(2) + " | Custo Empresa: R$ " + valorEmpresa.toFixed(2) + " | Empresa inscrita no PAT: " + (empresaInscritaPat ? "SIM (Isenção total de INSS/FGTS)" : "NÃO (Atenção ao risco salarial)") + " | Rubrica eSocial 5005.";

  return Ok({
    funcionarioCpf,
    nomeFuncionario,
    valorBeneficioVaVrBrl: parseFloat(valorCreditoAlimentacaoRefeicaoBrl.toFixed(2)),
    valorCoparticipacaoDescontoBrl: parseFloat(valorDesconto.toFixed(2)),
    valorCusteioEmpresaBrl: parseFloat(valorEmpresa.toFixed(2)),
    rubricaEsocialCoparticipacao: '5005_DESCONTO_ALIMENTACAO_PAT',
    partidaDobradaCusteioBeneficio: lancamento,
    statusPat: 'BENEFICIO_PAT_APURADO_E_CONCILIADO',
    diagnosticoPat: diag
  });
}
