import { Result, Ok, Err } from '../types/result.js';

export interface SalesReturnsTaxInput {
  empresaCnpj: string;
  razaoSocial: string;
  tipoDevolucao: 'DEVOLUCAO_DE_VENDA' | 'DEVOLUCAO_DE_COMPRA';
  cfop: string; // Ex: '1.202' (Entrada de Devolução) ou '5.202' (Saída de Devolução)
  chaveNfeDevolucao: string;
  chaveNfeReferenciadaOrigem: string;
  valorMercadoriasDevolvidasBrl: number;
  aliquotaIcmsPercent: number; // Ex: 18%
  aliquotaPisCofinsPercent: number; // Ex: 9.25%
}

export interface SalesReturnsTaxResult {
  empresaCnpj: string;
  razaoSocial: string;
  cfop: string;
  chaveReferenciadaValida: boolean;
  valorCreditoIcmsRecuperavelBrl: number;
  valorCreditoPisCofinsRecuperavelBrl: number;
  totalCreditosTributariosDevolucaoBrl: number;
  registroSpedFiscal: 'REGISTRO_C113_REFERENCIADO';
  statusDevolucao: 'DEVOLUCAO_FISCAL_AUDITADA_COM_SUCESSO';
  diagnosticoDevolucao: string;
}

export function processOfficeSalesReturnsTaxCreditEngine(input: SalesReturnsTaxInput): Result<SalesReturnsTaxResult, Error> {
  const {
    empresaCnpj,
    razaoSocial,
    tipoDevolucao,
    cfop,
    chaveNfeDevolucao,
    chaveNfeReferenciadaOrigem,
    valorMercadoriasDevolvidasBrl,
    aliquotaIcmsPercent = 18.0,
    aliquotaPisCofinsPercent = 9.25
  } = input;

  if (!empresaCnpj || !cfop || !chaveNfeDevolucao || !chaveNfeReferenciadaOrigem || valorMercadoriasDevolvidasBrl <= 0) {
    return Err(new Error('CNPJ, CFOP, chaves de NF-e e valor devolvido são obrigatórios.'));
  }

  const chaveValida = chaveNfeReferenciadaOrigem.length === 44;

  const creditoIcms = (valorMercadoriasDevolvidasBrl * aliquotaIcmsPercent) / 100;
  const creditoPisCofins = (valorMercadoriasDevolvidasBrl * aliquotaPisCofinsPercent) / 100;
  const totalCreditos = creditoIcms + creditoPisCofins;

  const diag = "Devolução Fiscal (" + razaoSocial + " - CFOP " + cfop + "): Valor Devolvido: R$ " + valorMercadoriasDevolvidasBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " | Crédito ICMS (" + aliquotaIcmsPercent + "%): R$ " + creditoIcms.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " | PIS/COFINS (" + aliquotaPisCofinsPercent + "%): R$ " + creditoPisCofins.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " | SPED Registro C113 Referenciado: " + (chaveValida ? "VÁLIDO" : "INVÁLIDO") + ".";

  return Ok({
    empresaCnpj,
    razaoSocial,
    cfop,
    chaveReferenciadaValida: chaveValida,
    valorCreditoIcmsRecuperavelBrl: parseFloat(creditoIcms.toFixed(2)),
    valorCreditoPisCofinsRecuperavelBrl: parseFloat(creditoPisCofins.toFixed(2)),
    totalCreditosTributariosDevolucaoBrl: parseFloat(totalCreditos.toFixed(2)),
    registroSpedFiscal: 'REGISTRO_C113_REFERENCIADO',
    statusDevolucao: 'DEVOLUCAO_FISCAL_AUDITADA_COM_SUCESSO',
    diagnosticoDevolucao: diag
  });
}
