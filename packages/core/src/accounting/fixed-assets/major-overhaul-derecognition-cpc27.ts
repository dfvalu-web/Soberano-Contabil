import { Result, Ok, Err } from '../../types/result.js';

export interface MajorOverhaulInput {
  equipamentoId: string;
  equipamentoNome: string; // Ex: 'Alto-Forno 02 / Turbina a Gás de Geração Elétrica'
  empresaNome: string;
  custoNovaRevisaoGeralOverhaulBrl: number;
  vidaUtilNovaRevisaoMeses: number; // Ex: 48 meses (4 anos até a próxima parada)
  saldoResidualContabilRevisaoAnteriorBrl: number; // Valor líquido remanescente da revisão passada
}

export interface MajorOverhaulResult {
  equipamentoId: string;
  equipamentoNome: string;
  custoCapitalizadoNovoImobilizadoBrl: number;
  baixaDesreconhecimentoRevisaoAnteriorBrl: number; // Baixado como perda/despesa
  novaQuotaDepreciacaoMensalBrl: number;
  lancamentosContabeis: {
    debito: string;
    credito: string;
    valor: number;
    historico: string;
  }[];
  diagnosticoCpc27: string;
}

export function processMajorOverhaulDerecognitionCpc27(input: MajorOverhaulInput): Result<MajorOverhaulResult, Error> {
  const {
    equipamentoId,
    equipamentoNome,
    empresaNome,
    custoNovaRevisaoGeralOverhaulBrl,
    vidaUtilNovaRevisaoMeses,
    saldoResidualContabilRevisaoAnteriorBrl
  } = input;

  if (custoNovaRevisaoGeralOverhaulBrl <= 0 || vidaUtilNovaRevisaoMeses <= 0) {
    return Err(new Error('Custo da nova revisão e vida útil devem ser superiores a zero.'));
  }

  // CPC 27 (IAS 16) Itens 13 e 14:
  // 1. O custo da nova revisão geral/inspeção deve ser capitalizado no valor contábil do item.
  // 2. Qualquer valor residual remanescente do custo da revisão geral anterior deve ser desreconhecido no resultado.
  const novaQuotaMensal = Number((custoNovaRevisaoGeralOverhaulBrl / vidaUtilNovaRevisaoMeses).toFixed(2));

  const lancamentos = [
    {
      debito: '1.2.3.02 - Imobilizado em Operação (Componente: Revisão Geral)',
      credito: '1.1.1.02 - Bancos Conta Movimento / Fornecedores de Manutenção',
      valor: custoNovaRevisaoGeralOverhaulBrl,
      historico: 'Capitalização dos custos de grande parada de manutenção no ' + equipamentoNome
    }
  ];

  if (saldoResidualContabilRevisaoAnteriorBrl > 0) {
    lancamentos.push({
      debito: '3.2.3.05 - Baixa e Desreconhecimento de Componente de Manutenção Anterior (DRE)',
      credito: '1.2.3.02 - Imobilizado em Operação (Componente: Revisão Geral)',
      valor: saldoResidualContabilRevisaoAnteriorBrl,
      historico: 'Desreconhecimento do saldo residual não depreciado da revisão geral anterior do ' + equipamentoNome
    });
  }

  const diag = "Parada Geral de Manutencao (CPC 27 Itens 13-14): " + equipamentoNome + " (" + empresaNome + "). Custo Nova Revisao: R$ " + custoNovaRevisaoGeralOverhaulBrl.toFixed(2) + " capitalizado no Imobilizado | Vida Util: " + vidaUtilNovaRevisaoMeses + " meses (Nova Depreciacao: R$ " + novaQuotaMensal.toFixed(2) + "/mes) | Desreconhecimento Revisao Anterior: R$ " + saldoResidualContabilRevisaoAnteriorBrl.toFixed(2) + " baixado no resultado.";

  return Ok({
    equipamentoId,
    equipamentoNome,
    custoCapitalizadoNovoImobilizadoBrl: custoNovaRevisaoGeralOverhaulBrl,
    baixaDesreconhecimentoRevisaoAnteriorBrl: saldoResidualContabilRevisaoAnteriorBrl,
    novaQuotaDepreciacaoMensalBrl: novaQuotaMensal,
    lancamentosContabeis: lancamentos,
    diagnosticoCpc27: diag
  });
}
