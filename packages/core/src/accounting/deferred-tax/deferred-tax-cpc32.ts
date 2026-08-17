import { Result, Ok } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export interface DeferredTaxInput {
  periodoAno: number;
  saldoPrejuizoFiscalIrpjAcumulado: number;
  saldoBaseNegativaCsllAcumulada: number;
  adicoesTemporariasDedutiveisFuturas: number; // e.g. Provisões CPC 25
  exclusoesTemporariasTributaveisFuturas: number; // e.g. AVP Ativo / Depreciação Acelerada
  lucroTributavelEstimadoProximos10Anos: number;
}

export interface DeferredTaxResult {
  periodoAno: number;
  ativoFiscalDiferidoDta: {
    dtaSobrePrejuizoFiscalIrpj25Percent: number;
    dtaSobreBaseNegativaCsll9Percent: number;
    dtaSobreDiferencasTemporarias34Percent: number;
    totalAtivoFiscalDiferido: number;
  };
  passivoFiscalDiferidoDtl: {
    dtlSobreDiferencasTemporarias34Percent: number;
    totalPassivoFiscalDiferido: number;
  };
  posicaoLiquidaFiscalDiferida: number; // Ativo líquido ou Passivo líquido
  testeRealizabilidade10AnosAprovado: boolean;
  partidasDobradaDta: JournalEntryLine[];
  diagnosticoCpc32: string;
}

export function calculateDeferredTaxCpc32(input: DeferredTaxInput): Result<DeferredTaxResult, Error> {
  const {
    periodoAno,
    saldoPrejuizoFiscalIrpjAcumulado,
    saldoBaseNegativaCsllAcumulada,
    adicoesTemporariasDedutiveisFuturas,
    exclusoesTemporariasTributaveisFuturas,
    lucroTributavelEstimadoProximos10Anos
  } = input;

  // 1. DTA Prejuízo / Base Negativa (IRPJ 25% com adicional + CSLL 9% = 34%)
  const dtaIrpj = Number((saldoPrejuizoFiscalIrpjAcumulado * 0.25).toFixed(2));
  const dtaCsll = Number((saldoBaseNegativaCsllAcumulada * 0.09).toFixed(2));
  const dtaTemp = Number((adicoesTemporariasDedutiveisFuturas * 0.34).toFixed(2));
  const totalDta = Number((dtaIrpj + dtaCsll + dtaTemp).toFixed(2));

  // 2. DTL Diferenças Temporárias Tributáveis (34%)
  const totalDtl = Number((exclusoesTemporariasTributaveisFuturas * 0.34).toFixed(2));

  // 3. Teste de Realizabilidade em 10 anos (Prejuízo recuperável até 30% do lucro futuro)
  const capacidadeAbsorcao30Percent = lucroTributavelEstimadoProximos10Anos * 0.30;
  const realizabilidadeOk = capacidadeAbsorcao30Percent >= saldoPrejuizoFiscalIrpjAcumulado;

  const partidas: JournalEntryLine[] = [
    {
      accountId: '1.2.4.01',
      accountCode: '1.2.4.01',
      accountName: 'Impostos Diferidos Ativos - IRPJ/CSLL (Ativo Não Circulante - CPC 32)',
      type: 'DEBIT',
      amount: totalDta
    },
    {
      accountId: '3.1.5.05',
      accountCode: '3.1.5.05',
      accountName: 'Receita de Tributos Diferidos IRPJ/CSLL (Resultado - CPC 32)',
      type: 'CREDIT',
      amount: totalDta
    }
  ];

  const posLiquida = Number((totalDta - totalDtl).toFixed(2));
  const diagnostico = 'Reconhecimento de R$ ' + totalDta.toFixed(2) + ' de Ativo Fiscal Diferido (DTA) e R$ ' + totalDtl.toFixed(2) + ' de Passivo Fiscal Diferido (DTL). Teste de realizabilidade em 10 anos: ' + (realizabilidadeOk ? 'Aprovado com base em projeções de lucros futuros.' : 'Ressalva - Capacidade de absorção abaixo do montante acumulado.');

  return Ok({
    periodoAno,
    ativoFiscalDiferidoDta: {
      dtaSobrePrejuizoFiscalIrpj25Percent: dtaIrpj,
      dtaSobreBaseNegativaCsll9Percent: dtaCsll,
      dtaSobreDiferencasTemporarias34Percent: dtaTemp,
      totalAtivoFiscalDiferido: totalDta
    },
    passivoFiscalDiferidoDtl: {
      dtlSobreDiferencasTemporarias34Percent: totalDtl,
      totalPassivoFiscalDiferido: totalDtl
    },
    posicaoLiquidaFiscalDiferida: posLiquida,
    testeRealizabilidade10AnosAprovado: realizabilidadeOk,
    partidasDobradaDta: partidas,
    diagnosticoCpc32: diagnostico
  });
}
