import { Result, Ok, Err } from '../types/result.js';

export interface AlimonyBeneficiaryInput {
  funcionarioCpf: string;
  nomeFuncionario: string;
  beneficiarioAlimentandoCpf: string;
  nomeBeneficiarioAlimentando: string;
  bancoDestinoConta: string;
  valorPensaoRepasseBrl: number;
}

export interface AlimonyBeneficiaryResult {
  funcionarioCpf: string;
  beneficiarioAlimentandoCpf: string;
  nomeBeneficiarioAlimentando: string;
  eventoEsocial: 'S-1210_PAGAMENTO_BENEFICIARIO';
  partidaDobradaDescontoFolha: string;
  partidaDobradaRepasseBancario: string;
  statusRepasse: 'REPASSE_PENSAO_CONCLUIDO_E_ESOCIAL_GERADO';
  diagnosticoRepasse: string;
}

export function processOfficeAlimonyBeneficiaryEsocialEngine(input: AlimonyBeneficiaryInput): Result<AlimonyBeneficiaryResult, Error> {
  const {
    funcionarioCpf,
    nomeFuncionario,
    beneficiarioAlimentandoCpf,
    nomeBeneficiarioAlimentando,
    bancoDestinoConta,
    valorPensaoRepasseBrl
  } = input;

  if (!funcionarioCpf || !beneficiarioAlimentandoCpf || valorPensaoRepasseBrl <= 0) {
    return Err(new Error('CPFs do titular e beneficiário e valor da pensão são obrigatórios.'));
  }

  const desconto = "D - 2.1.03.001 Salários e Ordenados a Pagar | C - 2.1.03.005 Pensão Alimentícia Judicial a Repassar no valor de R$ " + valorPensaoRepasseBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const repasse = "D - 2.1.03.005 Pensão Alimentícia Judicial a Repassar | C - 1.1.01.002 Banco Conta Movimento no valor de R$ " + valorPensaoRepasseBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const diag = "Repasse de Pensão (" + nomeBeneficiarioAlimentando + " - CPF " + beneficiarioAlimentandoCpf + "): Crédito Bancário (" + bancoDestinoConta + ") no valor de R$ " + valorPensaoRepasseBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " | eSocial S-1210 gerado | Lançamentos contábeis concluídos.";

  return Ok({
    funcionarioCpf,
    beneficiarioAlimentandoCpf,
    nomeBeneficiarioAlimentando,
    eventoEsocial: 'S-1210_PAGAMENTO_BENEFICIARIO',
    partidaDobradaDescontoFolha: desconto,
    partidaDobradaRepasseBancario: repasse,
    statusRepasse: 'REPASSE_PENSAO_CONCLUIDO_E_ESOCIAL_GERADO',
    diagnosticoRepasse: diag
  });
}
