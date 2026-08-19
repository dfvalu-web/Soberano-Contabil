import { Result, Ok, Err } from '../types/result.js';

export interface EmployeeProvisionData {
  cpf: string;
  nome: string;
  salarioBaseMaisMediasBrl: number;
  mesesTrabalhadosAnoCorrente: number; // 1 a 12
  mesesPeriodoAquisitivoFerias: number; // 1 a 12
}

export interface PayrollProvisionsInput {
  clienteCnpj: string;
  razaoSocial: string;
  mesCompetencia: string; // Ex: '2026-08'
  aliquotaInssPatronalPercent: number; // Ex: 20%
  aliquotaRatFapPercent: number; // Ex: 2%
  aliquotaTerceirosPercent: number; // Ex: 5.8%
  aliquotaFgtsPercent: number; // 8%
  colaboradores: EmployeeProvisionData[];
}

export interface ProvisionJournalEntry {
  contaDebito: string;
  contaCredito: string;
  historico: string;
  valorBrl: number;
}

export interface PayrollProvisionsResult {
  clienteCnpj: string;
  razaoSocial: string;
  mesCompetencia: string;
  totalProvisao13SalarioMesBrl: number;
  totalProvisaoFeriasTercoMesBrl: number;
  totalEncargosPatronaisProvisoesBrl: number;
  totalProvisoesMensalBrl: number;
  lancamentosContabeisProvisao: ProvisionJournalEntry[];
  statusProvisao: 'PROVISOES_DE_FOLHA_APURADAS_CPC33_LANCADAS';
  diagnosticoProvisao: string;
}

export function processOfficePayrollProvisionsCpc33Engine(input: PayrollProvisionsInput): Result<PayrollProvisionsResult, Error> {
  const {
    clienteCnpj,
    razaoSocial,
    mesCompetencia,
    aliquotaInssPatronalPercent,
    aliquotaRatFapPercent,
    aliquotaTerceirosPercent,
    aliquotaFgtsPercent,
    colaboradores
  } = input;

  if (!clienteCnpj || !colaboradores || colaboradores.length === 0) {
    return Err(new Error('CNPJ do cliente e relação de colaboradores são obrigatórios.'));
  }

  let prov13 = 0;
  let provFerias = 0;

  for (const c of colaboradores) {
    // 1/12 avos mensais
    const mensal13 = c.salarioBaseMaisMediasBrl / 12;
    // 1/12 avos mensais de férias + 1/3
    const mensalFerias = (c.salarioBaseMaisMediasBrl / 12) * 1.333333;

    prov13 += mensal13;
    provFerias += mensalFerias;
  }

  const aliquotaTotalEncargos = (aliquotaInssPatronalPercent + aliquotaRatFapPercent + aliquotaTerceirosPercent + aliquotaFgtsPercent) / 100;
  const encargosProvisoes = (prov13 + provFerias) * aliquotaTotalEncargos;
  const totalGeralProvisoes = prov13 + provFerias + encargosProvisoes;

  const lancamentos: ProvisionJournalEntry[] = [
    {
      contaDebito: '3.1.01.005 - Despesa com Provisão de 13º Salário',
      contaCredito: '2.1.02.003 - Provisão de 13º Salário a Pagar',
      historico: "Provisão mensal de 13º Salário ref. " + mesCompetencia,
      valorBrl: parseFloat(prov13.toFixed(2))
    },
    {
      contaDebito: '3.1.01.006 - Despesa com Provisão de Férias',
      contaCredito: '2.1.02.004 - Provisão de Férias e 1/3 a Pagar',
      historico: "Provisão mensal de Férias e 1/3 ref. " + mesCompetencia,
      valorBrl: parseFloat(provFerias.toFixed(2))
    },
    {
      contaDebito: '3.1.01.007 - Despesa com Encargos Patronais s/ Provisões',
      contaCredito: '2.1.02.005 - Provisão de Encargos Sociais a Recolher',
      historico: "Encargos Patronais s/ Provisões de Folha ref. " + mesCompetencia,
      valorBrl: parseFloat(encargosProvisoes.toFixed(2))
    }
  ];

  const diag = "Provisões de Folha CPC 33 (" + razaoSocial + " - " + mesCompetencia + "): 13º Salário: R$ " + prov13.toLocaleString('pt-BR') + " | Férias + 1/3: R$ " + provFerias.toLocaleString('pt-BR') + " | Encargos Sociais: R$ " + encargosProvisoes.toLocaleString('pt-BR') + " -> Total Provisão: R$ " + totalGeralProvisoes.toLocaleString('pt-BR') + " lançados no Passivo.";

  return Ok({
    clienteCnpj,
    razaoSocial,
    mesCompetencia,
    totalProvisao13SalarioMesBrl: parseFloat(prov13.toFixed(2)),
    totalProvisaoFeriasTercoMesBrl: parseFloat(provFerias.toFixed(2)),
    totalEncargosPatronaisProvisoesBrl: parseFloat(encargosProvisoes.toFixed(2)),
    totalProvisoesMensalBrl: parseFloat(totalGeralProvisoes.toFixed(2)),
    lancamentosContabeisProvisao: lancamentos,
    statusProvisao: 'PROVISOES_DE_FOLHA_APURADAS_CPC33_LANCADAS',
    diagnosticoProvisao: diag
  });
}
