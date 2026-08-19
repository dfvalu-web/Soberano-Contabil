import { Result, Ok, Err } from '../types/result.js';

export interface WithholdingCompensationInput {
  empresaCnpj: string;
  perfilOperacao: 'PRESTADOR_SERVICO_ATIVO' | 'TOMADOR_SERVICO_PASSIVO';
  valorServicoBrutoBrl: number;
  valorIrrfRetidoBrl: number;
  valorCsrfRetidoBrl: number;
}

export interface WithholdingCompensationResult {
  empresaCnpj: string;
  perfilOperacao: 'PRESTADOR_SERVICO_ATIVO' | 'TOMADOR_SERVICO_PASSIVO';
  partidaDobradaLancamento: string;
  eventoEfdReinf: 'R-4020_PAGAMENTO_PJ_RETENCAO' | 'NAO_APLICAVEL_PRESTADOR';
  statusContabilizacao: 'LANCAMENTOS_RETENCOES_CONCLUIDOS';
  diagnosticoContabil: string;
}

export function processOfficeWithholdingCompensationAccountingEngine(input: WithholdingCompensationInput): Result<WithholdingCompensationResult, Error> {
  const {
    empresaCnpj,
    perfilOperacao,
    valorServicoBrutoBrl,
    valorIrrfRetidoBrl,
    valorCsrfRetidoBrl
  } = input;

  if (!empresaCnpj || valorServicoBrutoBrl <= 0) {
    return Err(new Error('CNPJ e valor bruto são obrigatórios.'));
  }

  let lancamento = '';
  let reinf: 'R-4020_PAGAMENTO_PJ_RETENCAO' | 'NAO_APLICAVEL_PRESTADOR' = 'NAO_APLICAVEL_PRESTADOR';

  if (perfilOperacao === 'PRESTADOR_SERVICO_ATIVO') {
    const liquido = valorServicoBrutoBrl - valorIrrfRetidoBrl - valorCsrfRetidoBrl;
    lancamento = "D - 1.1.02.001 Clientes (R$ " + liquido.toFixed(2) + ") | D - 1.1.03.001 IRRF a Compensar (R$ " + valorIrrfRetidoBrl.toFixed(2) + ") | D - 1.1.03.004 CSRF a Compensar (R$ " + valorCsrfRetidoBrl.toFixed(2) + ") | C - 3.1.01.001 Receita de Serviços (R$ " + valorServicoBrutoBrl.toFixed(2) + ")";
  } else {
    const liquido = valorServicoBrutoBrl - valorIrrfRetidoBrl - valorCsrfRetidoBrl;
    lancamento = "D - 4.1.02.001 Despesas com Serviços de Terceiros (R$ " + valorServicoBrutoBrl.toFixed(2) + ") | C - 2.1.02.001 Fornecedores a Pagar (R$ " + liquido.toFixed(2) + ") | C - 2.1.02.003 IRRF a Recolher (R$ " + valorIrrfRetidoBrl.toFixed(2) + ") | C - 2.1.02.004 CSRF a Recolher (R$ " + valorCsrfRetidoBrl.toFixed(2) + ")";
    reinf = 'R-4020_PAGAMENTO_PJ_RETENCAO';
  }

  const diag = "Contabilização Retenções Federais (" + perfilOperacao + "): Partidas dobradas geradas com sucesso | " + (reinf === 'R-4020_PAGAMENTO_PJ_RETENCAO' ? "EFD-Reinf Evento R-4020 pronto para envio DCTFWeb." : "Créditos prontos para compensação no IRPJ/CSLL/PIS/COFINS.");

  return Ok({
    empresaCnpj,
    perfilOperacao,
    partidaDobradaLancamento: lancamento,
    eventoEfdReinf: reinf,
    statusContabilizacao: 'LANCAMENTOS_RETENCOES_CONCLUIDOS',
    diagnosticoContabil: diag
  });
}
