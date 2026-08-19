import { Result, Ok, Err } from '../../types/result.js';

export interface PortStorageTaxInput {
  recintoAlfandegadoCnpj: string;
  receitaCapataziaMovimentacaoBrl: number; // Ex: R$ 1.000.000,00 (ISSQN 5%)
  receitaArmazenagemPuraBrl: number; // Ex: R$ 600.000,00 (ISSQN Subitem 20.01 / Não incidência ICMS)
  aliquotaIssMunicipalPercent: number; // 5.0%
}

export interface PortStorageTaxResult {
  recintoAlfandegadoCnpj: string;
  receitaTotalServicosPortuariosBrl: number; // R$ 1.600.000,00
  impostoIssqnDevidoBrl: number; // 5% de R$ 1.6M = R$ 80.000,00
  impostoIcmsDevidoBrl: number; // R$ 0,00 (Não incidência Sumula 166 STJ)
  statusTributario: 'SERVICOS_PORTUARIOS_TRIBUTADOS_EXCLUSIVAMENTE_ISSQN';
  diagnosticoTributario: string;
}

export function processPortLeaseStorageIcmsIssEngine(input: PortStorageTaxInput): Result<PortStorageTaxResult, Error> {
  const {
    recintoAlfandegadoCnpj,
    receitaCapataziaMovimentacaoBrl,
    receitaArmazenagemPuraBrl,
    aliquotaIssMunicipalPercent = 5.0
  } = input;

  if (!recintoAlfandegadoCnpj || (receitaCapataziaMovimentacaoBrl + receitaArmazenagemPuraBrl) <= 0) {
    return Err(new Error('CNPJ e receita de serviços portuários são obrigatórios.'));
  }

  const receitaTotal = receitaCapataziaMovimentacaoBrl + receitaArmazenagemPuraBrl;
  const issqn = (receitaTotal * aliquotaIssMunicipalPercent) / 100;

  const diag = "Tributacao Portuaria (LC 116/03 Subitem 20.01): Receita Capatazia/Armazenagem: R$ " + receitaTotal.toLocaleString('pt-BR') + " | ISSQN Municipal (" + aliquotaIssMunicipalPercent + "%): R$ " + issqn.toLocaleString('pt-BR') + " | ICMS Estadual: R$ 0,00 (Nao Incidencia Sumula 166 STJ) -> Blindagem Concluida.";

  return Ok({
    recintoAlfandegadoCnpj,
    receitaTotalServicosPortuariosBrl: receitaTotal,
    impostoIssqnDevidoBrl: parseFloat(issqn.toFixed(2)),
    impostoIcmsDevidoBrl: 0.00,
    statusTributario: 'SERVICOS_PORTUARIOS_TRIBUTADOS_EXCLUSIVAMENTE_ISSQN',
    diagnosticoTributario: diag
  });
}
